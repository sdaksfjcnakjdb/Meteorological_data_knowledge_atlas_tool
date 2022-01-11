package com.xbstar.graph.dao;

import com.xbstar.graph.domain.Institution;
import com.xbstar.graph.domain.Person;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * Created by Simon on 2019/9/23 13:29
 */
@Mapper
public interface PersonMapper {
    List<Person> findAll ();

    Person findById(long id);

}
