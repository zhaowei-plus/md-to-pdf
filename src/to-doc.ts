import path from 'path'
import fs from 'fs'
import * as fse from 'fs-extra'
import { Global } from './global'
import { renderHtml } from './render';

const HtmlDocx = require('html-docx-js');

// 监听文件变化，当文件被 rename 时（只针对小文件，媒体文件需要使用其他方法监听文件下载完成）
// function waitForFile(filePath: string) {
// 	return new Promise((resolve, reject) => {
// 		try {
// 			fs.watch(filePath, (eventType, fileName) => {
// 				console.log(`事件类型是: ${eventType} 文件名 ${fileName}`)
// 				if ('rename' === eventType) {
// 					resolve(true)
// 				}
// 			});
// 		} catch (error) {
// 			console.error(error)
// 			reject(false)
// 		}
// 	})
// }

export const parseFilePath = (filePath: string = `download/${Math.random()}.doc`) => {
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
export default async (content: string, filePath?: string) => {
	if (!Global.browser?.isConnected()) {
		throw '浏览器启动失败，请确保已经调用过 openBrowser'
	}

	await Global.page.setContent(renderHtml(content))
	// const body = renderBody(content)
	// await Global.page.$eval('#content', (dom, body) => {
	// 	console.log('body:', body)
	// 	dom.innerHTML = body
	// }, body);

	const downloadConfig = parseFilePath(filePath)
	// 指定文件下载路径
	// @ts-ignore
	await Global.page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: downloadConfig.path
	})
	fse.ensureFileSync(`${downloadConfig.path}/${downloadConfig.fileName}`)
	const html = await Global.page.content();
	// await Global.page.evaluate((params: any) => {
	// 	return new Promise((resolve, reject) => {
	// 		try {
	// 			const { html, fileName } = params
	// 			// 利用浏览器 blob 和 a连接 下载 word 文档
	// 			const blob = new Blob([html], {
	// 				type: 'application/msword,charset=UTF-8'
	// 			})
	// 			const url = window.URL.createObjectURL(blob);
	// 			var reader = new FileReader();
	// 			reader.readAsDataURL(blob);
	// 			reader.onload =  () => {
	// 				const a = document.createElement('a')
	// 				a.download = fileName
	// 				a.style.display = 'none'
	// 				a.href = url
	// 				document.body.appendChild(a)
	// 				a.click()
	// 				a.remove()
	// 				window.URL.revokeObjectURL(url)
	// 				resolve('下载完成')
	// 			};
	// 		} catch (error) {
	// 			reject(error)
	// 		}
	// 	})
	// }, { html, fileName: downloadConfig.fileName})
	// await waitForFile(`${downloadConfig.path}/${downloadConfig.fileName}`)

	const docx = HtmlDocx.asBlob(html);
	fs.writeFileSync(`${downloadConfig.path}/${downloadConfig.fileName}`, docx);
	let result: any = 'success';
	if (!filePath) {
		// 导出二进制数据
		result = fse.readFileSync(`${downloadConfig.path}/${downloadConfig.fileName}`)
		fse.removeSync(`${downloadConfig.path}/${downloadConfig.fileName}`)
	} else {
		console.log(`${downloadConfig.fileName} download complete`)
	}
	return Promise.resolve(result)
}
