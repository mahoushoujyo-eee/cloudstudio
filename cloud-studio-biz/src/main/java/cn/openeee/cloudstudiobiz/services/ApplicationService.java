package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.consts.OSSConsts;
import cn.openeee.cloudstudiobiz.dao.ApplicationInfoMapper;
import cn.openeee.cloudstudiobiz.dto.GetApplicationListParam;
import cn.openeee.cloudstudiobiz.dto.ResourceParam;
import cn.openeee.cloudstudiobiz.dto.SetApplicationCoverParam;
import cn.openeee.cloudstudiobiz.entities.ApplicationInfo;
import cn.openeee.cloudstudiobiz.util.OSSUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.PaginatedData;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;
import java.util.List;

@Service
@Slf4j
@LogArgumentsAndResponse
public class ApplicationService
{
    @Autowired
    private ApplicationInfoMapper applicationInfoMapper;
    
    @Autowired
    private OSSUtil ossUtil;

    public ServiceResponse<Boolean> addApplication(ApplicationInfo applicationInfo)
    {
        int affected = applicationInfoMapper.insertSelective(applicationInfo);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<URL> setApplicationCover(SetApplicationCoverParam applicationInfo)
    {
        ResourceParam param = new ResourceParam();
        param.setOssId(applicationInfo.getId() + "");
        param.setContentType(ossUtil.getContentTypeByFileName(applicationInfo.getCoverImageName()));
        param.setBucketName(OSSConsts.APPLICATION_COVER_BUCKET_NAME);

        // Generate a pre-signed URL for frontend to upload the cover image
        ServiceResponse<URL> uploadUrlResponse = ossUtil.getUploadUrl(param);
        
        return uploadUrlResponse;
    }

    public ServiceResponse<ApplicationInfo> getApplication(long applicationId)
    {
        ApplicationInfo info = applicationInfoMapper.selectByPrimaryKey(applicationId);
        return ServiceResponse.buildSuccessResponse(info);
    }

    public ServiceResponse<Boolean> deleteApplication(long applicationId)
    {
        int affected = applicationInfoMapper.deleteByPrimaryKey(applicationId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateApplication(ApplicationInfo applicationInfo)
    {
        int affected = applicationInfoMapper.updateByPrimaryKeySelective(applicationInfo);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> forkApplication(long applicationId)
    {
        // TODO: 复制应用的业务逻辑，当前仅返回成功
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> getApplicationTimeCount(long applicationId)
    {
        // TODO: 查询应用使用时长统计，当前仅返回成功
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> addApplicationActivityRecord(long applicationId, long userId)
    {
        // TODO: 记录应用访问/操作记录，当前仅返回成功
        return ServiceResponse.buildSuccessResponse(true);
    }
    
    public ServiceResponse<PaginatedData<ApplicationInfo>> getApplicationList(GetApplicationListParam param)
    {
        param.calculateLimitOffset();
        List<ApplicationInfo> applicationInfoList = applicationInfoMapper.selectByPagination(param);

        PaginatedData<ApplicationInfo> applicationList = new PaginatedData<>();
        applicationList.setData(applicationInfoList);
        return ServiceResponse.buildSuccessResponse(applicationList);
    }
}