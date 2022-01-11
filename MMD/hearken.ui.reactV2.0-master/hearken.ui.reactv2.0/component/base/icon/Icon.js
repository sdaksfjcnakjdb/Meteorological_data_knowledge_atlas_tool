import ABaseComponent from '../../ABaseComponent';
import PropTypes from 'prop-types';
import { Icon as AntdIcon } from '@ant-design/compatible';

export default class Icon extends ABaseComponent {
	
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    createContent() {
        return (
            <AntdIcon {...this.state} id={this.props.id}/>
        );
    }

}