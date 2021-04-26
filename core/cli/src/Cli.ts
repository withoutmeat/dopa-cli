import commander from 'commander';
import log from "@taco-cli/log"
// import semver from "semver"
import chalk from "chalk"
// import userHome from "user-home"
// import { sync } from "path-exists"
// import path from "path"

const version = require("../package.json").version;

export class Cli extends commander.Command {

  constructor(name: string) {
    super(name)
    this
      .usage('<command [options]>')
      .version(version)
      .option('-d, --debug', '是否开启调试模式', false)
      .option('--targetPath <targetPath>', '指定调试文件路径', '')

    this.addEventListener()
  }

  registerCommand(command: any) {
    command.install(this)
    return this;
  }

  addEventListener() {
    this.on("option:debug", () => {
      if (this.opts().debug) {
        process.env.LOG_LEVEL = "verbose"
      } else {
        process.env.LOG_LEVEL = "info"
      }

      log.level = process.env.LOG_LEVEL;

      log.verbose("taco-cli", "已开启调试模式")
    })

    this.on("option:targetPath", () => {
      process.env.CLI_TARGET_PATH = this.opts().targetPath
    })

    this.on('command:*', (o) => {
      log.error(chalk.red("未知命令: "), o[0]);

      const availableCommands = this.commands.map(cmd => cmd.name());

      log.info("可用命令: ", availableCommands.join(", "));
    })

  }

  customHelpInfo() {
    this.helpInformation = () => {
      return "自定义帮助信息"
    }
  }

}
