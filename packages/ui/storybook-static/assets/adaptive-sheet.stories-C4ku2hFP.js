import{r as i,j as e}from"./iframe-DiBmah8n.js";import{A as a}from"./adaptive-sheet-DQuv18Au.js";import{B as m}from"./button-BJ388jTr.js";import"./preload-helper-Dp1pzeXC.js";import"./drawer-66zvcEOi.js";import"./index-NPjijeIU.js";import"./index-DW48STyt.js";import"./index-BdmfpcL3.js";import"./index-CNN3lGzF.js";import"./index-D3z_qzfJ.js";import"./index-BwfHBDac.js";import"./index-BapAD8MO.js";import"./index-b-XmD0Le.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";import"./index-BX7Jlypa.js";import"./index-C36-YOaT.js";import"./index-BKrTnzlU.js";import"./index-CKNgsjxr.js";import"./utils-DclmTqRz.js";import"./sheet-Coy9WAYJ.js";import"./x-DD3zmhvC.js";import"./createLucideIcon-CuBiJGQq.js";import"./use-media-query-D-LVuxUO.js";import"./index-DQHfBcw3.js";const P={title:"Components/Pixler/AdaptiveSheet",tags:["autodocs"]},t={render:()=>{const[p,o]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(m,{variant:"outline",onClick:()=>o(!0),children:"Open adaptive sheet"}),e.jsx(a,{open:p,onOpenChange:o,title:"Settings",children:e.jsx("div",{className:"space-y-4 px-4 pb-6",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Renders as a side sheet on ≥md, bottom drawer on <md. Resize the Storybook preview to see the behavior change."})})})]})}};var r,n,s;t.parameters={...t.parameters,docs:{...(r=t.parameters)==null?void 0:r.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    return <>
        <Button variant="outline" onClick={() => setOpen(true)}>Open adaptive sheet</Button>
        <AdaptiveSheet open={open} onOpenChange={setOpen} title="Settings">
          <div className="space-y-4 px-4 pb-6">
            <p className="text-sm text-muted-foreground">
              Renders as a side sheet on ≥md, bottom drawer on &lt;md.
              Resize the Storybook preview to see the behavior change.
            </p>
          </div>
        </AdaptiveSheet>
      </>;
  }
}`,...(s=(n=t.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};const q=["Default"];export{t as Default,q as __namedExportsOrder,P as default};
