import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			config.headers.common['Authorization'] = `Bearer ${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 20000) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 30001 || res.code === 30002 || res.code === 30003) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				ElMessageBox.alert('你已被登出，请重新登录', '提示', {})
					.then(() => {})
					.catch(() => {});
			} else if (res.code === 30004) {
				Session.clear();
			}
			ElMessage.error(res.code + ', ' + res.message);
			return Promise.reject(service.interceptors.response);
		} else {
			return response.data;
		}
	},
	(error) => {
		let errResponse = error.response.data
		if (errResponse.code && errResponse.code !== 20000) {
			ElMessage.error(errResponse.code + ', ' + errResponse.message);
		} else {
			// 对响应错误做点什么
			if (error.message.indexOf('timeout') != -1) {
				ElMessage.error('网络超时');
			} else if (error.message == 'Network Error') {
				ElMessage.error('网络连接错误');
			} else {
				if (error.response.data) ElMessage.error(error.response.statusText);
				else ElMessage.error('接口路径找不到');
			}
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
