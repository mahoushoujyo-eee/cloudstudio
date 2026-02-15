package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.CourseComment;
import cn.openeee.cloudstudiobiz.services.CourseCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/course/comment")
public class CourseCommentController
{

    @Autowired
    private CourseCommentService courseCommentService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createCourseComment(@RequestBody CourseComment comment)
    {
        return courseCommentService.addCourseComment(comment);
    }

    @GetMapping("/{id}")
    public ServiceResponse<CourseComment> getCourseComment(@PathVariable long id)
    {
        return courseCommentService.getCourseComment(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateCourseComment(@RequestBody CourseComment comment)
    {
        return courseCommentService.updateCourseComment(comment);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteCourseComment(@PathVariable long id) {
        return courseCommentService.deleteCourseComment(id);
    }
}