import { Command } from 'commander';
import { startServer } from '@dopa/webpack';

interface Options {
  host: string;
  port: boolean;
}

class ServeAppCommand {
  install(program: Command) {
    program
      .command('serve')
      .description('启动开发服务')
      .option('--host <host>', '指定服务地址', '0.0.0.0')
      .option('-p, --port <port>', '指定服务端口', '3000')
      .action(this.action);
  }

  action = async (options: Options) => {
    startServer(options.host, +options.port);
  };
}

export const serveAppCommand = new ServeAppCommand();
