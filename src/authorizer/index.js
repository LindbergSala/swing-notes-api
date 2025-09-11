export const handler = async (event) => {
  const apiKey = event?.headers?.["x-api-key"] || event?.headers?.["X-Api-Key"];

  const secret = process.env.AUTH_API_KEY_SECRET || "";
  const hasKey = typeof apiKey === "string" && apiKey.length > 0;
  const matches = !secret ? hasKey : apiKey === secret;

  const effect = matches ? "Allow" : "Deny";

  return {
    principalId: matches ? "user" : "anonymous",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: event.methodArn
        }
      ]
    },
    context: {
      authorizedBy: "lambda-authorizer",
      hasHeader: String(hasKey),
      headerMatchesSecret: String(matches)
    }
  };
};
