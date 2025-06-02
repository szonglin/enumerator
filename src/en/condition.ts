import { Enumerator } from "./enumerator";

export abstract class Condition {
  enumerator: Enumerator;
  negate: boolean;
  constructor(enumerator: Enumerator, negate: boolean) {
    this.enumerator = enumerator;
    this.negate = negate;
  }
  public estimateScale(): number {
    return this.enumerator.length;
  }
  public evaluate(test: number[]): boolean {
    return this.negate !== this._evaluate(test); // xor equivalent
  }
  abstract validate(): void;
  abstract _evaluate(test: number[]): boolean;
}

export type comparisonOption = "less" | "more" | "equal";

const evaluateComparison = (
  comparison: comparisonOption,
  res: number,
  arg: number,
): boolean => {
  if (comparison === "equal") return res === arg;
  else if (comparison === "more") return res > arg;
  else if (comparison === "less") return res < arg;
  else throw new Error("Unexpected comparison type");
};

export class Increasing extends Condition {
  strict: boolean = false;
  constructor(enumerator: Enumerator, negate: boolean, strict: boolean) {
    super(enumerator, negate);
    this.strict = strict;
  }
  validate() {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Increasing is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length - 1; i++) {
      const current = test[i];
      const next = test[i + 1];
      if (current > next || (this.strict && current === next)) return false;
    }
    return true;
  }
}

export class Decreasing extends Condition {
  strict: boolean = false;
  constructor(enumerator: Enumerator, negate: boolean, strict: boolean) {
    super(enumerator, negate);
    this.strict = strict;
  }
  validate() {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Decreasing is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length - 1; i++) {
      const current = test[i];
      const next = test[i + 1];
      if (current < next || (this.strict && current === next)) return false;
    }
    return true;
  }
}

export class Contains extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
  }
  _evaluate(test: number[]): boolean {
    const ms = new Map<number, number>();
    for (const e of test) {
      const v = ms.get(e);
      ms.set(e, v ? v + 1 : 1);
    }
    for (const e of this.arg) {
      const v = ms.get(e);
      if (!v) return false;
      ms.set(e, v - 1);
    }
    return true;
  }
}

export class Count extends Condition {
  arg: number[];
  amount: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number[],
    amount: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.amount = amount;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.amount)) throw new Error("Invalid argument");
    if (!this.arg.length) throw new Error("Missing argument");
  }
  // this counts distinct terms, not overlapping. eg. ababab is one count of abab not two
  _evaluate(test: number[]): boolean {
    if (test.length < this.arg.length) return false;
    let res = 0;
    let seen = 0;
    for (let i = 0; i < test.length; i++) {
      if (seen === this.arg.length) {
        res++;
        seen = 0;
      }
      if (test[i] === this.arg[seen]) seen++;
      else seen = test[i] === this.arg[0] ? 1 : 0;
    }
    if (seen === this.arg.length) res++;
    return evaluateComparison(this.property, res, this.amount);
  }
}

export class Excludes extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
  }
  _evaluate(test: number[]): boolean {
    for (const e of this.arg) {
      if (test.includes(e)) return false;
    }
    return true;
  }
}

export class CountOverlap extends Condition {
  arg: number[];
  amount: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number[],
    amount: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.amount = amount;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.amount)) throw new Error("Invalid argument");
    if (!this.arg.length) throw new Error("Missing argument");
  }
  // this counts distinct terms, not overlapping. eg. ababab is one count of abab not two
  _evaluate(test: number[]): boolean {
    let res = 0;
    for (let i = 0; i + this.arg.length - 1 < test.length; i++) {
      let matched = true;
      for (let j = 0; j < this.arg.length; j++) {
        if (test[i + j] !== this.arg[j]) {
          matched = false;
          break;
        }
      }
      if (matched) res++;
    }
    return evaluateComparison(this.property, res, this.amount);
  }
  public estimateScale(): number {
    return Math.pow(this.enumerator.length, 2);
  }
}

export class SubseqCount extends Condition {
  arg: number[];
  amount: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number[],
    amount: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.amount = amount;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.amount)) throw new Error("Invalid argument");
    if (!this.arg.length) throw new Error("Missing argument");
  }
  // strictly, this counts the number of ways we can obtain the arg array by deleting
  // elements of the test array
  _evaluate(test: number[]): boolean {
    if (test.length < this.arg.length) return false;
    const count = Array.from({ length: this.arg.length + 1 }, () =>
      Array(test.length + 1).fill(0),
    );
    for (let j = 0; j < test.length + 1; j++) count[0][j] = 1;
    for (let i = 1; i <= this.arg.length; i++)
      for (let j = 1; j <= test.length; j++) {
        count[i][j] =
          this.arg[i - 1] === test[j - 1]
            ? count[i][j - 1] + count[i - 1][j - 1]
            : count[i][j - 1];
      }
    return evaluateComparison(
      this.property,
      count[this.arg.length][test.length],
      this.amount,
    );
  }
  public estimateScale(): number {
    return Math.pow(this.enumerator.length, 2);
  }
}

export class Subsequence extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (this.arg.some((e) => Number.isNaN(e)))
      throw new Error("Invalid value in argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Subsequence is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    let matched = 0;
    for (let i = 0; i < test.length && matched < this.arg.length; i++) {
      if (test[i] === this.arg[matched]) matched++;
    }
    return matched === this.arg.length;
  }
}

