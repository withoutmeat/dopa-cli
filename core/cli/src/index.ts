import { Cli } from './Cli';

// commands
import { createAppCommand } from '@dopa/create-app/dist/command';
import { serveAppCommand } from '@dopa/serve/dist/command';
import { buildAppCommand } from '@dopa/build/dist/command';

export default function main() {
  new Cli('dopa')
    .registerCommand(createAppCommand)
    .registerCommand(serveAppCommand)
    .registerCommand(buildAppCommand)
    .parse(process.argv);
}
