<!-- eslint-disable no-trailing-spaces -->
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
      <el-select v-model="categoryId" @change="lookMenuByCategoryId(categoryId, type)">
        <el-option v-for="item in categoryListOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </el-header>
    <el-main style="height: 40%;">
      <!-- 只要在el-table元素中定义了height属性，即可实现固定表头的表格，而不需要额外的代码。 -->
      <el-table key="tab01" height="700" :data="menu" :stripe="true">
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
            <!-- 菜品加入购物车需要的对话框，这里获取到的不是最新的数据，这点需要注意 -->
            <el-dialog title="加入菜品到购物车" :visible.sync="visualDishFlavorDialog">
              <el-form ref="dishFlavorDialogData" :model="dishFlavorDialogData" label-width="80px">
                <el-form-item label="菜品名称">
                  {{ dishFlavorDialogData.name }}
                </el-form-item>
                <el-form-item label="选择口味">
                  <el-select 
                    v-for="(flavor, index) in flavorTypes"
                    :key="flavor.name"
                    v-if="existFlavor(flavor.name)"
                    v-model="dishFlavorItems[index]"
                    :placeholder="flavor.placeholder"
                    @change="addOneItemToFlavors(flavor.name, dishFlavorItems[index])">
                    <el-option 
                      v-for="item in getFlavorOptions(flavor.name)"
                      :key="item"
                      :label="item"
                      :value="item">
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
            <el-dialog title="套餐内菜品介绍" :visible.sync="visualSetmealDialog" width="50%">
              <!-- <p>这是菜品{{ dishInSetmeal[0]['name'] }}</p> -->
              <el-table key="tab02" :data="dishInSetmeal" :stripe="true">
                <el-table-column prop="name" label="菜品名称">
                </el-table-column>
                <el-table-column key="image" prop="image" label="图片">
                  <template slot-scope="scopeSet">
                    <el-image style="width: 40px; height: 40px; border: none; cursor: pointer"
                      :src="scopeSet.row.image">
                      <!--显示错误情况下的指定图片  -->
                      <div slot="error" class="image-slot">
                        <img src="./../../assets/noImg.png" style="width: auto; height: 40px; border: none">
                      </div>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="copies" label="份数">
                </el-table-column>
                <el-table-column prop="description" label="描述">
                </el-table-column>
              </el-table>
              <span slot="footer" class="dialog-footer">
                <el-button @click="visualSetmealDialog = false">取 消</el-button>
                <!-- 因为间隔一层dialog使用时，不要使用dialog外层传来的scope.row，因为它不会改变，都是最后一行-->
                <!-- <div>这是{{ scope.row.name }}</div> -->
                <!-- <el-button type="primary" @click="addSetmealToShopCart(scope.row, 'inMenu')">确 定</el-button> -->
                <!-- 所以需要额外的记录存储 -->
                <!-- <p>这是{{ menuRowForSetmeal.name }}</p> -->
                <el-button type="primary" @click="addSetmealToShopCart(menuRowForSetmeal, 'inMenu')">确 定</el-button>
              </span>
              <!-- 间隔一层dialog使用时，不要使用dialog外层传来的scope.row，因为它不会改变，都是最后一行-->
              <!-- <p>这是D {{ scope.row.name }}</p> -->
            </el-dialog>
            <!-- 套餐加入到购物车需要的对话框 -->
            <el-button size="mini" type="danger" @click="deleteFromCart(scope.row.name)">
              去掉
              <!-- 能够正常显示 -->
              <!-- <p>这是B {{ scope.row.name }}</p> -->
            </el-button>
            <!-- 套餐加入到购物车需要的对话框 -->
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <!-- <p class="justTestCart">
      由此可以看出，要固定在下部的且可以实现表格滚动的购物车，需要达成以下条件

      （1）需要设置position为absolute。
      （2）设置距离顶部的位置和高度。
      （3）设置能够覆盖其他组件的较大的z-index值。
      显然element中的Dialog组件已经满足了条件（1）和（3）
    </p>  -->
    <el-dialog custom-class="shopCart" :visible.sync="shopCartDialogVisible">
      <P class="shopCartTitle">
        <i class=" el-icon-shopping-cart-2">购物车</i>
      </P>
      <div>
        <el-table key="tab03" :data="shopCart" class="categoryShopCartTable" height="300" style="margin-top:2%;"
          :stripe="true">
          <!-- <el-table-column prop="categoryId" label="类型" width="180">
          <template slot-scope="scope">
            {{ scope.row.categoryId == 1 ? "菜品" : "套餐" }}
          </template>
