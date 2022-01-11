import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import { Checkbox as AntdCheckbox } from 'antd';
const AntdCheckboxGroup = AntdCheckbox.Group;

export default class CheckboxGroup extends ABaseComponent {
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

  createContent() {
    const { name,options, ...params } = this.state;
    let newOptions = options.map(function(option,index) {
    	option.label = option.text;
    	option.value = option.code;
    	return option;
    });
    return <div>
      <AntdCheckboxGroup {...params} options={newOptions} disabled={this.state.disabled}/>
      </div>
  }
}

CheckboxGroup.propTypes = {
  // 选项
  options: PropTypes.array,
  // 整组禁选
  disabled: PropTypes.bool,
  // 默认选中项
  defaultValue: PropTypes.array,
  // 选项变化事件
  onChange: PropTypes.func,
  // name属性，用于表单
  name: PropTypes.string
}

CheckboxGroup.defaultProps = {
  disabled: false,
  defaultValue: [],
  options: [],
  onChange: (checkedValues) => {
    // console.log('checked = ', checkedValues);
  }
}