import ABaseComponent from '../../ABaseComponent';
import fp from 'lodash/fp';
import classNames from 'classnames';
import { Menu as AntdMenu } from 'antd';
import reqwest from 'reqwest';

const {SubMenu, Item} = AntdMenu;

export default class Menu extends ABaseComponent {

    openKeys = [];

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.state, {
            dataSource: [],
            openKeys: this.props.defaultOpenKeys || [],
            selectedKeys: this.props.defaultSelectedKeys || []
        });
    }

    componentWillReceiveProps(nextProps) {
        const openKeys = nextProps.openKeys;
        const selectedKeys = nextProps.selectedKeys;
        this.setState({
            openKeys: openKeys,
            selectedKeys: selectedKeys
        });
    }

    /**
     * 必须的方法
     * 异步请求数据并更新state相关部分
     */
     asyncData = (url, data, onSuccess, onError) => {
        let method = "post";
        if (url.lastIndexOf(".json") != -1) {
            method = 'get';
        }
        
        $.ajax({
            url: url,
            type: method,
            data:data,
            success: function(data){
                this.child = this.renderMenuNodes(data);
                this.setState({
                dataSource: data
               });
                if (this.props.openAll) {
                this.setState({ openKeys: this.openKeys });
            }
            }.bind(this),
            error: function () {
                antd.message.info('获取数据失败！');
            }
        
        }); 
    }

    /**
     * 必须的方法
     * 初始化取得数据
     */
    initData = () => {
        //判断数据源的类型
        if (this.props.dynamicUrl) {
            //如果有动态数据源
            this.asyncData(this.props.dynamicUrl, this.state.requestBody);
        } else if (this.props.staticDataSource) {
            this.child = this.renderMenuNodes(this.props.staticDataSource);
            //如果有静态数据源
            this.setState({
                dataSource: this.props.staticDataSource
            });
        }
    }

    componentDidMount() {
        super.componentDidMount(this);
        this.initData();
    }

    renderMenuNodes = (data) => {
        if (typeof(data) == "string") {
            data = JSON.parse(data);
        }
        return data.map(item => {
            if (fp.isArray(item.children) && !fp.isEmpty(item.children)) {
                this.openKeys.push(item.id);
                return (
                    <SubMenu
                        key={item.id}
                        id={item.id}
                        itemData={item}
                        title={this.props.formatTitle ? this.props.formatTitle(item) : item.text}
                        onTitleClick={this.handleTitleClick}>
                        {this.renderMenuNodes(item.children)}
                    </SubMenu>
                )
            } else {
                return (
                    <Item id={item.id} key={item.id} itemData={item} title={item.text}>
                        {this.props.formatTitle ? this.props.formatTitle(item) : item.text}
                    </Item>
                );
            }
        })
    }

    handleTitleClick = (item) => {
        let openKeys = this.state.openKeys;
        if (openKeys.indexOf(item.key) == -1) {
            openKeys.push(item.key)
            this.setState({ openKeys: openKeys });
        } else {
            openKeys.splice(openKeys.indexOf(item.key), 1);
            this.setState({ openKeys: openKeys })
        }
        this.props.onTitleClick && this.props.onTitleClick(item);
    }

    handleOnClick = (item) => {
        if (this.props.onClick) {
            this.props.onClick(item);
        }
        this.setState({
            selectedKeys: [item.key]
        });
    }

    handleOpenChange = (openKeys) => {
        this.setState({ openKeys: openKeys });
        this.props.onOpenChange && this.props.onOpenChange(openKeys);
    }

    createContent() {
        return (
            <div className={classNames(this.props.className)}>
                <AntdMenu
                    id={this.props.id}
                    forceSubMenuRender={this.state.forceSubMenuRender}
                    inlineIndent={this.props.inlineIndent}
                    theme={this.props.theme}
                    mode={this.props.mode}
                    triggerSubMenuAction={this.props.triggerSubMenuAction}
                    selectedKeys={this.state.selectedKeys}
                    onClick={this.handleOnClick}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.handleOpenChange}
                >
                    {this.child}
                </AntdMenu>
            </div>
        )
    }

}
