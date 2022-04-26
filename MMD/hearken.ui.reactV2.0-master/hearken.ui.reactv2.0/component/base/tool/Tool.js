// import ABaseComponent from '../../ABaseComponent';
import React, { useState } from 'react'
import { Drawer as AntdDrawer, Modal, Button as AntdButton, Input, List as AntdList, Typography, Pagination, Upload, Divider, Button } from 'antd';
// import { PlusSquareTwoTone, CloseSquareTwoTone } from '@ant-design/icons'
import KGEditor from './KGEditor.js'
import DragList from './DragList'
import { Select, PlusOutlined, Space } from 'antd';
import { LineOutlined, LeftOutlined, PlusCircleOutlined, CopyOutlined, FolderOpenOutlined, SaveOutlined, ToolOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import "./Tool.css"
import G6 from '@antv/g6';




// import { rectangleToPathData } from '@antv/x6/lib/util/dom/path';


const { Search } = Input;
var node = [
];
var edge = [
];


//处理
// $.ajax({
//     type: "get",//请求方式
//     url: "js/json.json",//地址，就是json文件的请求路径
//     dataType: "json",//数据类型可以为 text xml json  script  jsonp
//     async:false, 
// 　　　　 success: function(result){//返回的参数就是 action里面所有的有get和set方法的参数
//         console.log("result.nodes[0].properties.comment");
//         console.log(result.nodes[0].properties.comment);
//         for(var i = 0;i<result.nodes.length;i++){
//             node.push({
//                 label:result.nodes[i].properties.comment,
//                 id:result.nodes[i].id+'',
//                 width: 60,
//                 height: 60,
//                 shape: 'circle',
//                 attrs: {
//                     body:{
//                         fill :"#0cc",
//                         stroke: '#0cc',
//                     },
//                 },
//                 x:i*50,
//                 y:i*50,
//             })
//         }
//         for(var i = 0;i<result.links.length;i++){
//             edge.push({
//                 source:result.links[i].source+'',
//                 target:result.links[i].target+'',
//                 label:result.links[i].type,
//             })  
//         }


//     }
// });


const width = 1920;
const height = 969;
// var node = [];
// var edge = [];
var nodeList = new Array();
var colorGroup = new Array();
var datanode = [];
var color = ["#CCFF99", "#99CCFF", "#99CCCC", "#FFFFCC", "#CCFFCC", "#66CCCC", "#CCCCFF", "#CCFFFF", "#66CCFF"];//柔和、洁净、爽朗
var url = "js/json.json";


const dataList = [
];
const dataListdelect = [];

const Database = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        var databaseurl, databasename, databasepassword;
        databaseurl = document.getElementById("databaseurl").value;
        databasename = document.getElementById("databasename").value;
        databasepassword = document.getElementById("databasepassword").value;

        $.ajax({
            type: "Post",//请求方式
            url: "database",//地址，就是json文件的请求路径
            data: { "url": databaseurl, "name": databasename, "password": databasepassword },
            dataType: "text",//数据类型可以为 text xml json  script  jsonp
            // contentType: "application/json; charset=utf-8",
            async: false,
            success: function (result) {
                alert("数据库修改成功!");
            }
        })
        setIsModalVisible(false);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <AntdButton type="primary" onClick={showModal} id='primary'>
                数据库连接
            </AntdButton>
            <Modal title="数据库连接" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>数据库链接：</p>
                <Input placeholder="输入数据库URL" id="databaseurl" />
                <p>数据库账号：</p>
                <Input placeholder="输入数据库账号" id="databasename" />
                <p>数据库密码：</p>
                <Input placeholder="输入数据库密码" id="databasepassword" />
            </Modal>
        </>
    );
};

const Find = () => {
    const find = () => {
        document.getElementsByClassName('graphname')[0].style.setProperty('display', 'none');//隐藏提交
        document.getElementsByClassName('top')[0].style.setProperty('display', 'block');//显示查询
        document.getElementById('addNode').style.setProperty('display', 'none');// 隐藏新增节点
        document.getElementById('graphFind').style.setProperty('background-color', 'aqua');
        document.getElementById('graphCreat').style.setProperty('background-color', '#ffff');
        document.getElementById('graphChange').style.setProperty('background-color', '#ffff');
    }
    return (
        <>
            <AntdButton type='primary' onClick={find} id="graphFind">
                图谱查询
            </AntdButton>
        </>
    )
}

