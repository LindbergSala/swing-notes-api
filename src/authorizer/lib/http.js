export const ok = (data) => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

export const badRequest = (message, details = null) => ({
  statusCode: 400,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error: "BadRequest", message, details })
});

export const notFound = (message = "Not Found") => ({
  statusCode: 404,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error: "NotFound", message })
});

export const serverError = (message = "Internal Server Error") => ({
  statusCode: 500,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ error: "InternalServerError", message })
});
