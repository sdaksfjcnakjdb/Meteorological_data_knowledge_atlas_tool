
//组件集合
export default class ComponentMap {
	static map={}
	
	static put(key,value) {
		if (ComponentMap.map == null) {
			ComponentMap.map={};
		}
		if (ComponentMap.map[key] !=null) {
			//console.warn(key+"已存在")
		}
		ComponentMap.map[key]=value;
	}
	static get(key) {
		if (ComponentMap.map == null) {
			ComponentMap.map={};
		}
		return ComponentMap.map[key];
	}
	constructor(){
		
	}
}