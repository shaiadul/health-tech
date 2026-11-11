package db

import (
	"context"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/pkg/pagination"
)

type SpecialistRepoAdapter struct {
	db *SupabaseDB
}

func NewSpecialistRepoAdapter(db *SupabaseDB) repository.SpecialistRepository {
	return &SpecialistRepoAdapter{db: db}
}

func (a *SpecialistRepoAdapter) GetByID(ctx context.Context, id string) (*entity.Specialist, error) {
	return a.db.SpecialistGetByID(ctx, id)
}

func (a *SpecialistRepoAdapter) List(ctx context.Context, filter repository.SpecialistFilter, params pagination.Params) (*pagination.PageResult[entity.Specialist], error) {
	return a.db.SpecialistList(ctx, filter, params)
}

func (a *SpecialistRepoAdapter) GetFeatured(ctx context.Context, limit int) ([]entity.Specialist, error) {
	return a.db.SpecialistGetFeatured(ctx, limit)
}

func (a *SpecialistRepoAdapter) Create(ctx context.Context, sp *entity.Specialist) error {
	return a.db.SpecialistCreate(ctx, sp)
}

type ClinicalServiceRepoAdapter struct {
	db *SupabaseDB
}

func NewClinicalServiceRepoAdapter(db *SupabaseDB) repository.ClinicalServiceRepository {
	return &ClinicalServiceRepoAdapter{db: db}
}

func (a *ClinicalServiceRepoAdapter) GetByID(ctx context.Context, id string) (*entity.ClinicalService, error) {
	return a.db.ClinicalServiceGetByID(ctx, id)
}

func (a *ClinicalServiceRepoAdapter) GetBySlug(ctx context.Context, slug string) (*entity.ClinicalService, error) {
	return a.db.ClinicalServiceGetBySlug(ctx, slug)
}

func (a *ClinicalServiceRepoAdapter) List(ctx context.Context, department string, params pagination.Params) (*pagination.PageResult[entity.ClinicalService], error) {
	return a.db.ClinicalServiceList(ctx, department, params)
}

func (a *ClinicalServiceRepoAdapter) Create(ctx context.Context, srv *entity.ClinicalService) error {
	return a.db.ClinicalServiceCreate(ctx, srv)
}

type AppointmentRepoAdapter struct {
	db *SupabaseDB
}

func NewAppointmentRepoAdapter(db *SupabaseDB) repository.AppointmentRepository {
	return &AppointmentRepoAdapter{db: db}
}

func (a *AppointmentRepoAdapter) GetByID(ctx context.Context, id string) (*entity.Appointment, error) {
	return a.db.AppointmentGetByID(ctx, id)
}

func (a *AppointmentRepoAdapter) GetByReference(ctx context.Context, ref string) (*entity.Appointment, error) {
	return a.db.AppointmentGetByReference(ctx, ref)
}

func (a *AppointmentRepoAdapter) List(ctx context.Context, filter repository.AppointmentFilter, params pagination.Params) (*pagination.PageResult[entity.Appointment], error) {
	return a.db.AppointmentList(ctx, filter, params)
}

func (a *AppointmentRepoAdapter) Create(ctx context.Context, apt *entity.Appointment) error {
	return a.db.AppointmentCreate(ctx, apt)
}

func (a *AppointmentRepoAdapter) UpdateStatus(ctx context.Context, id string, status entity.AppointmentStatus, reason string) error {
	return a.db.AppointmentUpdateStatus(ctx, id, status, reason)
}

func (a *AppointmentRepoAdapter) Reschedule(ctx context.Context, id string, newDate, newTime string) (*entity.Appointment, error) {
	return a.db.AppointmentReschedule(ctx, id, newDate, newTime)
}

func (a *AppointmentRepoAdapter) Update(ctx context.Context, apt *entity.Appointment) error {
	return a.db.AppointmentUpdate(ctx, apt)
}

type TransactionRepoAdapter struct {
	db *SupabaseDB
}

func NewTransactionRepoAdapter(db *SupabaseDB) repository.TransactionRepository {
	return &TransactionRepoAdapter{db: db}
}

