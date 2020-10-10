const document = require('./document.json')
const mdPdf = require('../../dist');

var HtmlDocx = require('html-docx-js');
var fs = require('fs');

// var inputFile = process.argv[2];
// var outputFile = process.argv[3];


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

const createPdfOptions = (name) => {
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
	const options = createPdfOptions(document.name)
	await mdPdf.openBrowser(
		{
			file_download_dir: 'public/doc',
			launch_options,
			page_export_template: 'http://local.tms.uban360.net:8080/markdown1',
		}
	)
	//
	// // 导出 pdf
	// console.time('toPdf')
	// const result = await mdPdf.toPdf(
	// 	formatContent(document),
	// 	options,
	// 		`public/pdf/${document.name}.pdf`
	// )
	// console.timeEnd('toPdf')

	// 导出 doc
	console.time('toDoc')
	const result = await mdPdf.toDoc(
		document.content,
		`public/doc/${document.name}.doc`
	)
	console.timeEnd('toDoc')
	await mdPdf.closeBrowser()

	// HtmlDocx html 转 pdf
	// const html = fs.readFileSync('./assets/template.html', { encoding: 'utf8' })
	// console.log('html:', html)
	// var docx = HtmlDocx.asBlob(html);
	// fs.writeFileSync('./demo.docx', docx);
})();
