export interface RegisterUserRequest {
  basicData: UserBasicData
  otherApps: OtherAppsData,
  applicationData: ApplicationData
  selectedCompanies: string[]
  selectedOperationCenters: string[]
  selectedPurchasingGroups: string[]
  selectedCostCenters: string[]
  selectedStores: string[]
  isTechnician: boolean
  isComercialAssessor: boolean
}

export interface UserBasicData {
  docId: string
  name: string
  lastName: string
  email: string
  phoneNumber: string
  company: string
  operationCenter: string
  unitDeal: string
  costCenter: string
  position: string
  previousUser: string
  profile: string
}

interface OtherAppsData {
  integrator: boolean
  innovation: boolean
  supplyChain: boolean
  crm: boolean
  electronicInvoicesIssuance: boolean
  electronicInvoicesReception: boolean
  supportDocsAccess: boolean
}

interface ApplicationData {
  email: string
  name: string
  observations: string
}