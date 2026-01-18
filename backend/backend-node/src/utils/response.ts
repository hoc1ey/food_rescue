export const sendSuccess = (res: any, message: string, data: any = null, status = 200) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: any,
  message: string,
  data: any = null,
  status = 500
) => {
  res.status(status).json({
    success: false,
    message,
    data,
  });
};
