export type MemberRole = 'organizer' | 'treasurer' | 'planner' | 'member';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  major: string;
  role: MemberRole;
  roleLabel: string;
  budgetMin: number;
  budgetMax: number;
  availableDates: string[]; // '2026-06-21', etc.
  hasPaidDeposit: boolean;
  depositAmount: number;
  note?: string;
}

export interface DestinationCandidate {
  id: string;
  name: string;
  tagline: string;
  estimatedBudget: number;
  bestDays: number;
  votes: string[]; // member IDs who voted for this
  highlight: string;
}

export type WishlistCategory = 'sightseeing' | 'food' | 'activity' | 'stay' | 'transport';

export interface WishlistItem {
  id: string;
  title: string;
  category: WishlistCategory;
  categoryLabel: string;
  locationName: string;
  estimatedCost: number;
  suggestedDuration: string;
  addedByMemberId: string;
  votes: string[]; // member IDs
  reason: string;
  scheduledDay?: number; // if scheduled into a day
}

export type ActivityType = 'flight' | 'train' | 'car' | 'spot' | 'meal' | 'hotel' | 'leisure';

export interface TimelineActivity {
  id: string;
  time: string; // '09:30'
  title: string;
  type: ActivityType;
  location: string;
  costPerPerson: number;
  duration: string;
  note: string;
  essentialTip?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr: string;
  weekday: string;
  theme: string;
  pacingSummary: string;
  activities: TimelineActivity[];
}

export type ExpenseCategory = 'transport' | 'hotel' | 'food' | 'ticket' | 'leisure' | 'other';

export interface ExpenseRecord {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  payerId: string; // member ID or 'POOL'
  isPoolFund: boolean;
  splitMemberIds: string[]; // list of member IDs who share this
  date: string;
  receiptNote?: string;
}

export interface DebtSettlement {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

export interface TripMetadata {
  id: string;
  title: string;
  inviteCode: string;
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  overallTargetBudget: number;
  poolDepositPerPerson: number;
  status: 'voting' | 'planning' | 'booked' | 'completed';
  motto: string;
}
