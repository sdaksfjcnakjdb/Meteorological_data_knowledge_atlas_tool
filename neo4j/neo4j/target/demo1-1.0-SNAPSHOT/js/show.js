const container = document.getElementById('G6');
const width = 1920;
const height = 969;

var node = [];
var edge = [];
var nodeList=new Array();
var colorGroup = new Array();
var color = ["#DD7710", "#E05250", "#F4C51F", "#E64A79", "#7861A9", "#55B87F", "#3586C8", "#CB98A1","#fff143","#ff461f","#bce672","#003472"];
// const graph = new G6.Graph({
//     container: 'G6',
//     width,
//     height,
//     linkCenter: true,
//     modes: {
//         default: ['create-edge'],
//     },
//     defaultEdge: {
//         type: 'quadratic', // 指定边的形状为二阶贝塞尔曲线
//         style: {
//             stroke: '#e2e2e2',
//         },
//     },
//     layout: {
//         type: 'force',
//         preventOverlap: true,
//         linkDistance: (d) => {
//             if (d.source.id === nodeList[0] + '') {
//                 return 200;
//             }
//             return 200;
//         },
//         nodeStrength: (d) => {
//             if (d.isLeaf) {
//                 return 50;
//             }
//             return 50;
//         },
//         edgeStrength: (d) => {
//             if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
//                 return 0.7;
//             }
//             return 0.7;
//         },
//     },
//     defaultNode: {
//         // color: '#5B8FF9',
//     },
//     preventOverlap:true,
//     modes: {
//         default: ['drag-canvas'],
//     },
// });//定义画布
// var url = "js/json.json";
// 读取json数据

function longtext(text){
    if(text.size<5){
        return text;
    }else {
        var newtext = text.split('');
        var bk = '';
        console.log("newtext");
        for (let i = 1;i<newtext.length+1;i++){
            bk = bk+newtext[i-1];
            if(i%4 == 0 && i>1 && i<newtext.length){
                bk = bk + '\n';
            }
        }
        console.log(newtext + "_____"+bk);
        return bk;
    }
}

