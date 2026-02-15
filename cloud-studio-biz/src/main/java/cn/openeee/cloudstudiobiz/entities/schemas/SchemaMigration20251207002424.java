package cn.openeee.cloudstudiobiz.entities.schemas;

import stark.coderaider.fluentschema.commons.schemas.ColumnMetadata;
import stark.coderaider.fluentschema.commons.schemas.KeyMetadata;
import stark.coderaider.fluentschema.commons.schemas.SchemaMigrationBase;
import java.util.List;

public class SchemaMigration20251207002424 extends SchemaMigrationBase {
    @Override
    public void forward() {
        setInitialized(false);
        forwardBuilder.createTable("course", builder -> {
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
    }
    @Override
    public void backward() {
        backwardBuilder.dropTable("course");
    }
}