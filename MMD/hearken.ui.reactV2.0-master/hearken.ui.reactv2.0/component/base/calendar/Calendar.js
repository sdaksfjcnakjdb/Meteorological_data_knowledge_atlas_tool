import ABaseComponent from '../../ABaseComponent';
import {Calendar as AntdCalendar} from 'antd';
import moment from 'moment';

export default class Calendar extends ABaseComponent {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state, {
            value: this.props.defaultValue ? moment(this.props.defaultValue, this.props.format) : moment()
        });
    }

    handleOnChange = (date) => {
        if (this.props.onChange) {
            this.props.onChange(date, date.format(this.props.format));
        }
        this.setState({value: date});
    }

    handleOnPanelChange = (date, mode) => {
        if (this.props.onPanelChange) {
            this.props.onPanelChange(date, mode, date.format(this.props.format));
        }
        this.setState({value: date, mode: mode});
    }

    handleOnSelect = (date) => {
        if (this.props.onSelect) {
            this.props.onSelect(date, date.format(this.props.format));
        }
        this.setState({value: date});
    }
    
    createContent() {
        return (
        	<AntdCalendar {...this.state} validRange={this.state.validRange} onChange={this.handleOnChange} onPanelChange={this.handleOnPanelChange} onSelect={this.handleOnSelect}/>
        );
    }
}
