import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 获取后端动态路由菜单(admin)
 * @returns 返回接口数据
 */
export function getMenus() {
	return request({
		url: `${version}/system/menu/tree`,
		method: 'get'
	});
}
