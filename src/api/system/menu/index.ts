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
 * 菜单对应的按钮
 */
export function menuButton(id:any) {
	return request({
		url: `${version}/system/menu/button/${id}`,
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

/**
 * 菜单绑定API
 */
export function menuBindApi(params:object) {
	return request({
		url: `${version}/system/menu/bind/api`,
		method: 'post',
		data: params
	});
}

/**
 * 菜单接触绑定API
 */
export function menuUnBindApi(params:object) {
	return request({
		url: `${version}/system/menu/unbind/api`,
		method: 'delete',
		data: params
	});
}

/**
 * 查询菜单绑定的API
 */
export function getMenuApis(id:number) {
	return request({
		url: `${version}/system/menu/api/${id}`,
		method: 'get'
	});
}

/**
 * 查询菜单绑定的API
 */
export function getMenuApiList(id:number) {
	return request({
		url: `${version}/system/menu/api-list/${id}`,
		method: 'get'
	});
}
