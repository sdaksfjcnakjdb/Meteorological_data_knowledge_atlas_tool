import { Tree } from 'antd';
import ABaseComponent from '../../ABaseComponent';
import reqwest from 'reqwest';

import {
    forEach as fp_forEach,
    size as fp_size,
    unset as fp_unset,
    cloneDeep as fp_cloneDeep,
    get as fp_get,
    memoize as fp_memoize,
    isString as fp_isString,
    filter as fp_filter,
    indexOf as fp_indexOf,
    map as fp_map,
    find as fp_find
} from 'lodash/fp';

const TreeNode = Tree.TreeNode;

const rootEventKey = 'ROOTROOTROOT';

const rootData = {
    "checkbox": false,
    "checked": false,
    "children": [],
    "data": {
        "id": rootEventKey,
        "text": ""
    },
    "id": rootEventKey,
    "leaf": false,
    "text": ""
};

export default class TreeOrdinary extends ABaseComponent {

    constructor(props) {
        super(props);
        this.extData = {
            currentNodeData: {},
            checkedDatas: [],
            checkedDatas1: [] // 包括父节点信息
        };
        this.dataSource = [];
        this.state = Object.assign({}, this.state, {
            dataSource: [],
            checkedKeys: this.props.defaultCheckedKeys || [],
            expandedKeys: this.props.defaultExpandedKeys || [],
            selectedKeys: this.props.defaultSelectedKeys || []
        });
        //缓存化的getFlatData函数,要正确的使用,则相关数据应该是immutable的,目前还未找出不适用的场景
        this.memoizeFlatData = fp_memoize(this.getFlatData).bind(this);
        this.checkedKeys = [];
        this.type = 'Tree';
        this.rootEventKey = rootEventKey;
        if (this.props.hasRoot) {
            rootData.text = this.props.defaultRootName;
            rootData.leaf = false;
        }
        this.getTreeNodes([rootData]);
    }

    getNewTreeData = () => {
        this.setState({ expandedKeys: [], checkedKeys: [] });
        // 优先解析静态数据源
        if (this.props.dataSource) {
            if (Object.prototype.toString.call(this.props.dataSource) === '[object Array]') {
                let dataSource = this.props.dataSource;
                if (this.props.hasRoot) {
                    rootData.children = this.props.dataSource;
                    dataSource = [rootData];
                }
                this.dataSource = dataSource;
                this.props.defaultExpandAll && this.handleExpandAll(true, dataSource);
                this.getTreeNodes(dataSource)
                this.setState({ dataSource: dataSource });
            }
            return;
        }
        // 动态数据源解析
        const url = this.props.dataSourceDynamic;
        if (url) {
            if (url.lastIndexOf(".json") != -1) {
                this.getTreeData('get', url, {});
            } else {
                this.getTreeData('post', url, {});
            }
        }
    }

    getAsyncTreeData = (params, treeNode) => {
        const url = this.props.dataSourceDynamic;
        reqwest({
            url: url,
            method: 'post',
            data: {
                TREEASYNC: true,
                ...params
            },
            type: 'json'
        }).then((data) => {
            if (treeNode) {
                treeNode.props.dataRef.children = data;
                this.getTreeNodes([...this.state.dataSource]);
                this.setState({
                    dataSource: [...this.state.dataSource],
                });
                return;
            }
            this.getTreeNodes(data);
            this.setState({
                dataSource: data,
            });
        });
    }

    getTreeData = (method, url, params) => {
        reqwest({
            url: url,
            method: method,
            data: params,
            type: 'json'
        }).then((data) => {
            let dataSource = data;
            if (this.props.hasRoot) {
                rootData.children = data;
                dataSource = [rootData];
            }
            //是否需要展开所有的树结点
            this.dataSource = dataSource;
            this.props.defaultExpandAll && this.handleExpandAll(true, dataSource);
            this.getTreeNodes(dataSource)
            this.setState({ dataSource: dataSource });
            if (this.checkedKeys) {
                this.handleChecked(this.checkedKeys);
            }
            if (this.props.loadFunc) {
                this.props.loadFunc(data, params);
            }
        });
    }

