import { Config, IConfig } from './config';
import { getMarked, markedOptions } from './get-marked-with-highlighter';

// TODO HTML 模板
export const getHtml = (md: string, config: Config) => `
	<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
			</head>
			<body class="${config.body_class.join(' ')}">
				${getMarked(config.marked_options)(md)}
			</body>
		</html>
`;

/**
 * @description 生成Html页面字符串
 * @param { String } markContent
 * @param { IConfig } config
 * */
export const generateHtml = (markContent: string, config: IConfig) => {
	const { body_class = [], marked_options = {} } = config
	const bodyContent: string = markedOptions(marked_options)(markContent)

	return `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8">
			</head>
			<body class="${body_class.join(' ')}">
				${bodyContent}
			</body>
		</html>
	`
}
