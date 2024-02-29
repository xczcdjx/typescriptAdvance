import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
/*interface AxiosInter {

}*/
interface httpConfig {
    baseurl:string
    timeout?:number
    withCredentials?:boolean
}
class RequestBase {
    instance:AxiosInstance
    requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
    responseInterceptor?: (res: AxiosResponse) => AxiosResponse
    constructor(config:httpConfig) {
        this.instance=axios.create({
            baseURL:config.baseurl,
            timeout:config.timeout??10*1000,
            withCredentials:config.withCredentials??false
        })
        // this.instance.interceptors.request.use(this?.requestInterceptor)
        // this.instance.interceptors.response.use(this?.responseInterceptor)
        this.instance.interceptors.request.use(config=>{
            // token拦截
            return config
        },
            error => {
            return Promise.reject(error.response)
            })
        this.instance.interceptors.response.use(response=>{
            if (response.status === 200) {
                return response.data
            } else {
                throw new Error(response.status.toString())
            }
        },error => {
            if (import.meta.env.MODE === 'development') {
                console.log(error)
            }
            return Promise.reject({ code: 500, msg: '服务器异常，请稍后重试…' })
        })
    }
}
export default new RequestBase({
    baseurl:'https://netease.store'
})
