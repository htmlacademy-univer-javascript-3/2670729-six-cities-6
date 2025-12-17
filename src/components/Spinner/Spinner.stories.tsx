import type { Meta, StoryObj } from '@storybook/react-vite';
import Spinner from './Spinner';

const meta = {
  title: 'Example/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const InContainer: Story = {
  render: () => (
    <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', padding: '20px' }}>
      <Spinner />
    </div>
  ),
};

