import {
  Bytes,
  log,
  JSONValue,
  JSONValueKind,
  TypedMap,
  json,
  ByteArray,
} from "@graphprotocol/graph-ts";
import { NewPost } from "../../generated/Poster/Poster";
import { Content } from "../../generated/schema";

class JsonStringResult {
  data: string;
  error: string;
}
class JsonResult {
  object: TypedMap<string, JSONValue>;
  error: string;
}

export namespace parser {
  export function getResultFromJson(content: string): JsonResult {
    let result: JsonResult;
    result.error = "none";
    // let jsonResult = json.try_fromBytes(ByteArray.fromUTF8(content) as Bytes);

    let bytes = changetype<Bytes>(ByteArray.fromUTF8(content));

    // let jsonResult = json.try_fromBytes(ByteArray.fromUTF8(content) as Bytes);
    let jsonResult = json.try_fromBytes(bytes);

    if (jsonResult.isError) {
      result.error = "Failed to parse JSON";
      return result;
    }
    result.object = jsonResult.value.toObject();
    return result;
  }

  export function getStringFromJson(
    object: TypedMap<string, JSONValue>,
    key: string
  ): JsonStringResult {
    let result: JsonStringResult;
    result.error = "none";
    let value = object.get(key);

    if (!value || value.kind != JSONValueKind.STRING) {
      result.error = "Missing valid Poster field: " + key;
      return result;
    }
    result.data = value.toString();
    return result;
  }

  export function createBasicContent(
    object: TypedMap<string, JSONValue>,
    molochAddress: string,
    event: NewPost,
    ratified: boolean
  ): Content {
    let entityId = molochAddress
      .concat("-content-")
      .concat(event.block.timestamp.toString());
    let entity = new Content(entityId);

    let content = parser.getStringFromJson(object, "content");
    if (content.error != "none") {
      return entity;
    }
    entity.content = content.data;

    let contentType = parser.getStringFromJson(object, "contentType");
    if (contentType.error != "none") {
      return entity;
    }
    entity.contentType = contentType.data;

    let location = parser.getStringFromJson(object, "location");
    if (location.error != "none") {
      entity.location = "docs";
    } else {
      entity.location = location.data;
    }

    let title = parser.getStringFromJson(object, "title");
    if (title.error != "none") {
    } else {
      entity.title = title.data;
    }

    let description = parser.getStringFromJson(object, "description");
    if (description.error != "none") {
    } else {
      entity.description = description.data;
    }

    entity.createdAt = event.block.timestamp.toString();
    entity.transactionHash = event.transaction.hash;
    entity.molochAddress = molochAddress;
    entity.moloch = molochAddress;
    entity.memberAddress = event.transaction.from;
    entity.rawData = event.params.content;
    entity.ratified = ratified;

    entity.save();

    return entity;
  }
}
