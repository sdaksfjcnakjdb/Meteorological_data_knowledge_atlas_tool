import EChart from '../EChart';

export default class ScatterEchart extends EChart {
    constructor(props) {
        super(props);
        let appendState = {
            type: 'scatter',
        }
        //组合state
        this.setState($.extend(this.state, appendState));

    }

    componentDidMount() {
        const url = this.props["data-url"];
        if (url.indexOf(".json") !== -1) {//url为json地址调用自己的方法
            super.initPie();
            if (this.props["data-autoLoad"] == "false") {
                //this.reload();
            } else {
                this.autoLoad1(url);
            }
            super.bindListener();
            let _this = this;
            //监听div变化
            $(this.refs.Echart).resize(function () {
                if (_this.chart != null) {
                    _this.chart.resize();
                }
            });
        } else {//url为图表地址调用父类的方法
            super.componentDidMount();
        }
    }

    autoLoad1(url) {
        const chartDom = this.refs.Echart;
        const chart = echarts.init(chartDom);
        const that = this;
        $.ajax({
            type: 'get',
            url: url,
            dataType: "text",
            success: function (res) {
                const data = JSON.parse(res);
                const x = that.props.x;
                const y = that.props.y;
                const series = [];
                data.forEach(function (item, index) {
                	series.push([item[x], item[y]]);
                });
                chart.setOption({
                        xAxis: {},
                        yAxis: {},
                        series: [{
                            symbolSize: 20,
                            data: series,
                            type: 'scatter'
                        }]
                    }
                    , true);

            },
            failure: function (err) {
                console.error("获取后台数据失败", err);
            }
        });

    }

    createContent() {
        console.log("组件渲染---------------");
        const id = this.props.id;

        return (<div className="hk-chart" style={this.style} id={id} data-type="scatter" ref="Echart"
                     data-url={this.props["data-url"]}>
        </div>)
    }
}
