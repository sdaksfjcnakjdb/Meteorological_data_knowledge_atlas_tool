import ABaseComponent from '../../ABaseComponent';
import zhCN from 'antd/lib/locale/zh_CN';
import { Cascader as AntdCascader, Tooltip, ConfigProvider } from 'antd';
import reqwest from 'reqwest';

export default class Cascader extends ABaseComponent {

	constructor(props) {
		super(props);
		let defaultValue = '';
		this.state = Object.assign({}, props);
		this.state = Object.assign(this.state, defaultValue);
	}

	componentDidMount() {
		super.componentDidMount();
		if (this.props.datasourcedynamic) {	// 动态数据源解析
			this.reload(this.props.datasourcedynamic)
		}
		if (this.props.expandIconRender) {
			this.expandIcon = this.props.expandIconRender()
		}
	}

	reload = (url, data) => {
		if (url.lastIndexOf(".json") != -1) {
			this.asyncData('get', url, data);
		} else {
			this.asyncData('post', url, data);
		}
	}

	asyncData = (method, url, data) => {
		reqwest({
			url: url,
			method: method,
			data: data,
			type: 'json'
		}).then((data) => {
			let options;
			if (data.data) {
				options = this.getCurrentTreeData(data.data);
			} else {
				options = this.getAntdCascaderData(data);
			}
			this.setState({
				options: options,
			});
		});

	}

	getAntdCascaderData = (data = []) => {
		const loop = data => data.map((item) => {
			if (item.children && item.children.length > 0) {
				item.children = loop(item.children);
			} else {
				item.children = undefined;
			}
			item.value = item.id;
			item.label = item.text;
			return item;
		});
		return loop(data);
	}

	//将数据源数据转换为正确的树结构数据
	getCurrentTreeData = (data) => {
		let resData = data;
		let tree = [];

		for (let i = 0; i < resData.length; i++) {
			if (!resData[i].belongto) {
				resData[i].value = resData[i].id;
				resData[i].label = resData[i].text;
				resData[i].children = [];
				tree.push(resData[i]);
				resData.splice(i, 1);
				i--;
			}
		}
		const run = data => data.forEach((item, index, arr) => {
			if (resData.length !== 0) {
				for (let i = 0; i < resData.length; i++) {
					if (item.id === resData[i].belongto) {
						if (resData[i].value) {
							resData[i].value = resData[i].value;
						} else {
							resData[i].value = resData[i].id;
						}
						if (resData[i].label) {
							resData[i].label = resData[i].label;
						} else {
							resData[i].label = resData[i].text;
						}
						resData[i].children = [];
						arr[index].children.push(resData[i]);
						resData.splice(i, 1);
						i--;
					}
				}
				run(arr[index].children);
			}
		});
		run(tree);
		return tree;
	}

	componentWillReceiveProps(nextProps) {
		const controlledValue = nextProps.value;
		if (controlledValue !== this.state.value) {
			this.setState({
				value: controlledValue,
			});
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

	dropdownRender = (menus) => {
		if (this.props.dropdownRender) {
			this.props.dropdownRender(menus)
		}
	}

	handleChange = (value, selectedOptions) => {
		this.props.onChange && this.props.onChange(value, selectedOptions);
		this.props.editSave && this.props.editSave();
	}

	// onBlur = (e) => {
	// 	this.props.onBlur && this.props.onBlur(e);
	// 	this.props.editSave && this.props.editSave();
	// }

	createContent() {
		let cascader = <AntdCascader {...this.state} id={this.props.id} dropdownRender={this.props.dropdownRender ? this.dropdownRender : ""} 
			getPopupContainer={this.props.getPopupContainer} defaultValue={this.state.defaultValue} onChange={this.handleChange}>
			{this.props.children}
		</AntdCascader>;
		if (this.state.tooltip) {
			return (
				<ConfigProvider locale={zhCN}>
					<Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
						{cascader}
					</Tooltip>
				</ConfigProvider>
			);
		}
		return (
			<ConfigProvider locale={zhCN}>
				{cascader}
			</ConfigProvider>
		);
	}
}
