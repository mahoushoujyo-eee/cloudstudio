package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.CourseRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CourseRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CourseRecord record);

    int insertSelective(CourseRecord record);

    CourseRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CourseRecord record);
}