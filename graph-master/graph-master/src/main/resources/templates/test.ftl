<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>echart3 力引导布局实现节点的提示和折叠</title>
    <script src="/js/echarts.js"></script>
</head>
<body>
<div id="chart" style="width: 100%;height: 600px"></div>
<script type="text/javascript">
    var echart = echarts.init(document.getElementById('chart'));
    var options = {
        "title": {
            "text": "11",//标题
            "top": 'top',//相对在y轴上的位置
            "left": 'center'//相对在x轴上的位置
        },
        "tooltip" : {//提示框，鼠标悬浮交互时的信息提示
            "trigger": 'item',//数据触发类型
            formatter: function(params){//触发之后返回的参数，这个函数是关键
                if(params.data!=undefined){
                    return params.data.label;//返回标签
                }
            },
        },
        "series" : [
            {
                "name": '关系图',
                "type": 'graph',
                "layout": 'force',
                "draggable": false,//指示节点是否可以拖动
                "focusNodeAdjacency": true, //当鼠标移动到节点上，突出显示节点以及节点的边和邻接节点
                "roam": true,//是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
                "symbol": 'circle',
                "force" : { //力引导图基本配置
                    "repulsion" : 10,//节点之间的斥力因子。支持数组表达斥力范围，值越大斥力越大。
                    // gravity : 0.03,//节点受到的向
                    // // 中心的引力因子。该值越大节点越往中心点靠拢。
                    // edgeLength :[10,50],//边的两个节点之间的距离，这个距离也会受 repulsion。[10, 50] 。值越小则长度越长
                    "layoutAnimation" : false//因为力引导布局会在多次迭代后才会稳定，这个参数决定是否显示布局的迭代动画，在浏览器端节点数据较多（>100）的时候不建议关闭，布局过程会造成浏览器假死。
                },
                "itemStyle": {
                    "normal": {
                        "label": {
                            "show": true,
                            "textStyle": {
                                "color": '#333'
                            },
                            "position": 'inside'
                        },
                        "nodeStyle" : {
                            "brushType" : 'both',
                            "borderColor" : 'rgba(255,215,0,0.4)',
                            "borderWidth" : 1
                        }
                    }
                },
                // 关系边的公用线条样式
                "lineStyle": {
                    "normal": {
                        "show" : true,
                        "color": 'target',//决定边的颜色是与起点相同还是与终点相同
                        // curveness: 0.2//边的曲度，支持从 0 到 1 的值，值越大曲度越大。
                    }
                },
                "emphasis": {
                    "lineStyle": {
                        "width": 5
                    }
                },
                "nodes": [{"id":0,"category":0,"name":'0',"label":'大学',"symbolSize":40},
                    {"id":1,"category":1,"name":'1',"label":'校区1',"symbolSize":30},
                    {"id":2,"category":-2,"name":'2',"label":'学院1',"symbolSize":20},
                    {"id":3,"category":-2,"name":'3',"label":'学院2',"symbolSize":20},
                    {"id":4,"category":1,"name":'4',"label":'校区2',"symbolSize":30},
                    {"id":5,"category":-2,"name":'5',"label":'学院1',"symbolSize":20},
                    {"id":6,"category":-2,"name":'6',"label":'学院2',"symbolSize":20},
                    {"id":7,"category":-2,"name":'7',"label":'学院3',"symbolSize":20},
                    {"id":8,"category":1,"name":'8',"label":'校区3',"symbolSize":30},
                    {"id":9,"category":-2,"name":'9',"label":'学院1',"symbolSize":20},
                    {"id":10,"category":-2,"name":'10',"label":'学院2',"symbolSize":20},
                    {"id":11,"category":-2,"name":'11',"label":'学院3',"symbolSize":20},
                    {"id":12,"category":-2,"name":'12',"label":'学院4',"symbolSize":20},
                    {"id":13,"category":-3,"name":'13',"label":'一班',"symbolSize":10},
                    {"id":14,"category":-3,"name":'14',"label":'二班',"symbolSize":10}
                ],
                "links":[ {"source" : 1,"target" : 0}, {"source" : 4,"target" : 0}, {"source" : 8,"target" : 0},
                    {"source" : 2,"target" : 1}, {"source" : 3,"target" : 1}, {"source" : 5,"target" : 4},
                    {"source" : 6,"target" : 4}, {"source" : 7,"target" : 4}, {"source" : 9,"target" : 8},
                    {"source" : 10,"target" : 8}, {"source" : 11,"target" : 8}, {"source" : 12,"target" : 8},
                    {"source" : 13,"target" : 6}, {"source" : 14,"target" : 6} ],
                "categories": [ {"name" : '学校'}, {"name" : '校区'}, {"name" : '学院'}, {"name" : '班级'} ]
            }
        ]
    };
    echart.setOption(options);
    bindChartClickEvent(echart);

    /**
     * 获取颜色
     * @param colors
     * @param index
     * @returns {*}
     */
    function getColor(colors, index) {
        var length = colors.length,
            colorIndex = index;
        if (index >= length) {
            colorIndex = length - index;
        }
        return colors[colorIndex];
    }

    /**
     * 绑定图表的点击事件
     * @param chart
     */
    function bindChartClickEvent(chart) {
        chart.on('click', function (params) {
            var category = params.data.category,
                nodeType = params.data.nodeType;
            if (category === 0 || nodeType === 1) {
                toggleShowNodes(chart, params);
            }
        });
    }

    /**
     * 展开或关闭节点
     * @param chart
     * @param params
     */
    function toggleShowNodes(chart, params) {
        var open = !!params.data.open,
            options = chart.getOption(),
            seriesIndex = params.seriesIndex,
            srcLinkName = params.name,
            serieLinks = options.series[seriesIndex].links,
            serieData = options.series[seriesIndex].data,
            serieDataMap = new Map(),
            serieLinkArr = [];
        // 当前根节点是展开的，那么就需要关闭所有的根节点
        if (open) {
            // 递归找到所有的link节点的target的值
            findLinks(serieLinkArr, srcLinkName, serieLinks, true);
            if (serieLinkArr.length) {
                serieData.forEach(sd => serieDataMap.set(sd.name, sd));
                for (var i = 0; i < serieLinkArr.length; i++) {
                    if (serieDataMap.has(serieLinkArr[i])) {
                        var currentData = serieDataMap.get(serieLinkArr[i]);
                        currentData.category = -Math.abs(currentData.category);
                        if (currentData.nodeType === 1) {
                            currentData.open = false;
                        }
                    }
                }
                serieDataMap.get(srcLinkName).open = false;
                chart.setOption(options);
            }
        } else {
            // 当前根节点是关闭的，那么就需要展开第一层根节点
            findLinks(serieLinkArr, srcLinkName, serieLinks, false);
            if (serieLinkArr.length) {
                serieData.forEach(sd => serieDataMap.set(sd.name, sd));
                for (var j = 0; j < serieLinkArr.length; j++) {
                    if (serieDataMap.has(serieLinkArr[j])) {
                        var currentData = serieDataMap.get(serieLinkArr[j]);
                        currentData.category = Math.abs(currentData.category);
                    }
                }
                serieDataMap.get(srcLinkName).open = true;
                chart.setOption(options);
            }
        }
    }

    /**
     * 查找连接关系
     * @param links 返回的节点放入此集合
     * @param srcLinkName 源线的名称
     * @param serieLinks 需要查找的集合
     * @param deep 是否需要递归进行查找
     */
    function findLinks(links, srcLinkName, serieLinks, deep) {
        var targetLinks = [];
        serieLinks.filter(link => link.source === srcLinkName).forEach(link => {
            targetLinks.push(link.target);
        links.push(link.target)
    });
        if (deep) {
            for (var i = 0; i < targetLinks.length; i++) {
                findLinks(links, targetLinks[i], serieLinks, deep);
            }
        }
    }
</script>
</body>
</html>