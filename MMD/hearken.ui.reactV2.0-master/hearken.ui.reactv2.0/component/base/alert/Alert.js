import ABaseComponent from '../../ABaseComponent';
import {Alert as AntdAlert} from 'antd';
export default class Alert extends ABaseComponent {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }
     
    componentDidMount(){
        super.componentDidMount();
    }
   componentWillMount(){
    if(this.props.action){
        this.action=this.props.action()
    }
   }
    createContent() {
        return (
        	<AntdAlert {...this.props} message={this.state.message}  action={this.action} type={this.state.type} />
        );
    }
}
