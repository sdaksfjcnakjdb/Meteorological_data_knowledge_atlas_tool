package com.sunsheen.neo4j_demo1.controller;

import com.alibaba.fastjson.JSON;
import com.sunsheen.neo4j_demo1.service.NodeService;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/outApi")
public class OutController extends HttpServlet {
    private NodeService nodeService = new NodeService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");
        System.out.println("outApi");
        String scene = req.getParameter("scene");
        System.out.println("================"+scene);
        String elements = req.getParameter("elements");
        System.out.println("================"+elements);
         String label = req.getParameter("label");
        System.out.println("================"+label);
        PrintWriter out = resp.getWriter();

        JSON  json = nodeService.selectLabelByScene(scene,elements,label);
        System.out.println("controller:"+json);
        out.println(json);
    }
}
