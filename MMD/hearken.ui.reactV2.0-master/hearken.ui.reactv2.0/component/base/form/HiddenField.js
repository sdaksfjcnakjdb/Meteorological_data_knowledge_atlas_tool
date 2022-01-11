import ABaseComponent from '../../ABaseComponent';
import { Input as AntdInput } from 'antd';

export default class HiddenField extends ABaseComponent {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    super.componentDidMount(this);
  }

  createContent() {
    return <AntdInput {...this.props} style={{display:'none'}}></AntdInput>;
  }
}