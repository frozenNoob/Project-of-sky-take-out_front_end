// 这个文件是为了.ts文件能正常使用Vue模块而添加的
// declare module是在TypeScript中声明一个模块的语法。
// 它通常用于为JavaScript模块（如npm包）或其他非TypeScript文件（如Vue的单文件组件）提供类型信息。
// 这样，在TypeScript代码中引入这些模块时，编译器会使用你在.d.ts文件中定义的类型信息进行类型检查和代码提示。
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'is-promise'

declare module '@/config.json'
