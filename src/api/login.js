import request from '../utils/request';

// get 例
// export function getLogin (query) {
//     return request({
//         url: '/login/',
//         method: 'get',
//         params: query
//     });
// };

export function getLogin (data) {
    return request({
        url: '/api/login/',
        method: 'post',
        data
    });
};
