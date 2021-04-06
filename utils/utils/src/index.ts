const path = require("path");

/**
 * 兼容路径(mac/windows)
 * @param {string} rawPath 原始路径
 */
function formatPath(rawPath: string) {
  return path.sep === "/" ? rawPath : rawPath.replace(/\\/g, '/');
}

module.exports = {
  formatPath
}