func (a *TransactionRepoAdapter) GetByID(ctx context.Context, id string) (*entity.Transaction, error) {
	return a.db.TransactionGetByID(ctx, id)
}

func (a *TransactionRepoAdapter) List(ctx context.Context, filter repository.TransactionFilter, params pagination.Params) (*pagination.PageResult[entity.Transaction], error) {
	return a.db.TransactionList(ctx, filter, params)
}

func (a *TransactionRepoAdapter) Create(ctx context.Context, tx *entity.Transaction) error {
	return a.db.TransactionCreate(ctx, tx)
}

// ----------------- Lead & Newsletter Repo Adapter -----------------

type LeadRepoAdapter struct {
	db *SupabaseDB
}

func NewLeadRepoAdapter(db *SupabaseDB) repository.LeadRepository {
	return &LeadRepoAdapter{db: db}
}

func (a *LeadRepoAdapter) CreateLead(ctx context.Context, lead *entity.LeadSubmission) error {
	return a.db.CreateLead(ctx, lead)
}

func (a *LeadRepoAdapter) CreateNewsletter(ctx context.Context, sub *entity.NewsletterSubmission) error {
	return a.db.CreateNewsletter(ctx, sub)
}

func (a *LeadRepoAdapter) ListLeads(ctx context.Context, params pagination.Params) (*pagination.PageResult[entity.LeadSubmission], error) {
	return a.db.ListLeads(ctx, params)
}

// ----------------- Clinical Records Repo Adapter -----------------

type ClinicalRecordRepoAdapter struct {
	db *SupabaseDB
}

func NewClinicalRecordRepoAdapter(db *SupabaseDB) repository.ClinicalRecordRepository {
	return &ClinicalRecordRepoAdapter{db: db}
}

func (a *ClinicalRecordRepoAdapter) CreateRefill(ctx context.Context, refill *entity.PrescriptionRefill) error {
	return a.db.CreateRefill(ctx, refill)
}

func (a *ClinicalRecordRepoAdapter) ListRefills(ctx context.Context, patientID string, status string) ([]entity.PrescriptionRefill, error) {
	return a.db.ListRefills(ctx, patientID, status)
}

func (a *ClinicalRecordRepoAdapter) ApproveRefill(ctx context.Context, refillID string) error {
	return a.db.ApproveRefill(ctx, refillID)
}

func (a *ClinicalRecordRepoAdapter) CreateSOAPNote(ctx context.Context, note *entity.SOAPNote) error {
	return a.db.CreateSOAPNote(ctx, note)
}

func (a *ClinicalRecordRepoAdapter) ListSOAPNotes(ctx context.Context, patientID string) ([]entity.SOAPNote, error) {
	return a.db.ListSOAPNotes(ctx, patientID)
}

// ----------------- Account Repo Adapter -----------------

type AccountRepoAdapter struct {
	db *SupabaseDB
}

func NewAccountRepoAdapter(db *SupabaseDB) repository.AccountRepository {
	return &AccountRepoAdapter{db: db}
}

func (a *AccountRepoAdapter) ListAccounts(ctx context.Context) ([]entity.BankAccount, error) {
	return a.db.ListAccounts(ctx)
}

func (a *AccountRepoAdapter) GetAccountByID(ctx context.Context, id string) (*entity.BankAccount, error) {
	return a.db.GetAccountByID(ctx, id)
}

func (a *AccountRepoAdapter) CreateAccount(ctx context.Context, acc *entity.BankAccount) error {
	return a.db.CreateAccount(ctx, acc)
}

func (a *AccountRepoAdapter) UpdateBalance(ctx context.Context, id string, amountDelta float64) error {
	return a.db.UpdateBalance(ctx, id, amountDelta)
}

// ----------------- Analytics Repo Adapter -----------------

type AnalyticsRepoAdapter struct {
	db *SupabaseDB
}

func NewAnalyticsRepoAdapter(db *SupabaseDB) repository.AnalyticsRepository {
	return &AnalyticsRepoAdapter{db: db}
}

func (a *AnalyticsRepoAdapter) GetSummary(ctx context.Context) (*entity.AnalyticsSummary, error) {
	return a.db.GetSummary(ctx)
}

