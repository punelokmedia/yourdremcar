import mongoose from "mongoose";
import BuyRequest from "../models/BuyRequest.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

export const createBuyRequest = async (req, res, next) => {
  try {
    const { name, email, phone, carName } = req.body;

    if (!name || !email || !phone || !carName) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and car name are required",
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

    const request = await BuyRequest.create({
      name,
      email,
      phone,
      carName,
    });

    return res.status(201).json({
      success: true,
      message: "Buy request submitted successfully",
      data: request,
    });
  } catch (error) {
    return next(error);
  }
};

export const getBuyRequests = async (_req, res, next) => {
  try {
    const requests = await BuyRequest.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteBuyRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request id",
      });
    }
    const deleted = await BuyRequest.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Buy request not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Buy request deleted",
    });
  } catch (error) {
    return next(error);
  }
};
