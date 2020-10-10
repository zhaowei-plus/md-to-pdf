const puppeteer = require('puppeteer-core')
const Blob = require('blob');
const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const launch_options = {
	headless: false,
	args: [
		// "--disable-gpu",
		// "--disable-dev-shm-usage",
		// "--disable-setuid-sandbox",
		// "--no-first-run",
		// "--no-sandbox",
		// "--no-zygote",
		// "--single-process",
		'–no-sandbox',
		'--start-maximized'
	],
	defaultViewport: null,
	ignoreDefaultArgs: ['--enable-automation'],
	executablePath:
		"/Users/zhaowei/.chromium-browser-snapshots/mac-800071/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
};

function waitForFile(fileName){
	return new Promise((resolve, reject) => {
		try {
			fs.watch(fileName, (eventType, filename) => {
				console.log(`事件类型是: ${eventType}`)
				resolve(true)
			});
		} catch(error) {
			console.error(error)
			reject(false)
		}
	})

	//
	// return new Promise(function(resolve, reject){
	// 	// 定时轮询查看文件是否已存在
	// 	let timeout = 1000
	// 	let timer = setTimeout(function() {
	// 		fs.access(fileName, fs.constants.R_OK, (err)=>{
	// 			if(!err){
	// 				resolve(`文件 ${fileName} 已出现.`)
	//
	// 				// 移动文件到指定目录
	// 			}else{
	// 				reject(new Error(`文件 ${fileName} 未找到.`))
	// 			}
	// 		})
	// 	}, timeout)
	//
	// 	fs.access(fileName, fs.constants.R_OK, (err)=>{
	// 		if(!err){
	// 			clearTimeout(timer)
	// 			resolve(`文件 ${fileName} 已存在.`)
	// 		}
	// 	})
	// })
}

(async () => {
	const browser = await puppeteer.launch(launch_options)
	const page = await browser.newPage();
	await page.goto('https://www.npmjs.com/package/file-saver', { waitUntil: 'domcontentloaded' }).catch(err => console.log(err));
	// await page.setContent('<p>')
	// await page.addScriptTag({ path: './fileSaver.js' })

	// console.log('content:', content)

	// 指定文件下载路径
	await page._client.send('Page.setDownloadBehavior', {
		behavior: 'allow',
		downloadPath: path.resolve('./docs')
	})

	const getModelHtml = (mhtml, style = '') => {
		return `
        Content-Type: text/html; charset="utf-8"
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        ${style}
      </style>
      </head>
      <body id="">
        ${mhtml}
      </body>
      </html>
      `
	}

	const content = getModelHtml('<h1>哈哈哈哈，大老板1234</h1>')
	const fileName = 'body.doc'

	const useClientType = true

	// 创建一个空文件
	fse.ensureFileSync(fileName)
	if (useClientType) {
		// 调用浏览器的文件下载方式保存为 doc 文件
		const result = await page.evaluate((params) => {
			return new Promise((resolve, reject) => {
				try {
					const { content, fileName } = params
					const blob = new Blob([content], { type: 'application/msword;charset=utf-8' })
					const url = window.URL.createObjectURL(blob);
					var reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onload = function (e) {
						console.log('reader onload')
						const a = document.createElement('a')
						a.download = fileName
						a.style.display = 'none'
						a.href = url
						document.body.appendChild(a)
						a.click()
						a.remove()
						window.URL.revokeObjectURL(url)
						console.log("下载完成")
						resolve(true)
					};
				} catch (error) {
					reject(error)
				}
			})
		}, { content, fileName })
		// 等待文件出现
		console.time('watch file')
		const waitResult = await waitForFile(path.resolve(`./docs/${fileName}`));
		console.timeEnd('watch file')

		console.log('文件下载结束:', waitResult)
		console.log('result:', result)
		console.log('关闭页面')
		console.log('关闭浏览器')
	} else {
		// 返回页面 Blob 对象，node 下载文件
		// 调用浏览器的文件下载方式保存为 doc 文件
		const resultBlob = await page.evaluate((params) => {
			const { content, fileName } = params
			const blob = new Blob([content], {
				type: 'application/msword;charset=utf-8'
			})
			console.log('blob:', fileName, blob)
			return blob
		}, { content, fileName })
		console.log('resultBlob:', resultBlob);

		const docBuffer = Buffer.from(content, 'application/msword;charset=utf-8')
		console.log('docBuffer:', docBuffer)

		// 等待文件出现
		// await waitForFile(path.resolve(`./docs/${fileName}`));
	}

	await page.close();
	await browser.close();

	// await page.pdf()
})();
