import puppeteer from 'puppeteer';
import { Config } from './config';
import { isHttpUrl } from './is-http-url';

import { Global } from './global'

export const createBrowser = async (config: Config) => {
	console.log('create browser:', config)
	// return await puppeteer.launch({ ...config.launch_options });
}

export const closeBrowser = async () => {
	console.log('close isConnected:', Global.browser?.isConnected?.())
	if (Global.browser?.isConnected?.()) {
		console.log('close browser')
		return await Global.browser.close();
	}
}

/**
 * Generate the output (either PDF or HTML).
 */
export const generateOutput = async (
	html: string, // html 片段
	relativePath: string, // 相对路径
	config: Config // 配置项
) => {
	console.log('--- html:', html, relativePath, html)
	const { mode } = config
	console.log('mode:', mode)
	console.log('generateOutput - isConnected:', Global.browser?.isConnected?.())

	if (mode === 'singleton') {
		if (!Global.browser?.isConnected?.()) {
			// Global.browser = await createBrowser(config)
		}
	} else {
		Global.browser = await puppeteer.launch({ devtools: config.devtools, ...config.launch_options });
	}

	console.log('browser created')

	if (!Global.browser?.isConnected?.()) {
		throw new Error('browser not launch')
	}
	try {
		const page = await Global.browser.newPage();

		await page.goto(`http://local.uban360.net:${config.port!}${relativePath}`); // make sure relative paths work as expected
		await page.setContent(html); // overwrite the page content with what was generated from the markdown

		await Promise.all([
			...config.stylesheet.map(
				async (stylesheet) => page.addStyleTag(isHttpUrl(stylesheet) ? { url: stylesheet } : { path: stylesheet }), // add each stylesheet
			),
			config.css ? page.addStyleTag({ content: config.css }) : undefined, // add custom css
		]);

		/**
		 * Trick to wait for network to be idle.
		 *
		 * @todo replace with page.waitForNetworkIdle once exposed
		 * @see https://github.com/GoogleChrome/puppeteer/issues/3083
		 */
		await Promise.all([
			page.waitForNavigation({ waitUntil: 'networkidle0' }),
			page.evaluate(() => history.pushState(undefined, '', '#')) /* eslint no-undef: off */,
		]);

		let outputFileContent: string | Buffer = '';

		if (config.devtools) {
			await new Promise((resolve) => page.on('close', resolve));
		} else if (config.as_html) {
			outputFileContent = await page.content();
		} else {
			await page.emulateMediaType('screen');
			outputFileContent = await page.pdf(config.pdf_options);
		}

		if (mode !== 'singleton') {
			await closeBrowser()
		}
		return config.devtools ? undefined : { filename: config.dest, content: outputFileContent };
	} catch(error) {
		console.error(error)
		return await closeBrowser()
	}
};

export const batchGenerateOutput = () => {

}
