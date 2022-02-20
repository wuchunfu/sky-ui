import request from '/@/utils/request';
import { skyVersion } from '/@/api/version'

/**
 * 获取用户
 */
export function getUserInfo() {
	return request({
		url: `${skyVersion}/system/user/info`,
		method: 'get'
	});
}

/**
 * 获取用户
 */
export function getUserInfoById(id:number) {
	return request({
		url: `${skyVersion}/system/user/info/${id}`,
		method: 'get'
	});
}

/**
 * 获取用户列表
 */
export function getUserList(params:object) {
	return request({
		url: `${skyVersion}/system/user`,
		method: 'get',
		params: params,
	});
}

/**
 * 创建用户
 */
export function createUser(params:object) {
	return request({
		url: `${skyVersion}/system/user`,
		method: 'post',
		data: params,
	});
}

/**
 * 删除用户
 */
export function deleteUser(id:number) {
	return request({
		url: `${skyVersion}/system/user/${id}`,
		method: 'delete'
	});
}

/**
 * 更新用户
 */
export function editUser(id:number, params:object) {
	return request({
		url: `${skyVersion}/system/user/${id}`,
		method: 'put',
		data: params
	});
}
