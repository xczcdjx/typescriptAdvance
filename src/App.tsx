import {Component, FC} from "react";
import {Get2} from "./api/http.ts";
class FetchD extends Component<any, any>{
    constructor(props) {
        super(props);
        this.fetchDaTA=this.fetchDaTA.bind(this)
    }
    state={
        obj:{
            a:123
        }
    }
    @Get2('/home/recommend',(ctx:FetchD) =>ctx.state.obj)
    async fetchDaTA(res:any){
        try {
            const r=await res
            console.log(r,this)
        }catch (e) {
            console.log(e)
        }
    }
    @MethodDecoratorFactory('/123')
    fetchDaTA2(res:any){
        console.log(res)
    }
    render() {
        return <>
            <button onClick={this.fetchDaTA}>Get test</button>
            <button onClick={this.fetchDaTA2}>Get test</button>
        </>
    }
}
function MethodDecoratorFactory(prefix: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            console.log(`[${prefix}] Calling method ${propertyKey} with arguments:`, args);
            return originalMethod.apply(this, args);
        };
    };
}
const App:FC = () => {
  return <>
      <h3>fetch Data</h3>
      <FetchD/>
  </>
}

export default App
