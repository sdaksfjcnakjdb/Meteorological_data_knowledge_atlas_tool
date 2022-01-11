import PropTypes from 'prop-types';
import {Table} from 'antd';
import ABaseComponent from '../../ABaseComponent';
import ComponentMap from '../../ComponentMap';
import reqwest from 'reqwest';
import classnames from 'classnames';
import Styles from './base-grid-Grid.css';

import {
    isString as fp_isString,
    isEmpty as fp_isEmpty,
    cloneDeep as fp_cloneDeep,
    size as fp_size,
    unset as fp_unset,
    get as fp_get,
    forEach as fp_forEach,
    memoize as fp_memoize,
    map as fp_map,
    pull as fp_pull,
    indexOf as fp_indexOf,
    filter as fp_filter,
    find as fp_find
} from 'lodash/fp';

const propTypes = {
    rootName: PropTypes.string,
    hasRootNode: PropTypes.bool,
    defaultExpandAllRows: PropTypes.bool,
    isAsync: PropTypes.bool,
    rowSelection: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    dataSourceDynamic: PropTypes.string,
    dataSource: PropTypes.arrayOf(PropTypes.object),
    dataSourceParams: PropTypes.object,
    checkable: PropTypes.bool,
    onRowClick: PropTypes.func,
    onRowDoubleClick: PropTypes.func,
    onTreeNodeRender: PropTypes.func
};

const defaultProps = {
    rootName: 'ROOT',
    hasRootNode: true,
    defaultExpandAllRows: false,
    isAsync: false,
    rowSelection: null,
    onRowClick: (record, index, event) => {},
    onRowDoubleClick: (record, index, event) => {},
    onTreeNodeRender: (data) => {}
};

const rootId = 'ROOTROOTROOT';

const type = 'EditGridTree';
//设置rootData，根节点设置
const rootData = {
             "id": rootId,
             "key": rootId,
             "text": "",
             "cls": "forum",
             "data": {
                 "sequence": 6,
                 "checkbox": "1",
                 "memo": "ROOT",
                 "id": rootId,
                 "text":""
             },
             "children": [],
             "checkbox": false,
             "checked": false,
             "uiProvider": "col",
             "expanded": false,
             "leaf": false
      };

export default class EditGridTree extends ABaseComponent {
    constructor(props) {
        super(props);
        this.extData = {
            currentNodeData: {}
        };
        this.state = {
            treeTableData: [],
            expandedRowKeys: [],
            selectedRowKeys: [],
            loading: false
        };
        // 缓存化的getFlatData函数,要正确的使用,则相关数据应该是immutable的,目前还未找出不适用的场景
        this.memoizeFlatData = fp_memoize(this.getFlatData).bind(this);
        // 缓存化的getAllKeys函数,要正确的使用,则相关数据应该是immutable的,目前还未找出不适用的场景
        this.memoizeAllKeys = fp_memoize(this.getAllKeys).bind(this);
        this.type = 'EditGridTree';
    }

    // 是否异步加载
    isAsync = () => {
        // 异步加载的必要条件,有ROOT节点,this.props.isAsync为true
        return this.props.hasRootNode && this.props.isAsync;
    }

    // 记录所表示节点是否是根结点
    isClickRootNode = (record) => {
        return record.id === rootId;
    }
    
    getNewTreeData = () => {
    	this.setState({selectedRows: [], selectedRowKeys: []});
        // 优先解析静态数据源
        if (this.props.dataSource) {
            if (Object.prototype.toString.call(this.props.dataSource) === '[object Array]') {
            	let dataSource = this.props.hasRootNode
 	            ? [
 	                {
 	                    "id": rootId,
 	                    "key": rootId,
 	                    "text": this.props.rootName,
 	                    "cls": "forum",
 	                    "data": {
 	                        "sequence": 6,
 	                        "checkbox": "1",
 	                        "memo": "ROOT",
 	                        "id": rootId,
 	                        "text": this.props.rootName
 	                    },
 	                    "children": [...this.props.dataSource],
 	                    "checkbox": false,
 	                    "checked": false,
 	                    "uiProvider": "col",
 	                    "expanded": false,
 	                    "leaf": false
 	                }
 	            ]
 	            : [...this.props.dataSource];
            	this.setState({treeTableData: dataSource});
            }
            return;
        }

        // 解析动态数据源
        const url = this.props.dataSourceDynamic;
        const data = this.props.dataSourceParams;
        if (!url) 
            return;
        if (url.lastIndexOf(".json") != -1) {
		    this.getTreeData('get',url,data);
	    } else {
	    	this.getTreeData('post',url,data);
	    }
    }
    
