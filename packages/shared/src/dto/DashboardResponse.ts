export interface DashboardStats {
  totalSkillsHave: number;
  totalSkillsWant: number;
  totalActiveSwaps: number;
  totalPendingRequests: number;
  totalCompletedSwaps: number;
}

export interface PartnerInfo {
  userId: string;
  name: string;
  email: string;
  bio?: string | null;
  swapRequestId: string;
  status: string;
  skills: { skillName: string; skillType: string }[];
}

export interface DashboardResponse {
  stats: DashboardStats;
  partners: PartnerInfo[];
}
