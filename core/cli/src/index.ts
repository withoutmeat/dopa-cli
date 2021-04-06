import { Cli } from './Cli';

// commands
import createAppCommand from "@dopa/create-app"

// const exec = require("@dopa/exec");

// const args = require("minimist")(process.argv.slice(2));

// const envVars = require("dotenv").config();

export default function main() {
  new Cli("dopa")
    .registerCommand(createAppCommand)
    .parse(process.argv)
}

