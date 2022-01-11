import ABaseComponent from '../../ABaseComponent';
import { DatePicker, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

export default class YearPicker extends ABaseComponent {

	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.state, {
			value: this.props.defaultValue ? moment(this.props.defaultValue) : this.props.value ? moment(this.props.value) : ""
		})
	}

	componentWillReceiveProps(nextProps) {
		var controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
		}
	}

	panelRender = (panelNode) => {
		if (this.props.panelRender) {
			this.props.panelRender(panelNode)
		}
	}

	handleOpenChange = (status) => {
		this.setState({ open: status })
	}

	handleChange = (year, yearString) => {
		this.setState({ value: year })
		if (this.props.onChange) {
			this.props.onChange(year, yearString);
		}
		this.props.editSave && this.props.editSave(yearString);
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
		let yearPicker = <DatePicker {...this.props} panelRender={this.props.panelRender ? this.panelRender : ""} disabled={this.state.disabled} value={this.state.value} open={this.state.open}
			picker="year" onOpenChange={this.handleOpenChange} onChange={this.handleChange} style={style} onBlur={this.onBlur} />
		if (this.props.tooltip) {
			return (
				<ConfigProvider locale={zhCN}>
					<Tooltip placement={this.props.tooltipPlacement} title={this.props.tooltip}>
						{yearPicker}
					</Tooltip>
				</ConfigProvider>
			)
		}
		return (
			<ConfigProvider locale={zhCN}>
				{yearPicker}
			</ConfigProvider>
		)
	}
}