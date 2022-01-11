const width = 1920;
const height = 969;
var node = [];
var edge = [];
var nodeList=new Array();
var colorGroup = new Array();
var color = ["#CCFF99","#99CCFF","#99CCCC","#FFFFCC","#CCFFCC","#66CCCC","#CCCCFF","#CCFFFF","#66CCFF"];
var url = "js/json.json";
//读取json数据
function read(){
    node = [],
    edge = [],
    nodeList = [],
    colorGroup = [],
    $.ajax({
        type: "get",//请求方式
        url: url,//地址，就是json文件的请求路径
        dataType: "json",//数据类型可以为 text xml json  script  jsonp
        async:false, 
    　　　　 success: function(result){//返回的参数就是 action里面所有的有get和set方法的参数
            colorGroup.push([0]);
            for(var i = 0;i<result.nodes.length;i++){
                node.push({
                    label:result.nodes[i].properties.comment,
                    id:result.nodes[i].id+'',
                    size:20,
                    style:{
                        fill :"#ffffff",
                        stroke: '#0cc',
                    }
                })
                nodeList.push(result.nodes[i].id);
            }
            console.log(nodeList);



            for(var i = 0;i<result.links.length;i++){

                edge.push({
                    source:result.links[i].source+'',
                    target:result.links[i].target+'',
                    label:result.links[i].type,
                })  
                var num = nodeList.indexOf(result.links[i].source);//起始位置在nodelist坐标
                var tar = nodeList.indexOf(result.links[i].target);//重点位置在nodelist坐标
                node[num].size+=10;
                if(num == 0){
                    var T = true;
                    for(var n = 0;n<colorGroup.length;n++){
                        if(colorGroup[n].indexOf(tar) != -1){
                            T = false;
                        }
                    }
                    if(T){
                        colorGroup.push([tar]);
                        node[tar].style.fill = color[tar-1];
                        node[tar].style.stroke = color[tar-1];
                    }
                }else{
                    for(var n = 0;n<colorGroup.length;n++){
                        if(colorGroup[n].indexOf(num) != -1){
                            colorGroup[n].push(tar);
                            console.log(num + "        " + tar);
                            node[tar].style.fill = color[n-1];
                            node[tar].style.stroke = color[n-1];
                        }
                    }
                }


                if(result.links[i].source == colorGroup[0][0]){//第二节点
                    colorGroup.push([num]);
                }
            }
            console.log("colorGroup");
            console.log(colorGroup);
            console.log("edge");
            console.log(edge);
            // console.log(nodeList.indexOf(result.links[0].source));
        }
    });
    return graph();
}
function graph(){
    G6.Util.processParallelEdges(edge);
    const graph = new G6.Graph({
        container: 'container',
        width,
        height,
        linkCenter: true,
        collideStrength:1,
        modes: {
            default: ['create-edge'],
        },
        defaultEdge: {
            type: 'quadratic',
            style: {
            lineWidth: 1,
            },
        },
    layout: {
        type: 'force',
        preventOverlap: true,
        linkDistance: (d) => {
        if (d.source.id === nodeList[0]+'') {
            return 200;
        }
            return 80;
        },
        nodeStrength: (d) => {
            return -10;
        },
        edgeStrength: (d) => {
            return 0.7;
        },
    },
    modes: {
        default: ['drag-canvas'],
    },
    });

    const data ={
        nodes:node,
        edges:edge,
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
    /*拖动*/
    graph.on('node:dragstart', function (e) {
    graph.layout();
    refreshDragedNodePosition(e);
    });
    graph.on('node:drag', function (e) {
    refreshDragedNodePosition(e);
    });
    graph.on('node:dragend', function (e) {
    e.item.get('model').fx = null;
    e.item.get('model').fy = null;
    });

    if (typeof window !== 'undefined')
    window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
    };

    function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
    }
    /*拖动*/


    // var bk = graph.save();
    // graph.clear();
    // console.log("bk");
    // console.log(k);
    // console.log(k.x);
    graph.on("afterrender",(e)=>{
       var bk = graph.save();
        console.log("bk");
        console.log(bk.nodes[0]);
        console.log(bk.nodes[0].x);
    })
    // return bk;
}



read();