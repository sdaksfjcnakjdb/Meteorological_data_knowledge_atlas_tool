import { Table } from 'antd';
import ABaseComponent from '../../ABaseComponent';
import reqwest from 'reqwest';
import classnames from 'classnames';

import {
	isString as fp_isString,
	isEmpty as fp_isEmpty,
	cloneDeep as fp_cloneDeep,
	size as fp_size,
	unset as fp_unset,
	get as fp_get,
	forEach as fp_forEach,
	memoize as fp_memoize,
	map as fp_map,
	pull as fp_pull,
	indexOf as fp_indexOf,
	filter as fp_filter,
	find as fp_find,
	difference as fp_difference
} from 'lodash/fp';

const rootEventKey = 'ROOTROOTROOT';

const type = 'GridTree';

const rootData = {
    "checkbox": false,
    "checked": false,
    "children": [],
    "data": {
        "id": rootEventKey,
        "text": ""
    },
    "id": rootEventKey,
    "leaf": false,
    "text": ""
};

export default class GridTree extends ABaseComponent {

	constructor(props) {
		super(props);
		this.extData = {
			currentNodeData: {}
		};
        
        this.state = Object.assign({}, this.state, {
            dataSource: this.props.hasRoot ? [rootData] : [],
            expandedRowKeys: this.props.defaultExpandedRowKeys || [],
            selectedRowKeys: this.props.defaultSelectedRowKeys || [],
			loading: false
        });
		this.dataSource = this.state.dataSource;
		// 缓存化的getFlatData函数,要正确的使用,则相关数据应该是immutable的,目前还未找出不适用的场景
		this.memoizeFlatData = fp_memoize(this.getFlatData).bind(this);
		// 缓存化的getAllKeys函数,要正确的使用,则相关数据应该是immutable的,目前还未找出不适用的场景
		this.memoizeAllKeys = fp_memoize(this.getAllKeys).bind(this);
		this.type = type;
        if (this.props.hasRoot) {
            rootData.text = this.props.defaultRootName;
            rootData.leaf = false;
        }
	}

	getNewTreeData = () => {
		this.setState({ selectedRows: [], selectedRowKeys: [] });
		// 优先解析静态数据源
		if (this.props.dataSource) {
			if (Object.prototype.toString.call(this.props.dataSource) === '[object Array]') {
				let dataSource = this.props.dataSource;
                if (this.props.hasRoot) {
                    rootData.children = this.props.dataSource;
                    dataSource = [rootData];
                }
                this.dataSource = dataSource;
				this.setState({ dataSource: dataSource });
				// 是否需要展开所有的树节点
				this.props.defaultExpandAllRows && this.handleExpandAll(true);
			}
			return;
		}

		// 解析动态数据源
		const url = this.props.dataSourceDynamic;
		if (!url)
			return;
		if (url.lastIndexOf(".json") != -1) {
			this.getTreeData('get', url, {});
		} else {
			this.getTreeData('post', url, {});
		}
	}

	getTreeData = (method, url, params) => {
		this.setState({ loading: true });
		reqwest({
			url: url,
			method: method,
			data: params,
			type: 'json'
		}).then((data) => {
			const treeTableData = this.getAntdGridTreeData(data);

			let dataSource = treeTableData;
			if (this.props.hasRoot) {
				rootData.children = treeTableData;
				dataSource = [rootData];
			}
			this.dataSource = dataSource;
			this.setState({ dataSource: dataSource, loading: false });
			// 是否需要展开所有的树节点
			this.props.defaultExpandAllRows && this.handleExpandAll(true);
			if (this.props.loadFunc) {
				this.props.loadFunc(data, params);
			}
		});
	}

	// 得到异步的树的数据
	getAsyncTreeData = (params, record) => {
		const url = this.props.dataSourceDynamic;
		reqwest({
			url: url,
			method: 'post',
			data: {
				TREEASYNC: true,
				...params
			},
			type: 'json'
		}).then((data) => {
			if (record) {
				record.children = data;
				if (data) {
					for (var i = 0, length = data.length; i < length; i++) {
						if (data[i].leaf == false) {
							data[i].children = [];
						} else if (data[i].leaf == true) {
							data[i].children = undefined;
						}
					}
				} else {
					data = undefined;
				}
				this.setState({
					dataSource: [...this.state.dataSource],
				});
				return;
			}

			for (var i = 0, length = data.length; i < length; i++) {
				if (data[i].leaf == false) {
					var a = [];
					data[i].children = a;
				} else if (data[i].leaf == true) {
					data[i].children = undefined;
				}
			}
			this.setState({
				dataSource: data,
			});

		});
	}

