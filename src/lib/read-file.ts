import { promises as fs } from 'fs';
import iconv from 'iconv-lite';

/**
 * Read a file with the given encoding, and return its content as a string.
 *
 * Uses iconv-lite to solve some issues with Windows encodings.
 */
// TODO 我们不需要从文件中读取内容
export const readFile = async (file: string, encoding = 'utf8') =>
	// @ts-ignore
	/utf-?8/i.test(encoding) ? fs.readFile(file, { encoding }) : iconv.decode(await fs.readFile(file), encoding);
