import { NewPost } from "../generated/Poster/Poster";
import { log } from "@graphprotocol/graph-ts";
import { parser } from "./util/parser";
import { constants } from "./util/constants";
import { validator } from "./util/validator";
import { addTransaction } from "./transactions";

const POSTER_TABLE_REFERENCES = {
  [constants.DAOHAUS_MEMBER_CUSTOMTHEME]: "customTheme",
  [constants.DAOHAUS_MEMBER_PROPOSALCONFIG]: "proposalConfig",
  [constants.DAOHAUS_MEMBER_BOOSTS]: "boosts",
  [constants.DAOHAUS_MEMBER_DAOPROFILE]: "daoProfile",
}

const POSTER_CONSTANTS = Object.keys(POSTER_TABLE_REFERENCES);

// event NewPost(address indexed user, string content, string indexed tag);
export function handleNewPost(event: NewPost): void {
  log.info("^^^handleNewPost tag, {}", [event.params.tag.toHexString()]);

  let validTags: string[] = [
    constants.DAOHAUS_DOCUMENT_MINION,
    constants.DAOHAUS_DOCUMENT_MEMBER,
    ...POSTER_CONSTANTS,
  ];

  let validTag = validTags.includes(event.params.tag.toHexString());
  if (!validTag) {
    log.info("^^^invalidTag", []);
    return;
  }

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

  log.info("***molochAddress: {}", [molochAddress]);

  if (event.params.tag.toHexString() == constants.DAOHAUS_DOCUMENT_MINION) {
    log.info("validating minion", []);
    let isValid = validator.isMolochMinion(molochAddress, event.transaction.to);
    if (isValid == false) {
      return;
    }

    parser.createBasicContent(object, molochAddress, event, true);
    addTransaction(event.block, event.transaction);
  }

  if (event.params.tag.toHexString() == constants.DAOHAUS_DOCUMENT_MEMBER) {
    log.info("validating member", []);

    let isValid = validator.isMolochMember(
      molochAddress,
      event.transaction.from
    );
    if (isValid == false) {
      return;
    }

    parser.createBasicContent(object, molochAddress, event, false);
    addTransaction(event.block, event.transaction);
  }

  if (POSTER_CONSTANTS.includes(event.params.tag.toHexString())) {
    log.info("validating member", []);

    let isValid = validator.isMolochMember(
      molochAddress,
      event.transaction.from
    );
    if (isValid == false) {
      return;
    }

    parser.createBasicRecord(molochAddress, event, POSTER_TABLE_REFERENCES[event.params.tag.toHexString()]);
    addTransaction(event.block, event.transaction);
  }
}
