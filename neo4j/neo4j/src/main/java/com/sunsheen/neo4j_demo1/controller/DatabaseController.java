package com.sunsheen.neo4j_demo1.controller;

import com.sunsheen.neo4j_demo1.service.DatabaseService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/database")
public class DatabaseController extends HttpServlet {

    private DatabaseService databaseService = new DatabaseService();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("text/html;charset=utf-8");

        String url = req.getParameter("url");
        String name = req.getParameter("name");
        String password = req.getParameter("password");
        String result = databaseService.con(url,name,password);
        PrintWriter out = resp.getWriter();
        out.println(result);
    }
}
