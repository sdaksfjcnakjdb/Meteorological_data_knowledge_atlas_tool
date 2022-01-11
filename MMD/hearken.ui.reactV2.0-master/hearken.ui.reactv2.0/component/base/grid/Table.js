import ABaseComponent from '../../ABaseComponent';
import { Table } from 'antd';
import reqwest from 'reqwest';
import classnames from 'classnames';
import { Resizable } from 'react-resizable';
import "./Grid.css";

const ResizeableTitle = props => {
	const { onResize, width, ...restProps } = props;
	if (!width) {
		return <th {...restProps} />;
	}

	return (
		<Resizable
			width={width}
			height={0}
			onResize={onResize}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th {...restProps} />
		</Resizable>
	);
};
export default class MyTable extends ABaseComponent {

	constructor(props) {
		super(props);
		this.url = props.url;
		if (this.props.dataSource)
			this.dataSource = this.props.dataSource;
	}

	componentDidMount() {
		super.componentDidMount(this)
		if (this.url) {
			this.fetch({ limit: this.state.pagination.limit });
		}
	}
	components = {
		header: {
			cell: ResizeableTitle,
		},
	};
	state = {
		dataSource: this.props.dataSource || [],
		pagination: {
			defaultPageSize: this.props.defaultPageSize || 10,
			pageSize: this.props.defaultPageSize || 10,
			limit: this.props.defaultPageSize || 10,
			size: this.props.pageSize || 'default',
			showSizeChanger: this.props.showSizeChanger,
			showQuickJumper: this.props.showQuickJumper,
			showTotal: (total) => { return `共${total}条` }
		},
		loading: false,
		children: this.props.children,
		scrollX: this.props.scrollX,
		scrollY: this.props.scrollY
	};

	handleTableChange = (pagination, filters, sorter) => {
		if (this.props.isAsync && this.props.tableChange) { // 表格改变事件
			this.props.tableChange(pagination, filters, sorter);
			return;
		}
		if (this.dataSource) {
			this.setState({ dataSource: this.dataSource, pagination: Object.assign({}, this.state.pagination, pagination) });
			return;
		}
		this.setState({
			pagination: Object.assign({}, this.state.pagination, pagination)
		});
		if (this.url) {
			var params = {
				pageChange: true,
				start: (pagination.current - 1) * pagination.pageSize,
				limit: pagination.pageSize,
				sortField: sorter.field,
				sortOrder: sorter.order,
				...filters
			};
			params = Object.assign({}, this.params, params);
			this.fetch(params);
		}
	}

	// 行单击事件
	onRowClick = (record, index) => {
		if (!this.props.rowSelection) { // 非复选框时单击行
			this.setState({selectedRows: [record], selectedRowKeys: [record.key]});
		} else { // 复选框时单击行
			let selectedRows = this.state.selectedRows ? this.state.selectedRows.slice(0) : [];
			let selectedRowKeys = this.state.selectedRowKeys ? this.state.selectedRowKeys.slice(0) : [];
			if (selectedRowKeys.indexOf(record.key) == -1) {
				selectedRowKeys.push(record.key);
				selectedRows.push(record);
			} else {
				let index = selectedRowKeys.indexOf(record.key);
				selectedRowKeys.splice(index, 1);
				selectedRows.splice(index, 1);
			}
			if (!this.editing) { // 可编辑表格在编辑时点击行不改变复选框状态
				this.setState({selectedRows: selectedRows, selectedRowKeys: selectedRowKeys});
			}
		}
		if (this.props.onRowClick && !this.rowClickDisabled) {
			this.props.onRowClick(Object.assign({}, record), index);
		}
		this.rowClickDisabled = undefined;
	}

