import ABaseComponent from '../../../ABaseComponent';
import {Layout} from 'antd';
const Content = Layout.Content;

export default class BorderContent extends ABaseComponent{
	
	createContent() {
		return (
			<Content {...this.state} id={this.props.id}>
				{this.props.children}
			</Content>
		)
	}
	
}