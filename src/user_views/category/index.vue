<!-- eslint-disable vue/camelcase -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <el-container class="category_container">
    <el-header class="categoryChoose" style="margin-top: 20px;">
      <el-select v-model="type" placeholder="请选择套餐或/和菜品" style="margin-right: 20px;" @change="lookCategory(type)">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="categoryId" placeholder="请选择分类" @change="lookMenuByCategoryId(categoryId, type)">
        <el-option v-for="item in categoryListOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-header>
    <el-main style="height: 40%;">
      <el-table :data="menu" :stripe="true">
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
            <el-button size="primary" @click="addToCart(scope.row, 'inMenu')">
              加入购物车
            </el-button>
            <!-- 菜品加入购物车需要列表，这里获取到的不是最新的数据，这点需要注意 -->
            <el-dialog title="加入菜品到购物车" :visible.sync="visualDishFlavorDialog">
              <el-form ref="dishFlavorDialogData" :model="dishFlavorDialogData" label-width="80px">
                <el-form-item label="菜品名称">
                  {{ dishFlavorDialogData.name }}
                </el-form-item>
                <el-form-item label="选择口味">
                  <el-select v-if="existFlavor('甜味')" v-model="dishFlavorFirstItem" placeholder="甜味"
                    @change="addOneItemToFlavors('甜味', dishFlavorFirstItem)">
                    <el-option v-for="item in getFlavorOptions('甜味')" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-if="existFlavor('温度')" v-model="dishFlavorSecondItem" placeholder="温度"
                    @change="addOneItemToFlavors('温度', dishFlavorSecondItem)">
                    <el-option v-for="item in getFlavorOptions('温度')" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-if="existFlavor('忌口')" v-model="dishFlavorThirdItem" placeholder="忌口"
                    @change="addOneItemToFlavors('忌口', dishFlavorThirdItem)">
                    <el-option v-for="item in getFlavorOptions('忌口')" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-if="existFlavor('辣度')" v-model="dishFlavorFourthItem" placeholder="辣度"
                    @change="addOneItemToFlavors('辣度', dishFlavorFourthItem)">
                    <el-option v-for="item in getFlavorOptions('辣度')" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="addDishToShopCart(dishFlavorDialogData, 'inMenu')">
                    确认添加
                  </el-button>
                  <el-button @click="visualDishFlavorDialog = false">
                    取消
                  </el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
            <el-button size="mini" type="danger" @click="deleteFromCart(scope.row)">
              去掉
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer style="height: 40% ;min-width: 100%;">
      <el-table :data="shopCart" class="categoryShopCartTable" style="overflow: scroll ;" :stripe="true">
        <!-- <el-table-column prop="categoryId" label="类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.categoryId == 1 ? "菜品" : "套餐" }}
          </template>
</el-table-column> -->
        <el-table-column prop="name" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="number" label="当前数量">
        </el-table-column>
        <el-table-column prop="amount" label="总价（元）">
        </el-table-column>
        <el-table-column prop="description" label="描述">
        </el-table-column>
        <el-table-column prop="dishFlavor" label="菜品口味">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" style="background-color:darkorange;"
              @click="addToCart(scope.row, 'inCart')">
              +
            </el-button>
            <el-button size="mini" type="danger" @click="deleteFromCart(scope.row)">
              -
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="settlement">
        <p style="font-size: large;">
          当前总价为
          <span style="right: 50%;">
            {{ getCartAllAmount() }}元
            <el-button size="medium" type="primary" @click="sumUpShopCart()">点此结算</el-button>
          </span>
          <span>
            <el-button size="medium" type="danger" @click="clearAllInShopCart()">清空购物车</el-button>
          </span>
        </p>
      </div>
    </el-footer>
    <!-- <br><br> -->
  </el-container>
</template>

