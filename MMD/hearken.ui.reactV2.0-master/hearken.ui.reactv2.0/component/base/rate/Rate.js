import ABaseComponent from '../../ABaseComponent';
import {Rate as AntdRate} from 'antd';

export default class Rate extends ABaseComponent{
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state = this.props;
	}
	
	componentWillReceiveProps(nextProps) {
	    const controlledValue = nextProps.value;
	    if (controlledValue !== this.state.value) {
	        this.setState({
	            value: controlledValue,
	        });
	    }
	}
	
	handleChange = (value) => {
		this.setState({ value: value });
		if (this.props.onChange) {
			this.props.onChange(value);
		}
	}

	character=(RateProps)=>{
       if(this.props.character){
		   this.props.character(RateProps)
	   }
	}
	
	createContent() {
		return (
			<AntdRate {...this.state} character={this.character} onChange={this.handleChange}>
			</AntdRate>
		);
	}
}
