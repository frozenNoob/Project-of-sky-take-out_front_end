<template>
  <section class="app-main">
    <!-- 过渡用的动画效果 -->
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view />
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  'name': 'AppMain'
})
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.app-main {
  height: calc(100% - 64px);
  overflow-y: auto;
}
</style>
