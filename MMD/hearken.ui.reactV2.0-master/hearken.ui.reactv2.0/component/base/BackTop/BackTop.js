import ABaseComponent from '../../ABaseComponent';
import {BackTop  as AntdBackTop } from 'antd';

export default class BackTop extends ABaseComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }
    createContent() {
        return (
        	<AntdBackTop {...this.props}/>
        );
    }
}
