<!-- eslint-disable vue/camelcase -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
    <el-container class="shopCart_container">
        <slot></slot>
    </el-container>
</template>

<script lang="ts">
import {
    lookDishAll,
    lookSetmealAll
} from '@/api/user/category';
import Vue from 'vue';
import Component from 'vue-class-component';
// import look from '@/api/user/address';//default导出的默认模块

// 使用此注解时，必须export default class extends Vue，而非export default{}
@Component({
    name: 'ShopCart',
})
export default class extends Vue{
    // private todayData = {} as any
}
</script>

<style lang="scss">
// 失效了？why
.shopCart_container {
    // margin: 30px; //margin 清除周围的（外边框）元素区域。margin 没有背景颜色，是完全透明的。
    position: fixed;//固定购物车位置
    width: 100%;
    left: 0px;
    bottom: 0px;
    background: #ddac5d;
    z-index: 2;
}

// 会被element——ui默认的sytle覆盖（但是container却不受影响，奇怪），所以失去作用，只有直接传给组件才有作用，比如margin-top。
// .category_container.categoryChoose {
//   top: 50px;
//   padding: 40px 50px;
// }

// .category_container.categoryTable {
//   position: relative; //相对定位元素的定位是相对其正常位置。详细的看https://www.runoob.com/css/css-positioning.html#position-relative
//   // position: inherit;
//   top: 50px;
//   left: 0px;
// }</style>