const Creat = (props) => {
    const { click } = props
    const [isModalVisible, setIsModalVisible] = useState(false);
    var results = '';
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        try {
            click(results)
        } catch (err) {

        }
        document.getElementsByClassName('top')[0].style.setProperty('display', 'none');//隐藏查询

        //暂时注释掉，切换到neo4j时取消注释！
        // $("input[name='name']")[0].value = "";
        // $("input[name='depth']")[0].value = "";
        document.getElementsByClassName('graphname')[0].style.setProperty('display', 'block')//显示提交
        document.getElementById('addNode').style.setProperty('display', 'inline-block')// 显示新增节点
        document.getElementById('graphname').style.setProperty('display', 'block')//显示输入框
        document.getElementById('graphCreat').style.setProperty('background-color', 'aqua');
        document.getElementById('graphFind').style.setProperty('background-color', '#ffff');
        document.getElementById('graphChange').style.setProperty('background-color', '#ffff');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const getTextInfo = (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (result) => {
            // console.log("result");
            // console.log(result);
            results = result;
        }
        return false;
    }
    return (
        <>
            <AntdButton type="primary" onClick={showModal} id='graphCreat'>
                图谱创建
            </AntdButton>
            <Modal title="选择文件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Upload action="" accept="text/plain" beforeUpload={getTextInfo} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>导入文件</Button>
                    <p class='top' />
                </Upload>
            </Modal>
        </>
    );
};

