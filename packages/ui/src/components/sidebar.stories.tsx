import type { Meta, StoryObj } from '@storybook/react';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from './sidebar';
import { Home, Settings, FolderOpen } from 'lucide-react';

const meta: Meta = { title: 'Components/Navigation/Sidebar', tags: ['autodocs'] };
export default meta;
type Story = StoryObj;

const items = [
  { title: 'Home', icon: Home, url: '#' },
  { title: 'Projects', icon: FolderOpen, url: '#' },
  { title: 'Settings', icon: Settings, url: '#' },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider style={{ '--sidebar-width': '200px' } as React.CSSProperties}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}><item.icon /><span>{item.title}</span></a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex items-center gap-2 p-4">
        <SidebarTrigger />
        <p className="text-sm text-muted-foreground">Main content area</p>
      </main>
    </SidebarProvider>
  ),
};
