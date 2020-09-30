import { join, parse } from 'path';

/**
 * Derive the output file path from a source file.
 */

export const getOutputFilePath = (mdFilePath: string, extension: 'html' | 'pdf') => {
	// 解析路径
	/**
	 * path.parse 解析路径，如 c:\\app\\img\\icon\\a.png，解析结果为
	 {
	 	root: 'c:\\',
  	dir: 'c:\\app\\img\\icon',
  	base: 'a.png',
  	ext: '.png',文件扩展名很重要以后会经常用
  	name: 'a'
	 */
	const { dir, name } = parse(mdFilePath);
	return join(dir, `${name}.${extension}`);
};


/**
 * @description 解析路径，并格式化扩展名，不同环境的路径表示方式不同
 * @param { string } filePath
 * @param { 'html' | 'pdf' ' } ext
 * */
export const parseFilePath = (filePath: string, ext: 'html' | 'pdf') => {
	const { dir, name } = parse(filePath);
	return join(dir, `${name}.${ext}`);
}
