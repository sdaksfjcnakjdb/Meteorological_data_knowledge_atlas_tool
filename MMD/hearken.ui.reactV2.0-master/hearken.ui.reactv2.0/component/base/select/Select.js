import React from 'react';
import ABaseComponent from '../../ABaseComponent';
import { Select as AntdSelect, Tooltip, Divider, Checkbox } from 'antd';
import reqwest from 'reqwest';
import styles from './select.css';

import {
	map as fp_map
} from 'lodash/fp';

const Option = AntdSelect.Option;

let timeout;

export default class Select extends ABaseComponent {
	constructor(props) {
		super(props);
		this.selectData = undefined;
		let defaultValue = '';
		this.state = Object.assign({}, props);
		this.state = Object.assign(this.state, defaultValue);
	}
	defaultFormatData = (data) => {
		for (var i = 0; i < data.length; i++) {
			data[i].key = data[i].code;
			data[i].value = data[i].text;
		}
		return data;
	}

	/**
	   * 必须的方法 格式化数据的方法,默认是将核格平台的数据转换成支持的数据.
	   * 如果this.props.formatData存在,将直接使用this.props.formatData来转换数据
	   * 否则调用defaultFormatData
	   *
	   * @param {array}
	   *            data 数据
	   */
	formatData = (data) => {
		if (typeof this.props.formatData === 'function') {
			return this
				.props
				.formatData(data);
		}
		return this.defaultFormatData(data);
	}

	reload = (url, data) => {
		if (url.lastIndexOf(".json") != -1) {
			this.asyncData('get', url, data);
		} else {
			this.asyncData('post', url, data);
		}
	}

	/**
	   * 必须的方法 异步请求数据并更新state相关部分
	   */
	asyncData = (method, url, data) => {
		reqwest({
			url: url,
			method: method,
			data: data,
			type: 'json'
		}).then((data) => {
			let length = this.props.dataLength || 300;
			let dataSource = data.data;
			if (!dataSource) {
				dataSource = data;
			}

			this.allKeys = this.getAllKeys(dataSource);

			// 对可查询下拉列表数据特殊处理，只加载前300条数据，防止数据量过多导致渲染时卡顿
			if (this.props.showSearch) {
				if (dataSource.length > length) {
					let dataSourceTemp = [];
					for (var i = 0; i < length; i++) {
						dataSourceTemp.push(dataSource[i]);
					}
					dataSourceTemp.push({ code: "disabled", text: "...", disabled: "true" })
					dataSource = dataSourceTemp;
				}
			}
			this.setState({ dataSource: this.formatData(this.addBlankRow(dataSource)) })
			if (this.props.loadFunc) {
				this.props.loadFunc(this.formatData(this.addBlankRow(dataSource)));
			}
		});
	}

	getAllKeys = (data) => {
		//提取出keys
		const keys = fp_map(function (value) {
			return "" + value.code;
		})(data);
		return keys;

	}

