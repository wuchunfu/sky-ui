<template>
	<div class="body">
		<div class="body-user">
			<SvgIcon class="svg-icon" name="gaoguai-user"></SvgIcon>
			<div class="body-user-title">
				<div class="body-user-title-welcome">Hello lanyulei</div>
				<div class="body-user-title-memo">当前时间：{{ formatDate(dateTime, 'YYYY-mm-dd HH:MM:SS') }}</div>
			</div>
		</div>
		<div class="platform-info mt5">
			<div class="platform-info-title">平台信息</div>
			<el-card class="box-card">
				<div class="platform-info-body">
					<div class="platform-info-body-row">
						<div class="platform-info-body-row-value">v3.2.0</div>
						<div class="platform-info-body-row-title">集群版本</div>
					</div>
					<div class="platform-info-body-row">
						<div class="platform-info-body-row-value">v3.2.0</div>
						<div class="platform-info-body-row-title">Docker 版本</div>
					</div>
					<div class="platform-info-body-row">
						<div class="platform-info-body-row-value">v3.2.0</div>
						<div class="platform-info-body-row-title">节点数量</div>
					</div>
					<div class="platform-info-body-row">
						<div class="platform-info-body-row-value">v3.2.0</div>
						<div class="platform-info-body-row-title">应用数量</div>
					</div>
				</div>
			</el-card>
		</div>
		<el-row :gutter="20">
			<el-col :span="17">
				<div class="platform-info mt20">
					<div class="platform-info-title">资源用量</div>
					<el-card class="box-card">
						<div style="display: flex">
							<div style="width: 400px">
								<Radar></Radar>
							</div>
							<div class="resource-consumption ml50 mt18">
								<div class="resource-consumption-data common-row">
									<div style="height: 80px; width: 80px;" class="ml5">
										<Pie height="100%" width="100%" chartId="cpu-pie-chart"></Pie>
									</div>
									<div style="width: 100%; display: flex; padding: 20px 20px 20px 10px; font-size: 13px">
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">4%</div>
											<div class="mt5" style="color: #79879C">CPU</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">0.29 cores</div>
											<div class="mt5" style="color: #79879C">已使用</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">8 cores</div>
											<div class="mt5" style="color: #79879C">总计</div>
										</div>
									</div>
								</div>
								<div class="resource-consumption-data common-row mt15">
									<div style="height: 80px; width: 80px;" class="ml5">
										<Pie height="100%" width="100%" chartId="memory-pie-chart"></Pie>
									</div>
									<div style="width: 100%; display: flex; padding: 20px 20px 20px 10px; font-size: 13px">
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">4%</div>
											<div class="mt5" style="color: #79879C">CPU</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">0.29 cores</div>
											<div class="mt5" style="color: #79879C">已使用</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">8 cores</div>
											<div class="mt5" style="color: #79879C">总计</div>
										</div>
									</div>
								</div>
								<div class="resource-consumption-data common-row mt15">
									<div style="height: 80px; width: 80px;" class="ml5">
										<Pie height="100%" width="100%" chartId="pods-pie-chart"></Pie>
									</div>
									<div style="width: 100%; display: flex; padding: 20px 20px 20px 10px; font-size: 13px">
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">4%</div>
											<div class="mt5" style="color: #79879C">CPU</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">0.29 cores</div>
											<div class="mt5" style="color: #79879C">已使用</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">8 cores</div>
											<div class="mt5" style="color: #79879C">总计</div>
										</div>
									</div>
								</div>
								<div class="resource-consumption-data common-row mt15">
									<div style="height: 80px; width: 80px;" class="ml5">
										<Pie height="100%" width="100%" chartId="disk-pie-chart"></Pie>
									</div>
									<div style="width: 100%; display: flex; padding: 20px 20px 20px 10px; font-size: 13px">
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">4%</div>
											<div class="mt5" style="color: #79879C">CPU</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">0.29 cores</div>
											<div class="mt5" style="color: #79879C">已使用</div>
										</div>
										<div style="width: 33%">
											<div style="font-weight: 700" class="mt2">8 cores</div>
											<div class="mt5" style="color: #79879C">总计</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</el-card>
				</div>
				<div class="platform-info mt20">
					<div class="platform-info-title">工具</div>
					<el-card class="box-card">
						<el-row :gutter="10">
							<el-col :span="12">
								<div style="display: flex; padding: 12px;" class="common-row platform-info-tools">
									<div style="width: 50px">
										<SvgIcon style="font-size: 35px" name="terminal"></SvgIcon>
									</div>
									<div style="width: 60%">
										<div style="font-weight: 700">kubectl</div>
										<div style="color: #79879C;" class="mt3">命令行工具，用于控制当前集群。</div>
									</div>
								</div>
							</el-col>
							<el-col :span="12">
								<div style="display: flex; padding: 12px;" class="common-row platform-info-tools">
									<div style="width: 50px">
										<SvgIcon style="font-size: 36px" name="config"></SvgIcon>
									</div>
									<div style="width: 60%">
										<div style="font-weight: 700">kubeconfig</div>
										<div style="color: #79879C;" class="mt3">配置文件，用于配置当前集群的访问信息。</div>
									</div>
								</div>
							</el-col>
						</el-row>
					</el-card>
				</div>
			</el-col>
			<el-col :span="7">
				<div class="platform-info mt20">
					<div class="platform-info-title">Kubernetes 状态</div>
					<el-card class="box-card" style="font-size: 13px; padding: 6px;">
						<div style="display: flex">
							<div style="width: 50%">
								<div style="font-weight: 700;">4.98 ms</div>
								<div style="color: #79879C;" class="mt5">API 请求延迟</div>
							</div>
							<div style="width: 50%">
								<div style="font-weight: 700;">9.200 times/s</div>
								<div style="color: #79879C;" class="mt5">每秒 API 请求数</div>
							</div>
						</div>
						<div style="display: flex" class="mt20">
							<div style="width: 50%">
								<div style="font-weight: 700;">33</div>
								<div style="color: #79879C;" class="mt5">调度次数</div>
							</div>
							<div style="width: 50%">
								<div style="font-weight: 700;">-</div>
								<div style="color: #79879C;" class="mt5">调度失败次数</div>
							</div>
						</div>
					</el-card>
				</div>
				<div class="platform-info platform-node-info mt20">
					<div class="platform-info-title">节点</div>
					<el-card class="box-card" style="font-size: 13px; padding: 6px;">
						<template #header>
							<div class="card-header">
								<span>资源用量 Top 5</span>
							</div>
						</template>
						<div style="display: flex; padding: 12px;" class="common-row mb8">
							<div style="width: 60px">
								<SvgIcon style="font-size: 35px" name="node"></SvgIcon>
							</div>
							<div style="width: 60%">
								<div style="font-weight: 700">kvm-10-115-92-95</div>
								<div style="color: #79879C;" class="mt3">10.115.92.95</div>
							</div>
							<div style="width: 30%">
								<div style="font-weight: 700">4%</div>
								<div style="color: #79879C;" class="mt3">CPU用量</div>
							</div>
						</div>
						<div style="display: flex; padding: 12px;" class="common-row mb8">
							<div style="width: 60px">
								<SvgIcon style="font-size: 35px" name="node"></SvgIcon>
							</div>
							<div style="width: 60%">
								<div style="font-weight: 700">kvm-10-115-92-95</div>
								<div style="color: #79879C;" class="mt3">10.115.92.95</div>
							</div>
							<div style="width: 30%">
								<div style="font-weight: 700">4%</div>
								<div style="color: #79879C;" class="mt3">CPU用量</div>
							</div>
						</div>
						<div style="display: flex; padding: 12px;" class="common-row">
							<div style="width: 60px">
								<SvgIcon style="font-size: 35px" name="node"></SvgIcon>
							</div>
							<div style="width: 60%">
								<div style="font-weight: 700">kvm-10-115-92-95</div>
								<div style="color: #79879C;" class="mt3">10.115.92.95</div>
							</div>
							<div style="width: 30%">
								<div style="font-weight: 700">4%</div>
								<div style="color: #79879C;" class="mt3">CPU用量</div>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>

		<!--    <div class="title">欢迎来到 zeus 管理平台</div>-->
		<!--    <div class="data">-->
		<!--      <div style="font-size: 15px;">系统使用过程中有任何问题，请及时联系以下同事，排名不分先后，谁有时间谁处理：</div>-->
		<!--      <div style="margin-top: 20px">美办：<b>贾瑞宾</b>，邮箱：<b>jiaruibin@gome.com.cn</b></div>-->
		<!--      <div style="margin-top: 20px">美办：<b>鲁刚</b>，邮箱：<b>lugang9@gome.com.cn</b></div>-->
		<!--      <div style="margin-top: 20px">美办：<b>兰玉磊</b>，邮箱：<b>lanyulei1@gome.com.cn</b></div>-->
		<!--      <div style="margin-top: 20px">-->
		<!--        <a href="http://wiki.intra.gomeplus.com/pages/viewpage.action?pageId=106963937" target="_blank">-->
		<!--          点击此处，跳转至 zeus 使用手册-->
		<!--        </a>-->
		<!--      </div>-->
		<!--    </div>-->
	</div>
</template>

<script>
import SvgIcon from '/@/components/svgIcon/index.vue';
import {onBeforeUnmount, onMounted, reactive, toRefs} from "vue";
import {formatDate} from '/@/utils/formatTime';
import Radar from '/@/components/echarts/radar.vue'
import Pie from '/@/components/echarts/pie.vue'

export default {
	name: `HomeIndex`,
	components: {
		SvgIcon, Radar, Pie
	},
	setup() {
		const state = reactive({
			dateTime: new Date(),
			interval: undefined
		});

		onMounted(() => {
			state.interval = setInterval(function() {
				state.dateTime = new Date();
			}, 1000);
		})

		onBeforeUnmount(() => {
			if (state.interval) {
				clearInterval(state.interval);
			}
		})

		return {
			formatDate,
			...toRefs(state)
		}
	}
}
</script>

<style lang="scss" scoped>
@import '/@/theme/views/home/index';
</style>
