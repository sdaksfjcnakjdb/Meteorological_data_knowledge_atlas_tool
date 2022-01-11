
//基础工具类
export default class BaseUtil {
	/*移除style中的样式，并将该样式返回*/
	static removeStyle(style,styleName) {
		if(style && style[styleName]){
			var tmpStyle=style[styleName];
			delete style[styleName];
			return tmpStyle;
		}
		return null;
	}
	static  isEmptyObject(e) {
			var t;
			for (t in e)
				return !1;
			return !0
	  }
}