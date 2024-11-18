<!-- eslint-disable vue/camelcase -->
<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div class="login">
    <p style="text-align: center;">
      地址管理
    </p>
    <template>
      <el-table :data="form_data" :stripe="true" style="width: 100%">
        <el-table-column prop="consignee" label="收货人" width="180">
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="180">
        </el-table-column>
        <el-table-column prop="detail" label="详细地址">
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Form as ElForm, Input } from 'element-ui'
import axios from 'axios'

import {
  lookAddress
} from '@/api/user/user'

export default {
  data() {
    return {
      form_data: []
    }
  },
  mounted() {
    this.getAddressList();
  },
  methods: {
    async getAddressList() {
      const data = await lookAddress();
      this.form_data = data.data.data;
      console.log(`用户地址数据如下：${this.form_data}`);
    }
  }
}
</script>

<style lang="scss"></style>
