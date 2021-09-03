import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 角色列表
 */
export function roleList(params:object) {
	return request({
		url: `${version}/system/role`,
		method: 'get',
		params: params
	});
}

/**
 * 保存角色
 */
export function saveRole(params:object) {
	return request({
		url: `${version}/system/role`,
		method: 'post',
		data: params
	});
}

/**
 * 删除角色
 */
export function deleteRole(id:number) {
	return request({
		url: `${version}/system/role/${id}`,
		method: 'delete'
	});
}
