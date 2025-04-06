import { Condition } from "./condition";
import { ParseCondition } from "./parseCondition";
import { EnumMethod } from "./enMethod";
import { EnumResult } from "./enResult";
import { enumerationType, Util } from "./util";
import { EnSelector } from "./enSelector";

export class Enumerator {
  public input: number[] = [];
  public enumerationType: enumerationType;
  public length = 0;
  private en: EnumMethod | null = null;
  private resultId = 0;
  private inputLimit = 20;
  private conditions: Condition[] = [];
  constructor(enumerationType: enumerationType) {
    this.enumerationType = enumerationType;
  }

  public setInput = (input: string) => {
    const asArray = Util.inputToArray(input);
    if (asArray.length > this.inputLimit)
      throw new Error(`Input must not exceed ${this.inputLimit} elements`);
    if (asArray.some((e) => Number.isNaN(e)))
      throw new Error("Inputs must be numbers or single characters");
    this.input = asArray;
  };

  public setLength = (length: number) => {
    if (length < 0 || !Number.isInteger(length))
      throw new Error("Invalid length");
    this.length = length;
  };

  public run = (): EnumResult => {
    const validation = this.validate();
    if (validation.some((e) => !!e))
      throw new Error(
        "Condition error: " + validation.reduce((a, b) => a + b, "")
      );
    this.determineEnumerationMethod();
    if (!this.en) throw new Error("An unexpected error occurred");
    const _res = this.en.enumerate();
    console.log("completed");
    console.log("\tinput: ", this.input);
    console.log("\tresult:", _res);
    return { id: this.resultId++, ..._res };
  };

  public setEnumerationType = (enumerationType: enumerationType) => {
    this.enumerationType = enumerationType;
  };

  private validate = (): string[] => {
    console.log("validate");
    const res: string[] = [];
    this.conditions.forEach((cond) => {
      try {
        cond.validate();
        res.push("");
      } catch (err) {
        res.push((err as Error).message);
      }
    });
    return res;
  };

  public setConditions = (conditions: Record<string, string>[]) => {
    console.log("read conditions", conditions);
    const conds = [];
    const cf = new ParseCondition(this);
    for (const c of conditions) conds.push(cf.createCondition(c));
    console.log("parsed conditions", conds);
    this.conditions = conds;
  };

  private determineEnumerationMethod = () => {
    console.log("determine");
    const ens = new EnSelector(
      this.input,
      this.enumerationType,
      this.length,
      this.conditions
    );
    this.en = ens.select();
  };
}
