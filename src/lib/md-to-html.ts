import grayMatter from 'gray-matter';
import { dirname, resolve } from 'path';
// import { Config } from './config';
import { getHtml } from './get-html';
// import { getOutputFilePath } from './get-output-file-path';
// import { getMarginObject } from './helpers';
// import { readFile } from './read-file';

// import { Global } from './lib/global'

// type cliArgs = typeof import('../cli').cliFlags;

/**
 * Convert markdown to pdf.
 */
export const convertMdToHtml = async (
	content: string,
	// input: { path: string } | { content: string },
	dist: string,
	// config: Config,
	// args: cliArgs = {} as cliArgs,
) => {
	console.log('dist:', dist)
	const mdFileContent = content
		// 'content' in input ?
		// input.content :
		// await readFile(input.path, args['--md-file-encoding'] ?? config.md_file_encoding);

	const { content: md } = grayMatter(mdFileContent);

	// merge front-matter config
	// config = {
	// 	...config,
	// 	...(frontMatterConfig as Config),
	// 	pdf_options: { ...config.pdf_options, ...frontMatterConfig.pdf_options },
	// };

	const { headerTemplate, footerTemplate, displayHeaderFooter } = Global.config.pdf_options;

	if ((headerTemplate || footerTemplate) && displayHeaderFooter === undefined) {
		Global.config.pdf_options.displayHeaderFooter = true;
	}

	// sanitize array cli arguments
	for (const option of ['stylesheet', 'body_class'] as Array<'stylesheet' | 'body_class'>) {
		if (!Array.isArray(Global.config[option])) {
			Global.config[option] = [Global.config[option]].filter(Boolean) as any;
		}
	}

	// merge cli args into config
	// const jsonArgs = new Set(['--marked-options', '--pdf-options', '--launch-options']);
	// for (const arg of Object.entries(args)) {
	// 	const [argKey, argValue] = arg as [string, string];
	// 	const key = argKey.slice(2).replace(/-/g, '_');
	//
	// 	(config as { [key: string]: any })[key] = jsonArgs.has(argKey) ? JSON.parse(argValue) : argValue;
	// }

	// sanitize the margin in pdf_options
	// if (typeof config.pdf_options.margin === 'string') {
	// 	config.pdf_options.margin = getMarginObject(config.pdf_options.margin);
	// }

	// set output destination
	// if (config.dest === undefined) {
	// 	config.dest = 'path' in input ? getOutputFilePath(input.path, config.as_html ? 'html' : 'pdf') : 'stdout';
	// }

	const highlightStylesheet = resolve(
		dirname(
			require.resolve('highlight.js')
		), '..', 'styles', `${Global.config.highlight_style}.css`,);

	Global.config.stylesheet = [...new Set([...Global.config.stylesheet, highlightStylesheet])];
	return getHtml(md, Global.config);
};
