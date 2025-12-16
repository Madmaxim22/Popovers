import createPopoverElement from './popover-element.js';
import calculatePosition from './popover-position.js';

export default class Popover {
  constructor() {
    this.popovers = new Map();
    this.init();
  }

  init() {
    // Делегирование событий для динамически создаваемых элементов
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-toggle="popover"]');
      if (trigger) {
        e.preventDefault();
        this.toggle(trigger);
      }
    });

    // Закрытие popover при клике вне его области
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-toggle="popover"]') &&
                        !e.target.closest('.popover')) {
        this.hideAll();
      }
    });

    // Закрытие popover при нажатии Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideAll();
      }
    });
  }

  show(trigger) {
    // Скрываем все другие popover
    this.hideAll();

    let popover = this.popovers.get(trigger);

    if (!popover) {
      popover = createPopoverElement(trigger);
      this.popovers.set(trigger, popover);
    }

    // обязательно делаем popover видимым до вычисления его размеров иначе высота и ширина будут равны 0
    popover.classList.add('show');

    // В дальнейшем можно выбирать где отображать popover
    const placement = trigger.dataset.placement || 'top';
    const position = calculatePosition(trigger, popover, placement);

    popover.classList.add(placement);

    popover.style.top = `${position.top}px`;
    popover.style.left = `${position.left}px`;

    // Сохраняем ссылку на trigger в popover для удобства
    popover.dataset.trigger = trigger.id || '';
  }

  hide(trigger) {
    const popover = this.popovers.get(trigger);
    if (popover) {
      popover.classList.remove('show');
    }
  }

  hideAll() {
    this.popovers.forEach((popover) => {
      popover.classList.remove('show');
    });
  }

  toggle(trigger) {
    const popover = this.popovers.get(trigger);
    if (popover && popover.classList.contains('show')) {
      this.hide(trigger);
    } else {
      this.show(trigger);
    }
  }
}