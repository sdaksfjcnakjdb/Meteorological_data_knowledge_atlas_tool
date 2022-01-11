import ABaseComponent from '../../ABaseComponent';
import {Button as AntdButton} from 'antd';
import Icon from '../icon/Icon';

export default class Button extends ABaseComponent{
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state = this.props;
	}
	
	componentDidMount(){
		super.componentDidMount();
		let parentDOM = document.getElementById(this.props.id).parentNode;
		if (parentDOM) {
			parentDOM.style.display=this.props.display;
		}
	}
	
	handleOnClick = () => {
		if (this.props.onClick) {
			this.props.onClick(this.props.text,this);
		}
	}

	createContent() {
		let icon = undefined;
		let style = {borderRadius:this.props.borderRadius,background:this.props.background,borderColor:this.props.borderColor,fontSize:this.props.fontSize,color:this.props.color, width:"100%", height:"100%"};
		if (this.props.style) {
			style = Object.assign({},this.props.style,style);
		}
		if (this.props.iconRender) {
			icon = this.props.iconRender();
		} else if (this.props.icon) {
			icon = <Icon id={"icon-" + this.props.id} type={this.props.icon} enableContainer={false}/>
		}
		return (
			<AntdButton {...this.state} id={this.props.id} type={this.props.type} className={this.props.className} style={style} onClick={this.handleOnClick} icon={icon}>
				{this.state.text}
			</AntdButton>
		);
	}
}
