const puppeteer = require('puppeteer')
const mdPdf = require('../dist');

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

const contentArray = [
	"# 测试标题",
	// "# 测试标题",
	// "# 测试标题",
	// "# 测试标题",
];

(async () => {
	console.time('doc-demo')

	const browser = await puppeteer.launch(launch_options)
	mdPdf.setConfig({
		launch_options,
	})

	const promiseArray = contentArray.map(async content => {
		console.log('start mdToPdf')
		const html = await mdPdf.toHtml("# 测试标题")
		console.log('html:', html)

		const page = await browser.newPage();
		await page.goto('https://www.baidu.com/', {
			waitUntil: 'domcontentloaded'
		}).catch(err => console.log(err));
		await page.setContent(html)
		await page.waitFor(10000)
		page.close()
	});

	const serialPromises = promises => {
		return promises.reduce(
			(prev, next) => prev.then(() => next),
			Promise.resolve()
		);
	};
	await serialPromises(promiseArray);
	console.timeEnd('doc-demo')
	browser.close()
})();
