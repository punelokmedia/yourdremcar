import ContactQuery from "../models/ContactQuery.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const createContactQuery = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid phone number",
      });
    }

    const query = await ContactQuery.create({
      fullName,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Contact query submitted successfully",
      data: query,
    });
  } catch (error) {
    return next(error);
  }
};

export const getContactQueries = async (_req, res, next) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      data: queries,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateContactQueryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Contacted", "Resolved"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const query = await ContactQuery.findById(id);
    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Contact query not found",
      });
    }

    query.status = status;
    await query.save();

    return res.status(200).json({
      success: true,
      message: "Contact query status updated successfully",
      data: query,
    });
  } catch (error) {
    return next(error);
  }
};
