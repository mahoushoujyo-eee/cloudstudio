package cn.openeee.cloudstudiobiz.entities.schemas;

import stark.coderaider.fluentschema.commons.schemas.SchemaSnapshotBase;
import java.util.List;

public class SchemaSnapshot extends SchemaSnapshotBase {
    public SchemaSnapshot() {
        schemaBuilder.table("application_activity_record", builder -> {
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
        schemaBuilder.table("application_comment", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(false).unique(false)
                    .comment("Application ID.");
            builder.column().name("content").type("VARCHAR(500)").nullable(true).unique(false)
                    .comment("Comment content.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Application comment.");
        });
        schemaBuilder.table("application_info", builder -> {
            builder.column().name("name").type("VARCHAR(128)").nullable(false).unique(false)
                    .comment("Application name.");
            builder.column().name("description").type("VARCHAR(500)").nullable(true).unique(false)
                    .comment("Application description.");
            builder.column().name("tags").type("VARCHAR(300)").nullable(true).unique(false)
                    .comment("Application tags.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Application information.");
        });
        schemaBuilder.table("application_like", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("application_id").type("BIGINT").nullable(false).unique(false)
                    .comment("Application ID.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Application like.");
        });
        schemaBuilder.table("course_comment", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(false).unique(false).comment("Course ID.");
            builder.column().name("content").type("VARCHAR(500)").nullable(false).unique(false).comment("Content.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Course comment.");
        });
        schemaBuilder.table("course_info", builder -> {
            builder.column().name("title").type("VARCHAR(200)").nullable(false).unique(false).comment("Course title.");
            builder.column().name("description").type("VARCHAR(500)").nullable(false).unique(false)
                    .comment("Course description.");
            builder.column().name("tags").type("VARCHAR(200)").nullable(false).unique(false)
                    .comment("Course tags, separated by common.");
            builder.column().name("chapter_count").type("INT").nullable(false).unique(false)
                    .comment("Number of chapters contained in the course.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Course information.");
        });
        schemaBuilder.table("course_like", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(false).unique(false).comment("Course ID.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Course like.");
        });
        schemaBuilder.table("course_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(false).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(false).unique(false).comment("Course ID.");
            builder.column().name("progress").type("INT").nullable(false).unique(false).comment("Progress.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("Course record.");
        });
        
        // 添加chapter_detail表
        schemaBuilder.table("chapter_detail", builder -> {
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
        
        schemaBuilder.table("time_record", builder -> {
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
        schemaBuilder.table("user_info", builder -> {
            builder.column().name("nickname").type("VARCHAR(64)").nullable(true).unique(false).comment("Nickname.");
            builder.column().name("id").type("BIGINT").nullable(false).unique(false).autoIncrement(1);
            builder.column().name("creator_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("creation_time").type("DATETIME").nullable(true).unique(false).defaultValue("NOW()");
            builder.column().name("modifier_id").type("BIGINT").nullable(false).unique(false);
            builder.column().name("modification_time").type("DATETIME").nullable(true).unique(false)
                    .defaultValue("NOW()").onUpdate("NOW()");
            builder.primaryKey().columnName("id");
            builder.engine("InnoDB");
            builder.comment("User information.");
        });
    }
}