<script lang="ts">
import {
  lookDishAll,
  lookSetmealAll,
  lookCategoryByType,
  lookDishById,
  lookSetmealById
} from '@/api/user/category';
import {
  addShopCart,
  lookShopCart,
  deleteOneItemInShopCart,
  deleteAllInShopCart
} from '@/api/user/shopCart'
import { Axis } from 'echarts';
// import ShopCart from './shop_cart/index.vue'//使用组件的第二种方法
// import look from '@/api/user/address';//default导出的默认模块
export default {
  data() {
    return {
      options: [{
        'value': 1,
        'label': '菜品'
      }, {
        value: 2,
        label: '套餐'
      },
      {
        value: 3,
        label: '套餐和菜品'
      }
      ],
      categoryListOptions: [
        {
          value: 0,//套餐/菜品分类id
          label: '请先选择套餐或菜品'
        }
      ],
      // type为1表示菜品分类，2表示套餐分类
      type: '',
      // 根据ID查询套餐或菜品
      categoryId: '',
      // 商品浏览
      menu: [{
        'id': 0, //套餐或菜品ID
        'type': 3,
        'flavors': [],
        'categoryId': 0,
        'name': '',
        'price': 0,
        'status': 0,
        'description': '',
        'image': '',
      }],
      shopCart: [{
        'id': 0, //套餐或菜品ID
        'type': 3,
        'name': '',
        'number': 0,//数量
        'amount': 0,//总价=数量*单价
        'dishFlavor': '',//菜品口味
        'description': '',
        'image': '',
      }],
      dialogFormVisible_for_add_dish_to_cart: false,//添加菜品到购物车,套餐不需要此表
      // flavor flavorData
      dishFlavorsData: [
        { name: '甜味', value: ['无糖', '少糖', '半糖', '多糖', '全糖'] },
        { name: '温度', value: ['热饮', '常温', '去冰', '少冰', '多冰'] },
        { name: '忌口', value: ['不要葱', '不要蒜', '不要香菜', '不要辣'] },
        { name: '辣度', value: ['不辣', '微辣', '中辣', '重辣'] }
      ],
      // 展示菜品选择，查询菜品味道等信息
      dishFlavorDialogData: {
        'name': '',
        'image': '',
        'description': '',
        'flavors': [],//实际上没有用到这个
      },
      dishFlavorFirstItem: '甜度',
      dishFlavorSecondItem: '温度',
      dishFlavorThirdItem: '忌口',
      dishFlavorFourthItem: '辣度',
      dishFlavor: {}, //所有味道的字典
      visualDishFlavorDialog: false,//添加味道
    }
  },
  mounted() {
    this.lookCategory(3);//默认查看所有套餐和菜品
    this.lookCart();//查看购物车
  },
  methods: {
    async clearAllInShopCart() {
      await deleteAllInShopCart();
      this.lookCart();//刷新购物车
    },
    sumUpShopCart() {

    },
    getCartAllAmount() {
      let allAmount = 0;
      this.shopCart.forEach(menuRow => {
        allAmount += menuRow.amount;
      });
      return allAmount;
    },
    getFlavorOptions(flavorName: string) {
      var dishFlavorsIndex = {};
      for (let i = 0; i < this.dishFlavorsData.length; ++i) {
        var dfd = this.dishFlavorsData[i].name;
        dishFlavorsIndex[dfd] = i;
      }
      return this.dishFlavorsData[dishFlavorsIndex[flavorName]].value;
    },
    addOneItemToFlavors(key: string, oneItem: string) {
      if (this.dishFlavor == null) {
        //新建之后再赋值，防止报错。而不能直接对空的对象（会被认为是undefined)赋值或push增加元素，比如不能this.dishFlavors[key]=value
        var dishFlavor = {};
        // data中非空属性可以直接赋值
        // this.dishFlavorsData[key] = oneItem;
        // console.log(this.dishFlavorsData);
        dishFlavor[key] = oneItem;//新增
        this.dishFlavor = dishFlavor;
      } else {
        this.dishFlavor[key] = oneItem;//新增或更新
      }
      console.log('添加口味后', this.dishFlavor);
    },
    setMenu(response, type) {
      var menu = response.data.data;
      menu.forEach(item => {
        item.type = type;//给字典额外加上type表示是套餐还是菜品
      });
      return menu;
    },
    // 根据value查看菜单种类（菜品或/和套餐）,实现菜品浏览
    async lookCategory(type) {
      // 查询分类
      if (type == 1 || type == 2) {
        var response = await lookCategoryByType(type);
        let categoryDetailedList = response.data.data;
        this.categoryListOptions = []
        for (let i = 0; i < categoryDetailedList.length; ++i) {
          let categoryOptionItem = {
            'value': categoryDetailedList[i].id,
            'label': categoryDetailedList[i].name
          }
          this.categoryListOptions.push(categoryOptionItem);
        }
      }
      if (type == 1) {
        response = await lookDishAll();
        this.menu = this.setMenu(response, type);
      } else if (type == 2) {
        response = await lookSetmealAll();
        this.menu = this.setMenu(response, type);
      } else if (type == 3) {

        response = await lookDishAll();
        let menu1 = this.setMenu(response, 1);
        response = await lookSetmealAll();
        let menu2 = this.setMenu(response, 2);
        this.menu = [
          ...menu1,//... 是 ES6 中的扩展运算符（Spread Operator），用于展开数组或对象。(也是一种浅拷贝)
          ...menu2
        ];
        // 重新初始化分类选择列表
        this.categoryListOptions = [
          {
            value: 0,//套餐/菜品分类id
            label: '请先选择套餐或菜品'
          }
        ]
        // console.log('商品浏览对象\n', this.menu);
      }
    },
    async lookMenuByCategoryId(categoryId, type) {
      var response;
      if (type == 1) {
        response = await lookDishById(categoryId);
      } else if (type == 2) {
        response = await lookSetmealById(categoryId);
      } else return;
      this.menu = this.setMenu(response, type);
      console.log('lookMenuByCategoryId方法中菜单为：, ', this.menu);
    },
    async addToCart(menuRow, way) {
      console.log('该行是', menuRow);
      // 菜品
      if (menuRow.type == 1) {
        if (way == 'inMenu') {
          //直接引用（节省内存消耗），其实这里可以只提取其中部分所需属性，这样可以防止之后可能的修改，但是会因为拷贝（比如浅拷贝...）耗更多内存。
          this.dishFlavorDialogData = menuRow;
          // 口味编辑表单
          this.visualDishFlavorDialog = true;
          console.log('在Dialog被关闭前，后续指令会继续执行，所以这里把函数放到Dialog中');
        } else { //inCart
          this.addDishToShopCart(menuRow, way);
        }
      } else if (menuRow.type == 2) { //套餐
        alert('加入套餐到购物车！');
        await addShopCart({ 'setmealId': menuRow.id });
      } else {
        console.log('未知类型，这种情况理论上不可能出现！此时menuRow为 ', menuRow);
      }
      this.lookCart();//刷新购物车
    },
    async addDishToShopCart(menuRow, way) {
      console.log('该行是', menuRow, '方法为：', way);
      var dishFlavor;
      console.log('this.dishFlavor', this.dishFlavor);
      if (way == 'inMenu') {
        dishFlavor = JSON.stringify(this.dishFlavor);//需要转成字符串
        console.log('inMenu, dishFlavor', dishFlavor);
      } else { //inCart
        dishFlavor = menuRow.dishFlavor;//已经是字符串
        console.log('dishFlavor', dishFlavor);
      }
      var DishAddedToShopCart = {
        'dishId': menuRow.id,
        'dishFlavor': dishFlavor//字符串表示各种口味
      };
      console.log('被添加到购物车的菜品为：', DishAddedToShopCart);
      await addShopCart(DishAddedToShopCart);
      this.visualDishFlavorDialog = false;
      this.lookCart();//刷新购物车
    },
    existFlavor(flavor) {
      var flavors = this.dishFlavorDialogData.flavors;
      // console.log('flavors is ', flavors);
      // for-each函数没有返回值，这一点需要注意！所以这里使用for
      for (let i = 0; i < flavors.length; ++i) {
        if (flavors[i].name == flavor) {
          return true;
        }
      }
      return false;
    },
    async deleteFromCart(menuRow) {
      console.log('该行是', menuRow);
      // 菜品
      if (menuRow.type == 1) {
        var DishDeletedInShopCart = {
          'dishId': menuRow.id,
          'dishFlavor': menuRow.dishFlavor
        }
        await deleteOneItemInShopCart(DishDeletedInShopCart);
      } else if (menuRow.type == 2) { //套餐
        await deleteOneItemInShopCart({ 'setmealId': menuRow.id });
      } else {
        console.log('未知类型，这种情况理论上不可能出现！此时menuRow为 ', menuRow);
      }
      this.lookCart();//刷新
    },
    async lookCart() {
      const data = (await lookShopCart()).data.data;
      for (let i = 0; i < data.length; ++i) {
        var menuRow = data[i];
        if (menuRow.dishId != null) {
          menuRow['type'] = 1;
          menuRow['id'] = menuRow['dishId'];
          let flavor = JSON.parse(menuRow['dishFlavor']);
          console.log('返回到购物车的菜品口味为：', flavor);
        } else if (menuRow.setmealId != null) {
          menuRow['type'] = 2;
          menuRow['id'] = menuRow['setmealId'];
        }
      }
      this.shopCart = data;
    }
  }
}
</script>

