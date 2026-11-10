package zoom

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/health-tech/backend/internal/domain/entity"
)

type Service struct {
	SDKKey    string
	SDKSecret string
}

func NewService(sdkKey, sdkSecret string) *Service {
	if sdkKey == "" {
		sdkKey = "medpulse_zoom_sdk_key"
	}
	if sdkSecret == "" {
		sdkSecret = "medpulse_zoom_sdk_secret_secure_key"
	}
	return &Service{
		SDKKey:    sdkKey,
		SDKSecret: sdkSecret,
	}
}

// GenerateMeeting creates meeting metadata and generates a Zoom Meeting SDK token
// role: 0 = attendee (patient), 1 = host (doctor)
func (s *Service) GenerateMeeting(topic string, isHost bool) (*entity.ZoomMeeting, error) {
	// Generate realistic 10-11 digit Zoom Meeting ID
	rand.Seed(time.Now().UnixNano())
	meetingIDNum := 8000000000 + rand.Int63n(1999999999)
	meetingID := strconv.FormatInt(meetingIDNum, 10)
	password := fmt.Sprintf("%06d", rand.Intn(999999))

	role := 0
	if isHost {
		role = 1
	}

	token, err := s.generateSDKJWT(meetingID, role)
	if err != nil {
		token = s.generateHMACSignature(meetingID, role)
	}

	joinURL := fmt.Sprintf("https://zoom.us/j/%s?pwd=%s", meetingID, password)
	startURL := fmt.Sprintf("https://zoom.us/s/%s?pwd=%s", meetingID, password)

	return &entity.ZoomMeeting{
		MeetingID: meetingID,
		Topic:     topic,
		JoinURL:   joinURL,
		StartURL:  startURL,
		Password:  password,
		SDKToken:  token,
	}, nil
}

// generateSDKJWT generates compliant Zoom Meeting SDK JWT
func (s *Service) generateSDKJWT(meetingNumber string, role int) (string, error) {
	iat := time.Now().Unix()
	exp := iat + 60*60*2 // 2 hours validity

	claims := jwt.MapClaims{
		"appKey":   s.SDKKey,
		"sdkKey":   s.SDKKey,
		"mn":       meetingNumber,
		"role":     role,
		"iat":      iat,
		"exp":      exp,
		"tokenExp": exp,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.SDKSecret))
}

func (s *Service) generateHMACSignature(meetingNumber string, role int) string {
	ts := time.Now().Unix()*1000 - 30000
	msg := fmt.Sprintf("%s%s%d%d", s.SDKKey, meetingNumber, ts, role)
	h := hmac.New(sha256.New, []byte(s.SDKSecret))
	h.Write([]byte(msg))
	hash := base64.StdEncoding.EncodeToString(h.Sum(nil))
	plain := fmt.Sprintf("%s.%s.%d.%d.%s", s.SDKKey, meetingNumber, ts, role, hash)
	return base64.StdEncoding.EncodeToString([]byte(plain))
}

