import { Condition, Decreasing, Increasing, Subarray } from "./condition";
import { Enumerator } from "./enumerator";
import { Util } from "./util";

export class ParseCondition {
  private en: Enumerator;
  constructor(en: Enumerator) {
    this.en = en;
  }
  public createCondition = (condition: Record<string, string>): Condition => {
    console.log("parsing", condition);
    let arg;
    switch (condition.condition) {
      case "increasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Increasing(this.en, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      case "decreasing":
        if (condition.strict === "true" || condition.strict === "false")
          return new Decreasing(this.en, condition.strict === "true");
        else throw new Error("Unrecognised condition argument");
      case "subarray":
        if (!condition.arg) throw new Error("Unrecognised condition argument");
        arg = Util.inputToArray(condition.arg);
        return new Subarray(this.en, arg);
      default:
        throw new Error("Unrecognised Condition");
    }
  };
}
