import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { ddb } from "../lib/db.js";
import { ok, badRequest, serverError } from "../lib/http.js";
import { validateNoteInput } from "../lib/validation.js";

export const handler = async (event) => {
  try {
    const username = event?.pathParameters?.username;
    if (typeof username !== "string" || username.trim().length === 0) {
      return badRequest("Path parameter 'username' is required");
    }

    let bodyObj;
    try {
      bodyObj = event?.body ? JSON.parse(event.body) : {};
    } catch {
      return badRequest("Request body must be valid JSON");
    }

    const { title, text } = bodyObj || {};
    const { valid, errors } = validateNoteInput({ title, text });
    if (!valid) return badRequest("Validation failed", errors);

    const id = uuidv4();
    const now = new Date().toISOString();

    const item = {
      pk: `USER#${username}`,
      sk: `NOTE#${id}`,
      id,
      username,
      title: title.trim(),
      text: text.trim(),
      createdAt: now,
      modifiedAt: now
    };

    const cmd = new PutCommand({
      TableName: process.env.NOTES_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(pk) AND attribute_not_exists(sk)"
    });

    await ddb.send(cmd);
    return ok({ item });
  } catch (err) {
    console.error("Create note error:", err);
    // ConditionalCheckFailedException → försökte skriva över (borde aldrig ske med uuid, men hantera ändå)
    if (err?.name === "ConditionalCheckFailedException") {
      return serverError("Write conflict, please retry");
    }
    return serverError("Failed to create note");
  }
};
