package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.CourseRecord;
import cn.openeee.cloudstudiobiz.services.CourseRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/course/record")
public class CourseRecordController {

    @Autowired
    private CourseRecordService courseRecordService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createCourseRecord(@RequestBody CourseRecord record) {
        return courseRecordService.addCourseRecord(record);
    }

    @GetMapping("/{id}")
    public ServiceResponse<CourseRecord> getCourseRecord(@PathVariable long id) {
        return courseRecordService.getCourseRecord(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateCourseRecord(@RequestBody CourseRecord record) {
        return courseRecordService.updateCourseRecord(record);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteCourseRecord(@PathVariable long id) {
        return courseRecordService.deleteCourseRecord(id);
    }
}