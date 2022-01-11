import MyTable from './Table';
import { Table ,ConfigProvider} from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
export default class Grid extends MyTable {

	onRowDoubleClick = (record, index) => {
		if (this.props.onRowDoubleClick) {
			this.props.onRowDoubleClick(record, index);
		}
	}

	createContent() {
		let newChild = this.dealChild();
		let scroll = this.getScroll(this.state);
		const { selectedRowKeys, selectedRows, dataSource } = this.state;
		let gridData= dataSource;
 		if (gridData) {
 			this.setKey(gridData);	
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
			<Table
				id={this.props.id}
				scroll={scroll}
				rowSelection={rowSelection}
				components={this.components}
				dataSource={gridData}
				pagination={this.props.showPagination ? this.state.pagination : false}
				loading={this.state.loading}
				tableLayout={this.props.tableLayout}
				onChange={this.handleTableChange}
				rowClassName={this.handleRowClassName}
				title={this.props.gridTitle ? this.handleTitle : undefined}
				bordered={this.props.resizable ? true : this.props.bordered}
				expandable = {{
					expandedRowRender: this.props.expandedRowRender || undefined
				}}
				onRow={(record, index) => {
					return {
						onClick: this.onRowClick.bind(this, record, index),
						onDoubleClick: this.onRowDoubleClick.bind(this, record, index)
					}
				}}
			>
				{newChild}
			</Table>
			</ConfigProvider>
		);
	}
}
