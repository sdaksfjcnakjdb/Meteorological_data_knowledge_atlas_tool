import React from 'react';
import ComponentMap from './ComponentMap';
import Style from './component.css'
import PropTypes from 'prop-types';
import classnames from 'classnames';

//所有网页构件的父类
export default class ABaseComponent extends React.Component{
	constructor(props){
		super(props);
		//重新复制一个新的props,使其可以修改
		this.id = this.props.id;
		this.state = Object.assign({}, props);
		this.enableContainer=this.props.enableContainer==null?true:this.props.enableContainer;
		//初始化标准的样式 
		this.initCSS();
 		this.style = Object.assign({},this.props.style,{width:"100%",height:"100%"});
	}
	
	dealParams(config) {
		var wrapConfig = Object.assign({}, config);
		if (this.context!=null) {
			var params = this.context.params;
			if (params!=null) {
				for (var i in wrapConfig) {
					if ((typeof wrapConfig[i]) == "string" ) {
						if (wrapConfig[i].startsWith("$params")) {
							var content = wrapConfig[i].replace("$params.","");
							wrapConfig[i] = params[content];
						}
					}
					
		
				}
			}
		}
		
		return wrapConfig;
	}
	initCSS(){
		//去掉容器布局配置，防止传到子构件
		if(this.enableContainer){
			this.containerStyle={};
			if(this.props.style){
				if(this.props.style.position){
					this.containerStyle.position=this.props.style.position;
					delete this.props.style.position;
				}
				if(this.props.style.top){
					this.containerStyle.top=this.props.style.top;
					delete this.props.style.top;
				}
				if(this.props.style.left){
					this.containerStyle.left=this.props.style.left;
					delete this.props.style.left;
				}
				if(this.props.style.right){
					this.containerStyle.right=this.props.style.right;
					delete this.props.style.right;
				}
				if(this.props.style.bottom){
					this.containerStyle.bottom=this.props.style.bottom;
					delete this.props.style.bottom;
				}
			}
			//将width和height放到style中,自适应布局中应该没有这些东西
			//xc中的width→组件宽度
			if(this.props.width){
				if(this.props.width=="100%"){
					this.containerStyle.width="100%";
				}else{
					if (typeof(this.props.width) == "string") {
						if (this.props.width.indexOf("%") != -1 || this.props.width.indexOf("px") != -1) {
							this.containerStyle.width=this.props.width;
						} else {
							this.containerStyle.width=this.props.width + "px";
						}
					} else {
						this.containerStyle.width=this.props.width;
					}
				}
				this.props.style.width=this.props.width;
				//delete this.props.width;
			}
			//xc中的height→组件高度
			if(this.props.height){
				if(this.props.height=="100%"){
					this.containerStyle.height="100%";
				}else{
					if (typeof(this.props.height) == "string") {
						if (this.props.height.indexOf("%") != -1 || this.props.height.indexOf("px") != -1) {
							this.containerStyle.height=this.props.height;
						} else {
							this.containerStyle.height=this.props.height + "px";
						}
					} else {
						this.containerStyle.height=this.props.height;
					}
				}
				this.props.style.height=this.props.height;
				//delete this.props.height;
			}
			//xc中的color→字体颜色
			if(this.props.color){
				this.props.style.color=this.props.color;
				//delete this.props.color;
			}
			//边距
			if(this.props.paddingTop){
				this.containerStyle.paddingTop=this.props.paddingTop;
				//delete this.props.paddingTop;
			}
			if(this.props.paddingRight){
				this.containerStyle.paddingRight=this.props.paddingRight;
				//delete this.props.paddingRight;
			}
			if(this.props.paddingBottom){
				this.containerStyle.paddingBottom=this.props.paddingBottom;
				//delete this.props.paddingBottom;
			}
			if(this.props.paddingLeft){
				this.containerStyle.paddingLeft=this.props.paddingLeft;
				//delete this.props.paddingLeft;
			}
		}
	}

	componentWillMount(){
		
	}
	
	
	
	componentDidMount(){
		ComponentMap.put(this.id,this)
	}
	shouldComponentUpdate(nextProps, nextState) {
		//初略判断state是否存在改变
		if (Object.keys(this.state).length != Object.keys(nextState).length) {
			return true;
		}
		for (let s in this.state) {
			if (nextState[s]!=this.state[s]) {
				return true;
			}
		}
		//是否存在包装对象
		if (this.context!=null && this.context.params!=null) {
			return true;
		}
		return true;
	}
	componentWillUpdate(nextProps, nextState) {
		
	}
	//abstract
	createContent(){
		if (this.context!=null && this.context.params!=null) {
			var wrapConfig = this.dealParams(this.state)
			return this.createWrapContent(wrapConfig);
		}
		return this.createNormalContent();
	}
	createWrapContent() {
		return "";
	}
	createNormalContent() {
		return "";
	}
	render(){
		
		if(this.enableContainer){
			return (<div className={classnames(Style.container,this.props.className ? "hk-component-" + this.props.className : "")} style={this.containerStyle}>{this.createContent()}</div>)
		}else{
			return this.createContent()
		}
	}
}

ABaseComponent.contextTypes = {
		params: PropTypes.string
	}
