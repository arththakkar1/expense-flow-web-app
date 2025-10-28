import type { LucideIcon } from "lucide-react";

// Type for the user's profile data
export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

// Type for the user's statistics
export interface UserStats {
  totalTransactions: number;
  budgetsCreated: number;
  moneySaved: number;
}

// Type definition for the stat cards displayed on the profile page
export interface StatCardData {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}