    getTreeData = (method,url,params) => {
    	this.setState({loading:true});
        reqwest({
			url: url,
			method: method,
			data: params,
			type: 'json'
		}).then((data) => {
			console.log(data);
			 const treeTableData = this.getAntdGridTreeData(data);
			 let dataSource = this.props.hasRootNode
	            ? [
	                {
	                    "id": rootId,
	                    "key": rootId,
	                    "text": this.props.rootName,
	                    "cls": "forum",
	                    "data": {
	                        "sequence": 6,
	                        "checkbox": "1",
	                        "memo": "ROOT",
	                        "id": rootId,
	                        "text": this.props.rootName
	                    },
	                    "children": [...treeTableData],
	                    "checkbox": false,
	                    "checked": false,
	                    "uiProvider": "col",
	                    "expanded": false,
	                    "leaf": false
	                }
	            ]
	            : [...treeTableData];
             this.setState({treeTableData:dataSource,loading:false});
             // 是否需要展开所有的树节点
             this.props.defaultExpandAllRows && this.handleExpandAll(true);
             if (this.props.loadFunc) {
 				this.props.loadFunc(data, params);
 			}
		});
    }
    
    
    // 得到异步的树的数据   添加
    getAsyncTreeData =(params,record)=>{
    	const url = this.props.dataSourceDynamic;
    	reqwest({
    		url:url,
    		method:'post',
    		data:{
    			TREEASYNC:true,
    			...params
    		},
    		type:'json'
    	}).then((data)=>{
    		console.log("data");
    		console.log(data);
     if(record){
    			console.log("record");
    			console.log(record);
    	   record.children = data;
    		   if(data){
    			   for( var i=0,length=data.length;i<length;i++){
    	        		if(data[i].leaf==false){
    	        			data[i].children = [];
    	        		}else if(data[i].leaf==true){
    	        		data[i].children = undefined;
    	        		}
    	    		}
    		   }else{
    			   data=undefined;
    		   }
				this.setState({
					treeTableData: [...this.state.treeTableData],
				});
				return;
    		}
    		
	for( var i=0,length=data.length;i<length;i++){
        		if(data[i].leaf==false){
        			var a = [];
        			data[i].children = a;
        		}else if(data[i].leaf==true){
        			data[i].children = undefined;
        		}
    		}
			this.setState({
				treeTableData: data,
			});
			
    	});
    }
    
    
    getAntdGridTreeData = (data) => {
    	let selectedRowKeys = [];
    	for (var i=0; i<data.length; i++) {
    		if (data[i].children && data[i].children.length !== 0) {
    			data[i].children = this.getAntdGridTreeData(data[i].children);
    		}
    		data[i] = Object.assign(data[i],data[i].data);
    		data[i] = Object.assign(data[i],{key:data[i].id});
    		if (data[i].data.checked) {
    			selectedRowKeys.push(data[i].id);
    		}
    	}
    	if (selectedRowKeys && selectedRowKeys.length > 0) {
        	this.setState({selectedRowKeys: selectedRowKeys});
        }
    	return data;
    }

    // 重新加载
    reloadTreeData = (url,params) => {
    	this.setState({selectedRows: [], selectedRowKeys: []});
    	this.extData.currentNodeData = {};
    	this.extData.checkedDatas = [];
    	this.extData.checkedDatas1 = [];
        if (!fp_isString(url) || fp_isEmpty(url)) {
            this.getNewTreeData();
        } else {
            const data = params || this.props.dataSourceParams;
            if (!url) 
                return;
            if (window.dataHref) {
    			url = window.dataHref + url.substr(1);
    		}
            if (url.lastIndexOf(".json") != -1) {
    		    this.getTreeData('get',url,data);
    	    } else {
    	    	this.getTreeData('post',url,data);
    	    }
        }
    }

