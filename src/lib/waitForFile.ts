import fs from "fs";

// TODO 现在会有问题
// pupperteer 模拟文件下载时，见听不到文件下载成功，只能通过轮询检测指定目录下的文件是否存在，如果文件存在则下载成功，
// 问题：如果下载的时比较大的文件，是否存在文件未下载完毕就关闭浏览器的情况呢
export const waitForFile = (fileName: any) => {
	return new Promise(function(resolve, reject){
		// 定时轮询查看文件是否已存在
		let timeout = 10000

		// @ts-nocheck
		let timer = setTimeout(function() {
		// @ts-ignore
			fs.access(fileName, fs.constants.R_OK, (err) => {
				if(!err){
					resolve(`文件 ${fileName} 已出现.`)
					// 移动文件到指定目录
				}else{
					reject(new Error(`文件 ${fileName} 未找到.`))
				}
			})
		}, timeout)

		// @ts-ignore
		fs.access(fileName, fs.constants.R_OK, (err)=>{
			if(!err){
				clearTimeout(timer)
				resolve(`文件 ${fileName} 已存在.`)
			}
		})
	})
}
