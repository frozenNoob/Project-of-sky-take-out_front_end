<template>
  <div class="sidebar">
    <el-menu>
      <el-menu-item index="1-1">
        <router-link to="/admin/dashboard">工作台</router-link>
      </el-menu-item>
      <el-menu-item index="1-2">
        <router-link to="/admin/statistics">数据统计</router-link>
      </el-menu-item>
      <el-menu-item index="1-3">
        <router-link to="/admin/order">订单管理</router-link>
      </el-menu-item>
      <el-menu-item index="1-4">
        <router-link to="/admin/setmeal">套餐管理</router-link>
      </el-menu-item>
      <el-menu-item index="1-5">
        <router-link to="/admin/dish">菜品管理</router-link>
      </el-menu-item>
      <el-menu-item index="1-6">
        <router-link to="/admin/category">分类管理</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/_variables.scss'
import { getSidebarStatus, setSidebarStatus } from '@/utils/cookies'
import Cookies from 'js-cookie'
@Component({
  name: 'SideBar',
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  private restKey: number = 0
  get name() {
    return (UserModule.userInfo as any).name
      ? (UserModule.userInfo as any).name
      : JSON.parse(Cookies.get('user_info') as any).name
  }
  get defOpen() {
    // const urlArr = this.$route.path.split('/')
    // const openStr = urlArr.length > 2 ? `/${urlArr[1]}` : '/'
    let path = ['/']
    this.routes.forEach((n: any, i: number) => {
      if (n.meta.roles && n.meta.roles[0] === this.roles[0]) {
        path.splice(0, 1, n.path)
      }
    })
    return path
  }

  get defAct() {
    let path = this.$route.path
    return path
  }

  get sidebar() {
    return AppModule.sidebar
  }

  get roles() {
    return UserModule.roles
  }

  get routes() {
    let routes = JSON.parse(
      JSON.stringify([...(this.$router as any).options.routes])
    )
    console.log('-=-=routes=-=-=', routes)
    console.log('-=-=routes=-=-=', this.roles[0])
    let menuList = []
    let menu = routes.find(item => item.path === '/')
    if (menu) {
      menuList = menu.children
    }
    console.log('-=-=routes=-wwww=-=', routes)
    return menuList
  }

  get variables() {
    return variables
  }

  get isCollapse() {
    return !this.sidebar.opened
  }
  private async logout() {
    this.$store.dispatch('LogOut').then(() => {
      // location.href = '/'
      this.$router.replace({ path: '/admin/login' })
    })
    // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100%;
  background-color:#ffc200;
}
</style>
