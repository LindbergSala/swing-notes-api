export const handler = async (event) => {
  return {
    statusCode: 501,
    body: JSON.stringify({ message: "DELETE /api/notes/{id} not implemented yet" })
  };
};
