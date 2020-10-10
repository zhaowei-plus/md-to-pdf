import { getLanguage, highlight } from 'highlight.js';
import marked, { MarkedOptions } from 'marked';
import { Global } from './global';

/**
 * @description 修改并设置 marked_options参数
 * @param { MarkedOptions } options
 * */
export const markedOptions = (options: MarkedOptions) => {
	const renderer = options.renderer ?? new marked.Renderer()

	// 对代码段的处理
	if (!renderer.code) {
		renderer.code = (code, language) => {
			const languageName = language && getLanguage(language) ? language : 'plaintext';
			return `
				<pre>
					<code class="hljs ${languageName}">
						${highlight(languageName, code).value}
					</code>
				</pre>
			`;
		}
	}

	// 重新设置参数
	marked.setOptions({
		...options,
		renderer
	});
	return marked;
}

export const renderHtml = (markContent: string) => {
	const {
		body_class = [],
		marked_options = {}
	} = Global.config
	const content: string = markedOptions(marked_options)(markContent)

	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
			</head>
			<body class="${body_class.join(' ')}">
				${content}
			</body>
		</html>
	`
}

export const renderBody = (markContent: string) => {
	const { marked_options = {} } = Global.config
	return markedOptions(marked_options)(markContent)
}
