package com.xbstar.graph;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@MapperScan("com.xbstar.graph.dao")
public class GraphApplication {

    public static void main(String[] args) {

        int a[] = new int[]{1,22,34,231,32,44,56,34,67,24,65,78,76,54,66,64};


        SpringApplication.run(GraphApplication.class, args);
    }

    public static List sort(int a[],int target){

        return null;
    }
}
