import ABaseComponent from '../../ABaseComponent';
import ComponentMap from '../../ComponentMap';
import Page from "./Page"

export default class Route extends ABaseComponent {

    constructor(props) {
        super(props);
        this.id = this.props.id;
        this.state = {
            ...this.props,
        }
    }

    componentDidMount() {
        ComponentMap.put(this.id, this);
    }

    

    createContent() {
        let url = this.state.jsPath;
        if(url !== null&&url !== undefined)
            url = /.js$/.test(url)?url:url.replace(/\.[^\.]+$/, ".js");
        return (
            <div id = {this.props.id}>
                <Page  {...this.state} jsPath={url}>
                </Page>
            </div>
        );
    }

}