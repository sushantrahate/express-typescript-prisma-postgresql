export const createResponse = (
  success: boolean,
  data?: object | null,
  message?: string
) => {
  return {
    success,
    data,
    message,
  };
};
