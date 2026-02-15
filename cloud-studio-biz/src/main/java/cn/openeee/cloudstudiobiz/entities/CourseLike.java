package cn.openeee.cloudstudiobiz.entities;

import stark.coderaider.fluentschema.commons.EntityBase;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

/**
 * Course like.
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Course like.")
public class CourseLike extends EntityBase
{
    @Column(comment = "User ID.")
    private long userId;

    @Column(comment = "Course ID.")
    private long courseId;
}
