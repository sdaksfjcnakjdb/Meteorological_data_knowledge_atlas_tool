import ABaseComponent from '../../ABaseComponent';
import moment from 'moment';
import zhCN from 'antd/lib/locale/zh_CN';
import { DatePicker as AntdDatePicker, Tooltip, ConfigProvider } from 'antd';

export default class DatePicker extends ABaseComponent {

	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.state, {
			value: this.props.defaultValue ? moment(this.props.defaultValue) : this.props.value ? moment(this.props.value) : ""
		})
	}

	triggerChange = (changedValue) => {
		const { onChange } = this.props;
		if (onChange) {
			onChange(changedValue);
		}
	}

	componentWillReceiveProps(nextProps) {
		const controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
		}
	}

	handleOnOpenChange = (status) => {
		this.setState({ open: status });
		if (this.props.onOpenChange) {
			this.props.onOpenChange(status);
		}
	}

	handleChange = (date, dateString) => {
		this.triggerChange(date);
		this.setState({ value: date })
		if (this.props.onChange) {
			this.props.onChange(date, dateString);
		}
		this.props.editSave && this.props.editSave(dateString);
	}

	panelRender = (panelNode) => {
		if (this.props.panelRender) {
			return this.props.panelRender(panelNode)
		}
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
		let datePicker = <AntdDatePicker {...this.props} panelRender={this.props.panelRender ? this.panelRender : ""} disabled={this.state.disabled} value={this.state.value ? moment(this.state.value) : ""}
			onOpenChange={this.handleOnOpenChange} onChange={this.handleChange} showTime={this.props.showTime ? this.props.timeFormat ? { format: this.props.timeFormat } : {} : null} style={style} onBlur={this.onBlur}/>;
		if (this.props.tooltip) {
			return (
				<ConfigProvider locale={zhCN}>
					<Tooltip placement={this.props.tooltipPlacement} title={this.props.tooltip}>
						{datePicker}
					</Tooltip>
				</ConfigProvider>
			)
		}
		return (
			<ConfigProvider locale={zhCN}>
				{datePicker}
			</ConfigProvider>
		)
	}

}
