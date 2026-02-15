package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.dto.GetApplicationListParam;
import cn.openeee.cloudstudiobiz.dto.ResourceParam;
import cn.openeee.cloudstudiobiz.dto.SetApplicationCoverParam;
import cn.openeee.cloudstudiobiz.entities.ApplicationInfo;
import cn.openeee.cloudstudiobiz.services.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.PaginatedData;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;

@RestController
@RequestMapping("/application")
public class ApplicationController {
    @Autowired
    private ApplicationService applicationService;
    
    @PostMapping("/create")
    public ServiceResponse<Boolean> createApplication(@RequestBody ApplicationInfo applicationInfo) {
        return applicationService.addApplication(applicationInfo);
    }

    @PostMapping("/stop")
    public ServiceResponse<Boolean> stopApplication(@RequestParam long applicationId) {
        // TODO: 实现停止应用的业务逻辑
        return ServiceResponse.buildSuccessResponse(true);
    }

    @PostMapping("/restart")
    public ServiceResponse<Boolean> restartApplication(@RequestParam long applicationId) {
        // TODO: 实现重启应用的业务逻辑
        return ServiceResponse.buildSuccessResponse(true);
    }

    @DeleteMapping("/delete")
    public ServiceResponse<Boolean> deleteApplication(@RequestParam long applicationId) {
        return applicationService.deleteApplication(applicationId);
    }

    @PostMapping("/update")
    public ServiceResponse<Boolean> updateApplicationInfo(@RequestBody ApplicationInfo applicationInfo) {
        return applicationService.updateApplication(applicationInfo);
    }

    @PostMapping("/change")
    public ServiceResponse<Boolean> changeApplicationVisibility(@RequestParam long applicationId, @RequestParam boolean isVisible) {
        // TODO: 实现更改应用可见性的业务逻辑
        return ServiceResponse.buildSuccessResponse(true);
    }

    @PostMapping("/fork")
    public ServiceResponse<Boolean> forkApplication(@RequestParam long applicationId)
    {
        return applicationService.forkApplication(applicationId);
    }

    @GetMapping("/list")
    public ServiceResponse<PaginatedData<ApplicationInfo>> getApplicationList(@RequestBody GetApplicationListParam param)
    {
        return applicationService.getApplicationList(param);
    }

    @GetMapping("/template")
    public ServiceResponse<PaginatedData<ApplicationInfo>> getApplicationTemplate()
    {
        // TODO: 实现获取应用模板的业务逻辑
        return ServiceResponse.buildSuccessResponse(null);
    }

    @PostMapping("/template")
    public ServiceResponse<Boolean> createApplicationTemplate(@RequestBody ApplicationInfo applicationInfo)
    {
        return null;
    }
    
    @PostMapping("/cover")
    public ServiceResponse<URL> setApplicationCover(@RequestBody SetApplicationCoverParam applicationInfo)
    {
        return applicationService.setApplicationCover(applicationInfo);
    }

    @PostMapping("/comment")
    public ServiceResponse<Boolean> addComment()
    {
        // TODO: 实现添加评论的业务逻辑
        return ServiceResponse.buildSuccessResponse(true);
    }
    
    @GetMapping("/{id}")
    public ServiceResponse<ApplicationInfo> getApplication(@PathVariable long id) {
        return applicationService.getApplication(id);
    }
}