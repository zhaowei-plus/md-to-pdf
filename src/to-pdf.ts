import path from 'path'
import fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render';

export const parseFilePath = (filePath: string) => {
	const {
		dir,
		name,
		ext,
	} = path.parse(filePath)
	return {
		path: dir,
		fileName: `${name}${ext}`,
	}
}

// 下载到指定目录
export default async (content: string, options: any, filePath?: string) => {
	const { pdf_options } = Global.config
	const html = renderHtml(content)
	if (!Global.browser?.isConnected()) {
		throw '浏览器启动失败，请确保已经调用过 openBrowser'
	}

	await Global.page.setContent(html)

	// await Global.page.$eval('#content', (dom, body) => {
	// 	dom.innerHTML = body
	// }, body);

	let result;
	try {
		if (filePath) {
			const downloadConfig = parseFilePath(filePath)
			fse.ensureDir(downloadConfig.path)
			result = await Global.page.pdf({
				...pdf_options,
				...options,
				path: `${downloadConfig.path}/${downloadConfig.fileName}`
			})
		} else {
			result = await Global.page.pdf({
				...pdf_options,
				...options
			})
		}
	} catch (error) {
		throw error
	}
	console.log(`${filePath} export complete`)
	return Promise.resolve(result)
}
