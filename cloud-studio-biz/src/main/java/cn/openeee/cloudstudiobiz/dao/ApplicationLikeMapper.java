package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.ApplicationLike;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApplicationLikeMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ApplicationLike record);

    int insertSelective(ApplicationLike record);

    ApplicationLike selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ApplicationLike record);
}