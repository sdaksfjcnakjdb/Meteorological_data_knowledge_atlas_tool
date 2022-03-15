import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { Graph, Edge, EdgeView, Shape } from '@antv/x6'
import { FileSearchOutlined } from '@ant-design/icons';
import { useDrop } from 'react-dnd';
import { grayScale } from '@antv/x6/lib/registry/filter/gray-scale';
import { add } from 'lodash';
import { func, Object } from 'prop-types';
import { Drawer as AntdDrawer, Modal, Button as AntdButton, Input, List as AntdList, Typography, Pagination, Upload, Divider, Button } from 'antd';
import { render } from 'less';



export default function Index(props) {
  const { kgRef, data, remove } = props
  const ref = useRef(null)
  const graph = useRef(null)
  useEffect(() => {
    init()
  }, [data])

  function keys(obj) {
    let lists = [];
    for (var key in obj) {
      lists.push(key);
    }
    return lists;
  }

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

        },
        style: "add",
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
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'rightMouseDown', 'mouseWheel']
      },
      keyboard: true,//快捷键
      snapline: true,
      // interacting: true,

      history: {
        enabled: true,
      },
      deleteNode: [],
      deleteLink: [],
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

    //节点删除事件
    graph.current.on('node:removed', ({ node }) => {
      graph.current.options.deleteNode.push(node.id);
    })

    //边删除事件
    graph.current.on('edge:removed', ({ edge }) => {
      graph.current.options.deleteLink.push({
        source: edge.store.data.source.cell,
        target: edge.store.data.target.cell,
      });
    })


    //新增
    graph.current.on('edge:added', ({ edge }) => {

      if (edge.store.data.target.cell == undefined) {//新增关系
        edge.store.data.style = "add";
      }
    })


    //修改
    graph.current.on('edge:changed', ({ edge }) => {
      if (edge.store.data.style) {
      }
      else {
        edge.store.data.style = "update";
      }
    })


    graph.current
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
    console.log("nodes");
    console.log("edges");
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
      UpdataAttribute(node);
    })

    // //鼠标进入事件
    // graph.current.on('node:mouseenter', ({ node }) => {
    //   mouseenter(node);
    // })

    // //鼠标离开事件
    // graph.current.on('node:mouseleave', ({ node }) => {
    //   mouseleave();
    // })

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
      let lists = keys(ohter);
      initnode = node;
      var addlist = document.createElement("div");

      //展示附属属性
      function NumberList(props) {
        const lists = props.lists;
        try {
          var number = lists.indexOf('');
          lists.splice(number, 1);
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


    //属性增加操作页面
    function AddAttribute(initnode) {
      //属性增加操作页面
      const Attribute = () => {
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
          UpdataAttribute(initnode);
        };
        const handleCancel = () => {
          UpdataAttribute(initnode);
        };

        function addNode(name, inner, node) {
          node.store.data.ohter[name] = inner;
          if (node.store.data.style == "") {
            node.store.data.style = "updata";
          }
        }
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
          <Attribute />
        </>,
        document.getElementsByClassName("add-attribute")[0]
      );
    }

    //删除按钮DOM
    function DeleteButton(props) {
      const name = props.name;
      var initnode = props.initnode;


      const deleteAttribute = () => {
        delete initnode.store.data.ohter[name]
        if (initnode.store.data.style == "") {
          initnode.store.data.style = "updata";
        }
        document.getElementById(name).remove();
      }
      return (
        <>
          <Button danger id={name} size="large" block onClick={deleteAttribute}>删除 {name}  属性</Button>
          <div id="buttonDiv"></div>
          <br />
        </>
      );

    }

    //属性删除操作页面
    function DeleteAttribute(initnode) {

      const Attribute = () => {
        const [isModalVisible, setIsModalVisible] = useState(true);
        if (keys(initnode.store.data.ohter).length == 0) {
          lists = [];
        } else {
          var lists = keys(initnode.store.data.ohter);
          var number = lists.indexOf('');
          try {
            lists.splice(number, 1);
          } catch { }
        }
        var listItems = lists.map((list) =>
          <DeleteButton name={list} initnode={initnode} onClick={handleOk} id="deleteAttribute" />
        );
        if (lists.length == 0) {
          listItems = <p>该节点不存在附属属性</p>
        }

        const handleOk = () => {
          setIsModalVisible(false);
        };

        const handleCancel = () => {
          setIsModalVisible(false);
        };

        return (
          <>
            <Modal title="节点删除属性" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              {listItems}
            </Modal>
          </>
        );
      };
      ReactDOM.render(
        <>
          <Attribute />
        </>,
        document.getElementsByClassName("add-attribute")[0]
      );
    }

    //显示节点主属性
    function UpdataNodemain(props) {
      const name = props.name;
      const inner = props.inner;
      var initnode = props.initnode;

      //修改节点属性
      function updataNode() {
        var inner = document.getElementById("updatanodeinner").value;
        initnode.store.data[name] = inner;
        if (initnode.store.data.style == "") {
          initnode.store.data.style = "updata";
        }
        alert("节点属性" + name + "修改成功!");
      }
      return (
        <>
          <div id={name} class="updatadiv">
            <h3 class='updatanodenamemain' id="name">{name}</h3>
            <h3 class="" >{inner}</h3>
          </div>
        </>
      );
    }

    //修改、删除DOM
    function UpdataNode(props) {
      const name = props.name;
      const inner = props.inner;
      var initnode = props.initnode;

      //修改节点属性
      function updataNode() {
        var name, inner;
        name = document.getElementById("name").innerHTML;
        inner = document.getElementById("updatanodeinner").value;
        initnode.store.data.ohter[name] = inner;
        if (initnode.store.data.style == "") {
          initnode.store.data.style = "updata";
        }
        alert("节点属性" + name + "修改成功!");
      }

      //删除节点属性
      const deleteAttribute = () => {
        delete initnode.store.data.ohter[name];
        if (initnode.store.data.ohter.delete) {
          initnode.store.data.ohter.delete.push(name);
        }
        var lists = keys(initnode.store.data.ohter);
        if (initnode.store.data.style == "") {
          initnode.store.data.style = "updata";
        }
        document.getElementById(name).remove();
      }
      if (name == "delete") {
        back = <></>
      }
      else {
        var back =
          <>
            <div id={name} class="updatadiv">
              <h3 className='updatanodename' id="name">{name}</h3>
              <Input placeholder={inner} id="updatanodeinner" />
              <Button onClick={updataNode}>修改属性</Button>
              <Button danger onClick={deleteAttribute}>删除属性</Button>
            </div>
          </>
      }

      return (
        <>{back}</>
        
      );
    }

    //属性修改页面
    function UpdataAttribute(initnode) {
      //属性修改操作页面
      const Attribute = () => {
        const [isModalVisible, setIsModalVisible] = useState(true);

        var lists = keys(initnode.store.data.ohter);
        var listItems = lists.map((list) =>
          <UpdataNode name={list} initnode={initnode} onClick={handleOk} inner={initnode.store.data.ohter[list]} id="UpdataNode" />
        );
        if (lists.length == 0) {
          listItems = <p>该节点不存在附属属性</p>
        }

        const handleOk = () => {
          setIsModalVisible(false);
        };
        const handleCancel = () => {
          setIsModalVisible(false);
        };
        const addAttribute = () => {
          AddAttribute(initnode);
        }

        const deleteNode = () => {
          initnode.addTools(
            [
              {
                name: 'button-remove',
              },
            ],
          )
          setIsModalVisible(false);
        }
        return (
          <>
            <Modal title="修改节点属性" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={700}>
              <UpdataNodemain name="编号" initnode={initnode} inner={initnode.store.data.id}></UpdataNodemain>
              <hr></hr>
              {listItems}
              <Button id="addAttribute" size="large" onClick={addAttribute}>新增节点属性</Button >
              <Button id="deleteAttribute" size="large" onClick={deleteNode}>删除节点</Button >
            </Modal>
          </>
        );
      };

      ReactDOM.render(
        <>
          <Attribute />
        </>,
        document.getElementsByClassName("add-attribute")[0]
      );
    }


    //操作属性主方法
    function contextmenu(node) {

      initnode = node;

      const Attribute = () => {
        const [isModalVisible, setIsModalVisible] = useState(true);

        const addAttribute = () => {
          AddAttribute(initnode);
        }

        const updateAttribute = () => {
          UpdataAttribute(initnode);
        }

        const deleteAttribute = () => {
          DeleteAttribute(initnode);
        }

        const deleteNode = () => {
          initnode.addTools(
            [
              {
                name: 'button-remove',
              },
            ],
          )
          setIsModalVisible(false);
        }

        const handleCancel = () => {
          setIsModalVisible(false);
        };
        return (
          <>
            <Modal title="Attribute" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}>
              <Button id="addAttribute" size="large" onClick={addAttribute}>新增节点</Button >
              <br />
              <Button id="updateAttribute" size="large" onClick={updateAttribute}>修改节点</Button >
              <br />
              <Button id="deleteAttribute" size="large" onClick={deleteAttribute}>删除节点属性</Button >
              <br />
              <Button id="deleteAttribute" size="large" onClick={deleteNode}>删除节点</Button >
            </Modal>
          </>
        );
      }
      ReactDOM.render(
        <>
          <Attribute />
        </>,
        document.getElementsByClassName("add-attribute")[0]
      );
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
      style: "add",
      ohter: {},
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
    var display = document.getElementById("graphname").style.display;
    if (display == 'none') {//图谱更新
      name = $('#lang').val();

      var data = graph.current.toJSON().cells;
      var deleteNode = graph.current.options.deleteNode;
      for (var i = 0; i < data.length; i++) {
        //边
        var style = "";
        try {
          style = data[i].style;
        } catch { }


        //即为新增或修改基类
        if (style != "" && style != undefined) {
          //边
          if (data[i].shape == 'edge') {
            console.log(style);
            var edge = {
              "source": data[i].source.cell,
              "target": data[i].target.cell,
              "style": style,
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
              "style": style,
            }
            //非纯粹节点，具有附加属性
            var list = keys(data[i].ohter);
            if (keys(data[i].ohter).length > 0) {
              for (var ohter in list) {
                node[list[ohter]] = data[i].ohter[list[ohter]];
              }
            }
            nodes.push(node);
          }
        }


      }
      var datas = {
        "label": [
          { "labelName": name }
        ],
        "nodes": nodes,
        "links": edges,
        "deleteNode": deleteNode,
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


    } else {//图谱创建
      if (name == '') {
        alert("请输入图谱的名称！")
      }
      //创建新图谱
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
          var list = keys(data[i].ohter);
          if (keys(data[i].ohter).length > 0) {
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
        data: { "action": "creatLabel", "label": JSON.stringify(datas) },
        dataType: "json",//数据类型可以为 text xml json  script  jsonp
        // contentType: "application/json; charset=utf-8",
        async: false,
        success: function (result) {
          // console.log(result);
        }
      })
      graph.current.fromJSON([]);
    }
  }

  return <div id="container" ref={drop}></div>

}