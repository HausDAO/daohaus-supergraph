import { NewPost } from "../generated/Poster/Poster";
import { log } from "@graphprotocol/graph-ts";
import { parser } from "./util/parser";
import { constants } from "./util/constants";
import { validator } from "./util/validator";

// event NewPost(address indexed user, string content, string indexed tag);
export function handleNewPost(event: NewPost): void {
  let result = parser.getResultFromJson(event.params.content);
  if (result.error != "none") {
    log.error("no content", []);
    return;
  }
  let object = result.object;

  let moloch = parser.getStringFromJson(object, "molochAddress");
  if (moloch.error != "none") {
    log.error('Post with content ID {} errored on "type" parameter', [
      event.transaction.hash.toHexString(),
    ]);
    return;
  }
  let molochAddress = moloch.data;

  // log.info("***event.params.user: {}", [event.params.user.toHexString()]);
  //safe on min-prop
  //member on memberprop

  // log.info("***event.transaction.to: {}", [event.transaction.to.toHexString()]);
  //min on min-prop

  // log.info("***event.transaction.from: {}", [
  //   event.transaction.from.toHexString(),
  // ]);
  //always executor

  if (event.params.tag.toHexString() == constants.DAOHAUS_DOCUMENT_MINION) {
    log.info("validating minion", []);
    let isValid = validator.isMolochMinion(molochAddress, event.transaction.to);
    if (isValid == false) {
      return;
    }

    parser.createBasicContent(object, molochAddress, event, true);
  }

  if (event.params.tag.toHexString() == constants.DAOHAUS_DOCUMENT_MEMBER) {
    log.info("validating member", []);

    // let isValid = validator.isMolochMember(
    //   molochAddress,
    //   event.transaction.from
    // );
    // if (isValid == false) {
    //   return;
    // }

    parser.createBasicContent(object, molochAddress, event, false);
  }
}
