package meeting

import (
	"context"
	"fmt"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/infrastructure/zoom"
)

type UseCase struct {
	zoomSvc *zoom.Service
}

func NewUseCase(zoomSvc *zoom.Service) *UseCase {
	return &UseCase{zoomSvc: zoomSvc}
}

func (uc *UseCase) CreateMeeting(ctx context.Context, topic string, isDoctor bool) (*entity.ZoomMeeting, error) {
	if topic == "" {
		topic = "MedPulse Outpatient Telehealth Consultation"
	}
	return uc.zoomSvc.GenerateMeeting(topic, isDoctor)
}

func (uc *UseCase) GetSDKToken(ctx context.Context, meetingID string, isDoctor bool) (string, error) {
	meeting, err := uc.zoomSvc.GenerateMeeting(fmt.Sprintf("Room %s", meetingID), isDoctor)
	if err != nil {
		return "", err
	}
	return meeting.SDKToken, nil
}