	getGridData = (method, params) => {
		if (this.props.isAsync) {
			reqwest({
				url: this.url,
				method: method,
				data: {
					...params
				},
				type: 'json'
			}).then((data) => {
				const pagination = { ...this.state.pagination };
				pagination.total = data.count;
				this.setPageSizeOptions(pagination);
				this.setState({
					selectedRowKeys: [],
					selectedRows: [],
					loading: false,
					dataSource: data.data,
					pagination,
				});
				if (this.props.loadFunc) {
					this.props.loadFunc(data, params);
				}
			});
		} else {
			if (params.limit) {
				delete params.limit;
			}
			if (!params || !params.pageChange) {
				params.start = 0;
				reqwest({
					url: this.url,
					method: method,
					data: {
						...params
					},
					type: 'json'
				}).then((data) => {
					const pagination = { ...this.state.pagination };
					pagination.total = data.count;
					this.setPageSizeOptions(pagination);
					this.setState({
						selectedRowKeys: [],
						selectedRows: [],
						dataSource: data.data,
						loading: false,
						pagination,
					});
					this.dataSource = data.data;
					if (this.props.loadFunc) {
						this.props.loadFunc(data, params);
					}
				});
			}
		}
	}

	fetch = (params = {}) => {
		if (this.props.showLoading == null || this.props.showLoading)
			this.setState({ loading: true });

		if (this.url.lastIndexOf(".json") != -1) {
			this.getGridData('get', params);
		} else {
			this.getGridData('post', params);
		}

	}

	reload = (url, params) => {
		if (url) {
			this.url = url;
		}
		const pager = { ...this.state.pagination };
		if (!params || !params.savePage) {
			pager.current = 1;
		}
		this.setState({
			pagination: pager
		});
		this.dataSource = null;
		this.rowModify = null;
		this.mode = null;
		if (pager.current) {
			params = Object.assign({}, params, {
				start: (pager.current - 1) * pager.pageSize,
				limit: pager.limit
			});
		}
		if (params && params.loadWidthOldParams) {
			params = Object.assign({}, this.params || {}, params);
		}
		this.fetch(params);
		this.params = params;
	}

	setPageSizeOptions = (pagination) => {
		if (this.props.defaultPageSize) {
			let defaultPageSize = this.props.defaultPageSize;
			if (defaultPageSize < 10) {
				defaultPageSize = "" + defaultPageSize;
				pagination.pageSizeOptions = [defaultPageSize, "10", "20", "30", "40"];
			}
			if (defaultPageSize > 10 && defaultPageSize < 20) {
				defaultPageSize = "" + defaultPageSize;
				pagination.pageSizeOptions = ["10", defaultPageSize, "20", "30", "40"];
			}
			if (defaultPageSize > 20 && defaultPageSize < 30) {
				defaultPageSize = "" + defaultPageSize;
				pagination.pageSizeOptions = ["10", "20", defaultPageSize, "30", "40"];
			}
			if (defaultPageSize > 30 && defaultPageSize < 40) {
				defaultPageSize = "" + defaultPageSize;
				pagination.pageSizeOptions = ["10", "20", "30", defaultPageSize, "40"];
			}
			if (defaultPageSize > 40) {
				defaultPageSize = "" + defaultPageSize;
				pagination.pageSizeOptions = ["10", "20", "30", "40", defaultPageSize];
			}
		}
	}

	saveInsert(data) {// 保存新增行信息
		this.rowModify = this.rowModify || [];
		data.$MODE = 'insert';
		this.rowModify.push(data);
	}
	
	saveDelete(data) {
		this.rowModify = this.rowModify || [];
		for (let index = 0; index < data.length; index++) {
			if (this.rowModify.length !== 0) {
				let dataExist = false;
				for (let i = 0; i < this.rowModify.length; i++) {
					if (this.rowModify[i].id === data[index].id) {
						if (this.rowModify[i].$MODE === 'update') {
							this.rowModify[i].$MODE = 'delete';
						}
						if (this.rowModify[i].$MODE === 'insert') {
							this.rowModify.splice(i, 1);
						}
						dataExist = true;
						break;
					}
				}
				if (dataExist) {
					continue;
				}
			}
			data[index].$MODE = 'delete';
			this.rowModify.push(data[index])
		}
	}

	changeData(params) {
		if (!params.pagination) {
 	 		const pagination = { ...this.state.pagination };
 			pagination.total = params.dataSource.length;
 			params.pagination = pagination;
 		}
		if (params.dataSource) {
			params.dataSource = params.dataSource.slice(0);
 	 		this.dataSource = params.dataSource.slice(0);
 		} else {
 			this.dataSource = null;
 		}
 		this.setState(params);
 		this.dataSource = params.dataSource;
 		this.url = null;
	}

