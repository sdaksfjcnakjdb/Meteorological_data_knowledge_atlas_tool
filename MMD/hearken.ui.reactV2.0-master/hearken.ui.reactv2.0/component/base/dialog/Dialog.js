import ABaseComponent from '../../ABaseComponent';
import { Modal  } from 'antd';

export default class Dialog extends ABaseComponent {
	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		if ($(".ant-modal").draggable) {
			$(".ant-modal").draggable({
				cursor: "move"
			});
		}
		if (this.props.wrapClassName) {
			let wrapClassName = this.props.wrapClassName;
			let dialogs = document.getElementsByClassName(wrapClassName);
			for (let i = 0; i < dialogs.length; i++) {
				if (dialogs[i].getAttribute("role") == "dialog" && dialogs[i].style.display != "none") {
					let dialog = dialogs[i];
					dialog.classList.remove(wrapClassName);
					dialog.parentNode.classList.add(wrapClassName);
				}
			}
		}
	}

    myOnclick=()=>{
		let win = this.props.originWindow;
		let frameId = this.props.frameId;
		if (!win.baseChange) {
			win.oldBase = win.base;
			if (navigator.userAgent.indexOf("Chrome") >= 0) {
				win.base = window.frames[frameId].contentWindow.base;
			} else {
				win.base = window.frames[frameId].base;
			}
			win.baseChange = true;
		}
		if (this.props.beforeClose && this.props.beforeClose() == false) {
			return;
		}
		win.DIALOG.close();
    }

	createContent(){
		return (
			<Modal {...this.state} onCancel={this.myOnclick} >
				{this.props.children}
			</Modal>
		);
	}
}
