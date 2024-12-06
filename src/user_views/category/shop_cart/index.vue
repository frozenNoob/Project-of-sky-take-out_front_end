<template>
  <el-footer style="height: 40% ;max-width: 90%;">
    <P style="font-size: 40px; color: #000000">
      <i class=" el-icon-shopping-cart-2">购物车</i>
    </P>
    <el-table key="tab03" :data="shopCart" class="categoryShopCartTable"
              style="overflow: scroll; margin-top:2%;position: relative;" :stripe="true"
    >
      <!-- <el-table-column prop="categoryId" label="类型" width="180">
        <template slot-scope="scope">
          {{ scope.row.categoryId == 1 ? "菜品" : "套餐" }}
        </template>
</el-table-column> -->
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="number" label="当前数量" />
      <el-table-column prop="amount" label="单价（元）" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="dishFlavor" label="菜品口味" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" style="background-color:darkorange;"
                     @click="addToCart(scope.row, 'inCart')"
          >
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
        <i class="el-icon-view" style="font-size: 40px">
          当前总价为
        </i>
        <span style="right: 50%;">
          {{ getCartAllAmount() }}元
          <el-button size="medium" type="primary" @click="sumUpShopCart()">
            <i class="el-icon-sell" style="font-size: 40px">
              点此结算
            </i>
          </el-button>
        </span>
        <span>
          <el-button size="medium" type="danger" @click="clearAllInShopCart()">
            <i class="el-icon-delete" style="font-size: 40px">
              清空购物车
            </i>
          </el-button>
        </span>
      </p>
    </div>
  </el-footer>
</template>

<script lang="js">
</script>

<style></style>
