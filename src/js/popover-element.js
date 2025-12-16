export default function createPopoverElement(trigger) {
  const popover = document.createElement('div');
  popover.className = 'popover';

  const title = trigger.dataset.title;
  const content = trigger.dataset.content;
  const placement = trigger.dataset.placement || 'top';

  // Создаем стрелку
  const arrow = document.createElement('div');
  arrow.className = 'popover-arrow';
  popover.append(arrow);

  // Создаем заголовок, если есть
  if (title) {
    const header = document.createElement('h3');
    header.className = 'popover-header';
    header.textContent = title;
    popover.append(header);
  }

  // Создаем тело с содержимым
  const body = document.createElement('div');
  body.className = 'popover-body';
  body.innerHTML = content || '';
  popover.append(body);

  // Добавляем класс позиционирования
  popover.classList.add(placement);

  // Добавляем popover в документ
  document.body.append(popover);

  return popover;
}
