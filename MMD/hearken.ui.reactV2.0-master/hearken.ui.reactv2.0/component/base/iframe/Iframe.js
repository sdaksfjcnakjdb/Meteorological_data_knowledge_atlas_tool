import React,{Component} from 'react';
import ComponentMap from '../../ComponentMap';

export default class Iframe extends Component{
	
	constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }
	
	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
	}

	componentDidMount() {
		ComponentMap.put(this.id,this);
		var iframe = this.iframe;
		if (this.props.selfAdaption) {
			iframe.width = "100%";
			if (iframe.attachEvent) {
				iframe.attachEvent("onload",function() {
					iframe.height = iframe.contentWindow.document.documentElement.scrollHeight;
				});
			} else {
				iframe.onload = function() {
					iframe.height = iframe.contentDocument.body.scrollHeight;
				};
			}
		}
	}
	
	render(){
		return (
			<iframe ref={(ref)=> this.iframe = ref} id={this.props.id} {...this.props}>
			</iframe>
		)
	}
}