const ResponseHelper = {
  sendResponse(res, statusCode, data) {
    if (statusCode === 200)
      res.status(statusCode).json({
        message: "Success! Login successfully",
        data,
      });
    else if (statusCode === 401)
      res.status(statusCode).json({
        message: "Failed! Wrong password",
      });
    else if (statusCode === 404)
      res.status(statusCode).json({
        message: "Failed! User not found",
      });
  },
};

export default ResponseHelper;
