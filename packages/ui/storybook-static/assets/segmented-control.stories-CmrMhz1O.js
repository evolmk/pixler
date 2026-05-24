import{r as p,j as u}from"./iframe-DiBmah8n.js";import{S as d}from"./segmented-control-KFzw0rvI.js";import"./preload-helper-Dp1pzeXC.js";import"./toggle-group-VLVE_fpI.js";import"./utils-DclmTqRz.js";import"./toggle-C5SvwG3n.js";import"./index-DQHfBcw3.js";import"./index-DW48STyt.js";import"./index-BapAD8MO.js";import"./index-BwfHBDac.js";import"./index-C6ofiYkj.js";import"./index-BxjAio25.js";import"./index-CmPuaika.js";import"./index-BdmfpcL3.js";import"./index-CNN3lGzF.js";import"./index-D9QtbIIo.js";import"./index-DqJfhPI8.js";import"./index-D3z_qzfJ.js";import"./index-BX7Jlypa.js";import"./index-6BMVfGVJ.js";const M={title:"Components/Pixler/SegmentedControl",tags:["autodocs"]},e={render:()=>{const[r,a]=p.useState("day");return u.jsx(d,{value:r,onChange:a,options:[{value:"day",label:"Day"},{value:"week",label:"Week"},{value:"month",label:"Month"}]})}},t={render:()=>{const[r,a]=p.useState("list");return u.jsx(d,{value:r,onChange:a,options:[{value:"list",label:"List"},{value:"grid",label:"Grid"},{value:"board",label:"Board",disabled:!0}]})}};var o,n,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = useState('day');
    return <SegmentedControl value={v} onChange={setV} options={[{
      value: 'day',
      label: 'Day'
    }, {
      value: 'week',
      label: 'Week'
    }, {
      value: 'month',
      label: 'Month'
    }]} />;
  }
}`,...(s=(n=e.parameters)==null?void 0:n.docs)==null?void 0:s.source}}};var l,i,m;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [v, setV] = useState('list');
    return <SegmentedControl value={v} onChange={setV} options={[{
      value: 'list',
      label: 'List'
    }, {
      value: 'grid',
      label: 'Grid'
    }, {
      value: 'board',
      label: 'Board',
      disabled: true
    }]} />;
  }
}`,...(m=(i=t.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const _=["Default","WithDisabled"];export{e as Default,t as WithDisabled,_ as __namedExportsOrder,M as default};