const Change = (props) => {
    const { click } = props
    const [isModalVisible, setIsModalVisible] = useState(false);
    var results = '';
    const showModal = () => {
        if (document.getElementsByClassName('x6-graph-svg-stage')[0].children.length == 0 &&
            document.getElementsByClassName('x6-graph-svg-stage')[document.getElementsByClassName('x6-graph-svg-stage').length - 1].children.length == 0) {//画布中无数据
            alert('请先查询，再进行图谱更新');
        } else {
            setIsModalVisible(true);
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
        click(results)
        document.getElementsByClassName('top')[0].style.setProperty('display', 'none');//隐藏查询
        //暂时注释掉，切换到neo4j时取消注释！
        // $("input[name='name']")[0].value = "";
        // $("input[name='depth']")[0].value = "";
        document.getElementsByClassName('graphname')[0].style.setProperty('display', 'block')//显示提交
        document.getElementById('graphname').style.setProperty('display', 'none')//隐藏输入框
        document.getElementById('addNode').style.setProperty('display', 'inline-block')// 显示新增节点
        document.getElementById('graphChange').style.setProperty('background-color', 'aqua');
        document.getElementById('graphCreat').style.setProperty('background-color', '#ffff');
        document.getElementById('graphFind').style.setProperty('background-color', '#ffff');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getTextInfo = (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (result) => {
            // console.log("result");
            // console.log(result);
            results = result;
        }
        return false;
    }
    return (
        <>
            <AntdButton type="primary" onClick={showModal} id='graphChange'>
                图谱更新
            </AntdButton>
            <Modal title="选择文件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Upload action="" accept="text/plain" beforeUpload={getTextInfo} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>导入文件</Button>
                </Upload>
            </Modal>
        </>
    );
};

const Association = (props) => {
    const { click } = props
    const [isModalVisible, setIsModalVisible] = useState(false);
    var results = '';
    const showModal = () => {
        if (document.getElementsByClassName('x6-graph-svg-stage')[0].children.length == 0 &&
            document.getElementsByClassName('x6-graph-svg-stage')[document.getElementsByClassName('x6-graph-svg-stage').length - 1].children.length == 0) {//画布中无数据
            alert('请先查询，再进行自动关联');
        } else {
            setIsModalVisible(true);
        }
    };

    const handleOk = () => {
        setIsModalVisible(false);
        click(results)
        document.getElementsByClassName('top')[0].style.setProperty('display', 'none');//隐藏查询

        document.getElementsByClassName('graphname')[0].style.setProperty('display', 'block')//显示提交
        document.getElementById('graphname').style.setProperty('display', 'none')//隐藏输入框
        document.getElementById('addNode').style.setProperty('display', 'inline-block')// 显示新增节点
        document.getElementById('graphChange').style.setProperty('background-color', 'aqua');
        document.getElementById('graphCreat').style.setProperty('background-color', '#ffff');
        document.getElementById('graphFind').style.setProperty('background-color', '#ffff');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const getTextInfo = (file) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (result) => {
            // console.log("result");
            // console.log(result);
            results = result;
        }
        return false;
    }
    return (
        <>
            <AntdButton type="primary" onClick={showModal} id='graphChange'>
                自动关联
            </AntdButton>
            <Modal title="选择文件" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Upload action="" accept="text/plain" beforeUpload={getTextInfo} showUploadList={false}>
                    <Button icon={<UploadOutlined />}>导入文件</Button>
                </Upload>
            </Modal>
        </>
    );
};

const AddNode = (props) => {
    const { click } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    // const [ collected, drag, dragPreview ] = useDrag(() => ({
    //     item: { id, type }
    // }));
    const showModal = () => {
        setIsModalVisible(true);
    }
    const handleOk = () => {
        var name = document.getElementById("name").value;
        var id = document.getElementById("id").value;
        var between = "&";
        var ohter = {}



        if (name == "" || id == "") {
            alert("请输入节点信息！");
        } else {
            setIsModalVisible(false);
            click(ohter, name, id);
        }
    }
    const handleCancel = () => {
        setIsModalVisible(false);
    }
    return (
        <>
            <AntdButton /*ref={drag} */ type='primary' onClick={showModal} id='addNode'>
                新增节点
            </AntdButton>
            <Modal title="填写节点信息" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>节点名称：</p>
                <Input placeholder="名称" id="name" />
                <p>节点编号：</p>
                <Input placeholder="编号" id="id" />
            </Modal>
        </>
    );
};

const Spaces = (props) => {
    const { space } = props;
    const { Option } = Select;
    const spaces = () => {
        //暂时注释掉，切换到neo4j时取消注释！
        // $("input[name='name']")[0].value = "";
        // $("input[name='depth']")[0].value = "";
        space();
    }
    var out =
        <>

            <select id="lang" onChange={spaces} >
                <option value="Md" >站点元数据</option>
                <option value="Mdd">站点数据</option>
                <option value="党政空间安全数据">党政空间安全数据</option>
            </select>
        </>
    return (
        out
    )
}



const App = () => {
    const [items, setItems] = useState(['Md', 'Mdd', '党政空间安全数据']);
    const [name, setName] = useState('');

    const onNameChange = event => {
        setName(event.target.value);
    };

    const addItem = e => {
        e.preventDefault();
        setItems([...items, name || `New item ${index++}`]);
        setName('');
    };

    return (
        <Select id="lang"
            placeholder="选择标签"
            dropdownRender={menu => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0', fontSize: '20px' }} />
                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                        <Input placeholder="Please enter item" id='spaceadd' value={name} onChange={onNameChange} />
                        <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                            Add item
                        </Typography.Link>
                    </Space>

                    {/* <Divider style={{ margin: '8px 0' }} />
                    <Space align="center" style={{ padding: '0 8px 4px' }}>
                        <Input placeholder="Please enter item" value={name} onChange={onNameChange} />
                        <Typography.Link onClick={addItem} style={{ whiteSpace: 'nowrap' }}>
                            <PlusOutlined /> Add item
                        </Typography.Link>
                    </Space> */}
                </>
            )}
        >
            {items.map(item => (
                <Option key={item}>{item}</Option>
            ))}
        </Select>
    );
}

const Loading = () => {
    return (
        <>
            <div id='loading'>
                <LoadingOutlined style={{ fontSize: '80px', color: '#08c' }} />
                <h1>loading...</h1>
            </div>
        </>
    )
}


export default class Tool extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            ...props,
            visible: false,
            dataListState: false,
            dataSource: dataList,
            dataDelete: dataListdelect,

            data: {
                nodes: [],
                edges: []
            }
        }
        this.ref = React.createRef()
        this.closeDrawer = this.closeDrawer.bind(this)
        this.openDrawer = this.openDrawer.bind(this)
        this.closeDataList = this.closeDataList.bind(this)
        this.openDataList = this.openDataList.bind(this)
        this.changeDataList = this.changeDataList.bind(this)
        this.switchSpace = this.switchSpace.bind(this)
        this.read = this.read.bind(this)
        this.graph = this.graph.bind(this)
    }
    componentDidMount() {
        // super.componentDidMount();
        // console.log("this.componentDidMount");
        // this.read();
    }

    componentWillReceiveProps(nextProps) {
        // console.log("nextProps")
        // console.log(nextProps)
        if (nextProps && nextProps.data !== this.state.data) {
            this.setState(nextProps.data, () => {
                this.graph(nextProps.data.node, nextProps.data.edge)
            })
        }
    }

    read() {
        let node = []
        let edge = []
        let nodeList = []
        let colorGroup = []
        let _this = this
        this.state.value
        $.ajax({
            type: "get",//请求方式
            url: url,//地址，就是json文件的请求路径
            dataType: "json",//数据类型可以为 text xml json  script  jsonp
            async: false,
            success: function (result) {//返回的参数就是 action里面所有的有get和set方法的参数
                // console.log("result");
                // console.log(result);
                colorGroup.push([0]);
                for (var i = 0; i < result.nodes.length; i++) {
                    node.push({
                        label: result.nodes[i].properties.comment,
                        id: result.nodes[i].caption + '',
                        size: 40,
                        style: {
                            fill: "#ffffff",
                            stroke: '#0cc',
                            // lineWidth: 5,
                            // radius: 10,   
                        }
                    })
                    nodeList.push(result.nodes[i].caption);
                }

                for (var i = 0; i < result.links.length; i++) {

                    edge.push({
                        source: result.links[i].source + '',
                        target: result.links[i].target + '',
                        label: result.links[i].type,
                    })

                    var num = nodeList.indexOf(result.links[i].source);//起始位置在nodelist坐标
                    var tar = nodeList.indexOf(result.links[i].target);//重点位置在nodelist坐标
                    node[num].size += 5;
                    /*
                    if (num == 0) {
                        var T = true;
                        for (var n = 0; n < colorGroup.length; n++) {
                            if (colorGroup[n].indexOf(tar) != -1) {
                                T = false;
                            }
                        }
                        if (T) {
                            colorGroup.push([tar]);
                            node[tar].style.fill = color[tar - 1];
                            node[tar].style.stroke = color[tar - 1];
                        }
                    } else {
                        for (var n = 0; n < colorGroup.length; n++) {
                            if (colorGroup[n].indexOf(num) != -1) {
                                colorGroup[n].push(tar);
                                node[tar].style.fill = color[n - 1];
                                node[tar].style.stroke = color[n - 1];
                            }
                        }
                    }


                    if (result.links[i].source == colorGroup[0][0]) {//第二节点
                        colorGroup.push([num]);
                    }*/
                }
                _this.graph(node, edge);
                // console.log("colorGroup");
                // console.log(colorGroup);
                // console.log("edge");
                // console.log(edge);
                // console.log(nodeList.indexOf(result.links[0].source));
            }
        });

    }

    graph(node, edge) {
        document.getElementById("loading").style.setProperty("display", "block")


        var _this = this
        _this.ref.current.cleangraph();
        // console.log(node, edge);
        G6.Util.processParallelEdges(edge);
        const graph = new G6.Graph({
            container: 'G6',
            width,
            height,
            modes: {
                default: ['zoom-canvas', 'drag-canvas', 'drag-node'],
            },
            layout: {
                type: 'force',
                preventOverlap: true,
                kr: 10,
                center: [width / 2, height / 2],
                linkDistance: 10,
                nodeStrength: (d) => {
                    return 50;
                },
                edgeStrength: (d) => {
                    return 0.7;
                },
                nodeSpacing: 50,
                coulombDisScale: 50,
            },
            defaultNode: {
                size: 20,
            },
        });

        const data = {
            nodes: node,
            edges: edge,
        }

        const nodes = data.nodes;
        graph.data({
            nodes,
            edges: data.edges.map(function (edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
            }),
        });
        graph.render();
        graph.refresh();
        var datas = graph.save();
        // console.log("datas")
        // console.log(datas)


        graph.on("afterrender", (e) => {
            // console.log(datas.nodes[0]);
            // console.log(datas.nodes[0].x);
            datanode = [];
            for (var i = 0; i < datas.nodes.length; i++) {
                datanode.push({
                    label: datas.nodes[i].label,
                    id: datas.nodes[i].id,
                    width: datas.nodes[i].size,
                    height: datas.nodes[i].size,
                    shape: 'circle',
                    style: "",
                    ohter: datas.nodes[i].ohter,
                    neo4j: datas.nodes[i].neo4j,
                    attrs: {
                        body: {
                            fill: datas.nodes[i].style.fill,
                            stroke: datas.nodes[i].style.stroke,
                            magnet: true,
                        },
                        label: {
                            fill: 'white',
                        }
                    },
                    x: datas.nodes[i].x,
                    y: datas.nodes[i].y,
                })

            };


            const data = {
                nodes: datanode,
                edges: edge,
            };
            // console.log("data.edges");
            // console.log(data.edges);
            this.setState({ data: data })
            document.getElementById("loading").style.setProperty("display", "none")
        })

    }

    nodeRemove(nodesId) {
        for (let i = 0; i < dataListdelect.length; i++) {
            if (dataListdelect[i].ID == nodesId) {
                dataListdelect.splice(i, 1);
            }
        }
        this.setState({ dataDelete: dataListdelect })
    }



    consoleTojson() {
        var _this = this
        return _this.ref.current.consoleTojson();
    }



    change(result) {
        var _this = this
        if (result == '') {
            alert("请选择文件！");
        } else {
            // $.ajax({
            //     type: "get",//请求方式
            //     url: "js/csvvv.csv",//地址，就是json文件的请求路径
            //     dataType: "text",//数据类型可以为 text xml json  script  jsonp
            //     scriptCharset: 'utf-8',
            //     async: false,
            //     success: function (result) {//返回的参数就是 action里面所有的有get和set方法的参数
            var datas = result.srcElement.result.split('\r\n');
            var lines = [];
            var lineT = [];
            dataList.length = 0;
            dataListdelect.length = 0;
            var datadelet = [];//存储id
            var olddata = _this.ref.current.consoleTojson();
            // console.log(olddata);
            for (var i = 1; i < datas.length; i++) {
                var line = datas[i].split(',');
                lines.push(line[0]);
                lineT.push(line[1]);
                // console.log(line);
                if (olddata[0].indexOf(line[0]) == -1) {
                    dataList.push({
                        Type: 'add',
                        ID: line[0],
                        Group: line[0],
                        NodeName: line[1],
                    })
                }
            }
            for (var i = 0; i < olddata[0].length; i++) {
                if (lines.indexOf(olddata[0][i]) == -1) {
                    datadelet.push(olddata[0][i]);
                    dataListdelect.push({
                        Type: 'delete',
                        ID: olddata[0][i],
                        Group: olddata[0][i],
                        NodeName: olddata[1][i],
                    })
                }
            }
            // console.log(dataList);
            // console.log(_this.ref.current.consoleTojson())
            //     }
            // }) 
            _this.ref.current.addTool(datadelet);
            this.setState({ dataListState: true })
        }
    }


    creatNew(result) {
        var _this = this
        _this.ref.current.cleangraph();
        // console.log(result);
        // $.ajax({
        //     type: "get",//请求方式
        //     url: "js/csvvv.csv",//地址，就是json文件的请求路径
        //     dataType: "text",//数据类型可以为 text xml json  script  jsonp
        //     scriptCharset: 'utf-8',
        //     async: false,
        //     success: function (result) {//返回的参数就是 action里面所有的有get和set方法的参数
        var data = result.srcElement.result.split('\r\n');
        dataList.length = 0;
        dataListdelect.length = 0;
        for (var i = 1; i < data.length; i++) {
            var line = data[i].split(',');
            dataList.push({
                ID: line[0],
                Group: line[0],
                NodeName: line[1],
            })
        }
        // console.log(dataList);
        // }
        // }
        // )
        this.setState({ dataListState: true })
    }

    //自动关联
    Association(result) {
        var _this = this
        if (result == '') {
            alert("请选择文件！");
        } else {
            // $.ajax({
            //     type: "get",//请求方式
            //     url: "js/csvvv.csv",//地址，就是json文件的请求路径
            //     dataType: "text",//数据类型可以为 text xml json  script  jsonp
            //     scriptCharset: 'utf-8',
            //     async: false,
            //     success: function (result) {//返回的参数就是 action里面所有的有get和set方法的参数
            var datas = result.srcElement.result.split('\r\n');
            var lines = [];//编号
            var lineT = [];//名称
            dataList.length = 0;
            dataListdelect.length = 0;
            var datadelet = [];//存储id
            var olddata = _this.ref.current.consoleTojson();//图谱中的数据
            // console.log(olddata);
            for (var i = 1; i < datas.length; i++) {
                var line = datas[i].split(',');
                lines.push(line[0]);
                lineT.push(line[1]);
                // console.log(line);
                if (olddata[0].indexOf(line[0]) == -1) {
                    dataList.push({
                        Type: 'add',
                        ID: line[0],
                        Group: line[0],
                        NodeName: line[1],
                    })
                }
            }
            //  删除数据
            // for (var i = 0; i < olddata[0].length; i++) {
            //     if (lines.indexOf(olddata[0][i]) == -1) {
            //         datadelet.push(olddata[0][i]);
            //         dataListdelect.push({
            //             Type: 'delete',
            //             ID: olddata[0][i],
            //             Group: olddata[0][i],
            //             NodeName: olddata[1][i],
            //         })
            //     }
            // }
            // console.log(dataList);
            // console.log(_this.ref.current.consoleTojson())
            //     }
            // }) 
            this.setState({ dataListState: true })
        }
    }


    addNode(ohter, name, id) {
        var _this = this

        _this.ref.current.addNode(ohter, name, id);


    }
    openDrawer() {
        this.setState({ visible: true })
    }

    closeDrawer() {
        this.setState({ visible: false })
    }

    openDataList() {
        this.creatNew()
        this.setState({ dataListState: true })
    }
    switchSpace() {
        console.log("space");
        var _this = this;
        _this.ref.current.cleangraph();
        document.getElementsByClassName('graphname')[0].style.setProperty('display', 'none');//隐藏提交
        document.getElementsByClassName('top')[0].style.setProperty('display', 'block');//显示查询
        document.getElementById('addNode').style.setProperty('display', 'none');// 隐藏新增节点
        document.getElementById('graphFind').style.setProperty('background-color', 'aqua');
        document.getElementById('graphCreat').style.setProperty('background-color', '#ffff');
        document.getElementById('graphChange').style.setProperty('background-color', '#ffff');
    }
    changeDataList() {
        this.change()
        this.setState({ dataListState: true })
    }
    closeDataList() {
        this.setState({ dataListState: false })
    }

    addOnClick() {
        this.ref.current.changeVal(11)
    }

    saveOnClick() {
        this.ref.current.consoleSave()
    }
    searchData() {
        // console.log(dataList);
        for (var i = 0; i < dataList.length; i++) {
            if (document.getElementById("searchData").value == dataList[i].NodeName) {
                dataList = dataList[i];
            }
        }
    }
    addItemHandle = (id) => {
        console.log("addItemHandle")
        let index = this.state.dataSource.findIndex(item => item.ID === id)
        let newData = [...this.state.dataSource]
        if (index !== -1)
            newData.splice(index, 1)
        this.setState({ dataSource: newData })
    }

    deleteItemHandle = (id) => {
        console.log("deleteItemHandle")
        let index = this.state.dataDelete.findIndex(item => item.ID === id)
        let newData = [...this.state.dataDelete]
        if (index !== -1)
            newData.splice(index, 1)
        this.setState({ dataDelete: newData })
    }

    moveCenter = (x) => {
        var _this = this;
        var data = '';
        if (x.nativeEvent.path[2].childNodes[1] != undefined) {//点击文字
            if (typeof (x.nativeEvent.path[2].childNodes[1].childNodes[0].childNodes[1].data) == 'string') {
                data = x.nativeEvent.path[2].childNodes[1].childNodes[0].childNodes[1].data;
            } else {//外围空白
                data = x.nativeEvent.path[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[1].data;
            }
        } else {//内圈空白
            data = x.nativeEvent.path[2].children[0].childNodes[1].childNodes[0].childNodes[1].data;
        }
        _this.ref.current.moveCenter(data);
    }

    render() {
        return (
            <div>
                <div class="topTitle" >
                    <img src="js/log.png" class="img"></img>
                    <p class="title"><text class="text">气象数据图谱构建工具</text></p>

                    {/* <select id="lang" onSearch={this.switchSpace.bind(this)}>
                        <option value="Md" >站点元数据</option>
                        <option value="Mdd">站点数据</option>
                    </select> */}
                    <App></App>
                    {/* <Spaces space={this.switchSpace.bind(this)} /> */}
                    <Find />
                    {/* <Association click={this.Association.bind(this)} /> */}
                    <Creat click={this.creatNew.bind(this)} />
                    <Change click={this.change.bind(this)} />
                    <AddNode click={this.addNode.bind(this)} />
                    <Database />
                    <Loading />
                </div>
                <div class="graphname">
                    <Input placeholder="输入图谱名称" id="graphname" />
                    <AntdButton id="saveGraph" class="saveGraph" onClick={this.saveOnClick.bind(this)}>图谱提交</AntdButton>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <AntdDrawer mask={false} visible={this.state.visible} placement="left" closable={true} closeIcon={<LeftOutlined />} onClose={this.closeDrawer}
                        width={150} getContainer={false} title="工具栏">
                        <div className="drawerInner">
                            <AntdButton icon={<LineOutlined />}></AntdButton>
                            <p>连线</p>
                            <AntdButton onClick={this.addOnClick.bind(this)} icon={<PlusCircleOutlined />}></AntdButton>
                            <p>添加对象</p>
                        </div>
                    </AntdDrawer>
                    <AntdDrawer mask={false} visible={this.state.dataListState} placement="right" closable={true} onClose={this.closeDataList} width={375} getContainer={false} title="数据列表">
                        <div className="drawerInner">
                            <div className="searchInput">
                                <Search id="searchData" placeholder="输入搜索内容" onSearch={this.searchData} /*style={{ width: "300px" }}*/ />
                            </div>
                            <div>
                                {/* 新增列表 */}
                                <div class='addList'>
                                    <Divider orientation="center" class='addList'>新增</Divider>
                                    <AntdList
                                        bordered
                                        dataSource={this.state.dataSource}
                                        renderItem={(item, index) => (<DragList addItemHandle={this.addItemHandle.bind(this)} {...item} index={index} />)}
                                    />
                                </div>
                                {/* 删除列表 */}
                                <div class='deleteList'>
                                    <Divider orientation="center">删除</Divider>
                                    <AntdList
                                        bordered
                                        dataSource={this.state.dataDelete}
                                        renderItem={(item, index) => (<DragList deleteItemHandle={this.deleteItemHandle.bind(this)} {...item} index={index} />)}
                                        onClick={this.moveCenter.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <div className="pagination">
                            <Pagination defaultCurrent={1} total={50} />
                        </div> */}
                    </AntdDrawer>
                    <div className="map">
                        <KGEditor data={this.state.data} kgRef={this.ref} remove={this.nodeRemove.bind(this)} />
                        {/* {this.state.visible ? <CloseSquareTwoTone onClick={this.closeDrawer} style={{ position: "fixed", top: '50%', right: '265px', fontSize: '40px' }} />
                    : <PlusSquareTwoTone onClick={this.openDrawer} style={{ position: "fixed", top: '50%', right: '10px', fontSize: '40px' }} />} */}
                    </div>
                    <div id="G6"></div>

                </DndProvider>

            </div>)
    }
}