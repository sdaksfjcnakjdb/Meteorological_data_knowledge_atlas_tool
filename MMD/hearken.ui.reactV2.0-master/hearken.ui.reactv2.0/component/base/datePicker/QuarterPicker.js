import React, { Component } from 'react';
import moment from 'moment';
import './quarterPicker.less';

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  value?: string;
  defaultValue?: string;
  startValue?: string;
  endValue?: string;
  open?: boolean;
  disabled?: boolean;
  onOk?: Function;
  showOk?: boolean;
  onChange?: Function;
};
type IState = {
  stateOpen: boolean;
  year: string;
  selectTime: string;
  selectionTime: string;
  oneDisplay: string;
  twoDisplay: string;
};

const quarterData = [{
  value: 'Q1',
  label: '第一季度'
}, {
  value: 'Q2',
  label: '第二季度'
}, {
  value: 'Q3',
  label: '第三季度'
}, {
  value: 'Q4',
  label: '第四季度'
}];

const _defaultProps = {
  showOk: false, // 是否使用确定按钮，默认不使用
  disabled: false, // 组件是否禁用，默认组件可以使用
  defaultValue: "请选择时间", // 默认日期 or 没有日期时的提示语
  value: "",
  startValue: "1970-1",
  endValue: `${moment().format("YYYY")}-${moment().quarter()}`,
  open: undefined,
  onOk: () => {},
  className: ""
}

class QuarterPicker extends Component<IProps, IState> {
  private static defaultProps = _defaultProps; //主要是用 static 关联当前的class Loading
  private toggleContainer: React.RefObject<HTMLDivElement>;
  constructor(props: IProps) {
    super(props)
    this.state = {
      stateOpen: false, // 是否展示弹窗
      year: "", // "2020"
      selectTime: `${moment().format("YYYY")}-${moment().quarter()}`, // 选中的时间， "2020-1"， "-1" 代表第一季度
      selectionTime: "", // 点确定后需要返回的时间
      oneDisplay: "block",
      twoDisplay: "block"
    }
    this.toggleContainer = React.createRef()

  }

  componentDidMount() {
    const { value, open } = this.props;
    let { year, selectTime } = this.state;
    year = value ? value.split("-")[0] : selectTime.split("-")[0]
    this.setState({
      selectTime: value ? value : selectTime,
      selectionTime: value ? value : "",
      year
    })
    this.idBlock(year)
    if (open === undefined) {
      document.addEventListener('mousedown', this.handleClickOutside)
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  // componentWillReceiveProps 被废弃，使用 getDerivedStateFromProps 来取代
  static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
    // 该方法内禁止访问 this
    const { value } = nextProps;
    if (value !== prevState.selectionTime) {
      // 通过对比nextProps和prevState，返回一个用于更新状态的对象
      const year = value && value.split('-')[0];
      return {
        selectTime: value,
        selectionTime: value,
        year
      };
    }
    // 不需要更新状态，返回null
    return null;
  }

  onclick = (ev: any) => {
    // ...
    this.setState({
      stateOpen: !this.state.stateOpen,
    })
  }

  handleClickOutside = (ev: MouseEvent) => {
    if (!(this && this.toggleContainer && this.toggleContainer.current)) {
      return;
    }
    if (this.state.stateOpen && !this.toggleContainer.current.contains(ev.target as Node)) {
      this.setState({ stateOpen: false });
    }
  };

  ulliclick = (index: number) => {
    // ...
  }

  iconLeftClick = () => {
    // ...
    const year = parseInt(this.state.year);
    this.setState({
      year: (year - 1).toString()
    })
  }

  iconRightClick = () => {
    // ...
    const year = parseInt(this.state.year);
    this.setState({
      year: (year + 1).toString()
    })
  }

  idBlock = (year: string) => {
    // ...
  }

  okBut = (ev: any) => {
    // ...
  }

  textChange = () => {
    // ...
  }

  changeQuarter = (item: any) => {
    this.props.onChange && this.props.onChange(`${this.state.year}-${item.value}`);
    this.setState({
      stateOpen: false,
    })
  }

  render() {
    const { oneDisplay, twoDisplay, selectTime, year, selectionTime, stateOpen } = this.state;
    const { className, defaultValue, disabled, showOk, open } = this.props;
    let openOnOff = false;
    if (typeof (this.props.open) === "boolean") {
      openOnOff = !!open;
    } else {
      openOnOff = stateOpen;
    }
    return (
      <div
        className={`QuarterlyPicker ${className}`}
        id="QuarterlyPicker"
        style={this.props.style}
        ref={this.toggleContainer}>
        <div className="begin">
          <input className={selectionTime ? "zjl-input" : "zjl-input default_input"}
            value={selectionTime ? selectionTime : defaultValue}
            disabled={disabled}
            onClick={(ev) => { disabled ? null : this.onclick(ev) }}
            onChange={() => { this.textChange() }}
          />
          <i className="img" ></i>
        </div>
        <div className="child" style={{ display: openOnOff ? "block" : "none" }}>
          <header className="zjl-timehear">
            <span>{selectTime}</span>
          </header>
          <div className="con">
            <ul className="content-one">
              <li className="lefticon" onClick={this.iconLeftClick} style={{ display: oneDisplay }}>{"<<"}</li>
              <li className="righticon" onClick={this.iconRightClick} style={{ display: twoDisplay }}>{">>"}</li>
              <li>{year}</li>
            </ul>
          </div>
          <div className="TimerXhlleft">
            <ul className="quaterleft">
              {
                quarterData && quarterData.map(item => {
                  return <li
                    key={item.value}
                    className={`quaterleftli ${this.props.value === item.value ? 'active' : ''}`}
                    onClick={this.changeQuarter.bind(this, item)}>
                    {item.label}
                  </li>
                })
              }
            </ul>
          </div>
          {
            showOk ?
              <div className="zjl-but">
                <span onClick={this.okBut}>确定</span>
              </div> : null
          }
        </div>
      </div>
    )
  }
}

export default QuarterPicker;