import{j as e}from"./iframe-DiBmah8n.js";import{T as n,b as c,e as m,f as d,d as t,a as T,c as s}from"./table-DohUPW24.js";import{B as b}from"./badge-DAu9tIKB.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DclmTqRz.js";import"./index-DQHfBcw3.js";import"./index-BdmfpcL3.js";const v={title:"Components/Data/Table",tags:["autodocs"]},u=[{id:"INV001",status:"Paid",method:"Credit Card",amount:"$250.00"},{id:"INV002",status:"Pending",method:"PayPal",amount:"$150.00"},{id:"INV003",status:"Unpaid",method:"Bank Transfer",amount:"$350.00"}],l={render:()=>e.jsxs(n,{children:[e.jsx(c,{children:"A list of recent invoices."}),e.jsx(m,{children:e.jsxs(d,{children:[e.jsx(t,{className:"w-[100px]",children:"Invoice"}),e.jsx(t,{children:"Status"}),e.jsx(t,{children:"Method"}),e.jsx(t,{className:"text-right",children:"Amount"})]})}),e.jsx(T,{children:u.map(a=>e.jsxs(d,{children:[e.jsx(s,{className:"font-medium",children:a.id}),e.jsx(s,{children:e.jsx(b,{variant:a.status==="Paid"?"default":a.status==="Pending"?"secondary":"destructive",children:a.status})}),e.jsx(s,{children:a.method}),e.jsx(s,{className:"text-right",children:a.amount})]},a.id))})]})};var i,o,r;l.parameters={...l.parameters,docs:{...(i=l.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <Table>
      <TableCaption>A list of recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map(inv => <TableRow key={inv.id}>
            <TableCell className="font-medium">{inv.id}</TableCell>
            <TableCell>
              <Badge variant={inv.status === 'Paid' ? 'default' : inv.status === 'Pending' ? 'secondary' : 'destructive'}>
                {inv.status}
              </Badge>
            </TableCell>
            <TableCell>{inv.method}</TableCell>
            <TableCell className="text-right">{inv.amount}</TableCell>
          </TableRow>)}
      </TableBody>
    </Table>
}`,...(r=(o=l.parameters)==null?void 0:o.docs)==null?void 0:r.source}}};const H=["Default"];export{l as Default,H as __namedExportsOrder,v as default};
