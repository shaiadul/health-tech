import * as React from "react"
import { VideoRoom } from "@/features/consultation/components/video-room"
import { SpecialistService } from "@/features/specialists/services/specialist.service"

export const metadata = {
  title: "Telehealth Video Consultation | MedPulse Hospital",
  description: "Live encrypted medical video room for doctor-patient consultation.",
}

export default async function DefaultConsultationPage() {
  const doctors = await SpecialistService.getFeatured()
  const specialist = doctors[0]

  return (
    <VideoRoom
      roomId="MED-TELEHEALTH-LIVE"
      specialistName={specialist?.name || "Dr. Sarah Ahmed, MD, FACC"}
      specialistTitle={specialist?.title || "Chief Cardiologist & Attending Physician"}
      specialistAvatar={
        specialist?.avatar ||
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80"
      }
      patientName="Alex Mercer"
    />
  )
}
