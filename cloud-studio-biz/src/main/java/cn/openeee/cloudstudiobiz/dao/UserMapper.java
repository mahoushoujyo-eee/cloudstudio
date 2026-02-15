package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.UserInfo;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper
{
    UserInfo selectByPrimaryKey(long userId);

    int updateByPrimaryKeySelective(UserInfo userInfo);
    
    int insert(UserInfo record);
    
    int insertSelective(UserInfo record);
}