	getData(data) {
		return this.state[data];
	}

	handleRowClassName = (record, index) => {
		let rowClassName = "";
		if (!this.props.rowSelection && this.state.selectedRowKeys && this.state.selectedRowKeys.indexOf(record.key) != -1) {
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

	handleTitle = (currentPageData) => {
		if (this.props.gridTitle) {
			return this.props.gridTitle;
		}
		return undefined;
	}

	getChildElement = (child) => {
		if (child.props.hidden) {
			return React.cloneElement(child, { style: {display: "none"} })
		}
		if (child.props.type == "merge") { // 合并表格列
			var dataSource = this.state.dataSource;
			var pagination = this.state.pagination; // 获取表格分页信息
			var newDataSource = dataSource;
			if (this.props.showPagination) {
				var current = 1;
				if (pagination.current) {
					current = pagination.current;
				}
				newDataSource = dataSource.slice((current - 1) * pagination.limit, current * pagination.limit); // 取得当前页数据
			}
			let rowSpans = this.getRowSpans(newDataSource, child.props.dataIndex);
			child = React.cloneElement(child, {
				render: (value, row, index) => {
					const obj = { children: value, props: {} };
					if (rowSpans && rowSpans.length > 0) {
						obj.props.rowSpan = rowSpans[index];
					}
					return obj;
				}
			});
		}
		if (child.props.sort) {
			if (this.props.isAsync) {
				return React.cloneElement(child, { sorter: true });
			}
			return React.cloneElement(child, {
				sorter: (a, b) => {
					if (child.props.sortFunction) { // 自定义排序函数
						return child.props.sortFunction(a[child.props.dataIndex], b[child.props.dataIndex]);
					}
					return this.compare(a[child.props.dataIndex], b[child.props.dataIndex]);
				}
			});
		}
		if (child.props.type == "editable") {
			const {children, ...newProps} = child.props;
			child = React.cloneElement(child.type, {...newProps, onCell: (record, rowIndex) => ({
				record,
				dataIndex: child.props.dataIndex,
				title: child.props.title,
				input: children,
				type: child.props.type,
				handleSave: this.onCellChange(rowIndex, child.props.dataIndex),
				editBefore: child.props.editBefore,
				editAfter: child.props.editAfter
			})});
		}
		return child;
	}
	handleResize = (index, width) => (e, { size }) => {
		let widths
		if (size.width) {
			let children = this.state.children;
			this.setState(({ children }) => {
				const nextColumns = [...children];
				nextColumns[index] = React.cloneElement(nextColumns[index], { width: size.width })
				this.setState({ children: nextColumns })
			});
		}
	};
	
	dealChild = () => {
		let _this = this;
		let newChild;
		let children = this.state.children;
		if (children != null) {
			if (children.length > 0) {
				//遍历列
				newChild = children.map(function (child, index) {
					if (_this.props.resizable) {
						let onHeaderCell = column => ({
							width: column.width,
							onResize: _this.handleResize(index, column.width),
						})
						let childs = React.cloneElement(child, { onHeaderCell: onHeaderCell })
						return _this.getChildElement(childs);
					} else {
						return _this.getChildElement(child);
					}
				});
			} else {
				return _this.getChildElement(children);
			}
		}
		return newChild;
	}

	setKey = (gridData) => {
 		gridData.map((data) => {
 			if (!data.id && !data.ID) {
 				var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
 				var id = "";
 				for (var i = 0; i < 32; i++) {
 					id += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
 				}
 				data.id = id;
 			}
 			data.key = data.id || data.ID;
 		});
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

	compare = (a, b) => {
		if (a > b) {
			return 1;
		}
		if (a < b) {
			return -1;
		}
		return 0;
	}

	getCheckboxProps = (record) => {
		if (this.props.getCheckboxProps) {
			return this.props.getCheckboxProps(record);
		}
		return {};
	}

	selectRowChange = (selectedRowKeys, selectedRows) => {// 选择行变化
		this.setState({ selectedRowKeys, selectedRows });
		if (this.props.rowOnChange) {
			this.props.rowOnChange(selectedRowKeys, selectedRows);
		}
	}

}