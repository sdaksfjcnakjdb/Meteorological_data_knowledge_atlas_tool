package com.xbstar.graph.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.xbstar.graph.dao.InstitutionMapper;
import com.xbstar.graph.dao.PersonMapper;
import com.xbstar.graph.domain.Institution;
import com.xbstar.graph.domain.Person;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by Simon on 2019/9/12 15:09
 */
@Controller
@RequestMapping("/graph")
public class GraphController {
    @Resource
    PersonMapper mapper;
    @Resource
    InstitutionMapper institutionMapper;

    @RequestMapping("/index")
    public String index(Model model){

        //jsonString数据
        try {
            model.addAttribute("dataJson",findAll().toJSONString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "graph";
    }

    @RequestMapping("/findAll")
    @ResponseBody
    public JSONObject findAll() throws IOException {
        JSONObject dataJSon = new JSONObject(true);
        JSONArray nodes = new JSONArray();
        JSONArray links = new JSONArray();
        JSONArray categories = new JSONArray();
        //List nodes = new ArrayList();
        //List links = new ArrayList();
        AtomicInteger i = new AtomicInteger(0);
        List<Person> persons = mapper.findAll();
        List<Institution> institutions = institutionMapper.findAllInstitution();

        JSONObject nodePerson = new JSONObject(true);
        JSONObject nodeInstitution = new JSONObject(true);

        nodePerson.put("id",i.getAndIncrement());
        nodePerson.put("category", 0);
        nodePerson.put("level", 0);
        nodePerson.put("name", "老人");
        nodePerson.put("value", "");
        nodePerson.put("label", "老人");
        nodePerson.put("flag", false);

        nodeInstitution.put("id",i.getAndIncrement());
        nodeInstitution.put("category", 1);
        nodeInstitution.put("level", 0);
        nodeInstitution.put("name", "机构");
        nodeInstitution.put("value", "");
        nodeInstitution.put("label", "机构");
        nodeInstitution.put("flag", false);

        nodes.add(nodePerson);
        nodes.add(nodeInstitution);

        persons.stream().forEach(item->{
            JSONObject node = new JSONObject(true);
            node.put("id", i.getAndIncrement());
            node.put("category", 2);
            node.put("level", 1);
            node.put("name", item.getName());
            node.put("value", item.getId()+"");
            node.put("label", "person");
            node.put("flag", true);
            nodes.add(node);

            JSONObject link1 = new JSONObject(true);
            link1.put("source",node.getInteger("id"));
            link1.put("target",nodePerson.getInteger("id"));
            //link1.put("label",node.get("name")+"->"+nodePerson.get("name"));
            links.add(link1);

        });

        institutions.stream().forEach(item->{
            JSONObject node = new JSONObject(true);
            node.put("id", i.getAndIncrement());
            node.put("category", 3);
            node.put("level", 1);
            node.put("name", item.getInstitution_name());
            node.put("value", item.getId()+"");
            node.put("label", "institution");
            node.put("flag", true);
            nodes.add(node);

            JSONObject link1 = new JSONObject(true);
            link1.put("source",node.getInteger("id"));
            link1.put("target",nodeInstitution.getInteger("id"));
            //link1.put("label",nodeInstitution.get("name")+"->"+node.get("name"));
            links.add(link1);

        });


        List<String> list = new ArrayList<>(Arrays.asList("老人", "姓名", "机构", "机构名"));
        list.stream().forEach(item->{
            JSONObject category = new JSONObject();
            category.put("name",item);
            categories.add(category);
        });

//        writeToJson("E:\\File\\Visualization\\kg_nodes.json", nodes);
//        writeToJson("E:\\File\\Visualization\\kg_links.json" ,links);
//        System.out.println("Write Finish");

        dataJSon.put("categories",categories);
        dataJSon.put("nodes",nodes);
        dataJSon.put("links",links);

        //writeToJson("E:\\File\\Visualization\\dataJson.json" ,dataJson);
        return dataJSon;
    }
}
