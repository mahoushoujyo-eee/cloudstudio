package cn.openeee.cloudstudiobiz.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

// TODO: Maybe we do not need a suffix of "info", since most tables are infos.
@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "Course information.")
public class CourseInfo extends EntityBase
{
    // TODO: Determine if we need to add the search function of ES.

    @Column(type = "VARCHAR(200)", nullable = false, comment = "Course title.")
    private String title;

    @Column(type = "VARCHAR(500)", nullable = false, comment = "Course description.")
    private String description;

//    @Column(type = "TEXT", nullable = false, comment = "Course introduction.")
//    private String introduction;

    @Column(type = "VARCHAR(200)", nullable = false, comment = "Course tags, separated by common.")
    private String tags;

    @Column(type = "INT", comment = "Number of chapters contained in the course.")
    private int chapterCount;
}

// TODO: I suppose we need 2 more tables:
// 1 for course chapter info.
// 2 for materials of some chapters.