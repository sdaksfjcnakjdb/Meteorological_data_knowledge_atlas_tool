import ABaseComponent from '../../ABaseComponent';
import moment from 'moment';
import { DatePicker, Tooltip, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
const AntdMonthPicker = DatePicker.MonthPicker;

export default class MonthPicker extends ABaseComponent {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.state, {
      value: this.props.defaultValue ? moment(this.props.defaultValue) : this.props.value ? moment(this.props.value) : ""
    })
  }

  componentWillReceiveProps(nextProps) {
    const controlledValue = nextProps.value;
    if (controlledValue !== this.state.value) {
      this.setState({
        value: controlledValue,
      });
    }
  }

  handleChange = (month, monthString) => {
    this.setState({ value: month });
    if (this.props.onChange) {
      this.props.onChange(month, monthString);
    }
    this.props.editSave && this.props.editSave(monthString);
  }

  panelRender = (panelNode) => {
    if (this.props.panelRender) {
      this.props.panelRender(panelNode)
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
    let datePicker = <AntdMonthPicker {...this.props} {...this.state} panelRender={this.props.panelRender ? this.panelRender : ""} style={style} onChange={this.handleChange} onBlur={this.onBlur} />;
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