	getAntdGridTreeData = (data) => {
		let selectedRowKeys = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i].children && data[i].children.length !== 0) {
				data[i].children = this.getAntdGridTreeData(data[i].children);
			}
			data[i] = Object.assign(data[i], data[i].data);
			data[i] = Object.assign(data[i], { key: data[i].id });
			if (data[i].data.checked) {
				selectedRowKeys.push(data[i].id);
			}
		}
		if (selectedRowKeys && selectedRowKeys.length > 0) {
			this.setState({ selectedRowKeys: selectedRowKeys });
		}
		return data;
	}

	// 重新加载
	reloadTreeData = (url, params) => {
		this.setState({ selectedRows: [], selectedRowKeys: [] });
		this.extData.currentNodeData = {};
		this.extData.checkedDatas = [];
		this.extData.checkedDatas1 = [];
		if (!fp_isString(url) || fp_isEmpty(url)) {
			this.getNewTreeData();
		} else {
			if (url.lastIndexOf(".json") != -1) {
				this.getTreeData('get', url, params);
			} else {
				this.getTreeData('post', url, params);
			}
		}
	}

	// 得到扁平化的数据
	getFlatData = (data, path) => {
		if (!fp_isString(path) || path.length === 0)
			return;
		let rs = [];
		// 避免修改原始数据
		const newData = fp_cloneDeep(data);
		// 递归
		const loop = fp_forEach(function (value) {
			var children = fp_get(path)(value);
			if (fp_size(children)) {
				loop(children);
			}
			rs.push(fp_unset(path)(value));
		});
		loop(newData);
		return rs;
	}

	// 得到单个数据
	getNodeData = (id) => {
		// 得到扁平化的数据
		const flatData = this.memoizeFlatData(this.state.dataSource, 'children');
		return fp_find(['id', id])(flatData);
	}

	// 得到所有数据
	getAllNodeData = (id) => {
		// 得到扁平化的数据
		return this.memoizeFlatData(this.state.dataSource, 'children');
	}

	// 得到所有的keys
	getAllKeys = (data) => {
		// 得到扁平化的数据
		const flatData = this.memoizeFlatData(data, 'children');
		const keys = fp_map(value => value.id)(flatData);
		return keys;
	}

	getAllSelectedData = () => {
		const flatData = this.memoizeFlatData(this.state.dataSource, 'children');
		const selectedRowKeys = this.state.selectedRowKeys;
		const checkedDatas = fp_filter((value) => fp_indexOf(value.id)(selectedRowKeys) + 1)(flatData);
		return checkedDatas;
	}

	////点击展开事件
	handleExpand = (expanded, record) => {
		const key = record.id;
		// 关闭展开的行
		if (!expanded) {
			this.setState(prevState => ({
				expandedRowKeys: fp_pull(key)(prevState.expandedRowKeys)
			}));
		} else { // 展开关闭的行
			this.setState(prevState => {
				const expandedRowKeys = prevState.expandedRowKeys;
				return {
					expandedRowKeys: [
						...expandedRowKeys,
						key
					]
				};
			});
		}
		// 如果是根结点且需要异步加载则异步加载
		if (key == rootEventKey && this.props.isAsync) {
			this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' }, record);
		} else if (this.props.isAsync) {
			this.getAsyncTreeData({ BELONGTO: key, node: key }, record);
		}
	}

	handleExpandedRowsChange = (expandedRows) => {
		// 展开的行有了变化
	}

	handleExpandAll = (isExpandAll) => {
		// 关闭树
		if (!isExpandAll) {
			this.setState({ expandedRowKeys: [] });
			return;
		}
		// 展开树
		const AllKeys = [
			...this.memoizeAllKeys(this.state.dataSource, "children"),
			rootEventKey
		];
		this.props.hasRootNode && AllKeys.push(rootEventKey);

		this.setState({ expandedRowKeys: AllKeys });
	}

	handleRowClick = (record, index, event) => {
		this.extData.currentNodeData = { ...this.getNodeData(record.id) };
		this.props.onRowClick(record, index, event);
	}

	handleRowDoubleClick = (record, index, event) => {
		this.props.onRowDoubleClick(record, index, event);
	}

	handleRowRender = (data) => {
		this.props.onTreeNodeRender(data);
	}

	handleSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys });
	}

	componentDidMount() {
		if (!this.props.hasRoot || !this.props.isAsync) {
			this.getNewTreeData();
		}
		if (this.props.isAsync && this.props.hasRoot) {
			this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' });
		}
		if (this.props.isAsync && this.props.hasRoot) {
			this.setState({ treeTableData: [rootData] });

		}
		super.componentDidMount();

	}

	dealChild() {
		return this.state.children;
	}

	handleRowClassName = (record, index) => {
		let rowClassName = "";
		if (this.state.selectedRowKeys && this.state.selectedRowKeys.indexOf(record.key || record.id) !== -1) {
			rowClassName = "ant-table-row-selected";
		}
		if (this.props.rowClassName) {
			if (rowClassName !== "") {
				rowClassName = rowClassName + " ";
			}
			rowClassName = rowClassName + this.props.rowClassName(record, index);
		}
		return rowClassName;
	}

	getScroll = (props) => {
		let scrollX = props.scrollX;
		let scroll = {};
		if (scrollX != null) {
			scroll.x = parseInt(scrollX);
		}
		let scrollY = props.scrollY;
		if (scrollY != null) {
			scroll.y = parseInt(scrollY);
		}
		return scroll;
	}

	handleTitle = (currentPageData) => {
		if (this.props.gridTitle) {
			return this.props.gridTitle();
		}
		return undefined;
	}

	createContent() {
		const { selectedRowKeys, selectedRows, dataSource, expandedRowKeys } = this.state;
		let newChild = this.dealChild();

		// 修正数据格式
		const loop = data => data.forEach((item, index, arr) => {
			// 当非rootNode的children属性为空数组的时候置为undefined
			if (item.id !== rootEventKey && item.children && item.children.length === 0)
				arr[index].children = undefined;

			// 不为空时,递归
			if (item.children && item.children.length !== 0)
				loop(arr[index].children);
		}
		);
		if (!this.props.isAsync) {
			loop(dataSource);
		}

		let scrollX = this.getScroll(this.state);
		
		let rowSelection;
		if (this.props.rowSelection) {
			rowSelection = {
				fixed: this.props.selectionFixed,
				columnWidth: this.props.selectionWidth,
				checkStrictly: this.props.checkStrictly,
				selectedRowKeys,
				selectedRows,
				onChange: (selectedRowKeys, selectedRows) => {
					this.setState({ selectedRowKeys, selectedRows });
					if (this.props.rowOnChange) {
						this.props.rowOnChange(selectedRowKeys, selectedRows);
					}
				},
				onSelect: (record, selected, selectedRows) => {
					let selectedRowKeys = [];
					selectedRows.forEach((item, index, arr) => {
						selectedRowKeys.push(item.id);
					});
					const allDatas = this.memoizeFlatData(this.state.dataSource, 'children');
					this.extData.checkedDatas = fp_filter(function (value) {
						return fp_indexOf(value.id)(selectedRowKeys) + 1;
					})(allDatas);
					this.setState({ selectedRowKeys, selectedRows });
					if (this.props.onSelect)
						this.props.onSelect(record, selected, selectedRows);
				},
				onSelectAll: (selected, selectedRows, changeRows) => {
					let selectedRowKeys = [];
					selectedRows.forEach((item, index, arr) => {
						selectedRowKeys.push(item.id);
					});
					const allDatas = this.memoizeFlatData(this.state.dataSource, 'children');
					this.extData.checkedDatas = fp_filter(function (value) {
						return fp_indexOf(value.id)(selectedRowKeys) + 1;
					})(allDatas);
					this.setState({ selectedRowKeys, selectedRows });
					if (this.props.onSelectAll)
						this.props.onSelectAll(selected, selectedRows, changeRows);
				},
			};
		}
		return (
			<Table
				id={this.props.id}
				loading={this.state.loading}
				scroll={scroll}
				dataSource={dataSource}
				rowSelection={rowSelection}
				rowKey={record => record.key || record.id || record.ID}
				pagination={false}
				tableLayout={this.props.tableLayout}
				title={this.props.gridTitle ? this.handleTitle : undefined}
				bordered={this.props.bordered}
				rowClassName={this.handleRowClassName}
				showHeader={this.props.showHeader}
				expandable = {{
					expandedRowKeys: expandedRowKeys,
					onExpandedRowsChange: this.handleExpandedRowsChange,
					onExpand: this.handleExpand
				}}
				onRow={(record, index) => {
					return {
						onClick: this.handleRowClick.bind(this, record, index),
						onDoubleClick: this.handleRowDoubleClick.bind(this, record, index)
					}
				}}>
				{newChild}
			</Table>
		);
	}
}