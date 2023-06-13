import Timeout from './Timeout';

export default class Slide {
  container: Element;
  slides: Element[];
  controls: Element;
  time: number;
  index: number;
  slide: Element;
  timeout: Timeout | null;
  pausedTimeout: Timeout | null;
  paused: Boolean;
  thumbItems: HTMLElement[] | null;
  currentThumb: HTMLElement | null;
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
    this.pausedTimeout = null;
    this.paused = false;
    this.index = localStorage.getItem('activeSlide')
      ? Number(localStorage.getItem('activeSlide'))
      : 0;
    this.slide = this.slides[this.index];

    // Feedback
    this.thumbItems = null;
    this.currentThumb = null;

    this.init();
  }

  hide(el: Element) {
    el.classList.remove('active');
    if (el instanceof HTMLVideoElement) {
      el.currentTime = 0;
      el.pause();
    }
  }

  show(index: number) {
    this.index = index;
    this.slide = this.slides[this.index];
    localStorage.setItem('activeSlide', String(this.index));
    // Desenvolvimento
    if (this.thumbItems) {
      this.currentThumb = this.thumbItems[this.index];
      this.thumbItems.forEach((el) => el.classList.remove('active'));
      this.currentThumb.classList.add('active');
    }
    this.slides.forEach((el) => this.hide(el));
    this.slide.classList.add('active');
    if (this.slide instanceof HTMLVideoElement) {
      this.autoVideo(this.slide);
    } else {
      this.auto(this.time);
    }
  }

  autoVideo(video: HTMLVideoElement) {
    video.muted = true;
    video.play();
    let firstPlay = true;
    video.addEventListener('playing', () => {
      if (firstPlay) this.auto(video.duration * 1000);
      firstPlay = false;
    });
  }

  auto(time: number) {
    this.timeout?.clear();
    this.timeout = new Timeout(() => this.next(), time);
    if (this.currentThumb)
      this.currentThumb.style.animationDuration = `${time}ms`;
  }

  prev() {
    if (this.paused) return;
    const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1;
    this.show(prev);
  }

  next() {
    if (this.paused) return;
    const next = this.index + 1 < this.slides.length ? this.index + 1 : 0;
    this.show(next);
  }

  pause() {
    this.pausedTimeout = new Timeout(() => {
      this.paused = true;
      this.timeout?.pause();
      if (this.slide instanceof HTMLVideoElement) this.slide.pause();
    }, 300);
  }

  continue() {
    this.pausedTimeout?.clear();
    if (this.paused) {
      this.paused = false;
      this.timeout?.continue();
      if (this.slide instanceof HTMLVideoElement) this.slide.play();
    }
  }

  private addControls() {
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');
    this.controls.appendChild(prevButton);
    this.controls.appendChild(nextButton);
    // Funções
    this.controls.addEventListener('pointerdown', () => this.pause());
    this.controls.addEventListener('pointerup', () => this.continue());

    nextButton.addEventListener('pointerup', () => this.next());
    prevButton.addEventListener('pointerup', () => this.prev());
  }

  // Feedback para o usuário
  private addThumbItems() {
    const thumbContainer = document.createElement('div');
    thumbContainer.id = 'slide-thumb';
    for (let i = 0; i < this.slides.length; i++) {
      thumbContainer.innerHTML += `<span><span class="thumb-item"></span></span>`;
    }
    this.controls.appendChild(thumbContainer);
    this.thumbItems = Array.from(document.querySelectorAll('.thumb-item'));
  }

  private init() {
    this.addControls();
    this.addThumbItems();
    this.show(this.index);
  }
}
