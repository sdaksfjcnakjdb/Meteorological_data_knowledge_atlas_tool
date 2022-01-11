import React from 'react';
import ABaseComponent from '../../ABaseComponent';
import reqwest from 'reqwest';
import { TreeSelect as AntdTreeSelect, ConfigProvider as AntdConfigProvider } from 'antd';

const rootEventKey = 'ROOTROOTROOT';

export default class TreeSelect extends ABaseComponent {

	constructor(props) {
		super(props);
		this.state = {
			value: this.props.defaultValue || this.props.value || []
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

	componentDidMount() {
		super.componentDidMount(this);
		this.initData();
	}

	onChange = (value, label, extra) => {
		if (this.props.onChange) {
			this.props.onChange(value, label, extra);
		};
		this.setState({ value });
		this.props.editSave && this.props.editSave();
	}

	asyncData = (method, url, data) => {
		reqwest({
			url: url,
			method: method,
			data: data,
			type: 'json'
		}).then((data) => {
			let treeData = data;
			this.formatData(treeData)
			this.setState({ treeData: treeData })
		});
	}

	formatData = (data) => {
		for (var i = 0; i < data.length; i++) {
			data[i].title = data[i].text;
			data[i].value = data[i].id;
			data[i].key = data[i].id;
			if (data[i].children) {
				this.formatData(data[i].children);
			}
		}
	}

	initData = () => {
		if (this.props.dynamicUrl) {
			// 如果有动态数据源
			this.url = this.props.dynamicUrl;
			if (this.props.isAsync) {
				this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' });
				return;
			}
			if (this.url.lastIndexOf(".json") != -1) {
				this.asyncData('get', this.props.dynamicUrl, this.state.requestBody);
			} else {
				this.asyncData('post', this.props.dynamicUrl, this.state.requestBody);
			}
		} else if (this.props.staticDataSource) {
			this.setState({
				treeData: this.props.staticDataSource // 如果有静态数据源
			});
		}
	}

	reload = (url, data) => {
		this.url = url;
		if (this.props.isAsync) {
			this.getAsyncTreeData(Object.assign({}, { BELONGTO: 'ROOT', node: 'ROOT' }, data));
			return;
		}
		if (url.lastIndexOf(".json") != -1) {
			this.asyncData('get', url, data);
		} else {
			this.asyncData('post', url, data);
		}
	}

	componentWillMount() {
		if (typeof this.props.defaultValue == 'number') {//如果传入的初始值是数字的话，将其转化为字符串
			this.setState({
				value: this.props.defaultValue.toString()
			})
		}
	}

	handleLoadData = (treeNode) => {
		return new Promise((resolve) => {
			if (!this.props.isAsync)
				return resolve();
			setTimeout(() => {
				if (treeNode.props.id == rootEventKey) {
					this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' }, treeNode);
				} else {
					let params = { BELONGTO: encodeURI(treeNode.props.id), node: encodeURI(treeNode.props.id) };
					if (this.props.customNodeKey) {
						let json = {};
						json[this.props.customNodeKey] = encodeURI(treeNode.props.id);
						params = Object.assign({}, params, json);
					}
					this.getAsyncTreeData(params, treeNode);
				}
				resolve();
			}, 1000);
		});
	}

	getAsyncTreeData = (params, treeNode) => {
		let _this = this;
		const url = this.url || this.props.dynamicUrl;
		reqwest({
			url: url,
			method: 'post',
			data: {
				TREEASYNC: true,
				...params
			},
			type: 'json'
		}).then((data) => {
			if (treeNode) {
				let childData = data;
				_this.formatData(childData);

				let treeData = _this.state.treeData.slice(0);
				_this.addTreeNodeData(treeNode.props.id, treeData, childData);
				_this.setState({ treeData: treeData });
				return;
			}

			let treeData = data;
			_this.formatData(treeData);
			_this.setState({ treeData: treeData })
		});
	}

	addTreeNodeData = (id, data, childData) => {
		if (data && data.length > 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].id == id) {
					data[i].children = childData;
					break;
				}
				if (data[i].children && data[i].children.length > 0) {
					this.addTreeNodeData(id, data[i].children, childData);
				}
			}
		}
	}

	onBlur = (e) => {
		this.props.onBlur && this.props.onBlur(e);
		this.props.editSave && this.props.editSave();
	}

	createContent() {
		let treeSelect = <AntdConfigProvider renderEmpty={this.props.renderEmpty}>
			<AntdTreeSelect {...this.props} treeData={this.state.treeData} onChange={this.onChange}
				getPopupContainer={this.props.getPopupContainer}
				value={this.state.value} allowClear={this.props.allowClear}
				disabled={this.state.disabled} style={{ width: "100%" }}
				loadData={this.handleLoadData} onBlur={this.onBlur}>
			</AntdTreeSelect>
		</AntdConfigProvider>;
		if (this.state.tooltip) {
			return (
				<Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
					{treeSelect}
				</Tooltip>
			);
		}
		return (
			<React.Fragment>
				{treeSelect}
			</React.Fragment>
		);
	}
}

