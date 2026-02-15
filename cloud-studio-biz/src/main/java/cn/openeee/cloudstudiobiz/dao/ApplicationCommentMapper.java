package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.ApplicationComment;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApplicationCommentMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ApplicationComment record);

    int insertSelective(ApplicationComment record);

    ApplicationComment selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ApplicationComment record);
}