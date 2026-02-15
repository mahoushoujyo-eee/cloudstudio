package cn.openeee.cloudstudiobiz.dto;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@Data
public class ResourceParam implements Serializable
{
    private Long id;

    //表示私有或公有
    private Integer type;

    private String objectName;

    private String ossId;

    private Long userId;

    private String bucketName;

    private Long size;

    private Date createTime;

    private String ContentType;

    private Integer pageIndex;

    private Integer pageOffset;
}