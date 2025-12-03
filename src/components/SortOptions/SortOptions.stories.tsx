import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import SortOptions, { type SortType } from './SortOptions';

const meta = {
  title: 'Example/SortOptions',
  component: SortOptions,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      const [sort, setSort] = useState<SortType>('Popular');
      return <Story args={{ currentSort: sort, onSortChange: setSort }} />;
    },
  ],
  argTypes: {
    currentSort: {
      control: 'select',
      options: ['Popular', 'Price: low to high', 'Price: high to low', 'Top rated first'],
      description: 'Текущий тип сортировки',
    },
  },
} satisfies Meta<typeof SortOptions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    currentSort: 'Popular',
    onSortChange: () => {},
  },
};

