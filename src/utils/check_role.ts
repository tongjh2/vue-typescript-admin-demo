import store from "@/store";

// 检查用户权限
export const checkRole = (role:number|string) => {
    let session = store.state.user.session;
    if (session.role == '-1') {
        if(role=='LOCK_STORE')return false;
        return true;
    }
    let roles = (session.roles||[]).filter((v:any) => v == role);
    return roles.length > 0;
}