#!/usr/bin/env node

// import minimist from 'minimist';
import createAppCommand from './command';

// const argv: minimist.ParsedArgs & Partial<Options> = minimist(process.argv.slice(2));

// createAppCommand.action(argv._[0], {
//   force: argv.force || false,
//   template: argv.template,
// });

export default createAppCommand;
