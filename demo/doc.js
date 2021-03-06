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
	// "# 测试标题",
	// "# 测试标题",
	// "# 测试标题",
];

(async () => {
	console.time('doc-demo')
	const promiseArray = contentArray.map(async content => {
		console.log('start mdToPdf')
		return await mdToPdf(
			{ content: "# 测试标题" },
			{
				mode: 'singleton',
				dest: `doc${Math.random()}.doc`,
				launch_options
			},
			'doc'
		).catch(console.error);
	});

	const serialPromises = promises => {
		return promises.reduce(
			(prev, next) => prev.then(() => next),
			Promise.resolve()
		);
	};
	await serialPromises(promiseArray);
	console.timeEnd('doc-demo')
})();
