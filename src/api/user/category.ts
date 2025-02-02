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
        'params': {
            'type': type
        }
    });
// 根据菜品分类ID查看菜品
export const lookDishById = (categoryId) =>
    request({
        'url': `/dish/list`,
        'method': 'get',
        'params': {
            'categoryId': categoryId
        }
    });
// 根据套餐分类ID查看菜品
export const lookSetmealById = (categoryId) =>
    request({
        'url': `/setmeal/list`,
        'method': 'get',
        'params': {
            'categoryId': categoryId
        }
    });
// 查看套餐内的菜品
export const lookDishInSetmeal = (id) =>
    request({
        'url': `/setmeal/dish/${id}`,
        'method': 'get',
    });
