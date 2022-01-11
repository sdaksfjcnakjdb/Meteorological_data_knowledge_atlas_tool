import PropTypes from 'prop-types';
import ABaseComponent from '../../ABaseComponent';
import {Anchor as AntdAnchor} from 'antd';
import reqwest from 'reqwest';
import fp from 'lodash/fp';
const {Link} = AntdAnchor;

export default class Anchor extends ABaseComponent{
	state = {
	        url: this.props.url,
	        dataSource: [],
	   
	    }
	defaultFormatData = (data) => {
        return data;
    }
	 /**
     * 必须的方法
     * 格式化数据的方法,默认是将核格平台的数据转换成支持的数据.
     * 如果this.props.formatData存在,将直接使用this.props.formatData来转换数据
     * 否则调用defaultFormatData
     * @param {array} data 数据
     */
    formatData = (data) => {
        if (typeof this.props.formatData === 'function') {
            return this
                .props
                .formatData(data);
        }
        return this.defaultFormatData(data);
    }
    /**
     * 必须的方法
     * 异步请求数据并更新state相关部分
     */
    asyncData = (url, data, onSuccess, onError) => {
        reqwest({
            url: url,
            method: 'get',
            data: {},
            type: 'json'
        }).then((data) => {
            this.child = this.renderAnchorNodes(data);
            this.setState({
                dataSource: data
            });
            if (this.props.openAll) {
            	this.setState({openKeys: this.openKeys});
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
            this.child = this.renderAnchorNodes(this.formatData(this.props.staticDataSource));
            //如果有静态数据源
            this.setState({
                dataSource: this.formatData(this.props.staticDataSource)
            });
        }

        // console.log(divs[0].offsetWidth);

    }
    componentDidMount() {
        super.componentDidMount(this);
        this.initData();
    }

    handleOnClick = (e,link) => {
        if (this.props.onClick) {
            this.props.onClick(e,link);
        }
    }
	renderAnchorNodes = (data) => {
		return data.map(item => {
			if(fp.isArray(item.children) && !fp.isEmpty(item.children)){
				return(<Link href={item.data.href}  title={item.data.title}>
				{this.renderAnchorNodes(item.children)}
				</Link>);
			}
			return(<Link href={item.data.href}  title={item.data.title}>
			</Link>);
		})}
	render(){
		return(	<div>
					<AntdAnchor 
					affix={this.props.affix}
					bounds={this.props.bounds}
					offsetBottom={this.props.offsetBottom}
					offsetTop={this.props.offsetTop}
					onClick={this.handleOnClick}
					showInkInFixed={this.props.showInkInFixed}
					{...this.props}
					
					>
						{this.child}
					</AntdAnchor>
				</div>)
	}

}
Anchor.propTypes = {
	    // 类名
	    className: PropTypes.string,
	    // 静态数据源
	    staticDataSource: PropTypes.array,
	    // 动态数据源
	    dynamicUrl: PropTypes.string,
	    // 数据格式化方法
	    formatData: PropTypes.func,
	    //行单击事件
	    onClick: PropTypes.func
	}
