import request from '/@/utils/request';
import { skyVersion } from '/@/api/version'

/**
 * 获取后端动态路由菜单
 */
export function getMenus() {
	return request({
		url: `${skyVersion}/system/menu/tree`,
		method: 'get'
	});
}

/**
 * 编辑菜单数据
 */
export function saveMenu(params:object) {
	return request({
		url: `${skyVersion}/system/menu`,
		method: 'post',
		data: params
	});
}

/**
 * 删除菜单
 */
export function deleteMenu(id:any) {
	return request({
		url: `${skyVersion}/system/menu/${id}`,
		method: 'delete'
	});
}

/**
 * 菜单对应的按钮
 */
export function menuButton(id:any) {
	return request({
		url: `${skyVersion}/system/menu/button/${id}`,
		method: 'get'
	});
}

/**
 * 批量删除菜单
 */
export function batchMenuButton(params:object) {
	return request({
		url: `${skyVersion}/system/menu/batch`,
		method: 'delete',
		data: params
	});
}

/**
 * 菜单绑定API
 */
export function menuBindApi(id:number, params:object) {
	return request({
		url: `${skyVersion}/system/menu/api/${id}`,
		method: 'post',
		data: params
	});
}

/**
 * 查询菜单绑定的API
 */
export function getMenuApis(id:number) {
	return request({
		url: `${skyVersion}/system/menu/api/${id}`,
		method: 'get'
	});
}

/**
 * 查询菜单绑定的API
 */
export function getMenuApiList(id:number) {
	return request({
		url: `${skyVersion}/system/menu/api-list/${id}`,
		method: 'get'
	});
}
