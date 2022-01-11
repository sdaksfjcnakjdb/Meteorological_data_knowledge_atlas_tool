import ABaseComponent from '../../ABaseComponent';
import {Badge as AntdBadge} from 'antd';

export default class Badge extends ABaseComponent{
	
	constructor(props) {
		super(props);
	}
	
	changNum = (value) => {
		this.setState({count:value});
	}
	
	createContent() {
		let offset = [];
		if (this.props.offsetX) {
			offset = [this.props.offsetX];
		}
		if (this.props.offsetY) {
			offset.push(this.props.offsetY);
			if (!this.props.offsetX) {
				offset = [0, this.props.offsetY];
			}
		}
		return (
			<AntdBadge  {...this.state} dot={this.props.dot} offset={offset} overflowCount={this.props.overflowCount} showZero={this.props.showZero} size={this.props.size}>
				{this.props.children}
			</AntdBadge>
		);
	}
}
