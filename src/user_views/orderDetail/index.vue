<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="HistoryDetailedOrder">
    <el-container>
      <el-header style="font-size: 24px; color: red; font-weight: bold; font-family: Arial, sans-serif;
         text-align: center; padding: 20px 0;">
        历史订单查询
      </el-header>
      <el-container>
        <el-main>
          <template>
            <el-table :data="historyDetailedOrder['records']" :stripe="true" style=" height:
              100%;">
              <el-table-column prop="consignee" label="收货人" min-width="10%">
              </el-table-column>
              <el-table-column prop="phone" label="手机号" min-width="10%">
              </el-table-column>
              <el-table-column prop="address" label="地址" min-width="10%">
              </el-table-column>
              <el-table-column prop="orderTime" label="下单时间" min-width="10%">
              </el-table-column>
              <el-table-column prop="payMethod" label="支付方式" min-width="10%">
              </el-table-column>
              <el-table-column prop="amount" label="支付金额" min-width="10%">
              </el-table-column>
              <!-- 牢记， slot-scope里面不能套el-table-column -->
              <!-- <template slot-scope="{ row }">
                <el-table-column prop="status" label="支付状态">
                  {{ getStatus(row.status) }}
                </el-table-column>
                <el-table-column prop="payStatus" label="状态">
                  {{ getPayStatus(row.payStatus) }}
                </el-table-column>
              </template> -->
              <el-table-column label="支付状态" min-width="5%">
                <template slot-scope="{ row }">
                  {{ getStatus(row.status) }}
                </template>
              </el-table-column>
              <el-table-column label="状态" min-width="5%">
                <template slot-scope="{row}">
                  {{ getPayStatus(row.payStatus) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="20%">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="remindTheOrder(scope.row.id)">
                    催单
                  </el-button>
                  <el-button size="mini" type="primary" @click="getDetailedOrder(scope.row.id)">
                    查看订单详情
                  </el-button>
                  <el-dialog title="订单详情提示" :visible.sync="dialogVisible" width="30%">
                    <el-table :data="orderDetailList">
                      <el-table-column prop="name" label="商品名称">
                      </el-table-column>
                      <el-table-column prop="dishFlavor" label="口味">
                      </el-table-column>
                    </el-table>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
                  </el-dialog>
                  <!-- 是否为默认地址 -->
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<!-- 这个一定要规定好语法为ts,因为router.ts中有用到！ -->
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Form as ElForm, Input } from 'element-ui'
import {
  orderSubmit,
  lookHistoryOrders,
  lookOrderDetail,
  remindOrder
} from '@/api/user/order';
import axios from 'axios'

export default {
  data() {
    return {
      historyDetailedOrder: [],
      orderDetailList: [
        {
          'id': 0,
          'name': '',
          'orderId': 0,
          'dishId': 0,
          'setmealId': 0,
          'dishFlavor': '',
          'number': 0,
          'amount': 0,
          'image': ''
        }
      ],
      dialogVisible: false,
    }
  },
  mounted() {
    this.getHistoryOrders();
  },
  methods: {
    async getHistoryOrders() {
      const pageParams = {
        'page': 1,
        'pageSize': 2 ** 31 - 1,
      };
      var response = await lookHistoryOrders(pageParams);
      this.historyDetailedOrder = response.data.data;
      console.log('历史订单数据如下：', this.historyDetailedOrder['records']);
    },
    // 订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消 7退款
    getStatus(status: number) {
      if (status === 1) {
        return '待付款';
      } else if (status == 2) {
        return '待接单';
      } else if (status == 3) {
        return '已接单';
      } else if (status == 4) {
        return '派送中';
      } else if (status == 5) {
        return '已完成';
      } else if (status == 6) {
        return '已取消';
      } else if (status == 7) {
        return '退款';
      } else return '未知状态';
    },
    getPayStatus(payStatus: number) {
      if (payStatus == 0) {
        return '未支付';
      } else if (payStatus == 1) {
        return '已支付';
      } else if (payStatus == 2) {
        return '已退款';
      } else return '未知支付状态';
    },
    async getDetailedOrder(id) {
      let response = await lookOrderDetail(id);
      let orderDetailList = response.data.data.orderDetailList;
      this.orderDetailList = orderDetailList;
      console.log('订单详情为：', this.orderDetailList);
      this.dialogVisible = true;
    },
    async remindTheOrder(id) {
      let response = await remindOrder(id);
      if (response.data.code == 1) {
        console.log('催单成功,请稍等');
      } else {
        alert('催单失败');
      }
    },
  },
}
</script>

<style lang="scss"></style>
