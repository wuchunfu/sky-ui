<template>
	<el-form class="login-content-form">
		<el-form-item>
			<el-input
				type="text"
				:placeholder="$t('message.account.accountPlaceholder1')"
				prefix-icon="el-icon-user"
				v-model="ruleForm.username"
				clearable
				autocomplete="off"
			>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-input
				:type="isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')"
				prefix-icon="el-icon-lock"
				v-model="ruleForm.password"
				autocomplete="off"
			>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="isShowPassword = !isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
<!--		<el-form-item>-->
<!--			<el-row :gutter="15">-->
<!--				<el-col :span="16">-->
<!--					<el-input-->
<!--						type="text"-->
<!--						maxlength="4"-->
<!--						:placeholder="$t('message.account.accountPlaceholder3')"-->
<!--						prefix-icon="el-icon-position"-->
<!--						v-model="ruleForm.code"-->
<!--						clearable-->
<!--						autocomplete="off"-->
<!--					></el-input>-->
<!--				</el-col>-->
<!--				<el-col :span="8">-->
<!--					<div class="login-content-code">-->
<!--						<span class="login-content-code-img">1234</span>-->
<!--					</div>-->
<!--				</el-col>-->
<!--			</el-row>-->
<!--		</el-form-item>-->
		<el-form-item>
			<el-button type="primary" class="login-content-submit" round @click="onSignIn" :loading="loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts">
import { toRefs, reactive, defineComponent, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { signIn } from '/@/api/login';
import { getUserInfo } from '/@/api/system/user';
export default defineComponent({
	name: 'login',
	setup() {
		const store = useStore();
		const route = useRoute();
		const router = useRouter();
		const state = reactive({
			isShowPassword: false,
			ruleForm: {
				username: 'lanyulei',
				password: 'lanyulei'
			},
			loading: {
				signIn: false,
			},
		});
		// 时间获取
		const currentTime = computed(() => {
			return formatAxis(new Date());
		});
		// 登录
		const onSignIn = async () => {
			state.loading.signIn = true;
			let defaultAuthPageList: Array<string> = [];
			let defaultAuthBtnList: Array<string> = [];
			// admin 页面权限标识，对应路由 meta.auth，用于控制路由的显示/隐藏
			let adminAuthPageList: Array<string> = ['admin'];
			// admin 按钮权限标识
			let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
			// test 页面权限标识，对应路由 meta.auth，用于控制路由的显示/隐藏
			let testAuthPageList: Array<string> = ['test'];
			// test 按钮权限标识
			let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
			// 不同用户模拟不同的用户权限
			if (state.ruleForm.username === 'admin') {
				defaultAuthPageList = adminAuthPageList;
				defaultAuthBtnList = adminAuthBtnList;
			} else {
				defaultAuthPageList = testAuthPageList;
				defaultAuthBtnList = testAuthBtnList;
			}

			// 获取token
			const loginResponse = await signIn(state.ruleForm)
			// 存储 token 到浏览器缓存
			Session.set('token', loginResponse.data);

			// 获取用户信息
			const userInfoResponse = await getUserInfo()
			const userInfos = userInfoResponse.data
			userInfos.photo = state.ruleForm.username === 'admin'
						? 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg'
						: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=317673774,2961727727&fm=26&gp=0.jpg'
			userInfos.time = new Date().getTime()
			userInfos.authPageList = defaultAuthPageList
			userInfos.authBtnList = defaultAuthBtnList
			// 存储用户信息到浏览器缓存
			Session.set('userInfo', userInfos);
			// 1、请注意执行顺序(存储用户信息到vuex)
			store.dispatch('userInfos/setUserInfos', userInfos);

			// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
			await initBackEndControlRoutes();
			// 执行完 initBackEndControlRoutes，再执行 signInSuccess
			signInSuccess();
		};
		// 登录成功后的跳转
		const signInSuccess = () => {
			// 登录成功，跳到转首页
			// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
			// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
			if (route.query?.redirect) {
				router.push({
					path: route.query?.redirect,
					query: Object.keys(route.query?.params).length > 0 ? JSON.parse(route.query?.params) : '',
				});
			} else {
				router.push('/');
			}
		};
		return {
			currentTime,
			onSignIn,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	.login-content-password {
		display: inline-block;
		width: 25px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		display: flex;
		align-items: center;
		justify-content: space-around;
		.login-content-code-img {
			width: 100%;
			height: 40px;
			line-height: 40px;
			background-color: #ffffff;
			border: 1px solid rgb(220, 223, 230);
			color: #333;
			font-size: 16px;
			font-weight: 700;
			letter-spacing: 5px;
			text-indent: 5px;
			text-align: center;
			cursor: pointer;
			transition: all ease 0.2s;
			border-radius: 4px;
			user-select: none;
			&:hover {
				border-color: #c0c4cc;
				transition: all ease 0.2s;
			}
		}
	}
	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
