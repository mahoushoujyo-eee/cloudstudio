package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.dto.GetCourseListParam;
import cn.openeee.cloudstudiobiz.entities.CourseInfo;
import org.apache.ibatis.annotations.Mapper;
import stark.dataworks.boot.web.PaginatedData;

import java.util.List;

@Mapper
public interface CourseInfoMapper
{
    int deleteByPrimaryKey(Long id);

    int insert(CourseInfo record);

    int insertSelective(CourseInfo record);

    CourseInfo selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CourseInfo record);

    List<CourseInfo> selectByPagination(GetCourseListParam param);
}