    getTreeNodes = (treeData) => {
        let checkedKeys = [];
        const loop = data => data.map((item) => {
            if (item && item.checked && item.checked == 1) checkedKeys.push(item.id);
            if (item.children && item.children.length !== 0) {
                return <TreeNode
                    title={this.renderTreeNodeTitle(item)}
                    key={item.id} dataRef={item} disabled={item.disabled} disableCheckbox={item.disableCheckbox} checkable={item.checkable}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode
                title={this.renderTreeNodeTitle(item)}
                key={item.id}
                isLeaf={item.leaf} dataRef={item} disabled={item.disabled} disableCheckbox={item.disableCheckbox} checkable={item.checkable} />;
        });

        this.treeNodes = loop(treeData);
        if (checkedKeys && checkedKeys.length > 0) {
            this.setState({ checkedKeys: checkedKeys });
        }
    }

    /**
     * 得到扁平化的数据,此方法不会对传入的数据做任何改变
     *
     * @param {array} data 源数据
     * @param {string} path 路径
     *
     * @return {array} 结果
     */
    getFlatData = (data, path) => {
        // eslint-disable-next-line
        //console.log("重新得到扁平化的数据");
        if (!fp_isString(path) || path.length === 0)
            return;
        let rs = [];
        // 避免修改原始数据
        const newData = fp_cloneDeep(data);
        const loop = fp_forEach(function (value) {
            var children = fp_get(path)(value);
            if (fp_size(children)) {
                loop(children);
            }
            rs.push(fp_unset(path)(value));
        });
        loop(newData);
        return rs;
    }

    getAllKeys = (data) => {
        //得到扁平化的数据
        const flatData = this.memoizeFlatData(data, 'children');
        //提取出keys
        const keys = fp_map(function (value) {
            return value.id;
        })(flatData);
        return keys;
    }

    //得到指定id的结点原始数据
    getNodeData = (id) => {
        //得到扁平化的数据
        const flatData = this.memoizeFlatData(this.state.dataSource, 'children');
        return fp_find(['id', id])(flatData);
    }

    //得到所有的结点原始数据
    getAllNodeData = () => {
        return [...this.state.dataSource];
    }

    handleAddExpandedKeys = (key) => {
        if (!fp_isString(key)) return;
        this.setState(prevState => ({
            expandedKeys: [...prevState.expandedKeys, key]
        }));
    }

    onExpand = (expandedKeys, object) => {
        this.expandedKeys = expandedKeys;
        this.getTreeNodes(this.state.dataSource);
        this.setState({ expandedKeys, autoExpandParent: false });
        if (this.props.onExpand) {
            this.props.onExpand(expandedKeys, object);
        }
    }

    handleExpandAll = (isExpandAll, treeData) => {
        //关闭树
        if (!isExpandAll) {
            this.setState({ expandedKeys: [] });
            return;
        }
        //展开树
        const treeData1 = [...treeData];
        const expandedKeys = [...this.getAllKeys(treeData1), rootEventKey];
        this.expandedKeys = expandedKeys;
        this.setState({ expandedKeys });
    }

    handleClick = (selectedKeys, e) => {
        const id = e && e.node && e.node.props && e.node.props.eventKey;
        //得到扁平化的数据
        const flatData = this.memoizeFlatData(this.state.dataSource, 'children');
        //找出第一个满足条件的数据
        const currentNodeData = fp_find(['id', id])(flatData);
        this.extData.currentNodeData = { ...currentNodeData };
        this.setState({ selectedKeys: [id] });
        this.props.onClick([id], e);
    }

    handleLoadData = (treeNode) => {
        return new Promise((resolve) => {
            if (!this.props.isAsync)
                return resolve();
            setTimeout(() => {
                if (treeNode.props.dataRef.id == rootEventKey) {
                    this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' }, treeNode);
                } else {
                    this.getAsyncTreeData({ BELONGTO: treeNode.props.dataRef.id, node: treeNode.props.dataRef.id }, treeNode);
                }
                resolve();
            }, 1000);
        });
    }

    handleChecked = (checkedKeys, e) => {
        if (this.props.checkStrictly && checkedKeys.checked) {
            checkedKeys = checkedKeys.checked;
        }
        if (this.state.dataSource && this.state.dataSource.length > 0) {
            // 根据checkedKeys包装checkedDatas数据
            const allDatas = this.memoizeFlatData(this.state.dataSource, 'children');
            this.extData.checkedDatas = fp_filter(function (value) {
                return fp_indexOf(value.id)(checkedKeys) + 1;
            })(allDatas);
            if (!this.props.checkStrictly) {
                this.getChildrenCheckedDatas(checkedKeys, allDatas);
            }
            this.setState({ checkedKeys: checkedKeys });
            this.getParentCheckedDatas(checkedKeys, allDatas); //获取选择节点信息，包括父节点信息
        } else {
            this.checkedKeys = checkedKeys;
        }
    }

    getChildrenCheckedDatas = (checkedKeys, allDatas1) => {
        const allDatas = this.state.dataSource;
        let checkedDatas = this.extData.checkedDatas;
        for (let i = 0; i < checkedKeys.length; i++) {
            const loop = allDatas => allDatas.map((item) => {
                if (item.children && item.children.length > 0) {
                    if (item.id == checkedKeys[i]) {
                        var data = item.children;
                        const loopChildren = data => data.map((item) => {
                            if (item.children) {
                                loopChildren(item.children);
                            }
                            let index = _.findIndex(allDatas1, function (o) { return o.id == item.id; });
                            if (index != -1) {
                                let data = allDatas1[index];
                                if (checkedDatas.indexOf(data) == -1) {
                                    checkedDatas.push(data);
                                }
                            }
                        });
                        loopChildren(data);
                    }
                    loop(item.children);
                }
            });
            loop(allDatas);
        }
        this.extData.checkedDatas = checkedDatas;
    }

    getParentCheckedDatas = (checkedKeys, allDatas1) => {
        const allDatas = this.state.dataSource;
        let checkedDatas = [].concat(this.extData.checkedDatas);
        for (let i = 0; i < checkedKeys.length; i++) {
            const loop = allDatas => allDatas.map((item) => {
                if (item.children && item.children.length > 0) {
                    let children = item.children;
                    if (_.findIndex(children, function (o) { return o.id == checkedKeys[i]; }) != -1) {
                        let index = _.findIndex(allDatas1, function (o) { return o.id == item.id; });
                        if (index != -1) {
                            let data = allDatas1[index];
                            if (checkedDatas.indexOf(data) == -1) {
                                checkedDatas.push(data);
                            }
                        }
                    } else {
                        loop(item.children);
                    }
                }
            });
            loop(allDatas);
        }
        this.extData.checkedDatas1 = checkedDatas;
        if (this.props.checkStrictly) {
            checkedKeys = [];
            for (let i = 0; i < checkedDatas.length; i++) {
                checkedKeys.push(checkedDatas[i].id);
            }
        }
    }


    reloadTreeData = (url, params) => {
        this.setState({ expandedKeys: [], checkedKeys: [], selectedKeys: [] });
        this.checkedKeys = [];
        this.extData.currentNodeData = {};
        this.extData.checkedDatas = [];
        this.extData.checkedDatas1 = [];
        if (!url) {
            this.getNewTreeData();
        } else {
            if (url.lastIndexOf(".json") != -1) {
                this.getTreeData('get', url, params);
            } else {
                this.getTreeData('post', url, params);
            }
        }
    }

    filterTreeData = (filter) => {
        this.setState({ expandedKeys: [], checkedKeys: [], selectedKeys: [] });
        const url = this.props.dataSourceDynamic;
        if (url) {
            this.getTreeData('post', url, { FILTER: filter });
            if (this.dataSource && this.dataSource.length > 0) {
                this.setState({ expandedKeys: [this.dataSource[0].id] });
            }
        }
    }

    renderTreeNodeTitle = (item) => {
        return (this.props.onRenderTreeNodeTitle && this.props.onRenderTreeNodeTitle(item)) || item.text;
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.isAsync) {
            this.getNewTreeData();
        }
        if (this.props.isAsync && !this.props.hasRoot) {
            this.getAsyncTreeData({ BELONGTO: 'ROOT', node: 'ROOT' });
        }
        if (this.props.isAsync && this.props.hasRoot) {
            this.setState({ treeData: [rootData] });
        }
    }

    handleOnDoubleClick = (e) => {
        let data;
        if (this.state.selectedKeys) {
            var keyId = this.state.selectedKeys[0];
            //得到扁平化的数据
            var flatData = this.memoizeFlatData(this.state.dataSource, 'children');
            //找出第一个满足条件的数据
            data = _.find(flatData, ['id', keyId]);
        }
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(data);
        }
    }

    createContent() {
        return (
            <div id={this.props.id} className={this.props.className}>
                <Tree
                    autoExpandParent={this.state.autoExpandParent}
                    blockNode={this.props.blockNode}
                    checkable={this.props.checkable}
                    checkedKeys={this.state.checkedKeys}
                    checkStrictly={this.props.checkStrictly}
                    expandedKeys={this.state.expandedKeys}
                    selectedKeys={this.state.selectedKeys}
                    loadData={this.handleLoadData}
                    showLine={this.props.showLine}
                    showIcon={this.props.icons}
                    onExpand={this.onExpand}
                    onCheck={this.handleChecked}
                    onSelect={this.handleClick}
                    onRightClick={this.props.treeMenu ? this.onRightClick : ""}
                    onDoubleClick={this.handleOnDoubleClick}
                >
                    {this.treeNodes}
                </Tree>
            </div>
        );
    }
}
