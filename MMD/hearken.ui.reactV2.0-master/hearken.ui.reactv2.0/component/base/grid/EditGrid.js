import React, { useState, useContext } from 'react';
import MyTable from './Table';
import { Table, ConfigProvider, Form } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import Style from './editColumn.css';
import FormUtil from '../form/FormUtil';
const EditableContext = React.createContext(null);

const AntdFormItem = Form.Item;

const defaultClassName = "editGridFormItem-";

export default class EditGrid extends MyTable {

	constructor(props) {
		super(props);
		this.url = props.dataSourceDynamic;
		this.editingKey = "";
		this.editRow = props.editRow;
		this.enableEdit = true;
	}

	EditableRow = ({ index, ...props }) => {
		const [form] = Form.useForm();
		return (
			<Form form={form} component={false}>
				<EditableContext.Provider value={form}>
					<tr {...props} />
				</EditableContext.Provider>
			</Form>
		);
	};

	EditableCell = ({
		title,
		input,
		children,
		dataIndex,
		record,
		handleSave,
		type,
		editBefore,
		editAfter,
		...restProps
	}) => {
		const [editing, setEditing] = useState(false);
		const form = useContext(EditableContext);

		const toggleEdit = () => {
			setEditing(!editing);
			editBefore && editBefore(record[dataIndex], record, dataIndex);
			form.setFieldsValue({
				[dataIndex]: record[dataIndex],
			});
		};

		const save = async (inputValue, selectData) => {
			try {
				const valid = await form.validateFields();
				const value = form.getFieldValue(dataIndex);
				setEditing(!editing);
				handleSave(inputValue ? inputValue : value);
				editAfter && editAfter(inputValue ? inputValue : value, record, dataIndex, selectData);
			} catch (errInfo) {
				console.log(errInfo);
			}
		};

		let childNode = children;
		this.editing = editing;
		childNode = editing && input && this.enableEdit ? (
			this.getInputChild(input, save, dataIndex)
		) : type == "editable" && this.enableEdit ? (
			<div className={Style["editable-cell-value-wrap"]} style={{ paddingRight: 24 }} onDoubleClick={toggleEdit}>
					{children}
			</div>
		) : (
			<React.Fragment>
				{children}
			</React.Fragment>
		);

		return <td {...restProps} className={Style["editable-cell"]}>{childNode}</td>;
	};

	getInputChild = (child, save, dataIndex) => {
		const name = child.props.name;
		if (name) {
			const { defaultValue = undefined, style, ...restProps } = child.props;
			const validatorRules = FormUtil.getFormItemValidatorRules(child);

			const { props, ...newChild } = child;
			newChild.props = restProps;
			if (!newChild.props.style) {
				newChild.props.style = {};
			}
			newChild.props.editSave = save;
			newChild.props.autoFocus = true;
			if (this.selectUrl && this.selectUrl[dataIndex]) {
				newChild.props.dynamicUrl = this.selectUrl[dataIndex];
				if (this.selectDataParams && this.selectDataParams[dataIndex]) {
					newChild.props.requestBody = this.selectDataParams[dataIndex];
				}
			}
			return (
				<AntdFormItem className={defaultClassName + newChild.props.id} name={newChild.props.id} rules={validatorRules} style={{ margin: 0 }}>
					{newChild}
				</AntdFormItem>
			)
		}
	}

	addProperty(key, value) {// 添加属性
		this[key] = value
	}

	onEditRowChange = (key) => { // 编辑行操作时编辑完成一个单元格的改变事件
		return (value) => {
			if (this.editingRow) {
				this.editingRow[key] = value;
			}
		}
	}

	onRowChange = (index, data) => {
		index = index + (this.currentIndex || 0);
		const dataSource = [...this.state.dataSource];
		dataSource[index] = data;
		this.saveModify(null, null, dataSource, index,);
		this.setState({ dataSource });
	}
	onCellChange = (index, key) => {
		return (value) => {
			index = index + (this.currentIndex || 0);
			const dataSource = [...this.state.dataSource];
			dataSource[index][key] = value;
			this.saveModify(key, value, dataSource, index,);
			this.setState({ dataSource });
		};
	}
	onCheckBoxChange = (index, key) => {
		return (e) => {
			index = index + (this.currentIndex || 0);
			var value = Number(e.target.checked)
			const dataSource = [...this.state.dataSource];
			dataSource[index][key] = value;
			this.saveModify(key, value, dataSource, index);
			this.setState({ dataSource });
		};
	}

	saveModify(key, value, data, index) {// 保存修改信息
		if (value === undefined) { return }
		this.rowIndex = index;
		let values = Object.assign({}, data[index]);
		this.cellDataIndex = key;
		this.cellModify = values;
		this.rowModify = this.rowModify || [];// 保存所有修改行信息
		if (this.rowModify.length !== 0) {
			for (let i = 0; i < this.rowModify.length; i++) {
				if (this.rowModify[i].id === values.id) {
					values.$MODE = this.rowModify[i]["$MODE"];
					this.rowModify[i] = values;
					return;
				}
			}
		}
		values.$MODE = 'update';
		this.rowModify.push(values);
	}

	render() {
		let components = Object.assign({}, this.components, {
			body: {
				row: this.EditableRow,
				cell: this.EditableCell,
			},
		});
		let newChild = this.dealChild();
		let scroll = this.getScroll(this.state);
		const { selectedRowKeys, selectedRows, dataSource } = this.state;
		if (dataSource) {
			this.setKey(dataSource);
		}
		let rowSelection;
		if (this.props.rowSelection) {
			rowSelection = {
				fixed: this.props.selectionFixed,
				columnWidth: this.props.selectionWidth,
				selectedRowKeys,
				selectedRows,
				onChange: this.selectRowChange,
				getCheckboxProps: this.getCheckboxProps
			};
		}
		return (
			<ConfigProvider locale={zhCN}>
				<Table id={this.props.id}
					scroll={scroll}
					dataSource={dataSource}
					components={components}
					rowSelection={rowSelection}
					rowClassName={this.handleRowClassName}
					pagination={this.props.showPagination ? this.state.pagination : false}
					loading={this.state.loading}
					tableLayout={this.props.tableLayout}
					bordered={this.props.resizable ? true : this.props.bordered}
					onChange={this.handleTableChange}
					title={this.props.gridTitle ? this.handleTitle : undefined}
					showHeader={this.props.showHeader}
					expandable={{
						expandedRowRender: this.props.expandedRowRender || undefined
					}}
					onRow={(record, index) => {
						return {
							onClick: this.onRowClick.bind(this, record, index)
						}
					}}
				>
					{newChild}
				</Table>
			</ConfigProvider>
		)
	}
}
