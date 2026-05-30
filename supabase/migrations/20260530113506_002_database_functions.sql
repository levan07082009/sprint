/*
  # Database Functions and Triggers

  1. Functions
    - accept_application: Accept an application and create conversation
    - increment_gigs_posted: Increment user's gig count
    - increment_gigs_completed: Increment user's completed gigs
    - update_earnings: Update user's earnings
    - update_user_rating: Update user's average rating
    - update_trust_score: Update user's trust score

  2. Triggers
    - Auto-update timestamps on table updates
    - Auto-create user stats on profile creation
*/

-- Function to accept an application
CREATE OR REPLACE FUNCTION accept_application(
  application_id UUID,
  gig_id UUID,
  employer_id UUID,
  applicant_id UUID
)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Update application status
  UPDATE applications
  SET status = 'ACCEPTED', updated_at = NOW()
  WHERE id = application_id;

  -- Reject other applications
  UPDATE applications
  SET status = 'REJECTED', updated_at = NOW()
  WHERE gig_id = accept_application.gig_id
    AND id != application_id
    AND status = 'PENDING';

  -- Update gig status
  UPDATE gigs
  SET status = 'PROGRESS', updated_at = NOW()
  WHERE id = gig_id;

  -- Create conversation
  INSERT INTO conversations (participant1_id, participant2_id, gig_id)
  VALUES (
    LEAST(employer_id, applicant_id),
    GREATEST(employer_id, applicant_id),
    gig_id
  )
  ON CONFLICT (participant1_id, participant2_id) DO NOTHING
  RETURNING id INTO conversation_id;

  IF conversation_id IS NULL THEN
    SELECT id INTO conversation_id
    FROM conversations
    WHERE participant1_id = LEAST(employer_id, applicant_id)
      AND participant2_id = GREATEST(employer_id, applicant_id);
  END IF;

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment gigs posted
CREATE OR REPLACE FUNCTION increment_gigs_posted(user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_stats (user_id, gigs_posted)
  VALUES (increment_gigs_posted.user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET gigs_posted = user_stats.gigs_posted + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to increment gigs completed
CREATE OR REPLACE FUNCTION increment_gigs_completed(user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_stats (user_id, gigs_completed)
  VALUES (increment_gigs_completed.user_id, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET gigs_completed = user_stats.gigs_completed + 1, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update earnings
CREATE OR REPLACE FUNCTION update_earnings(user_id UUID, amount DECIMAL)
RETURNS void AS $$
BEGIN
  INSERT INTO user_stats (user_id, total_earnings)
  VALUES (update_earnings.user_id, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET total_earnings = user_stats.total_earnings + amount, updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating(user_id UUID)
RETURNS void AS $$
DECLARE
  avg_rating DECIMAL;
  review_count INTEGER;
BEGIN
  SELECT AVG(rating), COUNT(*)
  INTO avg_rating, review_count
  FROM reviews
  WHERE reviewee_id = update_user_rating.user_id;

  UPDATE user_stats
  SET avg_rating = COALESCE(avg_rating, 0),
      updated_at = NOW()
  WHERE user_id = update_user_rating.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update trust score
CREATE OR REPLACE FUNCTION update_trust_score(user_id UUID)
RETURNS void AS $$
DECLARE
  score INTEGER := 0;
  profile_record RECORD;
BEGIN
  SELECT * INTO profile_record FROM profiles WHERE id = user_id;

  -- Base score
  score := score + 20;

  -- Verification bonus
  IF profile_record.verified THEN
    score := score + 20;
  END IF;

  -- Rating bonus
  IF EXISTS (SELECT 1 FROM user_stats WHERE user_id = user_id) THEN
    DECLARE
      us RECORD;
    BEGIN
      SELECT * INTO us FROM user_stats WHERE user_id = user_id;

      IF us.avg_rating >= 4.5 THEN
        score := score + 30;
      ELSIF us.avg_rating >= 4.0 THEN
        score := score + 20;
      ELSIF us.avg_rating >= 3.5 THEN
        score := score + 10;
      END IF;

      -- Completion bonus
      IF us.gigs_completed >= 20 THEN
        score := score + 20;
      ELSIF us.gigs_completed >= 10 THEN
        score := score + 10;
      ELSIF us.gigs_completed >= 5 THEN
        score := score + 5;
      END IF;
    END;
  END IF;

  -- Cap at 100
  score := LEAST(score, 100);

  UPDATE profiles
  SET trust_score = score, updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gigs_updated_at
  BEFORE UPDATE ON gigs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create user stats
CREATE OR REPLACE FUNCTION create_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_stats_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_stats();

-- Trigger to update trust score on review
CREATE OR REPLACE FUNCTION update_trust_on_review()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_trust_score(NEW.reviewee_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_trust_on_review_trigger
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_trust_on_review();
