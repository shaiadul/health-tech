package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/health-tech/backend/internal/delivery/http/middleware"
	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/internal/usecase/account"
	"github.com/health-tech/backend/internal/usecase/analytics"
	"github.com/health-tech/backend/internal/usecase/appointment"
	"github.com/health-tech/backend/internal/usecase/auth"
	"github.com/health-tech/backend/internal/usecase/clinical_record"
	"github.com/health-tech/backend/internal/usecase/clinical_service"
	"github.com/health-tech/backend/internal/usecase/lead"
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
	leadUC        *lead.UseCase
	clinicalRecUC *clinical_record.UseCase
	accountUC     *account.UseCase
	analyticsUC   *analytics.UseCase
}

func NewHandler(
	authUC *auth.UseCase,
	specUC *specialist.UseCase,
	srvUC *clinical_service.UseCase,
	aptUC *appointment.UseCase,
	txUC *transaction.UseCase,
	meetUC *meeting.UseCase,
	leadUC *lead.UseCase,
	clinicalRecUC *clinical_record.UseCase,
	accountUC *account.UseCase,
	analyticsUC *analytics.UseCase,
) *Handler {
	return &Handler{
		authUC:        authUC,
		specialistUC:  specUC,
		serviceUC:     srvUC,
		appointmentUC: aptUC,
		txUC:          txUC,
		meetingUC:     meetUC,
		leadUC:        leadUC,
		clinicalRecUC: clinicalRecUC,
		accountUC:     accountUC,
		analyticsUC:   analyticsUC,
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
	Reason string                   `json:"reason"`
}

func (h *Handler) UpdateAppointmentStatus(c *gin.Context) {
	id := c.Param("id")
	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if err := h.appointmentUC.UpdateStatus(c.Request.Context(), id, input.Status, input.Reason); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.OK(c, nil, "Appointment status updated")
}

type RescheduleInput struct {
	Date string `json:"date" binding:"required"`
	Time string `json:"time" binding:"required"`
}

func (h *Handler) RescheduleAppointment(c *gin.Context) {
	id := c.Param("id")
	var input RescheduleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	apt, err := h.appointmentUC.Reschedule(c.Request.Context(), id, input.Date, input.Time)
	if err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.OK(c, apt, "Appointment rescheduled successfully")
}

// ------------------- Leads & Newsletter Handlers -------------------

func (h *Handler) SubmitLead(c *gin.Context) {
	var input lead.CreateLeadInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	result, err := h.leadUC.SubmitLead(c.Request.Context(), input)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.Created(c, result, "Thank you! Our care team will contact you shortly.")
}

type NewsletterInput struct {
	Email string `json:"email" binding:"required,email"`
}

func (h *Handler) SubscribeNewsletter(c *gin.Context) {
	var input NewsletterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	result, err := h.leadUC.SubscribeNewsletter(c.Request.Context(), input.Email)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.Created(c, result, "Subscribed successfully!")
}

// ------------------- Clinical Records (Refills & SOAP Notes) -------------------

func (h *Handler) RequestRefill(c *gin.Context) {
	var input clinical_record.CreateRefillInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if uid, exists := c.Get(middleware.CtxUserIDKey); exists && input.PatientID == "" {
		input.PatientID = uid.(string)
	}

	refill, err := h.clinicalRecUC.RequestRefill(c.Request.Context(), input)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.Created(c, refill, "Prescription refill request submitted to pharmacy")
}

func (h *Handler) ListRefills(c *gin.Context) {
	patientID := c.Query("patientId")
	status := c.Query("status")

	if roleVal, exists := c.Get(middleware.CtxRoleKey); exists {
		role := roleVal.(entity.UserRole)
		if role == entity.RolePatient {
			uid, _ := c.Get(middleware.CtxUserIDKey)
			patientID = uid.(string)
		}
	}

	refills, err := h.clinicalRecUC.ListRefills(c.Request.Context(), patientID, status)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OK(c, refills, "Prescription refills retrieved")
}

func (h *Handler) ApproveRefill(c *gin.Context) {
	id := c.Param("id")
	if err := h.clinicalRecUC.ApproveRefill(c.Request.Context(), id); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	response.OK(c, nil, "Refill authorized and signed by physician")
}

func (h *Handler) CreateSOAPNote(c *gin.Context) {
	var input clinical_record.CreateSOAPInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	if uid, exists := c.Get(middleware.CtxUserIDKey); exists && input.DoctorID == "" {
		input.DoctorID = uid.(string)
	}
	if name, exists := c.Get(middleware.CtxNameKey); exists && input.DoctorName == "" {
		input.DoctorName = name.(string)
	}

	note, err := h.clinicalRecUC.CreateSOAPNote(c.Request.Context(), input)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.Created(c, note, "Clinical SOAP note recorded in EHR")
}

func (h *Handler) ListSOAPNotes(c *gin.Context) {
	patientID := c.Query("patientId")
	notes, err := h.clinicalRecUC.ListSOAPNotes(c.Request.Context(), patientID)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}

	response.OK(c, notes, "SOAP notes retrieved")
}

// ------------------- Bank Accounts & Facilities -------------------

func (h *Handler) ListAccounts(c *gin.Context) {
	accounts, err := h.accountUC.List(c.Request.Context())
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, accounts, "Operating accounts retrieved")
}

func (h *Handler) CreateAccount(c *gin.Context) {
	var input account.CreateAccountInput
	if err := c.ShouldBindJSON(&input); err != nil {
		response.BadRequest(c, err.Error())
		return
	}

	acc, err := h.accountUC.Create(c.Request.Context(), input)
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.Created(c, acc, "Account created successfully")
}

// ------------------- Clinical Analytics Summary -------------------

func (h *Handler) GetAnalyticsSummary(c *gin.Context) {
	summary, err := h.analyticsUC.GetSummary(c.Request.Context())
	if err != nil {
		response.InternalError(c, err.Error())
		return
	}
	response.OK(c, summary, "Analytics summary retrieved")
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

