package main

import "time"

type ApplicationActivityRecord struct {
	ID               int64      `json:"id"`
	UserID           int64      `json:"user_id"`
	InstanceID       int64      `json:"instance_id"`
	StartTime        time.Time  `json:"start_time"`
	EndTime          *time.Time `json:"end_time"`
	CreatorID        int64      `json:"creator_id"`
	CreationTime     time.Time  `json:"creation_time"`
	ModifierID       int64      `json:"modifier_id"`
	ModificationTime time.Time  `json:"modification_time"`
}
