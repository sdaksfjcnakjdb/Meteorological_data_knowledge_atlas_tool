import {Modal, Icon, Button} from 'antd';
import ABaseComponent from '../../ABaseComponent';
import styles from './confirmWithCloseButton.css';

export default class ConfirmWithCloseButton extends ABaseComponent {
	
	constructor(props){
 		super(props);
 		this.state = props;
 	}
	
	componentDidMount() {
		super.componentDidMount(this);
	}
	
	handleOk = (e) => {
	    this.setState({
	        visible: false,
	    });
	    if (this.props.onOk) {
		    this.props.onOk();
	    }
	}

	handleCancel = (e) => {
	    this.setState({
	        visible: false,
	    });
	    if (this.props.onCancel){
		    this.props.onCancel();
	    }
	}
	
	handleMyCancel = (e) => {
	    this.setState({
	        visible: false,
	    });
	    if (this.props.myCancel) {
	    	this.props.myCancel();
	    }
	}
	
	handleMyOk = (e) => {
	    this.setState({
	        visible: false,
	    });
	    if (this.props.myOk) {
	    	this.props.myOk();
	    }
	}
	
	createContent() {
		return (
	        <Modal
	          {...this.props}
	          visible={this.state.visible}
	          onOk={this.handleOk}
	          onCancel={this.handleCancel}
	          destroyOnClose={true}
	          width={416}
	          wrapClassName={styles.confirmWithCloseButton}
	        >
	          <div className="ant-modal-confirm-body-wrapper">
		          <div className="ant-modal-confirm-body">
		          	<Icon type="question-circle"/>
		          	<span class="ant-modal-confirm-title">{this.props.title}</span>
		          	<div className="ant-modal-confirm-content">
		          		{this.props.content}
		          	</div>
		          </div>
		          <div className="ant-modal-confirm-btns">
		          	<Button onClick={this.handleMyCancel}>{this.props.cancelText}</Button>
		          	<Button type="primary" onClick={this.handleMyOk}>{this.props.okText}</Button>
		          </div>
	          </div>
	        </Modal>
		);
	}
}

ConfirmWithCloseButton.confirm = (configs) => {
	var div = document.createElement('div');
    document.body.appendChild(div);
    configs = Object.assign({},configs,{visible:true});
	return ReactDOM.render(React.createElement(ConfirmWithCloseButton, configs), div);
}