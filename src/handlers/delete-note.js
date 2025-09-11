import { QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "../lib/db.js";
import { ok, badRequest, notFound, serverError } from "../lib/http.js";

export const handler = async (event) => {
  try {
    const id = event?.pathParameters?.id;
    if (typeof id !== "string" || id.trim().length === 0) {
      return badRequest("Path parameter 'id' is required");
    }

    // 1) Hitta nycklar via GSI
    const findCmd = new QueryCommand({
      TableName: process.env.NOTES_TABLE,
      IndexName: process.env.GSI_BY_ID,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id }
    });

    const { Items = [] } = await ddb.send(findCmd);
    if (!Items.length) return notFound(`Note with id '${id}' not found`);

    const { pk, sk } = Items[0];

    // 2) Radera
    const delCmd = new DeleteCommand({
      TableName: process.env.NOTES_TABLE,
      Key: { pk, sk },
      ConditionExpression: "attribute_exists(pk) AND attribute_exists(sk)"
    });

    await ddb.send(delCmd);
    return ok({ message: "Deleted" });
  } catch (err) {
    console.error("Delete note error:", err);
    if (err?.name === "ConditionalCheckFailedException") {
      return notFound("Note no longer exists");
    }
    return serverError("Failed to delete note");
  }
};
