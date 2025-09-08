export interface UserProfile {
  id: string;
  name: string;
  description: string;
  originProfile: string;
  isForMultiCompanies?: boolean | null;
  isForClients?: boolean | null;
  isForMaintenance?: boolean | null;
  role?: number | null;
}
