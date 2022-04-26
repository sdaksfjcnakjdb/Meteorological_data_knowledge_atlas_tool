package com.sunsheen.neo4j_demo1.utils;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.neo4j.driver.v1.Record;
import org.neo4j.driver.v1.StatementResult;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class JsonUtil {


    public JSONObject resultToJsonObject(StatementResult result) {
        JSONObject json = new JSONObject();
        JSONArray nodes = new JSONArray();
        JSONArray links = new JSONArray();
        Set<Map<String, Object>> set = new HashSet<>();
        while (result.hasNext()) {
            Record record = result.next();
            Map<String, Object> src, tar;
            src = record.get("source").asMap();
            if (set.add(src)) {
                nodes.add(src);
            }

            tar = record.get("target").asMap();
            if (set.add(tar)) {
                nodes.add(tar);
            }

            links.add(record.get("links").asMap());
        }
        json.put("nodes", nodes);
        json.put("links", links);
        return json;
    }
    public JSONObject resultToJsonObjectOnlyNode(StatementResult result){
        JSONObject json = new JSONObject();
        JSONArray nodes = new JSONArray();
        while (result.hasNext()) {
            Record record = result.next();
            Map map =  record.get("nodes").asMap();
//            if(map.get("URL") != null){
//                String URL = (String) map.get("URL");
//                map.put("url",URL);
//                map.put("URL",null);
//            }
            nodes.add(map);
        }
        json.put("nodes", nodes);
        return json;
    }
}
