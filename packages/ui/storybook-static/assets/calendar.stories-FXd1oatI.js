import{r as l,j as p}from"./iframe-DiBmah8n.js";import{C as u}from"./calendar-CMNQ3FvC.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./button-BJ388jTr.js";import"./index-DQHfBcw3.js";import"./index-BdmfpcL3.js";import"./chevron-left-LHSbpE_-.js";import"./createLucideIcon-CuBiJGQq.js";import"./chevron-right-CO8_emn2.js";import"./chevron-down-B60P3IxH.js";const w={title:"Components/Forms/Calendar",tags:["autodocs"]},r={render:()=>{const[e,o]=l.useState(new Date);return p.jsx(u,{mode:"single",selected:e,onSelect:o,className:"rounded-md border border-border"})}},t={render:()=>{const[e,o]=l.useState({});return p.jsx(u,{mode:"range",selected:{from:e.from,to:e.to},onSelect:i=>o(i??{}),className:"rounded-md border border-border"})}};var a,n,s;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border border-border" />;
  }
}`,...(s=(n=r.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var d,m,c;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [range, setRange] = useState<{
      from?: Date;
      to?: Date;
    }>({});
    return <Calendar mode="range" selected={{
      from: range.from,
      to: range.to
    }} onSelect={r => setRange(r ?? {})} className="rounded-md border border-border" />;
  }
}`,...(c=(m=t.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const _=["Default","Range"];export{r as Default,t as Range,_ as __namedExportsOrder,w as default};
