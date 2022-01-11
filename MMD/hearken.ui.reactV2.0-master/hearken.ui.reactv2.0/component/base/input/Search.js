import React from 'react';
import Input from './Input';
import { Input as AntdInput } from 'antd';

const Search = AntdInput.Search;

export default class InputSearch extends Input {

	createContent() {
		let input = <Search {...this.props}  {...this.state} onChange={this.onChanges}>
			{this.props.children}
		</Search>;
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
