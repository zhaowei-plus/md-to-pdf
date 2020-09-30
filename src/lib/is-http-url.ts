/**
 * Check whether the input is a url.
 *
 * @returns `true` if a URL can be constructed from `input`, `false` otherwise.
 */
// TODO 我们的场景不需要
export const isHttpUrl = (input: string) => {
	try {
		// TODO 有没有必要实例一个对象，可以受用字符串匹配
		return new URL(input).protocol.startsWith('http');
	} catch {
		return false;
	}
};
