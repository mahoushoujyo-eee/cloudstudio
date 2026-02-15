package cn.openeee.cloudstudiobiz.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Application comment.")
public class ApplicationComment extends EntityBase
{
    @Column(comment = "User ID.")
    private long userId;

    @Column(comment = "Application ID.")
    private long applicationId;

    @Column(type = "VARCHAR(500)", comment = "Comment content.")
    private String content;
}
