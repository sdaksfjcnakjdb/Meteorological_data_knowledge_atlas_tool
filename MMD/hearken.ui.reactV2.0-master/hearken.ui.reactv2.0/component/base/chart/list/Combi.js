import EChart from '../EChart';

export default class CombiEchart extends EChart {
	constructor(props) {
		super(props);
		let appendState = {
			type:'mscombi2d',	
		}
		//组合state
		this.setState($.extend(this.state,appendState));
	
	}	
	
	createContent() {
		console.log("组件渲染---------------");
		const id = this.props.id;
		
		return (<div className="hk-chart" style={this.style} id={id} data-type="mscombi2d" ref="Echart"  data-url={this.props["data-url"]}>
		</div>)
	}
}
