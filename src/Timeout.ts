export default class Timeout {
  id;
  handler;
  start;
  timeLeft;
  constructor(handler: TimerHandler, time: number) {
    this.id = setTimeout(handler, time);
    this.handler = handler;
    // Início do Slide
    this.start = Date.now();
    this.timeLeft = time;
  }

  clear() {
    clearTimeout(this.id);
  }

  pause() {
    // Tempo que passou e que falta
    const passed = Date.now() - this.start;
    this.timeLeft = this.timeLeft - passed;
    this.clear();
  }

  continue() {
    this.clear();
    // Novo tempo
    this.id = setTimeout(this.handler, this.timeLeft);
    this.start = Date.now();
  }
}
