<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="/js/jquery-3.3.1.js"></script>
    <script src="/js/echarts.js"></script>
    <script src="/js/echarts-gl.js"></script>
    <script src="/js/dataTool.js"></script>
</head>
<body>
<div id="container" style="width: 100%;height: 700px;"></div>
</body>
<script>
    var myChart = echarts.init(document.getElementById('container'), 'macarons');

    $.get('/data/mongo.json', function (webkitDep) {
        option = {
            series: [{
                color: ['#EE6A50', '#4F94CD', '#B3EE3A', '#DAA520', '#f845f1', '#ad46f3', '#5045f6', '#4777f5', '#44aff0', '#45dbf7', '#f6d54a', '#ff4343', '#fa827d', '#3db18a', '#ff5897', '#372dc4', '#c42d6d', '#82c42d'],
                type: 'graphGL',
                nodes: webkitDep.nodes,
                edges: webkitDep.links,
                categories: webkitDep.categories,
                modularity: {
                    resolution: 2,
                    sort: true
                },
                lineStyle: {
                    color: '#f00',
                    opacity: 0.05
                },
                itemStyle: {
                    opacity: 1,
                    // borderColor: '#fff',
                    // borderWidth: 1
                },
                draggable: true,//指示节点是否可以拖动
                focusNodeAdjacency: true,
                // focusNodeAdjacencyOn: 'click',
                // symbolSize: function (value) {
                //     return Math.sqrt(value / 10);
                // },
                label: {
                    textStyle: {
                        color: '#fff'
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    },
                    lineStyle: {
                        opacity: 0.5,
                        width: 4
                    }
                },
                forceAtlas2: {
                    steps: 1,
                    stopThreshold: 1,
                    repulsionByDegree: true, //是否根据节点边的数量来计算节点的斥力因子，建议开启。
                    jitterTolerence: 10,
                    edgeWeight: [0.2, 1],
                    gravity: 5,
                    edgeWeightInfluence: 0,
                }
            }]
        }
        myChart.setOption(option);
    });
</script>
</html>