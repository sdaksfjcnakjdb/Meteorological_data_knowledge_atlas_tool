import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DatePicker, Tooltip, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
const AntdRangePicker = DatePicker.RangePicker;

export default class RangePicker extends ABaseComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state, {
			value: this.props.defaultValue || this.props.value
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

    handleOnOpenChange = (status) => {
        this.setState({ open: status });
    }

    panelRender = (panelNode) => {
        if (this.props.panelRender) {
            this.props.panelRender(panelNode)
        }
    }

    onChange = (dates, dateStrings) => {
        this.props.onChange && this.props.onChange(dates, dateStrings);
		this.props.editSave && this.props.editSave(dateStrings);
    }

    onBlur = (e) => {
		// console.log(e.target.value);
	}

    createContent() {
        // moment()会对this.props.defaultValue进行容错处理,this.props.defaultValue是moment对象、时间字符串、undefined都没问题
        let value = this.state.value;
        let date1 = null;
        let date2 = null;
        if (value && typeof(value) == "string") {
            try {
                let arr = value.split(",")
                if (arr[0]) {
                    date1 = moment(arr[0]);
                }
                if (arr[1]) {
                    date2 = moment(arr[1]);
                }
                value = [date1, date2];
            } catch (err) {
                console.err(err);
            }
        }
        let datePicker = <AntdRangePicker {...this.props} {...this.state} value={value} panelRender={this.props.panelRender ? this.panelRender : ""}
            onOpenChange={this.handleOnOpenChange} onChange={this.onChange} onBlur={this.onBlur}/>;
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
