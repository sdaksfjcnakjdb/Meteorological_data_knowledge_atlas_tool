const dark = {
    // 全图默认背景
    backgroundColor: '#1b1b1b',
    
    // 默认色板
    color: [
        '#FE8463','#9BCA63','#FAD860','#60C0DD','#0084C6',
        '#D7504B','#C6E579','#26C0C0','#F0805A','#F4E001',
        '#B5C334'
    ],

    // 图表标题
    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'normal',
            color: '#fff'          // 主标题文字颜色
        }
    },
    
    // 图例
    legend: {
        itemGap: 8,
        textStyle: {
            color: '#ccc'          // 图例文字颜色
        }
    },
    
    // 值域
    dataRange: {
        itemWidth: 15,
        color: ['#FFF808','#21BCF9'],
        textStyle: {
            color: '#ccc'          // 值域文字颜色
        }
    },

    toolbox: {
        color : ['#fff', '#fff', '#fff', '#fff'],
        effectiveColor : '#FE8463',
        disableColor: '#666',
        itemGap: 8
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(250,250,250,0.8)',     // 提示背景颜色，默认为透明度为0.7的黑色
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle : {          // 直线指示器样式设置
                color: '#aaa'
            },
            crossStyle: {
                color: '#aaa'
            },
            shadowStyle : {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.2)'
            }
        },
        textStyle: {
            color: '#333'
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#555',            // 数据背景颜色
        fillerColor: 'rgba(200,200,200,0.2)',   // 填充颜色
        handleColor: '#eee'     // 手柄颜色
    },

    // 网格
    grid: {
        borderWidth: 0
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            show: false
        },
        axisTick: {            // 坐标轴小标记
            show: false
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#fff'
            }
        },
        splitLine: {           // 分隔线
            show: false
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            show: false
        },
        axisTick: {            // 坐标轴小标记
            show: false
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#fff'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#aaa'],
                type: 'dashed'
            }
        },
        splitArea: {           // 分隔区域
            show: false
        }
    },
    
    polar : {
        name : {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#ccc'
            }
        },
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#ddd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
            }
        },
        splitLine : {
            lineStyle : {
                color : '#ddd'
            }
        }
    },

    timeline : {
        label: {
            textStyle:{
                color: '#ccc'
            }
        },
        lineStyle : {
            color : '#aaa'
        },
        controlStyle : {
            normal : { color : '#fff'},
            emphasis : { color : '#FE8463'}
        },
        symbolSize : 3
    },

    // 折线图默认参数
    line: {
        smooth : true
    },
    
    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#FE8463',       // 阳线填充颜色
                color0: '#9BCA63',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#FE8463',   // 阳线边框颜色
                    color0: '#9BCA63'   // 阴线边框颜色
                }
            }
        }
    },
    
    // 雷达图默认参数
    radar : {
        symbol: 'emptyCircle',    // 图形类型
        symbolSize:3
        //symbol: null,         // 拐点图形类型
        //symbolRotate : null,  // 图形旋转控制
    },

    pie: {
        itemStyle: {
            normal: {
                borderWidth: 1,
                borderColor : 'rgba(255, 255, 255, 0.5)'
            },
            emphasis: {
                borderWidth: 1,
                borderColor : 'rgba(255, 255, 255, 1)'
            }
        }
    },
    
    map: {
        itemStyle: {
            normal: {
                borderColor:'rgba(255, 255, 255, 0.5)',
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#ccc'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#FE8463'
                },
                label: {
                    textStyle: {
                        color: 'ccc'
                    }
                }
            }
        }
    },
    
    force : {
        itemStyle: {
            normal: {
                linkStyle : {
                    strokeColor : '#fff'
                }
            }
        }
    },

    chord : {
        padding : 4,
        itemStyle : {
            normal : {
                lineStyle : {
                    width : 1,
                    color : 'rgba(228, 228, 228, 0.2)'
                },
                chordStyle : {
                    lineStyle : {
                        width : 1,
                        color : 'rgba(228, 228, 228, 0.2)'
                    }
                }
            },
            emphasis : {
                lineStyle : {
                    width : 1,
                    color : 'rgba(228, 228, 228, 0.9)'
                },
                chordStyle : {
                    lineStyle : {
                        width : 1,
                        color : 'rgba(228, 228, 228, 0.9)'
                    }
                }
            }
        }
    },

    gauge : {
        startAngle: 225,
        endAngle : -45,
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#9BCA63'],[0.8, '#60C0DD'],[1, '#D7504B']], 
                width: 3,
                shadowColor : '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisTick: {            // 坐标轴小标记
            length :15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto',
                shadowColor : '#fff', //默认透明
                shadowBlur: 10
            }
        },
        axisLabel: {            // 坐标轴小标记
            textStyle: {       // 属性lineStyle控制线条样式
                fontWeight: 'bolder',
                color: '#fff',
                shadowColor : '#fff', //默认透明
                shadowBlur: 10
            }
        },
        splitLine: {           // 分隔线
            length :25,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                width:3,
                color: '#fff',
                shadowColor : '#fff', //默认透明
                shadowBlur: 10
            }
        },
        pointer: {           // 分隔线
            shadowColor : '#fff', //默认透明
            shadowBlur: 5
        },
        title : {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                fontSize: 20,
                fontStyle: 'italic',
                color: '#fff',
                shadowColor : '#fff', //默认透明
                shadowBlur: 10
            }
        },
        detail : {
            shadowColor : '#fff', //默认透明
            shadowBlur: 5,
            offsetCenter: [0, '50%'],       // x, y，单位px
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                fontWeight: 'bolder',
                color: '#fff'
            }
        },
    },
    
    funnel : {
        itemStyle: {
            normal: {
                borderColor : 'rgba(255, 255, 255, 0.5)',
                borderWidth: 1
            },
            emphasis: {
                borderColor : 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }
        }
    },
    
    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
}

