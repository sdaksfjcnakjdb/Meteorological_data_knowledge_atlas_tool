import React, {Component} from 'react'
import {Input, DatePicker} from 'antd';
import Style from './editColumn.css';
import Select from '../select/Select';
import BrowseSelect from '../browseSelect/BrowseSelect';
import TextArea from '../input/TextArea';

export default class EditColumn extends React.Component {

    constructor(props) {
        super(props);
        this.state = Object.assign({}, this.props, {
            value: this.props.value,
            editable: false,
        });
    }
    
    componentWillReceiveProps=(nextprops)=>{
        console.log(nextprops.editable);
      	this.setState({
      		value: nextprops.value,
     		// editable: nextprops.editable
      	})
      }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({value});
    }

    save = () => {
        let props = this.props;
    	if (props.editRow) { // 编辑行操作
    		props.onEditRowChange && props.onEditRowChange(this.state.value);
    		return;
    	}
        this.dirty = true;
        this.setState({editable: false});
        props.onChange && props.onChange(this.state.value);
        props.editAfter && props.editAfter(this.state.value);
    }
    edit = (e) => {
    	if (this.props.editRow) {
    		return;
    	}
    	var div = e.target;
    	if (div.getAttribute("editable") == "false" || div.parentElement.getAttribute("editable") == "false") {
    		return;
    	}
        this.setState({editable: true}, () => {
            if (this.input)
                this.input.focus();
        });
        let column = this;
        this.props.editBefore && this.props.editBefore(column)
    }
    handleDateChange = (date, value) => {
        let props = this.props;
        this.dirty = true;
        this.setState({value});
    	if (props.editRow) {
    		props.onEditRowChange && props.onEditRowChange(value);
    		return;
    	}
        this.setState({editable: false});
        props.onChange && props.onChange(value);
        props.editAfter && props.editAfter(value);
    }
    selectChange = (value, option, selectData) => {
        let props = this.props;
        this.dirty = true;
        this.setState({value});
    	if (props.editRow) {
    		props.onEditRowChange && props.onEditRowChange(value);
    		return;
    	}
        if (this.props.mode !== "true") {
            this.setState({editable: false});
        } else {
            this.setState({editable: true});

        }
        props.onChange && props.onChange(value);
        if (this.props.mode === "true") {
            let dataArray = [];
            for (let i = 0; i < option.length; i++) {
                dataArray.push({code: option[i].key, text: option[i].props.children});
            }
            props.editAfter && props.editAfter(dataArray);
        } else {
            let data = {};
            data.code = option.key;
            data.text = option.props.children;
            props.editAfter && props.editAfter(data, selectData);
        }
    }
    
    onBlur = () => {
    	if (this.props.editRow) {
    		return;
    	}
    	this.setState({editable: false});
    }

    handleOnOpenChange = (status) => {
        this.setState({open: status});
    }
    
    handleTrigger = () => {
    	if (this.props.ontrigger) {
    		this.props.ontrigger(this);
    	}
    }

    componentDidMount() {
        this.dirty = false;
    }
    
    getSelectUrl() {
    	if (this.props.parentId) {
    		let selectUrlJson = base.ComponentMap.get(this.props.parentId).selectUrl;
    		let selectDataParamsJson = base.ComponentMap.get(this.props.parentId).selectDataParams;
    		if (this.props.dataIndex) {
    			if (selectUrlJson) {
    				this.selectUrl = selectUrlJson[this.props.dataIndex];
    			}
    			if (selectDataParamsJson) {
    				this.selectDataParams = selectDataParamsJson[this.props.dataIndex];
    			}
    		}
    	}
    }

    render() {
        const type = this.props.type;
        const dirty = this.dirty;
        let {value, editable} = this.state;
        let {enableEdit} = this.props;
        this.getSelectUrl();
        return (
            <div className={Style["editable-cell"]}>
                {
                    editable && enableEdit != false ?
                        <div className={Style["editable-cell-input-wrapper"]}>
                            {
                                type === 'input' ?
                                    <Input
                                        ref={node => (this.input = node)}
                                        className={Style["editable-cell-input"]}
                                        value={value}
                                        onChange={this.handleChange}
                                        onPressEnter={this.save}
                                        onBlur={this.save}
                                    />
                                    : type === 'date' ?
                                    <DatePicker
                                        ref={node => (this.datePicker = node)}
                                        allowClear={false} showTime={true}
                                        format={this.props.format || "YYYY-MM-DD HH:mm"}
                                        value={moment(value || new Date())}
                                        onChange={this.handleDateChange}
                                        style={{width: '100%'}}
                                        onOpenChange={this.handleOnOpenChange}
                                        open={this.state.open}
                                    />
                                    : type === 'select' ?
                                        <Select
                                            ref={node => (this.select = node)}
                                            className={Style["editable-cell-select"]}
                                            staticDataSource={this.props.dataSource}
                                            dataSource={this.state.dataSource}
                                            value={value}
                                            code={this.props.code}
                                            onChange={this.selectChange}
                                            dynamicUrl={this.selectUrl || this.props.dataSourceDynamic}
                                        	onBlur={this.onBlur}
                                            style={{width: '100%'}} width='100%'
                                            params = {this.selectDataParams}
                                        	autoFocus = {true}
                                            {...this.props.selectProps}/>
                                        : type === 'browseSelect' ?
                                                <BrowseSelect
                                                ref={node => (this.browseSelect = node)}
                                            	className={Style["editable-cell-input"]}
                                                value={value}
                                                onChange={this.handleChange}
                                            	ontrigger={this.handleTrigger}
                                            	onBlur={this.save}
                                                style={{width: '100%'}} width='100%'/>
                                            : type === 'textArea' ?
                                            		<TextArea
	                                                    ref={node => (this.textArea = node)}
	                                                    className={Style["editable-cell-input"]}
	                                                    value={value}
                                            			rows={this.props.rows}
	                                                    onChange={this.handleChange}
	                                                    onPressEnter={this.save}
	                                                    onBlur={this.save}
                                                	/>
                                                : ''
                            }
                        </div>
                        : value && value != " " ?
                        type === 'select' ?
                            <div className={this.props.editRow || enableEdit == false ? "" : Style["editable-cell-text-wrapper-select"]} onDoubleClick={this.edit}>
                                {
                                   this.props.columnRender ? this.props.columnRender(value) : value
                                }
                            </div>
                            :
                            <div className={this.props.editRow || enableEdit == false ? "" : Style["editable-cell-text-wrapper"]} onDoubleClick={this.edit}>
                                {
                                    this.props.columnRender ? this.props.columnRender(value) : value
                                }
                            </div>
                        :
                        <div className={this.props.editRow || enableEdit == false ? "" : Style["editable-cell-text-wrapper-none"]} onDoubleClick={this.edit}>
                            {''}
                        </div>
                }
            </div>
        );
    }
}
