import ABaseComponent from '../../ABaseComponent';
import { Card as AntdCard } from 'antd';

export default class Card extends ABaseComponent {

	constructor(props) {
		super(props);

	}

	componentDidMount() {
		super.componentDidMount(this);
	}

	render() {
		return (
			<div {...this.state} id={this.props.id}>
				<AntdCard title={this.state.title}>
					{this.state.children}
				</AntdCard>
			</div>
		)
	}

}