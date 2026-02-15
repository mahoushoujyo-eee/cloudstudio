package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.ChapterDetailMapper;
import cn.openeee.cloudstudiobiz.entities.ChapterDetail;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

import java.util.List;

@Slf4j
@Service
@LogArgumentsAndResponse
public class ChapterDetailService {
    
    @Autowired
    private ChapterDetailMapper chapterDetailMapper;
    
    /**
     * 创建章节
     */
    public ServiceResponse<Boolean> createChapter(ChapterDetail chapterDetail) {
        int affected = chapterDetailMapper.insertSelective(chapterDetail);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
    
    /**
     * 批量创建课程章节
     */
    public ServiceResponse<Boolean> batchCreateChapters(List<ChapterDetail> chapters) {
        if (chapters == null || chapters.isEmpty()) {
            return ServiceResponse.buildSuccessResponse(true);
        }
        
        int affected = chapterDetailMapper.batchInsert(chapters);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
    
    /**
     * 根据ID获取章节详情
     */
    public ServiceResponse<ChapterDetail> getChapterById(Long id) {
        ChapterDetail chapter = chapterDetailMapper.selectByPrimaryKey(id);
        return ServiceResponse.buildSuccessResponse(chapter);
    }
    
    /**
     * 根据课程ID获取章节列表
     */
    public ServiceResponse<List<ChapterDetail>> getChaptersByCourseId(Long courseId) {
        List<ChapterDetail> chapters = chapterDetailMapper.selectByCourseId(courseId);
        return ServiceResponse.buildSuccessResponse(chapters);
    }
    
    /**
     * 更新章节信息
     */
    public ServiceResponse<Boolean> updateChapter(ChapterDetail chapterDetail) {
        int affected = chapterDetailMapper.updateByPrimaryKeySelective(chapterDetail);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
    
    /**
     * 删除章节
     */
    public ServiceResponse<Boolean> deleteChapter(Long id) {
        int affected = chapterDetailMapper.deleteByPrimaryKey(id);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
    
    /**
     * 根据课程ID删除章节
     */
    public ServiceResponse<Boolean> deleteChaptersByCourseId(Long courseId) {
        int affected = chapterDetailMapper.deleteByCourseId(courseId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}