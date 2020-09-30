import { promises as fs } from 'fs';
import grayMatter from 'gray-matter';
import { dirname, resolve } from 'path';
import { Config } from './config';
import { generateOutput } from './generate-output';
import { getHtml } from './get-html';
import { getOutputFilePath } from './get-output-file-path';
import { getMarginObject } from './helpers';
import { readFile } from './read-file';

type cliArgs = typeof import('../cli').cliFlags;

/**
 * Convert markdown to pdf.
 */
export const convertMdToPdf = async (
	input: { path: string } | { content: string },
	config: Config,
	args: cliArgs = {} as cliArgs,
) => {

	/**
	 * 获取markwodn内容：
	 *
	 * 如果是文件路径，则 按照 md_file_encoding 读取文件，默认是 --md-file-encoding 读取 markdown 文件
	 * */
	const mdFileContent = 'content' in input ? input.content :
		await readFile(input.path, args['--md-file-encoding'] ??
			config.md_file_encoding
		);

	// 解析 markdown 文件，分离声明信息和主内容
	const { content: md, data: frontMatterConfig } = grayMatter(mdFileContent);

	// merge front-matter config
	// 合并配置信息
	config = {
		...config,
		...(frontMatterConfig as Config),

		// 转pdf的配置
		pdf_options: {
			...config.pdf_options,
			...frontMatterConfig.pdf_options
		},
	};

	// header 和 footer 配置
	const {
		headerTemplate,
		footerTemplate,
		displayHeaderFooter,
	} = config.pdf_options;

	if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
		config.pdf_options.displayHeaderFooter = true;
	}

	/*********** cli 支持 ***********/

	// sanitize array cli arguments
	// 清理数组 cli 参数
	// 配置 stylesheet body_class
	for (const option of ['stylesheet', 'body_class'] as Array<'stylesheet' | 'body_class'>) {
		if (!Array.isArray(config[option])) {
			config[option] = [config[option]].filter(Boolean) as any;
		}
	}

	// merge cli args into config
	const jsonArgs = new Set([
		'--marked-options',
		'--pdf-options',
		'--launch-options'
	]);
	for (const arg of Object.entries(args)) {
		const [argKey, argValue] = arg as [string, string];
		const key = argKey.slice(2).replace(/-/g, '_');
		(config as { [key: string]: any })[key] = jsonArgs.has(argKey) ? JSON.parse(argValue) : argValue;
	}

	/*********** cli 支持 技术，我们不需要这一块 ***********/

	// 序列化 margin
	// sanitize the margin in pdf_options
	if (typeof config.pdf_options.margin === 'string') {
		config.pdf_options.margin = getMarginObject(config.pdf_options.margin);
	}

	// 输出文件路径配置
	// set output destination
	if (config.dest === undefined) {
		config.dest = 'path' in input ?
			getOutputFilePath(input.path,
				config.as_html ?
					'html' : 'pdf'
			) :
			'stdout';
	}

	// highlight 样式配置
	const highlightStylesheet = resolve(
		dirname(require.resolve('highlight.js')),
		'..',
		'styles',
		`${config.highlight_style}.css`,
	);
	// 样式序列化成数组
	config.stylesheet = [
		...new Set([
			...config.stylesheet,
			highlightStylesheet
		])
	];

	// TODO 根据配置项生成HTML模板
	const html = getHtml(md, config);

	// 输入文件路径
	const relativePath = 'path' in input ?
		resolve(input.path).replace(config.basedir, '') : '/';

	const output = await generateOutput(html, relativePath, config);
	console.log('generateOutput complete:', relativePath);

	if (!output) {
		if (config.devtools) {
			throw new Error('No file is generated when the --devtools option is enabled.');
		}

		throw new Error(`Failed to create ${config.as_html ? 'HTML' : 'PDF'}.`);
	}

	if (output.filename) {
		if (output.filename === 'stdout') {
			process.stdout.write(output.content);
		} else {
			await fs.writeFile(output.filename, output.content);
		}
	}

	return output;
};
