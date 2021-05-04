import path from 'path';
import axios from 'axios';
import urlJoin from 'url-join';
import semver from 'semver';

/**
 * 兼容路径(mac/windows)
 * @param {string} rawPath 原始路径
 */
export function formatPath(rawPath: string) {
  return path.sep === '/' ? rawPath : rawPath.replace(/\\/g, '/');
}

export function getDefaultRegistry(isOriginal = false) {
  return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org';
}

export function getNpmInfo(npmName: string, registry: string) {
  if (!npmName) return null;

  return axios
    .get(urlJoin(registry || getDefaultRegistry(), npmName))
    .then((response) => (response.status === 200 ? response.data : null))
    .catch((err) => Promise.reject(err));
}

export async function getNpmVersions(npmName: string, registry: string) {
  const data = await getNpmInfo(npmName, registry);
  return data ? Object.keys(data.versions) : [];
}

export function getSemverVersions(baseVersion: string, versions: string[]) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVersion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));
}

export async function getNpmSemverVersion(baseVersion: string, npmName: string, registry: string) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVersions(baseVersion, versions);
  return newVersions[0] || null;
}

export async function getNpmLatestVersion(npmName: string, registry = 'https://registry.npm.taobao.org') {
  let versions = await getNpmVersions(npmName, registry);
  return versions ? versions.sort((a, b) => (semver.gt(b, a) ? 1 : -1))[0] : null;
}
