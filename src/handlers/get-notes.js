export const handler = async (event) => {
  return {
    statusCode: 501,
    body: JSON.stringify({ message: "GET /api/notes/{username} not implemented yet" })
  };
};
