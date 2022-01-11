import ABaseComponent from '../../ABaseComponent';
import { Pagination as AntdPagination } from 'antd';

export default class Pagination extends ABaseComponent {

	constructor(props) {
		super(props);
		this.state = Object.assign({}, this.state, {
			current: this.props.defaultCurrent || 1,
			pageSize: this.props.pageSize || 10
		})
	}

	getPageSizeOptions = () => {
		if (this.state.pageSize) {
			let defaultPageSize = this.state.pageSize;
			if (defaultPageSize < 10) {
				return [defaultPageSize, 10, 20, 30, 40];
			}
			if (defaultPageSize > 10 && defaultPageSize < 20) {
				return [10, defaultPageSize, 20, 30, 40];
			}
			if (defaultPageSize > 20 && defaultPageSize < 30) {
				return [10, 20, defaultPageSize, 30, 40];
			}
			if (defaultPageSize > 30 && defaultPageSize < 40) {
				return [10, 20, 30, defaultPageSize, 40];
			}
			if (defaultPageSize > 40) {
				return [10, 20, 30, 40, defaultPageSize];
			}
		}
		return [10, 20, 30, 40];
	}

	componentDidMount() {
		super.componentDidMount(this);
	}

	handleShowTotal = (total) => {
		return `共${total}条`
	}

	handleOnChange = (page, pageSize) => {
		if (this.props.onChange) {
			this.props.onChange(page, pageSize);
		}
		this.setState({current: page, pageSize: pageSize});
	}

	handleOnShowSizeChange = (current, size) => {
		if (this.props.onShowSizeChange) {
			this.props.onShowSizeChange(current, size);
		}
		this.setState({current: current, pageSize: size});
	}

	createContent() {
		let pageSizeOptions = this.getPageSizeOptions();
		return (
			<AntdPagination  {...this.state} id={this.props.id} hideOnSinglePage={this.props.hideOnSinglePage} pageSizeOptions={pageSizeOptions} 
				responsive={this.props.responsive} simple={this.props.simple} size={this.props.size} showTotal={this.handleShowTotal} onChange={this.handleOnChange} onShowSizeChange={this.handleOnShowSizeChange}/>
		);
	}
}
