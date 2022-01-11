import React, { useEffect, useImperativeHandle, useState } from 'react'
import { List as AntdList, Typography } from 'antd';
import { LineOutlined, LeftOutlined, PlusCircleOutlined, CopyOutlined, FolderOpenOutlined, SaveOutlined, ToolOutlined } from '@ant-design/icons';


import {DragSource } from 'react-dnd'



const ListItem = (props) =>{
    const {data,connectDragPreview, connectDragSource } = props
    return connectDragPreview(
            connectDragSource(
                <div>
                <AntdList.Item
                >
                    <AntdList.Item.Meta
                        title={<a>{data.NodeName}</a>}
                        description={<Typography.Text>编号为 {data.Group} </Typography.Text>}
                    />
                    {/* <PlusCircleOutlined /> */}
                </AntdList.Item>
            </div>
            ),
          )
       
      
}

const Item = DragSource(
    "item",
    {
      beginDrag: (props) => ({
        component: props.data,
      }),
      endDrag:(item,monitor,component)=>{
        if(monitor.getDropResult().success)
        item.data.addItemHandle(item.data.ID)
      }
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging(),
    }),
  )(ListItem)

  
export default function Index(props){
    return <Item data={props}></Item>
}
// export default function Index(props) {
//     const {ID,Group ,NodeName, addItemHandle} = props
//     const [{ isDragging }, drag] = useDrag(() => ({
//         type: "BOX",
//         item: { ID,Group ,NodeName, addItemHandle },
//         //拖拽结束
//         end: (item, monitor) => {
//             const dropResult = monitor.getDropResult();
//             if (item && dropResult.add) {
//                 addItemHandle(item.ID)
//             }
//         },
//         collect: (monitor) => ({
//             isDragging: monitor.isDragging(),
//             handlerId: monitor.getHandlerId(),
//         }),
//     }));

 




//     return <div ref={drag} role="Box" data-testid={`item${ID}`}>
//                 <AntdList.Item
//                 >
//                     <AntdList.Item.Meta
//                         title={<a>{NodeName}</a>}
//                         description={<Typography.Text>本站点为[ {Group} ]组</Typography.Text>}
//                     />
//                     <PlusCircleOutlined />
//                 </AntdList.Item>
//             </div>


// }