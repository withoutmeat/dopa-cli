import path from 'path';
import { Command } from 'commander';
import Package from '@taco-cli/package';
import log from '@taco-cli/log';

const commandToPackageMap: { [k: string]: string } = {
  'create-app': '@taco-cli/create-app',
};

const CACHE_DIR = 'dependencies';

export default async function exec() {
  const homePath = process.env.CLI_HOME_PATH!;
  const targetPath = process.env.CLI_TARGET_PATH || path.resolve(homePath, CACHE_DIR);
  const storePath = path.resolve(targetPath, 'node_modules');

  log.verbose('homePath: ', homePath);
  log.verbose('targetPath: ', targetPath);
  log.verbose('storePath: ', storePath);

  const args = Array.from(arguments);

  const command: Command = args[args.length - 1];

  const pkg = new Package({
    name: commandToPackageMap[command.name()],
    version: 'latest',
    targetPath,
    storePath,
  });

  console.log(pkg);

  if (await pkg.exists()) {
    await pkg.update();
  } else {
    await pkg.install();
  }

  const mainFilePath = await pkg.getMainFilePath();

  if (mainFilePath) {
    log.verbose(`${pkg.name} 入口文件: `, mainFilePath);
    // require(mainFilePath).apply(null, args);
  } else {
    throw new Error(`${pkg}'s main not found`);
  }
}
