package cn.openeee.cloudstudiobiz.dto;

import cn.openeee.cloudstudiobiz.entities.ChapterDetail;
import lombok.Data;

import java.util.List;

@Data
public class BatchCreateChaptersParam {
    private Long courseId;
    private List<ChapterDetail> chapters;
}