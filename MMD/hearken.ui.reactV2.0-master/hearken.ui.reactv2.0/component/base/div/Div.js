import React,{Component} from 'react';
import ComponentMap from '../../ComponentMap';

export default class Div extends Component{
	
	constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }

	componentDidMount() {
		ComponentMap.put(this.props.id,this)
	}
	
	render(){
		let style = this.props.style || {};
		style.width=this.props.width;
		style.height=this.props.height;
		if (this.props.background)
			style.backgroundImage='url('+this.props.background+')';
		return (
			<div id={this.props.id} style={style} onClick={this.props.onClick}  {...this.props}>
				{this.props.children}
			</div>
		)
	}
}


