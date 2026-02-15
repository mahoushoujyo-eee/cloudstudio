package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.dto.GetCourseCommentParam;
import cn.openeee.cloudstudiobiz.dto.GetCourseListParam;
import cn.openeee.cloudstudiobiz.dto.SetCourseCoverParam;
import cn.openeee.cloudstudiobiz.entities.CourseComment;
import cn.openeee.cloudstudiobiz.entities.CourseInfo;
import cn.openeee.cloudstudiobiz.services.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.PaginatedData;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;

@RestController
@RequestMapping("/course")
public class CourseController
{
    @Autowired
    private CourseService courseService;

    @GetMapping("/list")
    public ServiceResponse<PaginatedData<CourseInfo>> getCourseList(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String tags,
            @RequestParam(defaultValue = "0") int pageIndex,
            @RequestParam(defaultValue = "10") int pageOffset)
    {
        GetCourseListParam param = new GetCourseListParam();
        param.setTitle(title);
        param.setTags(tags);
        param.setCurrent(pageIndex);
        param.setOffset(pageOffset);
        return courseService.getCourseList(param);
    }

    @PostMapping("/create")
    public ServiceResponse<Boolean> createCourse(@RequestBody CourseInfo courseInfo)
    {
        return courseService.createCourse(courseInfo);
    }

    @DeleteMapping("/delete")
    public ServiceResponse<Boolean> deleteCourse(@RequestParam long courseId)
    {
        return courseService.deleteCourse(courseId);
    }

    @PostMapping("/update")
    public ServiceResponse<Boolean> updateCourseInfo(@RequestBody CourseInfo courseInfo)
    {
        return courseService.updateCourse(courseInfo);
    }
    
    @PostMapping("/cover")
    public ServiceResponse<URL> setCourseCover(@RequestBody SetCourseCoverParam courseInfo)
    {
        return courseService.setCourseCover(courseInfo);
    }

    @PostMapping("/comment")
    public ServiceResponse<Boolean> addCourseComment(@RequestBody CourseComment courseComment)
    {
        return courseService.addCourseComment(courseComment);
    }

    @GetMapping("/comment")
    public ServiceResponse<PaginatedData<CourseComment>> getCourseComments(@RequestBody GetCourseCommentParam param)
    {
        // TODO: 实现获取课程评论的业务逻辑
        return ServiceResponse.buildSuccessResponse(null);
    }

    @DeleteMapping("/comment")
    public ServiceResponse<Boolean> deleteCourseComment(@RequestParam long commentId)
    {
        return courseService.deleteCourseComment(commentId);
    }
    
    @GetMapping("/{id}")
    public ServiceResponse<CourseInfo> getCourseInfo(@PathVariable long id)
    {
        return courseService.getCourseInfo(id);
    }
}