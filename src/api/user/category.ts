import request from '@/utils/request_user'

export const lookDishAll = () =>
    request({
        // /user/dish/list
        'url': '/dish/listAll',
        'method': 'get',
    });
export const lookSetmealAll = () =>
    request({
        // /user/setmeal/list
        'url': '/setmeal/listAll',
        'method': 'get',
    });
// type=1为菜品分类，type=2为套餐分类
export const lookCategoryByType = (type) =>
    request({
        'url': `/category/list`,
        'method': 'get',
        'params':{
            'type': type
        }
    });
// 根据菜品分类ID查看菜品
export const lookDishById = (categoryId) =>
    request({
        'url': `/dish/list`,
        'method': 'get',
        'params':{
            'categoryId': categoryId
        }
    });
// 根据套餐分类ID查看菜品
export const lookSetmealById = (categoryId) =>
    request({
        'url': `/setmeal/list`,
        'method': 'get',
        'params':{
            'categoryId': categoryId
        }
    });
// 新增地址
export const addAddress = (data) =>
    request({
        'url': '/addressBook',
        'method': 'post',
        data
    });
// 删除地址
export const deleteAddress = (id) =>
    request({
        'url': `/addressBook`,
        'method': 'delete',
        'params': {
            'id': id
        }
    });
// 更新地址
export const updateAddress = (data) =>
    request({
        'url': '/addressBook',
        'method': 'put',
        data
    });
