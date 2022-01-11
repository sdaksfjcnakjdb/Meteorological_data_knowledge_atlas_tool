import React from 'react';
import ABaseComponent from '../../ABaseComponent';
import { TimePicker as AntdTimePicker, Tooltip, ConfigProvider } from 'antd';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';

export default class TimePicker extends ABaseComponent {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps) {
		const controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
		}
	}

	onChange = (time, timeString) => {
		this.setState({ value: time });
		this.props.onChange && this.props.onChange(time, timeString);
		this.props.editSave && this.props.editSave(timeString);
	}

	onBlur = (e) => {
		this.props.editSave && this.props.editSave(e.target.value);
	}

	createContent() {
		let style = this.props.style;
		if (this.props.width) {
			style = Object.assign({}, style, { width: this.props.width });
		}
		if (this.props.height) {
			style = Object.assign({}, style, { width: this.props.height });
		}
		let timePicker = <AntdTimePicker {...this.props} value={this.state.value ? moment(this.state.value, this.props.format) : ""} disabled={this.state.disabled} style={style} onChange={this.onChange} onBlur={this.onBlur}/>;
		if (this.props.tooltip) {
			return (
				<ConfigProvider locale={zhCN}>
					<Tooltip placement={this.props.tooltipPlacement} title={this.props.tooltip}>
						{timePicker}
					</Tooltip>
				</ConfigProvider>
			)
		}
		return (
			<ConfigProvider locale={zhCN}>
				{timePicker}
			</ConfigProvider>
		)
	}
}
