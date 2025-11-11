const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message,
    ...(error && { error })
  };
  return res.status(statusCode).json(response);
};

const paginatedResponse = (res, statusCode, message, data, pagination) => {
  const response = {
    success: true,
    message,
    data,
    pagination
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
