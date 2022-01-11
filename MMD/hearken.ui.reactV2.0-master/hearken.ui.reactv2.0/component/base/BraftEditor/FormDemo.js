import React from 'react'
import BraftEditors from './BraftEditor'
import BraftEditor from 'braft-editor'
import './index.css'
import { Form, Input, Button } from 'antd'
class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }
  
  componentDidMount () {
    // 异步设置编辑器内容
    // setTimeout(() => {
    //   this.formRef.current.setFieldsValue({
    //     content: BraftEditor.createEditorState(null)
    //   })
    // }, 1000)
  }
  handleChange = (editorState) => {
    this.formRef.current.setFieldsValue({
          content: editorState
         })
  }
  handleSubmit=()=>{
    event.preventDefault()
    this.formRef.current.validateFields().then(values => {
      const submitData = {
        title: values.title,
        content: values.content.toRAW()
      }
      console.log(submitData)
		}).catch(errorInfo => {
      console.log(errorInfo)
    });
    console.log(this.formRef.current.getFieldValue('content').toRAW(true))
  }
  render () {
	const formItemLayout = {
			labelCol: {span: 24},
			wrapperCol: {span: 24}
	    }
  const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator', 'media' ]
  return (
      <div className="demo-container">
        <Form onFinish={this.handleSubmit} ref={this.formRef}>
          <Form.Item {...formItemLayout} label="文章标题" name="title">
              <Input size="large" placeholder="请输入标题"/>
          </Form.Item>
          <Form.Item {...formItemLayout} label="文章正文" name="content" className="my-component" rules={[{ required: true}]}>
              <BraftEditors  onChange={this.handleChange} />
          </Form.Item>
          <Form.Item {...formItemLayout}>
              <Button size="large" type="primary" htmlType="submit">提交</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default FormDemo