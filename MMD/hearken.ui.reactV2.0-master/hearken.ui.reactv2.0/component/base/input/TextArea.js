import React from 'react';
import Input from './Input';
import { Input as AntdInput, Tooltip } from 'antd';

const AntdTextArea = AntdInput.TextArea;

export default class TextArea extends Input {

  countFormatter = (count, maxLength) => {
    if (this.props.countFormatter) {
      this.props.countFormatter(count, maxLength)
    }
  }

  createContent() {
    const { autosize, minRows, maxRows, ...params } = this.props;
    let autoRows;
    if (minRows >= 0) {
      autoRows = {};
      autoRows.minRows = minRows;
      if (maxRows >= minRows) {
        autoRows.maxRows = maxRows;
      }
    } else {
      autoRows = autosize;
    }
    let textArea = <AntdTextArea {...params} {...this.state} autosize={autoRows} countFormatter={this.countFormatter} onChange={this.onChanges} onBlur={this.onBlur} onPressEnter={this.onPressEnter} />;
    if (this.state.tooltip) {
      return (
        <Tooltip placement={this.state.tooltipPlacement} title={this.state.tooltip}>
          {textArea}
        </Tooltip>
      );
    }
    return (
      <React.Fragment>
        {textArea}
      </React.Fragment>
    );
  }
  
}