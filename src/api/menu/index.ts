import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 获取后端动态路由菜单
 */
export function getMenus() {
	return request({
		url: `${version}/system/menu/tree`,
		method: 'get'
	});
}

/**
 * 编辑菜单数据
 */
export function saveMenu(params:object) {
	return request({
		url: `${version}/system/menu`,
		method: 'post',
		data: params
	});
}

/**
 * 删除菜单
 */
export function deleteMenu(id:any) {
	return request({
		url: `${version}/system/menu/${id}`,
		method: 'delete'
	});
}

/**
 * 删除菜单
 */
export function menuButton(id:any) {
	return request({
		url: `${version}/system/menu/${id}`,
		method: 'get'
	});
}

/**
 * 批量删除菜单
 */
export function batchMenuButton(params:object) {
	return request({
		url: `${version}/system/menu/batch`,
		method: 'delete',
		data: params
	});
}
