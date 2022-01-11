import ABaseComponent from '../../ABaseComponent';
import {Affix as AntdAffix} from 'antd';

export default class Affix extends ABaseComponent{
	constructor(props) {
        super(props);
        this.state=this.props

    }
	
	createContent() {
		return(
			<AntdAffix {...this.state} id={this.props.id}>
				{this.state.children}
			</AntdAffix>		
		)
	}
}
