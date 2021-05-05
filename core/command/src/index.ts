export default class Command {
  constructor() {
    Promise.resolve()
      .then(() => this.init())
      .then(() => this.exec());
  }

  init() {
    throw new Error('init必须实现！');
  }

  exec() {
    throw new Error('exec必须实现！');
  }
}
