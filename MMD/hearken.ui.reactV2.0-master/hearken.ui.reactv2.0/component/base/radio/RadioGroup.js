import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import { Radio as AntdRadio } from 'antd';

const AntdRadioGroup = AntdRadio.Group;
const AntdRadioButton = AntdRadio.Button;

export default class RadioGroup extends ABaseComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount(this);
  }
  
  componentWillReceiveProps(nextProps) {
	    const controlledValue = nextProps.value;
	    if (controlledValue !== this.state.value) {
	        this.setState({
	            value: controlledValue,
	        });
	    }
  }


  onChange = (e) => {
	  this.setState({value:e.target.value});
	  if (this.props.onChange) {
		  this.props.onChange(e,e.target.value);
	  }
  }

  createContent() {
    let radioGroup = null;
	const {options, ...params} = this.state;
    if (this.props.radioType == "button") {
    	radioGroup = options.map((option, index) => (
    				<AntdRadioButton key={index} value={option.code}>{option.text}</AntdRadioButton>
    			))
    } else {
    	radioGroup = options.map((option, index) => (
						<AntdRadio key={index} value={option.code}>{option.text}</AntdRadio>
				))
    }
    return (
    		<div>
	    		<AntdRadioGroup {...params} disabled={this.state.disabled} onChange={this.onChange}>
	    			{radioGroup}
	    		</AntdRadioGroup>
    		</div>
	    )
  }
}

RadioGroup.propTypes = {
  // 选项
  options: PropTypes.array,
  // 禁选整组
  disabled: PropTypes.bool,
  // 整组单选框的name属性
  name: PropTypes.string,
  // 默认选中项
  defaultValue: PropTypes.string,
  // 按钮样式的大小
  size: PropTypes.string,
  // 按钮样式的风格
  buttonStyle: PropTypes.string,
  // 选项变化事件
  onChange: PropTypes.func
}

RadioGroup.defaultProps = {
  disabled: false,
  defaultValue: "",
  size: "",
  buttonStyle: "",
  options: []
}