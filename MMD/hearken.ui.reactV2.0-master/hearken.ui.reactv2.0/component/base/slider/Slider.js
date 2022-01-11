import ABaseComponent from '../../ABaseComponent';
import {Slider as AntdSlider} from 'antd';

export default class Slider extends ABaseComponent{
	constructor(props) {
		super(props);
	}
	//通过父组件改变props是调用
	componentWillReceiveProps(nextProps) {
	    const controlledValue = nextProps.value;
	    if (controlledValue !== this.state.value) {
	        this.setState({
	            value: controlledValue,
	        });
	    }
	}
	componentWillMount(){
		if(this.props.draggableTrack){
			this.draggableTrack={draggableTrack:true}
		}
	}
	onChange(value){
		this.setState({value});
		this.props.onChange && this.props.onChange (value)
	}
	createContent() {
		return (
			<AntdSlider {...this.state} range={this.draggableTrack} onChange={(value)=>{this.onChange(value)}}>
			</AntdSlider>
		);
	}
}