function ohters(ohter){
    delete ohter.name;
    delete ohter.comment;
    ohter.delete = [];
    return ohter;
}
function find() {
    //console.log("qweqeqweq");
    node = [];
    edge = [];
    nodeList= [];//全id集合
    colorGroup = [];
    outnode = [];// 外围节点
    oldnode = [0];//已经被赋值的节点
    innode = [];
    var name = $("input[name='name']")[0].value;
    var depth = $("input[name='depth']")[0].value;
    var label = $('#lang').val();
    console.log(label);
    $.ajax({
        type: "Post",//请求方式
        url: "action",//地址，就是json文件的请求路径
        data:{"action":"queryByNameAndDepth","name":name,"depth":depth,"label":label},
        dataType: "json",//数据类型可以为 text xml json  script  jsonp
        async: false,
        success: function (result) {//返回的参数就是 action里面所有的有get和set方法的参数
            for (var i = 0; i < result.nodes.length; i++) {
                var ohter = result.nodes[i].properties;

                node.push({
                    label: longtext(result.nodes[i].properties.comment),
                    id: result.nodes[i].caption + '',
                    size: 70,
                    attrs:{
                        label:{
                            fill:"white",
                        },
                    },
                    ohter:ohters(ohter),
                    style: {
                        fill: "#0cc",
                        stroke: '#0cc',
                    }
                })
                nodeList.push(result.nodes[i].caption);
            }
            //console.log("nodeList");
            //console.log(nodeList);

            /*加载边数据*/
            // for (var i = 0; i < result.links.length; i++) {
            //     //console.log(result.links[i]);
            //     edge.push({
            //         source:result.links[i].source+'',
            //         target:result.links[i].target+'',
            //         label:result.links[i].type,
            //     })
            //     var num = nodeList.indexOf(result.links[i].source);//起始位置在nodelist坐标
            //     var tar = nodeList.indexOf(result.links[i].target);//终点位置在nodelist坐标
            //
            //     node[num].size += 10;
            //     if (num == 0) {//中心位置
            //         var T = true;//
            //         for (var n = 0; n < colorGroup.length; n++) {
            //             if (colorGroup[n].indexOf(tar) != -1) {//存在两个关系
            //                 T = false;
            //             }
            //         }
            //         if (T) {//第一个关系
            //             colorGroup.push([tar]);
            //             node[tar].style.fill = color[tar-1];
            //             node[tar].style.stroke = "#000000";
            //         }
            //     } else {//子关系
            //         for (var n = 0; n < colorGroup.length; n++) {
            //             if (colorGroup[n].indexOf(num) != -1) {//子关系位于主关系n上
            //                 colorGroup[n].push(tar);
            //                 node[tar].style.fill = color[n - 1];
            //                 node[tar].style.stroke = "#000000";
            //             }
            //         }
            //     }
            //     if (result.links[i].source == colorGroup[0][0]) {//第二节点
            //         colorGroup.push([num]);
            //     }
            // }

            for (var i = 0; i < result.links.length; i++) {//加载第一层关系
                var num = nodeList.indexOf(result.links[i].source);//起始位置在nodelist坐标
                var tar = nodeList.indexOf(result.links[i].target);//终点位置在nodelist坐标
                var colorLine = '';

                node[num].size += 5;
                if(num == 0){//第一层关系
                    var T = true;//
                    var j = 0;
                    //console.log("tar:"+tar +"  "+ color[tar-1]);
                    for (var n = 0; n < colorGroup.length; n++) {
                        if (colorGroup[n].indexOf(tar) != -1) {//存在两个关系
                            T = false;
                            j = n;
                        }
                    }
                    if (T) {//第一个关系
                        colorGroup.push([tar]);
                        outnode.push(tar);
                        oldnode.push(tar);
                        //console.log(":"+ colorGroup);
                        node[tar].style.fill = color[colorGroup.length-1];
                        node[tar].style.stroke = color[colorGroup.length-1];
                        colorLine = color[colorGroup.length-1];

                        edge.push({
                            source: result.links[i].source + '',
                            target: result.links[i].target + '',
                            label: result.links[i].type,
                            attrs:{
                                line:{
                                    fill:colorLine,
                                    stroke:colorLine,
                                },
                                text:{
                                    fill:colorLine,
                                }
                            }
                        })
                    }
                    else{
                        colorLine = color[j];
                    }

                }
            }

            for (var j = 0;j<depth-1;j++) {
                innode = [];//当前节点
                for (var i = 0; i < result.links.length; i++) {
                    var num = nodeList.indexOf(result.links[i].source);//起始位置在nodelist坐标
                    var tar = nodeList.indexOf(result.links[i].target);//终点位置在nodelist坐标
                    var colorLine = '';
                    if ((outnode.indexOf(num) != -1)) {//第二层关系且是第一次关系
                        for (let g = 0;g<colorGroup.length;g++){//遍历颜色二维数组
                            if(colorGroup[g].indexOf(num) != -1) {//当前节点位于g组上
                                colorLine = color[g];
                                if((oldnode.indexOf(tar) == -1)) {
                                    colorGroup[g].push(tar);
                                    innode.push(tar);
                                    oldnode.push(tar);
                                    //console.log(":" + colorGroup);
                                    node[tar].style.fill = color[g];
                                    node[tar].style.stroke = color[g];
                                    g = colorGroup.length;
                                }
                            }
                        }
                        edge.push({
                            source: result.links[i].source + '',
                            target: result.links[i].target + '',
                            label: result.links[i].type,
                            attrs:{
                                line:{
                                    stroke:colorLine,
                                    fill:colorLine,
                                },
                                text:{
                                    fill:colorLine,
                                }
                            }
                        })
                    }
                }
                outnode = innode;
            }

            G6.Util.processParallelEdges(edge);
            ReactDOM.render(
                React.createElement(
                    base.Tool,
                    {
                        data:{
                            node:node,
                            edge:edge
                        }
                    }
                    ),
                document.getElementById("editor"))//获得数据
            // gra();
        }
    });
}

// function gra() {//渲染画布
//     const data = {
//         nodes: node,
//         edges: edge,
//     }
//
//     const nodes = data.nodes;
//     graph.data({
//         nodes,
//         edges: data.edges.map(function (edge, i) {
//             edge.id = 'edge' + i;
//             return Object.assign({}, edge);
//         }),
//     });
//     graph.render();
//     graph.refresh();
//
//     graph.on('node:dragstart', function (e) {
//         graph.layout();
//         refreshDragedNodePosition(e);
//     });
//     graph.on('node:drag', function (e) {
//         refreshDragedNodePosition(e);
//     });
//     graph.on('node:dragend', function (e) {
//         e.item.get('model').fx = null;
//         e.item.get('model').fy = null;
//     });
//
//     if (typeof window !== 'undefined')
//         window.onresize = () => {
//             if (!graph || graph.get('destroyed')) return;
//             if (!container || !container.scrollWidth || !container.scrollHeight) return;
//             graph.changeSize(container.scrollWidth, container.scrollHeight);
//         };
//     graph.refresh();
//
// }

function refreshDragedNodePosition(e) {
    const model = e.item.get('model');
    model.fx = e.x;
    model.fy = e.y;
}