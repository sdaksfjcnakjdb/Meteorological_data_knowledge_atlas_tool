import EChart from '../EChart';

export default class DoughnutEchart extends EChart {
	constructor(props) {
		super(props);
		let appendState = {
			type:'doughnut2d',
		}
		//组合state
		this.setState($.extend(this.state,appendState));

	}
	chartDeal=(option)=> {
		if (option.series[0]) {
			if (option.series[0].radius) {
				option.series[0].radius = ["50%","70%"];
			}
		}
		return option;
	}


    createContent() {
		console.log("组件渲染---------------");
		const id = this.props.id;

		return (<div className="hk-chart" style={this.style} id={id} data-type="doughnut2d" ref="Echart"  data-url={this.props["data-url"]}>
		</div>)
	}
}
