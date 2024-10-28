<template>
  <!-- <slot />：Vue 中的插槽，用于在组件内部插入内容。在这里表示显示插槽内容，也即显示在<router-link>中的任何内容。 -->
  <a v-if="isExternal(to)" :href="to" target="_blank" rel="noopener">
    <slot />
  </a>
  <router-link v-else :to="to">
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'

@Component({
  'name': 'SidebarItemLink'
})
export default class extends Vue {
  // private to!: string: 定义了一个私有属性 to，它的类型为字符串，并使用感叹号(!)表示此属性在声明时必须进行初始化。
  @Prop({ 'required': true }) private to!: string

  private isExternal = isExternal
}
</script>
