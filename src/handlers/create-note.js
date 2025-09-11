export const handler = async (event) => {
  return {
    statusCode: 501,
    body: JSON.stringify({ message: "POST /api/notes/{username} not implemented yet" })
  };
};