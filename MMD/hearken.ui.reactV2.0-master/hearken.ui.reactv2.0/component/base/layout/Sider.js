import React,{Component} from 'react';
import ComponentMap from '../../ComponentMap';
import {Layout} from 'antd';
const AntdSider = Layout.Sider;
export default class Sider extends Component{
	
	constructor(props){
		super(props);
		this.id = this.props.id;
		this.state = Object.assign({}, props);
	}
	
	componentDidMount(){
		ComponentMap.put(this.id,this)
	}
	
	render() {
		return (
			<AntdSider {...this.props} id={this.props.id} collapsed={this.state.collapsed}>
				{this.props.children}
			</AntdSider>
		)
	}
	
}