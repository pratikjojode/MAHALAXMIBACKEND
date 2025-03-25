const Doctor = require("../models/DoctorModel");
const userModel = require("../models/userModels");
const { cloudinary, upload } = require("../config/cloudinaryConfig");

// ✅ Create Doctor
const createDoctor = async (req, res) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      Contact,
      email,
      address,
      Experience,
      timings,
      status,
      specialization,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "❌ Image is required" });
    }

    console.log("🔹 File received:", req.file); // ✅ Check if Multer is receiving the file

    // ✅ Upload Image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctor_images",
    });

    console.log("✅ Cloudinary Upload Response:", result); // ✅ Log Cloudinary response

    // ✅ Save Doctor Details
    const newDoctor = new Doctor({
      userId,
      firstName,
      lastName,
      Contact,
      email,
      address,
      image: result.secure_url, // ✅ Save Cloudinary URL
      Experience,
      timings,
      status,
      specialization,
    });

    await newDoctor.save();

    return res.status(201).json({
      message: "Doctor created successfully",
      doctor: newDoctor,
    });
  } catch (error) {
    console.error("❌ Error creating doctor:", error);
    return res.status(500).json({
      message: "Error creating doctor",
      error: error.message,
    });
  }
};

// ✅ Upload Doctor Image
const uploadDoctorImage = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // ✅ Upload new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    doctor.image = result.secure_url;
    await doctor.save();

    res.status(200).json({ message: "Image uploaded successfully", doctor });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading image", error: error.message });
  }
};

// ✅ Get Doctor Info
const getDoctorInfo = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body._id });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Doctor data fetched successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching doctor's details",
      error,
    });
  }
};

// ✅ Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    const {
      _id,
      firstName,
      lastName,
      email,
      contact,
      address,
      Experience,
      timings,
      specialization,
    } = req.body;

    const doctor = await Doctor.findOneAndUpdate(
      { userId: _id },
      {
        firstName,
        lastName,
        email,
        contact,
        address,
        Experience,
        timings,
        specialization,
      },
      { new: true }
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating doctor profile",
      error,
    });
  }
};

// ✅ Get Single Doctor by ID
const getSingleDoctorByid = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Single doctor fetched", data: doctor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching doctor", error });
  }
};

// ✅ Delete Doctor
const deleteDoctorCtrl = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.body.id);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    res.status(200).json({
      success: true,
      message: "Doctor deleted successfully",
      data: doctor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting doctor", error });
  }
};
const getAppointmentForDoctor = async (req, res) => {
  try {
    // Fetch appointments from the database using doctorId
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId });

    if (!appointments) {
      return res
        .status(404)
        .json({ success: false, message: "No appointments found" });
    }

    res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching appointments", error });
  }
};

// ✅ Add this function to exports
module.exports = {
  createDoctor,
  uploadDoctorImage,
  getDoctorInfo,
  updateDoctorProfile,
  getSingleDoctorByid,
  deleteDoctorCtrl,
  getAppointmentForDoctor,
};
