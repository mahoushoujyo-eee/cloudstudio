package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.ApplicationComment;
import cn.openeee.cloudstudiobiz.services.ApplicationCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/application/comment")
public class ApplicationCommentController {

    @Autowired
    private ApplicationCommentService applicationCommentService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createApplicationComment(@RequestBody ApplicationComment comment) {
        return applicationCommentService.addApplicationComment(comment);
    }

    @GetMapping("/{id}")
    public ServiceResponse<ApplicationComment> getApplicationComment(@PathVariable long id) {
        return applicationCommentService.getApplicationComment(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateApplicationComment(@RequestBody ApplicationComment comment) {
        return applicationCommentService.updateApplicationComment(comment);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteApplicationComment(@PathVariable long id) {
        return applicationCommentService.deleteApplicationComment(id);
    }
}