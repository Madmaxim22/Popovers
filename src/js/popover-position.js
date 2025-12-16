export default function calculatePosition(trigger, popover, placement) {
  const triggerRect = trigger.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  // Извлекаем базовые размеры и позиции
  const triggerWidth = triggerRect.width;
  const triggerHeight = triggerRect.height;
  const popoverWidth = popoverRect.width;
  const popoverHeight = popoverRect.height;

  /*
  Учитываем прокрутку окна
  Метод getBoundingClientRect() возвращает координаты элемента относительно видимой области окна браузера (viewport),
  а не документа. Это значит:
  - Если страница не прокручена — координаты совпадают с позицией в документе.
  - Если страница прокручена вниз на 500px — top элемента, который «уехал» за верхнюю границу окна,
  станет отрицательным (например, -480px).
  */
  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;

  let top, left;

  switch (placement) {
  case 'top':
    // Popover над trigger, по центру горизонтально
    top = triggerRect.top + scrollTop - popoverHeight - 10;
    left = triggerRect.left + scrollLeft + (triggerWidth - popoverWidth) / 2;
    break;

  case 'right':
    // Popover справа от trigger, по центру вертикально
    top = triggerRect.top + scrollTop + (triggerHeight - popoverHeight) / 2;
    left = triggerRect.left + scrollLeft + triggerWidth + 10;
    break;

  case 'bottom':
    // Popover под trigger, по центру горизонтально
    top = triggerRect.top + scrollTop + triggerHeight + 10;
    left = triggerRect.left + scrollLeft + (triggerWidth - popoverWidth) / 2;
    break;

  case 'left':
    // Popover слева от trigger, по центру вертикально
    top = triggerRect.top + scrollTop + (triggerHeight - popoverHeight) / 2;
    left = triggerRect.left + scrollLeft - popoverWidth - 10;
    break;

  default:
    // По умолчанию — как для 'top'
    top = triggerRect.top + scrollTop - popoverHeight - 10;
    left = triggerRect.left + scrollLeft + (triggerWidth - popoverWidth) / 2;
  }

  return {
    top: Math.round(top), // Округляем до целых пикселей
    left: Math.round(left) // для стабильного позиционирования
  };
}
