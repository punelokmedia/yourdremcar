const errorHandler = (err, _req, res, _next) => {
  console.error(err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message:
        "Image is too large. Max 4 MB on Vercel — use a smaller JPEG/PNG or compress the file.",
    });
  }

  if (err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }

  if (
    typeof err.message === "string" &&
    err.message.includes("Only JPG, PNG, WebP, or GIF")
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
