import ABaseComponent from '../../ABaseComponent';
import { Statistic as AntdStatistic } from 'antd';

export default class Statistic extends ABaseComponent {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
	}

	createContent() {
		return (
			<AntdStatistic {...this.state} id={this.props.id}>
			</AntdStatistic>
		);
	}
}
