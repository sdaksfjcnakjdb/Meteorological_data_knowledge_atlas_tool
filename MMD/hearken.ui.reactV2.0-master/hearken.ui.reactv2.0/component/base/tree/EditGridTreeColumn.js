import React,{Component} from 'react'
import { Input, DatePicker} from 'antd';
import Style from './editGridTreeColumn.css';
import Select from '../select/Select'

export default class EditGridTreeColumn extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  }
  
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ value });
  }
  
  componentWillReceiveProps=(nextprops)=>{
  	this.setState({
  		value: nextprops.value,
  		editable: false,
  	})
  }
  
  save = () => {
    this.setState({ editable: false });
    let props=this.props;
    props.onChange && props.onChange(this.state.value);
    props.editAfter && props.editAfter(this.state.value)
  }
  edit = () => {
    this.setState({ editable: true }, () => {
        if (this.input)
        	this.input.focus();
    });
    this.props.editBefore && this.props.editBefore()
  }
  handleDateChange=(date,value)=>{
  	this.setState({ value });
  	this.setState({ editable: false });
  	let props=this.props;
    props.onChange && props.onChange(value);
  }
  selectChange=(value,option)=>{
  	this.setState({ value });
    this.setState({ editable: false });
  	let props=this.props;
    props.onChange && props.onChange(value);
  }
  render() {
    const { value, editable } = this.state;
    const type = this.props.type;
    return (
     <div className={Style["editable-cell"]}>
     {
        editable ?
        <div className={Style["editable-cell-input-wrapper"]}>
    	{
    		type === 'input'?
    		<Input 
           		ref={node => (this.input = node)}
    			className={Style["editable-cell-input"]}
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.save} 
                onBlur={this.save}
    		/>
    		: type === 'date'?
    		<DatePicker 
    			ref={node => (this.datePicker = node)} 
                allowClear={false} showTime={true} 
                format="YYYY-MM-DD HH:mm" 
                value={window.moment(value||new Date(),'YYYY-MM-DD HH:mm')} 
                onChange={this.handleDateChange}
                style={{width:'100%'}}
                />
    		: type === 'select'?
    		<Select 
    			ref={node => (this.select = node)} 
                className={Style["editable-cell-select"]}
                staticDataSource={this.props.dataSource} 
                defaultValue={this.state.value}
                value={value}
                code={this.props.code} 
                onChange={this.selectChange} 
                dynamicUrl={this.props.dataSourceDynamic} 
                style={{width:'100%'}} width='100%'/>
    		: ''
    	}
        </div>
        : value ? 
        	type === 'select'?
			<div className={Style["editable-cell-text-wrapper-select"]} onDoubleClick={this.edit}>
	          {value}
	        </div>	
			:
	        <div className={Style["editable-cell-text-wrapper"]} onDoubleClick={this.edit}>
	          {value}
	        </div>
        :
        <div className={Style["editable-cell-text-wrapper-none"]} onDoubleClick={this.edit}>
        	{''}
        </div>
    }
    </div>
    );
  }
}
