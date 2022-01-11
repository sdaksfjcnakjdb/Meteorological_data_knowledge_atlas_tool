import PropTypes from 'prop-types';
import $ from 'jquery';
import ABaseComponent from '../../ABaseComponent';
import {defaultTheme, dark, macarons} from './Theme'
import ComponentMap from '../../ComponentMap';

export default class EChart extends ABaseComponent {

    constructor(props) {
        super(props);
        this.registerJQueryPlug();
        this.chart = null;
        this.id = this.props.id;
        this.initState();
        this.chartType = "";
        this.style = {
        	width: "100%",
        	height: "100%"
        }
    }

    registerJQueryPlug() {
        if (!$.resize) {
            //监听div大小变化
            (function ($, h, c) {
                var a = $([]),
                    e = $.resize = $.extend($.resize, {}),
                    i,
                    k = "setTimeout",
                    j = "resize",
                    d = j + "-special-event",
                    b = "delay",
                    f = "throttleWindow";
                e[b] = 250;
                e[f] = true;
                $.event.special[j] = {
                    setup: function () {
                        if (!e[f] && this[k]) {
                            return false;
                        }
                        var l = $(this);
                        a = a.add(l);
                        $.data(this, d, {
                            w: l.width(),
                            h: l.height()
                        });
                        if (a.length === 1) {
                            g();
                        }
                    },
                    teardown: function () {
                        if (!e[f] && this[k]) {
                            return false;
                        }
                        var l = $(this);
                        a = a.not(l);
                        l.removeData(d);
                        if (!a.length) {
                            clearTimeout(i);
                        }
                    },
                    add: function (l) {
                        if (!e[f] && this[k]) {
                            return false;
                        }
                        var n;

                        function m(s, o, p) {
                            var q = $(this),
                                r = $.data(this, d);
                            r.w = o !== c ? o : q.width();
                            r.h = p !== c ? p : q.height();
                            n.apply(this, arguments);
                        }

                        if ($.isFunction(l)) {
                            n = l;
                            return m;
                        } else {
                            n = l.handler;
                            l.handler = m;
                        }
                    }
                };

                function g() {
                    i = h[k](function () {
                            a.each(function () {
                                var n = $(this),
                                    m = n.width(),
                                    l = n.height(),
                                    o = $.data(this, d);
                                if (m !== o.w || l !== o.h) {
                                    n.trigger(j, [o.w = m, o.h = l]);
                                }
                            });
                            g();
                        },
                        e[b]);
                }
            })($, window);
        }

    }

