package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.CourseRecordMapper;
import cn.openeee.cloudstudiobiz.entities.CourseRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class CourseRecordService {

    @Autowired
    private CourseRecordMapper courseRecordMapper;

    public ServiceResponse<Boolean> addCourseRecord(CourseRecord record) {
        int affected = courseRecordMapper.insertSelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<CourseRecord> getCourseRecord(long recordId) {
        CourseRecord record = courseRecordMapper.selectByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(record);
    }

    public ServiceResponse<Boolean> deleteCourseRecord(long recordId) {
        int affected = courseRecordMapper.deleteByPrimaryKey(recordId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateCourseRecord(CourseRecord record) {
        int affected = courseRecordMapper.updateByPrimaryKeySelective(record);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}