    // 得到扁平化的数据
    getFlatData = (data, path) => {
        // eslint-disable-next-line
        //console.log("重新得到扁平化的数据");
        if (!fp_isString(path) || path.length === 0) 
            return;
        let rs = [];
        // 避免修改原始数据
        const newData = fp_cloneDeep(data);
        // 递归
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

    // 得到单个数据
    getNodeData = (id) => {
        // 得到扁平化的数据
        const flatData = this.memoizeFlatData(this.state.treeTableData,'children');
        return fp_find(['id',id])(flatData);
    }

    // 得到所有数据
    getAllNodeData = (id) => {
        // 得到扁平化的数据
        return this.memoizeFlatData(this.state.treeTableData,'children');
    }

    // 得到所有的keys
    getAllKeys = (data) => {
        // 得到扁平化的数据
        const flatData = this.memoizeFlatData(data, 'children');
        const keys = fp_map(value => value.id)(flatData);
        // eslint-disable-next-line
        //console.log("得到所有的keys", keys);
        return keys;
    }

    getAllSelectedData = () => {
        const flatData = this.memoizeFlatData(this.state.treeTableData, 'children');
        const selectedRowKeys = this.state.selectedRowKeys;
        const checkedDatas = fp_filter((value) => fp_indexOf(value.id)(selectedRowKeys) + 1)(flatData);
        return checkedDatas;
    }

    handleExpand = (expanded, record) => {
        const key = record.id;
        // 关闭展开的行
        if (!expanded) {
            this.setState(prevState => ({
                expandedRowKeys: fp_pull(key)(prevState.expandedRowKeys)
            }));
        } else { // 展开关闭的行
            this.setState(prevState => {
                const expandedRowKeys = prevState.expandedRowKeys;
                if (!(fp_indexOf(key)(expandedRowKeys) + 1)) {
                    return {
                        expandedRowKeys: [
                            ...expandedRowKeys,
                            key
                        ]
                    };
                }
            });
            }
 
        // 如果是根结点且需要异步加载则异步加载   添加
        if (key == rootId&& this.props.isAsync) {
    		this.getAsyncTreeData({BELONGTO:'ROOT',node:'ROOT'},record);
    	} else if(this.props.isAsync){
    		this.getAsyncTreeData({BELONGTO:key,node:key},record);
    	}
    }

    handleExpandedRowsChange = (expandedRows) => {
        // 展开的行有了变化
    }

    handleExpandAll = (isExpandAll) => {
        // 关闭树
        if (!isExpandAll) {
            this.setState({expandedRowKeys: []});
            return;
        }
        // 展开树
        const AllKeys = [
            ...this.memoizeAllKeys(this.state.treeTableData, "children"),
            rootId
        ];
        this.props.hasRootNode && AllKeys.push(rootId);

        this.setState({expandedRowKeys: AllKeys});
    }

    handleRowClick = (record, index, event) => {
        this.extData.currentNodeData = fp_cloneDeep(record);
        const selectedRows = this.state.selectedRows;
		const selectedRowKeys = this.state.selectedRowKeys;
		if (selectedRowKeys == null || selectedRowKeys.length == 0 || selectedRowKeys.indexOf(record.key || record.id) == -1) {
			this.setState({selectedRows: [record], selectedRowKeys: [record.id]});
		}
		const allDatas = this.memoizeFlatData(this.state.treeTableData,'children');
	      this.extData.checkedDatas = fp_filter(function (value) {
	          return fp_indexOf(value.id)([record.id]) + 1;
	      })(allDatas);
	    this.extData.currentNodeData = {...this.getNodeData(record.id)};
		this.props.onRowClick(Object.assign({},record), index, event);
    }

    handleRowDoubleClick = (record, index, event) => {
        this.props.onRowDoubleClick(record, index, event);
    }

    handleRowRender = (data) => {
        this.props.onTreeNodeRender(data);
    }

    handleSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }
    
    componentWillMount() {
    	ComponentMap.put(this.id,this);
    }
    
    componentDidMount() {
        if (!this.props.hasRoot || !this.props.isAsync) {
            this.getNewTreeData();
        }
        //异步   添加的
        if (this.props.isAsync && this.props.hasRoot) {
           	this.getAsyncTreeData({BELONGTO:'ROOT',node:'ROOT'});
           }
        if (this.props.isAsync && this.props.hasRoot) {
           	this.setState({treeTableData:[rootData]});
           	
           }
        super.componentDidMount();
    }
    
    setData = (data, id, key, value) => {
    	for (var i=0; i<data.length; i++) {
    		if (data[i].id === id) {
    			data[i][key] = value;
    			data[i].data[key] = value;
    			break;
    		}
    		if (data[i].children && data[i].children.length !== 0) {
    			this.setData(data[i].children, id, key, value);
    		}
    	}
    }
    
    getData = (data, id) => {
    	let result;
    	for (var i=0; i<data.length; i++) {
    		if (data[i].id === id) {
    			result = data[i];
    			break;
    		}
    		if (data[i].children && data[i].children.length !== 0) {
    			result = this.getData(data[i].children, id);
    		}
    	}
    	return result;
    }
    
