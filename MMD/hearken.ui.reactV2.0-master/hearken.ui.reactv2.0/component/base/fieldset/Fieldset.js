import React,{Component} from 'react';
import ComponentMap from '../../ComponentMap';
import Styles from './fieldset.css';

export default class Fieldset extends Component{
	
	constructor(props) {
        super(props);
        this.state = Object.assign({}, props);
    }

	componentDidMount() {
		ComponentMap.put(this.id,this)
	}
	
	render(){
		return (
			<fieldset id={this.props.id} className={Styles.fieldset}>
				<legend className={Styles.legend}>{this.props.title}</legend>
				{this.props.children}
			</fieldset>
		)
	}
}


