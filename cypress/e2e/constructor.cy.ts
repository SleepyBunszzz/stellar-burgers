describe('Stellar Burger Constructor Tests', () => {
  const bunName = 'Краторная булка N-200i';
  const mainName = 'Биокотлета из марсианской Магнолии';
  const sauceName = 'Соус Spicy-X';
  const email = 'test@example.com';
  const password = 'password123';

  beforeEach(() => {
    // 1. Мокаем API ингредиентов
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    
    // 2. Мокаем авторизацию
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '/api/auth/login', { fixture: 'user.json' }).as('login');
    
    // 3. Мокаем создание заказа
    cy.intercept('POST', '/api/orders', { fixture: 'order.json' }).as('createOrder');
    
    // 4. Устанавливаем токен в localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'test-access-token');
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    });
    
    // 5. Открываем главную страницу
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    // Очищаем localStorage
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  });

  // 1. Тест добавления ингредиентов
  describe('1. Добавление ингредиентов в конструктор', () => {
    it('1.1 Должен добавить булку через кнопку "Добавить"', () => {
      cy.contains(bunName).should('be.visible');
      cy.addIngredient(bunName);
      
      // Проверяем что булка добавилась
      cy.get('[class*="burger_constructor"]')
        .should('contain.text', `${bunName} (верх)`)
        .should('contain.text', `${bunName} (низ)`);
      
      cy.get('[class*="total"]').should('contain.text', '2510'); // 1255 * 2
    });

    it('1.2 Должен добавить начинку через кнопку "Добавить"', () => {
      cy.addIngredient(mainName);
      
      cy.get('[class*="elements"]').should('contain.text', mainName);
      cy.get('[class*="total"]').should('contain.text', '424');
    });

    it('1.3 Должен добавить соус через кнопку "Добавить"', () => {
      cy.addIngredient(sauceName);
      
      cy.get('[class*="elements"]').should('contain.text', sauceName);
      cy.get('[class*="total"]').should('contain.text', '90');
    });

    it('1.4 Должен собрать полный бургер', () => {
      cy.addIngredient(bunName);
      cy.addIngredient(mainName);
      cy.addIngredient(sauceName);
      
      // Проверяем все элементы
      cy.get('[class*="burger_constructor"]').should('contain.text', `${bunName} (верх)`);
      cy.get('[class*="burger_constructor"]').should('contain.text', `${bunName} (низ)`);
      cy.get('[class*="elements"]').should('contain.text', mainName);
      cy.get('[class*="elements"]').should('contain.text', sauceName);
      
      // Проверяем общую сумму
      cy.get('[class*="total"]').should('contain.text', '3024'); // 1255*2 + 424 + 90
    });

    it('1.5 Должен добавить ингредиент через drag & drop', () => {
      cy.dragIngredient(mainName);
      cy.get('[class*="elements"]').should('contain.text', mainName);
    });
  });

  // 2. Тест модальных окон
  describe('2. Работа модальных окон', () => {
    it('2.1 Должен открыть модальное окно ингредиента при клике', () => {
      cy.contains(bunName).click();
      
      // Проверяем модальное окно
      cy.get('[class*="modal"]').should('be.visible');
      cy.get('[class*="modal"]').should('contain.text', bunName);
      cy.get('[class*="modal"]').should('contain.text', 'Калории, ккал');
      cy.get('[class*="modal"]').should('contain.text', '420');
      
      // Проверяем заголовок
      cy.get('[class*="modal"] h3').should('contain.text', bunName);
    });

    it('2.2 Должен закрыть модальное окно по клику на крестик', () => {
      cy.contains(bunName).click();
      cy.get('[class*="modal"]').should('be.visible');
      
      cy.closeModal();
      
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('2.3 Должен закрыть модальное окно по клику на оверлей', () => {
      cy.contains(bunName).click();
      cy.get('[class*="modal"]').should('be.visible');
      
      cy.get('[class*="overlay"]').click({ force: true });
      
      cy.get('[class*="modal"]').should('not.exist');
    });

    it('2.4 Должен закрыть модальное окно по нажатию ESC', () => {
      cy.contains(bunName).click();
      cy.get('[class*="modal"]').should('be.visible');
      
      cy.get('body').type('{esc}');
      
      cy.get('[class*="modal"]').should('not.exist');
    });
  });

  // 3. Тест создания заказа
  describe('3. Создание заказа', () => {
    beforeEach(() => {
      // Авторизуемся перед тестами заказа
      cy.login(email, password);
      cy.visit('/');
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });

    it('3.1 Должен создать заказ при наличии булки и начинки', () => {
      // Собираем бургер
      cy.addIngredient(bunName);
      cy.addIngredient(mainName);
      
      // Проверяем что кнопка активна
      cy.get('button')
        .contains('Оформить заказ')
        .should('not.be.disabled');
      
      // Оформляем заказ
      cy.createOrder();
      
      // Ждем запрос
      cy.wait('@createOrder');
      
      // Проверяем модальное окно с номером заказа
      cy.get('[class*="modal"]').should('be.visible');
      cy.contains('идентификатор заказа').should('be.visible');
      cy.get('[class*="modal"]').should('contain.text', '12345');
      
      // Закрываем модальное окно
      cy.closeModal();
      
      // Проверяем что конструктор очистился
      cy.get('[class*="burger_constructor"]').should('contain.text', 'Выберите булки');
      cy.get('[class*="elements"]').should('contain.text', 'Выберите начинку');
      cy.get('[class*="total"]').should('contain.text', '0');
    });

    it('3.2 Не должен создавать заказ без булки', () => {
      // Добавляем только начинку (без булки)
      cy.addIngredient(mainName);
      
      // Проверяем что кнопка неактивна
      cy.get('button')
        .contains('Оформить заказ')
        .should('be.disabled');
    });

    it('3.3 Не должен создавать заказ без начинок', () => {
      // Добавляем только булку
      cy.addIngredient(bunName);
      
      // Проверяем что кнопка неактивна
      cy.get('button')
        .contains('Оформить заказ')
        .should('be.disabled');
    });

    it('3.4 Должен перенаправлять на логин при попытке создать заказ без авторизации', () => {
      // Очищаем авторизацию
      cy.window().then((win) => {
        win.localStorage.clear();
      });
      
      cy.visit('/');
      cy.wait('@getIngredients');
      
      // Собираем бургер
      cy.addIngredient(bunName);
      cy.addIngredient(mainName);
      
      // Пытаемся создать заказ
      cy.createOrder();
      
      // Проверяем перенаправление на логин
      cy.url().should('include', '/login');
    });
  });

  // 4. Тест удаления ингредиентов
  describe('4. Удаление ингредиентов из конструктора', () => {
    it('4.1 Должен удалить начинку из конструктора', () => {
      cy.addIngredient(mainName);
      cy.get('[class*="elements"]').should('contain.text', mainName);
      
      // Находим и кликаем на кнопку удаления (крестик)
      cy.get('[class*="elements"]')
        .contains(mainName)
        .parent()
        .parent()
        .find('button[class*="constructor-element__action"]')
        .click();
      
      cy.get('[class*="elements"]').should('not.contain.text', mainName);
      cy.get('[class*="elements"]').should('contain.text', 'Выберите начинку');
    });
  });

  // 5. Тест табов категорий
  describe('5. Работа табов категорий', () => {
    it('5.1 Должен переключаться между табами', () => {
      // Проверяем начальное состояние
      cy.get('[class*="menu"] button[value="bun"]').should('have.attr', 'class').and('include', 'tab_tab_type_current');
      
      // Переключаемся на соусы
      cy.get('[class*="menu"] button[value="sauce"]').click();
      cy.get('[class*="menu"] button[value="sauce"]').should('have.attr', 'class').and('include', 'tab_tab_type_current');
      
      // Переключаемся на начинки
      cy.get('[class*="menu"] button[value="main"]').click();
      cy.get('[class*="menu"] button[value="main"]').should('have.attr', 'class').and('include', 'tab_tab_type_current');
    });

    it('5.2 Должен прокручивать к выбранной категории', () => {
      cy.get('[class*="menu"] button[value="sauce"]').click();
      cy.get('h2').contains('Соусы').should('be.visible');
    });
  });

  // 6. Тест счетчика ингредиентов
  describe('6. Счетчик ингредиентов', () => {
    it('6.1 Должен показывать счетчик добавленных ингредиентов', () => {
      // Добавляем булку
      cy.addIngredient(bunName);
      
      // Проверяем счетчик
      cy.contains(bunName)
        .parent()
        .parent()
        .find('[class*="counter"]')
        .should('exist')
        .and('contain.text', '2'); // Булки считаются как 2
      
      // Добавляем начинку
      cy.addIngredient(mainName);
      
      cy.contains(mainName)
        .parent()
        .parent()
        .find('[class*="counter"]')
        .should('exist')
        .and('contain.text', '1');
    });
  });
});