package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.ApplicationActivityRecord;
import cn.openeee.cloudstudiobiz.services.ApplicationActivityRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/application/activity")
public class ApplicationActivityRecordController {

    @Autowired
    private ApplicationActivityRecordService applicationActivityRecordService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createApplicationActivityRecord(@RequestBody ApplicationActivityRecord record)
    {
        return applicationActivityRecordService.addApplicationActivityRecord(record);
    }

    @GetMapping("/{id}")
    public ServiceResponse<ApplicationActivityRecord> getApplicationActivityRecord(@PathVariable long id)
    {
        return applicationActivityRecordService.getApplicationActivityRecord(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateApplicationActivityRecord(@RequestBody ApplicationActivityRecord record)
    {
        return applicationActivityRecordService.updateApplicationActivityRecord(record);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteApplicationActivityRecord(@PathVariable long id)
    {
        return applicationActivityRecordService.deleteApplicationActivityRecord(id);
    }
}