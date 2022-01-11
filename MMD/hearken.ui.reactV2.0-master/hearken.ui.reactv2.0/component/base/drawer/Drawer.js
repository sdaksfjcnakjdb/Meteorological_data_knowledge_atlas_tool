import ABaseComponent from '../../ABaseComponent';
import { Drawer as AntdDrawer} from 'antd';
export default class Drawer extends ABaseComponent {
	
	constructor(props) {
		super(props);
		this.state = Object.assign({}, props);	
	}
	componentWillReceiveProps(nextProps) {
	    
	}
	
	componentDidMount(){
        super.componentDidMount();
	}

    myOnClose=()=>{
        DRAWER.close();
    }
	createContent(){
		return (
            <AntdDrawer onClose={this.myOnClose} {...this.state}>
          </AntdDrawer>
		);
	}
}