	/**
	   * 必须的方法 初始化取得数据
	   */
	initData = () => {
		// 判断数据源的类型
		if (this.props.dynamicUrl) {
			// console.log('Select加载动态数据源');
			// 如果有动态数据源
			const url = this.props.dynamicUrl;
			if (url.lastIndexOf(".json") != -1) {
				this.asyncData('get', url, this.state.requestBody);
			} else {
				this.asyncData('post', url, this.state.requestBody);
			}


		} else if (this.props.staticDataSource) {
			// console.log('Select加载静态数据源');
			// 如果有静态数据源
			this.allKeys = this.getAllKeys(this.props.staticDataSource);
			this.setState({
				dataSource: this.formatData(this.addBlankRow(this.props.staticDataSource))
			});
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

	handleChange = (value, option) => {
		this.selectData = this.getSelectData(option);
		if (this.props.onChange) {
			this.props.onChange(value, option, this.selectData);
		}
		if (!this.props.checkAll) {
			this.setState({
				value: value,
				option: option,
			});
		} else {
			this.setState({
				value: value,
				option: option,
				checkAllCheckbox: value.length === this.allKeys.length,
				indeterminate: value.length > 0 && value.length !== this.allKeys.length
			});
		}
		if (this.props.mode != "multiple" && this.props.mode != "tags")
			this.props.editSave && this.props.editSave(undefined, this.getSelectData(option));
	}

	getSelectData = (option) => {
		if (option) {
			let dataSource = this.state.dataSource;
			let index = _.findIndex(dataSource, function (data) { return data.code == option.key; });
			if (index != -1) {
				return dataSource[index];
			} else {
				return undefined;
			}
		}
		return undefined;
	}

	getSelectData1 = (value) => {
		let dataSource = this.state.dataSource;
		let index = _.findIndex(dataSource, function (data) { return data.code == value });
		if (index != -1) {
			return dataSource[index];
		} else {
			return undefined;
		}
	}

	handleSearch = (value) => {
		if (this.props.onSearch) {
			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}
			let props = this.props;
			setTimeout(function () {
				props.onSearch(value);
			}, 300);
		}
	}


	dv = '';
	componentWillMount() {
		const dV = this.props.defaultValue;
		if (typeof dV == 'number') {//如果传入的初始值是数字的话，将其转化为字符串
			this.dv = dV.toString();
			this.setState({
				defaultValue: this.dv
			});
		} else {
			this.dv = dV;
			this.setState({
				defaultValue: this.dv
			});
		}
	}

	componentDidMount() {
		super.componentDidMount(this);
		this.initData();
	}

	renderOptions = (data = []) => {
		let _this = this;
		return data.map(function (item, index) {
			if (item.disabled) {
				return <Option disabled key={item.key} title={item.value}>{item.value}</Option>
			}
			return <Option key={item.key} title={item.value}>{item.value}</Option>
		}
		);
	}

	addBlankRow = (dataSource) => {
		if (!this.props.fieldRequired && this.props.blankRow && dataSource.indexOf(this.props.blank) == -1) {
			dataSource.splice(0, 0, this.props.blank);
		}
		return dataSource;
	}

	triggerChange = changedValue => {
		const { onChange } = this.props;
		if (onChange) {
			onChange(changedValue);
		}
	};

	onCheckAllChange = (e) => {
		this.triggerChange(e.target.checked ? (this.allKeys || []) : []);
		this.setState({
			value: e.target.checked ? (this.allKeys || []) : [],
			indeterminate: false,
			checkAllCheckbox: e.target.checked,
		});
	}

	filterSort = (optionA, optionB) => {
		if (this.props.filterSort) {
			this.props.filterSort(optionA, optionB)
		}
	}

	dropdownRenderHandle = (menu) => {
		return (
			<div>
				{menu}
				{
					this.props.checkAll && (this.props.mode === "multiple" || this.props.mode === "tags") ? (
						<div onMouseDown={e => e.preventDefault()}>
							<Divider style={{ margin: '4px 0' }} />
							<Checkbox
								indeterminate={this.state.indeterminate}
								onChange={this.onCheckAllChange}
								checked={this.state.checkAllCheckbox}
								style={{ marginBottom: '4px', marginLeft: '8px' }}
							>
								全选
					        </Checkbox>
						</div>
					) : null
				}
			</div>
		)
	}

	onBlur = (e) => {
		this.props.onBlur && this.props.onBlur(e);
		this.props.editSave && this.props.editSave();
	}

	createContent() {
		if (this.props.value) {
			this.selectData = this.getSelectData1(this.props.value);
		}
		const options = this.renderOptions(this.state.dataSource);
		let allowClear = this.props.allowClear;
		if (this.props.fieldRequired) {
			allowClear = false;
		}
		let select = <AntdSelect {...this.props} defaultValue={this.state.defaultValue} filterSort={this.filterSort}
			getPopupContainer={this.props.getPopupContainer} value={this.state.value}
			onChange={this.handleChange} onSearch={this.handleSearch} disabled={this.state.disabled}
			allowClear={allowClear} showSearch={this.props.showSearch || false} optionFilterProp={this.props.optionFilterProp || "value"}
			dropdownClassName={styles.select} mode={this.props.mode} dropdownRender={this.dropdownRenderHandle}
			filterOption={this.props.filterOption} notFoundContent={this.props.notFoundContent} showArrow={this.props.showArrow} onBlur={this.onBlur}>
			{options}
		</AntdSelect>;
		if (this.state.tooltip) {
			return (
				<Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
					{select}
				</Tooltip>
			)
		}
		return (
			<React.Fragment>
				{select}
			</React.Fragment>
		)
	}

}
Select.defaultProps = {
	blank: { code: " ", text: "" }
}