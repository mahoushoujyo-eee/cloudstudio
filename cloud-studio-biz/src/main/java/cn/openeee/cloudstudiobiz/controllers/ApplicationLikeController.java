package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.ApplicationLike;
import cn.openeee.cloudstudiobiz.services.ApplicationLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/application/like")
public class ApplicationLikeController {

    @Autowired
    private ApplicationLikeService applicationLikeService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createApplicationLike(@RequestBody ApplicationLike like) {
        return applicationLikeService.addApplicationLike(like);
    }

    @GetMapping("/{id}")
    public ServiceResponse<ApplicationLike> getApplicationLike(@PathVariable long id) {
        return applicationLikeService.getApplicationLike(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateApplicationLike(@RequestBody ApplicationLike like) {
        return applicationLikeService.updateApplicationLike(like);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteApplicationLike(@PathVariable long id) {
        return applicationLikeService.deleteApplicationLike(id);
    }
}