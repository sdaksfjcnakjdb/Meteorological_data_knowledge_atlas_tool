const container = document.getElementById('container');
const width = 1920
const height = 969;




//读取json数据
$.ajax({
    type: "get",//请求方式
    url: "js/nodedata.json",//地址，就是json文件的请求路径
    dataType: "json",//数据类型可以为 text xml json  script  jsonp
    async:false, 
　　　　 success: function(result){//返回的参数就是 action里面所有的有get和set方法的参数
        console.log(result);
    }
});


const graph = new G6.Graph({
    container: 'container',
    width,
    height,
    linkCenter: true,
    modes: {
        default: ['create-edge'],
    },
    defaultEdge: {
        type: 'quadratic',
        style: {
        stroke: '#F6BD16',
        lineWidth: 1,
        },
    },
layout: {
    type: 'force',
    preventOverlap: true,
    linkDistance: (d) => {
    if (d.source.id === '61') {
        return 180;
    }
        return 80;
    },
    nodeStrength: (d) => {
    if (d.isLeaf) {
        return -50;
    }
    return -10;
    },
    edgeStrength: (d) => {
    if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
        return 0.7;
    }
    return 0.7;
    },
},
defaultNode: {
    color: '#5B8FF9',
},
modes: {
    default: ['drag-canvas'],
},
});

const data = {
    nodes: [
        {label:"C_COREMETA_ID",id:'61',size:75},
        {label:"C_MDFILEID",id:'42',size:50},
        {label:"C_MDLANG",id:'43',size:50},
        {label:"C_MDCHAR",id:'44',size:50},
        {label:"C_MDDATEST",id:'81',size:50},
        {label:"C_MDSTANNAME",id:'101',size:50},
        {label:"C_MDSTANVER",id:'102',size:50},
        {label:"C_RPINDNAME",id:'82',size:50},
        {label:"C_RPORGNAME",id:'45',size:50},
        {label:"C_FAXPHONE",id:'83',size:25,isleaf:true},
        {label:"C_DSID",id:'85',size:25,isleaf:true},
        {label:"C_ADMINAREA",id:'84',size:25,isleaf:true},
        {label:"C_POSTCODE",id:'51',size:25},
        {label:"C_DATA_STORAGE_MODE",id:'92',size:25,isleaf:true},
        {label:"C_ISSUE_NUMBER",id:'93',size:25,isleaf:true},
        {label:"C_COVER_PHOTO",id:'94',size:25,isleaf:true},
        {label:"C_COUNTRY",id:'52',size:25,isleaf:true},
        {label:"C_EMAILADD",id:'53',size:25},
        {label:"C_DELPOINT",id:'49',size:25,isleaf:true},
        {label:"C_CNTONLINERES",id:'54',size:25},
        {label:"C_BACK_COVER_PHOTO",id:'115',size:25,isleaf:true},
        {label:"C_TITLE",id:'103',size:25,isleaf:true},
        {label:"C_IDABS",id:'104',size:25,isleaf:true},
        {label:"C_TPCAT",id:'105',size:25,isleaf:true},
        {label:"C_DATALANG",id:'106',size:25,isleaf:true},
        {label:"C_DATACHAR",id:'86',size:25},
        {label:"C_INDUSTRY",id:'112',size:25,isleaf:true},
        {label:"C_DATA_INCREMENT",id:'113',size:25,isleaf:true},
        {label:"C_DATA_TIME",id:'114',size:25,isleaf:true},
        {label:"C_LINEAGE",id:'55',size:25},
        {label:"C_CITY",id:'50',size:25,isleaf:true},
        {label:"C_MAINFREQ",id:'107',size:25,isleaf:true},
        {label:"C_DATASCAL",id:'108',size:25,isleaf:true},
        {label:"C_STATEMENT",id:'109',size:25},
        {label:"C_CREATE_DATE",id:'91',size:25,isleaf:true},
        {label:"C_UPDATED_DATE",id:'110',size:25,isleaf:true},
        {label:"C_ATTRIBUTE",id:'111',size:25,isleaf:true},
        {label:"C_SOURCE",id:'56',size:25},
        {label:"C_PUBDATE",id:'89',size:25,isleaf:true},
        {label:"C_OPT_TYPE",id:'90',size:25,isleaf:true},
        {label:"C_REFSYSTEM",id:'87',size:25,isleaf:true},
        {label:"C_STATUS",id:'57',size:25},
        {label:"DATA_LEVEL",id:'88',size:25,isleaf:true},
        {label:"C_RPPOSNAME",id:'46',size:25,isleaf:true},
        {label:"C_ROLE",id:'47',size:25,isleaf:true},
        {label:"C_CNTPHONE",id:'48',size:25,isleaf:true},
    ],
    edges: [
        {source:'61',label:"in",target:'42'},
        {source:'61',label:"in",target:'42'},
        {source:'61',label:"in",target:'43'},
        {source:'61',label:"in",target:'43'},
        {source:'61',label:"in",target:'44'},
        {source:'61',label:"in",target:'81'},
        {source:'61',label:"in",target:'101'},
        {source:'61',label:"in",target:'102'},
        {source:'61',label:"in",target:'82'},
        {source:'61',label:"in",target:'45'},
        {source:'43',label:"in",target:'83'},
        {source:'83',label:"in",target:'85'},
        {source:'44',label:"in",target:'84'},
        {source:'44',label:"in",target:'51'},
        {source:'51',label:"in",target:'92'},
        {source:'51',label:"in",target:'93'},
        {source:'51',label:"in",target:'94'},
        {source:'44',label:"in",target:'52'},
        {source:'81',label:"in",target:'53'},
        {source:'53',label:"in",target:'49'},
        {source:'81',label:"in",target:'54'},
        {source:'54',label:"in",target:'115'},
        {source:'81',label:"in",target:'103'},
        {source:'101',label:"in",target:'85'},
        {source:'101',label:"in",target:'104'},
        {source:'101',label:"in",target:'105'},
        {source:'102',label:"in",target:'106'},
        {source:'102',label:"in",target:'86'},
        {source:'86',label:"in",target:'112'},
        {source:'86',label:"in",target:'113'},
        {source:'86',label:"in",target:'114'},
        {source:'55',label:"in",target:'86'},
        {source:'86',label:"in",target:'50'},
        {source:'102',label:"in",target:'107'},
        {source:'82',label:"in",target:'108'},
        {source:'82',label:"in",target:'109'},
        {source:'109',label:"in",target:'91'},
        {source:'109',label:"in",target:'110'},
        {source:'109',label:"in",target:'111'},
        {source:'82',label:"in",target:'55'},
        {source:'45',label:"in",target:'56'},
        {source:'56',label:"in",target:'89'},
        {source:'56',label:"in",target:'90'},
        {source:'45',label:"in",target:'87'},
        {source:'45',label:"in",target:'57'},
        {source:'57',label:"in",target:'88'},
        {source:'42',label:"in",target:'46'},
        {source:'42',label:"in",target:'47'},
        {source:'42',label:"in",target:'48'},
        {source:'49',label:"in",target:'49'},
    ],
};


const nodes = data.nodes;
graph.data({
nodes,
edges: data.edges.map(function (edge, i) {
    edge.id = 'edge' + i;
    return Object.assign({}, edge);
}),
});
graph.render();

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