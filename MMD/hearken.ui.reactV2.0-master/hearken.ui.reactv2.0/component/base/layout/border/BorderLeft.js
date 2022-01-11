import ABaseComponent from '../../../ABaseComponent';
import {Layout} from 'antd';
const Sider = Layout.Sider;

export default class BorderLeft extends ABaseComponent{
	
	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.state, {
			collapsed: this.props.defaultCollapsed || false
		});
	}
	
	handlerOnCollapse = (collapsed, type) => {
		this.setState({collapsed: collapsed});
		if (this.props.onCollapse) {
			this.props.onCollapse(collapsed, type);
		}
	}
	
	
	
	createContent() {
		let triggerRender = undefined;
		if (this.props.triggerRender) {
			triggerRender = this.props.triggerRender();
		}
		
		return (
			<Sider {...this.state} id={this.props.id} onCollapse={this.handlerOnCollapse} trigger={triggerRender || this.props.trigger}>
				{this.props.children}
			</Sider>
		)
	}
	
}