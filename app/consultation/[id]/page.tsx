import * as React from "react"
import { VideoRoom } from "@/features/consultation/components/video-room"
import { SpecialistService } from "@/features/specialists/services/specialist.service"
import { AppointmentService } from "@/features/appointments/services/appointment.service"

interface ConsultationPageProps {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: "Encrypted Telehealth Room | MedPulse Hospital",
  description: "Secure, HIPAA-compliant outpatient video consultation room.",
}

export default async function ConsultationRoomPage({ params }: ConsultationPageProps) {
  const { id } = await params
  
  // Try to lookup specialist and appointment by id or reference
  const appointment = await AppointmentService.getById(id)
  const specialist = appointment
    ? await SpecialistService.getById(appointment.specialistId)
    : (await SpecialistService.getFeatured())[0]

  return (
    <VideoRoom
      roomId={id}
      specialistName={specialist?.name || "Dr. Sarah Ahmed, MD, FACC"}
      specialistTitle={specialist?.title || "Chief Cardiologist & Attending Physician"}
      specialistAvatar={
        specialist?.avatar ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80"
      }
      patientName={appointment ? `${appointment.customer.firstName} ${appointment.customer.lastName}` : "Alex Mercer"}
    />
  )
}
