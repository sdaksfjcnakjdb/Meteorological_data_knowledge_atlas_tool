import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Graph, Edge, EdgeView, Shape } from '@antv/x6'
import { FileSearchOutlined } from '@ant-design/icons';
import { useDrop } from 'react-dnd';
import { grayScale } from '@antv/x6/lib/registry/filter/gray-scale';



export default function Index(props) {
  const { kgRef, data ,remove } = props
  const ref = useRef(null)
  const graph = useRef(null)
  useEffect(() => {
    init()
  }, [data])


  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "item",
    //松开鼠标放下
    drop: (item, monitor) => {

      const currentMouseOffset = monitor.getClientOffset() //页面坐标
      const pos = graph.current.pageToLocal({ ...currentMouseOffset }) //本地画布坐标
      console.log(item.component.Group)
      graph.current.addNode({
        ...pos,
        id: item.component.Group,
        name: '',
        width: 50,   // Number，可选，节点大小的 width 值
        height: 50,  // Number，可选，节点大小的 height 值
        label: item.component.NodeName, // String，节点标签
        shape: 'ellipse',
        className: item.component.NodeName,
        attrs: {
          body: {
            fill: 'aquamarine',
            stroke: "aquamarine",
            strokeWidth: 1,
            magnet: true,
          },
          // label:{
          //   text:item.component.NodeName+'T',
          // }
        },
      })
      return {
        success: true
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useImperativeHandle(kgRef, () => ({
    //就是暴露给父组件的方法
    addNode: (name,id) => {
      addNode(name,id);
    },
    consoleSave: () => {
      consoleSave();
    },
    consoleTojson: () => {
      return consoleTojson()
    },
    addTool: (deletelist) => {
      return addTool(deletelist);
    },
    cleangraph: () => {
      cleangraph()
    },
    moveCenter:(data)=>{
      moveCenter(data);
    }
  }));

  const init = () => {
    graph.current = new Graph({
      container: document.getElementById("container"),
      width: 1920,
      height: 937,
      scroller: {//画布拖动
        enabled: true,
        pageVisible: true,
        pageBreak: true,
        pannable: true,
      },
      keyboard: true,//快捷键
      snapline: true,
      // interacting: true,

      history: {
        enabled: true,
      },

      history: true,
      connecting: {
        allowNode: true,
        allowBlank: false,
        allowMulti: false,
        allowLoop: false,
      },
      background: {
        color: '#f5f5f5', // 设置画布背景颜色  f5f5f5
      },
      grid: {
        size: 10,      // 网格大小 10px
        visible: true, // 渲染网格背景 
      },
    });
    let nodes = data.nodes.map(item => {
      return {
        ...item,
        // attrs: {
        //     body: {
        //       stroke: '#d9d9d9',
        //       strokeWidth: 1,
        //       magnet: true,
        //     },
        // },
      }
    })

    let edges = data.edges.map(item => {
      return {
        ...item,
        connector: {
          name: 'normal',
        },
        // tools: [
        //   {
        //     name: 'button-remove',
        //   },
        // ],
      }
    })
    // console.log("nodes");
    graph.current.addNodes(nodes)
    graph.current.addEdges(edges)
    // this.setState({ graph: graph })
    graph.current.history.undo()
    graph.current.history.redo()
    // console.log(graph.current.toJSON());


    /*编辑边*/
    graph.current.on('edge:click', ({ cell, e }) => {
      cell.addTools({
        name: cell.isEdge() ? 'edge-editor' : 'node-editor',
        args: {
          event: e,
        },
      },
      )
    })
    /*点击居中*/
    graph.current.on('node:click',({ node }) => {
      graph.current.scrollToPoint(node.store.data.position.x, node.store.data.position.y,  { animation: { duration: 400 }})
    })

    /*删除边*/
    graph.current.on('edge:contextmenu', ({ edge }) => {
      edge.addTools(
        [
          {
            name: 'button-remove',
            // args: { distance: 20  },
          },
        ],
      )
    })

    graph.current.on('edge:mousemove', ({ edge }) => {
      edge.removeTools(name, 'button-remove')
    })


    //删除节点相应事件*/
    graph.current.on('node:removed',({cell}) =>{
      console.log("cell");
      console.log(cell.id);
      remove(cell.id);
    })
    /*文字缩小测试*/
    // graph.current.on('node:mouseenter', ({ node }) => {
    //   if(node.classlabel == undefined){
    //     node.classlabel = node.label + '';
    //     node.className = node.store.data.attrs.label.text;
    //   }
    //   // node.label = node.className;
    // })

    // graph.current.on('node:mouseleave', ({ node }) => {
    //   node.label = node.classlabel;
    // })

  }





  /*新增节点*/
  const addNode = (name,id) => {
    console.log(kgRef)
    graph.current.addNode({
      id: id, // String，可选，节点的唯一标识
      x: 1000,       // Number，必选，节点位置的 x 值
      y: 500,       // Number，必选，节点位置的 y 值
      width: 50,   // Number，可选，节点大小的 width 值
      height: 50,  // Number，可选，节点大小的 height 值
      label: name, // String，节点标签
      shape: 'ellipse',
      attrs: {
        body: {
          fill: 'aquamarine',
          stroke: 'aquamarine',
          strokeWidth: 1,
          magnet: true,
        },
      },
    })
  }

  //点击抽屉居中功能
  const moveCenter =(data) =>{
    // console.log("KGE");
    var x = 0,y = 0;
    var cells = graph.current.toJSON().cells;
    for(var i= 0;i<cells.length;i++){
      if(cells[i].id == data){
          x = cells[i].position.x;
          y = cells[i].position.y;
          break;
      }
    }
    graph.current.scrollToPoint(x, y,  { animation: { duration: 400 }})
  }

  //添加删除属性
  const addTool = (deletelist) => {
    var nodes = graph.current.getNodes();
    for(var i = 0;i<nodes.length;i++){
      // if(node[i].)
      nodes[i].removeTools();
    }
    for (var i = 0; i < deletelist.length; i++) {
      var node = graph.current.getCellById(deletelist[i]);
      node.addTools(
        [
          {
            name: 'button-remove',
          },
        ],
      )
    }
  }
  //数据读取
  const consoleTojson = () => {
    // console.log(graph.current.toJSON())
    var data = [];
    data.push([]);
    data.push([]);
    var cells = graph.current.toJSON().cells;
    // console.log(cells);
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].shape == 'edge') {
      }
      else {
        // console.log(cells[i]);
        data[0].push(cells[i].id);
        if(cells[i].attrs.text != undefined){
        data[1].push(cells[i].attrs.text.text);
        }else{
          data[1].push('');
        }
      }
    }
    // console.log(data);
    return data;
  }


  const cleangraph = () => {
    if (graph.current != null) {
      graph.current.fromJSON([]);
    }
  }

  // 文件保存
  const consoleSave = () => {
    var edges = [];
    var nodes = [];
    var name = document.getElementById("graphname").value;
    if(name == ''){
      name = $('#lang').val();
    }

    var data = graph.current.toJSON().cells;
    for (var i = 0; i < data.length; i++) {
      if (data[i].shape == 'edge') {
        var edge = {
          "source": data[i].source.cell,
          "target": data[i].target.cell,
        };
        if (data[i].labels != undefined) {
          edge.type = data[i].labels[0].attrs.label.text;
        }
        edges.push(edge);
      }
      else {
        nodes.push({
          "comment": data[i].attrs.text.text.replace(/\n/g,""),
          "name": data[i].id,
        })
      }
    }
    var datas = {
      "label": [
        { "labelName": name }
      ],
      "nodes": nodes,
      "links": edges,
    }

    $.ajax({
      type: "Post",//请求方式
      url: "action",//地址，就是json文件的请求路径
      data: { "action": "updateLabel", "label": JSON.stringify(datas) },
      dataType: "json",//数据类型可以为 text xml json  script  jsonp
      // contentType: "application/json; charset=utf-8",
      async: false,
      success: function (result) {
        // console.log(result);
      }
    })
    graph.current.fromJSON([]);
    // console.log(datas);
  }

  return <div id="container" ref={drop}></div>

}