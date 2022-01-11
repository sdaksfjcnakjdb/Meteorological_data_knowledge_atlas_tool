import ABaseComponent from '../../ABaseComponent';
import {Switch as AntdSwitch} from 'antd';

export default class Switch extends ABaseComponent{
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state = this.props;	
	}
	componentDidMount() {
		super.componentDidMount();
	}
	
	onChange = (checked) => {
		this.setState({checked: checked});
		if (this.props.onChange) {
			this.props.onChange(checked,this);
		}
	}
	
	createContent() {
	    return (
	    	<AntdSwitch {...this.state} onChange={this.onChange}/>
	    );
	}
}
