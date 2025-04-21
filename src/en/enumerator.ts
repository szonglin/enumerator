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
  static readonly INPUT_LIMIT = 32;
  private conditions: Condition[] = [];
  private inputCopy = "";
  private conditionSummary = "";
  private repeats = false;
  constructor(enumerationType: enumerationType) {
    this.enumerationType = enumerationType;
  }

  public setInput = (input: string) => {
    const asArray = Util.inputToArray(input);
    if (asArray.length > Enumerator.INPUT_LIMIT)
      throw new Error(
        `Input must not exceed ${Enumerator.INPUT_LIMIT} elements`
      );
    if (asArray.some((e) => Number.isNaN(e)))
      throw new Error("Inputs must be numbers or single characters");
    this.inputCopy = input;
    this.input = asArray;
  };

  public setLength = (length: number) => {
    if (length < 0 || !Number.isInteger(length))
      throw new Error("Invalid length");
    this.length = length;
  };

  public setRepeats = (to: boolean) => {
    this.repeats = to;
  };

  public run = (): EnumResult => {
    const err = this.validate().reduce((a, b) => a + b, "");
    if (err) throw new Error(`Condition error: ${err}`);

    this.determineEnumerationMethod();
    if (!this.en) throw new Error("An unexpected error occurred");

    const _res = this.en.enumerate();
    return { id: this.resultId++, request: this.summariseRequest(), ..._res };
  };

  public setEnumerationType = (enumerationType: enumerationType) => {
    this.enumerationType = enumerationType;
  };

  private validate = (): string[] => {
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

  public setConditions = (conditions: Record<string, any>[]) => {
    this.conditionSummary = conditions
      .map((e) => (e.negate ? "!" : "") + e.condition)
      .join(", ");
    const conds = [];
    const cf = new ParseCondition(this);
    for (const c of conditions) conds.push(cf.createCondition(c));
    this.conditions = conds;
  };

  private determineEnumerationMethod = () => {
    const ens = new EnSelector(
      this.input,
      this.enumerationType,
      this.length,
      this.conditions,
      this.repeats
    );
    this.en = ens.select();
  };

  private summariseRequest = () => {
    return (
      `${this.enumerationType.substring(0, 4)}, ${
        this.repeats ? "repeats" : "no repeats"
      }, '${this.inputCopy}', length ${this.length}` +
      (this.conditionSummary && `, [${this.conditionSummary}]`)
    );
  };
}
