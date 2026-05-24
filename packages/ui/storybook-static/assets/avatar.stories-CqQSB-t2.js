import{j as a}from"./iframe-DiBmah8n.js";import{A as t,b as g,a as c}from"./avatar-bx7Gt_Id.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./index-CNN3lGzF.js";import"./index-BX7Jlypa.js";import"./index-BwfHBDac.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";import"./index-BdmfpcL3.js";import"./index-CpYcavvB.js";const y={title:"Components/Display/Avatar",tags:["autodocs"]},r={render:()=>a.jsxs(t,{children:[a.jsx(g,{src:"https://github.com/shadcn.png",alt:"shadcn"}),a.jsx(c,{children:"CN"})]})},s={render:()=>a.jsxs(t,{children:[a.jsx(g,{src:"/broken.jpg",alt:"User"}),a.jsx(c,{children:"MK"})]})},e={render:()=>a.jsx("div",{className:"flex items-center gap-3",children:["size-6","size-8","size-10","size-12","size-16"].map(o=>a.jsx(t,{className:o,children:a.jsx(c,{className:"text-xs",children:"AB"})},o))})};var i,m,n;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
}`,...(n=(m=r.parameters)==null?void 0:m.docs)==null?void 0:n.source}}};var l,p,d;s.parameters={...s.parameters,docs:{...(l=s.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => <Avatar>
      <AvatarImage src="/broken.jpg" alt="User" />
      <AvatarFallback>MK</AvatarFallback>
    </Avatar>
}`,...(d=(p=s.parameters)==null?void 0:p.docs)==null?void 0:d.source}}};var v,A,x;e.parameters={...e.parameters,docs:{...(v=e.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3">
      {(['size-6', 'size-8', 'size-10', 'size-12', 'size-16'] as const).map(sz => <Avatar key={sz} className={sz}>
          <AvatarFallback className="text-xs">AB</AvatarFallback>
        </Avatar>)}
    </div>
}`,...(x=(A=e.parameters)==null?void 0:A.docs)==null?void 0:x.source}}};const B=["WithImage","Fallback","Sizes"];export{s as Fallback,e as Sizes,r as WithImage,B as __namedExportsOrder,y as default};
