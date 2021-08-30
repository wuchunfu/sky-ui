import { Module } from 'vuex';
// 此处加上 `.ts` 后缀报错，具体原因不详
import { requestRoutesState, RootStateTypes } from '/@/store/interface/index';

const requestRoutesModule: Module<requestRoutesState, RootStateTypes> = {
	namespaced: true,
	state: {
		requestRoutes: [],
		requestButtons: {}
	},
	mutations: {
		getBackEndControlRoutes(state: any, data: any) {
			state.requestRoutes = data.menu;
			state.requestButtons = data.button;
		},
	},
	actions: {
		setBackEndControlRoutes({ commit }, data: any) {
			commit('getBackEndControlRoutes', data);
		},
	},
};

export default requestRoutesModule;
