package com.sunsheen.neo4j_demo1.dao;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sunsheen.neo4j_demo1.utils.JsonUtil;
import org.neo4j.driver.v1.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static org.neo4j.driver.v1.Values.parameters;

public  class Neo4jDao{

    private JsonUtil jsonUtil = new JsonUtil();

    public Neo4jDao(){

    }

    //添加节点
    public void creatNode(String labelName, JSONObject node){
        System.out.println ("node:"+node);
        Set<String> sets = node.keySet ();
        //动态生成语句，实现多属性注入
        String cypher="CREATE (n:"+labelName+"{";
        Boolean first = true;
        for (String set:sets){
            if(!first) {//非第一个
                cypher += "'," + set + ":'" + node.getString (set);
            }else{//第一个
                cypher +=  set + ":'" + node.getString (set);
                first = false;
            }
        }
        cypher += "'})";
        //固定属性
//        String cyphers="CREATE (n:"+labelName+"{name:'"+node.getString ("name")+"',comment:'"+node.getString ("comment")+"'})";
//        System.out.println(cypher);
//        System.out.println(cyphers);
        Map<String,String> map = new HashMap<String,String>();
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
        }
    }


    //添加关系
    public void creatLink(String labelName, String source, String type, String target){
        String cypher="MATCH (a:"+labelName+"),(b:"+labelName+") WHERE a.name = '"+source+"' AND b.name = '"+target+"' CREATE (a)-[r:"+type+"] -> (b)";
        System.out.println(source +"__"+ type+"__"+target);
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
        }
    }



    //删除节点
    public void deleteNode(String labername, String name) {
        String cypher = "match(n:"+labername+"{name:'";
        cypher += name;
        cypher +="'}) -[r]-() DELETE n,r";
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
        }
    }
    //删除关系
    public void deleteLink(String labelName, String source, String target){
        String cypher = "MATCH (a: "+labelName+")-[rel]-(b:"+labelName+") WHERE a.name = '"+source+"' AND b.name = '"+target+"'   delete rel";
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
        }
    }


    //修改关系
    public void updataLink(String labelName, String source, String type, String target){
        deleteLink (labelName,source,target);
        creatLink (labelName,source,type,target);
    }

    //修改节点
    public void updataNode(String labelName, JSONObject node){
        System.out.println ("node:"+node);
        Set<String> sets = node.keySet ();
        //动态生成语句，实现多属性注入
        JSONArray delete  = node.getJSONArray ("delete");
        sets.remove ("delete");
        //删除原本附加属性
        String cypher0="match (n:"+labelName+"{";
        cypher0 +=   "name:'" + node.getString ("name");
        cypher0 += "'}) remove ";
        boolean first = true;
        for (int i = 0;i<delete.size();i++){
                if (!first) {//非第一个
                    cypher0 += "',n." + delete.getString (i);
                } else {//第一个
                    cypher0 += "n." + delete.getString (i);
                    first = false;
                }
        }

        cypher0+="'";
        try {
            try (Session session = DatabaseDao.driver.session()) {
                StatementResult result = session.run(cypher0);
            }
        }
        catch (Exception e){

        }


        //注入附加属性
        String cypher="match (n:"+labelName+"{";
        cypher +=   "name:'" + node.getString ("name");
        cypher += "'}) set ";
        first = true;
        for (String set:sets){
            if(!first) {//非第一个
                cypher += "',n." + set + "='" + node.getString (set);
            }else{//第一个
                cypher +=  "n."+set + "='" + node.getString (set);
                first = false;
            }
        }
        cypher+="'";
        try {
            try (Session session = DatabaseDao.driver.session ()) {
                StatementResult result = session.run (cypher);
            }
        }catch(Exception e){

        }
    }



    //根据name和depth查lable
    public JSONObject queryByNameAndDepth(String name, Integer depth,String label){
        System.out.println(name+"+++"+depth+"+++"+label);
        String cypher="match p=(na:"+label+")-[*1.."+depth+"]-()" +
                "where na.name = $name " +
                "UNWIND relationships(p) AS rel WITH DISTINCT rel AS r " +
                "WITH startNode(r) AS src,endNode(r) AS tar, type(r) AS t " +
                "RETURN {id:id(src), caption:src.name,properties:properties(src)} AS source, " +
                "{id:id(tar), caption:tar.name,properties:properties(tar)} AS target, " +
                "{source:src.name, target:tar.name, type: t} as links";
        JSONObject json;
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher, parameters("name", name));
            json = jsonUtil.resultToJsonObject(result);
        }
        System.out.println(json);
        return json;

    }


    //通过图谱名查询
    public JSONObject queryByLabel(String label){
        String cypher="match p=(na:"+label+")-[*1..]-()" +
                "UNWIND relationships(p) AS rel WITH DISTINCT rel AS r " +
                "WITH startNode(r) AS src,endNode(r) AS tar, type(r) AS t " +
                "RETURN {id:id(src), caption:src.name,properties:properties(src)} AS source, " +
                "{id:id(tar), caption:tar.name,properties:properties(tar)} AS target, " +
                "{source:src.name, target:tar.name, type: t} as links";
        JSONObject json;
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher, parameters("label", label));
            json = jsonUtil.resultToJsonObject(result);
        }
        System.out.println(json);
        return json;
    }
    //返回一个默认图谱
    public JSONObject defaultLabel(){
        String cypher="match p=(na:Md)-[*1..]-()" +
                "UNWIND relationships(p) AS rel WITH DISTINCT rel AS r " +
                "WITH startNode(r) AS src,endNode(r) AS tar, type(r) AS t " +
                "RETURN {id:id(src), caption:src.name,properties:properties(src)} AS source, " +
                "{id:id(tar), caption:tar.name,properties:properties(tar)} AS target, " +
                "{source:src.name, target:tar.name, type: t} as links";
        JSONObject json;
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
            json = jsonUtil.resultToJsonObject(result);
        }
        System.out.println(json);
        return json;
    }

    //根据场景查询
    public JSONObject selectLabelByScene(String label,String scene,String elements){
        String cypher = "MATCH (n:"+label +
                "{comment:'"+ scene+
                "'})-[r]-(p:"+ label +
                "{comment:'"+ elements +
                "'})-[t]-(w:"+ label +
                ") return {comment:w.comment,name:w.name,url:w.url} as nodes";


        JSONObject json;
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
            json = jsonUtil.resultToJsonObjectOnlyNode(result);
            System.out.println(json);
        }
        System.out.println(json);
        return json;
    }


    //删除图谱
    public void deleteLabel(String labelName){
        String cypher = "MATCH (n:"+labelName+")-[r]-() DELETE n,r";
        JSONObject json;
        try (Session session = DatabaseDao.driver.session()) {
            StatementResult result = session.run(cypher);
        }
        return ;
    }

}
