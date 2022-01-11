import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import {Mentions as AntdMention} from 'antd';

export default class Mention extends ABaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props
        }
    }

    componentDidMount() {
        super.componentDidMount(this);
    }

    createContent() {
        var data = this.state;
        return (
            <AntdMention {...data} style={this.props.style}/>
        );
    }

}

Mention.propTypes = {
    // 建议内容
    suggestions: PropTypes.array,
    // 默认值
    defaultValue: PropTypes.string,
    // 触发字符
    prefix: PropTypes.string,
    // 占位符
    placeholder: PropTypes.string,
    // 建议框位置
    placement: PropTypes.string,
    // 未找到内容时
    notFoundContent: PropTypes.string,
    // 输入框内容变化时回调
    onChange: PropTypes.func,
    // 下拉框选择建议时回调
    onSelect: PropTypes.func
}

Mention.defaultProps = {
    suggestions: [],
    defaultValue: "",
    prefix:'@',
    placeholder: "",
    placement:"",
    notFoundContent:"",
    onChange: (contentState) => {
        console.log('onChange', toString(contentState));
    },
    onSelect: (suggestion) => {
        console.log('onSelect', suggestion);
    }
}