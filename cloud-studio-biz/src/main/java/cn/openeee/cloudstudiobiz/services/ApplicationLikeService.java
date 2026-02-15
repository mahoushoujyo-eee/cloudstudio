package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.ApplicationLikeMapper;
import cn.openeee.cloudstudiobiz.entities.ApplicationLike;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class ApplicationLikeService {

    @Autowired
    private ApplicationLikeMapper applicationLikeMapper;

    public ServiceResponse<Boolean> addApplicationLike(ApplicationLike like) {
        int affected = applicationLikeMapper.insertSelective(like);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<ApplicationLike> getApplicationLike(long likeId) {
        ApplicationLike like = applicationLikeMapper.selectByPrimaryKey(likeId);
        return ServiceResponse.buildSuccessResponse(like);
    }

    public ServiceResponse<Boolean> deleteApplicationLike(long likeId) {
        int affected = applicationLikeMapper.deleteByPrimaryKey(likeId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateApplicationLike(ApplicationLike like) {
        int affected = applicationLikeMapper.updateByPrimaryKeySelective(like);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}