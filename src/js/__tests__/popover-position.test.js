import calculatePosition from '../popover-position.js';

describe('calculatePosition', () => {
  let trigger, popover;

  beforeEach(() => {
    trigger = document.createElement('button');
    trigger.style.position = 'absolute';
    document.body.appendChild(trigger);

    popover = document.createElement('div');
    document.body.appendChild(popover);

    // Мокируем getBoundingClientRect для trigger
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      x: 200,
      y: 100,
      width: 50,
      height: 30,
      top: 100,
      right: 250,
      bottom: 130,
      left: 200
    });

    // Мокируем getBoundingClientRect для popover
    jest.spyOn(popover, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      width: 100,
      height: 60,
      top: 0,
      right: 100,
      bottom: 60,
      left: 0
    });
  });

  afterEach(() => {
    document.body.removeChild(trigger);
    document.body.removeChild(popover);
  });

  test('рассчитывает позицию для placement="top"', () => {
    const position = calculatePosition(trigger, popover, 'top');

    expect(position.top).toBe(100 + window.scrollY - 60 - 10); // 100 - 60 -10
    expect(position.left).toBe(200 + (50 - 100) / 2); // 200 -25
  });

  test('рассчитывает позицию для placement="right"', () => {
    const position = calculatePosition(trigger, popover, 'right');

    expect(position.top).toBeCloseTo(100 + (30 - 60) / 2 + window.scrollY); // 100 -15
    expect(position.left).toBe(200 + 50 + 10); // 260
  });

  test('рассчитывает позицию для placement="bottom"', () => {
    const position = calculatePosition(trigger, popover, 'bottom');

    expect(position.top).toBe(100 + 30 + 10 + window.scrollY); // 140
    expect(position.left).toBe(200 + (50 - 100) / 2); // 175
  });

  test('рассчитывает позицию для placement="left"', () => {
    const position = calculatePosition(trigger, popover, 'left');

    expect(position.top).toBeCloseTo(100 + (30 - 60) / 2 + window.scrollY); // 85
    expect(position.left).toBe(200 - 100 - 10); // 90
  });

  test('использует default placement="top" при неверном значении', () => {
    const position = calculatePosition(trigger, popover, 'invalid');

    expect(position.top).toBe(100 + window.scrollY - 60 - 10);
    expect(position.left).toBe(200 + (50 - 100) / 2);
  });
});
