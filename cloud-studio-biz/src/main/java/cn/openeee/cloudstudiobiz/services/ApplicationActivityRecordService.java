package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.ApplicationActivityRecordMapper;
import cn.openeee.cloudstudiobiz.entities.ApplicationActivityRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class ApplicationActivityRecordService {

    @Autowired
    private ApplicationActivityRecordMapper applicationActivityRecordMapper;

    public ServiceResponse<Boolean> addApplicationActivityRecord(ApplicationActivityRecord record) {
        int affected = applicationActivityRecordMapper.insertSelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<ApplicationActivityRecord> getApplicationActivityRecord(long recordId) {
        ApplicationActivityRecord record = applicationActivityRecordMapper.selectByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(record);
    }

    public ServiceResponse<Boolean> deleteApplicationActivityRecord(long recordId) {
        int affected = applicationActivityRecordMapper.deleteByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateApplicationActivityRecord(ApplicationActivityRecord record) {
        int affected = applicationActivityRecordMapper.updateByPrimaryKeySelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}