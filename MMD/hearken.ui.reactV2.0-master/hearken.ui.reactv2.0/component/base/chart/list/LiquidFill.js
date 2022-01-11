import EChart from '../EChart';

export default class LiquidFilLChart extends EChart {
	constructor(props) {
		super(props);
		let appendState = {
			type:'liquidFill',	
		}
		//组合state
		this.setState($.extend(this.state,appendState));
	
	}	
	
	createContent() {
		console.log("组件渲染---------------");
		const id = this.props.id;
		
		return (<div className="hk-chart" style={this.style} id={id} data-type="liquidFill" ref="Echart"  data-url={this.props["data-url"]}>
		</div>)
	}
}
