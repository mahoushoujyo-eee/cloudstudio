package cn.openeee.cloudstudiobiz.dto;

import cn.openeee.cloudstudiobiz.entities.ApplicationInfo;
import lombok.Data;

@Data
public class SetApplicationCoverParam extends ApplicationInfo
{
    private String coverImageName;
}
