import fs from "fs";

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
