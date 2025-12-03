import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import CitiesList from './CitiesList';
import { cities } from '../../mocks';

const meta = {
  title: 'Example/CitiesList',
  component: CitiesList,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    activeCityId: {
      control: 'select',
      options: cities.map((city) => city.id),
      description: 'ID активного города',
    },
  },
} satisfies Meta<typeof CitiesList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    cities: cities,
    activeCityId: 'amsterdam',
  },
};

