package cn.openeee.cloudstudiobiz.entities.schemas;

import stark.coderaider.fluentschema.commons.schemas.ColumnMetadata;
import stark.coderaider.fluentschema.commons.schemas.KeyMetadata;
import stark.coderaider.fluentschema.commons.schemas.SchemaMigrationBase;
import java.util.List;

public class SchemaMigration20251207133524 extends SchemaMigrationBase {
    @Override
    public void forward() {
        forwardBuilder.createTable("application_record", builder -> {
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
        forwardBuilder.createTable("course_like", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(true).unique(false).comment("Course ID.");
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
        forwardBuilder.createTable("course_record", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(true).unique(false).comment("Course ID.");
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
        forwardBuilder.createTable("user_info", builder -> {
            builder.column().name("nick_name").type("VARCHAR(64)").nullable(true).unique(false).comment("Nick name.");
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
        forwardBuilder.createTable("application_comment", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false);
            builder.column().name("application_id").type("BIGINT").nullable(true).unique(false);
            builder.column().name("content").type("VARCHAR(512)").nullable(true).unique(false)
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
        forwardBuilder.createTable("t_ime_record", builder -> {
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
        forwardBuilder.createTable("course_info", builder -> {
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
        forwardBuilder.createTable("application_info", builder -> {
            builder.column().name("name").type("VARCHAR(128)").nullable(true).unique(false)
                    .comment("Application name.");
            builder.column().name("description").type("VARCHAR(512)").nullable(true).unique(false)
                    .comment("Application description.");
            builder.column().name("tags").type("VARCHAR(256)").nullable(true).unique(false)
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
        forwardBuilder.createTable("course_comment", builder -> {
            builder.column().name("user_id").type("BIGINT").nullable(true).unique(false).comment("User ID.");
            builder.column().name("course_id").type("BIGINT").nullable(true).unique(false).comment("Course ID.");
            builder.column().name("content").type("VARCHAR(512)").nullable(true).unique(false).comment("Content.");
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
        forwardBuilder.createTable("application_like", builder -> {
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
            builder.comment("Application like.");
        });
        forwardBuilder.dropTable("course");
    }
    @Override
    public void backward() {
        backwardBuilder.createTable("course", builder -> {
            builder.column().name("title").type("VARCHAR(200)").nullable(false).unique(false).comment("Course title.");
            builder.column().name("description").type("VARCHAR(500)").nullable(false).unique(false)
                    .comment("Course description.");
            builder.column().name("introduction").type("TEXT").nullable(false).unique(false)
                    .comment("Course introduction.");
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
        backwardBuilder.dropTable("application_record");
        backwardBuilder.dropTable("course_like");
        backwardBuilder.dropTable("course_record");
        backwardBuilder.dropTable("user_info");
        backwardBuilder.dropTable("application_comment");
        backwardBuilder.dropTable("t_ime_record");
        backwardBuilder.dropTable("course_info");
        backwardBuilder.dropTable("application_info");
        backwardBuilder.dropTable("course_comment");
        backwardBuilder.dropTable("application_like");
    }
}