import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import type { UserConfig } from 'vite';
import { loadEnv } from '/@/utils/viteBuild';

import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'

const pathResolve = (dir: string): any => {
	return resolve(__dirname, '.', dir);
};

const { VITE_PORT, VITE_OPEN, VITE_PUBLIC_PATH } = loadEnv();

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig: UserConfig = {
	plugins: [
		vue(),
		// @ts-ignore
		viteSvgIcons({
			// 指定需要缓存的图标文件夹
			iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
			// 指定symbolId格式
			symbolId: 'icon-[dir]-[name]',
		}),
	],
	root: process.cwd(),
	resolve: { alias },
	base: process.env.NODE_ENV === 'production' ? VITE_PUBLIC_PATH : './',
	optimizeDeps: {
		include: ['element-plus/lib/locale/lang/zh-cn', 'element-plus/lib/locale/lang/en', 'element-plus/lib/locale/lang/zh-tw'],
	},
	server: {
		host: '0.0.0.0',
		port: VITE_PORT,
		open: VITE_OPEN,
		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				ws: true,
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: 'dist',
		minify: 'terser',
		sourcemap: false,
		chunkSizeWarningLimit: 1500,
		rollupOptions: {
			output: {
				entryFileNames: `assets/[name].${new Date().getTime()}.js`,
				chunkFileNames: `assets/[name].${new Date().getTime()}.js`,
				assetFileNames: `assets/[name].${new Date().getTime()}.[ext]`,
				compact: true,
				manualChunks: {
					vue: ['vue', 'vue-router', 'vuex'],
					echarts: ['echarts'],
				},
			},
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
			ie8: true,
			output: {
				comments: true,
			},
		},
	},
	css: {
		postcss: {
			plugins: [
				{
					postcssPlugin: 'internal:charset-removal',
					AtRule: {
						charset: (atRule) => {
							if (atRule.name === 'charset') {
								atRule.remove();
							}
						},
					},
				},
			],
		},
	},
	define: {
		__VUE_I18N_LEGACY_API__: JSON.stringify(false),
		__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
		__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
	},
};

export default viteConfig;
