import ABaseComponent from '../../ABaseComponent';
import { Table } from 'antd';
const  AntdColumn = Table.Column;
// 表格
export default class Column extends ABaseComponent{
	
	constructor(props){
 		super(props);
 	}
	
	componentDidMount() {
		super.componentDidMount(this);
	}
	
	createContent() {
		return (
			<AntdColumn  {...this.props} />
				//title="First Name"     dataIndex="firstName"       key="firstName"	 
		);
	}
}
