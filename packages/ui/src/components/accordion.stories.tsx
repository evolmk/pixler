import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta: Meta = { title: 'Components/Layout/Accordion', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const items = [
  { value: 'item-1', trigger: 'Is it accessible?', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'item-2', trigger: 'Is it styled?', content: 'Yes. It comes with default styles that matches the other components.' },
  { value: 'item-3', trigger: 'Is it animated?', content: "Yes. It's animated by default, but you can disable it via the motion config." },
];

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      {items.map((i) => (
        <AccordionItem key={i.value} value={i.value}>
          <AccordionTrigger>{i.trigger}</AccordionTrigger>
          <AccordionContent>{i.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      {items.map((i) => (
        <AccordionItem key={i.value} value={i.value}>
          <AccordionTrigger>{i.trigger}</AccordionTrigger>
          <AccordionContent>{i.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
