package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/health-tech/backend/internal/delivery/http/middleware"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/internal/usecase/appointment"
	"github.com/health-tech/backend/internal/usecase/auth"
	"github.com/health-tech/backend/internal/usecase/clinical_service"
	"github.com/health-tech/backend/internal/usecase/meeting"
	"github.com/health-tech/backend/internal/usecase/specialist"
	"github.com/health-tech/backend/internal/usecase/transaction"
	"github.com/health-tech/backend/pkg/pagination"
	"github.com/health-tech/backend/pkg/response"
)

type Handler struct {
	authUC        *auth.UseCase
	specialistUC  *specialist.UseCase
	serviceUC     *clinical_service.UseCase
	appointmentUC *appointment.UseCase
	txUC          *transaction.UseCase
	meetingUC     *meeting.UseCase
}

func NewHandler(
	authUC *auth.UseCase,
	specUC *specialist.UseCase,
	srvUC *clinical_service.UseCase,
	aptUC *appointment.UseCase,
	txUC *transaction.UseCase,
	meetUC *meeting.UseCase,
) *Handler {
	return &Handler{
		authUC:        authUC,
		specialistUC:  specUC,
		serviceUC:     srvUC,
		appointmentUC: aptUC,
		txUC:          txUC,
		meetingUC:     meetUC,
	}
}

// ------------------- Auth Handlers -------------------

func (h *Handler) Login(c *gin.Context) {
	var input auth.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	out, err := h.authUC.Login(c.Request.Context(), input)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.OK(c, out, "Logged in successfully")
}

func (h *Handler) Signup(c *gin.Context) {
	var input auth.SignupInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	out, err := h.authUC.Signup(c.Request.Context(), input)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, out, "Account created successfully")
}

func (h *Handler) GetMe(c *gin.Context) {
	userID, _ := c.Get(middleware.CtxUserIDKey)
	user, err := h.authUC.GetProfile(c.Request.Context(), userID.(string))
	if err != nil {
		response.NotFound(c, "User not found")
		return
	}

	response.OK(c, user, "Profile retrieved successfully")
}

// ------------------- Specialist Handlers -------------------

func (h *Handler) ListSpecialists(c *gin.Context) {
	params := pagination.ParseParams(
		c.Query("page"),
		c.Query("pageSize"),
		c.Query("search"),
		c.Query("sortBy"),
		c.Query("sortOrder"),
	)

	filter := repository.SpecialistFilter{
		Department: c.Query("department"),
		Language:   c.Query("language"),
	}

	if avail := c.Query("isAvailable"); avail != "" {
		b, err := strconv.ParseBool(avail)
		if err == nil {
			filter.IsAvailable = &b
		}
	}

	if ratingStr := c.Query("minRating"); ratingStr != "" {
		if r, err := strconv.ParseFloat(ratingStr, 64); err == nil {
			filter.MinRating = r
		}
	}

	result, err := h.specialistUC.List(c.Request.Context(), filter, params)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OKWithMeta(c, result.Data, result.Meta, "Specialists retrieved successfully")
}

func (h *Handler) GetSpecialist(c *gin.Context) {
	id := c.Param("id")
	spec, err := h.specialistUC.GetByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, "Specialist not found")
		return
	}

	response.OK(c, spec, "Specialist retrieved successfully")
}

func (h *Handler) GetFeaturedSpecialists(c *gin.Context) {
	limit := 6
	if l := c.Query("limit"); l != "" {
		if val, err := strconv.Atoi(l); err == nil {
			limit = val
		}
	}

	specs, err := h.specialistUC.GetFeatured(c.Request.Context(), limit)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OK(c, specs, "Featured specialists retrieved")
}

// ------------------- Service Handlers -------------------

func (h *Handler) ListServices(c *gin.Context) {
	params := pagination.ParseParams(
		c.Query("page"),
		c.Query("pageSize"),
		c.Query("search"),
		c.Query("sortBy"),
		c.Query("sortOrder"),
	)

	dept := c.Query("department")
	result, err := h.serviceUC.List(c.Request.Context(), dept, params)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OKWithMeta(c, result.Data, result.Meta, "Services retrieved successfully")
}

func (h *Handler) GetService(c *gin.Context) {
	id := c.Param("id")
	srv, err := h.serviceUC.GetByID(c.Request.Context(), id)
	if err != nil {
		// Try by slug
		srv, err = h.serviceUC.GetBySlug(c.Request.Context(), id)
		if err != nil {
			response.NotFound(c, "Service not found")
			return
		}
	}

	response.OK(c, srv, "Service retrieved successfully")
}

