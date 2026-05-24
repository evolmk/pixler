import{r as g,j as e}from"./iframe-DiBmah8n.js";import{S as o}from"./stepper-Dsv6b4QF.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./minus-CQUCQkvC.js";import"./createLucideIcon-CuBiJGQq.js";const w={title:"Components/Pixler/Stepper",tags:["autodocs"]},s={render:()=>{const[t,n]=g.useState(1);return e.jsx(o,{value:t,onChange:n,min:0,max:10,className:"w-36"})}},a={render:()=>{const[t,n]=g.useState(8);return e.jsxs("div",{className:"space-y-1",children:[e.jsx(o,{value:t,onChange:n,min:1,max:10,className:"w-36"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Range: 1–10"})]})}},r={render:()=>e.jsx(o,{value:5,onChange:()=>{},disabled:!0,className:"w-36"})};var m,c,p;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = useState(1);
    return <Stepper value={v} onChange={setV} min={0} max={10} className="w-36" />;
  }
}`,...(p=(c=s.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var d,u,l;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = useState(8);
    return <div className="space-y-1">
        <Stepper value={v} onChange={setV} min={1} max={10} className="w-36" />
        <p className="text-xs text-muted-foreground">Range: 1–10</p>
      </div>;
  }
}`,...(l=(u=a.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var i,x,v;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Stepper value={5} onChange={() => {}} disabled className="w-36" />
}`,...(v=(x=r.parameters)==null?void 0:x.docs)==null?void 0:v.source}}};const V=["Default","Clamped","Disabled"];export{a as Clamped,s as Default,r as Disabled,V as __namedExportsOrder,w as default};