const defaultTheme = {
	
}

const macarons = {
    // 默认色板
    color: [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
    ],

    // 图表标题
    title: {
        itemGap: 8,
        textStyle: {
            fontWeight: 'normal',
            color: '#008acd'          // 主标题文字颜色
        }
    },
    
    // 图例
    legend: {
        itemGap: 8
    },
    
    // 值域
    dataRange: {
        itemWidth: 15,
        //color:['#1e90ff','#afeeee']
        color: ['#2ec7c9','#b6a2de']
    },

    toolbox: {
        color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
        effectiveColor : '#ff4500',
        itemGap: 8
    },

    // 提示框
    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',     // 提示背景颜色，默认为透明度为0.7的黑色
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'line',         // 默认为直线，可选为：'line' | 'shadow'
            lineStyle : {          // 直线指示器样式设置
                color: '#008acd'
            },
            crossStyle: {
                color: '#008acd'
            },
            shadowStyle : {                     // 阴影指示器样式设置
                color: 'rgba(200,200,200,0.2)'
            }
        }
    },

    // 区域缩放控制器
    dataZoom: {
        dataBackgroundColor: '#efefff',            // 数据背景颜色
        fillerColor: 'rgba(182,162,222,0.2)',   // 填充颜色
        handleColor: '#008acd'    // 手柄颜色
    },

    // 网格
    grid: {
        borderColor: '#eee'
    },

    // 类目轴
    categoryAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#008acd'
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    // 数值型坐标轴默认参数
    valueAxis: {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#008acd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 分隔线
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: ['#eee']
            }
        }
    },

    polar : {
        axisLine: {            // 坐标轴线
            lineStyle: {       // 属性lineStyle控制线条样式
                color: '#ddd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
            }
        },
        splitLine : {
            lineStyle : {
                color : '#ddd'
            }
        }
    },

    timeline : {
        lineStyle : {
            color : '#008acd'
        },
        controlStyle : {
            normal : { color : '#008acd'},
            emphasis : { color : '#008acd'}
        },
        symbol : 'emptyCircle',
        symbolSize : 3
    },

    // 柱形图默认参数
    bar: {
        itemStyle: {
            normal: {
                barBorderRadius: 5
            },
            emphasis: {
                barBorderRadius: 5
            }
        }
    },

    // 折线图默认参数
    line: {
        smooth : true,
        symbol: 'emptyCircle',  // 拐点图形类型
        symbolSize: 3           // 拐点图形大小
    },
    
    // K线图默认参数
    k: {
        itemStyle: {
            normal: {
                color: '#d87a80',       // 阳线填充颜色
                color0: '#2ec7c9',      // 阴线填充颜色
                lineStyle: {
                    width: 1,
                    color: '#d87a80',   // 阳线边框颜色
                    color0: '#2ec7c9'   // 阴线边框颜色
                }
            }
        }
    },
    
    // 散点图默认参数
    scatter: {
        symbol: 'circle',    // 图形类型
        symbolSize: 4        // 图形大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
    },

    // 雷达图默认参数
    radar : {
        symbol: 'emptyCircle',    // 图形类型
        symbolSize:3
        //symbol: null,         // 拐点图形类型
        //symbolRotate : null,  // 图形旋转控制
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            emphasis: {                 // 也是选中样式
                areaStyle: {
                    color: '#fe994e'
                },
                label: {
                    textStyle: {
                        color: 'rgb(100,0,0)'
                    }
                }
            }
        }
    },
    
    force : {
        itemStyle: {
            normal: {
                linkStyle : {
                    strokeColor : '#1e90ff'
                }
            }
        }
    },

    chord : {
        padding : 4,
        itemStyle : {
            normal : {
                lineStyle : {
                    width : 1,
                    color : 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle : {
                    lineStyle : {
                        width : 1,
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis : {
                lineStyle : {
                    width : 1,
                    color : 'rgba(128, 128, 128, 0.5)'
                },
                chordStyle : {
                    lineStyle : {
                        width : 1,
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge : {
        startAngle: 225,
        endAngle : -45,
        axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
                color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']], 
                width: 10
            }
        },
        axisTick: {            // 坐标轴小标记
            splitNumber: 10,   // 每份split细分多少段
            length :15,        // 属性length控制线长
            lineStyle: {       // 属性lineStyle控制线条样式
                color: 'auto'
            }
        },
        axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 分隔线
            length :22,         // 属性length控制线长
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
            }
        },
        pointer : {
            width : 5,
            color : 'auto'
        },
        title : {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: '#333'
            }
        },
        detail : {
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                color: 'auto'
            }
        }
    },
    
    textStyle: {
        fontFamily: '微软雅黑, Arial, Verdana, sans-serif'
    }
}

export {dark};
export {defaultTheme};
export {macarons};