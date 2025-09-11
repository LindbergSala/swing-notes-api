export const handler = async (event) => {
  return {
    statusCode: 501,
    body: JSON.stringify({ message: "PUT /api/notes/{id} not implemented yet" })
  };
};
