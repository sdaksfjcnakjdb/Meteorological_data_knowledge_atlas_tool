import EChart from '../EChart';

export default class AreaEchart extends EChart {
    constructor(props) {
        super(props);
        let appendState = {
            type: 'area2d',
        }
        //组合state
        this.setState($.extend(this.state, appendState));

    }



    createContent() {
        console.log("组件渲染---------------");
        const id = this.props.id;

        return (<div className="hk-chart" style={this.style} id={id} data-type="area2d" chart-type="Area" ref="Echart"
                     data-url={this.props["data-url"]}>
        </div>)
    }
}
