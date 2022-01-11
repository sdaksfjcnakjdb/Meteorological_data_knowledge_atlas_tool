import ABaseComponent from '../../../ABaseComponent';
import {Layout} from 'antd';
const Header = Layout.Header;
export default class BorderContent extends ABaseComponent{
	
	createContent() {
		return (
			<Header {...this.state} id={this.props.id} style={{height:this.props.height+"px"}}>
				{this.props.children}
			</Header>
		)
	}
	
}