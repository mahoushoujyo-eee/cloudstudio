package cn.openeee.cloudstudiobiz.dao;

import cn.openeee.cloudstudiobiz.entities.ChapterDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ChapterDetailMapper {
    int deleteByPrimaryKey(Long id);
    
    int insert(ChapterDetail record);
    
    int insertSelective(ChapterDetail record);
    
    ChapterDetail selectByPrimaryKey(Long id);
    
    int updateByPrimaryKeySelective(ChapterDetail record);
    
    int updateByPrimaryKey(ChapterDetail record);
    
    // 根据课程ID获取章节列表
    List<ChapterDetail> selectByCourseId(@Param("courseId") Long courseId);
    
    // 批量插入章节
    int batchInsert(@Param("chapters") List<ChapterDetail> chapters);
    
    // 根据课程ID删除章节
    int deleteByCourseId(@Param("courseId") Long courseId);
}