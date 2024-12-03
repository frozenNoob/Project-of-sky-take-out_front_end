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
// 根据ID查看地址
export const lookAddressById = (id) =>
    request({
        'url': `/addressBook/${id}`,
        'method': 'get',
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
