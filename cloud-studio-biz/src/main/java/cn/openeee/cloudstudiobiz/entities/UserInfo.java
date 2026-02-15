package cn.openeee.cloudstudiobiz.entities;

import lombok.Data;
import lombok.EqualsAndHashCode;
import stark.coderaider.fluentschema.commons.EntityBase;
import stark.coderaider.fluentschema.commons.NamingConvention;
import stark.coderaider.fluentschema.commons.annotations.Column;
import stark.coderaider.fluentschema.commons.annotations.Table;

@Data
@EqualsAndHashCode(callSuper = true)
@Table(namingConvention = NamingConvention.LOWER_CASE_WITH_UNDERSCORE, comment = "User information.")
public class UserInfo extends EntityBase
{
    // TODO: OH, nickname is a word, strange English word construction rule.
    @Column(comment = "Nickname.", type = "VARCHAR(64)")
    private String nickname;
}
