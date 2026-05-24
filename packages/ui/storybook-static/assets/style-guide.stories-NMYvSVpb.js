import{j as e}from"./iframe-DiBmah8n.js";import{B as i}from"./button-BJ388jTr.js";import{B as c}from"./badge-DAu9tIKB.js";import{S as m}from"./separator-Cw7uT9Cn.js";import"./preload-helper-Dp1pzeXC.js";import"./index-DQHfBcw3.js";import"./utils-DclmTqRz.js";import"./index-BdmfpcL3.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";const T={title:"Demos/Style Guide",parameters:{layout:"fullscreen"}},x=[{name:"background",token:"bg-background",label:"Background"},{name:"foreground",token:"bg-foreground",label:"Foreground"},{name:"card",token:"bg-card",label:"Card"},{name:"primary",token:"bg-primary",label:"Primary"},{name:"secondary",token:"bg-secondary",label:"Secondary"},{name:"muted",token:"bg-muted",label:"Muted"},{name:"accent",token:"bg-accent",label:"Accent"},{name:"destructive",token:"bg-destructive",label:"Destructive"},{name:"border",token:"bg-border",label:"Border"},{name:"input",token:"bg-input",label:"Input"},{name:"ring",token:"bg-ring",label:"Ring"}],p=[{token:"bg-brand",label:"brand"},{token:"bg-brand-light",label:"brand-light"},{token:"bg-brand-dark",label:"brand-dark"}],u=[{token:"bg-status-error",label:"error"},{token:"bg-status-warning",label:"warning"},{token:"bg-status-success",label:"success"},{token:"bg-status-info",label:"info"}],b=[{label:"xs",cls:"text-xs"},{label:"sm",cls:"text-sm"},{label:"base",cls:"text-base"},{label:"lg",cls:"text-lg"},{label:"xl",cls:"text-xl"},{label:"2xl",cls:"text-2xl"},{label:"3xl",cls:"text-3xl"},{label:"4xl",cls:"text-4xl"}],g=[{label:"light",cls:"font-light"},{label:"normal",cls:"font-normal"},{label:"medium",cls:"font-medium"},{label:"semibold",cls:"font-semibold"},{label:"bold",cls:"font-bold"},{label:"extrabold",cls:"font-extrabold"}],f=["rounded-none","rounded-sm","rounded-md","rounded-lg","rounded-xl","rounded-2xl","rounded-full"],v=["shadow-none","shadow-sm","shadow","shadow-md","shadow-lg","shadow-xl","shadow-2xl"],h=[.5,1,1.5,2,3,4,5,6,8,10,12,16,20,24];function t({title:a,children:l}){return e.jsxs("section",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-semibold text-foreground",children:a}),e.jsx(m,{className:"mt-2"})]}),l]})}function r({token:a,label:l}){return e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsx("div",{className:`size-12 rounded-md border border-border ${a}`}),e.jsx("span",{className:"text-[10px] text-muted-foreground font-mono",children:l})]})}const s={name:"Style Guide",render:()=>e.jsxs("div",{className:"min-h-screen bg-background p-8 space-y-12",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-3xl font-bold text-foreground",children:"Pixler UI — Style Guide"}),e.jsx("p",{className:"text-sm text-muted-foreground mt-1",children:"Design tokens, typography, spacing, and component patterns."})]}),e.jsx(t,{title:"Semantic Colors",children:e.jsx("div",{className:"flex flex-wrap gap-4",children:x.map(a=>e.jsx(r,{token:a.token,label:a.label},a.name))})}),e.jsx(t,{title:"Brand & Status Colors",children:e.jsxs("div",{className:"flex flex-wrap gap-4",children:[p.map(a=>e.jsx(r,{token:a.token,label:a.label},a.label)),u.map(a=>e.jsx(r,{token:a.token,label:a.label},a.label))]})}),e.jsx(t,{title:"Typography Scale",children:e.jsx("div",{className:"space-y-2",children:b.map(a=>e.jsxs("div",{className:"flex items-baseline gap-4",children:[e.jsx("span",{className:"w-10 text-xs text-muted-foreground font-mono",children:a.label}),e.jsx("span",{className:`${a.cls} text-foreground font-medium`,children:"The quick brown fox jumps over the lazy dog"})]},a.label))})}),e.jsx(t,{title:"Font Weights",children:e.jsx("div",{className:"space-y-1",children:g.map(a=>e.jsxs("div",{className:"flex items-baseline gap-4",children:[e.jsx("span",{className:"w-20 text-xs text-muted-foreground font-mono",children:a.label}),e.jsx("span",{className:`${a.cls} text-base text-foreground`,children:"Inter Variable — Pixler UI"})]},a.label))})}),e.jsx(t,{title:"Text Colors",children:e.jsx("div",{className:"flex flex-wrap gap-4",children:[{cls:"text-foreground",label:"foreground"},{cls:"text-muted-foreground",label:"muted-foreground"},{cls:"text-primary",label:"primary"},{cls:"text-secondary-foreground",label:"secondary-fg"},{cls:"text-destructive",label:"destructive"},{cls:"text-brand",label:"brand"}].map(a=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:`${a.cls} text-sm font-medium`,children:"Aa"}),e.jsx("span",{className:"text-[10px] text-muted-foreground font-mono",children:a.label})]},a.cls))})}),e.jsx(t,{title:"Border Radius",children:e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:f.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsx("div",{className:`size-12 bg-primary ${a}`}),e.jsx("span",{className:"text-[10px] text-muted-foreground font-mono",children:a.replace("rounded-","")})]},a))})}),e.jsx(t,{title:"Shadows",children:e.jsx("div",{className:"flex flex-wrap items-end gap-6",children:v.map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("div",{className:`size-16 rounded-md bg-card border border-border ${a}`}),e.jsx("span",{className:"text-[10px] text-muted-foreground font-mono",children:a.replace("shadow-","")||"default"})]},a))})}),e.jsx(t,{title:"Spacing Scale",children:e.jsx("div",{className:"space-y-1",children:h.map(a=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"w-8 text-xs text-muted-foreground font-mono text-right",children:a}),e.jsx("div",{style:{width:`${a*4}px`},className:"h-3 bg-primary rounded-sm"}),e.jsxs("span",{className:"text-xs text-muted-foreground",children:[a*4,"px"]})]},a))})}),e.jsxs(t,{title:"Component Comparison",children:[e.jsx("div",{className:"flex gap-4 flex-wrap",children:["default","secondary","outline","ghost","destructive"].map(a=>e.jsx(i,{variant:a,children:a},a))}),e.jsx("div",{className:"flex gap-2 flex-wrap mt-4",children:["default","secondary","outline","destructive"].map(a=>e.jsx(c,{variant:a,children:a},a))})]}),e.jsx(t,{title:"Hover & Interactive States",children:e.jsxs("div",{className:"flex gap-3",children:[e.jsx("div",{className:"px-4 py-2 rounded-md text-sm bg-muted hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",children:"Hover me"}),e.jsx("div",{className:"px-4 py-2 rounded-md text-sm border border-border hover:border-primary cursor-pointer transition-colors",children:"Border hover"}),e.jsx("div",{className:"px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors",children:"Text hover"})]})}),e.jsx(t,{title:"Opacity Variants",children:e.jsx("div",{className:"flex gap-2 flex-wrap",children:[0,10,20,30,40,50,60,70,80,90,100].map(a=>e.jsxs("div",{className:"flex flex-col items-center gap-1",children:[e.jsx("div",{className:`size-10 rounded bg-primary opacity-${a}`}),e.jsxs("span",{className:"text-[10px] font-mono text-muted-foreground",children:[a,"%"]})]},a))})})]})};var o,n,d;s.parameters={...s.parameters,docs:{...(o=s.parameters)==null?void 0:o.docs,source:{originalSource:`{
  name: 'Style Guide',
  render: () => <div className="min-h-screen bg-background p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pixler UI — Style Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">Design tokens, typography, spacing, and component patterns.</p>
      </div>

      <Section title="Semantic Colors">
        <div className="flex flex-wrap gap-4">
          {semanticColors.map(c => <Swatch key={c.name} token={c.token} label={c.label} />)}
        </div>
      </Section>

      <Section title="Brand & Status Colors">
        <div className="flex flex-wrap gap-4">
          {brandColors.map(c => <Swatch key={c.label} token={c.token} label={c.label} />)}
          {statusColors.map(c => <Swatch key={c.label} token={c.token} label={c.label} />)}
        </div>
      </Section>

      <Section title="Typography Scale">
        <div className="space-y-2">
          {textSizes.map(s => <div key={s.label} className="flex items-baseline gap-4">
              <span className="w-10 text-xs text-muted-foreground font-mono">{s.label}</span>
              <span className={\`\${s.cls} text-foreground font-medium\`}>The quick brown fox jumps over the lazy dog</span>
            </div>)}
        </div>
      </Section>

      <Section title="Font Weights">
        <div className="space-y-1">
          {weights.map(w => <div key={w.label} className="flex items-baseline gap-4">
              <span className="w-20 text-xs text-muted-foreground font-mono">{w.label}</span>
              <span className={\`\${w.cls} text-base text-foreground\`}>Inter Variable — Pixler UI</span>
            </div>)}
        </div>
      </Section>

      <Section title="Text Colors">
        <div className="flex flex-wrap gap-4">
          {[{
          cls: 'text-foreground',
          label: 'foreground'
        }, {
          cls: 'text-muted-foreground',
          label: 'muted-foreground'
        }, {
          cls: 'text-primary',
          label: 'primary'
        }, {
          cls: 'text-secondary-foreground',
          label: 'secondary-fg'
        }, {
          cls: 'text-destructive',
          label: 'destructive'
        }, {
          cls: 'text-brand',
          label: 'brand'
        }].map(c => <div key={c.cls} className="flex flex-col gap-1">
              <span className={\`\${c.cls} text-sm font-medium\`}>Aa</span>
              <span className="text-[10px] text-muted-foreground font-mono">{c.label}</span>
            </div>)}
        </div>
      </Section>

      <Section title="Border Radius">
        <div className="flex flex-wrap items-center gap-4">
          {radii.map(r => <div key={r} className="flex flex-col items-center gap-1.5">
              <div className={\`size-12 bg-primary \${r}\`} />
              <span className="text-[10px] text-muted-foreground font-mono">{r.replace('rounded-', '')}</span>
            </div>)}
        </div>
      </Section>

      <Section title="Shadows">
        <div className="flex flex-wrap items-end gap-6">
          {shadows.map(s => <div key={s} className="flex flex-col items-center gap-2">
              <div className={\`size-16 rounded-md bg-card border border-border \${s}\`} />
              <span className="text-[10px] text-muted-foreground font-mono">{s.replace('shadow-', '') || 'default'}</span>
            </div>)}
        </div>
      </Section>

      <Section title="Spacing Scale">
        <div className="space-y-1">
          {spacings.map(s => <div key={s} className="flex items-center gap-3">
              <span className="w-8 text-xs text-muted-foreground font-mono text-right">{s}</span>
              <div style={{
            width: \`\${s * 4}px\`
          }} className="h-3 bg-primary rounded-sm" />
              <span className="text-xs text-muted-foreground">{s * 4}px</span>
            </div>)}
        </div>
      </Section>

      <Section title="Component Comparison">
        <div className="flex gap-4 flex-wrap">
          {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map(v => <Button key={v} variant={v}>{v}</Button>)}
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          {(['default', 'secondary', 'outline', 'destructive'] as const).map(v => <Badge key={v} variant={v}>{v}</Badge>)}
        </div>
      </Section>

      <Section title="Hover & Interactive States">
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-md text-sm bg-muted hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">Hover me</div>
          <div className="px-4 py-2 rounded-md text-sm border border-border hover:border-primary cursor-pointer transition-colors">Border hover</div>
          <div className="px-4 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Text hover</div>
        </div>
      </Section>

      <Section title="Opacity Variants">
        <div className="flex gap-2 flex-wrap">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(o => <div key={o} className="flex flex-col items-center gap-1">
              <div className={\`size-10 rounded bg-primary opacity-\${o}\`} />
              <span className="text-[10px] font-mono text-muted-foreground">{o}%</span>
            </div>)}
        </div>
      </Section>
    </div>
}`,...(d=(n=s.parameters)==null?void 0:n.docs)==null?void 0:d.source}}};const G=["Guide"];export{s as Guide,G as __namedExportsOrder,T as default};
