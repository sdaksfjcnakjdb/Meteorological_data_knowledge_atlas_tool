import ABaseComponent from '../../ABaseComponent';
import IFrame from '../iframe/IFrame';
import {Tabs as AntdTabs} from 'antd';
const TabPane = AntdTabs.TabPane;
export default class Tabs extends ABaseComponent{
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);
		this.onEdit = this.onEdit.bind(this);
		this.onChangeExter = this.props.onChange;
		this.onEditExter = this.props.onEdit;
		let _this = this;
	}
	onChange(activeKey) {
		this.setState({activeKey:activeKey });
		if (this.onChangeExter) {
			this.onChangeExter(activeKey);
		}
	}
	onEdit(targetKey, action){
    	this[action](targetKey);
    	if (this.onEditExter) {
			this.onEditExter(targetKey, action);
		}
  	}
	remove(targetKey) {
	  let activeKey;
	  let lastIndex;
	  if (this.state.panes) {
		  this.state.panes.forEach(function (pane, i) {
			  if (pane.key === targetKey) {
				  lastIndex = i - 1;
			  }
		  });
		  let panes = this.state.panes.filter(function (pane) {
			  return pane.key !== targetKey;
		  });
		  if (lastIndex >= 0) {
			  activeKey = panes[lastIndex].key;
		  }
		  this.setState({ panes: panes });
	  }
	  if (this.state.children){
		  if (Object.prototype.toString.call(this.state.children) === '[object Array]') {
			  if(this.state.children.length>0) {
				  if (!lastIndex) {
					  this.state.children.forEach(function (child, i) {
						  if (child.key === targetKey) {
							  lastIndex = i - 1;
						  }
					  });
					  if (lastIndex >= 0) {
						  activeKey = this.state.children[lastIndex].key;
					  }		  
				  }
				  let children = this.state.children.filter(function (child) {
					  return child.key !== targetKey;
				  });
				  this.setState({ children: children, activeKey:  activeKey});	  
			  }
		  } else {
			  if (this.state.children.key === targetKey) {
				  this.setState({ children: [] });
			  }
		  }
	  }
	  if (activeKey) {
		  this.setState({ activeKey: activeKey });
	  } else {
		  if (this.state.children){
			  if (Object.prototype.toString.call(this.state.children) === '[object Array]') {
				  if(this.state.children.length>0) {
					  this.setState({ activeKey: this.state.children[0].key });
				  }
			  } else {
				  this.setState({ activeKey: this.state.children.key });
			  }
		  }
	  }
	};
	createContent() {	
		let panes = this.state.panes;
		let activeKey = this.state.activeKey;
		let defaultActiveKey = this.state.defaultActiveKey;
		if (activeKey) {
			this.state.activeKey = "" + activeKey;
		}
		if (defaultActiveKey) {
			this.state.defaultActiveKey = "" + defaultActiveKey;
		}
		if (panes && panes.length > 0) {
			let children = panes.map(function(pane,index) {
				 if (pane.url != null) {
				 	return ( <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
				 		<IFrame frameBorder="0" id={pane.key} name={pane.key} src={pane.url} enableContainer={false}/>
				 	</TabPane>)
				 } else {
				 		return ( <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
				 		{pane.content}
				 	</TabPane>)
				 }
				
			});
			return (
				<AntdTabs {...this.props} {...this.state} onChange={this.onChange} onEdit={this.onEdit} >
					{this.state.children}
					{children}
				</AntdTabs>
			);
		} else {
			return (
				<AntdTabs {...this.props} {...this.state} onChange={this.onChange} onEdit={this.onEdit} >
					{this.state.children}
				</AntdTabs>
			);
		}
		
	}
}
