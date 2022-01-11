import React from 'react'
import BraftEditor from 'braft-editor'
import './index.css'
import ABaseComponent from '../../ABaseComponent';
export default class EditorDemo extends ABaseComponent {

    state = {
        editorState: BraftEditor.createEditorState(null)
    }

    componentDidMount () {
        super.componentDidMount(this);
    }

    handleChange = (editorState) => {
    if(this.props.onChange){
       this.props.onChange(editorState)
     }
    this.setState({editorState:editorState})
    }

    handleSave=async ()=>{
       if(this.props.onSave){
        this.props.onSave(this.state.editorState.toRAW(true))
       }
    }

    render () {
        return (
            <div>
                <BraftEditor {...this.props}  onChange={this.handleChange} value={this.state.editorState} onSave={this.handleSave} />
            </div>
        )
    }

}