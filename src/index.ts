import { Config, defaultConfig } from './config';
import { openBrowser, closeBrowser } from './browser'
import toHtml from './to-html'
import toDoc from './to-doc'
import toPdf from './to-pdf'

import { Global } from './global'

export const setConfig =  (config: Partial<Config> = {}) => {
	if (!config.basedir) {
		config.basedir = process.cwd();
	}

	const mergedConfig: Config = {
		...defaultConfig,
		...config,
		pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options },
	};

	// 全局配置
	Global.config = mergedConfig
}

export {
	openBrowser,
	closeBrowser,
	toHtml,
	toDoc,
	toPdf
}
