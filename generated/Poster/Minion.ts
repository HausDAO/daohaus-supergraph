// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ActionCanceled extends ethereum.Event {
  get params(): ActionCanceled__Params {
    return new ActionCanceled__Params(this);
  }
}

export class ActionCanceled__Params {
  _event: ActionCanceled;

  constructor(event: ActionCanceled) {
    this._event = event;
  }

  get proposalId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class CrossWithdraw extends ethereum.Event {
  get params(): CrossWithdraw__Params {
    return new CrossWithdraw__Params(this);
  }
}

export class CrossWithdraw__Params {
  _event: CrossWithdraw;

  constructor(event: CrossWithdraw) {
    this._event = event;
  }

  get target(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class DoWithdraw extends ethereum.Event {
  get params(): DoWithdraw__Params {
    return new DoWithdraw__Params(this);
  }
}

export class DoWithdraw__Params {
  _event: DoWithdraw;

  constructor(event: DoWithdraw) {
    this._event = event;
  }

  get token(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ExecuteAction extends ethereum.Event {
  get params(): ExecuteAction__Params {
    return new ExecuteAction__Params(this);
  }
}

export class ExecuteAction__Params {
  _event: ExecuteAction;

  constructor(event: ExecuteAction) {
    this._event = event;
  }

  get proposalId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get executor(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ProposeAction extends ethereum.Event {
  get params(): ProposeAction__Params {
    return new ProposeAction__Params(this);
  }
}

export class ProposeAction__Params {
  _event: ProposeAction;

  constructor(event: ProposeAction) {
    this._event = event;
  }

  get proposalId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get proposer(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PulledFunds extends ethereum.Event {
  get params(): PulledFunds__Params {
    return new PulledFunds__Params(this);
  }
}

export class PulledFunds__Params {
  _event: PulledFunds;

  constructor(event: PulledFunds) {
    this._event = event;
  }

  get moloch(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class Minion__actionsResult {
  value0: BigInt;
  value1: Address;
  value2: Address;
  value3: boolean;
  value4: Bytes;

  constructor(
    value0: BigInt,
    value1: Address,
    value2: Address,
    value3: boolean,
    value4: Bytes
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    map.set("value4", ethereum.Value.fromBytes(this.value4));
    return map;
  }
}

export class Minion extends ethereum.SmartContract {
  static bind(address: Address): Minion {
    return new Minion("Minion", address);
  }

  actions(param0: BigInt): Minion__actionsResult {
    let result = super.call(
      "actions",
      "actions(uint256):(uint256,address,address,bool,bytes)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new Minion__actionsResult(
      result[0].toBigInt(),
      result[1].toAddress(),
      result[2].toAddress(),
      result[3].toBoolean(),
      result[4].toBytes()
    );
  }

  try_actions(param0: BigInt): ethereum.CallResult<Minion__actionsResult> {
    let result = super.tryCall(
      "actions",
      "actions(uint256):(uint256,address,address,bool,bytes)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Minion__actionsResult(
        value[0].toBigInt(),
        value[1].toAddress(),
        value[2].toAddress(),
        value[3].toBoolean(),
        value[4].toBytes()
      )
    );
  }

  executeAction(proposalId: BigInt): Bytes {
    let result = super.call("executeAction", "executeAction(uint256):(bytes)", [
      ethereum.Value.fromUnsignedBigInt(proposalId)
    ]);

    return result[0].toBytes();
  }

  try_executeAction(proposalId: BigInt): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "executeAction",
      "executeAction(uint256):(bytes)",
      [ethereum.Value.fromUnsignedBigInt(proposalId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  isMember(user: Address): boolean {
    let result = super.call("isMember", "isMember(address):(bool)", [
      ethereum.Value.fromAddress(user)
    ]);

    return result[0].toBoolean();
  }

  try_isMember(user: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isMember", "isMember(address):(bool)", [
      ethereum.Value.fromAddress(user)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  moloch(): Address {
    let result = super.call("moloch", "moloch():(address)", []);

    return result[0].toAddress();
  }

  try_moloch(): ethereum.CallResult<Address> {
    let result = super.tryCall("moloch", "moloch():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  molochDepositToken(): Address {
    let result = super.call(
      "molochDepositToken",
      "molochDepositToken():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_molochDepositToken(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "molochDepositToken",
      "molochDepositToken():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): Bytes {
    let result = super.call(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );

    return result[0].toBytes();
  }

  try_onERC721Received(
    param0: Address,
    param1: Address,
    param2: BigInt,
    param3: Bytes
  ): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "onERC721Received",
      "onERC721Received(address,address,uint256,bytes):(bytes4)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromAddress(param1),
        ethereum.Value.fromUnsignedBigInt(param2),
        ethereum.Value.fromBytes(param3)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  proposeAction(
    actionTo: Address,
    actionValue: BigInt,
    actionData: Bytes,
    details: string
  ): BigInt {
    let result = super.call(
      "proposeAction",
      "proposeAction(address,uint256,bytes,string):(uint256)",
      [
        ethereum.Value.fromAddress(actionTo),
        ethereum.Value.fromUnsignedBigInt(actionValue),
        ethereum.Value.fromBytes(actionData),
        ethereum.Value.fromString(details)
      ]
    );

    return result[0].toBigInt();
  }

  try_proposeAction(
    actionTo: Address,
    actionValue: BigInt,
    actionData: Bytes,
    details: string
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "proposeAction",
      "proposeAction(address,uint256,bytes,string):(uint256)",
      [
        ethereum.Value.fromAddress(actionTo),
        ethereum.Value.fromUnsignedBigInt(actionValue),
        ethereum.Value.fromBytes(actionData),
        ethereum.Value.fromString(details)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class CancelActionCall extends ethereum.Call {
  get inputs(): CancelActionCall__Inputs {
    return new CancelActionCall__Inputs(this);
  }

  get outputs(): CancelActionCall__Outputs {
    return new CancelActionCall__Outputs(this);
  }
}

export class CancelActionCall__Inputs {
  _call: CancelActionCall;

  constructor(call: CancelActionCall) {
    this._call = call;
  }

  get _proposalId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class CancelActionCall__Outputs {
  _call: CancelActionCall;

  constructor(call: CancelActionCall) {
    this._call = call;
  }
}

export class CrossWithdrawCall extends ethereum.Call {
  get inputs(): CrossWithdrawCall__Inputs {
    return new CrossWithdrawCall__Inputs(this);
  }

  get outputs(): CrossWithdrawCall__Outputs {
    return new CrossWithdrawCall__Outputs(this);
  }
}

export class CrossWithdrawCall__Inputs {
  _call: CrossWithdrawCall;

  constructor(call: CrossWithdrawCall) {
    this._call = call;
  }

  get target(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get token(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get transfer(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }
}

export class CrossWithdrawCall__Outputs {
  _call: CrossWithdrawCall;

  constructor(call: CrossWithdrawCall) {
    this._call = call;
  }
}

export class DoWithdrawCall extends ethereum.Call {
  get inputs(): DoWithdrawCall__Inputs {
    return new DoWithdrawCall__Inputs(this);
  }

  get outputs(): DoWithdrawCall__Outputs {
    return new DoWithdrawCall__Outputs(this);
  }
}

export class DoWithdrawCall__Inputs {
  _call: DoWithdrawCall;

  constructor(call: DoWithdrawCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DoWithdrawCall__Outputs {
  _call: DoWithdrawCall;

  constructor(call: DoWithdrawCall) {
    this._call = call;
  }
}

export class ExecuteActionCall extends ethereum.Call {
  get inputs(): ExecuteActionCall__Inputs {
    return new ExecuteActionCall__Inputs(this);
  }

  get outputs(): ExecuteActionCall__Outputs {
    return new ExecuteActionCall__Outputs(this);
  }
}

export class ExecuteActionCall__Inputs {
  _call: ExecuteActionCall;

  constructor(call: ExecuteActionCall) {
    this._call = call;
  }

  get proposalId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class ExecuteActionCall__Outputs {
  _call: ExecuteActionCall;

  constructor(call: ExecuteActionCall) {
    this._call = call;
  }

  get value0(): Bytes {
    return this._call.outputValues[0].value.toBytes();
  }
}

export class InitCall extends ethereum.Call {
  get inputs(): InitCall__Inputs {
    return new InitCall__Inputs(this);
  }

  get outputs(): InitCall__Outputs {
    return new InitCall__Outputs(this);
  }
}

export class InitCall__Inputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }

  get _moloch(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class InitCall__Outputs {
  _call: InitCall;

  constructor(call: InitCall) {
    this._call = call;
  }
}

export class ProposeActionCall extends ethereum.Call {
  get inputs(): ProposeActionCall__Inputs {
    return new ProposeActionCall__Inputs(this);
  }

  get outputs(): ProposeActionCall__Outputs {
    return new ProposeActionCall__Outputs(this);
  }
}

export class ProposeActionCall__Inputs {
  _call: ProposeActionCall;

  constructor(call: ProposeActionCall) {
    this._call = call;
  }

  get actionTo(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get actionValue(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get actionData(): Bytes {
    return this._call.inputValues[2].value.toBytes();
  }

  get details(): string {
    return this._call.inputValues[3].value.toString();
  }
}

export class ProposeActionCall__Outputs {
  _call: ProposeActionCall;

  constructor(call: ProposeActionCall) {
    this._call = call;
  }

  get value0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}
