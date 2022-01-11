import ABaseComponent from '../../ABaseComponent';
import { Avatar as AntdAvatar } from 'antd';

export default class Avatar extends ABaseComponent {

	constructor(props) {
		super(props);
	}

	createContent() {
		let size = this.state.size;
		if (this.state.sizeNum) {
			size = this.state.sizeNum;
		}
		return (
			<AntdAvatar {...this.state} id={this.props.id} size={size}>
				{this.state.text}
			</AntdAvatar>
		);
	}
}
