package cn.openeee.cloudstudiobiz;

import cn.openeee.cloudstudiobiz.entities.ChapterDetail;
import cn.openeee.cloudstudiobiz.services.ChapterDetailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import stark.dataworks.boot.web.ServiceResponse;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
public class ChapterDetailServiceTest {

    @Autowired
    private ChapterDetailService chapterDetailService;

    @Test
    public void testCreateChapter() {
        ChapterDetail chapter = new ChapterDetail();
        chapter.setCourseId(1L);
        chapter.setTitle("测试章节");
        chapter.setDescription("这是一个测试章节");

        ServiceResponse<Boolean> response = chapterDetailService.createChapter(chapter);
        System.out.println("创建章节结果: " + response.isSuccess());
    }

    @Test
    public void testBatchCreateChapters() {
        List<ChapterDetail> chapters = new ArrayList<>();
        
        ChapterDetail chapter1 = new ChapterDetail();
        chapter1.setCourseId(1L);
        chapter1.setTitle("第一章 Java基础");
        chapter1.setDescription("介绍Java语言的基本概念和语法");
        
        ChapterDetail chapter2 = new ChapterDetail();
        chapter2.setCourseId(1L);
        chapter2.setTitle("第二章 面向对象编程");
        chapter2.setDescription("深入理解面向对象编程的概念");
        
        chapters.add(chapter1);
        chapters.add(chapter2);
        
        ServiceResponse<Boolean> response = chapterDetailService.batchCreateChapters(chapters);
        System.out.println("批量创建章节结果: " + response.isSuccess());
    }

    @Test
    public void testGetChaptersByCourseId() {
        ServiceResponse<List<ChapterDetail>> response = chapterDetailService.getChaptersByCourseId(1L);
        if (response.isSuccess() && response.getData() != null) {
            System.out.println("查询到 " + response.getData().size() + " 个章节");
            for (ChapterDetail chapter : response.getData()) {
                System.out.println("章节: " + chapter.getTitle() + " - " + chapter.getDescription());
            }
        }
    }
}