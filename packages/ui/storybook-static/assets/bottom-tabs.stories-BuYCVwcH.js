import{r as i,j as e}from"./iframe-DiBmah8n.js";import{B as m,M as n,F as c,G as p,S as u}from"./bottom-tabs-9z7ZMazg.js";import"./preload-helper-Dp1pzeXC.js";import"./createLucideIcon-CuBiJGQq.js";import"./utils-DclmTqRz.js";import"./use-media-query-D-LVuxUO.js";const j={title:"Components/Pixler/BottomTabs",tags:["autodocs"]},d=[{value:"chat",label:"Chat",icon:e.jsx(n,{})},{value:"plan",label:"Plan",icon:e.jsx(c,{})},{value:"pr",label:"PR",icon:e.jsx(p,{})},{value:"checks",label:"Checks",icon:e.jsx(u,{})}],t={parameters:{viewport:{defaultViewport:"mobile1"}},render:()=>{const[r,l]=i.useState("chat");return e.jsxs("div",{className:"relative h-[300px] bg-background",children:[e.jsx("p",{className:"p-4 text-sm text-muted-foreground",children:"BottomTabs renders only on <md viewports. Use the Storybook viewport control to simulate mobile."}),e.jsx(m,{items:d,value:r,onChange:l})]})}};var a,o,s;t.parameters={...t.parameters,docs:{...(a=t.parameters)==null?void 0:a.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    }
  },
  render: () => {
    const [tab, setTab] = useState('chat');
    return <div className="relative h-[300px] bg-background">
        <p className="p-4 text-sm text-muted-foreground">
          BottomTabs renders only on &lt;md viewports. Use the Storybook viewport control to simulate mobile.
        </p>
        <BottomTabs items={items} value={tab} onChange={setTab} />
      </div>;
  }
}`,...(s=(o=t.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const T=["Default"];export{t as Default,T as __namedExportsOrder,j as default};