    onCellChange = (index, key, record) => {
	    return (value) => {
	      const dataSource = [...this.state.treeTableData];
	      this.setData(dataSource, record.id, key, value);
	      this.setState({ dataSource });
	      this.saveModify(dataSource, record.id, key, value);
	    };
	}
    saveInsert(data){// 保存新增行信息
 		this.rowModify=this.rowModify||[];
 		this.mode=this.mode||[];
 		this.rowModify.push(data);
	   	this.mode.push('insert');
 	}
 	saveDelete(data){
 		this.rowModify=this.rowModify||[];
 		this.mode=this.mode||[];
 		for (let index=0;index<data.length;index++) {
 			if(this.rowModify.length!==0){
 				let dataExist = false;
 				for(let i=0;i<this.rowModify.length;i++){
 					if(this.rowModify[i].id===data[index].id){
 						if (this.mode[i] === 'update') {
 							this.mode[i]='delete';
 						}
 						if (this.mode[i] === 'insert') {
 							this.mode.splice(i,1);
 							this.rowModify.splice(i,1);
 						}
 						dataExist = true;
 						break;
 					}
 				}
 				if (dataExist) {
 					continue;
 				}
 			}
 		   	this.rowModify.push(data[index])
 		   	this.mode.push('delete');
 		}
 	}
	saveModify(data,id,key,value){// 保存修改信息
		if(value===undefined){return}
	   	let values=Object.assign({},this.getData(data, id) || {});
	   	this.cellDataIndex=key;
	   	this.cellModify=values;
	   	this.rowModify=this.rowModify||[];// 保存所有修改行信息
	   	this.mode=this.mode||[];// 保存所有操作类型
	   	if(this.rowModify.length!==0){
	   		for(let i=0;i<this.rowModify.length;i++){
	   			if(this.rowModify[i].id===values.id){
	   				this.rowModify[i]=values;
	   	  			return;
	   	  		}
	   	  	}
	   	}
	   	this.rowModify.push(values)
	   	this.mode.push('update');
	}
    
    dealChild() {
		let newChild;
		let children = this.props.children;
		if (children != null) {
			if (children.length!=0) {
				//遍历列
				newChild = this.props.children.map(function(child,index) {
					if (child.props.hidden) {
						return React.cloneElement(child, { className:classnames(Styles.hiddenColumn)})
					}
					return child;
				});
			} else {
				if (children.props.hidden) {
					newChild= React.cloneElement(children, { className:classnames(Styles.hiddenColumn)})
				} else {
					newChild = children;
				}
			}
		}
		return newChild;
	}
    
    handleRowClassName = (record,index) => {
 		let rowClassName = "";
 		if (this.state.selectedRowKeys && this.state.selectedRowKeys.indexOf(record.key || record.id) !== -1) {
 			rowClassName = "ant-table-row-selected";
 		}
		if (this.props.rowClassName) {
			if (rowClassName !== "") {
				 rowClassName =  rowClassName + " ";
			}
			rowClassName = rowClassName + this.props.rowClassName(record,index);
		}
		return rowClassName;
	}