<style lang="scss" scoped>
// 无用，只有直接传给组件才有作用，比如margin-top。
// .category_container.categoryChoose {
//   top: 50px;
//   padding: 40px 50px;
// }

.category_container {
  margin: 30px; //margin 清除周围的（外边框）元素区域。margin 没有背景颜色，是完全透明的。
  background: #f8e1bb;
  z-index: 1;
  width: 100%;

  // .shopCart {
  //   width: 100%;
  //   height: 30%;
  //   left: 0px;
  //   bottom: 0px;
  //   padding: auto;
  //   background: #ef9e1c;
  //   z-index: 2;
  // }
  .el-main {
    padding-bottom: 25%;
  }

  // 第1个自定义el-footer(共3个)， 优先级最高，因为对应的上class的路径的样式。
  // 编译后为.category_container .el-footer[data-v-1236c9ad]
  .el-footer {
    position: fixed; //固定购物车位置
    height: 40%; //无法覆盖？100%和10%是一样的。推测element-ui源码用了scoped,所以直接传给组件是有效的
    width: 100%; //生效，100%和10%是不一样的。推测源码使用了类似穿透的功能？
    bottom: 0;
    background: #dcbe74;
    z-index: 2;

    // 理论上来说，穿透的时候会直接影响在本文件的同个class的所有用到该第三方库组件的地方
    // 但是这里没用，待解决》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》
    .categoryShopCartTable>>>.el-table__inner {
      position: relative; //fixed内用relative会失去作用
      min-width: 100%; //最小宽度占比（随着屏幕缩放不会再比这个小，用于显示全部列内容）
      min-height: 100%;
      background: #13c150;
      top: 0%;
    }

    // .categoryShopCartTable{
    //   min-width: 100%;//最小宽度占比（随着屏幕缩放不会再比这个小，用于显示全部列内容）
    //   min-height: 100%;
    // }
    .settlement {
      background: #e7b54a;
      position: fixed; //固定后的是没有滚动条的，所以可以通过分页购物车或者弹窗来解决这一显示问题(改变position也没用）。
      height: 10%;
      width: 100%;
      bottom: 0;
      z-index: 3;
    }
  }
}

