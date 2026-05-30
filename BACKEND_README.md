# Sprint Backend Implementation

Complete backend implementation for the Sprint micro-gig marketplace platform using Supabase.

## Database Schema

### Core Tables

1. **profiles** - User profiles with trust scores and verification
2. **skills** - Available skills/categories for gigs
3. **gigs** - Job postings from employers
4. **applications** - Student applications to gigs
5. **conversations** - Conversation threads
6. **messages** - Chat messages
7. **reviews** - Post-gig reviews
8. **transactions** - Payment records
9. **user_stats** - Aggregated user statistics

### Security

Row Level Security (RLS) is enabled on all tables with restrictive policies:
- Users can only access their own data
- Students can view active gigs
- Employers manage their own gigs
- Messages are private to conversation participants

## API Routes

### Authentication
- `POST /api/auth/sync-user` - Sync Clerk user with Supabase profile

### Profiles
- `GET /api/profiles` - Get current user's profile
- `POST /api/profiles` - Create profile
- `PATCH /api/profiles` - Update profile

### Gigs
- `GET /api/gigs` - List gigs (filtered by status/employer)
- `POST /api/gigs` - Create a gig
- `GET /api/gigs/[id]` - Get gig details
- `PATCH /api/gigs/[id]` - Update gig
- `DELETE /api/gigs/[id]` - Delete gig

### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Apply to a gig
- `PATCH /api/applications/[id]` - Accept/reject/withdraw application

### Conversations & Messages
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Start conversation
- `GET /api/conversations/[id]` - Get conversation with messages
- `POST /api/messages` - Send message

### Transactions
- `GET /api/transactions` - List user's transactions and wallet balance
- `POST /api/transactions` - Create transaction
- `PATCH /api/transactions/[id]` - Release/refund escrow

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review

## Database Functions

### Business Logic Functions
- `accept_application()` - Accept application, create conversation, update gig
- `increment_gigs_posted()` - Update user stats
- `increment_gigs_completed()` - Update completed gig count
- `update_earnings()` - Update user's earnings
- `update_user_rating()` - Calculate average rating
- `update_trust_score()` - Calculate trust score based on metrics

### Triggers
- Auto-update timestamps on UPDATE
- Auto-create user_stats on profile creation
- Auto-update trust score on new review

## Realtime Features

Real-time messaging is implemented using Supabase Realtime:
- Messages are broadcast to conversation channels
- Client subscribes to `chat_[conversation_id]` channel
- New messages appear instantly without polling

## TypeScript Types

Database types are defined in `types/database.ts`:
- Complete type definitions for all tables
- Row, Insert, and Update types for each table
- Extended types with relations
- Function signatures matching database functions

## Usage Examples

### Creating a Profile

```typescript
import { useProfile } from '@/hooks/useAuth';

function OnboardingComponent() {
  const { createProfile, syncUserRole } = useProfile();

  const handleRoleSelection = async (role: 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL') => {
    await syncUserRole(role);
  };
}
```

### Fetching Gigs

```typescript
import { getRecommendedGigs } from '@/app/actions/gigs';

// In a Server Component
const gigs = await getRecommendedGigs();
```

### Sending a Message

```typescript
import { useMessagesApi } from '@/lib/api-client';

const { send } = useMessagesApi();

await send({
  conversation_id: 'conv-id',
  content: 'Hello!'
});
```

### Real-time Chat

```typescript
import { useRealtimeMessages } from '@/hooks/useAuth';

const { messages, setMessages } = useRealtimeMessages(conversationId);
```

## Environment Variables

Required Supabase environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for server operations)

## Migration History

1. `001_core_schema` - Creates all tables, indexes, and RLS policies
2. `002_database_functions` - Creates stored procedures and triggers

## Key Features

- **Authentication**: Integrated with Clerk for auth, synced with Supabase
- **Authorization**: RLS ensures data access control at database level
- **Real-time**: Supabase Realtime for instant messaging
- **Type Safety**: Full TypeScript types for database schema
- **Validation**: Zod schemas for API input validation
- **Trust System**: Automated trust score calculation
- **Wallet System**: Transaction tracking with escrow support
- **Reviews**: Two-way review system after gig completion
