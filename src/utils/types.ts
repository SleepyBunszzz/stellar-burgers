// src/utils/types.ts
export type TIngredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main'; // уточняем тип сразу
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string; // локальный uuid при добавлении в конструктор
};

export type TOrder = {
  _id: string;
  status: string; // 'done' | 'pending' | 'created'
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number; // номер заказа
  ingredients: string[]; // массив id ингредиентов
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
