import React,{Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Col as AntdCol } from 'antd';
import { default as BaseUtil } from '../../util/BaseUtil';
import AntdFormItem from './FormField';
import FormUtil from './FormUtil';
import StyleDescribe from './describeForm.css';

const defaultClassName = "myFormItem-";

export default class FormFieldArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentDidMount() {
    
  }

  renderChildren = (children) => {
	let describeCss = this.props.describeCss ? StyleDescribe.formFieldAreaItem : "";
    return React.Children.map(children, child => {
      const name = child.props.name;
// const width = child.props.width;
      const width = "100%";
      if (name) {
        const { defaultValue = undefined, style, ...restProps } = child.props;
        const validatorRules = FormUtil.getFormItemValidatorRules(child);
        
        const { props, ...newChild } = child;
        newChild.props = restProps;
         if (!newChild.props.style) {
        	 newChild.props.style = {};
         }
         
        let display="";
        // 初略判断组件名是否为隐藏域
        if (newChild.props.type == "HiddenField") {
        	display="none";
        }
        
        return (<AntdCol span={24 / this.props.colNumber * newChild.props.column || 1} style={{ display: display }}>
		    <AntdFormItem className={classNames(defaultClassName + newChild.props.id, describeCss)} name={newChild.props.id} itemId={newChild.props.id} id={newChild.props.id} rules={validatorRules} initialValue={defaultValue} label={newChild.props.fieldLabel} labelWidth={this.props.labelWidth} inputWidth={newChild.props.inputWidth} extra={newChild.props.describe ? <div style={{ color: newChild.props.describeColor || "rgba(0,0,0,0.45)" }}>{newChild.props.describe}</div> : null} style={{ width: width }}>
		      {newChild}
		    </AntdFormItem>
		  </AntdCol>
		  )
      } else {
    	  return (<AntdCol span={24 / this.props.colNumber * child.props.column || 1}>
          <AntdFormItem className={classNames(defaultClassName + child.props.id, describeCss)} itemId={child.props.id} label={child.props.fieldLabel} labelWidth={this.props.labelWidth} inputWidth={child.props.inputWidth} extra={child.props.describe ? <div style={{ color: child.props.describeColor || "rgba(0,0,0,0.45)" }}>{child.props.describe}</div> : null} style={{ width: width }}>
            {React.cloneElement(child, { form: this.props.form, describeCss: this.props.describeCss })}
          </AntdFormItem>
        </AntdCol>
        )
      }
    });
  }

  render() {
    return (
      <Fragment style={this.style}>
	        {this.renderChildren(this.state.children)}
      </Fragment>
    );
  }
}

FormFieldArea.propTypes = {
  // 表单每行列数
  colNumber: PropTypes.number
}