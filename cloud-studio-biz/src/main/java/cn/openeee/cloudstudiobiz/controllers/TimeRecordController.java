package cn.openeee.cloudstudiobiz.controllers;

import cn.openeee.cloudstudiobiz.entities.TimeRecord;
import cn.openeee.cloudstudiobiz.services.TimeRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import stark.dataworks.boot.web.ServiceResponse;

@RestController
@RequestMapping("/time")
public class TimeRecordController {

    @Autowired
    private TimeRecordService timeRecordService;

    @PostMapping("/create")
    public ServiceResponse<Boolean> createTimeRecord(@RequestBody TimeRecord record) {
        return timeRecordService.addTimeRecord(record);
    }

    @GetMapping("/{id}")
    public ServiceResponse<TimeRecord> getTimeRecord(@PathVariable long id) {
        return timeRecordService.getTimeRecord(id);
    }

    @PutMapping("/update")
    public ServiceResponse<Boolean> updateTimeRecord(@RequestBody TimeRecord record) {
        return timeRecordService.updateTimeRecord(record);
    }

    @DeleteMapping("/{id}")
    public ServiceResponse<Boolean> deleteTimeRecord(@PathVariable long id) {
        return timeRecordService.deleteTimeRecord(id);
    }
}