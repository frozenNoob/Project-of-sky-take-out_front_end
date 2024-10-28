/* eslint-disable quotes */
import Vue from "vue";
import Router from "vue-router";
import adminLayout from "@/admin_views/layout/index.vue";
import {
  getToken,
  setToken,
  removeToken,
  getStoreId,
  setStoreId,
  removeStoreId,
  setUserInfo,
  getUserInfo,
  removeUserInfo
} from '@/utils/cookies';
import store from '@/store';

Vue.use(Router);

const router = new Router({
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      redirect: "/admin/login" //初始登录页面重定向到员工登录页面
    },
    {
      path: "/admin/login",
      component: () =>
        import(/* webpackChunkName: "login" */ "@/admin_views/login/index.vue"),
      meta: { title: "苍穹外卖", hidden: true, notNeedAuth: true }
    },
    {
      path: "/404",
      component: () => import(/* webpackChunkName: "404" */ "@/common_views/404.vue"),
      meta: { title: "苍穹外卖", hidden: true, notNeedAuth: true }
    },
    //员工的后台功能
    {
      path: "/admin",
      component: adminLayout,
      redirect: "/admin/dashboard",
      children: [
        {
          path: "/dashboard",
          component: () =>
            import(/* webpackChunkName: "dashboard" */ "@/admin_views/dashboard/index.vue"),
          name: "Dashboard",
          meta: {
            title: "工作台",
            icon: "dashboard",
            affix: true
          }
        },
        {
          path: "/statistics",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/statistics/index.vue"),
          meta: {
            title: "数据统计",
            icon: "icon-statistics"
          }
        },
        {
          path: "order",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/orderDetails/index.vue"),
          meta: {
            title: "订单管理",
            icon: "icon-order"
          }
        },
        {
          path: "setmeal",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/setmeal/index.vue"),
          meta: {
            title: "套餐管理",
            icon: "icon-combo"
          }
        },
        {
          path: "dish",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/dish/index.vue"),
          meta: {
            title: "菜品管理",
            icon: "icon-dish"
          }
        },
        {
          path: "/dish/add",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/dish/addDishtype.vue"),
          meta: {
            title: "添加菜品",
            hidden: true
          }
        },

        {
          path: "category",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/category/index.vue"),
          meta: {
            title: "分类管理",
            icon: "icon-category"
          }
        },
        {
          path: "employee",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/employee/index.vue"),
          meta: {
            title: "员工管理",
            icon: "icon-employee"
          }
        },

        {
          path: "/employee/add",
          component: () =>
            import(/* webpackChunkName: "dashboard" */ "@/admin_views/employee/addEmployee.vue"),
          meta: {
            title: "添加员工",
            hidden: true
          }
        },

        {
          path: "/setmeal/add",
          component: () =>
            import(/* webpackChunkName: "shopTable" */ "@/admin_views/setmeal/addSetmeal.vue"),
          meta: {
            title: "添加套餐",
            hidden: true
          }
        }
      ]
    },
    //用户的登录功能和后台功能
    {
      path: "/user",
      // component: Layout,
      redirect: "/list",
      children: [
        {
          path: "/login",
          component: () =>
            import(/* webpackChunkName: "login" */ "@/user_views/login/index.vue"),
          meta: { title: "苍穹外卖", hidden: true, notNeedAuth: true }
        },
        //////////////加入员工相关的其他功能/////////////////
      ]
    },
    // 放在最后，匹配除了上面的能匹配合法路径外的其他所有的非合法路径，重定向为404
    // {
    //   path: "*",
    //   redirect: "/404",
    //   meta: { hidden: true }
    // },
  ]
});

export default router;
