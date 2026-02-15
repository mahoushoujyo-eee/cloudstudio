package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.TimeRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TimeRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(TimeRecord record);

    int insertSelective(TimeRecord record);

    TimeRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(TimeRecord record);
}