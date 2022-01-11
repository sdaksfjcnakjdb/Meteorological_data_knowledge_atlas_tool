import React from 'react';
import Input from '../input/Input';
import { Input as AntdInput, Tooltip, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';

export default class BrowseSelect extends Input {

	ontrigger = () => {
		if (this.props.ontrigger != null) {
			this.props.ontrigger();
		}
	};

	createContent() {
		let input = <AntdInput  {...this.props} {...this.state} className={classNames(this.props.className, "ant-input-search", "ant-input-search-default")} onChange={this.onChanges}
			onBlur={this.onBlur} 
			addonAfter={<Button className={classNames("ant-input-search-button")} icon={<SearchOutlined />} onClick={this.ontrigger} disabled={this.state.disabled} />} />

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
