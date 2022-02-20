import request from '/@/utils/request';
import { skyVersion } from '/@/api/version'

/**
 * 角色列表
 */
export function roleList(params:object) {
	return request({
		url: `${skyVersion}/system/role`,
		method: 'get',
		params: params
	});
}

/**
 * 保存角色
 */
export function saveRole(params:object) {
	return request({
		url: `${skyVersion}/system/role`,
		method: 'post',
		data: params
	});
}

/**
 * 删除角色
 */
export function deleteRole(id:number) {
	return request({
		url: `${skyVersion}/system/role/${id}`,
		method: 'delete'
	});
}

/**
 * 更新角色权限
 */
export function updateRolePermission(id:number, params:object) {
	return request({
		url: `${skyVersion}/system/role/permission/${id}`,
		method: 'post',
		data: params
	});
}

/**
 * 获取角色权限
 */
export function getRolePermission(id:number) {
	return request({
		url: `${skyVersion}/system/role/permission/${id}`,
		method: 'get'
	});
}

/**
 * 角色绑定API接口
 */
export function roleBindApi(id:number, params:object) {
	return request({
		url: `${skyVersion}/system/role/api/${id}`,
		method: 'post',
		data: params
	});
}

/**
 * 获取角色绑定的API接口
 */
export function getRoleApi(id:number, params:object) {
	return request({
		url: `${skyVersion}/system/role/api/${id}`,
		method: 'get',
		params: params
	});
}
