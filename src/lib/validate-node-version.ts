import semver from 'semver';
import { PackageJson } from '..';

const pkg: PackageJson = require('../../package');

// TODO 校验 node 版本
export const validateNodeVersion = () => semver.satisfies(process.versions.node, pkg.engines.node);
