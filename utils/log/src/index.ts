import log from "npmlog";

/** log等级 */
log.level = process.env.LOG_LEVEL || "info";

/** 修改log命令前缀 */
log.heading = "taco";
// log.headingStyle = { fg: 'green', bg: 'black' }

/** 添加自定义命令 */
log.addLevel("success", 2000, { fg: 'yellow' });

export default log;