</el-table-column> -->
          <el-table-column prop="name" label="商品名称" width="180">
          </el-table-column>
          <el-table-column prop="number" label="当前数量">
          </el-table-column>
          <el-table-column prop="amount" label="单价（元）">
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="shopCartDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="shopCartDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 如果在这里直接传属性的话，浏览器控制台上便会显示样式element.style 且其优先级最高（排在最前面）-->
    <el-footer>
      <div class="settlement">
        <p style="font-size: large;">
          <i class="el-icon-view" style="font-size: 10%">
            当前总价为
          </i>
          <span style="right: 50%;">
            {{ getCartAllAmount() }}元
            <el-button size="medium" type="primary" @click="sumUpShopCart()">
              <i class="el-icon-sell">
                点此结算
              </i>
            </el-button>
          </span>
          <span>
            <el-button size="medium" type="danger" @click="clearAllInShopCart()">
              <i class="el-icon-delete">
                清空购物车
              </i>
            </el-button>
          </span>
          <el-button type="primary" @click="shopCartDialogVisible = true">
            <i class=" el-icon-shopping-cart-2">展开购物车</i>
          </el-button>
        </p>
      </div>
    </el-footer>
    <!-- <br><br> -->
  </el-container>
</template>

<script lang="ts">
import {
  lookDefaultAddress
} from '@/api/user/address'
import {
  lookDishAll,
  lookSetmealAll,
  lookCategoryByType,
  lookDishById,
  lookSetmealById,
  lookDishInSetmeal,
} from '@/api/user/category';
import {
  addShopCart,
  lookShopCart,
  deleteOneItemInShopCart,
  deleteAllInShopCart
} from '@/api/user/shopCart'
import {
  orderSubmit
} from '@/api/user/order';

