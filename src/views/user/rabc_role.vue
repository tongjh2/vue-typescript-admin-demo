<template>
<div class="app-container">
    <div class="filter-container" style="text-align:right">     
        <el-button v-waves class="filter-item" style="margin-left:0" type="primary" icon="el-icon-edit" @click="add">添加</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" border fit highlight-current-row size="mini" style="width: 100%;" @sort-change="sortChange">
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
            <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column label="角色名" prop="name" align="left"></el-table-column>        
        <el-table-column label="操作" align="center" class-name="fixed-width">
            <template slot-scope="{row}">
                <el-button type="primary" size="mini"  plain @click="edit(row)" style="width:auto"> 编辑</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.page_size" @pagination="getList"/>

    <el-dialog title="编辑" :visible.sync="isAdd" width="560px">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;"> 
            <el-form-item label="角色名" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item  label="权限" prop="route_ids">   
                <el-tree
                    ref="treeRoute"
                    :data="treeData"
                    show-checkbox
                    check-strictly
                    node-key="id"
                    @check-change="changeRoute"
                    :default-checked-keys="routeIds"
                    :props="defaultProps">
                </el-tree>
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
import { rabcRoleList,defaultRabcRoleData } from '@/api/rabc_role'
import { rabcRouteList } from '@/api/rabc_route'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'


@Component({
    name: 'user',
    components: { Pagination }
})
export default class extends Vue {

    private routeIds = []
    private treeData = []
    private defaultProps = {
        children: 'children',
        label: 'label'
    }
    
    private list: any[] = []
    private total = 0
    private tableLoading = true
    private params = {
        page: 1,
        page_size:10,
        name: undefined,
        phone: undefined,
        role: undefined,
        status: undefined,
        sort: '+id'
    }

    private downloadLoading = false
    private isAdd = false
    private isUpdateRole = false
    private form = defaultRabcRoleData
    private rules = {
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
        route_ids: [{ required: true, message: '权限不能为空', trigger: 'change' }]
    }

    created() {
        this.getList()
        this.getRabcRouteList();
    }

    //获取权限列表
    private getRabcRouteList(){
        rabcRouteList({page_size:10000}).then(res=>{
            let list = (res.data.data||[]).map(v=>{
                v.id = v.id;
                v.label = v.name;
                v.expand = false;
                v.checked = false;
                return v;
            });
            this.treeData = this.getTree(list,0);

        },(error)=>{ console.log(error) })
    }

    //递归出一颗树
    private getTree(list:any[],pid:number){
        return list.filter(v=>{
            if(v.pid==pid){
                v['children'] = this.getTree(list,v.id);
                return true;
            }
        })
    }

    //选择权限
    private changeRoute(val:any) {        
        console.log(this.$refs.treeRoute.getCheckedKeys());
        this.$nextTick(()=>{
            this.routeIds = this.$refs.treeRoute.getCheckedKeys();
            this.form.route_ids = this.routeIds.join(",");
            console.log(this.form.route_ids)
        })        
    }

    private async getList() {
        this.tableLoading = true
        const { data } = await rabcRoleList(this.params)
        this.list = data.data
        this.total = data.pagenation.total
        setTimeout(() => {
            this.tableLoading = false
        }, 0.5 * 1000)
    }

    private search() {
        this.params.page = 1
        this.getList()
    }

    private sortChange(data: any) {
        const { prop, order } = data
        if (prop === 'id') {
            this.sortByID(order)
        }
    }

    private sortByID(order: string) {
        if (order === 'ascending') {
        this.params.sort = '+id'
        } else {
        this.params.sort = '-id'
        }
        this.search()
    }

    private getSortClass(key: string) {
        const sort = this.params.sort
        return sort === `+${key}` ? 'ascending' : sort === `-${key}` ? 'descending' : ''
    }

    private resetUserData() {
        this.form = cloneDeep(defaultRabcRoleData)
    }

    //新增
    private add() {
        this.resetUserData()
        this.routeIds = [];
        this.isAdd = true
        this.$nextTick(() => {
            (this.$refs['dataForm'] as Form).clearValidate()
        })
    }

    //修改
    private edit(row: any) {
        this.form = Object.assign({}, row)
        this.isAdd = true
        this.routeIds = row.route_ids.split(",")
        console.log(this.routeIds,this.form.route_ids)
        this.$nextTick(() => {
            (this.$refs['dataForm'] as Form).clearValidate()
        })
    }

    //保存
    private submit() {
        (this.$refs['dataForm'] as Form).validate(async(valid) => {
            if (valid) {
                const res = await userAdd(this.form)
                console.log(res)
                this.getList();
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

    //修改状态
    private updateStatus(row:any){
        let msg = row.status===0?'确定禁用此用户吗？':'确定启用此用户吗？';
        this.$confirm(msg,'提示').then(async()=>{
            const res = await userUpdateStatus({id:row.id,status:row.status===0?1:0})
            this.$notify({
                title:'提示',
                message:res.message
            })
            this.getList();
        }).catch((action)=>{ console.log(action) })

    }
    
    //重置密码
    private updatePassword(id:number){
        this.$confirm('确定重置密码吗？','提示').then(async()=>{
            const res = await userUpdatePassword({id})
            this.$alert(res.message)
            this.getList();
        }).catch((action)=>{ console.log(action) })
    }

    //修改角色
    private updateRole(row:any){
        this.form.id = row.id;
        this.form.role = row.role;
        this.isUpdateRole = true;
    }

    //修改角色
    async submitUpdateRole(){
        const res = await userUpdateRole({id:this.form.id,role:this.form.role})
        this.$message({type:'success',message:res.message})
        this.getList();
        this.isUpdateRole = false
    }

    //下载excel
    private handleDownload() {
        this.downloadLoading = true
        const tHeader = ['用户名', '姓名', '手机号', '角色', '创建时间','状态']
        const filterVal = ['username', 'name', 'phone', 'role_name','create_time', 'status']
        const data = formatJson(filterVal, this.list)
        exportJson2Excel(tHeader, data, '用户列表')
        this.downloadLoading = false
    }

}
</script>

<style>
.filter-item{margin-right:5px}
</style>