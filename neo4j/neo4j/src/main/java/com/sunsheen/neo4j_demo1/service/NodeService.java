package com.sunsheen.neo4j_demo1.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.sunsheen.neo4j_demo1.dao.Neo4jDao;
import java.util.Iterator;

public class NodeService {

    private Neo4jDao neo4jDao = new Neo4jDao();

    //===========================查询========================================

    //通过节点名字和层级搜索
    public JSONObject queryByNameAndDepth(String name, Integer depth,String label){
        JSONObject json = neo4jDao.queryByNameAndDepth(name, depth,label);
        return json;
    }

    //通过图谱名查询
    public JSONObject queryByLabel(String label){
        JSONObject json = neo4jDao.queryByLabel(label);
        return json;
    }
    //返回一个默认图谱
    public JSONObject defaultLabel(){
        JSONObject json = neo4jDao.defaultLabel();
        return json;
    }

    //图谱查询对比


    //=========================创建初始图谱=====================
    //整张图谱保存
    public void creatLabel(JSONObject label){
        String labelName = label.getJSONArray("label").getJSONObject(0).getString("labelName");
        JSONArray nodes = label.getJSONArray("nodes");
        JSONArray links = label.getJSONArray("links");
        System.out.println ("******************************************************");
        System.out.println(labelName);
        System.out.println(nodes.toJSONString());
        System.out.println(links.toJSONString());
        Iterator it = nodes.iterator();
        while(it.hasNext()) {
            JSONObject node = (JSONObject)it.next();

            neo4jDao.creatNode(labelName, node);
        }
        it = links.iterator();
        while(it.hasNext()) {
            JSONObject link = (JSONObject)it.next();
            neo4jDao.creatLink(labelName, link.getString("source"), link.getString("type"), link.getString("target"));
        }

    }

    //=========================更新图谱=====================
    public void updateLabel(JSONObject label) {
        //删除整张图谱
        String labelName = label.getJSONArray("label").getJSONObject(0).getString("labelName");
        System.out.println("label "+labelName+"");
        neo4jDao.deleteLabel(labelName);
        System.out.println("delete label "+labelName+"success");
        //整张图谱保存
        creatLabel(label);
    }
}
