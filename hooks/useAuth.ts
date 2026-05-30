"use client";

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';

export interface Profile {
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
}

export function useProfile() {
  const { userId, isLoaded } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchProfile();
    } else if (isLoaded && !userId) {
      setLoading(false);
    }
  }, [userId, isLoaded]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profiles', {
        headers: {
          'x-user-id': userId!
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (data: Partial<Profile>) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify({
          display_name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
          avatar_url: user?.imageUrl,
          ...data
        })
      });

      if (response.ok) {
        const profile = await response.json();
        setProfile(profile);
        return profile;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const response = await fetch('/api/profiles', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const profile = await response.json();
        setProfile(profile);
        return profile;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const syncUserRole = async (role: 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL') => {
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId!
        },
        body: JSON.stringify({ role, onboarding_complete: true })
      });

      if (response.ok) {
        const profile = await response.json();
        setProfile(profile);
        return profile;
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error('Failed to sync user role:', error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    syncUserRole,
    refetch: fetchProfile
  };
}

export function useRealtimeMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase.channel(`chat_${conversationId}`);

    channel
      .on('broadcast', { event: 'new_message' }, (payload) => {
        setMessages(prev => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  return { messages, setMessages };
}
