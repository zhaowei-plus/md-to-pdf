import { getLanguage, highlight } from 'highlight.js';
import marked, { MarkedOptions } from 'marked';

export const getMarked = (options: MarkedOptions) => {
	// ?? 空值合并运算法：当左边的操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数
	const renderer = options.renderer ?? new marked.Renderer();

	if (!Object.prototype.hasOwnProperty.call(renderer, 'code')) {
		renderer.code = (code, language) => {
			console.log('renderer.code:', code, language)
			const languageName = language && getLanguage(language) ? language : 'plaintext';
			return `
				<pre>
					<code class="hljs ${languageName}">${highlight(languageName, code).value}</code>
				</pre>`;
		};
	}
	marked.setOptions({ ...options, renderer });
	return marked;
};
