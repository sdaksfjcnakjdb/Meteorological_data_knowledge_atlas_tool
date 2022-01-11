import ABaseComponent from '../../ABaseComponent';
import { Statistic as AntdStatistic } from 'antd';

const AntdCountdown = AntdStatistic.Countdown;

export default class Countdown extends ABaseComponent {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		super.componentDidMount();
	}

	createContent() {
		return (
			<AntdCountdown {...this.state} id={this.props.id}>
			</AntdCountdown>
		);
	}
}