    initState() {
        this.state = {
            url: this.props["data-url"], //图表路径
            data: this.props.data, //图表参数
            theme: this.props.theme,
            init: true
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        const url = this.props["data-url"];//获取url
        ComponentMap.put(this.id, this);
        this.initPie();
        if (this.props["data-autoLoad"] == "false") {
            //this.reload();
        } else {
            if (url.indexOf("ChartData.svt") !== -1) {//url为图表地址
                this.autoLoad();
            }
            else {//url不为图表地址
                this.autoLoad2(url);
            }
        }
        this.bindListener();
        //	console.log($(this.refs.Echart),"-----------");
        let _this = this;
        //监听div变化
        $(this.refs.Echart).resize(function () {
            if (_this.chart != null) {
                _this.chart.resize();
            }
        });
    }

    //移除
    componentWillUnmount() {

    }

    //组件完成更新
    componentDidUpdate(prevProps, prevState) {

       /* this.reload();
        this.bindListener();*/
        const url = this.state.url;//获取url
        if (url.indexOf("ChartData.svt") !== -1) {//url为图表地址
            this.reload()
        }
        else {//url不为图表地址
            this.autoLoad2(url);
        }
        this.bindListener();
    }

    //页面加载后加载图表
    reload() {
        let params = {
            chartType: this.state.type,
            chartPlug: 'echarts'
        };
        params = $.extend(true, params, this.state.data);
        this.requestData(this.chart, this.id, this.state.url, params);
    }
    autoLoad() {
        // 参数组装?
        let jsonObj = {
            chartType: this.type,
            chartPlug: 'echarts'
        };
        // 异步加载读取后台数据
        this.requestData(this.chart, this.id, this.dataUrl, jsonObj);

    }
    //绑定事件
    bindListener() {
        if (this.props.listener != null && this.isFunction(this.props.listener)) {
            this.props.listener(this.chart);
        }
        if (this.props.click != null && this.isFunction(this.props.click)) {
            this.chart.on("click", this.props.click);
        }
        if (this.props.dbclick != null && this.isFunction(this.props.dbclick)) {
            this.chart.on("dbclick", this.props.dbclick);
        }
        if (this.props.hover != null && this.isFunction(this.props.hover)) {
            this.chart.on("hover", this.props.hover);
        }

    }

    isFunction(obj) {
        if (typeof obj === "function") {
            return true;
        }
        return false;
    }



    autoLoad2(url) {
        const chartDom = this.refs.Echart;
        const chart = echarts.init(chartDom);
        const _this = this;
        $.ajax({
            type: 'get',
            url: url,
            dataType: "text",
            success: function (res) {
                const data = JSON.parse(res);
                let option = _this.createOption(data);
                if (_this.state.init) {
                    //初始化图表操作，扩展配置
                    if (_this.init && _this.isFunction(_this.init)) {
                        let newOption = _this.init(option);
                        if (newOption != null) {
                            option = newOption;
                        }
                    }
                }
                chart.setOption(option, true);
            },
            failure: function (err) {
                console.error("获取后台数据失败", err);
            }
        });
    }

    createOption(data) {
        const chartType = this.type;
        const type_1 = ['line', 'area2d', 'column2d', 'bar2d', 'scatter', 'bubble'];//折线图、面积图、柱状图、条形图、散点图、气泡图
        const type_2 = ['msline', 'msarea', 'mscolumn2d', 'msbar2d', 'stackedcolumn2d', 'stackedbar2d', 'stackedarea2d'];//折线图、面积图、柱状图、条形图的数据集图、堆叠柱状图、堆叠条形图、堆叠面积图
        const type_3 = ['doughnut2d', 'pie2d', 'funnel', 'gauge'];//圆环图、饼图、漏斗图、仪表盘
        const type_special = ['k', "radar"];//特殊图形：k线图、雷达图
        if (type_1.indexOf(chartType) !== -1) {
            return this.handleType_1(chartType, data);
        } else if (type_2.indexOf(chartType) !== -1) {
            return this.handleType_2(chartType, data);
        } else if (type_3.indexOf(chartType) !== -1) {
            return this.handleType_3(chartType, data);
        } else if (type_special.indexOf(chartType) !== -1) {
            return this.handleType_special(chartType, data);
        } else if (chartType === "liquidFill") {
            return this.liquidFillRender(data);
        }
        else {
            console.error("未找到对应图表类型！");
        }
    }

    handleType_1(type, data) {
        const x = this.props.x;
        const y = this.props.y;
        const x_name = this.props.x_name;
        const y_name = this.props.y_name;
        const text = this.props.text;
        const left = this.props.left;
        const subtext = this.props.subtext;
        const tooltips = this.props.tooltips;
        const label = this.props.label;
        const legend = this.props.legend;
        const orient = this.props.orient;
        const legendX = this.props.legendX;
        const legendY = this.props.legendY;
        const xData = [];
        const yData = [];
        let BaseOption ={};
        data.forEach(function (item) {
            xData.push(item[x]);
            yData.push(item[y]);
        });
        BaseOption = {
    			title: {
    				text: text,
    				left: left,
    				subtext: subtext
    			},
    			xAxis: {
    				name: x_name,
    				type: 'category',
    				data: xData
    			},
    			yAxis: {
    				name: y_name,
    				type: 'value',
    				data: []
    			},
    			series: [{
                    data: yData,
                    name: y_name || y,
    				type: 'line'
    			}]
    	};
        const tooltipkey = 'tooltip';
        const tooltipvalue = {};
        const legendkey = 'legend';
        const legendvalue = {
        		orient: orient,
        		x: legendX,
        		y: legendY
        };
        if(tooltips == false){
        	Reflect.set(BaseOption, tooltipkey, tooltipvalue); //追加tooltip
        }
        if(label == true){
        	BaseOption.series[0].label = {show: true};
        }
        if(legend == true){
        	Reflect.set(BaseOption, legendkey, legendvalue); //追加legend
        }
        if (type === 'column2d') {
            BaseOption.series[0].type = "bar";
            return BaseOption;
        } else if (type === "area2d") {
            BaseOption.series[0].areaStyle = {};
        } else if (type === "bar2d") {
            BaseOption.series[0].type = "bar";
            BaseOption.xAxis.type = "value";
            BaseOption.xAxis.data = [];
            BaseOption.yAxis.type = "category";
            BaseOption.yAxis.data = yData;
            BaseOption.series[0].data = xData;
            BaseOption.series[0].name = x_name || x;
        } else if (type === "scatter" || type === "bubble") {
            BaseOption.series[0].type = "scatter";
            const seriesData = [];
            const size = this.props.size;
            BaseOption.xAxis = {};
            BaseOption.yAxis = {};
            data.forEach(function (item) {
                if (size) {//有size是气泡图
                    seriesData.push([item[x], item[y], item[size]]);
                } else {
                    seriesData.push([item[x], item[y]]);
                }
            });
            BaseOption.series[0].data = seriesData;
            if (size) {
                BaseOption.series[0].symbolSize = function (data) {
                    return data[2];
                }
            }
        }
        return BaseOption;
    }

    handleType_2(type, data) {
    	const x = this.props.x;
        const y = this.props.y;
        const x_name = this.props.x_name;
        const y_name = this.props.y_name;
        const text = this.props.text;
        const left = this.props.left;
        const subtext = this.props.subtext;
        const tooltips = this.props.tooltips;
        const label = this.props.label;
        const legend = this.props.legend;
        const orient = this.props.orient;
        const legendX = this.props.legendX;
        const legendY = this.props.legendY;
        const xData = [];
        const yData = [];
        const keys = Object.keys(data[0]);
        const legendkey = 'legend';
        const legendvalue = {
        		orient: orient,
        		x: legendX,
        		y: legendY
        };
        const series = [];
        let BaseOption = {};
        const seriesArray = {};
        const seriesName = [];
        if (type === "msbar2d" || type === "stackedbar2d") {
            const y = this.props.y;
            let xArray = [];
            if (data.length !== 0) {
                keys.splice(keys.indexOf(y), 1);
                xArray = keys;
            }
            data.forEach(function (item) {
                yData.push(item[y]);
                keys.forEach(function (key, index) {
                    if (!xData[index]) {
                        xData[index] = [];
                    }
                    xData[index].push(item[key]);
                    if (!seriesArray[key]) {
                    	seriesArray[key] = [item[key]];
                    } else {
                    	seriesArray[key].push(item[key]);
                    }
                });
            });

            for (let key in seriesArray) {
            	seriesName.push(key);
            }
            if (type === "msbar2d") {
                xData.forEach(function (item, index) {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "bar",
                            name: seriesName[index],
	                        label: {show: true}
	                    })
                	}
                	else{
                		 series.push({
 	                        data: item,
                             name: seriesName[index],
 	                        type: "bar"
 	                    })
                	}
                });
            } else {
                xData.forEach(function (item, index) {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "bar",
	                        stack: "stack",
                            name: seriesName[index],
	                        label: {show: true}
	                    })
                	}
                	else{
                		series.push({
	                        data: item,
	                        type: "bar",
                            name: seriesName[index],
	                        stack: "stack"
	                    })
                	}
                });
            }
            BaseOption = {
        			title: {
        				text: text,
        				left: left,
        				subtext: subtext
        			},
        			xAxis: {
        				name: x_name,
        				type: 'value'
        			},
        			yAxis: {
        				name: y_name,
        				type: 'category',
        				data: yData
        			},
        			series: series
        	};
            if(tooltips == false){
            	BaseOption = {
            			title: {
            				text: text,
            				left: left,
            				subtext: subtext
            			},
            			tooltip: {},
            			xAxis: {
            				name: x_name,
            				type: 'value'
            			},
            			yAxis: {
            				name: y_name,
            				type: 'category',
            				data: yData
            			},
            			series: series
            	};
            } else {
            	BaseOption = {
            			title: {
            				text: text,
            				left: left,
            				subtext: subtext
            			},
            			xAxis: {
            				name: x_name,
            				type: 'value'
            			},
            			yAxis: {
            				name: y_name,
            				type: 'category',
            				data: yData
            			},
            			series: series
            	};
            }
            if(legend == true){
                Reflect.set(BaseOption, legendkey, legendvalue); //追加legend
            }
            return BaseOption;
        } else {
            const x = this.props.x;
            let yArray = [];
            if (data.length !== 0) {
                keys.splice(keys.indexOf(x), 1);//剔除x的key,保留y的key
                yArray = keys;
            }
            data.forEach(function (item) {
                xData.push(item[x]);
                keys.forEach(function (key, index) {
                    if (!yData[index]) {
                        yData[index] = [];
                    }
                    yData[index].push(item[key]);
                    if (!seriesArray[key]) {
                    	seriesArray[key] = [item[key]];
                    } else {
                    	seriesArray[key].push(item[key]);
                    }
                });
            });
            for (let key in seriesArray) {
            	seriesName.push(key);
            }
            yData.forEach(function (item, index) {
                if (type === "msarea") {
                	if(label == true){
                		series.push({
                			data: item,
                            type: "line",
                            name: seriesName[index],
                			areaStyle: {},
                			label: {show: true}
                		});
                	}
                	else{
                		series.push({
                			data: item,
                			type: "line",
                            name: seriesName[index],
                			areaStyle: {}
                		});
                	}
                } else if (type === "msline") {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "line",
                            name: seriesName[index],
	                        label: {show: true}
	                    });
                	}
                	else{
                		 series.push({
                             data: item,
                             name: seriesName[index],
                             type: "line"
                         });
                	}
                } else if (type === "mscolumn2d") {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "bar",
                            name: seriesName[index],
	                        label: {show: true}
	                    });
                	}
                	else{
                		series.push({
	                        data: item,
	                        type: "bar",
	                        name: seriesName[index]	
	                    });
                	}
                } else if (type === "stackedcolumn2d") {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "bar",
	                        stack: "stack",
                            name: seriesName[index],
	                        label: {show: true}
	                    });
                	}
                	else{
                		series.push({
	                        data: item,
	                        type: "bar",
                            name: seriesName[index],
	                        stack: "stack"
	                    });
                	}
                } else if (type === "stackedarea2d") {
                	if(label == true){
	                    series.push({
	                        data: item,
	                        type: "line",
	                        areaStyle: {},
	                        stack: "stack",
                            name: seriesName[index],
	                        label: {show: true}
	                    });
                	}
                	else{
                		series.push({
	                        data: item,
	                        type: "line",
	                        areaStyle: {},
                            name: seriesName[index],
	                        stack: "stack"
	                    });
                	}
                }
            });
            if(tooltips == false)
            {
            	BaseOption = {
            			title: {
            				text: text,
            				left: left,
            				subtext: subtext
            			},
            			tooltip: {},
            			xAxis: {
            				name: x_name,
            				type: 'category',
            				data: xData
            			},
            			yAxis: {
            				name: y_name,
            				type: 'value'
            			},
            			series: series,
            	};
            } else {
            	BaseOption = {
            			title: {
            				text: text,
            				left: left,
            				subtext: subtext
            			},
            			xAxis: {
            				name: x_name,
            				type: 'category',
            				data: xData
            			},
            			yAxis: {
            				name: y_name,
            				type: 'value'
            			},
            			series: series,
            	};

            }
            if(legend == true){
                Reflect.set(BaseOption, legendkey, legendvalue); //追加legend
            }
            return BaseOption;
        }

    }

    handleType_3(type, data) {
        const name = this.props.name;
        const value = this.props.value;
        const text = this.props.text;
        const left = this.props.left;
        const subtext = this.props.subtext;
        const tooltips = this.props.tooltips;
        const legend = this.props.legend;
        const orient = this.props.orient;
        const x = this.props.x;
        const y = this.props.y;
        let BaseOption = {};
        const series = [];
        data.forEach(function (item) {//将数据格式化为标准格式
            const obj = {};
            obj['name'] = item[name];
            obj['value'] = item[value];
            series.push(obj);
        });
        BaseOption = {
    			title: {
    				text: text,
    				left: left,
    				subtext: subtext
    			},
    			series: [{
    				type: 'pie',
    				data: series
    			}]
    	};
        const tooltipkey = 'tooltip';
        const tooltipvalue = {};
        const legendkey = 'legend';
        const legendvalue = {
        		orient: orient,
        		x: x,
        		y: y
        };
        if(tooltips == false){
        	Reflect.set(BaseOption, tooltipkey, tooltipvalue); //追加tooltip
        }
        if(legend == true){
        	Reflect.set(BaseOption, legendkey, legendvalue); //追加legend
        }
        if (type === "doughnut2d") {
            BaseOption.series[0].radius = ['50%', '70%'];
        } else if (type === "funnel") {
            BaseOption.series[0].type = "funnel";
        } else if (type === "gauge") {
            BaseOption.series[0].type = "gauge";
        }
        return BaseOption;
    }

    handleType_special(type, data) {
        if (type === "k") {
            const x = this.props.x;
            const xData = [];
            const seriesData = [];
            data.forEach(function (item) {
                const array = [];
                for (let key in item) {
                    if (key === x) {
                        xData.push(item[key]);
                    } else {
                        array.push(item[key]);
                    }
                }
                seriesData.push(array);
            });
            const option = {
                tooltip: {},
                xAxis: {
                    data: xData
                },
                yAxis: {},
                series: [{
                    type: 'k',
                    data: seriesData
                }]
            };
            return option;
        } else if (type === 'radar') {
            const name = this.props.name;
            const indicator = [];
            const seriesData = [];
            const json = {};
            data.forEach(function (item) {
                const array = [];//存放某个字段的所有值
                for (let key in item) {
                    if (key !== name) {
                        array.push(item[key]);
                        if (!json[key]) {
                            json[key] = [];
                        }
                        json[key].push(item[key]);

                    }
                }
                indicator.push({
                    name: item.name,
                    max: Math.max(...array),
                });
            });
            Object.keys(json).forEach(function (item) {
                seriesData.push({
                    name: item,
                    value: json[item]
                })
            });
            const option = {
                tooltip: {},
                radar: {
                    indicator
                },
                series: [{
                    type: 'radar',
                    data: seriesData
                }]
            };
            return option;
        }
    }

    initPie() {
        let chartDom = this.refs.Echart;
        this.chart = echarts.init(chartDom); //初始化echarts
        this.type = chartDom.getAttribute('data-type');
        this.dataUrl = this.props["data-url"];
        this.id = this.props.id;
        this.init = this.props.init;

    }

    liquidFillRender(option) {
        var newOption = {
            series: [{
                type: 'liquidFill',
                data: option.value
            }]
        };
        return newOption;
    }

    requestData(chart, divId, dataUrl, jsonObj) {
        let _this = this;
        if (jsonObj.chartType) {
            this.chartType = jsonObj.chartType;
        }
        // 异步加载读取后台数据
        $.ajax({
            type: 'post',
            url: dataUrl,
            dataType: "text",
            data: jsonObj,
            success: function (req) {
                console.log("加载数据-----------")
                let option = JSON.parse(req);
                if (_this.type == "liquidFill") {
                    option = _this.liquidFillRender(option);

                }
                if (option.dataZoom) {
                    delete option.dataZoom;
                }
                let state = _this.state;
                if (state.theme != null && state.theme != "") {
                    try {
                        if (state.theme === "default") {
                            chart.setTheme(defaultTheme);
                        }
                        if (state.theme === "dark") {
                            chart.setTheme(dark);
                        }
                        if (state.theme === "macarons") {
                            chart.setTheme(macarons);
                        }
                    } catch (e) {

                    }

                }
                if (option == null || option == "") {
                    console.log(divId + " 图表数据为空");
                    //加载空数据显示情况,不要用echarts自带气泡提示
                } else {
                    if (_this.chartDeal != null) {
                        //各图表样式处理操作
                        let newOption = _this.chartDeal(option);
                        if (newOption != null) {
                            option = newOption;
                        }
                    }
                    //图表配置处理函数
                    if (_this.state.optionDeal != null) {
                        let newOption = _this.state.optionDeal(option);
                        if (newOption != null) {
                            option = newOption;
                        }
                    }
                    if (_this.state.init) {
                        //初始化图表操作，扩展配置
                        if (_this.init && _this.isFunction(_this.init)) {
                            let newOption = _this.init(option);
                            if (newOption != null) {
                                option = newOption;
                            }
                        }
                    }


                    chart.setOption(option, true);
                }
            },
            failure: function (err) {
                console.error("获取后台数据失败", err);
            }
        });
    }

}

EChart.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    id: PropTypes.string.isRequired,
    "data-url": PropTypes.string.isRequired
}
