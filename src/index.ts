#!/usr/bin/env node

import getPort from 'get-port';
import { Config, defaultConfig } from './lib/config';
import { getDir } from './lib/helpers';
import { convertMdToPdf } from './lib/md-to-pdf';
import { convertMdToDoc } from './lib/md-to-doc';
import { serveDirectory } from './lib/serve-dir';
import { createBrowser, closeBrowser } from './lib/generate-output'

// import { Global } from './lib/global'

/**
 * Convert a markdown file to PDF.
 */
// @ts-ignore
export const mdToPdf = async (
	input: { path: string } | { content: string },
	config: Partial<Config> = {},
	type: 'pdf' | 'doc'
) => {
	// 基本参数校验
	console.log('mdToPdf:', input, config, type)

	// TODO 第一版只支持内容导出html，不支持文件导出html

	if (!('path' in input ? input.path : input.content)) {
		throw new Error('Specify either content or path.');
	}



	if (!config.port) {
		// 获取可用的端口号
		config.port = await getPort();
	}

	if (!config.basedir) {
		config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
	}

	if (!config.dest) {
		config.dest = '';
	}

	const mergedConfig: Config = {
		...defaultConfig,
		...config,
		pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options },
	};

	console.log('type:', type)

	if (type === 'pdf') {
		console.log('convertMdToPdf')
		// TODO 为啥要创建一个服务器
		const server = await serveDirectory(mergedConfig);
		const pdf = await convertMdToPdf(input, mergedConfig);
		server.close();
		return pdf;
	} else if (type === 'doc') {
		await convertMdToDoc(input, mergedConfig)
	}
};

/**
 * 公共步骤：
 * 1、参数校验
 * 2、创建服务器
 * 3、解析markdown文件为html（目前仅支持全量导出，可以导出string、也可以导出文件）
 * 		需要支持单个解析和批量解析
 * 4、pdf导出：
 * 		1）启动 puppeteer 创建一个 chrome 实例，实例话一个 page仅生成一个tab页，按顺序加载html并导出pdf
 * 		2）启动 puppeteer 创建一个 chrome 实例，实例话一个 page仅生成一个tab页，按顺序加载html并导出pdf
 * */

//
// export const setConfig = async (config: Partial<Config> = {}) => {
// 	if (!config.port) {
// 		config.port = await getPort();
// 	}
//
// 	const mergedConfig: Config = {
// 		...defaultConfig,
// 		...config,
// 		pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options },
// 	};
//
// 	Global.config = mergedConfig
// 	console.log('Global.config:', Global.config)
// }
//
// // content: 1 字符串 2 文件路径
// // dist: 1 为空则返回文件流 2 不是空值，生成文件
// export const toHtml = async (content: string, dist: string) => {
// 	// await getPort();
// 	console.log('content:', content)
// 	console.log('dist:', dist)
// 	const server = await serveDirectory(Global.config);
// 	await convertMdToHtml(content, dist);
// 	console.log('to generator html')
// 	server.close();
// }
//
// export const batchToHtml = (configs = []) => {
// 	console.log('batchToHtml:', configs)
// }
//
// export const toPdf = (content: string, dist: string) => {
// 	console.log('toPdf content:', content)
// 	console.log('toPdf dist:', dist)
// }
//
// export const batchToPdf = () => {
//
// }
//
// export const toDoc = () => {
//
// }
//
// export const batchToDoc = () => {
//
// }

export  {
	closeBrowser,
	createBrowser
}

export default mdToPdf;

export interface PackageJson {
	engines: {
		node: string;
	};
	version: string;
}
