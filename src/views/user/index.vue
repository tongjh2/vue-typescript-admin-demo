<template>
<div class="app-container">
    <div class="filter-container" style="text-align:right">
        <el-input v-model="params.name" placeholder="姓名" style="width: 150px;" class="filter-item" @keyup.enter.native="search"/>
        <el-input v-model="params.phone" placeholder="手机号" style="width: 150px;" class="filter-item" @keyup.enter.native="search"/>
        <el-select v-model="params.role" placeholder="角色" clearable style="width: 150px" class="filter-item"> 
            <el-option v-for="v in rabcRoleList" :key="v.id" :label="v.name" :value="v.id" />
        </el-select>
        <el-select v-model="params.status" placeholder="状态" clearable style="width: 150px" class="filter-item"> 
            <el-option label="正常" :value="0"/>
            <el-option label="禁用" :value="1"/>
        </el-select>      
        <el-button v-waves class="filter-item" style="margin-left:0" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button v-waves class="filter-item" style="margin-left:0" type="primary" icon="el-icon-edit" @click="add">添加</el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" style="margin-left:0" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table v-loading="tableLoading" :data="list" border fit highlight-current-row size="mini" style="width: 100%;" @sort-change="sortChange">
        <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
            <template slot-scope="scope"><span>{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column label="用户名" prop="username" min-width="120px" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" min-width="120px"></el-table-column>
        <el-table-column label="年龄" prop="age" width="120px"></el-table-column>
        <el-table-column label="性别" prop="sex" width="120px"></el-table-column>
        <el-table-column label="手机号" prop="phone" width="120px"></el-table-column>
        <el-table-column label="角色" prop="role_name" width="120px"></el-table-column>
        <el-table-column label="创建时间" width="165px">
            <template slot-scope="scope">{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</template>
        </el-table-column>
        <el-table-column label="状态" align="center" width="120">
            <template slot-scope="{row}"><span :style="{color:row.status===1?'red':''}">{{ row.status===0?'正常':'禁用' }}</span></template>
        </el-table-column>      
        <el-table-column label="操作" align="center" width="300" class-name="fixed-width">
            <template slot-scope="{row}">
            <el-button type="primary" size="mini"  plain @click="edit(row)" style="width:auto"> 修改</el-button>
            <el-button type="success" size="mini" plain @click="updatePassword(row.id)" style="width:auto"> 重置密码</el-button>
            <el-button type="warning" size="mini" plain @click="updateRole(row)" style="width:auto"> 修改角色</el-button>
            <el-button type="danger" size="mini" plain @click="updateStatus(row)" style="width:auto"> {{row.status===0?'禁用':'启用'}}</el-button>
            </template>
        </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.page_size" @pagination="getList"/>

    <el-dialog title="编辑" :visible.sync="isAdd" width="560px">
        <el-form ref="dataForm" :rules="rules" :model="form" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;"> 
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item  label="角色" prop="role">   
                <el-select v-model="form.role" style="width:100%">
                    <el-option v-for="v in rabcRoleList" :key="v.id" :label="v.name" :value="v.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model="form.age" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex" style="width:100%">
                    <el-option label="男" :value="1"/>
                    <el-option label="女" :value="2"/>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
        </div>
    </el-dialog>

    <el-dialog :visible.sync="isUpdateRole" title="修改角色" width="380px">
        <el-form ref="dataForm" label-position="right" label-width="80px" style="width: 290px;"> 
            <el-form-item label="角色" prop="role">
                <el-select v-model="form.role" style="width:100%">
                    <el-option v-for="v in rabcRoleList" :key="v.id" :label="v.name" :value="v.id"/>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isUpdateRole = false">取消</el-button>
            <el-button type="primary" @click="submitUpdateRole">确定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { cloneDeep } from 'lodash'
import { getSickList, getPageviews, createArticle, updateArticle, defaultArticleData } from '@/api/sick'
import { userList,userAdd,userUpdateStatus,userUpdatePassword,userUpdateRole, defaultUserData } from '@/api/user'
import { rabcRoleList } from '@/api/rabc_role'
import { RabcRoleModule } from '@/store/modules/rabc_role'


import { IArticleData } from '@/api/types'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'


@Component({
  name: 'user',
  components: { Pagination }
})
export default class extends Vue {
    
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
    private form = defaultUserData
    private rules = {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        role: [{ required: true, message: '角色不能为空', trigger: 'change' }],
        phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
    }

    get rabcRoleList(){
        return RabcRoleModule.list;
    }

    created() {
        this.getList()
        RabcRoleModule.GetRabcRoleList({page_size:10})
    }

    private async getList() {
        this.tableLoading = true
        const { data } = await userList(this.params)
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
        this.form = cloneDeep(defaultUserData)
    }

    //新增
    private add() {
        this.resetUserData()
        this.isAdd = true
        this.$nextTick(() => {
            (this.$refs['dataForm'] as Form).clearValidate()
        })
    }

    //修改
    private edit(row: any) {
        this.form = Object.assign({}, row)
        this.isAdd = true
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