const projects = require('./projects.json')
const mdPdf = require('../../dist');

const formatContent = ({ name, creator, gmtModified, content, attachments }) => {
	let md = `# ${name}\n`;
	md += `${creator.name} ${gmtModified.replace(/-/g, "/")}\n`;
	md += content;
	if (attachments && attachments.length) {
		md += "\n## 附件";
		JSON.parse(attachments).forEach(it => {
			md += `\n- [${it.name}](${it.url})`;
		});
	}
	return md;
}

const createPdfOptions = ({ name }) => {
	return {
		// format: 'A4',
		// margin: '10mm',
		// printBackground: true, // 打印背景图形
		displayHeaderFooter: true, // 打印页眉页脚

		// 页眉页脚：date(格式化的打印日期)、title(文件标题)、url(文件位置)、pageNumber、totalPages
		headerTemplate: `
        <style>
          section {
            margin: 0 auto;
            font-family: system-ui;
            font-size: 11px;
          }
        </style>
        <section>
          <span>${name}</span>
        </section>`,
		footerTemplate: `
        <section>
          <div>
            第 <span class="pageNumber"></span> 页 共计<span class="totalPages"></span>页
          </div>
        </section>`
	};
}

const launch_options = {
	headless: true,
	args: [
		'–no-sandbox',
		'--start-maximized'
	],
	defaultViewport: null,
	ignoreDefaultArgs: ['--enable-automation'],
	executablePath:
		"/Users/zhaowei/.chromium-browser-snapshots/mac-800071/chrome-mac/Chromium.app/Contents/MacOS/Chromium"
};

(async () => {
	// 设置参数
	mdPdf.setConfig({
		file_download_dir: 'public/doc',
		launch_options,
	})

	// console.time('batchToPdf')
	// await mdPdf.openBrowser()
	// const promiseArray = projects.map(async item => {
	// 	await mdPdf.toPdf(
	// 		formatContent(item),
	// 		`${item.name}.pdf`,
	// 		createPdfOptions(item)
	// 	)
	// });
	// await Promise.all(promiseArray);
	// await mdPdf.closeBrowser()
	// console.timeEnd('batchToPdf')

	console.time('batchToDoc')
	const serialPromises = contentArray => {
		return contentArray.reduce(
			(prev, item) => prev.then(
				async () => await mdPdf.toDoc(formatContent(item), `${item.name}.doc`)),
			Promise.resolve()
		)
	};

	await mdPdf.openBrowser()
	await serialPromises(projects);
	await mdPdf.closeBrowser()
	console.timeEnd('batchToDoc')
})();
