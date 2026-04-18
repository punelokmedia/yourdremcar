import Review from "../models/Review.js";

export const createReview = async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const comment =
      typeof req.body.comment === "string" ? req.body.comment.trim() : "";
    const rating = Number(req.body.rating);

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name (at least 2 characters).",
      });
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please select a rating from 1 to 5 stars.",
      });
    }

    if (!comment || comment.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please write a short review (at least 5 characters).",
      });
    }

    const review = await Review.create({ name, rating, comment });

    return res.status(201).json({
      success: true,
      message: "Thank you for your review!",
      data: review,
    });
  } catch (error) {
    return next(error);
  }
};

export const getReviews = async (_req, res, next) => {
  try {
    const list = await Review.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    return next(error);
  }
};
