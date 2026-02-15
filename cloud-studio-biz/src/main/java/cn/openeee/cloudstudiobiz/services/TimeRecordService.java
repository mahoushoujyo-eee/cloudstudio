package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.TimeRecordMapper;
import cn.openeee.cloudstudiobiz.entities.TimeRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class TimeRecordService {

    @Autowired
    private TimeRecordMapper timeRecordMapper;

    public ServiceResponse<Boolean> addTimeRecord(TimeRecord record)
    {
        int affected = timeRecordMapper.insertSelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<TimeRecord> getTimeRecord(long recordId)
    {
        TimeRecord record = timeRecordMapper.selectByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(record);
    }

    public ServiceResponse<Boolean> deleteTimeRecord(long recordId)
    {
        int affected = timeRecordMapper.deleteByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateTimeRecord(TimeRecord record)
    {
        int affected = timeRecordMapper.updateByPrimaryKeySelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}