// // 会覆盖前面同一优先级的样式，注意带空格分隔
// .category_container .el-main{
//   margin: 30px; //margin 清除周围的（外边框）元素区域。margin 没有背景颜色，是完全透明的。
//   background: #d41749;
//   z-index: 1;
//   width: 100%;
// }

// 第2个自定义的el-footer（发现只有注释前一个才能有用），编译后为.el-footer[data-v-1236c9ad]
// 如果这个文件的style没有使用scoped的(比如第3次自定义el-footer话,那么下面那个样式就会污染全局的el-footer!
// 如果第三方组件有scoped的话，那么这个就会无用（除非使用>>>或/deep/穿透）
// 如前面的第1个自定义样式是对应的上class的路径的样式，那么这个就会无用（比如现在这种情况），因为前者会被强制绑定。
.el-footer {
  position: fixed; //固定购物车位置
  height: 40%; //无法覆盖？100%和10%是一样的。推测element-ui源码用了scoped,所以直接传给组件是有效的
  width: 100%; //生效，100%和10%是不一样的。推测源码使用了类似穿透的功能？
  bottom: 0;
  background: #c31e1e;
  z-index: 2;
}
</style>
<!--无scoped时果， 如果组件没有任何样式可以用（比如第三方私有样式）的话， 可以用全局，虽然会污染-->
<style>
/* 第3次自定义el-footer 发现注释前2个才能起作用（优先级最低）这个优先级也可以通过F12查看样式的顺序看出（从上到下优先级从高到低）*/
/*编译后为 .el-footer */
.el-footer {
  position: fixed;
  height: 40%;
  width: 100%;
  bottom: 0;
  background: #108be9;
  z-index: 2;
}
</style>
