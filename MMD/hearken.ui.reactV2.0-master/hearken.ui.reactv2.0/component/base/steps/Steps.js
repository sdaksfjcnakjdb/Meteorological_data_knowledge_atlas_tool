import ABaseComponent from '../../ABaseComponent';
import { Steps as AntdSteps} from 'antd';

const Step = AntdSteps.Step;

export default class Steps extends ABaseComponent {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, this.state, {
       dataSource: this.props.staticDataSource || []
    });
  }

  componentDidMount() {
    super.componentDidMount(this);
  }

  renderStep = (stepsData) => {
    if (stepsData) {
      let _this = this;
      let steps = stepsData.map((item, index) => {
        let title = _this.props.titleRender ? _this.props.titleRender(item) : item.title;
        let subTitle = _this.props.subTitleRender ? _this.props.subTitleRender(item) : item.subTitle;
        let description = _this.props.descriptionRender ? _this.props.descriptionRender(item) : item.description;
        let status = item.status;
        let disabled = item.disabled;
        return <Step title={title} subTitle={subTitle} description={description} icon={icon} status={status} disabled={disabled} />
      });
      return steps;
    }
  }

  handleOnChange = (current) => {
    if (this.props.onChange) {
      this.props.onChange(current);
    }
    this.setState({current: current});
  }

  createContent() {
    return (
      <AntdSteps {...this.state} id={this.props.id} direction={this.props.direction} labelPlacement={this.props.labelPlacement} 
        responsive={this.props.responsive} size={this.props.size} type={this.props.type} onChange={this.handleOnChange}>
        {this.renderStep(this.state.dataSouce)}
      </AntdSteps>
    );
  }
}