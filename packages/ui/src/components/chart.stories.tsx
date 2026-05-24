import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from './chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const meta: Meta = { title: 'Components/Data/Chart', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const chartData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: { label: 'Desktop', color: 'var(--color-chart-1)' },
  mobile: { label: 'Mobile', color: 'var(--color-chart-2)' },
} satisfies ChartConfig;

export const BarChartStory: Story = {
  name: 'Bar Chart',
  render: () => (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[500px]">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  ),
};
