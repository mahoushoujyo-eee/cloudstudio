package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.CourseComment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseCommentMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CourseComment record);

    int insertSelective(CourseComment record);

    CourseComment selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CourseComment record);
}