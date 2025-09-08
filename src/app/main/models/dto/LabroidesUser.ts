export interface LabroidesUser {
  id: number;
  parentId?: number;
  operationCenterId?: string;
  unitDealId?: string;
  costCenterId?: string;
  companyId?: string;
  statusId: string;
  nit: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  password?: string;
}