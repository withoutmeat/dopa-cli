import path from 'path';
import pkgDir from 'pkg-dir';
import fse from 'fs-extra';
// @ts-expect-error
import npminstall from 'npminstall';
import log from '@taco-cli/log';
import { formatPath, getNpmLatestVersion, getDefaultRegistry } from '@taco-cli/utils';
import pathExists from 'path-exists';

interface PackageProps {
  name: string;
  version: string;
  targetPath: string;
  storePath: string;
}

export default class Package {
  name: string;
  version: string;
  targetPath: string;
  storePath: string;

  constructor(options: PackageProps) {
    this.name = '@vue/shared';
    this.version = options.version;
    this.targetPath = options.targetPath;
    this.storePath = options.storePath;

    log.verbose('package: ', this.name + '@' + this.version);
  }

  get packagePath(): string {
    return path.resolve(this.storePath, `_${this.name.replace('/', '_')}@${this.version}@${this.name}`);
  }

  getSpecificCacheFilePath(version: string) {
    return path.resolve(this.storePath, `_${this.name.replace('/', '_')}@${version}@${this.name}`);
  }

  async prepare() {
    if (this.storePath && !pathExists(this.storePath)) {
      fse.mkdirpSync(this.storePath);
    }
    if (this.version === 'latest') {
      this.version = (await getNpmLatestVersion(this.name)) || 'latest';
    }
  }

  async exists() {
    await this.prepare();
    log.verbose('检查包是否存在: ', this.name);
    return pathExists(this.storePath + '/' + this.name);
  }

  async install() {
    log.verbose('安装: ', this.name + this.version);

    await npminstall({
      root: this.targetPath,
      pkgs: [{ name: this.name, version: this.version }],
      registry: getDefaultRegistry(),
      storePath: this.storePath,
    });
  }

  async update() {
    log.verbose('检查包的版本是否需要更新: ', this.name + this.version);
    // 1. 获取最新的npm模块版本号
    // const latestPackageVersion = await getNpmLatestVersion(this.name);

    // if (latestPackageVersion == null) throw new Error('get latestPackageVersion failed');

    // 2. 查询最新版本号对应的路径是否存在
    // const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);

    // 3. 如果不存在，则直接安装最新版本
    if (!pathExists(this.packagePath)) {
      log.verbose('更新包到: ', this.name + '@' + this.version);
      await this.install();
    } else {
      log.verbose(`${this.name}`, '版本无需要更新');
    }

    // this.version = latestPackageVersion;
  }

  async getMainFilePath() {
    const dir = await pkgDir(this.packagePath);
    return dir ? formatPath(path.resolve(dir, require(path.resolve(dir, 'package.json')).main)) : null;
  }
}
