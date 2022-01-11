import React from 'react';
import ABaseComponent from '../../ABaseComponent';
import { InputNumber as InputInt, Tooltip } from 'antd';

export default class InputNumber extends ABaseComponent {
	constructor(props) {
		super(props);
	}
	//通过父组件改变props是调用
	componentWillReceiveProps(nextProps) {
		const controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
		}
	}

	componentDidMount() {
		super.componentDidMount();
	}

	onChanges = (e) => {
		let v = e;
		this.setState({
			value: v
		});
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}

	onStep = (value, info) => {
		if (this.props.onStep) {
			this.props.onStep(value, info);
		}
	}

	onPressEnter = (e) => {
		this.props.onPressEnter && this.props.onPressEnter(e);
		this.props.editSave && this.props.editSave();
	}

	onBlur = (e) => {
		this.props.onBlur && this.props.onBlur(e);
		this.props.editSave && this.props.editSave();
	}

	createContent() {
		let inputNumber = <InputInt {...this.props} {...this.state} onChange={this.onChanges} onStep={this.onStep} max={this.props.maxNum} min={this.props.minNum} onBlur={this.onBlur} onPressEnter={this.onPressEnter}>
			{this.props.children}
		</InputInt>;
		if (this.state.tooltip) {
			return (
				<Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
					{inputNumber}
				</Tooltip>
			);
		}
		return (
			<React.Fragment>
				{ inputNumber }
			</React.Fragment>
		);
	}
}
