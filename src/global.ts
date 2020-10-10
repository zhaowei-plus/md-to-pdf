import puppeteer from 'puppeteer';
import { IConfig } from './config'

// 全局对象
export module Global {
	// 全局 browser 对象
	export let browser: puppeteer.Browser;

	export let page: puppeteer.Page;

	export let browserWSEndpoint: puppeteer.BrowserContext;

	// 全局 config 对象
	export let config: IConfig;
}
