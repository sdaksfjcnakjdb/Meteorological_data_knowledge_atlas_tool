import { default as BaseUtil } from '../../util/BaseUtil';

export default class FormUtils {

    static getFormItemValidatorRules(child) {
        // 必填校验
        const fieldRequired = child.props.fieldRequired;
        const requiredMessage = child.props.requiredMessage;
        // 类型校验
        const fieldType = child.props.fieldType;
        const typeMessage = child.props.typeMessage;
        // 自定义正则校验
        const customerRegexp = child.props.customerRegexp;
        const customerRegexpMessage = child.props.customerRegexpMessage;
        // 字段长度校验
        const len = child.props.len;
        const lenMessage = child.props.lenMessage;
        // 字段最大长度校验
        const max = child.props.max;
        const maxMessage = child.props.maxMessage;
        // 字段最小长度校验
        const min = child.props.min;
        const minMessage = child.props.minMessage;
        // 拼接
        let validatorRules = [];
        if (fieldRequired != null || !BaseUtil.isEmptyObject(fieldRequired)) {
            let rule = {}
            rule.required = fieldRequired;
            rule.message = requiredMessage || "此项必填"
            validatorRules.push(rule);
        }
        if (fieldType != null || !BaseUtil.isEmptyObject(fieldType)) {
            if (fieldType != "number" && fieldType != "integer" && fieldType != "float") {//判断是否是数字框类型
                let rule = {}
                rule.type = fieldType;
                rule.message = typeMessage || "输入类型不合理"
                validatorRules.push(rule);
            }
        }
        if (customerRegexp != null || !BaseUtil.isEmptyObject(customerRegexp)) {
            if (Object.prototype.toString.call(customerRegexp) === '[object Array]') {
                for (var i = 0; i < customerRegexp.length; i++) {
                    let rule = {}
                    rule.pattern = new RegExp(customerRegexp[i]);
                    rule.message = customerRegexpMessage[i] || "输入不合理"
                    validatorRules.push(rule);
                }
            } else {
                let rule = {}
                rule.pattern = new RegExp(customerRegexp);
                rule.message = customerRegexpMessage || "输入不合理"
                validatorRules.push(rule);
            }
        }
        if (len != null || !BaseUtil.isEmptyObject(len)) {
            let rule = {}
            rule.len = len;
            rule.message = lenMessage || "输入长度不合理"
            validatorRules.push(rule);
        }
        if (fieldType !== "number" && fieldType !== "integer" && fieldType !== "float") {
            if (max != null || !BaseUtil.isEmptyObject(max)) {
                let rule = {}
                rule.max = max;
                rule.message = maxMessage || "输入最大长度不合理"
                validatorRules.push(rule);
            }
            if (min != null || !BaseUtil.isEmptyObject(min)) {
                let rule = {}
                rule.min = min;
                rule.message = minMessage || "输入最小长度不合理"
                validatorRules.push(rule);
            }
        } else {//为数字框类型  min   max  type  需要整合
            let rule = {}
            if (min) {
                rule.min = min;
            }
            if (max) {
                rule.max = max;
            }
            rule.type = fieldType;
            rule.message = typeMessage || "输入长度不合理"
            validatorRules.push(rule);
        }
        return validatorRules;
    }

}