#!/usr/bin/env node

import getPort from 'get-port';
import { Config, defaultConfig } from './lib/config';
import { getDir } from './lib/helpers';
import { convertMdToPdf } from './lib/md-to-pdf';
import { convertMdToDoc } from './lib/md-to-doc';
import { serveDirectory } from './lib/serve-dir';

/**
 * Convert a markdown file to PDF.
 */
// @ts-ignore
export const mdToPdf = async (
	input: { path: string } | { content: string }, 
	config: Partial<Config> = {},
	type: 'pdf' | 'doc'
) => {
	if (!('path' in input ? input.path : input.content)) {
		throw new Error('Specify either content or path.');
	}

	if (!config.port) {
		config.port = await getPort();
	}

	if (!config.basedir) {
		config.basedir = 'path' in input ? getDir(input.path) : process.cwd();
	}

	if (!config.dest) {
		config.dest = '';
	}

	const mergedConfig: Config = {
		...defaultConfig,
		...config,
		pdf_options: { ...defaultConfig.pdf_options, ...config.pdf_options },
	};

	if (type === 'pdf') {
		const server = await serveDirectory(mergedConfig);
		const pdf = await convertMdToPdf(input, mergedConfig);
		server.close();
		return pdf;
	} else if (type === 'doc') {
		await convertMdToDoc(input, mergedConfig)
	}
};

export default mdToPdf;

export interface PackageJson {
	engines: {
		node: string;
	};
	version: string;
}
