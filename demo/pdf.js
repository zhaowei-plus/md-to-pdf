const puppeteer = require('puppeteer')
const fileSaver = require('file-saver')
const Blob = require('blob');
const path = require('path')
const fs = require('fs')

const launch_options = {
	headless: true,
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
	return new Promise(function(resolve, reject){
		// 定时轮询查看文件是否已存在
		let timeout = 1000
		let timer = setTimeout(function() {
			fs.access(fileName, fs.constants.R_OK, (err)=>{
				if(!err){
					resolve(`文件 ${fileName} 已出现.`)

					// 移动文件到指定目录
				}else{
					reject(new Error(`文件 ${fileName} 未找到.`))
				}
			})
		}, timeout)

		fs.access(fileName, fs.constants.R_OK, (err)=>{
			if(!err){
				clearTimeout(timer)
				resolve(`文件 ${fileName} 已存在.`)
			}
		})
	})
}

(async () => {
	const browser = await puppeteer.launch(launch_options)
	const page = await browser.newPage();
	await page.goto('https://www.baidu.com/', {
		waitUntil: 'networkidle2' }
		).catch(err => console.log(err));

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
	await page.setContent(content)
	await page.pdf({ path: './demo/demo.pdf', format: 'A4', printBackground: true })

	console.log('文件下载结束')
	console.log('关闭页面')
	console.log('关闭浏览器')
	await page.close();
	await browser.close();

	// await page.pdf()
})();
