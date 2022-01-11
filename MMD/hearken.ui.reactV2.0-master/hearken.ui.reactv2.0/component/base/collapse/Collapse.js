import ABaseComponent from '../../ABaseComponent';
import { Collapse as AntdCollapse } from 'antd';

const Panel = AntdCollapse.Panel;

export default class Collapse extends ABaseComponent {

	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.state, {
			activeKey: this.props.defaultActiveKey
		});
	}

	createContent() {
		return (
			<AntdCollapse {...this.state} id={this.props.id}>
				{this.state.children}
			</AntdCollapse>
		);
	}

} 