import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../lib/db.js";
import { ok, badRequest, serverError } from "../lib/http.js";

export const handler = async (event) => {
  try {
    const username = event?.pathParameters?.username;
    if (typeof username !== "string" || username.trim().length === 0) {
      return badRequest("Path parameter 'username' is required");
    }

    const pk = `USER#${username}`;
    const cmd = new QueryCommand({
      TableName: process.env.NOTES_TABLE,
      KeyConditionExpression: "pk = :pk AND begins_with(sk, :sk)",
      ExpressionAttributeValues: {
        ":pk": pk,
        ":sk": "NOTE#"
      }
    });

    const { Items = [] } = await ddb.send(cmd);

    // Sortera nyaste först (valfritt)
    Items.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

    return ok({ items: Items });
  } catch (err) {
    console.error("GET notes error:", err);
    return serverError("Failed to fetch notes");
  }
};