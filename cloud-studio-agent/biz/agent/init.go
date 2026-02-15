package agent

import (
	"context"
	"log"
)

func InitAll(ctx context.Context) {
	log.Printf("init all agent")
	InitCourseGeneratorRunner(ctx)
	log.Printf("init all agent done")
}