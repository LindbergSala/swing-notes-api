import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../lib/db.js";
import { ok, badRequest, notFound, serverError } from "../lib/http.js";
import { validateNoteInput } from "../lib/validation.js";

export const handler = async (event) => {
  try {
    const id = event?.pathParameters?.id;
    if (typeof id !== "string" || id.trim().length === 0) {
      return badRequest("Path parameter 'id' is required");
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

    // 1) Slå upp posten via GSI på id
    const findCmd = new QueryCommand({
      TableName: process.env.NOTES_TABLE,
      IndexName: process.env.GSI_BY_ID,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id }
    });

    const { Items = [] } = await ddb.send(findCmd);
    if (!Items.length) return notFound(`Note with id '${id}' not found`);

    const { pk, sk } = Items[0];
    const now = new Date().toISOString();

    // 2) Uppdatera titel, text, modifiedAt
    const updCmd = new UpdateCommand({
      TableName: process.env.NOTES_TABLE,
      Key: { pk, sk },
      ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)",
      UpdateExpression: "SET #t = :title, #x = :text, modifiedAt = :now",
      ExpressionAttributeNames: {
        "#t": "title",
        "#x": "text"
      },
      ExpressionAttributeValues: {
        ":title": title.trim(),
        ":text": text.trim(),
        ":now": now
      },
      ReturnValues: "ALL_NEW"
    });

    const { Attributes } = await ddb.send(updCmd);
    return ok({ item: Attributes });
  } catch (err) {
    console.error("Update note error:", err);
    if (err?.name === "ConditionalCheckFailedException") {
      return notFound("Note no longer exists");
    }
    return serverError("Failed to update note");
  }
};
