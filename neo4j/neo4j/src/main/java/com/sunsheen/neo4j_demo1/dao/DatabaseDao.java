package com.sunsheen.neo4j_demo1.dao;

import org.neo4j.driver.v1.AuthTokens;
import org.neo4j.driver.v1.Driver;
import org.neo4j.driver.v1.GraphDatabase;

public class DatabaseDao implements AutoCloseable{
    public static String uurl = "555";
//    public static Driver driver = GraphDatabase.driver( "bolt://172.18.194.215:7687", AuthTokens.basic( "neo4j", "neo4j" ) );
//    public static Driver driver = GraphDatabase.driver( "bolt://localhost:7687", AuthTokens.basic( "neo4j", "Jufeng2010" ) );
    public static Driver driver = GraphDatabase.driver( "bolt://localhost:7687", AuthTokens.basic( "neo4j", "neo4j" ) );

    public static void con(String url, String name, String password){
        driver.close();
        driver = GraphDatabase.driver( url, AuthTokens.basic( name, password ) );
        uurl = url;
    }

    @Override
    public void close() throws Exception
    {
        driver.close();
    }
}
