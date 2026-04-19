import mongoose from "mongoose";
import SellCarRequest from "../models/SellCarRequest.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const createSellCarRequest = async (req, res, next) => {
  try {
    const {
      name: rawName,
      email: rawEmail,
      phone: rawPhone,
      carMakeModel: rawCar,
      year = "",
      expectedPrice = "",
      notes = "",
    } = req.body;

    const name = String(rawName ?? "").trim();
    const email = String(rawEmail ?? "").trim();
    const phone = String(rawPhone ?? "").trim();
    const carMakeModel = String(rawCar ?? "").trim();

    if (!name || !email || !phone || !carMakeModel) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and car details are required",
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

    const doc = await SellCarRequest.create({
      name,
      email: email.toLowerCase(),
      phone,
      carMakeModel,
      year: String(year ?? "").trim(),
      expectedPrice: String(expectedPrice ?? "").trim(),
      notes: String(notes ?? "").trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Thank you! We will contact you about selling your car.",
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const getSellCarRequests = async (_req, res, next) => {
  try {
    const list = await SellCarRequest.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return next(error);
  }
};

export const deleteSellCarRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request id",
      });
    }
    const deleted = await SellCarRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sell request not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Sell request deleted",
    });
  } catch (error) {
    return next(error);
  }
};
