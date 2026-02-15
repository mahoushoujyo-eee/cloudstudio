package cn.openeee.cloudstudiobiz.services;

import cn.openeee.cloudstudiobiz.consts.OSSConsts;
import cn.openeee.cloudstudiobiz.dao.CourseInfoMapper;
import cn.openeee.cloudstudiobiz.dto.GetCourseListParam;
import cn.openeee.cloudstudiobiz.dto.ResourceParam;
import cn.openeee.cloudstudiobiz.dto.SetCourseCoverParam;
import cn.openeee.cloudstudiobiz.entities.CourseComment;
import cn.openeee.cloudstudiobiz.entities.CourseInfo;
import cn.openeee.cloudstudiobiz.entities.CourseRecord;
import cn.openeee.cloudstudiobiz.util.OSSUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import stark.dataworks.boot.autoconfig.web.LogArgumentsAndResponse;
import stark.dataworks.boot.web.PaginatedData;
import stark.dataworks.boot.web.ServiceResponse;

import java.net.URL;
import java.util.List;

@Slf4j
@Service
@LogArgumentsAndResponse
public class CourseService
{
    @Autowired
    private CourseInfoMapper courseInfoMapper;
    
    @Autowired
    private OSSUtil ossUtil;

    public ServiceResponse<Boolean> createCourse(CourseInfo courseInfo)
    {
        int affected = courseInfoMapper.insertSelective(courseInfo);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<URL> setCourseCover(SetCourseCoverParam courseInfo)
    {
        ResourceParam param = new ResourceParam();
        param.setBucketName(OSSConsts.COURSE_COVER_BUCKET_NAME);
        param.setContentType(ossUtil.getContentTypeByFileName(courseInfo.getCoverImageName()));
        //TODO: change oss id as course id and image extended name
        param.setOssId(courseInfo.getId() + "");

        // Generate a pre-signed URL for frontend to upload the cover image
        ServiceResponse<URL> uploadUrlResponse = ossUtil.getUploadUrl(param);
        
        return uploadUrlResponse;
    }

    public ServiceResponse<Boolean> deleteCourse(long courseId)
    {
        int affected = courseInfoMapper.deleteByPrimaryKey(courseId);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<Boolean> updateCourse(CourseInfo courseInfo)
    {
        int affected = courseInfoMapper.updateByPrimaryKeySelective(courseInfo);
        return ServiceResponse.buildSuccessResponse(affected > 0);
    }

    public ServiceResponse<CourseInfo> getCourseInfo(long courseId)
    {
        CourseInfo info = courseInfoMapper.selectByPrimaryKey(courseId);
        return ServiceResponse.buildSuccessResponse(info);
    }

    public ServiceResponse<Boolean> addCourseComment(CourseComment courseComment)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> deleteCourseComment(long commentId)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> addCourseRecord(CourseRecord courseRecord)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }

    public ServiceResponse<Boolean> changeCourseRecord(CourseRecord courseRecord)
    {
        return ServiceResponse.buildSuccessResponse(true);
    }


    @Cacheable(value = "courseList", key = "'getCourseList:' + #param.toString()")
    public ServiceResponse<PaginatedData<CourseInfo>> getCourseList(GetCourseListParam param)
    {
        param.calculateLimitOffset();
        List<CourseInfo> courseInfoList = courseInfoMapper.selectByPagination(param);

        PaginatedData<CourseInfo> courseList = new PaginatedData<>();
        courseList.setData(courseInfoList);
        return ServiceResponse.buildSuccessResponse(courseList);
    }
}