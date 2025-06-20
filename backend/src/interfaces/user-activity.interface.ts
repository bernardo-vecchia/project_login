export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  timestamp: Date;
  description: string;
}

export interface UserStats {
  daysActive: number;
  profileUpdates: number;
  securityScore: number;
  lastLogin: Date | null;
}