// import ShopCart from './shop_cart/index.vue'//使用组件的第二种方法
// import look from '@/api/user/address';//default导出的默认模块
export default {
  data() {
    return {
      shopCartDialogVisible: false,
      categoryNameInSelect: '请选择分类',
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
      categoryId: '请选择分类',
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
      // // flavor flavorData
      // dishFlavorsData: [
      //   { name: '甜味', value: ['无糖', '少糖', '半糖', '多糖', '全糖'] },
      //   { name: '温度', value: ['热饮', '常温', '去冰', '少冰', '多冰'] },
      //   { name: '忌口', value: ['不要葱', '不要蒜', '不要香菜', '不要辣'] },
      //   { name: '辣度', value: ['不辣', '微辣', '中辣', '重辣'] }
      // ],
      // 展示菜品选择，查询菜品味道等信息
      dishFlavorDialogData: {
        'name': '',
        'image': '',
        'description': '',
        'flavors': [],
      },
      dishFlavorFirstItem: '甜度',
      dishFlavorSecondItem: '温度',
      dishFlavorThirdItem: '忌口',
      dishFlavorFourthItem: '辣度',
      dishFlavor: {}, //所有味道的字典
      visualDishFlavorDialog: false,//添加味道
      visualSetmealDialog: false, //添加套餐时查询所含菜品
      dishInSetmeal: [
        {
          'name': '',
          'image': '',
          'description': '',
          'copies': 0
        }
      ],
      menuRowForSetmeal: [],
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
    async sumUpShopCart() {
      let defaultAddress = (await lookDefaultAddress()).data.data;
      // 获取当前时间
      let currentDateTime = new Date();

      // 增加一个小时
      currentDateTime.setHours(currentDateTime.getHours() + 1);

      // 格式化时间为'YYYY-MM-dd HH:mm:ss'
      let formattedDateTime = currentDateTime.toISOString().slice(0, 19).replace('T', ' ');

      console.log(formattedDateTime);
      let orderItem = {
        'addressBookId': defaultAddress['id'],
        'payMethod': 1,//1为微信，2为支付宝
        'remark': '备注1',//备注
        'estimatedDeliveryTime': formattedDateTime,//预计送达时间
        'deliveryStatus': 0,//配送状态
        'tablewareNumber': 1,//餐具数量
        'tablewareStatus': 0,
        'packAmount': 0,//打包费
        'amount': this.getCartAllAmount()
      };
      // alert('成功提交订单');//alert会阻塞当前状态
      const response = await orderSubmit(orderItem);
      if (response.data.code == 1) {
        alert('支付成功');
        this.lookCart();
      } else {
        alert('支付失败');
      }

    },
    getCartAllAmount() {
      let allAmount = 0;
      this.shopCart.forEach(cartRow => {
        allAmount += cartRow.amount * cartRow.number;
      });
      return allAmount;
    },
    getFlavorOptions(flavorName: string) {
      var dishFlavorsIndex = {};
      let judgeFlavorExist = false;
      let flavors = this.dishFlavorDialogData.flavors;
      for (let i = 0; i < flavors.length; ++i) {
        var dfd = flavors[i].name;
        if (dfd == flavorName) {
          judgeFlavorExist = true;
        }
        dishFlavorsIndex[dfd] = i;
      }
      // 事实上，在v-if中判断为false后就不会进入下一步了，所以这个是无用的
      // if(!judgeFlavorExist){
      //   return ['不存在该口味'];
      // }
      let listArray = flavors[dishFlavorsIndex[flavorName]].value;
      return listArray;
    },
    addOneItemToFlavors(key: string, oneItem: string) {
      if (this.dishFlavor == null) {
        //新建之后再赋值，防止报错。而不能直接对空的对象（会被认为是undefined)赋值或push增加元素，比如不能this.dishFlavors[key]=value
        var dishFlavor = {};
        dishFlavor[key] = oneItem;//新增
        this.dishFlavor = dishFlavor;
      } else {
        this.dishFlavor[key] = oneItem;//新增或更新
      }
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
      //this.categoryNameInSelect = '请选择分类';//bind绑定属性之后，无法动态更新？被固定了，如何做到的？通过绑定computed中的函数也无法解决这一问题。
      this.categoryId = '请选择分类';//在选择‘套餐或/和菜品’时，刷新分类提示信息
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
        this.$message({
          message: '选择分类前，请先选择菜品或者套餐',
          showClose: true,
          type: 'warning',
        })
        // this.$notify({
        //   message: '选择分类前，请先选择菜品或者套餐',
        //   showClose: true,
        //   type: 'warning',
        // })
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
      this.menuRowForSetmeal = menuRow;//套餐显示所有菜品那个组件dialog table中需要这个
      // 菜品
      if (menuRow.type == 1) {
        if (way == 'inMenu') {
          //直接引用（节省内存消耗），其实这里可以只提取其中部分所需属性，这样可以防止之后可能的修改，但是会因为拷贝（比如浅拷贝...）耗更多内存。
          this.dishFlavorDialogData = menuRow;
          var flavors = this.dishFlavorDialogData.flavors;
          // 遍历菜品自己规定好的口味
          for (let i = 0; i < flavors.length; ++i) {
            // 解析后端返回的字符串为列表
            if (typeof (flavors[i].value) == 'string') {
              flavors[i].value = JSON.parse(flavors[i].value);
            }

            let flavorName = flavors[i].name;
            // 添加菜品自己规定好的口味
            if (flavorName == '甜味') {
              this.dishFlavorFirstItem = flavors[i].value[0];// 这里默认取某种口味的第一项，可能是甜味中的无糖或半塘
            } else if (flavorName == '温度') {
              this.dishFlavorSecondItem = flavors[i].value[0];
            } else if (flavorName == '忌口') {
              this.dishFlavorThirdItem = flavors[i].value[0];
            } else if (flavorName == '辣度') {
              this.dishFlavorFourthItem = flavors[i].value[0];
            } else {
              this.$message({
                message: '试图使用不存在的口味',
                showClose: true,
                type: 'error',
              })
            }
            console.log('默认的口味为：', this.dishFlavor);
            // 添加默认的口味
            this.addOneItemToFlavors(flavorName, flavors[i].value[0]);
            // 口味编辑表单
            this.visualDishFlavorDialog = true;
            console.log('在Dialog被关闭前，后续指令会继续执行，所以这里把函数放到Dialog的确认键中');
          }
        } else { //inCart
          this.addDishToShopCart(menuRow, way);
        }
      } else if (menuRow.type == 2) { //套餐
        if (way == 'inMenu') {
          let dishInSetMeal = (await lookDishInSetmeal(menuRow.id)).data.data;
          this.dishInSetmeal = dishInSetMeal;//注意大小写！
          console.log('此时套餐内菜品信息为：', this.dishInSetmeal);
          this.visualSetmealDialog = true;//交由对话框解决
        } else {
          let response = await addShopCart({ 'setmealId': menuRow.id });
          if (response.data.code == 1) {
            alert('成功加入套餐到购物车！');//
          }
        }
      } else {
        console.log('未知类型，这种情况理论上不可能出现！此时menuRow为 ', menuRow);
      }
      this.lookCart();//刷新购物车
    },
    async addSetmealToShopCart(menuRow, way) {
      console.log('此行套餐为', menuRow);
      if (way == 'inMenu') {
        let response = await addShopCart({ 'setmealId': menuRow.id });
        if (response.data.code == 1) {
          alert('成功加入套餐到购物车！');//
        }
        this.lookCart();
        this.visualSetmealDialog = false;
      }
    },
    async addDishToShopCart(menuRow, way) {
      console.log('该行是', menuRow, '方法为：', way);
      var dishFlavor;
      console.log('this.dishFlavor', this.dishFlavor);
      if (way == 'inMenu') {
        dishFlavor = JSON.stringify(this.dishFlavor);//需要转成JSON字符串
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
    existFlavor(predictFlavor) {
      var flavors = this.dishFlavorDialogData.flavors;
      // console.log('flavors is ', flavors);
      // 遍历菜品自己规定好的口味
      for (let i = 0; i < flavors.length; ++i) {
        let flavorName = flavors[i].name;
        // 找到存在的口味
        if (flavorName == predictFlavor) {
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
      console.log('刷新购物车');
      const data = (await lookShopCart()).data.data;
      for (let i = 0; i < data.length; ++i) {
        let cartRow = data[i];
        if (cartRow.dishId != null) {
          cartRow['type'] = 1;
          cartRow['id'] = cartRow['dishId'];
          // let flavor = JSON.parse(cartRow['dishFlavor']);
          // console.log('返回到购物车的菜品口味为：', flavor);
        } else if (cartRow.setmealId != null) {
          cartRow['type'] = 2;
          cartRow['id'] = cartRow['setmealId'];
        }
      }
      this.shopCart = data;
    }
  }
}
</script>

<!-- 当我设计成scoped的时候，该vue文件中所用到的根元素如category_container以及其中的子组件（子div）
 如el-heade中el-select都会直接被data-v-xxxxxxxx标记,无论style块中是否写入新的样式
  由此可以推断出，当第三方组件和自定义的组件（如本文件）都使用了scooped进行样式私有化时，想要在本文件中修改第三方组件，
  就必须得使用样式穿透！
-->
<style lang="scss">
// .category_container {

//   // position: absolute; //奇怪的黑屏,算了
//   .shopCart {

//     position: absolute;
//     width: 80%; //成功调整宽度，参考（https://blog.csdn.net/qq_33241251/article/details/103080671）
//     left: 15%;
//     top: 20%; //尽可能给出top
//     height: 60%;
//     // bottom: 20%;
//     overflow: scroll; //这个是有效的滚动条！
//     // overflow: visible;//overflow默认值

//     .categoryShopCartTable {
//       //这个height是直接传给组件的style属性中的height（如果不加的话就是overflow: visible），即style="height: 300;"会固定表头，为表中内容添加scroll属性
//       // height: 250;
//       margin-top: 2%;

//       //el-table添加第三方的height属性后会为固定表头，自带滚动；
//       // 加上这个后（就算去掉固定表头也会）反而多上一段只能看到而无法使用的滚动条（猜测这是el-table固定了某些东西导致的）
//       // overflow: scroll;
//     }

//     .shopCartTitle {
//       position: sticky; //粘性定位
//       font-size: 40px;
//       color: #000000;
//       top: 5%;
//       z-index: 3000; // 覆盖Dialog
//     }

// }</style>
<style lang="scss" scoped>
.category_container {
  // relative:生成相对定位的元素，相对于其正常位置进行定位
  // absolute:生成绝对定位的元素，相对于static定位以外的第一个父元素进行定位，参考https://www.jianshu.com/p/de316853060e
  margin: 30px; //margin 清除周围的（外边框）元素区域。margin 没有背景颜色，是完全透明的。
  background: #f8e1bb;
  z-index: 1;
  width: 100%;

  // 这个无法调整宽度，故放弃
  ::v-deep .shopCart {

    position: absolute;
    width: 80%; //成功调整宽度，参考（https://blog.csdn.net/qq_33241251/article/details/103080671）
    left: 15%;
    top: 20%; //尽可能给出top
    height: 60%;
    // bottom: 20%;
    overflow: scroll; //这个是有效的滚动条！
    // overflow: visible;//overflow默认值

    .categoryShopCartTable {
      //这个height是直接传给组件的style属性中的height（如果不加的话就是overflow: visible），即style="height: 300;"会固定表头，为表中内容添加scroll属性
      // height: 250;
      margin-top: 2%;

      //el-table添加第三方的height属性后会为固定表头，自带滚动；
      // 加上这个后（就算去掉固定表头也会）反而多上一段只能看到而无法使用的滚动条（猜测这是el-table固定了某些东西导致的）
      // overflow: scroll;
    }

    .shopCartTitle {
      position: sticky; //粘性定位
      font-size: 40px;
      color: #000000;
      top: 5%;
      z-index: 3000; // 覆盖Dialog
    }

  }

  .justTestCart {
    position: absolute;
    bottom: 50%;
    z-index: 5000;
  }

  // 第1个自定义el-footer(共3个)， 优先级最高，因为对应的上class的路径的样式。
  // 编译后为.category_container .el-footer[data-v-1236c9ad]
  .el-footer {
    position: fixed; //固定购物车位置

    height: 20%; //
    width: 100%; //生效，100%和10%是不一样的。推测源码使用了类似穿透的功能？
    bottom: 0;
    background: #dcbe74;
    z-index: 2;

    .settlement {
      position: relative;
      background: #e7b54a;
      margin: 1%; //前后左右都有
      // margin-bottom: 2%;//外边距，控制该元素的边界border与周围元素的距离
      // padding-bottom: 2%;//内边距，控制该元素内部到边界border的距离，比如一个<p>元素中的字体到边界的距离
    }

    // 理论上来说，穿透的时候会直接影响在本文件的同个class的所有用到该第三方库组件的地方
    // 但是这里没用，待解决》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》》
    /*.categoryShopCartTable>>>.el-table__inner {
      position: relative; //fixed内用relative会失去作用
      <!-- 最大宽度（max-width）属性用于设置元素的最大宽度。当元素的实际宽度大于最大宽度时，
     元素的宽度将被限制在最大宽度之内。这对于适应不同屏幕大小的布局非常有用。 -->
      //最小宽度（min-width）属性用于设置元素的最小宽度。当元素的实际宽度小于最小宽度时，元素的宽度将被扩展到最小宽度。
      //这对于确保内容的可读性和可用性非常有用。
      min-width: 100%;
      min-height: 100%;
      padding-top: 10%;
      background: #13c150;
      top: 0%;
    }*/

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
