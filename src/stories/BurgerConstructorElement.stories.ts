import { BurgerConstructorElementUI } from '@ui';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BurgerConstructorElementUI> = {
  title: 'Example/BurgerConstructorElement',
  component: BurgerConstructorElementUI,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

type Story = StoryObj<typeof BurgerConstructorElementUI>;

export const DefaultElement: Story = {
  args: {
    ingredient: {
      id: '222',
      name: 'Булка',
      price: 123,
      image: '' 
    },
    index: 0,
    totalItems: 1,
    handleMoveUp: () => {},
    handleMoveDown: () => {},
    handleClose: () => {}
  }
};
