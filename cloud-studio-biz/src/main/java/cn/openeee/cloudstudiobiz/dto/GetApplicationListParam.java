package cn.openeee.cloudstudiobiz.dto;

import lombok.Data;
import stark.dataworks.boot.web.PaginationRequest;

import java.io.Serializable;

@Data
public class GetApplicationListParam extends PaginationRequest implements Serializable
{
    private static final long serialVersionUID = 1L;
}