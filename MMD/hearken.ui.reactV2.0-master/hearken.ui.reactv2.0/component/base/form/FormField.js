import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { Form as AntdForm } from 'antd';

const AntdFormItem = AntdForm.Item;
const defaultClassName = "myFormItem-";

export default class FormField extends React.Component {
  constructor(props) {
    super(props);
    this.id = this.props.itemId;
  }
  
  styleChange=()=>{
	var item = document.getElementsByClassName(defaultClassName + this.id);
	if (item && item.length > 0) {
		if (item[0].firstChild) {
			if (item[0].firstChild.className.indexOf("ant-form-item-label") != -1) {
				if (this.props.labelWidth) {
					let width = ""+this.props.labelWidth;
					if (width.indexOf("%") == -1) {
						width = width + "px";
					}
					item[0].firstChild.style.setProperty('width',width,'important')
				}
			}
			if (item[0].firstChild.className.indexOf("ant-form-item-control-wrapper") != -1) {
				if (this.props.inputWidth) {
					let width = ""+this.props.inputWidth;
					if (width.indexOf("%") == -1) {
						width = width + "px";
					}
					item[0].firstChild.style.width = width;
				} else {
					if (this.props.labelWidth) {
						let width = ""+this.props.labelWidth;
						if (width.indexOf("%") == -1) {
							width = width + "px";
						}
						item[0].firstChild.style.width = "calc(100% - " + width + ")";
						item[0].firstChild.style.maxWidth = "calc(100% - " + width + ")";
					}
				}
			}
		}
		if (item[0].lastChild) {
			if (this.props.inputWidth) {
				let width = ""+this.props.inputWidth;
				if (width.indexOf("%") == -1) {
					width = width + "px";
				}
				item[0].lastChild.style.width = width; 
			} else {
				if (this.props.labelWidth) {
					let width = ""+this.props.labelWidth;
					if (width.indexOf("%") == -1) {
						width = width + "px";
					}
					item[0].lastChild.style.width = "calc(100% - " + width + ")";
					item[0].lastChild.style.maxWidth = "calc(100% - " + width + ")";
				}
			}
		}
	}
  }
  componentDidMount() {
	this.styleChange()
  }
  componentDidUpdate(){
	this.styleChange()
  }
  render() {
    return <AntdFormItem  {...this.props}  className={this.props.className}>{this.props.children}</AntdFormItem>;
  }
}

FormField.propTypes = {
  // label标签的文本
  label: PropTypes.string
}
FormField.defaultProps = {

}