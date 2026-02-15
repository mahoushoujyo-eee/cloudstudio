package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.CourseCommentMapper;
import cn.openeee.cloudstudiobiz.entities.CourseComment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class CourseCommentService {

    @Autowired
    private CourseCommentMapper courseCommentMapper;

    public ServiceResponse<Boolean> addCourseComment(CourseComment comment)
    {
        int affected = courseCommentMapper.insertSelective(comment);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<CourseComment> getCourseComment(long commentId) {
        CourseComment comment = courseCommentMapper.selectByPrimaryKey(commentId);
        return ServiceResponse.buildSuccessResponse(comment);
    }

    public ServiceResponse<Boolean> deleteCourseComment(long commentId) {
        int affected = courseCommentMapper.deleteByPrimaryKey(commentId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateCourseComment(CourseComment comment) {
        int affected = courseCommentMapper.updateByPrimaryKeySelective(comment);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}