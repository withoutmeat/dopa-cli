import path from 'path';
import minimist from 'minimist';

export const cwd = process.cwd();

interface Argv {
  _: [string, string];
  port?: number;
  host?: string;
}

export function resolveApp(relativePath: string) {
  return path.resolve(cwd, relativePath);
}

/** 获取命令行参数 */
export function formatCliParams() {
  return minimist(process.argv.slice(0, 2)) as Argv;
}

export const argv = formatCliParams();
