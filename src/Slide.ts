import Timeout from './Timeout';

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  constructor(
    container: Element,
    slides: Element[],
    controls: Element,
    time: number = 5000
  ) {
    // Constructor
    this.container = container;
    this.slides = slides;
    this.controls = controls;
    this.time = time;

    // Métodos
    this.timeout = null;
    this.index = 0;
    this.slide = this.slides[this.index];

    this.init();
  }

  hide(el: Element) {
    el.classList.remove('active');
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add('active');
    this.auto(this.time);
  }

  auto(time: number) {
    this.timeout?.clear();
    new Timeout(() => this.next(), time);
  }

  prev() {
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }

  next() {
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
  }

  private addControls() {
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);
    // Funções
    nextButton.addEventListener('pointerup', () => this.next());
    prevButton.addEventListener('pointerup', () => this.prev());
  }

  private init() {
    this.addControls();
    this.show(this.index);
  }
}
