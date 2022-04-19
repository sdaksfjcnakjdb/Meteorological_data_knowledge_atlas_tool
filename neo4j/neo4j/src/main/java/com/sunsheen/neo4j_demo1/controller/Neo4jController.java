package com.sunsheen.neo4j_demo1.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.sunsheen.neo4j_demo1.service.NodeService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/action")
public class Neo4jController extends HttpServlet {

    private NodeService nodeService = new NodeService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");
        System.out.println("action");
        String action = req.getParameter("action");
        System.out.println("================"+action);
        if(action.equals("creatLabel")) {//构造图谱
            creatLabel(req, resp);
        }else if(action.equals("queryByNameAndDepth")) {//根据层级和节点名查询
            queryByNameAndDepth(req, resp);
        }else if(action.equals("queryByLabel")) {//根据全局查询图谱
            queryByLabel(req, resp);
        }else if(action.equals("defaultLabel")) {//返回一个默认的图谱
            defaultLabel(req, resp);
        }else if(action.equals("updateLabel")) {//更新图谱
            updateLabel(req, resp);
        }

    }

    protected void queryByNameAndDepth(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String name = req.getParameter("name");
        String label = req.getParameter("label");
        Integer intdepth = Integer.parseInt(req.getParameter("depth"));
        JSONObject json = nodeService.queryByNameAndDepth(name, intdepth,label);
        PrintWriter out = resp.getWriter();
        System.out.println (json);
        out.println(json);
    }

    protected void creatLabel(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String jsonstr = req.getParameter("label");
        JSONObject label = JSON.parseObject(jsonstr);
        System.out.println("/////////////////////////////" +
                ""+label.toJSONString());
        nodeService.creatLabel(label);
        PrintWriter out = resp.getWriter();
        out.println("成功");
    }

    protected void queryByLabel(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String label = req.getParameter("label");
        JSONObject json = nodeService.queryByLabel(label);
        PrintWriter out = resp.getWriter();
        out.println(json);
    }

    protected void defaultLabel(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JSONObject json = nodeService.defaultLabel();
        PrintWriter out = resp.getWriter();
        out.println(json);
    }

    protected void updateLabel(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String jsonstr = req.getParameter("label");
        JSONObject label = JSON.parseObject(jsonstr);
        System.out.println(jsonstr);
        nodeService.updateLabel(label);
        PrintWriter out = resp.getWriter();
        out.println("成功");
    }
}
