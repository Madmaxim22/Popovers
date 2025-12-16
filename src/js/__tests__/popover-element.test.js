import createPopoverElement from '../popover-element.js';

describe('createPopoverElement', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('создаёт popover с базовыми классами', () => {
    const trigger = document.createElement('button');
    trigger.dataset.toggle = 'popover';

    const popover = createPopoverElement(trigger);

    expect(popover).toBeInstanceOf(HTMLDivElement);
    expect(popover.className).toContain('popover');
    expect(popover.querySelector('.popover-arrow')).toBeInTheDocument();
  });

  test('добавляет заголовок, если есть data-title', () => {
    const trigger = document.createElement('button');
    trigger.dataset.title = 'Заголовок';
    trigger.dataset.content = 'Текст';

    const popover = createPopoverElement(trigger);
    const header = popover.querySelector('.popover-header');

    expect(header).toBeInTheDocument();
    expect(header.textContent).toBe('Заголовок');
  });

  test('не добавляет заголовок, если нет data-title', () => {
    const trigger = document.createElement('button');
    trigger.dataset.content = 'Текст';

    const popover = createPopoverElement(trigger);
    const header = popover.querySelector('.popover-header');

    expect(header).not.toBeInTheDocument();
  });

  test('добавляет контент в тело', () => {
    const trigger = document.createElement('button');
    trigger.dataset.content = '<strong>Жирный текст</strong>';

    const popover = createPopoverElement(trigger);
    const body = popover.querySelector('.popover-body');

    expect(body).toBeInTheDocument();
    expect(body.innerHTML).toBe('<strong>Жирный текст</strong>');
  });

  test('добавляет класс позиционирования', () => {
    const trigger = document.createElement('button');
    trigger.dataset.placement = 'right';

    const popover = createPopoverElement(trigger);

    expect(popover.classList.contains('right')).toBe(true);
  });
});
