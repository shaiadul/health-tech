"use server";

import { cookies } from "next/headers";
import { fetcher, fetcherWithAuth, ApiResponse } from "@/lib/fetcher";

const AUTH_COOKIE_NAME = "medpulse_session_token";

export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function setServerToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearServerToken() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// ------------------- Authentication Actions -------------------

export async function loginAction(credentials: {
  email: string;
  password?: string;
  preferredRole?: "patient" | "doctor" | "organizer";
}): Promise<ApiResponse> {
  const res = await fetcher("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (res.success && res.data?.token) {
    await setServerToken(res.data.token);
  }

  return res;
}

export async function signupAction(details: {
  name: string;
  email: string;
  password?: string;
  role: "patient" | "doctor" | "organizer";
  phone?: string;
  department?: string;
}): Promise<ApiResponse> {
  const res = await fetcher("/auth/signup", {
    method: "POST",
    body: JSON.stringify(details),
  });

  if (res.success && res.data?.token) {
    await setServerToken(res.data.token);
  }

  return res;
}

export async function logoutAction(): Promise<void> {
  await clearServerToken();
}

export async function getCurrentUserAction(): Promise<ApiResponse> {
  const token = await getServerToken();
  if (!token) {
    return { success: false, data: null, error: "Not authenticated" };
  }
  return fetcherWithAuth("/auth/me", token);
}

// ------------------- Specialists Actions -------------------

export interface SpecialistQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  language?: string;
  isAvailable?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getSpecialistsAction(
  params?: SpecialistQueryParams
): Promise<ApiResponse> {
  return fetcher("/specialists", {
    params: params as Record<string, any>,
    next: { revalidate: 60 },
  });
}

export async function getSpecialistByIdAction(id: string): Promise<ApiResponse> {
  return fetcher(`/specialists/${id}`);
}

export async function getFeaturedSpecialistsAction(limit = 6): Promise<ApiResponse> {
  return fetcher("/specialists/featured", {
    params: { limit },
    next: { revalidate: 300 },
  });
}

// ------------------- Clinical Services Actions -------------------

export interface ServiceQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
}

export async function getServicesAction(
  params?: ServiceQueryParams
): Promise<ApiResponse> {
  return fetcher("/services", {
    params: params as Record<string, any>,
    next: { revalidate: 300 },
  });
}

export async function getServiceByIdAction(idOrSlug: string): Promise<ApiResponse> {
  return fetcher(`/services/${idOrSlug}`);
}

// ------------------- Appointments Actions -------------------

export interface AppointmentQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  specialistId?: string;
  patientId?: string;
  status?: string;
  format?: string;
}

export async function getAppointmentsAction(
  params?: AppointmentQueryParams
): Promise<ApiResponse> {
  const token = await getServerToken();
  if (token) {
    return fetcherWithAuth("/appointments", token, {
      params: params as Record<string, any>,
    });
  }
  return fetcher("/appointments", {
    params: params as Record<string, any>,
  });
}

export async function getAppointmentByIdAction(id: string): Promise<ApiResponse> {
  return fetcher(`/appointments/${id}`);
}

export async function createAppointmentAction(input: {
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  specialistId: string;
  serviceId: string;
  date: string;
  timeSlot: string;
  format: "in_person" | "video";
  symptoms?: string;
}): Promise<ApiResponse> {
  const token = await getServerToken();
  if (token) {
    return fetcherWithAuth("/appointments", token, {
      method: "POST",
      body: JSON.stringify(input),
    });
  }
  return fetcher("/appointments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAppointmentStatusAction(
  id: string,
  status: "confirmed" | "in_consultation" | "completed" | "cancelled"
): Promise<ApiResponse> {
  const token = await getServerToken();
  if (!token) {
    return { success: false, data: null, error: "Authentication required" };
  }
  return fetcherWithAuth(`/appointments/${id}/status`, token, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ------------------- Transactions / Billing Actions (Staff-only) -------------------

export interface TransactionQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  department?: string;
  status?: string;
  patientId?: string;
}

export async function getTransactionsAction(
  params?: TransactionQueryParams
): Promise<ApiResponse> {
  const token = await getServerToken();
  if (!token) {
    return { success: false, data: null, error: "Staff authentication required" };
  }
  return fetcherWithAuth("/transactions", token, {
    params: params as Record<string, any>,
  });
}

// ------------------- Zoom Telehealth Realtime Actions -------------------

export async function createZoomMeetingAction(topic: string): Promise<ApiResponse> {
  const token = await getServerToken();
  if (!token) {
    return { success: false, data: null, error: "Authentication required" };
  }
  return fetcherWithAuth("/meetings/zoom", token, {
    method: "POST",
    body: JSON.stringify({ topic }),
  });
}

export async function getZoomSDKTokenAction(meetingId: string): Promise<ApiResponse> {
  const token = await getServerToken();
  if (!token) {
    return { success: false, data: null, error: "Authentication required" };
  }
  return fetcherWithAuth(`/meetings/zoom/${meetingId}/token`, token);
}

