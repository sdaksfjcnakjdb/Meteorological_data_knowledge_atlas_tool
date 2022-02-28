import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Graph, Edge, EdgeView, Shape } from '@antv/x6'
import { FileSearchOutlined } from '@ant-design/icons';
import { useDrop } from 'react-dnd';
import { grayScale } from '@antv/x6/lib/registry/filter/gray-scale';
import { add } from 'lodash';
import { func } from 'prop-types';
import { Drawer as AntdDrawer, Modal, Button as AntdButton, Input, List as AntdList, Typography, Pagination, Upload, Divider, Button } from 'antd';



export default function Index(props) {
  const { kgRef, data, remove } = props
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
        ohter: {
          ohterList: "",
        },
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
    addNode: (ohter, name, id) => {
      addNode(ohter, name, id);
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
    moveCenter: (data) => {
      moveCenter(data);
    }
  }));

  const init = () => {
    var initnode;
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
    graph.current.on('node:click', ({ node }) => {
      //节点附加属性位置。
      // node.store.data.ohter
      graph.current.scrollToPoint(node.store.data.position.x, node.store.data.position.y, { animation: { duration: 400 } })
    })

    /*右键添加附加属性 */
    graph.current.on('node:contextmenu', ({ node }) => {
      contextmenu(node);
    })

    graph.current.on('node:mouseenter', ({ node }) => {
      mouseenter(node);
    })

    graph.current.on('node:mouseleave', ({ node }) => {
      mouseleave();
    })

    //鼠标leave事件
    function mouseleave() {
      ReactDOM.render(
        <>
        </>,
        document.getElementsByClassName("show-attribute")[0]
      );
    }

    //鼠标enter事件
    function mouseenter(node) {
      var name = node.store.data.className;
      var id = node.store.data.id;
      var ohter = node.store.data.ohter;
      var lists = ohter.ohterList.split('&');
      initnode = node;
      var addlist = document.createElement("div");

      //展示附属属性
      function NumberList(props) {
        const lists = props.lists;
        try {
          var number = lists.indexOf('');
          lists.splice(number,number+1);
        } catch { }
        const listItems = lists.map((list) =>
          <p> {list}: {ohter[list]}</p>
        );
        return (
          <div>{listItems}</div>
        );
      }
      ReactDOM.render(
        <><div class="addlist">
          <div>
            <p>名称：{name}</p>
            <p>编号：{id}</p>
          </div>
          <NumberList lists={lists} />
        </div>
        </>,
        document.getElementsByClassName("show-attribute")[0]
      );
    }

    //操作属性主方法
    function contextmenu(node) {
      // var name = node.store.data.className;
      // var id = node.store.data.id;
      // var ohter = node.store.data.ohter;
      // //为外部节点赋值
      initnode = node;
      // var addlist = document.createElement("div");


      //基本信息展示页面。已废用
      // var name_id = document.createElement("div");
      // var name_name_p = document.createElement("p");
      // var name_id_p = document.createElement("p");
      // name_name_p.innerHTML = "名称：" + name;
      // name_id_p.innerHTML = "编号：" + id;
      // name_id.appendChild(name_name_p);
      // name_id.appendChild(name_id_p);
      // addlist.appendChild(name_id);


      // //附加属性展示 已废用
      // var lists = ohter.ohterList.split('&');
      // for (var list in lists) {
      //   if (lists[list] != '') {
      //     var addlistT = document.createElement("div");
      //     var addlist_id = document.createElement("p");
      //     addlist_id.innerHTML = lists[list] + ": " + ohter[lists[list]];
      //     addlistT.appendChild(addlist_id);
      //     addlist.appendChild(addlistT);
      //   }
      // }
      // addlist.setAttribute("class", "addlist");


      //节点增加操作 ,已废用
      // var addTool = document.createElement("div");
      // var title = document.createElement("p");
      // title.innerHTML = "添加属性名称：";
      // addTool.appendChild(title);
      // addTool.setAttribute("class", "ant-modal-wrap");
      // var inputname = document.createElement("input");
      // var inputid = document.createElement("input");
      // var p = document.createElement("p");
      // var ok = document.createElement("button");
      // var cancel = document.createElement("button");
      // inputid.setAttribute("class", "inputid");
      // inputname.setAttribute("class", "inputname");
      // ok.textContent = "确定";
      // cancel.textContent = "取消";
      // ok.setAttribute("class", "ok");
      // cancel.setAttribute("class", "cancel");
      // p.innerHTML = "添加属性内容：";
      // addTool.appendChild(inputid);
      // addTool.appendChild(p);
      // addTool.appendChild(inputname);
      // addTool.appendChild(cancel);
      // addTool.appendChild(ok);



      // //整合  已废用
      // var all = document.createElement("div");
      // all.appendChild(addlist);
      // all.appendChild(addTool);
      // all.setAttribute("class", "add");
      // document.getElementsByClassName("topTitle")[0].appendChild(all);

      //调用方法执行节点属性添加
      // addNode("qwe","qwe",node);

      //展示附属属性
      // function NumberList(props) {
      //   const lists = props.lists;
      //   const listItems = lists.map((list) =>
      //      <p> {list}: {ohter[list]}</p>
      //   );
      //   return (
      //     <div>{listItems}</div>
      //   );
      // }

      //附加属性增加操作
      const AddAttribute = () => {
        const [isModalVisible, setIsModalVisible] = useState(true);

        const handleOk = () => {
          var name, inner;
          name = document.getElementById("name").value;
          inner = document.getElementById("inner").value;
          if (name != "" && inner != "") {
            addNode(name, inner, initnode);
          }
          else {
            alert("请输入正确的节点属性");
          }
          setIsModalVisible(false);
        };
        const handleCancel = () => {
          setIsModalVisible(false);
        };

        return (
          <>
            <Modal title="节点添加属性" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <p>属性名称：</p>
              <Input placeholder="name" id="name" />
              <p>属性内容：</p>
              <Input placeholder="inner" id="inner" />
            </Modal>
          </>
        );
      };
      ReactDOM.render(
        <>
          <AddAttribute />
        </>,
        document.getElementsByClassName("add-attribute")[0]
      );
    }

    //为画布中节点添加属性
    function addNode(name, inner, node) {
      node.store.data.ohter[name] = inner;
      node.store.data.ohter.ohterList += "&" + name;
    }
























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
    graph.current.on('node:removed', ({ cell }) => {
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
  const addNode = (ohter, name, id) => {
    console.log(kgRef)
    graph.current.addNode({
      id: id, // String，可选，节点的唯一标识
      x: 1000,       // Number，必选，节点位置的 x 值
      y: 500,       // Number，必选，节点位置的 y 值
      width: 70,   // Number，可选，节点大小的 width 值
      height: 70,  // Number，可选，节点大小的 height 值
      label: name, // String，节点标签
      shape: 'ellipse',
      ohter: ohter,
      className: name,
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
  const moveCenter = (data) => {
    // console.log("KGE");
    var x = 0, y = 0;
    var cells = graph.current.toJSON().cells;
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].id == data) {
        x = cells[i].position.x;
        y = cells[i].position.y;
        break;
      }
    }
    graph.current.scrollToPoint(x, y, { animation: { duration: 400 } })
  }

  //添加删除属性
  const addTool = (deletelist) => {
    var nodes = graph.current.getNodes();
    for (var i = 0; i < nodes.length; i++) {
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
        if (cells[i].attrs.text != undefined) {
          data[1].push(cells[i].attrs.text.text);
        } else {
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
    if (name == '') {
      name = $('#lang').val();
    }

    var data = graph.current.toJSON().cells;
    for (var i = 0; i < data.length; i++) {
      //边
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
      //节点
      else {
        //纯粹节点，无附加属性
        var node = {
          "comment": data[i].attrs.text.text.replace(/\n/g, ""),
          "name": data[i].id,
        }
        //非纯粹节点，具有附加属性
        if (data[i].ohter.ohterList != "&") {
          var list = data[i].ohter.ohterList.split('&');
          for (var ohter in list) {
            node[list[ohter]] = data[i].ohter[list[ohter]];
          }
        }
        nodes.push(node);
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