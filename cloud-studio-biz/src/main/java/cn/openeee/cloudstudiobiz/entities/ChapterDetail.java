package cn.openeee.cloudstudiobiz.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Chapter detail.")
public class ChapterDetail extends EntityBase
{
    @Column(comment = "Chapter title.", nullable = false, type = "VARCHAR(100)")
    private String title;

    @Column(comment = "Chapter description.", type = "VARCHAR(500)")
    private String description;

    @Column(comment = "Course ID.", nullable = false)
    private long courseId;
}
