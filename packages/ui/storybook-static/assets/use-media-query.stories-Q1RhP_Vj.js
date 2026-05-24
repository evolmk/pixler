import{j as e}from"./iframe-DiBmah8n.js";import{u as a}from"./use-media-query-D-LVuxUO.js";import"./preload-helper-Dp1pzeXC.js";const p={title:"Hooks/useMediaQuery"};function r({query:o}){const t=a(o);return e.jsxs("div",{className:"rounded-md border border-border p-4 space-y-1",children:[e.jsx("p",{className:"font-mono text-sm",children:o}),e.jsxs("p",{className:"text-sm",children:["Matches: ",e.jsx("span",{className:t?"text-green-500 font-semibold":"text-muted-foreground",children:String(t)})]})]})}const s={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsx(r,{query:"(min-width: 640px)"}),e.jsx(r,{query:"(min-width: 768px)"}),e.jsx(r,{query:"(min-width: 1024px)"}),e.jsx(r,{query:"(prefers-color-scheme: dark)"}),e.jsx(r,{query:"(prefers-reduced-motion: reduce)"})]})};var d,m,n;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">
      <Demo query="(min-width: 640px)" />
      <Demo query="(min-width: 768px)" />
      <Demo query="(min-width: 1024px)" />
      <Demo query="(prefers-color-scheme: dark)" />
      <Demo query="(prefers-reduced-motion: reduce)" />
    </div>
}`,...(n=(m=s.parameters)==null?void 0:m.docs)==null?void 0:n.source}}};const x=["Default"];export{s as Default,x as __namedExportsOrder,p as default};
