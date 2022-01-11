
//以上依赖包必须有，总体设计思想为，本身甘特图不能进行拖拽（设其自带原点为A），我们设置与图中data相同的点（点B）， A点不动
//B点动，B点变化后改变data、的值，从而逼迫A点从新画图，下图是B点没隐藏这样方便我们看。


//指定布局相当于FindViewById()
var dom = document.getElementById("container");
var myChart = echarts.init(dom);
var app = {};
//设置点的大小
var symbolSize = 35;
//没啥用好像
option = null;
//当0时候表示输入起点坐标，其他值输入终点坐标
var position = 0;
//起点
var positionSource;
//钟点
var positionTarget;
//设置判断点击线还是点击点
var ok = 1;
//删除数组的索引位置
var del;
var xydata = [[1, 2], [3, 0], [2, 0], [1, 3], [4, 1]]
var linkss = xydata.map(function (item, i) {
    return {
        source: xydata[i][0],
        target: xydata[i][1]

    };
});
//var data = [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40], [10, 0]];
const data = [
    {
        fixed: true,
        x: myChart.getWidth() / 2,
        y: myChart.getHeight() / 2,
        symbolSize: 20,
        id: '-1'
    }
];
myChart.setOption(
    {
    //定义将坐标系转化为像素死规钊的直接粘贴就ok
    tooltip: {
        triggerOn: 'none',

        formatter: function (params) {
            return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2);
        }
    },
    //定义X轴  最大刻度最小刻度是否从零开始
    xAxis: {
        min: -100,
        max: 100,
        type: 'value',
        axisLine: { onZero: false },
        splitLine: { show: false },
        show: false,
    },
    //同上
    yAxis: {
        min: -100,
        max: 100,
        type: 'value',
        axisLine: { onZero: false },
        splitLine: { show: false },
        show: false,
    },
    series: [
        {
            //设置id很重要  但不知道啥用
            id: 'a',
            //设置为甘特图只有这样   才能连线
            type: 'graph',
            //没有用
            layout: 'none',
            //color: '#0000',
            //删了就不好使，不知道啥用
            coordinateSystem: 'cartesian2d',
            //设置球的大小
            symbolSize: symbolSize,
            //用途未知，别删
            label: {
                normal: {
                    show: true
                }
            },

            //设置连线形式目前为箭头
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],

            categories: [//背景色位置
                {
                    name: "bgColorA",
                    itemStyle: {
                        normal: {
                            color: "#0cc"
                        }
                    }
                }, {
                    name: "bgHover",
                    itemStyle: {
                        normal: {
                            color: "#0cc"
                        }
                    }
                }
            ],
            //指定数据数组
            data: data,
            //指定连线方式
            //                links: links,
            edges: linkss,
            //指定连线颜色
            lineStyle: {
                normal: {
                    color: '#000000'
                }
            },
            //修改原点颜色
            itemStyle: {
                normal: {
                    color: "#0cc"
                }
            }

        }
    ]
});
window.addEventListener('resize', function () {
    myChart.resize();
});

//拖拽功能
function move(z) {
    myChart.setOption({
        graphic: echarts.util.map(data, function (item, dataIndex) {
            return {
                //不能删，要不然不好使
                type: 'circle',
                //将坐标转化为像素
                position: myChart.convertToPixel('grid', item),
                shape: {
                    r: symbolSize / 2
                    // 拖动点的大小
                },
                //指定虚拟圈是否可见
                invisible: true,
                color: "#ffff",
                //指定圈被拖拽（可以与不可以）
                draggable: true,
                //指定拖拽的反应  死规钊的
                ondrag: echarts.util.curry(onPointDragging, dataIndex),
                //指定鼠标移入移出的反应
                onmousemove: echarts.util.curry(showTooltip, dataIndex),
                onmouseout: echarts.util.curry(hideTooltip, dataIndex),
                //Z值 及坐标z
                z: z
            };
        })
    });
}

move(100);


//下面都是死的，直接粘贴就行
function showTooltip(dataIndex) {
    myChart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: dataIndex

    });
}

function hideTooltip(dataIndex) {
    myChart.dispatchAction({
        type: 'hideTip'
    });
}

function onPointDragging(dataIndex, dx, dy) {
    data[dataIndex] = myChart.convertFromPixel('grid', this.position);
    myChart.setOption({
        series: [{
            id: 'a',
            data: data,
        }]
    });
    console.log('array', data);
}


function save() {
    var option = myChart.getOption();
    move(1);
}

function saveOver() {
    var option = myChart.getOption();
    move(100);
}

//点击事件
myChart.on('click', function (params) {

    for (i = 0; i < data.length; i++) {
        if (data[i][0] == params.data[0] && data[i][1] == params.data[1]) {
            ok = 0;
            if (position == 0) {
                positionSource = i;
                //alert("positionSource" + positionSource)
                position = 1;
            } else {
                positionTarget = i;
                //alert("positionTarget" + positionTarget)
                position = 0;
                if (window.confirm('你确定要建立坐标：' + "起点" + data[positionSource] + "至终点" + data[positionTarget] + "的连接线吗")) {
                    //alert("确定");
                    xydata.push([positionSource, positionTarget])
                    console.log('array', xydata);
                    //当xydata值改变时linkss方法需要重新跑一变
                    var linkss = xydata.map(function (item, i) {
                        return {
                            source: xydata[i][0],
                            target: xydata[i][1]
                        };
                    });
                    //重新载入的东西都写在这里
                    myChart.setOption({
                        series: [{
                            edges: linkss,
                            //指定连线颜色
                            lineStyle: {
                                normal: {
                                    color: '#000000'
                                }
                            }
                        }]
                    });
                    return true;
                } else {
                    //alert("取消");
                    console.log('array', xydata);
                    return false;
                }
            }
            break;
        }
        else {
            ok = 1;
            console.log(ok);
        }
    }
    //删除线段  代码
    if (ok == 1) {

        var a = [params.data.source, params.data.target]
        for (i = 0; i < xydata.length; i++) {
            if (params.data.source == xydata[i][0] && params.data.target == xydata[i][1]) {
                del = i;
                if (window.confirm('是否删除改线段')) {
                    xydata.splice(del, 1);
                    //当xydata值改变时linkss方法需要重新跑一变
                    var linkss = xydata.map(function (item, i) {
                        return {
                            source: xydata[i][0],
                            target: xydata[i][1]
                        };
                    });
                    //重新载入的东西都写在这里
                    myChart.setOption({
                        series: [{
                            edges: linkss,
                            //指定连线颜色
                            lineStyle: {
                                normal: {
                                    color: '#2f4554'
                                }
                            }
                        }]
                    });
                    return true;
                } else {
                    //alert("取消");
                    console.log('array', xydata);
                    return false;
                }
                break;
            } else {

            }
        }

    }

});


console.log('xydata', xydata);
if (option && typeof option === "object") {
    myChart.setOption(option, true);
}