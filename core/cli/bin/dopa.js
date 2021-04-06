#! /usr/bin/env node

const importLocal = require("import-local");
const log = require("@dopa/log");


if (importLocal(__filename)) {
  log.info("cli", "正在使用 immoc-cli 本地版");
} else {
  require("../dist/index.js").default();
}