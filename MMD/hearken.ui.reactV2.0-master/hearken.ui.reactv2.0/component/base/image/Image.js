import ABaseComponent from '../../ABaseComponent';
import {Image as AntdImage} from 'antd';

export default class Image extends ABaseComponent{
	constructor(props) {
		super(props);
	}
	
	componentDidMount(){
		super.componentDidMount();
	}
	
	handleOnClick = () => {
		if (this.props.onClick) {
			this.props.onClick(this.props.text,this);
		}
	}

	createContent() {
		return (
			<AntdImage {...this.state} id={this.props.id} >
			</AntdImage>
		);
	}
}
