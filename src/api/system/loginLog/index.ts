import request from '/@/utils/request';
import { skyVersion } from '/@/api/version'

/**
 * 获取登陆日志
 */
export function getLoginLogList(params:object) {
	return request({
		url: `${skyVersion}/system/login-log`,
		method: 'get',
		params
	});
}

/**
 * 删除登陆日志
 */
export function deleteLoginLog(id:number) {
	return request({
		url: `${skyVersion}/system/login-log/${id}`,
		method: 'delete'
	});
}