export class Subarray extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (this.arg.some((e) => Number.isNaN(e)))
      throw new Error("Invalid value in argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Subarray is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length; i++) {
      let success = true;
      for (let j = 0; j < this.arg.length; j++) {
        if (test[i + j] !== this.arg[j]) {
          success = false;
          break;
        }
      }
      if (success) return true;
    }
    return false;
  }
}

export class StartsWith extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("StartsWith is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < this.arg.length; i++) {
      if (this.arg[i] !== test[i]) return false;
    }
    return true;
  }
}

export class EndsWith extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, negate: boolean, arg: number[]) {
    super(enumerator, negate);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("EndsWith is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    const startIndex = test.length - this.arg.length;
    if (startIndex < 0) return false;
    for (let i = 0; i < this.arg.length; i++) {
      if (this.arg[i] !== test[startIndex + i]) return false;
    }
    return true;
  }
}

export class Sum extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  public getArg(): number {
    return this.arg;
  }
  public getProperty(): comparisonOption {
    return this.property;
  }
  validate(): void {
    if (isNaN(this.arg)) throw new Error("Invalid argument");
    if (!this.enumerator.input.every((e) => !isNaN(Number(e))))
      throw new Error("Sum arguments must be numbers");
  }
  _evaluate(test: number[]): boolean {
    let sum = 0;
    for (let i = 0; i < test.length; i++) sum += test[i];
    return evaluateComparison(this.property, sum, this.arg);
  }
}

export class Palindrome extends Condition {
  validate(): void {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Palindrom is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length >> 1; i++) {
      if (test[i] !== test[test.length - 1 - i]) return false;
    }
    return true;
  }
}

export class Distinct extends Condition {
  validate(): void {}
  _evaluate(test: number[]): boolean {
    const set = new Set(test);
    return set.size === test.length;
  }
}

export class CountDistinct extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  public getArg(): number {
    return this.arg;
  }
  public getProperty(): comparisonOption {
    return this.property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    return evaluateComparison(this.property, new Set(test).size, this.arg);
  }
}

export class Maximum extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  public getArg(): number {
    return this.arg;
  }
  public getProperty(): comparisonOption {
    return this.property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    let max = test[0];
    for (let i = 1; i < test.length; i++) {
      const current = test[i];
      if (current > max) max = current;
    }
    return evaluateComparison(this.property, max, this.arg);
  }
}

export class Minimum extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  public getArg(): number {
    return this.arg;
  }
  public getProperty(): comparisonOption {
    return this.property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    let min = Number(test[0]);
    for (let i = 1; i < test.length; i++) {
      const current = Number(test[i]);
      if (current < min) min = current;
    }
    return evaluateComparison(this.property, min, this.arg);
  }
}

export class Derangement extends Condition {
  validate(): void {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Derangement is order dependent (permutations only)");
  }
  _evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length; i++) {
      if (test[i] === this.enumerator.input[i]) return false;
    }
    return true;
  }
}

export class MinFrequency extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    const ms = new Map<number, number>();
    for (const e of test) {
      const v = ms.get(e);
      ms.set(e, v ? v + 1 : 1);
    }
    const lf = Math.min(...ms.values());
    return evaluateComparison(this.property, lf, this.arg);
  }
}

// unused
export class MinFreqElt extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    const ms = new Map<number, number>();
    for (const e of test) {
      const v = ms.get(e);
      ms.set(e, v ? v + 1 : 1);
    }
    const lf = Math.min(...ms.values());
    const minFreqElts = Array.from(ms.entries())
      .filter((e) => e[1] === lf)
      .map((e) => e[0]);
    return minFreqElts.some((e) =>
      evaluateComparison(this.property, e, this.arg),
    );
  }
}

export class MaxFrequency extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    const ms = new Map<number, number>();
    for (const e of test) {
      const v = ms.get(e);
      ms.set(e, v ? v + 1 : 1);
    }
    const hf = Math.max(...ms.values());
    return evaluateComparison(this.property, hf, this.arg);
  }
}

// unused
export class MaxFreqElt extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  _evaluate(test: number[]): boolean {
    const ms = new Map<number, number>();
    for (const e of test) {
      const v = ms.get(e);
      ms.set(e, v ? v + 1 : 1);
    }
    const hf = Math.max(...ms.values());
    const maxFreqElts = Array.from(ms.entries())
      .filter((e) => e[1] === hf)
      .map((e) => e[0]);
    return maxFreqElts.some((e) =>
      evaluateComparison(this.property, e, this.arg),
    );
  }
}

export class Average extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.arg)) throw new Error("Invalid argument");
    if (!this.enumerator.input.every((e) => !isNaN(Number(e))))
      throw new Error("Average arguments must be numbers");
  }
  _evaluate(test: number[]): boolean {
    return test.reduce((a, b) => a + b, 0) === this.arg * test.length;
  }
}

export class Median extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    negate: boolean,
    arg: number,
    property: comparisonOption,
  ) {
    super(enumerator, negate);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.arg)) throw new Error("Invalid argument");
    if (!this.enumerator.input.every((e) => !isNaN(Number(e))))
      throw new Error("Median arguments must be numbers");
  }
  _evaluate(test: number[]): boolean {
    const copy = [...test];
    copy.sort((a, b) => a - b);
    const median =
      copy.length % 2
        ? copy[copy.length >> 1]
        : (copy[(copy.length >> 1) - 1] + copy[copy.length >> 1]) / 2;
    return evaluateComparison(this.property, median, this.arg);
  }
}
