import{j as e}from"./iframe-DiBmah8n.js";import{S as p,e as l,a as m,c,d as S,b as u}from"./sheet-Coy9WAYJ.js";import{B as g}from"./button-BJ388jTr.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./x-DD3zmhvC.js";import"./createLucideIcon-CuBiJGQq.js";import"./index-NPjijeIU.js";import"./index-DW48STyt.js";import"./index-BdmfpcL3.js";import"./index-CNN3lGzF.js";import"./index-D3z_qzfJ.js";import"./index-BwfHBDac.js";import"./index-BapAD8MO.js";import"./index-b-XmD0Le.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";import"./index-BX7Jlypa.js";import"./index-C36-YOaT.js";import"./index-BKrTnzlU.js";import"./index-CKNgsjxr.js";import"./index-DQHfBcw3.js";const I={title:"Components/Overlay/Sheet",tags:["autodocs"]},x=["top","right","bottom","left"],r={render:()=>e.jsxs(p,{children:[e.jsx(l,{asChild:!0,children:e.jsx(g,{variant:"outline",children:"Open (right)"})}),e.jsx(m,{children:e.jsxs(c,{children:[e.jsx(S,{children:"Edit profile"}),e.jsx(u,{children:"Make changes to your profile here."})]})})]})},i={render:()=>e.jsx("div",{className:"flex gap-2",children:x.map(t=>e.jsxs(p,{children:[e.jsx(l,{asChild:!0,children:e.jsx(g,{variant:"outline",size:"sm",children:t})}),e.jsx(m,{side:t,children:e.jsx(c,{children:e.jsxs(S,{children:[t," sheet"]})})})]},t))})};var s,o,n;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open (right)</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
}`,...(n=(o=r.parameters)==null?void 0:o.docs)==null?void 0:n.source}}};var a,h,d;i.parameters={...i.parameters,docs:{...(a=i.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2">
      {sides.map(side => <Sheet key={side}>
          <SheetTrigger asChild><Button variant="outline" size="sm">{side}</Button></SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader><SheetTitle>{side} sheet</SheetTitle></SheetHeader>
          </SheetContent>
        </Sheet>)}
    </div>
}`,...(d=(h=i.parameters)==null?void 0:h.docs)==null?void 0:d.source}}};const J=["Right","AllSides"];export{i as AllSides,r as Right,J as __namedExportsOrder,I as default};
