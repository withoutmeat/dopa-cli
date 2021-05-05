import fs from 'fs';
import path from 'path';
import ora from 'ora';
import { green } from 'chalk';
import { prompt } from 'enquirer';
import userHome from 'user-home';
import Command from '@taco-cli/command';
import log from '@taco-cli/log';
import Package from '@taco-cli/package';
import fse from 'fs-extra';
import glob from 'glob';
import ejs from 'ejs';

interface Options {
  appName: string;
  force: boolean;
  template: string;
  tailwindcss: boolean;
  storybook: boolean;
  test: boolean;
  eslint: boolean;
}

const relatedFilesMap = {
  tailwindcss: ['tailwind.config.js'],
  storybook: ['.storybook', 'src/stories'],
  test: ['jest.config.js', 'src/tests'],
  eslint: ['.eslintrc.js', '.eslintignore'],
};

const renameFiles = {
  _env: '.env',
};

const TEMPLATES = ['vue3'];
const cwd = process.cwd();

class CreateAppCommand extends Command {
  options: Options;

  constructor(options: Options) {
    super();
    this.options = options;
    console.log(options);
  }

  async init() {
    await this.prepare();
    log.verbose('appOptions: ', JSON.stringify(this.options));
  }

  async exec() {
    try {
      await this.downloadTemplate();
      await this.installTemplate();
    } catch (error) {
      log.error('CreateAppCommand error: ', error.message);
    }
  }

  // 1. 准备阶段
  async prepare() {
    // 确认app名称
    await this.confirmAppName(this.options);

    // 确认文件夹是否可以直接创建，或者清空后在创建
    const isDirOk = await this.confirmIsDirOk(this.options);
    if (isDirOk === false) return;

    // 确认项目模版类型
    await this.confirmTemplate(this.options);
    if (this.options.template == undefined) return;
    await this.confirmEslint(this.options);
    await this.confirmStorybook(this.options);
    await this.confirmTailwind(this.options);
    await this.confirmTest(this.options);

    console.log(green(`\n正在新建项目: ${this.options.appName}...`));
    console.log();
  }

  // 2. 模版下载
  async downloadTemplate() {
    log.verbose(
      'downloadTemplate',
      '@taco-cli/template-' + this.options.template
    );

    const targetPath = path.resolve(userHome, '.taco-cli', 'templates');
    const storePath = path.resolve(targetPath, 'node_modules');
    const packageName = '@taco-cli/template-' + this.options.template;
    const packageVersion = 'latest';

    const templatePackage = new Package({
      targetPath,
      storePath,
      name: packageName,
      version: packageVersion,
    });

    let spinner;

    if (templatePackage.exists()) {
      spinner = ora(`update ${packageName}`).start();
      await templatePackage.update();
      log.info('更新模版成功', packageName);
    } else {
      spinner = ora(`download ${packageName}`).start();
      await templatePackage.install();
      log.info('下载模版成功', packageName);
    }

    spinner.stop();
  }

  // 3. 安装模版
  async installTemplate() {
    const targetPath = path.resolve(cwd, this.options.appName);

    const templatePath = path.resolve(
      userHome,
      '.taco-cli',
      'templates',
      this.options.template,
      'template'
    );

    // const templatePath = path.resolve(
    //   '/Users/lijian/keep-learning/dopa-cli/templates/template-vue3/template'
    // );

    log.verbose('项目路径: ', targetPath);
    log.verbose('模版路径: ', templatePath);

    fse.ensureDirSync(templatePath);
    fse.ensureDirSync(targetPath);
    fse.copySync(templatePath, targetPath);

    // 删除相关文件
    Object.keys(relatedFilesMap).forEach((key) => {
      // @ts-expect-error
      !this.options[key] &&
        // @ts-expect-error
        relatedFilesMap[key].forEach((fileName) =>
          fse.removeSync(path.resolve(targetPath, fileName))
        );
    });

    // 重命名相关文件
    Object.keys(renameFiles).forEach((key) => {
      fse.move(
        path.resolve(targetPath, key),
        // @ts-expect-error
        path.resolve(targetPath, renameFiles[key])
      );
    });

    glob(
      '*.ejs',
      {
        cwd: targetPath,
        ignore: '',
        nodir: true,
      },
      (err, matches) => {
        if (err) {
          throw err;
        }

        matches.forEach((file) => {
          const filePath = path.resolve(targetPath, file);
          ejs.renderFile(filePath, { ...this.options }, {}, (err, result) => {
            if (err) {
              throw err;
            } else {
              fse.writeFileSync(
                filePath,
                result
                // result.replace(/([^\t]\n)(( )*(\n)*)*\n/g, '$1')
              );
              fse.moveSync(filePath, filePath.replace(/\.ejs$/, ''));
              log.info(filePath.replace(/\.ejs$/, ''), '创建成功');
            }
          });
        });
      }
    );
  }

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

  async confirmTailwind(options: Options) {
    if (options.tailwindcss == void 0) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message: '是否需要 TailwindCSS?',
      });

      options.tailwindcss = yes;
    }
  }

  async confirmTest(options: Options) {
    if (options.test == void 0) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message: '是否需要单元测试?',
      });

      options.test = yes;
    }
  }

  async confirmEslint(options: Options) {
    if (options.eslint == void 0) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message: '是否需要 Eslint?',
      });

      options.eslint = yes;
    }
  }

  async confirmStorybook(options: Options) {
    if (options.storybook == void 0) {
      const { yes } = await prompt<{ yes: boolean }>({
        type: 'confirm',
        name: 'yes',
        initial: 'Y',
        message: '是否需要 Storybook?',
      });

      options.storybook = yes;
    }
  }

  async confirmIsDirOk(options: Options) {
    const appName = options.appName as string;

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
            message:
              `${appName}已存在, 并且不是一个空目录!！！\n` + `是否清空并继续?`,
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
}

export default (argv: Options) => {
  return new CreateAppCommand(argv);
};

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
