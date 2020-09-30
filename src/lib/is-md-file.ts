const extensions = /\.(md|mkd|mdown|markdown)(\.txt)?$/i;

// TODO 检测是否是markdown文件，我们不需要：
/**
 * Check whether a path is a markdown file.
 */
export const isMdFile = (path: string) => extensions.test(path);
