package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.dto.GetApplicationListParam;
import cn.openeee.cloudstudiobiz.entities.ApplicationInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ApplicationInfoMapper
{
    int deleteByPrimaryKey(Long id);

    int insert(ApplicationInfo record);

    int insertSelective(ApplicationInfo record);

    ApplicationInfo selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ApplicationInfo record);
    
    List<ApplicationInfo> selectByPagination(GetApplicationListParam param);
}