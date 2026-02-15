package cn.openeee.cloudstudiobiz.dto;

import cn.openeee.cloudstudiobiz.entities.CourseInfo;
import lombok.Data;

@Data
public class SetCourseCoverParam extends CourseInfo
{
    private String coverImageName;
}
