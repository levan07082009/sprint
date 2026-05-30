export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          display_name: string;
          avatar_url: string | null;
          bio: string | null;
          trust_score: number;
          verified: boolean;
          hourly_rate: number | null;
          location: string | null;
          role: 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL';
          onboarding_complete: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          display_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          trust_score?: number;
          verified?: boolean;
          hourly_rate?: number | null;
          location?: string | null;
          role: 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL';
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          display_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          trust_score?: number;
          verified?: boolean;
          hourly_rate?: number | null;
          location?: string | null;
          role?: 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL';
          onboarding_complete?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          type: 'PHYSICAL' | 'DIGITAL' | 'TUTORING';
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'PHYSICAL' | 'DIGITAL' | 'TUTORING';
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'PHYSICAL' | 'DIGITAL' | 'TUTORING';
          slug?: string;
          created_at?: string;
        };
      };
      gigs: {
        Row: {
          id: string;
          employer_id: string;
          title: string;
          description: string;
          budget: number;
          currency: string;
          status: 'DRAFT' | 'ACTIVE' | 'PROGRESS' | 'COMPLETED' | 'CANCELLED';
          urgency: 'STANDARD' | 'ASAP';
          location: string | null;
          required_skills: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employer_id: string;
          title: string;
          description: string;
          budget: number;
          currency?: string;
          status?: 'DRAFT' | 'ACTIVE' | 'PROGRESS' | 'COMPLETED' | 'CANCELLED';
          urgency?: 'STANDARD' | 'ASAP';
          location?: string | null;
          required_skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string;
          title?: string;
          description?: string;
          budget?: number;
          currency?: string;
          status?: 'DRAFT' | 'ACTIVE' | 'PROGRESS' | 'COMPLETED' | 'CANCELLED';
          urgency?: 'STANDARD' | 'ASAP';
          location?: string | null;
          required_skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          gig_id: string;
          applicant_id: string;
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
          cover_note: string | null;
          proposed_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gig_id: string;
          applicant_id: string;
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
          cover_note?: string | null;
          proposed_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gig_id?: string;
          applicant_id?: string;
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
          cover_note?: string | null;
          proposed_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          gig_id: string | null;
          participant1_id: string;
          participant2_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gig_id?: string | null;
          participant1_id: string;
          participant2_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gig_id?: string | null;
          participant1_id?: string;
          participant2_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          read_at?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          gig_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gig_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gig_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          gig_id: string;
          payer_id: string;
          payee_id: string;
          amount: number;
          status: 'PENDING' | 'ESCROW' | 'RELEASED' | 'REFUNDED';
          payment_method: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          gig_id: string;
          payer_id: string;
          payee_id: string;
          amount: number;
          status?: 'PENDING' | 'ESCROW' | 'RELEASED' | 'REFUNDED';
          payment_method?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          gig_id?: string;
          payer_id?: string;
          payee_id?: string;
          amount?: number;
          status?: 'PENDING' | 'ESCROW' | 'RELEASED' | 'REFUNDED';
          payment_method?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          total_earnings: number;
          total_spend: number;
          gigs_completed: number;
          gigs_posted: number;
          avg_rating: number;
          response_time_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_earnings?: number;
          total_spend?: number;
          gigs_completed?: number;
          gigs_posted?: number;
          avg_rating?: number;
          response_time_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_earnings?: number;
          total_spend?: number;
          gigs_completed?: number;
          gigs_posted?: number;
          avg_rating?: number;
          response_time_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_application: {
        Args: {
          application_id: string;
          gig_id: string;
          employer_id: string;
          applicant_id: string;
        };
        Returns: string;
      };
      increment_gigs_posted: {
        Args: { user_id: string };
        Returns: undefined;
      };
      increment_gigs_completed: {
        Args: { user_id: string };
        Returns: undefined;
      };
      update_earnings: {
        Args: { user_id: string; amount: number };
        Returns: undefined;
      };
      update_user_rating: {
        Args: { user_id: string };
        Returns: undefined;
      };
      update_trust_score: {
        Args: { user_id: string };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Gig = Database['public']['Tables']['gigs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];
export type UserStats = Database['public']['Tables']['user_stats']['Row'];

// Extended types with relations
export type GigWithEmployer = Gig & {
  employer: Profile;
  applications?: { count: number }[];
};

export type ApplicationWithDetails = Application & {
  gig: GigWithEmployer;
  applicant: Profile;
};

export type ConversationWithDetails = Conversation & {
  participant1: Profile;
  participant2: Profile;
  gig: Gig | null;
  messages?: Message[];
};

export type MessageWithSender = Message & {
  sender: Profile;
};

export type WalletInfo = {
  balance: number;
  spent: number;
  earned: number;
  in_escrow: number;
};
