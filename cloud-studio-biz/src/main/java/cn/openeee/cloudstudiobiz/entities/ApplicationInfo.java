package cn.openeee.cloudstudiobiz.entities;

import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

// TODO: Maybe we do not need a suffix of "info", since most tables are infos.
@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Application information.")
public class ApplicationInfo extends EntityBase
{
    @Column(comment = "Application name.", type = "VARCHAR(128)", nullable = false)
    private String name;

    @Column(comment = "Application description.", type = "VARCHAR(500)")
    private String description;

    @Column(comment = "Application tags.", type = "VARCHAR(300)")
    private String tags;
}