    render() {
    	const { selectedRowKeys } = this.state;
    	let _this = this;
		let newChild=this.dealChild();
        // 没有需要显示的数据则不显示
        if ([this.state.treeTableData].length === 0) {
            return null;
        }
        // 拼接数据
        let dataSource = this.state.treeTableData;

        // 修正数据格式
        const loop = data => data.forEach((item, index, arr) => {
            // 当非rootNode的children属性为空数组的时候置为undefined
            if (item.id !== rootId && item.children && item.children.length === 0) 
                arr[index].children = undefined;
            
            // 不为空时,递归
            if (item.children && item.children.length !== 0) 
                loop(arr[index].children);
            }
        );

        if (!this.props.isAsync) {
       	 loop(dataSource);
       }
        let gridData = dataSource;
 		let scrollX = this.props.scrollX;
		let scroll = {} 
		if (scrollX!=null) {
			scroll= {
					x:parseInt(scrollX)
			}
			if (gridData==null || gridData.length==0) {
				scroll.y=300;
			}
		}
		let scrollY = this.props.scrollY;
		if (scrollY!=null) {
			scroll.y=parseInt(scrollY)
		}
        if (this.props.rowSelection) {
        	let rowSelection = {
    				  selectedRowKeys,
    				  onChange: (selectedRowKeys, selectedRows) => {
    					  this.setState({ selectedRowKeys,selectedRows });
    			      },
    				  onSelect: (record, selected, selectedRows) => {
    					  let tree = this;
    					  let selectedRowKeys = [];
    					  selectedRows.forEach((item, index, arr) => {
    						  selectedRowKeys.push(item.id);
    					  });
    					  if (!this.props.checkStrictly) {
	      					  // 简单的选择或取消选择父节点联动选择或取消选择他的子节点
	    					  if (selected) {
	    						  if (record.belongto) {
	    							  let parentNode = tree.getNodeData(record.belongto);
	    							  selectedRowKeys.push(parentNode.id);
	    							  selectedRows.push(parentNode);
	    						  } else if (this.props.hasRootNode) {
	    							  let rootNode = dataSource[0];
	    							  selectedRowKeys.push(rootNode.id);
	    							  selectedRows.push(rootNode);
	    						  }
	    					  }
	      					  if (record.children) { 
	      						  if (selected) {
	      							  const addRowKeys = data => data.forEach((item, index, arr) => {
	      								  if (selectedRowKeys.indexOf(item.id) == -1) {
	      									  selectedRowKeys.push(item.id);
	      									  selectedRows.push(tree.getNodeData(item.id));
	      								  }
	      								  // 不为空时,递归
	      								  if (item.children && item.children.length !== 0) 
	      									  addRowKeys(arr[index].children);
	      							  }
	      							  );
	      							  addRowKeys(record.children);
	      						  }
	      						  if (!selected) {
	    							const removeRowKeys = data => data.forEach((item, index, arr) => {
	    								  if (selectedRowKeys.indexOf(item.id) != -1) {
	    									  let index = selectedRowKeys.indexOf(item.id);
	    									  selectedRowKeys.splice(index, 1);
	    									  selectedRows.splice(index, 1);
	    								  }
	    								  // 不为空时,递归
	    								  if (item.children && item.children.length !== 0) 
	    									  removeRowKeys(arr[index].children);
	    							  }
	    							  );
	    							removeRowKeys(record.children);
	      						  }
	      					  }
    					  }
	      				  const allDatas = this.memoizeFlatData(this.state.treeTableData,'children');
	      			      this.extData.checkedDatas = fp_filter(function (value) {
	      			          return fp_indexOf(value.id)(selectedRowKeys) + 1;
	      			      })(allDatas);
    					  this.setState({ selectedRowKeys,selectedRows });
      	      			  if (this.props.onSelect)
      	      				  this.props.onSelect(record, selected, selectedRows);
    	      		  },
    	      		  onSelectAll: (selected, selectedRows, changeRows) => {
    	      			  let selectedRowKeys = [];
	  					  selectedRows.forEach((item, index, arr) => {
	  						  selectedRowKeys.push(item.id);
	  					  });
	  					  const allDatas = this.memoizeFlatData(this.state.treeTableData,'children');
	       			      this.extData.checkedDatas = fp_filter(function (value) {
	       			          return fp_indexOf(value.id)(selectedRowKeys) + 1;
	       			      })(allDatas);
	  					  this.setState({ selectedRowKeys,selectedRows });
    	      			  if (this.props.onSelectAll)
    	      				  this.props.onSelectAll(selected, selectedRows, changeRows);
    	      		  },
    			  };
        	return (
    			<Table
    			{...this.props} 
    			loading={this.state.loading}
    			scroll={scroll}
    			dataSource={dataSource}
    			expandedRowKeys={this.state.expandedRowKeys}
    			onExpandedRowsChange={this.handleExpandedRowsChange}
    			rowSelection={rowSelection}
    			rowKey={record => record.key || record.id || record.ID}
    			pagination={false}
    			onExpand={this.handleExpand}
    			rowClassName={this.handleRowClassName}
    			onRow={(record,index) => {
    		    	return {
    		    		onClick: this.handleRowClick.bind(this,record,index),
    		    		onDoubleClick: this.handleRowDoubleClick.bind(this,record,index)
    		    	}
    		    }}>
    			{newChild}
    			</Table>
        	);
        } else {
        	return (
        			<Table
        			{...this.props}
        			loading={this.state.loading}
        			scroll={scroll}
        			dataSource={dataSource}
        			expandedRowKeys={this.state.expandedRowKeys}
        			onExpandedRowsChange={this.handleExpandedRowsChange}
        			rowKey={record => record.key || record.id || record.ID}
        			rowClassName={this.handleRowClassName}
        			pagination={false}
        			onExpand={this.handleExpand}
        			onRowClick={this.handleRowClick}
        			onRowDoubleClick={this.hanldeRowDoubleClick}>
        			{newChild}
        			</Table>
            	);
        }
    }
}

EditGridTree.propTypes = propTypes;

EditGridTree.defaultProps = defaultProps;
