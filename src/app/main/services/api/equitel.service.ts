import {inject, Injectable} from "@angular/core"
import {DataResponse} from "../../models/responses/DataResponse"
import {Company} from "../../models/dto/Company"
import {map, Observable, of} from "rxjs"
import {HttpClient, HttpParams} from "@angular/common/http"
import {environment} from "../../../../environments/environment"
import {OperationCenter} from '../../models/dto/OperationCenter'
import {CostCenter} from "../../models/dto/CostCenter"
import {UnitDeal} from "../../models/dto/UnitDeal"
import {LabroidesUser} from "../../models/dto/LabroidesUser"
import {Store} from "../../models/dto/Store"
import {PurchasingGroup} from "../../models/dto/PurchasingGroup"
import {RegisterUserRequest} from "../../models/request/RegisterUserRequest"
import {UserProfile} from "../../models/dto/UserProfile"
import {UserExistenceValidationResult} from "../../models/dto/UserExistenceValidationResult"
import {EmptyResponse} from '../../models/responses/EmptyResponse'

@Injectable({providedIn: "root"})
export class EquitelService {
    private httpClient: HttpClient = inject(HttpClient)
    getResponseData = <T>(r: DataResponse<T>) => r.data

    getResponseMapFn = map(this.getResponseData)

    public getAllCompanies(): Observable<Company[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/companies`
        return this.httpClient.get<DataResponse<Company[]>>(url).pipe(this.getResponseMapFn)
    }

    public getAllPurchasingGroups(): Observable<PurchasingGroup[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/purchasing-groups`
        return this.httpClient.get<DataResponse<PurchasingGroup[]>>(url).pipe(this.getResponseMapFn)
    }

    public getAllOperationCenters(): Observable<OperationCenter[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/operation-centers`
        return this.httpClient.get<DataResponse<OperationCenter[]>>(url).pipe(this.getResponseMapFn)
    }

    public getAllCostCenters(): Observable<CostCenter[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/cost-centers`
        return this.httpClient.get<DataResponse<CostCenter[]>>(url).pipe(this.getResponseMapFn)
    }

    public getCostCentersByUnitDeal(unitDeal: string): Observable<CostCenter[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/cost-centers/unit-deal/${unitDeal}`
        return this.httpClient.get<DataResponse<CostCenter[]>>(url).pipe(this.getResponseMapFn)
    }

    public getAllUnitDeals(): Observable<UnitDeal[]> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/unit-deals`
        return this.httpClient.get<DataResponse<UnitDeal[]>>(url).pipe(this.getResponseMapFn)
    }

    public getUsersByName(name: string): Observable<LabroidesUser[]> {
        if (name.length < 3) return of([])
        const url: string = `${environment.equitelApiUrl}/api/labroides/users/name/${name}`
        return this.httpClient.get<DataResponse<LabroidesUser[]>>(url).pipe(this.getResponseMapFn)
    }

    public getStoresForRegistration(companies: string[], operationCenters: string[]): Observable<Store[]> {
        const params = new HttpParams().appendAll({"companies": companies.join(","), "operation-centers": operationCenters.join(",")})
        const url: string = `${environment.equitelApiUrl}/api/labroides/stores/registration`
        return this.httpClient.get<DataResponse<Store[]>>(url, {params}).pipe(this.getResponseMapFn)
    }

    public getProfileByUser(userId: number): Observable<UserProfile> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/users/profiles/${userId}`
        return this.httpClient.get<DataResponse<UserProfile>>(url).pipe(this.getResponseMapFn)
    }

    public createUser(request: RegisterUserRequest): Observable<EmptyResponse> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/users`
        return this.httpClient.post<EmptyResponse>(url, request)
    }

    public validateUserExistenceByEmail(email: string): Observable<UserExistenceValidationResult> {
        const url: string = `${environment.equitelApiUrl}/api/labroides/users/exists/email/${email}`
        return this.httpClient.get<DataResponse<UserExistenceValidationResult>>(url).pipe(this.getResponseMapFn)
    }
}
