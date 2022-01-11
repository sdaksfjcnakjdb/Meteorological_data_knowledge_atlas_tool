import ABaseComponent from '../../ABaseComponent';
import { List as AntdList } from 'antd';
import reqwest from 'reqwest';

export default class List extends ABaseComponent {

	constructor(props) {
		super(props);
		this.url = props.url;
		this.state = {
			dataSource: this.props.dataSource || [],
			pagination: {
				defaultPageSize: props.defaultPageSize || 10,
				pageSize: props.defaultPageSize || 10,
				limit: props.defaultPageSize || 10,
				size: props.pageSize || 'default',
				showSizeChanger: props.showSizeChanger,
				showQuickJumper: props.showQuickJumper,
				onChange: this.handlePageChange,
				onShowSizeChange: this.handleSizeChange,
				showTotal:(total) => {return `共${total}条`}
			},
			loading: false
		};
	}

	componentDidMount() {
		super.componentDidMount(this)
		if (this.url) {
			if (this.url.lastIndexOf(".json") != -1) {
				this.fetch('get', {});
			} else {
				this.fetch('post', {
					limit: this.state.pagination.limit
				});
			}
		}
	}

	handlePageChange = (page, pageSize) => {
		if (this.props.pageChange) {
			this.props.pageChange(page,pageSize);
			return;
		}
		const pagination = { ...this.state.pagination };
		pagination.current = page;
		pagination.pageSize = pageSize;
		pagination.limit = pageSize;
		this.setState({
			pagination: pagination
		});
		let params = {
			start: (page - 1) * pageSize,
			limit: pageSize
		}
		if (this.url) {
			this.fetch("post", params);
		}
	}

	handleSizeChange = (current, size) => {
		const pagination = { ...this.state.pagination };
		pagination.current = current;
		pagination.pageSize = size;
		pagination.limit = size;
		this.setState({
			pagination: pagination
		});
		let params = {
			start: (current - 1) * size,
			limit: size
		}
		this.fetch("post", params);
	}

	fetch = (method, params = {}) => {
		this.setState({ loading: true });
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
			this.setState({
				loading: false,
				dataSource: data.data,
				pagination,
			});
			if (this.props.loadFunc) {
				this.props.loadFunc(data);
			}
		});
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

	reload = (url, params) => {
		if (url) this.url = url;
		const pager = { ...this.state.pagination };
		if (!params || !params.savePage) {
			pager.current = 1;
		}
		this.setState({
			pagination: pager
		});
		this.fetch("post", params);
		this.params = params;
	}

	handleRender = (item) => {
		if (this.props.render) {
			return this.props.render(item);
		}
		return null;
	}

	handleTitleRender = (item) => {
		if (this.props.titleRender) {
			return this.props.titleRender(item);
		}
		return null;
	}

	handleDescriptionRender = (item) => {
		if (this.props.descriptionRender) {
			return this.props.descriptionRender(item);
		}
		return null;
	}

	handleExtra = (item) => {
		if (this.props.extraRender) {
			return this.props.extraRender(item);
		}
		return null;
	}

	handleAvatar = (item) => {
		if (this.props.avatarRender) {
			return this.props.avatarRender(item);
		}
		return null;
	}
	handleClick = (item) => {
		if (this.props.click) {
			this.props.click(item)
		}
	}

	createContent() {
		const { dataSource } = this.state;
		this.setPageSizeOptions(this.state.pagination);
		if (dataSource) {
			dataSource.map((data) => {
				if (!data.id) {
					var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
					var id = "";
					for (var i = 0; i < 32; i++) {
						id += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
					}
					data.id = id;
				}
				data.key = data.id;
			});
		}
		let showPager = this.state.showPagination;
		if (this.props.showPagination) {
			if (dataSource.length == 0) {
				showPager = false;
			} else {
				showPager = true;
			}
		}
		return (
			<AntdList
				{...this.state}
				id={this.props.id}
				dataSource={dataSource}
				pagination={showPager ? this.state.pagination : false}
				renderItem={item => (
					<AntdList.Item
						id={item.id} key={item.key} actions={this.handleRender(item)} extra={this.handleExtra(item)} onClick={this.handleClick.bind(this, item)}>
						<AntdList.Item.Meta
							avatar={this.handleAvatar(item)}
							title={this.handleTitleRender(item) || item.title}
							description={this.handleDescriptionRender(item) || item.description} >
						</AntdList.Item.Meta>
					</AntdList.Item>
				)}>
			</AntdList>
		);
	}

}