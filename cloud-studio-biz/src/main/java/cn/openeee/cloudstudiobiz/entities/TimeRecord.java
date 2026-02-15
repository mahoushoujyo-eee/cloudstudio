package cn.openeee.cloudstudiobiz.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

import java.util.Date;

@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Time record.")
public class TimeRecord extends EntityBase
{
    @Column(comment = "User ID.")
    private long userId;

    @Column(comment = "Application ID.")
    private long applicationId;

    @Column(defaultValue = "NOW()", comment = "Start time.")
    private Date startTime;

    @Column(comment = "End time.")
    private Date endTime;

    @Column(defaultValue = "0", comment = "Time quota.")
    private int timeQuota;
}
