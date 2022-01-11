import $ from 'jquery'
export default class Ajax {
	/*移除style中的样式，并将该样式返回*/
	static get(url,fn){
        var obj=Ajax.createXmlHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
        obj.open('GET',url,true);
        obj.onreadystatechange=function(){
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState==4说明请求已完成
                fn.call(this, obj.responseText);  //从服务器获得数据
            }
        };
        obj.send(null);
    }
	static post(url, data, fn) {
        var obj = Ajax.createXmlHttpRequest();
        obj.open("POST", url, true);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // 发送信息至服务器时内容编码类型
        obj.onreadystatechange = function () {
            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                fn.call(this, obj.responseText);
            }
        };
        
        obj.send(JSON.stringify(data));
    }
	static createXmlHttpRequest(){    
	    if(window.ActiveXObject){ //如果是IE浏览器    
	        return new ActiveXObject("Microsoft.XMLHTTP");    
	    }else if(window.XMLHttpRequest){ //非IE浏览器    
	        return new XMLHttpRequest();    
	    }    
	}
	static load(json){
		$.ajax({
			type: json.type || "get",
			cache: false,
			url:  json.url,
			data: json.param || {},
			timeout: json.timeout || 0,
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			success: function success(data) {
				json.fun && json.fun(data);
			},
			error: function error() {
				json.err && json.err();
			}
		});
	}
}
