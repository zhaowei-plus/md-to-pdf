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

	console.log('mdToPdf:', input, config, type)

	if (!('path' in input ? input.path : input.content)) {
		throw new Error('Specify either content or path.');
	}

	if (!config.port) {
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
		const server = await serveDirectory(mergedConfig);
		const pdf = await convertMdToPdf(input, mergedConfig);
		server.close();
		return pdf;
	} else if (type === 'doc') {
		await convertMdToDoc(input, mergedConfig)
	}
};
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
