import { Module } from 'vuex';
// 此处加上 `.ts` 后缀报错，具体原因不详
import { requestRoutesState, RootStateTypes } from '/@/store/interface/index';

const requestRoutesModule: Module<requestRoutesState, RootStateTypes> = {
	namespaced: true,
	state: {
		requestRoutes: [],
	},
	mutations: {
		getBackEndControlRoutes(state: any, data: object) {
			state.requestRoutes = data;
		},
	},
	actions: {
		setBackEndControlRoutes({ commit }, routes: Array<string>) {
			commit('getBackEndControlRoutes', routes);
		},
	},
};

export default requestRoutesModule;
