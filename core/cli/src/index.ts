import { Cli } from './Cli';
import exec from '@taco-cli/exec';

export default function main() {
  const program = new Cli('taco');

  program
    .command('create-app [appName]')
    .alias('app')
    .description('新建项目')
    .option('-f, --force', '如果文件已存在，是否强制覆盖', false)
    .option('-t, --template <template>', '选择一个模板')
    .action(exec);

  program.parse(process.argv);
}
