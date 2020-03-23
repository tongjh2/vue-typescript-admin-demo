import { VuexModule, getModule, Action, Mutation, Module } from "vuex-module-decorators";
import { rabcRoleList } from '@/api/rabc_role';
import store from '@/store'

export interface RabcRoleState{
    list:any[]
}

@Module({ dynamic: true, store, name: 'rabcRole' })
class RabcRole extends VuexModule implements RabcRoleState {

    public list:any[] = []

    @Mutation
    private SET_RABC_ROLE_LIST(payload:any[]) {
        this.list = payload
    }

    @Action
    public async GetRabcRoleList(params:any){
        const res = await rabcRoleList(params)
        this.SET_RABC_ROLE_LIST(res.data.data||[])
    }


}

export const RabcRoleModule = getModule(RabcRole)