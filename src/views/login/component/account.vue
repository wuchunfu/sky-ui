<template>
	<el-form class="login-content-form">
		<el-form-item>
			<el-input
				type="text"
				:placeholder="$t('message.account.accountPlaceholder1')"
				:prefix-icon="User"
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
				:prefix-icon="Lock"
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
<!--						:prefix-icon="Position"-->
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

			// 获取token
			await signIn(state.ruleForm).then(async res => {
				// 存储 token 到浏览器缓存
				Session.set('token', res.data);

				// 获取用户信息
				const userInfoResponse = await getUserInfo()
				const userInfos = userInfoResponse.data
				userInfos.time = new Date().getTime()
				// 存储用户信息到浏览器缓存
				Session.set('userInfo', userInfos);
				// 1、请注意执行顺序(存储用户信息到vuex)
				store.dispatch('userInfos/setUserInfos', userInfos);

				// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
				await initBackEndControlRoutes();
				// 执行完 initBackEndControlRoutes，再执行 signInSuccess
				signInSuccess();
			}).catch(() => {
				state.loading.signIn = false;
			})
		};
		// 登录成功后的跳转
		const signInSuccess = () => {
			// 登录成功，跳到转首页
			// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
			// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
			if (route.query?.redirect) {
				router.push({
					// @ts-ignore
					path: route.query?.redirect,
					// @ts-ignore
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