// ------------------- Appointment Handlers -------------------

func (h *Handler) CreateAppointment(c *gin.Context) {
	var input appointment.CreateAppointmentInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	// Set patient id from token if authenticated
	if uid, exists := c.Get(middleware.CtxUserIDKey); exists && input.PatientID == "" {
		input.PatientID = uid.(string)
	}

	apt, err := h.appointmentUC.Create(c.Request.Context(), input)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.Created(c, apt, "Appointment booked successfully")
}

func (h *Handler) ListAppointments(c *gin.Context) {
	params := pagination.ParseParams(
		c.Query("page"),
		c.Query("pageSize"),
		c.Query("search"),
		c.Query("sortBy"),
		c.Query("sortOrder"),
	)

	filter := repository.AppointmentFilter{
		Department:   c.Query("department"),
		SpecialistID: c.Query("specialistId"),
		PatientID:    c.Query("patientId"),
		Status:       entity.AppointmentStatus(c.Query("status")),
		Format:       c.Query("format"),
	}

	// If logged in as patient, restrict to patient's appointments
	if roleVal, exists := c.Get(middleware.CtxRoleKey); exists {
		role := roleVal.(entity.UserRole)
		if role == entity.RolePatient {
			uid, _ := c.Get(middleware.CtxUserIDKey)
			filter.PatientID = uid.(string)
		}
	}

	result, err := h.appointmentUC.List(c.Request.Context(), filter, params)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OKWithMeta(c, result.Data, result.Meta, "Appointments retrieved successfully")
}

func (h *Handler) GetAppointment(c *gin.Context) {
	id := c.Param("id")
	apt, err := h.appointmentUC.GetByID(c.Request.Context(), id)
	if err != nil {
		apt, err = h.appointmentUC.GetByReference(c.Request.Context(), id)
		if err != nil {
			response.NotFound(c, "Appointment not found")
			return
		}
	}

	response.OK(c, apt, "Appointment retrieved successfully")
}

type UpdateStatusInput struct {
	Status entity.AppointmentStatus `json:"status" binding:"required"`
}

func (h *Handler) UpdateAppointmentStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if err := h.appointmentUC.UpdateStatus(c.Request.Context(), id, input.Status); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.OK(c, nil, "Appointment status updated")
}

// ------------------- Transaction Handlers -------------------

func (h *Handler) ListTransactions(c *gin.Context) {
	params := pagination.ParseParams(
		c.Query("page"),
		c.Query("pageSize"),
		c.Query("search"),
		c.Query("sortBy"),
		c.Query("sortOrder"),
	)

	filter := repository.TransactionFilter{
		Category:   c.Query("category"),
		Department: c.Query("department"),
		Status:     entity.TransactionStatus(c.Query("status")),
		PatientID:  c.Query("patientId"),
	}

	result, err := h.txUC.List(c.Request.Context(), filter, params)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OKWithMeta(c, result.Data, result.Meta, "Transactions retrieved successfully")
}

// ------------------- Zoom Meeting Handlers -------------------

type CreateMeetingInput struct {
	Topic string `json:"topic"`
}

func (h *Handler) CreateMeeting(c *gin.Context) {
	var input CreateMeetingInput
	_ = c.ShouldBindJSON(&input)

	roleVal, _ := c.Get(middleware.CtxRoleKey)
	role := roleVal.(entity.UserRole)
	isDoctor := role == entity.RoleDoctor || role == entity.RoleOrganizer

	meeting, err := h.meetingUC.CreateMeeting(c.Request.Context(), input.Topic, isDoctor)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.Created(c, meeting, "Zoom meeting generated successfully")
}

func (h *Handler) GetZoomSDKToken(c *gin.Context) {
	meetingID := c.Param("meetingId")
	roleVal, _ := c.Get(middleware.CtxRoleKey)
	role := roleVal.(entity.UserRole)
	isDoctor := role == entity.RoleDoctor || role == entity.RoleOrganizer

	token, err := h.meetingUC.GetSDKToken(c.Request.Context(), meetingID, isDoctor)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OK(c, gin.H{
		"meetingId": meetingID,
		"sdkToken":  token,
	}, "Zoom SDK token generated")
}

