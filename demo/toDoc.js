const mdPdf = require('../dist');

const launch_options = {
	headless: false,
	args: [
		'–no-sandbox',
		'--start-maximized'
	],
	defaultViewport: null,
	ignoreDefaultArgs: ['--enable-automation'],
	executablePath:
		"/Users/zhaowei/.chromium-browser-snapshots/mac-800071/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
};

const content = '# 测试标题'
const contentArray = [
	{
		content: '# 测试文件1',
		dist: '1.pdf',
	},
	{
		content: '# 测试文件1-1',
		dist: 'file/2.pdf',
	},
	{
		content: '# 测试文件2',
		dist: 'file/doc/3.pdf',
	},
	// {
	// 	content: '# 测试文件2-2',
	// 	dist: 'public/doc/2/2.pdf',
	// },
];


(async () => {
	// 设置参数
	mdPdf.setConfig({
		file_download_dir: 'public/doc',
		launch_options,
	})

	await mdPdf.openBrowser()
	console.time('toDoc')
	// 导出单个文件
	// TODO 第二个参数为存储的文件目录，如果没有，则返回下载的文件流 - 待实现
	await mdPdf.toDoc(content, '啦啦啦.doc')
	console.timeEnd('toDoc')

	console.time('batchToDoc')
	// promise 序列化
	const serialPromises = contentArray => {
		return contentArray.reduce(
			(prev, item) => prev.then(async () => await mdPdf.toDoc(item.content, item.dist)),
			Promise.resolve()
		)
	};
	await serialPromises(contentArray);
	await mdPdf.closeBrowser()
	console.timeEnd('batchToDoc')
})();
