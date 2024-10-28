// 使用数组的 indexOf 方法来判断给定的用户名是否在 ['admin', 'editor'] 数组中
// trim() 方法用于去除字符串两端的空格
export const isValidUsername = (str: string) => ['admin', 'editor'].indexOf(str.trim()) >= 0;

// 使用正则表达式匹配判断给定的路径是否以 "https:", "http:", "mailto:", 或 "tel:" 开头
// ^ 表示字符串的开始，$ 表示字符串的结尾
// | 表示"或"的意思
// test() 方法用于在字符串中查找指定模式，并返回布尔值表示是否匹配
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path);
