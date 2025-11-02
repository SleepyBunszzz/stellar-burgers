import { OrderCardUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';
import type { Location as RRLocation } from 'react-router-dom';

const meta = {
  title: 'Example/OrderCard',
  component: OrderCardUI,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof OrderCardUI>;

export default meta;
type Story = StoryObj<typeof meta>;

const background: RRLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'eitkep27'
};

export const DefaultOrderCard: Story = {
  args: {
    orderInfo: {
      _id: '32',
      number: 3,
      name: 'Начинка',
      status: 'ready',
      date: new Date('2024-01-25'),
      ingredientsInfo: [
        {
          _id: '111',
          name: 'Булка',
          type: 'bun',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      ingredientsToShow: [
        {
          _id: '111',
          name: 'Булка',
          type: 'bun',
          proteins: 12,
          fat: 33,
          carbohydrates: 22,
          calories: 33,
          price: 123,
          image: '',
          image_large: '',
          image_mobile: ''
        },
        {
          _id: '222',
          name: 'Начинка',
          type: 'main',
          proteins: 10,
          fat: 20,
          carbohydrates: 15,
          calories: 50,
          price: 200,
          image: '',
          image_large: '',
          image_mobile: ''
        }
      ],
      remains: 2,
      total: 323
    },
    maxIngredients: 5,
    showStatus: false,
    locationState: { background }
  }
};
