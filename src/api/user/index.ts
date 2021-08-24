import request from '/@/utils/request';
import { version } from '/@/api/version'

/**
 * 获取用户
 * @returns 返回接口数据
 */
export function getUserInfo() {
	return request({
		url: `${version}/system/user/info`,
		method: 'get'
	});
}
