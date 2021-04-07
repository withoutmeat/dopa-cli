import { Command } from 'commander';
import { startBuild } from '@dopa/webpack';

class BuildAppCommand {
  install(program: Command) {
    program.command('build').description('生产环境打包').action(this.action);
  }

  action = async () => {
    startBuild();
  };
}

export const buildAppCommand = new BuildAppCommand();
