// import { promises as fs } from 'fs';
import grayMatter from 'gray-matter';
import { dirname, resolve } from 'path';
import { Config } from './config';
import puppeteer from 'puppeteer'
import { getHtml } from './get-html';
import { getMarginObject } from './helpers';
import { readFile } from './read-file';

import { waitForFile } from './waitForFile'
type cliArgs = typeof import('../cli').cliFlags;


/**
 * Convert markdown to pdf.
 */
export const convertMdToDoc = async (
	input: { path: string } | { content: string },
	config: Config,
	args: cliArgs = {} as cliArgs,
) => {
	console.log('convertMdToDoc:', config)

	const mdFileContent = 'content' in input
			? input.content
			: await readFile(input.path, args['--md-file-encoding'] ?? config.md_file_encoding);

	const { content: md, data: frontMatterConfig } = grayMatter(mdFileContent);

	// merge front-matter config
	config = {
		...config,
		...(frontMatterConfig as Config),
		pdf_options: { ...config.pdf_options, ...frontMatterConfig.pdf_options },
	};

	console.log('config:', config)

	const { headerTemplate, footerTemplate, displayHeaderFooter } = config.pdf_options;

	if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
		config.pdf_options.displayHeaderFooter = true;
	}

	// sanitize array cli arguments
	for (const option of ['stylesheet', 'body_class'] as Array<'stylesheet' | 'body_class'>) {
		if (!Array.isArray(config[option])) {
			config[option] = [config[option]].filter(Boolean) as any;
		}
	}

	// merge cli args into config
	const jsonArgs = new Set(['--marked-options', '--pdf-options', '--launch-options']);
	for (const arg of Object.entries(args)) {
		const [argKey, argValue] = arg as [string, string];
		const key = argKey.slice(2).replace(/-/g, '_');

		(config as { [key: string]: any })[key] = jsonArgs.has(argKey) ? JSON.parse(argValue) : argValue;
	}

	// sanitize the margin in pdf_options
	if (typeof config.pdf_options.margin === 'string') {
		config.pdf_options.margin = getMarginObject(config.pdf_options.margin);
	}

	// set output destination
	// if (config.dest === undefined) {
	// 	config.dest = 'path' in input ? getOutputFilePath(input.path, config.as_html ? 'html' : 'pdf') : 'stdout';
	// }

	const highlightStylesheet = resolve(
		dirname(require.resolve('highlight.js')),
		'..',
		'styles',
		`${config.highlight_style}.css`,
	);

	config.stylesheet = [...new Set([...config.stylesheet, highlightStylesheet])];

	const html = getHtml(md, config);
	console.log('generator html complete:', html)

	const output = {
		filename: config.dest,
		content: html
	};

	if (!output) {
		if (config.devtools) {
			throw new Error('No file is generated when the --devtools option is enabled.');
		}
		throw new Error(`Failed to create ${config.as_html ? 'HTML' : 'PDF'}.`);
	}

	if (output.filename) {
		console.log('puppeteer.launch:', config)
		const browser = await puppeteer.launch(config.launch_options)
		const page = await browser.newPage();
		// 指定文件下载路径
		// @ts-ignore
		await page._client.send('Page.setDownloadBehavior', {
			behavior: 'allow',
			downloadPath: resolve('./docs')
		})

		//执行原生Js方法，修改日期控件的时间
		const result = await page.evaluate((params) => {
			return new Promise((resolve, reject) => {
				try {
					const { content, fileName } = params
					const blob = new Blob([content], { type: 'application/msword;charset=utf-8' })
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement('a')
					a.download = fileName
					a.style.display = 'none'
					a.href = url
					document.body.appendChild(a)
					a.click()
					a.remove()
					window.URL.revokeObjectURL(url)
					console.log("下载完成")
					resolve('下载完成')
				} catch (error) {
					reject(error)
				}
			})
		}, { content: html, fileName: output.filename })

		// 等待文件出现
		await waitForFile(resolve(`./docs/${output.filename}`));
		console.log('文件下载结束')
		console.log('result:', result)

		// if (output.filename === 'stdout') {
		// 	process.stdout.write(output.content);
		// } else {
		// 	await fs.writeFile(output.filename, output.content);
		// }
	}
	return output;
};

/**
 * 项目 doc 导出流程：
 * 1 打开新页面
 * 2、查看文章详情
 * 3、运行js代码，获取id为content的html片段和页面样式，导出doc文件到指定目录
 * 4、打包目录
 * 5、返回二进制流数据
 * */
