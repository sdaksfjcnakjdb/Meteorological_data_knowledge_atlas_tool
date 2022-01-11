import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Tool from './component/base/tool/Tool'

const data = [{id:"1",title:"消息"},{id:"2",title:"通知"}]

ReactDOM.render(
  <div id="k">
    {/* <EditGrid type="edit" id="fpfKrlMgSA" selectionWidth="32" showPagination={false} rowSelection={true} isAsync={true} showLoading={true} bordered={false} dataSource={[{id:"1", name:"1"},{id:"2", name:"2"}]} width="100%" height="100%" style={{}}>  
        <Column type="editable" id="UjoXLFRFfK" dataIndex="name" title="NAME" width="97%" align="left" sort={false} ellipsis={false} style={{}}>
				  <Input name="name" fieldLabel="ID" id="name" width="100%" size="default" disabled={false} column={1} readOnly={false} fieldRequired={true} allowClear={false} bordered={true} style={{}}></Input>
				</Column> 
    </EditGrid> */}
    <Tool staticDataSource={data}><div>测试</div></Tool>
  </div>, document.getElementById("hk-app")
)
