import ABaseComponent from '../../ABaseComponent';
import {Collapse as AntdCollapse} from 'antd';

const AntdPanel = AntdCollapse.Panel;

export default class CollapsePanel extends ABaseComponent{
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<AntdPanel {...this.state} id={this.props.id}>
				{this.state.render || this.state.content || this.state.children}
			</AntdPanel>
		);
	}
}

