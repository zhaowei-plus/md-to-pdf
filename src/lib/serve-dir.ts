import { createServer, Server } from 'http';
import serveHandler from 'serve-handler';
import { Config } from './config';

/**
 * Serve a directory on a random port using a HTTP server and the serve-handler package.
 *
 * @returns a promise that resolves with the server instance once the server is ready and listening.
 *
 * 使用HTTP服务器和serve-handler程序包在随机端口上提供目录。
 *
 * 一旦服务器准备就绪且正在侦听，则返回与服务器实例一起解析的promise。
 */
export const serveDirectory = async ({ basedir, port }: Config) =>
	new Promise<Server>((resolve) => {
		const server = createServer(
			async (request, response) =>
				serveHandler(request, response, {
					public: basedir
				}));
		server.listen(port, () => resolve(server));
	});

/**
 * Close the given server instance asynchronously.
 */
export const closeServer = async (server: Server) => new Promise((resolve) => server.close(resolve));

// 两个类：server类
// html - 基本转换
// doc
// pdf
// png
