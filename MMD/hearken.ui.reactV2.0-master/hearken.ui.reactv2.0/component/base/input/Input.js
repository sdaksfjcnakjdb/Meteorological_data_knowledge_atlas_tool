import React from 'react';
import ABaseComponent from '../../ABaseComponent';
import { Input as AntdInput, Tooltip } from 'antd';
import Icon from "../icon/Icon"

export default class Input extends ABaseComponent {

	constructor(props) {
		let defaultValue = '';
		super(props);
		this.state = Object.assign({}, props);
		this.state = Object.assign(this.state, defaultValue);
	}

	componentWillReceiveProps(nextProps) {
		const controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
		}
	}

	onChanges = (e) => {
		let value = e.target.value;
		this.setState({
			value: value
		});
		if (this.props.onChange) {
			this.props.onChange(e, value);
		}
	}

	dv = '';
	componentWillMount() {
		const dV = this.props.value;
		if (typeof dV == 'number') {//如果传入的初始值是数字的话，将其转化为字符串
			this.dv = dV.toString();
			this.setState({
				value: this.dv
			});
		} else {
			this.dv = dV;
			this.setState({
				value: this.dv
			});
		}
	}

	onBlur = (e) => {
		this.props.onBlur && this.props.onBlur(e, e.target.value);
		this.props.editSave && this.props.editSave();
	}

	onPressEnter = (e) => {
		this.props.onPressEnter && this.props.onPressEnter(e, e.target.value);
		this.props.editSave && this.props.editSave();
	}

	createContent() {
		if (this.props.prefix) {
			this.prefix = <Icon type={this.props.prefix} />
		}
		if (this.props.suffix) {
			this.suffix = <Icon type={this.props.suffix} />
		}
		let input = <AntdInput {...this.props} {...this.state} onChange={this.onChanges} onBlur={this.onBlur} onPressEnter={this.onPressEnter}>
			{this.props.children}
		</AntdInput>;
		if (this.state.tooltip) {
			return (
				<Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
					{input}
				</Tooltip>
			);
		}
		return (
			<React.Fragment>
				{input}
			</React.Fragment>
		);
	}
}
