import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form as AntdForm, Col as AntdCol } from 'antd';
import AntdFormItem from './FormField';
import FormUtil from './FormUtil';
import "./form.css";
import StyleDescribe from './DescribeForm.css';

const defaultClassName = "myFormItem-";

export default class Form extends ABaseComponent {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  componentDidMount() {
    super.componentDidMount(this);
    if (this.props.describeCss) {
      let labels = $(".ant-form-item-label");
      for (let i = 0; i < labels.length; i++) {
        let formItem = labels[i].parentElement;
        let children = formItem.children;
        children[0].style["line-height"] = children[1].clientHeight - 15 + "px";
      }
    }
  }

  renderChildren = (children) => {
    return React.Children.map(children, child => {
      const name = child.props.name;
      const width = child.props.width;
      //const width = "100%";
      if (name) {
        const { defaultValue = undefined, style, ...restProps } = child.props;
        const validatorRules = FormUtil.getFormItemValidatorRules(child);

        const { props, ...newChild } = child;
        newChild.props = restProps;
        if (!newChild.props.style) {
          newChild.props.style = {};
        }

        let display;
        //初略判断组件名是否为隐藏域
        if (newChild.props.type == "HiddenField") {
          display = "none";
        }
        return (<AntdCol span={24 / this.props.colNumber * newChild.props.column || 1} style={{ display: display }}>
          <AntdFormItem className={defaultClassName + newChild.props.id} name={newChild.props.id} itemId={newChild.props.id} id={newChild.props.id} rules={validatorRules} initialValue={defaultValue} label={newChild.props.fieldLabel} labelWidth={this.props.labelWidth} inputWidth={newChild.props.inputWidth} extra={newChild.props.describe ? <div style={{ color: newChild.props.describeColor || "rgba(0,0,0,0.45)" }}>{newChild.props.describe}</div> : null} style={{ width: width }}>
            {newChild}
          </AntdFormItem>
        </AntdCol>
        )
      } else {
        return (<AntdCol span={24 / this.props.colNumber * child.props.column || 1}>
          <AntdFormItem className={defaultClassName + child.props.id} itemId={child.props.id} label={child.props.fieldLabel} labelWidth={this.props.labelWidth} inputWidth={child.props.inputWidth} extra={child.props.describe ? <div style={{ color: child.props.describeColor || "rgba(0,0,0,0.45)" }}>{child.props.describe}</div> : null} style={{ width: width }}>
            {React.cloneElement(child, { form: this.props.form, describeCss: this.props.describeCss, layout: this.props.layout })}
          </AntdFormItem>
        </AntdCol>
        )
      }
    });
  }

  createContent() {
    let describeCss = this.props.describeCss ? StyleDescribe.describeForm : "";
    if (this.props.layout == "horizontal" || this.props.layout == "vertical") {
      this.style = {
        display: "-webkit-box",
        display: "-ms-flexbox",
        display: "flex",
        "-ms-flex-wrap": "wrap",
        flexWrap: "wrap"
      }
    }
    return (
      <div className="form">
        {this.props.title ? <div className="form-title" style={{ padding: "16px 0" }}>{this.props.title}</div> : ""}
        <AntdForm className={classNames("ant-advanced-search-form", describeCss)} {...this.props} ref={this.formRef} onFinish={this.state.onSubmit} style={this.style}>
          {this.renderChildren(this.state.children)}
        </AntdForm>
      </div>
    );
  }
}

Form.propTypes = {
  // 布局
  layout: PropTypes.string,
  // 数据验证成功后回调事件
  onSubmit: PropTypes.func,
  // 表单每行列数
  colNumber: PropTypes.number
}

Form.defaultProps = {
  layout: "inline"
}