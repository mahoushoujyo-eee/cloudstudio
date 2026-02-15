package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.CourseLike;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseLikeMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CourseLike record);

    int insertSelective(CourseLike record);

    CourseLike selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CourseLike record);
}