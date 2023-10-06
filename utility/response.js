// Response Functions

exports.SuccessResponseWithData = (status, msg, data, requestId = null) => {
  const response = {
    statusCode: 200,
    body: {
      meta: {
        requestId,
      },
      data,
      status,
      message: msg,
    },
  };

  return response;
};

exports.SuccessResponse = (status, msg, requestId = null) => {
  const response = {
    statusCode: 200,
    body: {
      meta: {
        requestId,
      },
      status,
      message: msg,
    },
  };

  return response;
};

exports.BadRequestResponseWithData = (status, msg, data, requestId = null) => {
  const response = {
    statusCode: 400,
    body: {
      meta: {
        requestId,
      },
      data,
      status,
      message: msg,
    },
  };

  return response;
};

exports.BadRequestResponse = (status, msg, requestId = null) => {
  const response = {
    statusCode: 400,
    body: {
      meta: {
        requestId,
      },
      status,
      message: msg,
    },
  };

  return response;
};

exports.ErrorResponseWithData = (status, msg, data, requestId = null) => {
  const response = {
    statusCode: 500,
    body: {
      meta: {
        requestId,
      },
      error: data,
      status,
      message: msg,
    },
  };

  return response;
};

exports.ErrorResponse = (status, msg, requestId = null) => {
  const response = {
    statusCode: 500,
    body: {
      meta: {
        requestId,
      },
      status,
      message: msg,
    },
  };

  return response;
};

exports.UnauthorizedResponse = (msg, requestId = null) => {
  const response = {
    statusCode: 401,
    body: {
      meta: {
        requestId,
      },
      status: "Unauthorized Error",
      message: msg,
    },
  };

  return response;
};
