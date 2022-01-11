import ABaseComponent from '../../ABaseComponent';
import {Divider as AntdDivider} from 'antd';

export default class Divider  extends ABaseComponent{
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state = this.props;
	}

	createContent() {
		
		return (
			<AntdDivider {...this.state} id={this.props.id}>
				{this.state.text}
			</AntdDivider>
		);
	}
}
