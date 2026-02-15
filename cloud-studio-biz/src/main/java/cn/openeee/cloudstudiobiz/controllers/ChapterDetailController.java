package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.dto.BatchCreateChaptersParam;
import cn.openeee.cloudstudiobiz.entities.ChapterDetail;
import cn.openeee.cloudstudiobiz.services.ChapterDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

import java.util.List;

@RestController
@RequestMapping("/chapter")
public class ChapterDetailController {
    
    @Autowired
    private ChapterDetailService chapterDetailService;
    
    /**
     * 创建单个章节
     */
    @PostMapping("/create")
    public ServiceResponse<Boolean> createChapter(@RequestBody ChapterDetail chapterDetail) {
        return chapterDetailService.createChapter(chapterDetail);
    }
    
    /**
     * 批量创建课程章节
     */
    @PostMapping("/batch-create")
    public ServiceResponse<Boolean> batchCreateChapters(@RequestBody BatchCreateChaptersParam param) {
        // 设置每个章节的courseId
        if (param.getChapters() != null) {
            for (ChapterDetail chapter : param.getChapters()) {
                chapter.setCourseId(param.getCourseId());
            }
        }
        return chapterDetailService.batchCreateChapters(param.getChapters());
    }
    
    /**
     * 根据ID获取章节详情
     */
    @GetMapping("/{id}")
    public ServiceResponse<ChapterDetail> getChapterById(@PathVariable Long id) {
        return chapterDetailService.getChapterById(id);
    }
    
    /**
     * 根据课程ID获取章节列表
     */
    @GetMapping("/list")
    public ServiceResponse<List<ChapterDetail>> getChaptersByCourseId(@RequestParam Long courseId) {
        return chapterDetailService.getChaptersByCourseId(courseId);
    }
    
    /**
     * 更新章节信息
     */
    @PostMapping("/update")
    public ServiceResponse<Boolean> updateChapter(@RequestBody ChapterDetail chapterDetail) {
        return chapterDetailService.updateChapter(chapterDetail);
    }
    
    /**
     * 删除章节
     */
    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteChapter(@PathVariable Long id) {
        return chapterDetailService.deleteChapter(id);
    }
    
    /**
     * 根据课程ID删除章节
     */
    @DeleteMapping("/by-course")
    public ServiceResponse<Boolean> deleteChaptersByCourseId(@RequestParam Long courseId) {
        return chapterDetailService.deleteChaptersByCourseId(courseId);
    }
}