import ABaseComponent from '../../ABaseComponent';
import { Carousel as AntdCarousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './carousel.css';
export default class Carousel extends ABaseComponent {
	constructor(props) {
		super(props);

	}

	handleBeforeChange = (from, to) => {
		if (this.props.beforeChange) {
			this.props.beforeChange(from, to);
		}
	}

	handleAfterChange = (current) => {
		if (this.props.afterChange) {
			this.props.afterChange(current);
		}
	}

	handlePrev = () => {//按钮--上一个
		this.refs.carousel.prev();
	}

	handleNext = () => {//按钮--下一个
		this.refs.carousel.next();
	}

	createContent() {
		var com;
		if (this.props.btn) {//左右按钮
			com = (
				<div className={styles.box}>
					<LeftOutlined onClick={this.handlePrev}  style={{ fontSize: '30px' }}/>
					<AntdCarousel {...this.state} ref='carousel' id={this.props.id} beforeChange={this.handleBeforeChange} afterChange={this.handleAfterChange} autoplay={this.state.autoplay}>
						{this.state.children}
					</AntdCarousel>
					<RightOutlined onClick={this.handleNext} style={{ fontSize: '30px' }}/>
				</div>
			);
		} else {
			com = (
				<AntdCarousel {...this.state} id={this.props.id} beforeChange={this.handleBeforeChange} afterChange={this.handleAfterChange} autoplay={this.state.autoplay}>
					{this.state.children}
				</AntdCarousel>
			);
		}
		return (
			com
		);
	}
}
