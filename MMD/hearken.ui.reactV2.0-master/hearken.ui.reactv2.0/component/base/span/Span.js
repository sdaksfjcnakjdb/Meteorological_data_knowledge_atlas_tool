import ABaseComponent from '../../ABaseComponent';

export default class Span extends ABaseComponent {

	createContent() {
		return <span {...this.state} id={this.props.id}>{this.state.content}</span>
	}

}
