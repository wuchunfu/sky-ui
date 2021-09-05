import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 获取 API 接口分组列表
 */
export function apiGroupList(params:object) {
	return request({
		url: `${version}/system/api-group`,
		method: 'get',
		params
	});
}

/**
 * 保存 API 接口分组
 */
export function saveApiGroup(params:object) {
	return request({
		url: `${version}/system/api-group`,
		method: 'post',
		data: params
	});
}

/**
 * 删除 API 接口分组
 */
export function deleteApiGroup(id:number) {
	return request({
		url: `${version}/system/api-group/${id}`,
		method: 'delete'
	});
}
