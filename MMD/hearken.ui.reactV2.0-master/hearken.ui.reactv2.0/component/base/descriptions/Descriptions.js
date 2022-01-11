import ABaseComponent from '../../ABaseComponent';
import { Descriptions as AntdDescriptions } from 'antd';

const DescriptionsItem = AntdDescriptions.Item;

export default class Descriptions extends ABaseComponent {

    itemValues = {};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    setItemValues = (values) => {
        this.itemValues = values;
        this.setState({ setValue: true });
    }

    setItemValue = (itemId, value) => {
        this.itemValues[itemId] = value;
        this.setState({ setValue: true });
    }

    renderChildren = (children, setValue) => {
        let _this = this;
        return React.Children.map(children, child => {
            const id = child.props.id;
            if (id) {
                const label = child.props.label;
                const value = setValue ? _this.itemValues[id] : child.props.defaultValue;
                const span = child.props.span;

                return (
                    <DescriptionsItem label={label} span={span}>{value}</DescriptionsItem>
                );
            }
        });
    }

    createContent() {
        return (
            <AntdButton {...this.state} id={this.props.id}>
                {this.renderChildren(this.state.children, this.state.setValue)}
            </AntdButton>
        );
    }
}
