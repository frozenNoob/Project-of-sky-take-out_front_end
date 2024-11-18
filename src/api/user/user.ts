import request from '@/utils/request_user'
// 修改密码
export const editPassword = (data: any) =>
    request({
        'url': '/editPassword',
        'method': 'put',
        data
    });
// 查看地址
export const lookAddress = () =>
    request({
        // /user/addressBook/list
        'url': '/addressBook/list',
        'method': 'get',
    });
// 查看店铺营业状态
export const getStatus = () =>
    request({
        // /user/addressBook/list
        'url': '/shop/status',
        'method': 'get',
    });
