package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.CourseLike;
import cn.openeee.cloudstudiobiz.services.CourseLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/course/like")
public class CourseLikeController {

    @Autowired
    private CourseLikeService courseLikeService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createCourseLike(@RequestBody CourseLike like) {
        return courseLikeService.addCourseLike(like);
    }

    @GetMapping("/{id}")
    public ServiceResponse<CourseLike> getCourseLike(@PathVariable long id) {
        return courseLikeService.getCourseLike(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateCourseLike(@RequestBody CourseLike like) {
        return courseLikeService.updateCourseLike(like);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteCourseLike(@PathVariable long id) {
        return courseLikeService.deleteCourseLike(id);
    }
}