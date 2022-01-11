import ABaseComponent from '../../ABaseComponent';
import { Upload as AntdUpload,Button} from 'antd';
import Icon from "../icon/Icon"
import Style from "./Upload.css";

export default class Upload extends ABaseComponent {
   constructor(props) {
		super(props);
  }
   
   componentWillReceiveProps(nextProps) {
	    const controlledValue = nextProps.value;
	    if (controlledValue && controlledValue.fileList) {
	    	this.setState({
	    		fileList: controlledValue.fileList,
	        });
	    }
	}
   
  componentDidMount(){
	super.componentDidMount();
  }

  componentWillMount(){
	if(this.props.progress){
		this.progress=this.props.progress()
	}
	if(this.props.showUploadList){
		this.showUploadList=this.props.showUploadList()
	}
  }
  createContent() {
	let action = "";
	if (this.props.action) {
		action = this.props.action + "?upload=upload";
		if (this.props.saveType != null) {
			action = action + "&saveType=" + this.props.saveType;
		}
		if (this.props.filePath) {
			action = action + "&filePath=" + this.props.filePath;
		}
	}
    return (
    	<div>
    		<AntdUpload { ...this.props } {...this.state} action={action} progress={this.progress} showUploadList={this.showUploadList} disabled={this.state.disabled}>
            	<Button style={{width:"100%"}}>
            		<Icon type="upload" />
            		{this.state.text}
            	</Button>
            </AntdUpload>
		</div>
    )
  }

}


Upload.defaultProps = {
		text:"上传"
}