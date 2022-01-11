package com.xbstar.graph.dao;

import com.xbstar.graph.domain.Institution;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by Simon on 2019/9/23 13:29
 */
@Mapper
public interface InstitutionMapper {
    Institution findById(long id);

    List<Institution> findAllInstitution();
}
