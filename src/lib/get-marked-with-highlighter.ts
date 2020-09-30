import { getLanguage, highlight } from 'highlight.js';
import marked, { MarkedOptions } from 'marked';


// TODO 配置 marked 库，
export const getMarked = (options: MarkedOptions) => {
	// options markdown转html 的配置项
	// ?? 空值合并运算法：当左边的操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数
	const renderer = options.renderer ?? new marked.Renderer();
	if (!Object.prototype.hasOwnProperty.call(renderer, 'code')) {
		renderer.code = (code, language) => {
			const languageName = language && getLanguage(language) ? language : 'plaintext';
			return `
				<pre>
					<code class="hljs ${languageName}">
						${highlight(languageName, code).value}
					</code>
				</pre>`;
		};
	}
	marked.setOptions({
		...options, renderer
	});
	return marked;
};


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
