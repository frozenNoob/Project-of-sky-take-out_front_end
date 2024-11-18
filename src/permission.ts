import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { Route } from 'vue-router'
import { UserModule } from '@/store/modules/user'
import Cookies from 'js-cookie'

NProgress.configure({ 'showSpinner': false })

// 放在这里验证，不如直接在src\utils\request.ts上验证，虽然在这里验证确实能排除一些情况，而且只需要验证一次！！！！！！！
router.beforeEach(async (to: Route, _: Route, next: any) => {
  // 我直接通过验证，但是实际情况是需要根据token判断是否有权限登录，不然进入空页面不是很好
  // NProgress.start()
  // next();

  // 这里设置了2种判别方式！！！！！
  if (Cookies.get('token')||localStorage.getItem('token')) {
    next();
    console.log('存在token，验证成功！');
  } else {
    if (!to.meta.notNeedAuth) {
      console.log('需要验证！');
      next('/');
    } else {
      next();
    }
  }
})

router.afterEach((to: Route) => {
  NProgress.done();
  document.title = to.meta.title;
})
