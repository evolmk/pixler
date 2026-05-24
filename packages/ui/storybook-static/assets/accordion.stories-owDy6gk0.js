import{j as t}from"./iframe-DiBmah8n.js";import{A as l,b as d,c as p,a as u}from"./accordion-C8YzGmLD.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./chevron-down-B60P3IxH.js";import"./createLucideIcon-CuBiJGQq.js";import"./index-CNN3lGzF.js";import"./index-DqJfhPI8.js";import"./index-BdmfpcL3.js";import"./index-DW48STyt.js";import"./index-BapAD8MO.js";import"./index-BwfHBDac.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";import"./index-w4TW1LoK.js";import"./index-CKNgsjxr.js";import"./index-D3z_qzfJ.js";import"./index-6BMVfGVJ.js";const _={title:"Components/Layout/Accordion",tags:["autodocs"]},g=[{value:"item-1",trigger:"Is it accessible?",content:"Yes. It adheres to the WAI-ARIA design pattern."},{value:"item-2",trigger:"Is it styled?",content:"Yes. It comes with default styles that matches the other components."},{value:"item-3",trigger:"Is it animated?",content:"Yes. It's animated by default, but you can disable it via the motion config."}],r={render:()=>t.jsx(l,{type:"single",collapsible:!0,className:"w-[400px]",children:g.map(e=>t.jsxs(d,{value:e.value,children:[t.jsx(p,{children:e.trigger}),t.jsx(u,{children:e.content})]},e.value))})},o={render:()=>t.jsx(l,{type:"multiple",className:"w-[400px]",children:g.map(e=>t.jsxs(d,{value:e.value,children:[t.jsx(p,{children:e.trigger}),t.jsx(u,{children:e.content})]},e.value))})};var i,n,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Accordion type="single" collapsible className="w-[400px]">
      {items.map(i => <AccordionItem key={i.value} value={i.value}>
          <AccordionTrigger>{i.trigger}</AccordionTrigger>
          <AccordionContent>{i.content}</AccordionContent>
        </AccordionItem>)}
    </Accordion>
}`,...(c=(n=r.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var s,a,m;o.parameters={...o.parameters,docs:{...(s=o.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <Accordion type="multiple" className="w-[400px]">
      {items.map(i => <AccordionItem key={i.value} value={i.value}>
          <AccordionTrigger>{i.trigger}</AccordionTrigger>
          <AccordionContent>{i.content}</AccordionContent>
        </AccordionItem>)}
    </Accordion>
}`,...(m=(a=o.parameters)==null?void 0:a.docs)==null?void 0:m.source}}};const L=["Single","Multiple"];export{o as Multiple,r as Single,L as __namedExportsOrder,_ as default};
