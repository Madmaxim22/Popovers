import Popover from "../Popover.js";
import createPopoverElement from "../popover-element.js";
import calculatePosition from "../popover-position.js";

// Мокаем зависимости
jest.mock("../popover-element.js");
jest.mock("../popover-position.js");

describe("Popover", () => {
  let popoverInstance;
  let mockTrigger;
  let mockPopoverElement;

  beforeEach(() => {
    // Настройка DOM среды
    document.body.innerHTML = `
      <button id="test-trigger" data-toggle="popover" data-placement="top">
        Test Button
      </button>
    `;

    mockTrigger = document.getElementById("test-trigger");
    mockPopoverElement = document.createElement("div");
    mockPopoverElement.className = "popover";

    // Мокаем создание popover элемента
    createPopoverElement.mockReturnValue(mockPopoverElement);

    // Мокаем расчет позиции
    calculatePosition.mockReturnValue({
      top: 100,
      left: 200,
    });

    popoverInstance = new Popover();
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  describe("Конструктор и инициализация", () => {
    test("должен создавать экземпляр с пустой картой popovers", () => {
      expect(popoverInstance.popovers).toBeInstanceOf(Map);
      expect(popoverInstance.popovers.size).toBe(0);
    });

    test("должен инициализировать обработчики событий", () => {
      const addEventListenerSpy = jest.spyOn(document, "addEventListener");

      new Popover();

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        "keydown",
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });
  });

  describe("Метод show", () => {
    test("должен создавать и показывать popover при первом вызове", () => {
      popoverInstance.show(mockTrigger);

      expect(createPopoverElement).toHaveBeenCalledWith(mockTrigger);
      expect(popoverInstance.popovers.has(mockTrigger)).toBe(true);
      expect(mockPopoverElement.classList.contains("show")).toBe(true);
    });

    test("должен использовать существующий popover при повторном вызове", () => {
      // Первый вызов
      popoverInstance.show(mockTrigger);

      // Второй вызов
      popoverInstance.show(mockTrigger);

      // createPopoverElement должен быть вызван только один раз
      expect(createPopoverElement).toHaveBeenCalledTimes(1);
    });

    test("должен устанавливать правильную позицию popover", () => {
      popoverInstance.show(mockTrigger);

      expect(calculatePosition).toHaveBeenCalledWith(
        mockTrigger,
        mockPopoverElement,
        "top"
      );
      expect(mockPopoverElement.style.top).toBe("100px");
      expect(mockPopoverElement.style.left).toBe("200px");
    });

    test("должен использовать значение placement по умолчанию", () => {
      // Убираем data-placement у триггера
      delete mockTrigger.dataset.placement;

      popoverInstance.show(mockTrigger);

      expect(calculatePosition).toHaveBeenCalledWith(
        mockTrigger,
        mockPopoverElement,
        "top"
      );
    });
  });

  describe("Метод hide", () => {
    test("должен скрывать popover", () => {
      // Сначала показываем
      popoverInstance.show(mockTrigger);
      expect(mockPopoverElement.classList.contains("show")).toBe(true);

      // Затем скрываем
      popoverInstance.hide(mockTrigger);
      expect(mockPopoverElement.classList.contains("show")).toBe(false);
    });

    test("не должен падать при скрытии несуществующего popover", () => {
      expect(() => {
        popoverInstance.hide(mockTrigger);
      }).not.toThrow();
    });
  });

  describe("Метод hideAll", () => {
    test("должен скрывать все popovers", () => {
      // Создаем несколько триггеров
      const trigger2 = document.createElement("button");
      trigger2.dataset.toggle = "popover";
      document.body.append(trigger2);

      const popover2 = document.createElement("div");

      // Показываем оба popover
      mockPopoverElement.classList.add("show");
      popover2.classList.add("show");
      popoverInstance.popovers.set(mockTrigger, mockPopoverElement);
      popoverInstance.popovers.set(trigger2, popover2);

      // Проверяем, что оба видны
      expect(mockPopoverElement.classList.contains("show")).toBe(true);
      expect(popover2.classList.contains("show")).toBe(true);

      // Скрываем все
      popoverInstance.hideAll();

      // Проверяем, что оба скрыты
      expect(mockPopoverElement.classList.contains("show")).toBe(false);
      expect(popover2.classList.contains("show")).toBe(false);
    });
  });

  describe("Метод toggle", () => {
    test("должен показывать popover если он скрыт", () => {
      popoverInstance.toggle(mockTrigger);

      expect(createPopoverElement).toHaveBeenCalled();
      expect(mockPopoverElement.classList.contains("show")).toBe(true);
    });

    test("должен скрывать popover если он показан", () => {
      // Сначала показываем
      popoverInstance.show(mockTrigger);

      // Затем переключаем
      popoverInstance.toggle(mockTrigger);

      expect(mockPopoverElement.classList.contains("show")).toBe(false);
    });
  });

  describe("Обработчики событий", () => {
    test("должен показывать popover при клике на триггер", () => {
      mockTrigger.click();

      expect(createPopoverElement).toHaveBeenCalled();
      expect(mockPopoverElement.classList.contains("show")).toBe(true);
    });

    test("должен скрывать все popovers при клике вне области", () => {
      // Сначала показываем popover
      popoverInstance.show(mockTrigger);

      // Кликаем вне popover и вне триггера
      document.body.click();

      expect(mockPopoverElement.classList.contains("show")).toBe(false);
    });

    test("не должен скрывать popover при клике внутри него", () => {
      // Сначала показываем popover
      popoverInstance.show(mockTrigger);

      // Симулируем клик внутри popover
      const clickEvent = new MouseEvent("click", { bubbles: true });
      mockPopoverElement.dispatchEvent(clickEvent);

      expect(mockPopoverElement.classList.contains("show")).toBe(true);
    });

    test("должен скрывать все popovers при нажатии Escape", () => {
      // Сначала показываем popover
      popoverInstance.show(mockTrigger);

      // Симулируем нажатие Escape
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escapeEvent);

      expect(mockPopoverElement.classList.contains("show")).toBe(false);
    });

    test("не должен реагировать на другие клавиши", () => {
      // Сначала показываем popover
      popoverInstance.show(mockTrigger);

      // Симулируем нажатие другой клавиши
      const otherKeyEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(otherKeyEvent);

      expect(mockPopoverElement.classList.contains("show")).toBe(true);
    });
  });

  describe("Делегирование событий", () => {
    test("должен обрабатывать клики на динамически созданных элементах", () => {
      // Создаем динамический элемент после инициализации Popover
      const dynamicTrigger = document.createElement("button");
      dynamicTrigger.dataset.toggle = "popover";
      document.body.append(dynamicTrigger);

      // Кликаем на динамический элемент
      dynamicTrigger.click();

      expect(createPopoverElement).toHaveBeenCalled();
    });
  });
});
