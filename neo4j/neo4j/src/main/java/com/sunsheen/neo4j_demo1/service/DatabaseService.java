package com.sunsheen.neo4j_demo1.service;

import com.sunsheen.neo4j_demo1.dao.DatabaseDao;

public class DatabaseService {

    public String con(String url, String name, String password){
        System.out.println("正在切换数据库，原数据库："+DatabaseDao.uurl);
        DatabaseDao.con(url,name,password);
        System.out.println("切换数据库成功，现数据库："+DatabaseDao.uurl);
        return "切换成功";
    }
}
