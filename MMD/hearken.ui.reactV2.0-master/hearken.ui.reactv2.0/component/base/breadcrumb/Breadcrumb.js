import ABaseComponent from '../../ABaseComponent';
import {Breadcrumb as AntdBreadcrumb} from 'antd';

const BreadcrumbItem = AntdBreadcrumb.Item;

export default class Breadcrumb extends ABaseComponent{
    constructor(props) {
        super(props);
    }
    createContent() {
    	if (this.state.datasource!=null) {
    		var children = this.state.datasource.map(function(item,key,ary) {
    		     return <BreadcrumbItem id={item.id}>{item["text"]}</BreadcrumbItem>
    		});
    		return(
				<AntdBreadcrumb {...this.state} id={this.props.id}>
					{children}
				</AntdBreadcrumb>
    		)
    	}
    }
}