package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.consts.OSSConsts;
import cn.openeee.cloudstudiobiz.dao.UserMapper;
import cn.openeee.cloudstudiobiz.dto.ResourceParam;
import cn.openeee.cloudstudiobiz.entities.TimeRecord;
import cn.openeee.cloudstudiobiz.entities.UserInfo;
import cn.openeee.cloudstudiobiz.util.OSSUtil;
import com.aliyun.oss.OSS;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;

@Service
@Slf4j
@LogArgumentsAndResponse
public class UserService
{
    @Autowired
    UserMapper userMapper;

    @Autowired
    OSSUtil ossUtil;

    public ServiceResponse<UserInfo> getUserInfo(long currentUserId)
    {
        UserInfo userInfo = userMapper.selectByPrimaryKey(currentUserId);
        return ServiceResponse.buildSuccessResponse(userInfo);
    }

    public ServiceResponse<Boolean> changeUserBasicInfo(UserInfo userInfo)
    {
        int result = userMapper.updateByPrimaryKeySelective(userInfo);
        return ServiceResponse.buildSuccessResponse(result > 0);
    }

    public ServiceResponse<URL> changeUserAvatar(UserInfo userInfo)
    {
        ResourceParam param = new ResourceParam();
        param.setBucketName(OSSConsts.USER_AVATAR_BUCKET_NAME);
        param.setContentType("");
        param.setOssId(userInfo.getId() + "");

        // Generate a pre-signed URL for frontend to upload the cover image
        ServiceResponse<URL> uploadUrlResponse = ossUtil.getUploadUrl(param);

        return uploadUrlResponse;
    }

    public ServiceResponse<Boolean> changeUserTimeRecord(TimeRecord timeRecord)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> addUserTimeRecord(TimeRecord timeRecord)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }
    
    public ServiceResponse<Boolean> createUser(UserInfo userInfo)
    {
        int result = userMapper.insertSelective(userInfo);
        return ServiceResponse.buildSuccessResponse(result > 0);
    }
}