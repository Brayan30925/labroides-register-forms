export interface Company {
  nit: string
  realNit: string
  name: string
  dianResolution: string
  resolutionDate: Date;
  initialBilling: string | undefined;
  finalBilling: string | undefined;
  prefix: string | undefined;
  companyLogo: string
  regimeType: string
  resolutionText: string
  accountText: string
  email: string
  workers: number | undefined;
  rooms: number | undefined;
}
