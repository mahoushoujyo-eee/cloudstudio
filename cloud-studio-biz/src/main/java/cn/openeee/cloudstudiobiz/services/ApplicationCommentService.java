package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.ApplicationCommentMapper;
import cn.openeee.cloudstudiobiz.entities.ApplicationComment;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class ApplicationCommentService {

    @Autowired
    private ApplicationCommentMapper applicationCommentMapper;

    public ServiceResponse<Boolean> addApplicationComment(ApplicationComment comment) {
        int affected = applicationCommentMapper.insertSelective(comment);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<ApplicationComment> getApplicationComment(long commentId) {
        ApplicationComment comment = applicationCommentMapper.selectByPrimaryKey(commentId);
        return ServiceResponse.buildSuccessResponse(comment);
    }

    public ServiceResponse<Boolean> deleteApplicationComment(long commentId) {
        int affected = applicationCommentMapper.deleteByPrimaryKey(commentId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateApplicationComment(ApplicationComment comment) {
        int affected = applicationCommentMapper.updateByPrimaryKeySelective(comment);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}