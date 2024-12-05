import request from '@/utils/request_user'
// 新增购物车，其中data格式如下
// {
//     "dishId": 0,
//     "setmealId": 0,
//     "dishFlavor": "string"
// }
export const addShopCart = (data) =>
    request({
        'url': '/shoppingCart/add',
        'method': 'post',
        'data': data //这里使用data作为键（请求体），而非params!
    });
// 查看购物车
export const lookShopCart = () =>
    request({
        'url': `/shoppingCart/list`,
        'method': 'get',
    });
// 在购物车中删除一个物品
export const deleteOneItemInShopCart = (data) =>
    request({
        'url': `/shoppingCart/sub`,
        'method': 'post',
        'data': data
    });
// 清空购物车
export const deleteAllInShopCart = () =>
    request({
        'url': `/shoppingCart/clean`,
        'method': 'delete',
    });
