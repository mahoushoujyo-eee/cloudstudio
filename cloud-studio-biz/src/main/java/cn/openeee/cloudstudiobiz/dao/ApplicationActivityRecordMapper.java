package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.ApplicationActivityRecord;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApplicationActivityRecordMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ApplicationActivityRecord record);

    int insertSelective(ApplicationActivityRecord record);

    ApplicationActivityRecord selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ApplicationActivityRecord record);
}