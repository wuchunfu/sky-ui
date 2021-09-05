import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 角色列表
 */
export function apiList(params:object) {
	return request({
		url: `${version}/system/api`,
		method: 'get',
		params: params
	});
}

/**
 * 保存角色
 */
export function saveApi(params:object) {
	return request({
		url: `${version}/system/api`,
		method: 'post',
		data: params
	});
}

/**
 * 删除角色
 */
export function deleteApi(id:number) {
	return request({
		url: `${version}/system/api/${id}`,
		method: 'delete'
	});
}
