package cn.openeee.cloudstudiobiz.entities.schemas;

import stark.coderaider.fluentschema.commons.schemas.ColumnMetadata;
import stark.coderaider.fluentschema.commons.schemas.KeyMetadata;
import stark.coderaider.fluentschema.commons.schemas.SchemaMigrationBase;
import java.util.List;

public class SchemaMigration20251208121824 extends SchemaMigrationBase {
    @Override
    public void forward() {
        forwardBuilder.createTable("time_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(false).unique(false)
                    .comment("Application ID.");
            builder.column().name("start_time").type("DATETIME").nullable(true).unique(false).comment("Start time.")
                    .defaultValue("NOW()");
            builder.column().name("end_time").type("DATETIME").nullable(true).unique(false).comment("End time.");
            builder.column().name("time_quota").type("INT").nullable(false).unique(false).comment("Time quota.")
                    .defaultValue("0");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Time record.");
        });
        forwardBuilder.createTable("application_activity_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(false).unique(false)
                    .comment("Application ID.");
            builder.column().name("start_time").type("DATETIME").nullable(true).unique(false).comment("Start time.")
                    .defaultValue("NOW()");
            builder.column().name("end_time").type("DATETIME").nullable(true).unique(false).comment("End time.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Application record.");
        });
        
        // 添加chapter_detail表
        forwardBuilder.createTable("chapter_detail", builder -> {
            builder.column().name("course_id").type("BIGINT").nullable(false).unique(false).comment("Course ID.");
            builder.column().name("title").type("VARCHAR(100)").nullable(false).unique(false).comment("Chapter title.");
            builder.column().name("description").type("VARCHAR(500)").nullable(true).unique(false).comment("Chapter description.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Chapter detail.");
        });
        
        forwardBuilder.dropTable("application_record");
        forwardBuilder.dropTable("t_ime_record");
        forwardBuilder.alterColumn("course_like", "course_id", ColumnMetadata.builder().name("course_id").type("BIGINT")
                .nullable(false).unique(false).comment("Course ID.").build());
        forwardBuilder.alterColumn("course_like", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(false).unique(false).comment("User ID.").build());
        forwardBuilder.alterColumn("course_record", "course_id", ColumnMetadata.builder().name("course_id")
                .type("BIGINT").nullable(false).unique(false).comment("Course ID.").build());
        forwardBuilder.alterColumn("course_record", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(false).unique(false).comment("User ID.").build());
        forwardBuilder.dropColumn("user_info", "nick_name");
        forwardBuilder.addColumn("user_info", ColumnMetadata.builder().name("nickname").type("VARCHAR(64)")
                .nullable(true).unique(false).comment("Nickname.").build());
        forwardBuilder.alterColumn("application_comment", "user_id", ColumnMetadata.builder().name("user_id")
                .type("BIGINT").nullable(false).unique(false).comment("User ID.").build());
        forwardBuilder.alterColumn("application_comment", "application_id",
                ColumnMetadata.builder().name("application_id").type("BIGINT").nullable(false).unique(false)
                        .comment("Application ID.").build());
        forwardBuilder.alterColumn("application_comment", "content", ColumnMetadata.builder().name("content")
                .type("VARCHAR(500)").nullable(true).unique(false).comment("Comment content.").build());
        forwardBuilder.alterColumn("application_info", "name", ColumnMetadata.builder().name("name")
                .type("VARCHAR(128)").nullable(false).unique(false).comment("Application name.").build());
        forwardBuilder.alterColumn("application_info", "description", ColumnMetadata.builder().name("description")
                .type("VARCHAR(500)").nullable(true).unique(false).comment("Application description.").build());
        forwardBuilder.alterColumn("application_info", "tags", ColumnMetadata.builder().name("tags")
                .type("VARCHAR(300)").nullable(true).unique(false).comment("Application tags.").build());
        forwardBuilder.alterColumn("course_comment", "course_id", ColumnMetadata.builder().name("course_id")
                .type("BIGINT").nullable(false).unique(false).comment("Course ID.").build());
        forwardBuilder.alterColumn("course_comment", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(false).unique(false).comment("User ID.").build());
        forwardBuilder.alterColumn("course_comment", "content", ColumnMetadata.builder().name("content")
                .type("VARCHAR(500)").nullable(false).unique(false).comment("Content.").build());
        forwardBuilder.alterColumn("application_like", "user_id", ColumnMetadata.builder().name("user_id")
                .type("BIGINT").nullable(false).unique(false).comment("User ID.").build());
        forwardBuilder.alterColumn("application_like", "application_id", ColumnMetadata.builder().name("application_id")
                .type("BIGINT").nullable(false).unique(false).comment("Application ID.").build());
    }
    @Override
    public void backward() {
        // 删除chapter_detail表
        backwardBuilder.dropTable("chapter_detail");
        
        backwardBuilder.alterColumn("course_like", "course_id", ColumnMetadata.builder().name("course_id")
                .type("BIGINT").nullable(true).unique(false).comment("Course ID.").build());
        backwardBuilder.alterColumn("course_like", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(true).unique(false).comment("User ID.").build());
        backwardBuilder.alterColumn("course_record", "course_id", ColumnMetadata.builder().name("course_id")
                .type("BIGINT").nullable(true).unique(false).comment("Course ID.").build());
        backwardBuilder.alterColumn("course_record", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(true).unique(false).comment("User ID.").build());
        backwardBuilder.dropColumn("user_info", "nickname");
        backwardBuilder.addColumn("user_info", ColumnMetadata.builder().name("nick_name").type("VARCHAR(64)")
                .nullable(true).unique(false).comment("Nick name.").build());
        backwardBuilder.alterColumn("application_comment", "user_id",
                ColumnMetadata.builder().name("user_id").type("BIGINT").nullable(true).unique(false).build());
        backwardBuilder.alterColumn("application_comment", "application_id",
                ColumnMetadata.builder().name("application_id").type("BIGINT").nullable(true).unique(false).build());
        backwardBuilder.alterColumn("application_comment", "content", ColumnMetadata.builder().name("content")
                .type("VARCHAR(512)").nullable(true).unique(false).comment("Comment content.").build());
        backwardBuilder.alterColumn("application_info", "name", ColumnMetadata.builder().name("name")
                .type("VARCHAR(128)").nullable(true).unique(false).comment("Application name.").build());
        backwardBuilder.alterColumn("application_info", "description", ColumnMetadata.builder().name("description")
                .type("VARCHAR(512)").nullable(true).unique(false).comment("Application description.").build());
        backwardBuilder.alterColumn("application_info", "tags", ColumnMetadata.builder().name("tags")
                .type("VARCHAR(256)").nullable(true).unique(false).comment("Application tags.").build());
        backwardBuilder.alterColumn("course_comment", "course_id", ColumnMetadata.builder().name("course_id")
                .type("BIGINT").nullable(true).unique(false).comment("Course ID.").build());
        backwardBuilder.alterColumn("course_comment", "user_id", ColumnMetadata.builder().name("user_id").type("BIGINT")
                .nullable(true).unique(false).comment("User ID.").build());
        backwardBuilder.alterColumn("course_comment", "content", ColumnMetadata.builder().name("content")
                .type("VARCHAR(512)").nullable(true).unique(false).comment("Content.").build());
        backwardBuilder.alterColumn("application_like", "user_id", ColumnMetadata.builder().name("user_id")
                .type("BIGINT").nullable(true).unique(false).comment("User ID.").build());
        backwardBuilder.alterColumn("application_like", "application_id", ColumnMetadata.builder()
                .name("application_id").type("BIGINT").nullable(true).unique(false).comment("Application ID.").build());
        backwardBuilder.createTable("application_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(true).unique(false)
                    .comment("Application ID.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Application record.");
        });
        backwardBuilder.createTable("t_ime_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(true).unique(false)
                    .comment("Application ID.");
            builder.column().name("start_time").type("DATETIME").nullable(true).unique(false).comment("Start time.")
                    .defaultValue("NOW()");
            builder.column().name("end_time").type("DATETIME").nullable(true).unique(false).comment("End time.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Time record.");
        });
        backwardBuilder.dropTable("time_record");
        backwardBuilder.dropTable("application_activity_record");
    }
}