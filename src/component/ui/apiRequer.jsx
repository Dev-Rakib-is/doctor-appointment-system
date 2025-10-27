import React from "react";

const apiRequer = () => {
  return (
    <></>
    //    Base URL
    // https://appointment-manager-node.onrender.com/api/v1
    // Authentication
    // POST /auth/login
    // Body: { email, password, role } // role = DOCTOR | PATIENT

    // POST /auth/register/patient
    // Body: { name, email, password, photo_url? }

    // POST /auth/register/doctor
    // Body: { name, email, password, specialization, photo_url? }
    // Specializations
    // GET /specializations
    // Response: ["Cardiologist", "Dentist", "Neurologist", ...]
    // Doctors
    // GET /doctors?page={page}&limit={limit}&search={name?}&specialization={specialization?}
    // Appointments create
    // POST /appointments
    // Body: { doctorId, date }
    // Get Patient Appointment
    // GET /appointments/patient?status={status?}&page={page}

    // Get Doctor appointment
    // GET /appointments/doctor?status={status?}&date={yyyy-mm-dd?}&page={page}
    // update status
    // PATCH /appointments/update-status
    // Body: { status, appointment_id } // status = COMPLETE | CANCELLED
  );
};

export default apiRequer;
