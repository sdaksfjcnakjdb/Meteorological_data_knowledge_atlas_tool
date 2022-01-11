import React from 'react';
import ABaseComponent from '../../ABaseComponent';


export default class Page extends ABaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            ...this.props,
            pageContent: ""
        }
    }

    componentWillReceiveProps(nextProps) {
		if(nextProps&&nextProps.jsPath != this.props.jsPath){
            this.setState({jsPath:nextProps.jsPath},()=>{
                this.unloadPage()
                this.reloadPage();
            })       
        }
        if(nextProps&&nextProps.id != this.props.id){
            this.setState({id:nextProps.id})
        }
	}

    componentDidMount() {
        this.reloadPage();
    }

    unloadPage = () => {
        // var page =  document.getElementById(`${this.state.id}-page`)
        // if(page.firstChild){
        //     page.removeChild(page.firstChild)
        // }
        this.setState({pageContent:null})
        let scripts = document.body.getElementsByTagName("script");
        let scriptArray = Array.from(scripts);
        scriptArray.map(script =>{
            if(script.getAttribute("option") === "dynamic"){
                document.body.removeChild(script);
            }
        })
        let links = document.body.getElementsByTagName("link");
        let linkArray =  Array.from(links);
        linkArray.map(link =>{
            if(link.getAttribute("option") === "dynamic"){
                document.body.removeChild(link);
            }
        })
    }

    reloadPage = () =>{
        var _this = this
        this.loadScript(this.state.jsPath, function () {
            window.loadCss = [];
            
            var cssArray = formContainerCss;
            if (cssArray) {
                cssArray.map((css) => {
                    _this.loadCss(css, function () {
                        window.loadCss.push(true);
                    });
                })
            }

            window.loadJs = [];
            var jsArray = formContainerJs;
            if (jsArray) {
                jsArray.map((js) => {
                    _this.loadScript(js, function () {
                        window.loadJs.push(true);
                    });
                })
            }
           
            var flag = true;
            setTimeout(function () {
                if (flag) {
                    flag = false;
                    console.log("内容加载失败！！！")
                }
            }, 5000)
            var interval = setInterval(function () {
                if (!flag) {
                    clearInterval(interval)
                }
                if (flag && formContainer && (window.loadCss.length == cssArray.length) && (window.loadJs.length == jsArray.length)) {
                    var pageContent =(new Function("return " + formContainer))();
                    _this.setState({ pageContent: pageContent })
                    console.log("内容加载成功！！")
                    flag = false;
                }
            }, 1)
        })
    }
    

    loadScript = (url, callback) => {
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (typeof (callback) != "undefined") {
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = function () {
                    callback();
                };
            }
        };
        script.src = url;
        script.setAttribute("option","dynamic"); 
        document.body.appendChild(script);
    }

    loadCss = (url, callback) => {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        if (typeof (callback) != "undefined") {
            if (link.readyState) {
                link.onreadystatechange = function () {
                    if (link.readyState == "loaded" || link.readyState == "complete") {
                        link.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                link.onload = function () {
                    callback();
                };
            }
        };
        link.href = url;
        link.setAttribute("option","dynamic");
        document.body.appendChild(link);
    }

    renderPage = content => {
        if (content)
            return React.cloneElement(content, {});
    }


    render() {
        return (
            <div id={`${this.props.id}-page`}>
                {this.state.pageContent}
            </div>
        );
    }
}