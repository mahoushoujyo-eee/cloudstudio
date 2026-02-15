package cn.openeee.cloudstudiobiz.dto;

import lombok.Data;
import stark.dataworks.boot.web.PaginationRequest;

import java.io.Serializable;

@Data
public class GetCourseListParam extends PaginationRequest implements Serializable
{
    private static final long serialVersionUID = 1L;
    
    private String title;

    private String tags;
}