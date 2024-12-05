<!-- eslint-disable vue/camelcase -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="AddressList">
    <el-container>
      <el-header style="font-size: 24px; color: red; font-weight: bold; font-family: Arial, sans-serif;
         text-align: center; padding: 20px 0;">
        地址管理
        <el-button size="mini" type="primary" @click="dialogFormVisible_for_create = true">
          新增地址
        </el-button>
        <el-dialog title="新增地址的form表单" :visible.sync="dialogFormVisible_for_create">
          <el-form ref="tableData" :model="tableData" label-width="80px">
            <el-form-item label="收货人">
              <el-input v-model="tableData.consignee"></el-input>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="tableData.detail"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="tableData.phone"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleCreate">
                立即创建
              </el-button>
              <el-button @click="dialogFormVisible_for_create = false">
                取消
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-header>
      <el-container>
        <el-main>
          <template>
            <el-table :data="address_data" :stripe="true" style="width: 100%; height: 100%;">
              <el-table-column prop="consignee" label="收货人" width="180">
              </el-table-column>
              <el-table-column prop="phone" label="手机号" width="180">
              </el-table-column>
              <el-table-column prop="detail" label="详细地址">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row.id)">
                    编辑
                  </el-button>
                  <el-dialog title="编辑地址用的Form表单" :visible.sync="dialogFormVisible_for_update">
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
                        <el-button @click="dialogFormVisible_for_update = false">
                          取消
                        </el-button>
                      </el-form-item>
                      <!-- <el-form-item label="性别">
                        <el-select v-model="editTableData.gender" placeholder="选择性别">
                          <el-option label="男" value="1"></el-option>
                          <el-option label="女" value="0"></el-option>
                        </el-select>
                      </el-form-item> -->
                    </el-form>
                  </el-dialog>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">
                    删除
                  </el-button>
                  <!-- 是否为默认地址 -->
                  <el-button size="mini" type="primary" @click="setAddressStatus(scope.row)">
                    {{ getAddressStatus(scope.row.isDefault) }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Form as ElForm, Input } from 'element-ui'
import axios from 'axios'

import {
  lookAddress,
  lookAddressById,
  addAddress,
  deleteAddress,
  updateAddress,
  setDefaultAddress,
  lookDefaultAddress,
} from '@/api/user/address'
// 相当于使用export default class extends Vue，由此使用mounted等方法。而非自定义类export default class
export default {
  data() {
    return {
      address_data: {},//响应中的地址信息
      //新增地址功能中的提交表单
      tableData: {
        'userId': 6,
        'consignee': '收货人2',
        'detail': '小区2',
        'isDefault': 0,
        'phone': '13680581801'
      },
      // 修改地址功能的查询回显和提交表单
      editTableData: {
        'id': 1,
        'userId': 6,
        'consignee': '收货人2',
        'detail': '小区2',
        'isDefault': 0,
        'phone': '13680581801'
      },
      dialogFormVisible_for_create: false,
      dialogFormVisible_for_update: false,
    }
  },
  mounted() {
    this.getAddressList();
  },
  methods: {
    async setAddressStatus(addressInformation) {
      addressInformation['isDefault'] = addressInformation['isDefault'] == 1 ? 0 : 1;
      await setDefaultAddress(addressInformation);
    },
    getAddressStatus(isDefault: number) {
      if (isDefault == 1) {
        return '取消默认地址';
      } else {
        return '设置为默认地址';
      }
    },
    async getAddressList() {
      const response = await lookAddress();
      this.address_data = response.data.data;
      console.log(`用户地址数据如下：${this.address_data}为类型，详细数据如下:\n`, this.address_data);
    },
    async handleCreate() {
      await addAddress(this.tableData);
      console.log('成功创建地址信息');
      this.getAddressList();//重新获取数据
      this.dialogFormVisible_for_create = false;
    },

    async handleEdit(id) {
      this.editTableData = (await lookAddressById(id)).data.data;
      this.dialogFormVisible_for_update = true
    },
    async update_after_on_submit() {
      await updateAddress(this.editTableData);
      console.log('成功更新地址簿');
      this.getAddressList();//重新获取数据
      this.dialogFormVisible_for_update = false;
    },
    async handleDelete(id) {
      const res = await deleteAddress(id);
      console.log(`删除了id为${id}的地址`);
      this.getAddressList();//重新获取数据
    }
  }
}
</script>

<style lang="scss">
.AddressList {
  // border-radius: 17px;
  // padding: 11px 20px !important;
  // margin-top: 10px;
  // font-weight: 500;
  // font-size: 12px;
  // border: 0;
  // font-weight: 500;
  // color: #333333;
  // background: #09a57a;
  background-color: #dee0e1;
}
</style>
