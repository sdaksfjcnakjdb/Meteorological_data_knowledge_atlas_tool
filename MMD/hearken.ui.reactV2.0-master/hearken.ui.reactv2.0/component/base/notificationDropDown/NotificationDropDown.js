import ABaseComponent from '../../ABaseComponent';
import fp from 'lodash/fp';
import classNames from 'classnames';
import reqwest from 'reqwest';
import { Menu as AntdMenu, Dropdown as AntdDropdown, Tabs as AntdTabs, List as AntdList ,Tag as AntdTag ,Avatar as AntdAvatar} from 'antd';
import * as Icon from '@ant-design/icons'

const { SubMenu, Item } = AntdMenu;
const AntdDropdownButton = AntdDropdown.Button;
const { TabPane } = AntdTabs

export default class NotificationDropDown extends ABaseComponent {
    state = {
        requestBody: {},
        dataSource: [],
        onClick: this.props.onClick
    }

    //异步请求数据并更新state相关部分
    asyncData = (url, data) => {
        reqwest({
            url: url,
            method: "post",
            data: data,
            type: 'json'
        }).then((data) => {
            this.setState({
                dataSource: data
            });
        });
    }

    //初始化取得数据
    initData = () => {
        //判断数据源的类型
        if (this.props.dynamicDataSource) {
            //如果有动态数据源
            this.asyncData(this.props.dynamicDataSource, this.state.requestBody);
        } else if (this.props.staticDataSource) {
            //如果有静态数据源
            this.setState({
                dataSource: this.props.staticDataSource
            });
        }
    }
    renderList = (data, type) => {
        if (type === "notification") {
            return data.map(item => {
                (<AntdList.Item>
                    <AntdList.Item.Meta
                        avatar={<AntdAvatar src={item.img} />}
                        title={<div>{item.title}</div>}
                        description={<div>{item.time}</div>}
                    />
                </AntdList.Item>)
            })
        }
        if (type === "info") {
            return data.map(item => {
                (<AntdList.Item>
                    <AntdList.Item.Meta
                        avatar={<AntdAvatar src={item.img} />}
                        title={<div>{item.title}</div>}
                        description={<div><div>{item.description}</div><div>{item.time}</div></div>}
                    />
                </AntdList.Item>)
            })
        }
        if (type === "todo") {
            return data.map(item => {
                (<AntdList.Item>
                    <AntdList.Item.Meta
                        avatar={<Avatar src={item.img} />}
                        title={<div>{item.title}<div><AntdTag></AntdTag></div></div>}
                        description={<div><div>{item.description}</div><div>{item.time}</div></div>}
                    />
                </AntdList.Item>)
            })
        }
    }
    // 渲染下拉菜单的内容
    renderOverlay = (data = []) => {
        return (<div><AntdTabs tabPosition="top">
            {data.map((item,index)=> {
                let title = item.title
                
                let count = item.count?`(${count})`:""
                let list = item.list ? item.list : []
                return (<TabPane tab={`${title}${count}`} key={index}>
                    {/* <AntdList>
                        {this.renderList(list, item.type)}
                    </AntdList> */}
                </TabPane>)
            })}
        </AntdTabs></div>)

    }

    componentDidMount() {
        super.componentDidMount(this)
        this.initData();
    }

    render() {
        const overlay = this.renderOverlay(this.state.dataSource);
        return (
            <div className={classNames(this.props.className)}>
                <AntdDropdown {...this.state} overlay={overlay} placement={this.props.placement} trigger="click" onVisibleChange={this.props.onVisibleChange}>
                    {this.props.children}
                </AntdDropdown>
            </div>
        )
    }

}
