const fs = require("fs");
const { mdToPdf, createBrowser, closeBrowser } = require('../dist');
const Mark = require('../dist')

const launch_options = {
	headless: true,
	args: [
		// "--disable-gpu",
		// "--disable-dev-shm-usage",
		// "--disable-setuid-sandbox",
		// "--no-first-run",
		// "--no-sandbox",
		// "--no-zygote",
		// "--single-process"
	],
	executablePath:
		"/Users/zhaowei/.chromium-browser-snapshots/mac-800071/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
};

const contentArray = [
	"# 测试标题",
	"# 测试标题",
	"# 测试标题",
	"# 测试标题",
];

(async () => {
	console.time('demo')

	Mark.setConfig({
		launch_options,
	})

	await Mark.toHtml("# 测试标题", 'html/index.html')
	await Mark.batchToHtml([
		{
			content: "# 测试标题",
			dist: 'htmls/index/html'
		}
	])

	await Mark.toPdf("# 测试标题", 'pdf/index.pdf')
	await Mark.batchToPdf([
		{
			content: "# 测试标题",
			dist: 'htmls/index.pdf'
		}
	])

	await Mark.toDoc("# 测试标题", 'html/index.doc')
	await Mark.batchToDoc([
		{
			content: "# 测试标题",
			dist: 'htmls/index.do'
		}
	])


	const promiseArray = contentArray.map(async content => {
		console.log('start mdToPdf')
		return await mdToPdf(
			{ content: "# 测试标题" },
			{
				mode: 'singleton',
				dest: `demo/demo${Math.random()}.pdf`,
				launch_options
			},
			'pdf'
		).catch(console.error);
	});

	const serialPromises = promises => {
		return promises.reduce(
			(prev, next) => prev.then(() => next),
			Promise.resolve()
		);
	};
	await createBrowser()
	await serialPromises(promiseArray);
	await closeBrowser();
	console.timeEnd('demo')
})();
