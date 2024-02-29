import type {HttpOption, Response} from "./type";
import request from './request'
import type {AxiosResponse} from "axios";
interface HttpType {
    http({url}:HttpOption):Promise<Response>
}
/*function GeneReq(type:string) {
    return ()=>{

    }
}*/
class HttpEx implements HttpType{
    http<T=any>({url, data, method, headers, beforeRequest, afterRequest}:HttpOption){
        const successHandler = (res: AxiosResponse<Response<T>>) => {
            if ((res as any).code === 200) {
                return res.data
            }
            throw new Error(res.data.msg || '请求失败，未知异常')
        }
        const failHandler = (error: Response<Error>) => {
            afterRequest && afterRequest()
            throw new Error(error.msg || '请求失败，未知异常')
        }
        beforeRequest && beforeRequest()
        method = method || 'GET'
        // @ts-ignore
        const params = Object.assign(typeof data === 'function' ? data() : data || {}, {})
        return method === 'GET'
            ? request.instance.get(url, {params}).then(successHandler, failHandler)
            : method === 'POST' ? request.instance.post(url, params, {headers: headers}).then(successHandler, failHandler)
                : method === 'PUT' ? request.instance.put(url, params, {headers: headers}).then(successHandler, failHandler)
                    : method === 'PATCH' ? request.instance.patch(url, params, {headers: headers}).then(successHandler, failHandler) :
                        request.instance.delete(url, {params}).then(successHandler, failHandler)
    }
    get<T = any>({
                                     url,
                                     data,
                                     method = 'GET',
                                     beforeRequest,
                                     afterRequest,
        headers,
                                 }: HttpOption): Promise<Response<T>> {
        return this.http<T>({
            url,
            method,
            data,
            beforeRequest,
            afterRequest,
            headers,
        })
    }
    post<T = any>({
                      url,
                      data,
                      method = 'POST',
                      headers,
                      beforeRequest,
                      afterRequest,
                  }: HttpOption): Promise<Response<T>> {
        return this.http<T>({
            url,
            method,
            data,
            headers,
            beforeRequest,
            afterRequest,
        })}
    put<T = any>({
                     url,
                     data,
                     method = 'PUT',
                     headers,
                     beforeRequest,
                     afterRequest,
                 }: HttpOption): Promise<Response<T>> {
        return this.http<T>({
            url,
            method,
            data,
            headers,
            beforeRequest,
            afterRequest,
        })
    }
    patch<T = any>({
                       url,
                       data,
                       method = 'PATCH',
                       headers,
                       beforeRequest,
                       afterRequest,
                   }: HttpOption): Promise<Response<T>> {
        return this.http<T>({
            url,
            method,
            data,
            headers,
            beforeRequest,
            afterRequest,
        })
    }
    deleteT<T = any>({
                                  url,
                                  data,
                                  method = 'DELETE',
                         headers,
                                  beforeRequest,
                                  afterRequest,
                              }: HttpOption): Promise<Response<T>> {
        return this.http<T>({
            url,
            method,
            data,
            headers,
            beforeRequest,
            afterRequest,
        })
    }
}
const httpE=new HttpEx()
export default httpE

export function Get(url: string, data?: Function) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            // 在这里，`this`正确地指向类的实例
            const context = this;
            console.log(this)
            // 在调用原始方法之前，动态获取数据
            const dynamicData = data ? data.call(this) : undefined;
            console.log(dynamicData)
            return new Promise((resolve, reject) => {
                httpE.get({ url, data: dynamicData }).then(response => {
                    resolve(originalMethod.apply(context, [response, ...args]));
                }).catch(error => {
                    reject(error);
                });
            });
        };
    };
}
export function Get2<T=any>(url: string, data?: (str:T)=>object) {
    // @ts-ignore
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            // console.log(target,propertyKey)
            // Capture the context (`this`) to use inside the promise
            const context = this;
            // const dynamicData = data ? data.call(this) : undefined;
            // Return a new promise to handle async operations
            return new Promise((resolve, reject) => {
                httpE.get({ url, data:data!(context as T) }).then(response => {
                    // Call the original method with the response and resolve the promise
                    resolve(originalMethod.apply(context, [Promise.resolve(response), ...args]));
                }).catch(error => {
                    // Optionally, handle errors differently or just reject the promise
                    reject(originalMethod.apply(context, [Promise.reject(error), ...args]));
                });
            });
        };
    };
}
/*export const Get = (url:string,data?:any) => {
  return (originFun:Function,ctx:ClassMethodDecoratorContext)=>{
      originFun=function (...args:any[]) {
          return new Promise((resolve, reject)=>{
              httpE.get({
                  url,
                  data,
              }).then(response=>{
                  console.log(response)
                  resolve(originFun.apply(ctx,[response,...args]))
              }).catch(error=>{
                  reject(originFun.apply(ctx,[error,...args]))
              })
          })
      }
  }
}*/
