import { useAuth, useUser } from '@clerk/nextjs';

interface ApiCallOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export function useApiClient() {
  const { userId } = useAuth();
  const { user } = useUser();

  const call = async (endpoint: string, options: ApiCallOptions = {}) => {
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`/api${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API call failed');
    }

    return response.json();
  };

  return { call, userId, user };
}

// Specialized API hooks
export function useProfileApi() {
  const { call } = useApiClient();

  return {
    get: () => call('/profiles'),
    create: (data: any) => call('/profiles', { method: 'POST', body: data }),
    update: (data: any) => call('/profiles', { method: 'PATCH', body: data }),
  };
}

export function useGigsApi() {
  const { call } = useApiClient();

  return {
    getAll: (params?: { status?: string; employer_only?: boolean; limit?: number; offset?: number }) => {
      const query = params ? new URLSearchParams(params as any).toString() : '';
      return call(`/gigs${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => call(`/gigs/${id}`),
    create: (data: any) => call('/gigs', { method: 'POST', body: data }),
    update: (id: string, data: any) => call(`/gigs/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) => call(`/gigs/${id}`, { method: 'DELETE' }),
  };
}

export function useApplicationsApi() {
  const { call } = useApiClient();

  return {
    getMine: (status?: string) => {
      const query = status ? `?as_applicant=true&status=${status}` : '?as_applicant=true';
      return call(`/applications${query}`);
    },
    getForGig: (gigId: string) => call(`/gigs/${gigId}`),
    apply: (data: any) => call('/applications', { method: 'POST', body: data }),
    update: (id: string, data: any) => call(`/applications/${id}`, { method: 'PATCH', body: data }),
  };
}

export function useConversationsApi() {
  const { call } = useApiClient();

  return {
    getAll: () => call('/conversations'),
    getById: (id: string) => call(`/conversations/${id}`),
    create: (data: any) => call('/conversations', { method: 'POST', body: data }),
  };
}

export function useMessagesApi() {
  const { call } = useApiClient();

  return {
    send: (data: any) => call('/messages', { method: 'POST', body: data }),
  };
}

export function useTransactionsApi() {
  const { call } = useApiClient();

  return {
    getAll: () => call('/transactions'),
    create: (data: any) => call('/transactions', { method: 'POST', body: data }),
    release: (id: string) => call(`/transactions/${id}`, { method: 'PATCH', body: { status: 'RELEASED' } }),
    refund: (id: string) => call(`/transactions/${id}`, { method: 'PATCH', body: { status: 'REFUNDED' } }),
  };
}

export function useReviewsApi() {
  const { call } = useApiClient();

  return {
    getForUser: (userId: string) => call(`/reviews?user_id=${userId}`),
    getForGig: (gigId: string) => call(`/reviews?gig_id=${gigId}`),
    create: (data: any) => call('/reviews', { method: 'POST', body: data }),
  };
}
