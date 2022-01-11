import React from 'react';
import Input from './Input';
import { Input as AntdInput, Tooltip } from 'antd';

const Password = AntdInput.Password;

export default class InputPassword extends Input {

	createContent() {
		let input = <Password {...this.props} {...this.state} onChange={this.onChanges} onBlur={this.onBlur} onPressEnter={this.onPressEnter}>
			{this.props.children}
		</Password>;
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
