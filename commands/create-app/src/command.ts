import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { green } from 'chalk';
import { prompt } from 'enquirer';
import log from '@taco-cli/log';

export interface Options {
  appName?: string;
  force?: boolean;
  template?: string;
}

const TEMPLATES = ['vue3'];

const cwd = process.cwd();

const renameFiles: { [prop: string]: string } = {
  _env: '.env',
};

class CreateAppCommand {
  install(program: Command) {
    program
      .command('create-app [appName]')
      .alias('app')
      .description('新建项目')
      .option('-f, --force', '如果文件已存在，是否强制覆盖', false)
      .option('-t, --template <template>', '选择一个模板')
      .action(this.action);
  }

  action = async (appName: string | undefined, _options: Omit<Options, 'appName'>) => {
    const options = { appName, ..._options };

    await this.confirmAppName(options);

    if (options.appName == undefined) return;

    if ((await this.confirmForceRemoveIfTargetDiExists(options)) === false) return;

    await this.confirmTemplate(options);

    if (options.template == undefined) return;

    const root = path.join(cwd, options.appName);

    log.verbose('项目路径: ', root);

    const templateDir = path.join(__dirname, `template-${options.template}`);

    log.verbose('项目模板: ', templateDir);

    const files = fs.readdirSync(templateDir);

    const write = (file: string, content?: string) => {
      const targetPath = path.join(root, renameFiles[file] || file);

      log.verbose('创建文件: ', renameFiles[file] || file);

      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };

    for (const file of files.filter((f) => f !== 'package.json')) {
      write(file);
    }

    const pkg = require(path.join(templateDir, `package.json`));
    pkg.name = path.basename(root);
    write('package.json', JSON.stringify(pkg, null, 2));
    console.log();
    console.log(green(`项目${options.appName}创建成功!`));
    console.log();
  };

  async confirmAppName(options: Options) {
    if (options.appName == void 0) {
      const { name } = await prompt<{ name: string }>({
        type: 'input',
        name: 'name',
        message: `Project name:`,
        initial: 'taco-app',
      });

      options.appName = name;
    }

    return options.appName;
  }

  async confirmTemplate(options: Options) {
    if (options.template == void 0) {
      const { template } = await prompt<{ template: string }>({
        type: 'select',
        name: 'template',
        message: `Select a template:`,
        choices: TEMPLATES,
      });

      log.verbose('选择模板: ', template);
      options.template = template;
    }

    return options.template;
  }

  async confirmForceRemoveIfTargetDiExists(options: Options) {
    const appName = options.appName as string;

    console.log(green(`\n正在新建项目: ${appName}...`));
    console.log();

    // 当前目录是否存在同名目录
    if (fs.existsSync(appName)) {
      // 目录是否为空文件夹
      if (fs.readdirSync(appName).length) {
        // 用户命令中是否已选择强制覆盖, 如: taco app -f
        if (options.force) {
          emptyDir(appName);
        } else {
          const { yes } = await prompt<{ yes: boolean }>({
            type: 'confirm',
            name: 'yes',
            initial: 'Y',
            message: `${appName}已存在, 并且不是一个空目录!！！\n` + `是否清空并继续?`,
          });

          options.force = yes;

          options.force && emptyDir(appName);
        }
      } else {
        return true;
      }
    } else {
      fs.mkdirSync(appName, { recursive: true });
      return true;
    }

    return options.force;
  }
}

function copy(src: string, dest: string) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function copyDir(srcDir: string, destDir: string) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return;
  }
  for (const file of fs.readdirSync(dir)) {
    const abs = path.resolve(dir, file);
    // baseline is Node 12 so can't use rmSync :(
    if (fs.lstatSync(abs).isDirectory()) {
      emptyDir(abs);
      fs.rmdirSync(abs);
    } else {
      fs.unlinkSync(abs);
    }
  }
}

export const createAppCommand = new CreateAppCommand();
