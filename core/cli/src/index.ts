import { Cli } from './Cli';

// commands
import { createAppCommand } from '@taco-cli/create-app/dist/command';
import { serveAppCommand } from '@taco-cli/serve/dist/command';
import { buildAppCommand } from '@taco-cli/build/dist/command';

export default function main() {
  new Cli('taco')
    .registerCommand(createAppCommand)
    .registerCommand(serveAppCommand)
    .registerCommand(buildAppCommand)
    .parse(process.argv);
}
