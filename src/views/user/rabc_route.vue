<template>
<div class="app-container">
    <div class="filter-container" style="text-align:right">     
        <el-button v-waves class="filter-item" style="margin-left:0" type="primary" icon="el-icon-edit" @click="add">添加</el-button>
    </div>



    <table class="table" v-loading="tableLoading">
        <thead>
            <tr>
                <th width="80">ID</th>
                <th width="150">名称</th>
                <th>路由</th>
                <th>菜单</th>
                <th width="80">数据</th>
                <th width="80">排序</th>
                <th style="width:200px;">操作</th>
            </tr>
        </thead>
        <tbody>
            <template v-for="v in lists['0']">
                <tr>
                    <td width="80">
                        <div @click="open(v.id)" style="cursor:pointer;">
                            <i :class="!opens[v.id]?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
                            {{v.id}}
                        </div>
                    </td>
                    <td width="150">{{v.name}}</td>
                    <td>{{v.content1}}</td>
                    <td>{{v.content2}}</td>
                    <td width="80">{{v.content3}}</td>
                    <td width="80">{{v.sort}}</td>
                    <td style="text-align:center;">
                        <Button @click="edit(v)" v-if="checkRole('rabc_route.update')" size="small" style="font-size:12px;margin-right:5px;">编辑</Button>
                        <Button @click="add(v.id)" v-if="checkRole('rabc_route.add')" size="small" style="font-size:12px;">添加子集</Button>
                        <Button @click="del(v.id)" v-if="checkRole('rabc_route.delete')" size="small" style="font-size:12px;">删除</Button>
                    </td>
                </tr>
                <template v-if="opens[v.id] && lists[v.id]">
                    <tr>
                        <td colspan="7">
                            <table class="table">
                                <tbody>
                                    <template v-for="item in lists[v.id]">
                                        <tr>
                                            <td width="80">
                                                <div @click="open(item.id)" style="cursor:pointer;">
                                                    <i :class="!opens[item.id]?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
                                                    {{item.id}}
                                                </div>
                                            </td>
                                            <td width="150">{{item.name}}</td>
                                            <td>{{item.content1}}</td>
                                            <td>{{item.content2}}</td>
                                            <td width="80">{{item.content3}}</td>
                                            <td width="80">{{item.sort}}</td>
                                            <td style="text-align:center;width:200px;">
                                                <Button @click="edit(item)" v-if="checkRole('rabc_route.update')" size="small" style="font-size:12px;margin-right:5px;">编辑</Button>
                                                <Button @click="add(item.id)" v-if="checkRole('rabc_route.add')" size="small" style="font-size:12px;margin-right:5px;">添加子集</Button>
                                                <Button @click="del(item.id)" v-if="checkRole('rabc_route.delete')" size="small" style="font-size:12px;">删除</Button>
                                            </td>
                                        </tr>

                                        <template v-if="opens[item.id] && lists[item.id]">
                                            <tr>
                                                <td colspan="7">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr v-for="item2 in lists[item.id]" :key="item2.id">
                                                                <td width="80">{{item2.id}}</td>
                                                                <td width="150">{{item2.name}}</td>
                                                                <td>{{item2.content1}}</td>
                                                                <td>{{item2.content2}}</td>
                                                                <td>{{item2.content3}}</td>
                                                                <td width="60">{{item2.sort}}</td>
                                                                <td style="text-align:center;width:160px;">
                                                                    <Button @click="edit(item2)" v-if="checkRole('rabc_route.update')" size="small" style="font-size:12px;margin-right:5px;">编辑</Button>
                                                                    <Button @click="del(item2.id)" v-if="checkRole('rabc_route.delete')" size="small" style="font-size:12px;">删除</Button>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </template>

                                    </template>

                                </tbody>
                            </table>
                        </td>
                    </tr>
                </template>
            </template>
        </tbody>
    </table>

    <el-dialog title="编辑" :visible.sync="isAdd" width="560px">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;"> 
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="路由" prop="content1">
                <el-input v-model="form.content1" />
            </el-form-item>
            <el-form-item label="菜单" prop="content2">
                <el-input v-model="form.content2" />
            </el-form-item>
            <el-form-item label="数据" prop="content3">
                <el-input v-model="form.content3" />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { rabcRouteList,rabcRouteAdd,rabcRouteDelete,rabcRouteFormData } from '@/api/rabc_route'
import { checkRole } from '@/utils/check_role'

@Component({
    name: 'rabc_route'
})
export default class extends Vue {    
    private lists:any = {'0':[]}
    private opens:any = {}
    private tableLoading = true
    private params = {
        page: 1,
        page_size:10
    }

    private isAdd = false
    private form = rabcRouteFormData
    private rules = {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
    }

    created() {
        this.getList(true)
    }

    //列表
    private async getList(isRefresh:boolean) {
        this.lists = {'0':[]};
        this.tableLoading = true
        const { data } = await rabcRouteList({page_size:10000})
        let list = (data.data||[])
        list.forEach((v:any)=>{
            if(!this.lists[v.pid]){
                this.lists[v.pid] = [];                        
            }
            this.lists[v.pid].push(v);
            if(isRefresh){
                this.$set(this.opens,v.id,false);
            }
        })
        setTimeout(() => {
            this.tableLoading = false
        }, 0.5 * 1000)
    }

    //新增
    private add(id:number) {
        this.form = cloneDeep(rabcRouteFormData)
        this.form.pid = id
        this.isAdd = true
        this.$nextTick(() => {
            (this.$refs['dataForm'] as Form).clearValidate()
        })
    }

    //修改
    private edit(row: any) {
        this.form = Object.assign({}, row)
        this.$nextTick(() => {
            (this.$refs['dataForm'] as Form).clearValidate()
        })
        this.isAdd = true
    }

    //保存
    private submit() {
        (this.$refs['dataForm'] as Form).validate(async(valid) => {
            if (valid) {
                const res = await rabcRouteAdd(this.form)
                console.log(res)
                this.getList(false);
                this.isAdd = false
                this.$notify({
                    title: '成功',
                    message: res.message,
                    type: 'success',
                    duration: 2000
                })
            }
        })
    }

    //删除
    private del(id:number){
        this.$confirm('确定删除吗？','提示').then(async()=>{
            const res = await rabcRouteDelete(id)
            this.$notify({
                title: '操作成功',
                message: res.message,
                type: 'success',
                duration: 2000
            })
            this.getList(false);
        }).catch((action)=>{ console.log(action) })
    }

    //权限
    private checkRole(role:string|number){
        return checkRole(role)
    }

    //展开关闭子集
    private open(id:number|string){
        if(this.opens[id]){
            this.$set(this.opens,id,false);
        }else{
            this.$set(this.opens,id,true);
        }            
    }


}
</script>

<style>
.filter-item{margin-right:5px}
.table{border:1px solid #cad9ea;color:#666;font-size: 12px;width: 100%;table-layout:fixed;empty-cells:show;border-collapse: collapse;} 
.table th {background: #f7f7f7;color:#5c6b77;white-space: nowrap;font-weight: 600;} 
.table td,.table th{border: 1px solid #e9e9e9;padding: 8px 16px;text-align: left;} 

.table tr:first-child td{ border-top:2px solid #ff000029;}
.table tr td:first-child{ border-left:2px solid #ff000029;}
</style>