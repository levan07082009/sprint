/*
  # Core Schema for Sprint Marketplace

  1. New Tables
    - `profiles` - User profiles with trust scores and verification
    - `skills` - Available skills/categories for gigs
    - `gigs` - Job postings from employers
    - `applications` - Student applications to gigs
    - `messages` - Chat messages between users
    - `conversations` - Conversation threads
    - `reviews` - Reviews after gig completion
    - `transactions` - Payment records
    - `user_stats` - Aggregated user statistics

  2. Security
    - Enable RLS on all tables
    - Policies ensure users can only access their own data
    - Students can view active gigs
    - Employers manage their own gigs

  3. Important Notes
    - Uses auth.uid() for RLS policies
    - Cascading deletes for referential integrity
    - Indexes on frequently queried columns
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  trust_score INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10, 2),
  location TEXT,
  role TEXT NOT NULL CHECK (role IN ('STUDENT', 'BUSINESS', 'INDIVIDUAL')),
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('PHYSICAL', 'DIGITAL', 'TUTORING')),
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gigs table
CREATE TABLE IF NOT EXISTS gigs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'PROGRESS', 'COMPLETED', 'CANCELLED')),
  urgency TEXT DEFAULT 'STANDARD' CHECK (urgency IN ('STANDARD', 'ASAP')),
  location TEXT,
  required_skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  cover_note TEXT,
  proposed_rate DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(gig_id, applicant_id)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE,
  participant1_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  participant2_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(participant1_id, participant2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gig_id UUID REFERENCES gigs(id) ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  payee_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ESCROW', 'RELEASED', 'REFUNDED')),
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Stats table (for caching)
CREATE TABLE IF NOT EXISTS user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  total_spend DECIMAL(10, 2) DEFAULT 0,
  gigs_completed INTEGER DEFAULT 0,
  gigs_posted INTEGER DEFAULT 0,
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  response_time_hours DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gigs_employer ON gigs(employer_id);
CREATE INDEX IF NOT EXISTS idx_gigs_status ON gigs(status);
CREATE INDEX IF NOT EXISTS idx_applications_gig ON applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for skills (public read)
CREATE POLICY "Skills are viewable by all"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for gigs
CREATE POLICY "Active gigs are viewable by all"
  ON gigs FOR SELECT
  TO authenticated
  USING (status = 'ACTIVE' OR employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can create gigs"
  ON gigs FOR INSERT
  TO authenticated
  WITH CHECK (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can update own gigs"
  ON gigs FOR UPDATE
  TO authenticated
  USING (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Employers can delete own gigs"
  ON gigs FOR DELETE
  TO authenticated
  USING (employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for applications
CREATE POLICY "Students can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR 
         gig_id IN (SELECT id FROM gigs WHERE employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Students can create applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Students can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
         gig_id IN (SELECT id FROM gigs WHERE employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
  WITH CHECK (applicant_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
         gig_id IN (SELECT id FROM gigs WHERE employer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

-- RLS Policies for conversations
CREATE POLICY "Users can view their conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (participant1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
         participant2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (participant1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
              participant2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (conversation_id IN (SELECT id FROM conversations WHERE 
         participant1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
         participant2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) AND
              conversation_id IN (SELECT id FROM conversations WHERE 
              participant1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
              participant2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

-- RLS Policies for reviews
CREATE POLICY "Reviews are viewable by all"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for their gigs"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (reviewer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for transactions
CREATE POLICY "Users can view their transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (payer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
         payee_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (payer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR
              payee_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
  WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
