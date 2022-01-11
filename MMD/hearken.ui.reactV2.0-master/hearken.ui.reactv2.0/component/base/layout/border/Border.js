import ABaseComponent from '../../../ABaseComponent';
import {Layout} from 'antd';

export default class Border extends ABaseComponent{
	
	createContent() {
		return (
			<Layout {...this.state} id={this.props.id} style={{height: "100vh"}}>
				{this.props.children}
			</Layout>
		)
	}
	
}