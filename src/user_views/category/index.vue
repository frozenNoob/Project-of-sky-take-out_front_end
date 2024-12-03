<!-- eslint-disable vue/camelcase -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <el-container class="category_container">
    <ShopCart class="shopCart">
      <p style="color: aliceblue;">
        这是购物车AA
      </p>
    </ShopCart>
    <el-header class="categoryChoose" style="margin-top: 20px;">
      <el-select v-model="categoryValue" placeholder="请选择套餐或菜品" @change="lookCategory(categoryValue)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-header>
    <el-main>
      <el-table class="categoryTable" :data="categoryList" :stripe="true">
        <!-- <el-table-column prop="categoryId" label="类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.categoryId == 1 ? "菜品" : "套餐" }}
          </template>
</el-table-column> -->
        <el-table-column prop="name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="image" label="图片">
          <template slot-scope="{ row }">
            <el-image style="width: 40px; height: 40px; border: none; cursor: pointer" :src="row.image">
              <!--显示错误情况下的指定图片  -->
              <div slot="error" class="image-slot">
                <img src="./../../assets/noImg.png" style="width: auto; height: 40px; border: none">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="addToCart(scope.row.id)">
              加入购物车
            </el-button>
            <!-- <el-dialog title="添加菜品到购物车用的Form表单" :visible.sync="dialogFormVisible_for_add_dish_to_cart">
                    <el-form ref="editTableData" :model="editTableData" label-width="80px">
                      <el-form-item label="收货人">
                        <el-input v-model="editTableData.consignee"></el-input>
                      </el-form-item>
                      <el-form-item label="详细地址">
                        <el-input v-model="editTableData.detail"></el-input>
                      </el-form-item>
                      <el-form-item label="电话">
                        <el-input v-model="editTableData.phone"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="update_after_on_submit(editTableData)">
                          确认修改
                        </el-button>
                        <el-button @click="dialogFormVisible_for_add_dish_to_cart = false">
                          取消
                        </el-button>
                      </el-form-item>
                      <el-form-item label="性别">
                        <el-select v-model="editTableData.gender" placeholder="选择性别">
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="0"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </el-dialog> -->
            <el-button size="mini" type="danger" @click="deleteFromCart(scope.row.id)">
              去掉
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- <br><br> -->
  </el-container>
</template>

<script lang="ts">
import {
  lookDishAll,
  lookSetmealAll
} from '@/api/user/category';
// import ShopCart from './shop_cart/index.vue'//使用组件的第二种方法
// import look from '@/api/user/address';//default导出的默认模块
export default {
  data() {
    return {
      options: [{
        value: 1,
        label: '菜品'
      }, {
        value: 2,
        label: '套餐'
      },
      {
        value: 3,
        label: '套餐和菜品'
      }
      ],
      // categoryId为1表示菜品分类，2表示套餐分类
      categoryValue: '',
      categoryList: {
        'id': 0,
        'categoryId': 0,
        'name': '',
        'price': 0,
        'status': 0,
        'description': '',
        'image': '',
      },
      dialogFormVisible_for_add_dish_to_cart: false,//添加菜品到购物车,套餐不需要此表
    }
  },
  mounted() {
    this.lookCategory(3);
  },
  methods: {
    // 根据value查看菜单种类（菜品或/和套餐）,实现菜品浏览
    async lookCategory(categoryValue) {
      if (categoryValue == 1) {
        const response = await lookDishAll();
        this.categoryList = response.data.data;
      } else if (categoryValue == 2) {
        const response = await lookSetmealAll();
        this.categoryList = response.data.data;
      } else if (categoryValue == 3) {

        let response = await lookDishAll();
        let categoryList1 = response.data.data;
        response = await lookSetmealAll();
        let categoryList2 = response.data.data;
        this.categoryList = [
          ...categoryList1,//... 是 ES6 中的扩展运算符（Spread Operator），用于展开数组或对象。(也是一种浅拷贝)
          ...categoryList2
        ]
        // console.log('商品浏览对象\n', this.categoryList);
      }
    },
    addToCart(categoryId, id) {

    },
    deleteFromCart(categoryId, id) {

    }
  }
}
</script>

<style lang="scss" scoped>
.category_container {
  margin: 30px; //margin 清除周围的（外边框）元素区域。margin 没有背景颜色，是完全透明的。
  background: #f8e1bb;
  height: 70%;
  z-index: 1;

  .shopCart {
    position: fixed; //固定购物车位置
    width: 100%;
    height: 30%;
    left: 0px;
    bottom: 0px;
    padding: auto;
    background: #ef9e1c;
    z-index: 2;
  }
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
