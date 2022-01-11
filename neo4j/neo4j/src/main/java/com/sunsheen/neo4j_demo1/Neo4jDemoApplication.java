package com.sunsheen.neo4j_demo1;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

//开启缓存
@EnableCaching
//扫描ORM映射包
//@MapperScan(basePackages = {"com.sunsheen.neo4j.mapper"})
@SpringBootApplication
public class Neo4jDemoApplication  {


    public static void main(String[] args)throws Exception {

       SpringApplication.run(Neo4jDemoApplication.class, args);
    }

}
