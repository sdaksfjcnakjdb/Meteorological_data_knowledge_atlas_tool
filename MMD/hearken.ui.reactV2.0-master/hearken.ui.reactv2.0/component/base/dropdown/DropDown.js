import ABaseComponent from '../../ABaseComponent';
import fp from 'lodash/fp';
import classNames from 'classnames';
import reqwest from 'reqwest';
import { Menu as AntdMenu, Dropdown as AntdDropdown } from 'antd';

const { SubMenu, Item } = AntdMenu;
const AntdDropdownButton = AntdDropdown.Button;

export default class Dropdown extends ABaseComponent {
	state = {
		requestBody: {},
		dataSource: [],
		onClick: this.props.onClick
	}

	//异步请求数据并更新state相关部分
	asyncData = (url, data) => {
		reqwest({
			url: url,
			method: "post",
			data: data,
			type: 'json'
		}).then((data) => {
			this.setState({
				dataSource: data
			});
		});
	}

	//初始化取得数据
	initData = () => {
		//判断数据源的类型
		if (this.props.dynamicDataSource) {
			//如果有动态数据源
			this.asyncData(this.props.dynamicDataSource, this.state.requestBody);
		} else if (this.props.staticDataSource) {
			//如果有静态数据源
			this.setState({
				dataSource: this.props.staticDataSource
			});
		}
	}

	// 渲染下拉菜单的内容
	renderOverlay = (data = []) => {
		if (data.length > 0) {
			const renderMenuNodes = (data) => {
				return data.map(item => {
					if (fp.isArray(item.children) && !fp.isEmpty(item.children)) {
						return (
							<SubMenu
								key={item.id}
								title={(
									<span>
										<span>{item.text}</span>
									</span>
								)}>
								{this.renderMenuNodes(item.children)}
							</SubMenu>
						)
					} else {
						return (
							<Item key={item.id} itemData={item}>
								<span>
									<span>{item.text}</span>
								</span>
							</Item>
						);
					}
				})
			}

			return (
				<AntdMenu mode="inline" onClick={this.props.menuClick}>
					{renderMenuNodes(data)}
				</AntdMenu>
			);
		}
		return (
			<AntdMenu style={{ display: "none" }}>
			</AntdMenu>
		);
	}

	componentDidMount() {
		super.componentDidMount(this)
		this.initData();
	}

	render() {
		const overlay = this.renderOverlay(this.state.dataSource);
		return (
			<div className={classNames(this.props.className)}>
				<AntdDropdown {...this.state} overlay={overlay} placement={this.props.placement} trigger={this.props.trigger} onVisibleChange={this.props.onVisibleChange}>
					{this.props.children}
				</AntdDropdown>
			</div>
		)
	}

}
