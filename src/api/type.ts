import {AxiosRequestConfig, type AxiosResponse} from "axios";
export interface LHRequestInterceptors {
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    requestInterceptorCatch?: (error: any) => any
    responseInterceptor?: (res: any) => any
    responseInterceptorCatch?: (error: any) => any
}
export interface LHRequestConfig extends AxiosRequestConfig {
    interceptors?: LHRequestInterceptors
    showLoading?: boolean
}
export interface HttpOption {
    url: string
    data?: any
    method?: string
    headers?: any
    beforeRequest?: () => void
    afterRequest?: () => void
}
export interface MergeAxiosResponse<T=any,U=any> extends AxiosResponse<T,U>{
    code:number
}
export interface Response<T = any> {
    count: number | 0
    code: number
    msg: string
    data: T
}
