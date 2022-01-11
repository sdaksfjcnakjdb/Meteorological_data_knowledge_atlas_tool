import ABaseComponent from '../../ABaseComponent';
import { Space as AntdSpace, Divider } from 'antd';
import classNames from "classnames";
import styles from "./space.css";

export default class Space extends ABaseComponent {
	constructor(props) {
		super(props);
		this.id = this.props.id;
		this.state = this.props;
	}

	componentDidMount() {
		super.componentDidMount();
	}

	createContent() {

		let split = this.props.split ? this.props.direction == "vertical" ? <Divider type="horizontal" style={{width: "100%", margin: "0"}}/> : <Divider type="vertical"/> : undefined;
		if (this.props.splitRender) {
			split = this.props.splitRender();
		}

		let size = this.props.size;
		if (this.props.direction == "horizontal") {
			if (this.props.hSize) {
				size = [this.props.hSize];
				if (this.props.vSize) {
					size = [this.props.hSize, this.props.vSize];
				}
			} else {
				if (this.props.vSize) {
					size = [0, this.props.vSize];
				}
			}
		}
		if (this.props.direction == "vertical") {
			if (this.props.vSize) {
				size = [this.props.vSize];
				if (this.props.hSize) {
					size = [this.props.vSize, this.props.hSize];
				}
			} else {
				if (this.props.hSize) {
					size = [0, this.props.hSize];
				}
			}
		}
		
		let justifyContent = this.props.textAlign;
		if (justifyContent == "left") {
			justifyContent = "flex-start";
		} else if (justifyContent == "right"){
			justifyContent = "flex-end";
		}
		
		return (
			<AntdSpace {...this.state} id={this.props.id} align={this.props.align} direction={this.props.direction} size={size} split={split} className={classNames(this.props.className, split && this.props.direction == "vertical" ? styles.space : "")}
				style={{ justifyContent: justifyContent, width: this.props.width, height: this.props.height }}>
				{this.state.children}
			</AntdSpace>
		);
	}
}
