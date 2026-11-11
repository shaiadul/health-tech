package db

import (
	"context"
	"database/sql"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/health-tech/backend/internal/domain/entity"
	"github.com/health-tech/backend/internal/domain/repository"
	"github.com/health-tech/backend/pkg/pagination"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type SupabaseDB struct {
	db     *sql.DB
	isLive bool

	// In-memory fallbacks seeded with domain data if DB isn't connected
	mu           sync.RWMutex
	users        map[string]*entity.User
	specialists  map[string]*entity.Specialist
	services     map[string]*entity.ClinicalService
	appointments map[string]*entity.Appointment
	transactions map[string]*entity.Transaction
	leads        map[string]*entity.LeadSubmission
	newsletters  []*entity.NewsletterSubmission
	refills      map[string]*entity.PrescriptionRefill
	soapNotes    map[string]*entity.SOAPNote
	accounts     map[string]*entity.BankAccount
}

func NewSupabaseDB(databaseURL string) (*SupabaseDB, error) {
	s := &SupabaseDB{
		users:        make(map[string]*entity.User),
		specialists:  make(map[string]*entity.Specialist),
		services:     make(map[string]*entity.ClinicalService),
		appointments: make(map[string]*entity.Appointment),
		transactions: make(map[string]*entity.Transaction),
		leads:        make(map[string]*entity.LeadSubmission),
		refills:      make(map[string]*entity.PrescriptionRefill),
		soapNotes:    make(map[string]*entity.SOAPNote),
		accounts:     make(map[string]*entity.BankAccount),
	}

	s.seedDefaultData()

	if databaseURL != "" {
		db, err := sql.Open("postgres", databaseURL)
		if err == nil {
			db.SetMaxOpenConns(25)
			db.SetMaxIdleConns(5)
			db.SetConnMaxLifetime(5 * time.Minute)

			ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			defer cancel()
			if err := db.PingContext(ctx); err == nil {
				s.db = db
				s.isLive = true
				_ = s.createTables(db)
			}
		}
	}

	return s, nil
}

func (s *SupabaseDB) seedDefaultData() {
	passHash, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	pass := string(passHash)

	// Seed Users matching frontend
	u1 := &entity.User{
		ID:               "usr_patient_alex",
		Email:            "alex.mercer@gmail.com",
		PasswordHash:     pass,
		Name:             "Alex Mercer",
		Role:             entity.RolePatient,
		RoleTitle:        "Registered Patient",
		Avatar:           "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
		Phone:            "+1 (555) 389-9921",
		PatientID:        "PT-89241",
		BloodType:        "O-Positive",
		Allergies:        []string{"Penicillin", "Sulfa drugs"},
		EmergencyContact: "Elena Mercer (Spouse) · +1 (555) 389-9922",
		CreatedAt:        time.Now(),
		UpdatedAt:        time.Now(),
	}
	u2 := &entity.User{
		ID:           "usr_doctor_sarah",
		Email:        "s.ahmed@medpulse.health",
		PasswordHash: pass,
		Name:         "Dr. Sarah Ahmed, MD, FACC",
		Role:         entity.RoleDoctor,
		RoleTitle:    "Chief Cardiologist & Attending Physician",
		Avatar:       "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80",
		Department:   "Cardiology & Heart Health",
		Phone:        "+1 (800) 432-5847",
		StaffID:      "MD-1029",
		ClinicRoom:   "Room 402B · West Cardiac Wing",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	u3 := &entity.User{
		ID:           "usr_organizer_vance",
		Email:        "admin@medpulse.health",
		PasswordHash: pass,
		Name:         "Dr. Marcus Vance, MD, PhD",
		Role:         entity.RoleOrganizer,
		RoleTitle:    "Hospital Operations Director & Clinic Administrator",
		Avatar:       "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
		Department:   "Clinical Facility Operations",
		Phone:        "+1 (800) 432-9000",
		StaffID:      "ORG-001",
		ClinicRoom:   "Executive Medical Suite 100",
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	s.users[u1.ID] = u1
	s.users[u2.ID] = u2
	s.users[u3.ID] = u3

	// Seed Specialists
	sp1 := &entity.Specialist{
		ID:              "spec_cardio_sarah",
		Name:            "Dr. Sarah Ahmed, MD, FACC",
		Title:           "Chief of Clinical Cardiology",
		Department:      "Cardiology & Heart Health",
		Specialty:       "Interventional Cardiology, Heart Failure",
		Avatar:          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80",
		Rating:          4.95,
		ReviewsCount:    342,
		ExperienceYears: 16,
		Education:       "Johns Hopkins School of Medicine",
		Bio:             "Board-certified cardiologist leading clinical cardiac rhythm and heart failure outpatient teams.",
		Price:           180.0,
		Currency:        "USD",
		NextAvailable:   "Tomorrow at 09:30 AM",
		IsAvailable:     true,
		Languages:       []string{"English", "Arabic"},
		AvailableDays:   []string{"Mon", "Tue", "Wed", "Thu", "Fri"},
		ClinicRoom:      "Room 402B · West Cardiac Wing",
		CreatedAt:       time.Now(),
	}
	sp2 := &entity.Specialist{
		ID:              "spec_neuro_david",
		Name:            "Dr. David Kim, MD, PhD",
		Title:           "Director of Neuro-Diagnostics",
		Department:      "Neurology & Brain Health",
		Specialty:       "Migraine, Epilepsy & Neuropathy",
		Avatar:          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80",
		Rating:          4.92,
		ReviewsCount:    289,
		ExperienceYears: 14,
		Education:       "Stanford University School of Medicine",
		Bio:             "Expert neurologist specializing in complex migraine disorders and nerve conduction studies.",
		Price:           195.0,
		Currency:        "USD",
		NextAvailable:   "Thursday at 02:00 PM",
		IsAvailable:     true,
		Languages:       []string{"English", "Korean"},
		AvailableDays:   []string{"Mon", "Wed", "Thu"},
		ClinicRoom:      "Room 310 · Neuro Clinic",
		CreatedAt:       time.Now(),
	}
	sp3 := &entity.Specialist{
		ID:              "spec_ped_emily",
		Name:            "Dr. Emily Watson, MD, FAAP",
		Title:           "Lead Pediatrician",
		Department:      "Pediatrics & Child Wellness",
		Specialty:       "Developmental & Preventive Pediatrics",
		Avatar:          "https://images.unsplash.com/photo-1594824813589-9851e4431e6c?w=500&auto=format&fit=crop&q=80",
		Rating:          4.98,
		ReviewsCount:    415,
		ExperienceYears: 12,
		Education:       "Harvard Medical School",
		Bio:             "Dedicated pediatric specialist committed to newborn care, vaccines, and early child development.",
		Price:           140.0,
		Currency:        "USD",
		NextAvailable:   "Tomorrow at 11:00 AM",
		IsAvailable:     true,
		Languages:       []string{"English", "Spanish"},
		AvailableDays:   []string{"Tue", "Wed", "Thu", "Fri", "Sat"},
		ClinicRoom:      "Room 205 · Pediatric Center",
		CreatedAt:       time.Now(),
	}
	s.specialists[sp1.ID] = sp1
	s.specialists[sp2.ID] = sp2
	s.specialists[sp3.ID] = sp3

	// Seed Services
	srv1 := &entity.ClinicalService{
		ID:          "srv_cardio_01",
		Name:        "Cardiology Consultation",
		Slug:        "cardiology-consultation",
		Department:  "Cardiology & Heart Health",
		Description: "In-depth cardiac review, blood pressure assessment, and preventive ECG screening.",
		Price:       180.0,
		Currency:    "USD",
		DurationMin: 45,
		Icon:        "Heart",
		Features:    []string{"Resting ECG analysis", "Blood pressure profiling", "Personalized lifestyle plan"},
		IsPopular:   true,
	}
	srv2 := &entity.ClinicalService{
		ID:          "srv_neuro_02",
		Name:        "Neurology Evaluation",
		Slug:        "neurology-evaluation",
		Department:  "Neurology & Brain Health",
		Description: "Comprehensive neurological exam for migraines, chronic dizziness, and nerve issues.",
		Price:       195.0,
		Currency:    "USD",
		DurationMin: 60,
		Icon:        "Brain",
		Features:    []string{"Cranial nerve examination", "Headache diary review", "Follow-up digital notes"},
		IsPopular:   true,
	}
	srv3 := &entity.ClinicalService{
		ID:          "srv_pediatrics_03",
		Name:        "Pediatric Wellness Check",
		Slug:        "pediatric-wellness",
		Department:  "Pediatrics & Child Wellness",
		Description: "Routine child health check, growth milestone tracking, and immunization updates.",
		Price:       140.0,
		Currency:    "USD",
		DurationMin: 30,
		Icon:        "Baby",
		Features:    []string{"Growth chart assessment", "Vaccination advice", "Dietary consultation"},
		IsPopular:   false,
	}
	s.services[srv1.ID] = srv1
	s.services[srv2.ID] = srv2
	s.services[srv3.ID] = srv3

	// Seed Initial Appointments
	apt1 := &entity.Appointment{
		ID:             "apt_live_001",
		Reference:      "MED-2026-8921",
		PatientID:      "usr_patient_alex",
		PatientName:    "Alex Mercer",
		PatientEmail:   "alex.mercer@gmail.com",
		SpecialistID:   "spec_cardio_sarah",
		SpecialistName: "Dr. Sarah Ahmed, MD, FACC",
		ServiceID:      "srv_cardio_01",
		ServiceName:    "Cardiology Consultation",
		Department:     "Cardiology & Heart Health",
		Date:           time.Now().Format("2006-01-02"),
		TimeSlot:       "10:00 AM",
		Format:         "video",
		Status:         entity.AppointmentStatusInConsultation,
		Price:          180.0,
		Currency:       "USD",
		Symptoms:       "Palpitations and fatigue after light exercise",
		RoomID:         "room-telehealth-001",
		CreatedAt:      time.Now().Add(-2 * time.Hour),
		UpdatedAt:      time.Now(),
	}
	s.appointments[apt1.ID] = apt1

	// Seed Default Refills
	r1 := &entity.PrescriptionRefill{
		ID:               "ref_001",
		PatientID:        "usr_patient_alex",
		PatientName:      "Alex Mercer",
		MedicationID:     "med_1",
		MedicationName:   "Atorvastatin Calcium",
		Dosage:           "20 mg Oral Tablet",
		RxNumber:         "RX-884102",
		PharmacyName:     "CVS Pharmacy #4192",
		RefillsRemaining: 2,
		Status:           "pending",
		PrescribedBy:     "Dr. Sarah Ahmed, MD",
		CreatedAt:        time.Now().Add(-24 * time.Hour),
	}
	s.refills[r1.ID] = r1

	// Seed Default Accounts
	acc1 := &entity.BankAccount{
		ID:               "acc_01",
		Name:             "MedPulse Clinical Operating Account",
		AccountType:      "checking",
		AccountNumber:    "482910481920",
		RoutingNumber:    "121000358",
		Balance:          845200.0,
		AvailableBalance: 845200.0,
		Currency:         "USD",
		Status:           "active",
		CardLast4:        "1920",
		InstitutionName:  "JPMorgan Chase Healthcare",
		ColorTheme:       "navy",
	}
	s.accounts[acc1.ID] = acc1
}

func (s *SupabaseDB) createTables(db *sql.DB) error {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id TEXT PRIMARY KEY,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		name TEXT NOT NULL,
		role TEXT NOT NULL,
		role_title TEXT,
		avatar TEXT,
		department TEXT,
		phone TEXT,
		patient_id TEXT,
		staff_id TEXT,
		blood_type TEXT,
		allergies TEXT[],
		emergency_contact TEXT,
		clinic_room TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS specialists (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		title TEXT NOT NULL,
		department TEXT NOT NULL,
		specialty TEXT NOT NULL,
		avatar TEXT,
		rating NUMERIC(3,2),
		reviews_count INT,
		experience_years INT,
		education TEXT,
		bio TEXT,
		price NUMERIC(10,2),
		currency TEXT DEFAULT 'USD',
		next_available TEXT,
		is_available BOOLEAN DEFAULT TRUE,
		languages TEXT[],
		available_days TEXT[],
		clinic_room TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS clinical_services (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		slug TEXT UNIQUE NOT NULL,
		department TEXT NOT NULL,
		description TEXT,
		price NUMERIC(10,2),
		currency TEXT DEFAULT 'USD',
		duration_min INT,
		icon TEXT,
		features TEXT[],
		is_popular BOOLEAN DEFAULT FALSE
	);

	CREATE TABLE IF NOT EXISTS appointments (
		id TEXT PRIMARY KEY,
		reference TEXT UNIQUE NOT NULL,
		patient_id TEXT NOT NULL,
		patient_name TEXT NOT NULL,
		patient_email TEXT NOT NULL,
		patient_phone TEXT,
		specialist_id TEXT NOT NULL,
		specialist_name TEXT NOT NULL,
		service_id TEXT NOT NULL,
		service_name TEXT NOT NULL,
		department TEXT NOT NULL,
		date TEXT NOT NULL,
		time_slot TEXT NOT NULL,
		format TEXT NOT NULL,
		status TEXT NOT NULL,
		price NUMERIC(10,2),
		currency TEXT DEFAULT 'USD',
		symptoms TEXT,
		meeting_url TEXT,
		zoom_meeting_id TEXT,
		zoom_password TEXT,
		room_id TEXT,
		created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
		updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);

	CREATE TABLE IF NOT EXISTS transactions (
		id TEXT PRIMARY KEY,
		reference TEXT UNIQUE NOT NULL,
		patient_id TEXT NOT NULL,
		patient_name TEXT NOT NULL,
		appointment_id TEXT,
		category TEXT NOT NULL,
		department TEXT NOT NULL,
		amount NUMERIC(10,2) NOT NULL,
		currency TEXT DEFAULT 'USD',
		status TEXT NOT NULL,
		payment_method TEXT,
		date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
	);
	`
	_, err := db.Exec(schema)
	return err
}

// Ensure SupabaseDB satisfies UserRepository interface directly
var _ repository.UserRepository = (*SupabaseDB)(nil)

// ----------------- User Repository -----------------

func (s *SupabaseDB) GetByID(ctx context.Context, id string) (*entity.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	user, ok := s.users[id]
	if !ok {
		return nil, fmt.Errorf("user not found")
	}
	return user, nil
}

func (s *SupabaseDB) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	clean := strings.ToLower(strings.TrimSpace(email))
	for _, u := range s.users {
		if strings.ToLower(u.Email) == clean {
			return u, nil
		}
	}
	return nil, fmt.Errorf("user not found")
}

func (s *SupabaseDB) Create(ctx context.Context, user *entity.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.users[user.ID] = user
	return nil
}

func (s *SupabaseDB) Update(ctx context.Context, user *entity.User) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.users[user.ID] = user
	return nil
}

func (s *SupabaseDB) List(ctx context.Context, role entity.UserRole, params pagination.Params) (*pagination.PageResult[entity.User], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []entity.User
	for _, u := range s.users {
		if role != "" && u.Role != role {
			continue
		}
		if params.Search != "" {
			q := strings.ToLower(params.Search)
			if !strings.Contains(strings.ToLower(u.Name), q) && !strings.Contains(strings.ToLower(u.Email), q) {
				continue
			}
		}
		matched = append(matched, *u)
	}

	total := int64(len(matched))
	start := params.Offset()
	end := start + params.Limit()

	if start > len(matched) {
		start = len(matched)
	}
	if end > len(matched) {
		end = len(matched)
	}

	return &pagination.PageResult[entity.User]{
		Data: matched[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

// ----------------- Specialist Repository -----------------

func (s *SupabaseDB) SpecialistGetByID(ctx context.Context, id string) (*entity.Specialist, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sp, ok := s.specialists[id]
	if !ok {
		return nil, fmt.Errorf("specialist not found")
	}
	return sp, nil
}

// Specialist Repository GetByID
func (s *SupabaseDB) GetSpecialistByID(ctx context.Context, id string) (*entity.Specialist, error) {
	return s.SpecialistGetByID(ctx, id)
}

func (s *SupabaseDB) SpecialistList(ctx context.Context, filter repository.SpecialistFilter, params pagination.Params) (*pagination.PageResult[entity.Specialist], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []entity.Specialist
	for _, sp := range s.specialists {
		if filter.Department != "" && filter.Department != "All Departments" && !strings.EqualFold(sp.Department, filter.Department) {
			continue
		}
		if filter.IsAvailable != nil && sp.IsAvailable != *filter.IsAvailable {
			continue
		}
		if filter.MinRating > 0 && sp.Rating < filter.MinRating {
			continue
		}
		if params.Search != "" {
			q := strings.ToLower(params.Search)
			if !strings.Contains(strings.ToLower(sp.Name), q) &&
				!strings.Contains(strings.ToLower(sp.Specialty), q) &&
				!strings.Contains(strings.ToLower(sp.Department), q) {
				continue
			}
		}
		matched = append(matched, *sp)
	}

	total := int64(len(matched))
	start := params.Offset()
	end := start + params.Limit()
	if start > len(matched) {
		start = len(matched)
	}
	if end > len(matched) {
		end = len(matched)
	}

	return &pagination.PageResult[entity.Specialist]{
		Data: matched[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

func (s *SupabaseDB) SpecialistGetFeatured(ctx context.Context, limit int) ([]entity.Specialist, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []entity.Specialist
	for _, sp := range s.specialists {
		list = append(list, *sp)
		if limit > 0 && len(list) >= limit {
			break
		}
	}
	return list, nil
}

func (s *SupabaseDB) SpecialistCreate(ctx context.Context, sp *entity.Specialist) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.specialists[sp.ID] = sp
	return nil
}

// ----------------- Clinical Service Repository -----------------

func (s *SupabaseDB) ClinicalServiceGetByID(ctx context.Context, id string) (*entity.ClinicalService, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	srv, ok := s.services[id]
	if !ok {
		return nil, fmt.Errorf("service not found")
	}
	return srv, nil
}

func (s *SupabaseDB) ClinicalServiceGetBySlug(ctx context.Context, slug string) (*entity.ClinicalService, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, srv := range s.services {
		if srv.Slug == slug {
			return srv, nil
		}
	}
	return nil, fmt.Errorf("service not found")
}

func (s *SupabaseDB) ClinicalServiceList(ctx context.Context, department string, params pagination.Params) (*pagination.PageResult[entity.ClinicalService], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []entity.ClinicalService
	for _, srv := range s.services {
		if department != "" && department != "All Departments" && !strings.EqualFold(srv.Department, department) {
			continue
		}
		if params.Search != "" {
			q := strings.ToLower(params.Search)
			if !strings.Contains(strings.ToLower(srv.Name), q) && !strings.Contains(strings.ToLower(srv.Description), q) {
				continue
			}
		}
		matched = append(matched, *srv)
	}

	total := int64(len(matched))
	start := params.Offset()
	end := start + params.Limit()
	if start > len(matched) {
		start = len(matched)
	}
	if end > len(matched) {
		end = len(matched)
	}

	return &pagination.PageResult[entity.ClinicalService]{
		Data: matched[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

func (s *SupabaseDB) ClinicalServiceCreate(ctx context.Context, srv *entity.ClinicalService) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.services[srv.ID] = srv
	return nil
}

// ----------------- Appointment Repository -----------------

func (s *SupabaseDB) AppointmentGetByID(ctx context.Context, id string) (*entity.Appointment, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	apt, ok := s.appointments[id]
	if !ok {
		return nil, fmt.Errorf("appointment not found")
	}
	return apt, nil
}

func (s *SupabaseDB) AppointmentGetByReference(ctx context.Context, ref string) (*entity.Appointment, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, a := range s.appointments {
		if a.Reference == ref {
			return a, nil
		}
	}
	return nil, fmt.Errorf("appointment not found")
}

func (s *SupabaseDB) AppointmentList(ctx context.Context, filter repository.AppointmentFilter, params pagination.Params) (*pagination.PageResult[entity.Appointment], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []entity.Appointment
	for _, apt := range s.appointments {
		if filter.PatientID != "" && apt.PatientID != filter.PatientID {
			continue
		}
		if filter.SpecialistID != "" && apt.SpecialistID != filter.SpecialistID {
			continue
		}
		if filter.Department != "" && filter.Department != "All Departments" && !strings.EqualFold(apt.Department, filter.Department) {
			continue
		}
		if filter.Status != "" && apt.Status != filter.Status {
			continue
		}
		if filter.Format != "" && apt.Format != filter.Format {
			continue
		}
		if params.Search != "" {
			q := strings.ToLower(params.Search)
			if !strings.Contains(strings.ToLower(apt.PatientName), q) &&
				!strings.Contains(strings.ToLower(apt.SpecialistName), q) &&
				!strings.Contains(strings.ToLower(apt.Reference), q) {
				continue
			}
		}
		matched = append(matched, *apt)
	}

	total := int64(len(matched))
	start := params.Offset()
	end := start + params.Limit()
	if start > len(matched) {
		start = len(matched)
	}
	if end > len(matched) {
		end = len(matched)
	}

	return &pagination.PageResult[entity.Appointment]{
		Data: matched[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

func (s *SupabaseDB) AppointmentCreate(ctx context.Context, apt *entity.Appointment) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.appointments[apt.ID] = apt
	return nil
}

func (s *SupabaseDB) AppointmentUpdateStatus(ctx context.Context, id string, status entity.AppointmentStatus, reason string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	apt, ok := s.appointments[id]
	if !ok {
		return fmt.Errorf("appointment not found")
	}
	apt.Status = status
	if reason != "" {
		apt.CancellationReason = reason
	}
	apt.UpdatedAt = time.Now()
	return nil
}

func (s *SupabaseDB) AppointmentReschedule(ctx context.Context, id string, newDate, newTime string) (*entity.Appointment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	apt, ok := s.appointments[id]
	if !ok {
		return nil, fmt.Errorf("appointment not found")
	}
	apt.Date = newDate
	apt.TimeSlot = newTime
	apt.Status = entity.AppointmentStatusRescheduled
	apt.UpdatedAt = time.Now()
	return apt, nil
}

// ----------------- Lead & Newsletter Repository -----------------

func (s *SupabaseDB) CreateLead(ctx context.Context, lead *entity.LeadSubmission) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.leads[lead.ID] = lead
	return nil
}

func (s *SupabaseDB) CreateNewsletter(ctx context.Context, sub *entity.NewsletterSubmission) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.newsletters = append(s.newsletters, sub)
	return nil
}

func (s *SupabaseDB) ListLeads(ctx context.Context, params pagination.Params) (*pagination.PageResult[entity.LeadSubmission], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []entity.LeadSubmission
	for _, l := range s.leads {
		list = append(list, *l)
	}

	total := int64(len(list))
	start := params.Offset()
	end := start + params.Limit()
	if start > len(list) {
		start = len(list)
	}
	if end > len(list) {
		end = len(list)
	}

	return &pagination.PageResult[entity.LeadSubmission]{
		Data: list[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

// ----------------- Clinical Records (Refills & SOAP) -----------------

func (s *SupabaseDB) CreateRefill(ctx context.Context, refill *entity.PrescriptionRefill) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.refills[refill.ID] = refill
	return nil
}

func (s *SupabaseDB) ListRefills(ctx context.Context, patientID string, status string) ([]entity.PrescriptionRefill, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []entity.PrescriptionRefill
	for _, r := range s.refills {
		if patientID != "" && r.PatientID != patientID {
			continue
		}
		if status != "" && r.Status != status {
			continue
		}
		list = append(list, *r)
	}
	return list, nil
}

func (s *SupabaseDB) ApproveRefill(ctx context.Context, refillID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	ref, ok := s.refills[refillID]
	if !ok {
		return fmt.Errorf("refill not found")
	}
	ref.Status = "approved"
	if ref.RefillsRemaining > 0 {
		ref.RefillsRemaining--
	}
	return nil
}

func (s *SupabaseDB) CreateSOAPNote(ctx context.Context, note *entity.SOAPNote) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.soapNotes[note.ID] = note
	return nil
}

func (s *SupabaseDB) ListSOAPNotes(ctx context.Context, patientID string) ([]entity.SOAPNote, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []entity.SOAPNote
	for _, n := range s.soapNotes {
		if patientID != "" && n.PatientID != patientID {
			continue
		}
		list = append(list, *n)
	}
	return list, nil
}

// ----------------- Bank Accounts & Facilities -----------------

func (s *SupabaseDB) ListAccounts(ctx context.Context) ([]entity.BankAccount, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []entity.BankAccount
	for _, a := range s.accounts {
		list = append(list, *a)
	}
	return list, nil
}

func (s *SupabaseDB) GetAccountByID(ctx context.Context, id string) (*entity.BankAccount, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	acc, ok := s.accounts[id]
	if !ok {
		return nil, fmt.Errorf("account not found")
	}
	return acc, nil
}

func (s *SupabaseDB) CreateAccount(ctx context.Context, acc *entity.BankAccount) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.accounts[acc.ID] = acc
	return nil
}

func (s *SupabaseDB) UpdateBalance(ctx context.Context, id string, amountDelta float64) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	acc, ok := s.accounts[id]
	if !ok {
		return fmt.Errorf("account not found")
	}
	acc.Balance += amountDelta
	acc.AvailableBalance += amountDelta
	return nil
}

// ----------------- Analytics -----------------

func (s *SupabaseDB) GetSummary(ctx context.Context) (*entity.AnalyticsSummary, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return &entity.AnalyticsSummary{
		TotalIncomeMonth:   48250.0,
		TotalExpenseMonth:  12480.0,
		SavingsRate:        74.1,
		MonthlyGrowthRate:  14.2,
		TopExpenseCategory: "Medical Equipment & Diagnostics",
		AverageDailySpend:  416.0,
		OutpatientVolume:   1325,
		AverageWaitMinutes: 11.4,
		TelehealthRatio:    36.8,
		SatisfactionRate:   99.4,
	}, nil
}

func (s *SupabaseDB) AppointmentUpdate(ctx context.Context, apt *entity.Appointment) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	apt.UpdatedAt = time.Now()
	s.appointments[apt.ID] = apt
	return nil
}

// ----------------- Transaction Repository -----------------

func (s *SupabaseDB) TransactionGetByID(ctx context.Context, id string) (*entity.Transaction, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	tx, ok := s.transactions[id]
	if !ok {
		return nil, fmt.Errorf("transaction not found")
	}
	return tx, nil
}

func (s *SupabaseDB) TransactionList(ctx context.Context, filter repository.TransactionFilter, params pagination.Params) (*pagination.PageResult[entity.Transaction], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var matched []entity.Transaction
	for _, tx := range s.transactions {
		if filter.PatientID != "" && tx.PatientID != filter.PatientID {
			continue
		}
		if filter.Category != "" && filter.Category != "All Categories" && !strings.EqualFold(tx.Category, filter.Category) {
			continue
		}
		if filter.Department != "" && filter.Department != "All Departments" && !strings.EqualFold(tx.Department, filter.Department) {
			continue
		}
		if filter.Status != "" && tx.Status != filter.Status {
			continue
		}
		if params.Search != "" {
			q := strings.ToLower(params.Search)
			if !strings.Contains(strings.ToLower(tx.Reference), q) &&
				!strings.Contains(strings.ToLower(tx.PatientName), q) &&
				!strings.Contains(strings.ToLower(tx.Category), q) {
				continue
			}
		}
		matched = append(matched, *tx)
	}

	total := int64(len(matched))
	start := params.Offset()
	end := start + params.Limit()
	if start > len(matched) {
		start = len(matched)
	}
	if end > len(matched) {
		end = len(matched)
	}

	return &pagination.PageResult[entity.Transaction]{
		Data: matched[start:end],
		Meta: pagination.NewMeta(total, params.Page, params.PageSize),
	}, nil
}

func (s *SupabaseDB) TransactionCreate(ctx context.Context, tx *entity.Transaction) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.transactions[tx.ID] = tx
	return nil
}

