package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.dao.CourseLikeMapper;
import cn.openeee.cloudstudiobiz.entities.CourseLike;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

@Service
@Slf4j
@LogArgumentsAndResponse
public class CourseLikeService {

    @Autowired
    private CourseLikeMapper courseLikeMapper;

    public ServiceResponse<Boolean> addCourseLike(CourseLike like) {
        int affected = courseLikeMapper.insertSelective(like);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<CourseLike> getCourseLike(long likeId) {
        CourseLike like = courseLikeMapper.selectByPrimaryKey(likeId);
        return ServiceResponse.buildSuccessResponse(like);
    }

    public ServiceResponse<Boolean> deleteCourseLike(long likeId) {
        int affected = courseLikeMapper.deleteByPrimaryKey(likeId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateCourseLike(CourseLike like) {
        int affected = courseLikeMapper.updateByPrimaryKeySelective(like);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }
}