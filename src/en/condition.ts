import { Enumerator } from "./enumerator";

export const conditionList = [
  {
    condition: "increasing",
    description:
      "values are in increasing order, strictly increasing requires each value to be strictly greater than the previous",
  },
  {
    condition: "decreasing",
    description:
      "values are in decreasing order, strictly decreasing requires each value to be strictly less than the previous",
  },
  {
    condition: "subarray",
    description:
      "contains the argument as adjacent values, eg. 'sparkler' contains 'park'",
  },
  {
    condition: "subsequence",
    description:
      "contains the argument as a subsequence, eg. 'category' contains 'coy'",
  },
  {
    condition: "contains",
    description:
      "contains the elements of the argument in any order, eg. 'trace' contains 'art'",
  },
  {
    condition: "startsWith",
    description: "begins with the argument, eg. 'teacher' starts with 'tea'",
  },
  {
    condition: "endsWith",
    description: "ends with the argument, eg. 'yellow' ends with 'low'",
  },
  {
    condition: "palindrome",
    description: "is the same as its reverse, eg. 'radar'",
  },
  {
    condition: "distinct",
    description: "has all elements distinct, eg. 'copyright'",
  },
  {
    condition: "sum",
    description:
      "sum of elements compared with the argument, eg. '1, 2, 3' = '6'",
  },
  {
    condition: "maximum",
    description:
      "largest element compared with the argument, eg. '1, 2, 3' < '4' or 'fazed' = 'z'",
  },
  {
    condition: "minimum",
    description:
      "smallest element compared with the argument, eg. '1, 2, 3' > '0' or 'glass' = 'a'",
  },
  {
    condition: "count",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second with only distinct (non-overlapping)" +
      " terms counted, eg. 'banana' has 1 copy of 'ana'",
  },
  {
    condition: "countOverlap",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second, including overlapping" +
      " terms, eg. 'banana' has 2 copies of 'ana'",
  },
  {
    condition: "subseqCount",
    description:
      "number of appearances of the first argument (as a subsequence) compared with the second, eg. 'banana' has 4" +
      " subsequences of 'ana'",
  },
];

export abstract class Condition {
  enumerator: Enumerator;
  constructor(enumerator: Enumerator) {
    this.enumerator = enumerator;
  }
  public estimateScale(): number {
    return this.enumerator.length;
  }
  abstract validate(): void;
  abstract evaluate(test: number[]): boolean;
}

export type comparisonOption = "less" | "more" | "equal";

const evaluateComparison = (
  comparison: comparisonOption,
  res: number,
  arg: number
): boolean => {
  if (comparison === "equal") return res === arg;
  else if (comparison === "more") return res > arg;
  else if (comparison === "less") return res < arg;
  else throw new Error("Unexpected comparison type");
};

export class Increasing extends Condition {
  strict: boolean = false;
  constructor(enumerator: Enumerator, strict: boolean) {
    super(enumerator);
    this.strict = strict;
  }
  validate() {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Increasing is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
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
  constructor(enumerator: Enumerator, strict: boolean) {
    super(enumerator);
    this.strict = strict;
  }
  validate() {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Decreasing is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
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
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
  }
  evaluate(test: number[]): boolean {
    // check what the optimal approach is (for, for), (method, method), (for, method), (method, for)
    for (const e of this.arg) {
      if (!test.includes(e)) return false;
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
    arg: number[],
    amount: number,
    property: comparisonOption
  ) {
    super(enumerator);
    this.arg = arg;
    this.amount = amount;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.amount)) throw new Error("Invalid argument");
    if (!this.arg.length) throw new Error("Missing argument");
  }
  // this counts distinct terms, not overlapping. eg. ababab is one count of abab not two
  evaluate(test: number[]): boolean {
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

export class CountOverlap extends Condition {
  arg: number[];
  amount: number;
  property: comparisonOption;
  constructor(
    enumerator: Enumerator,
    arg: number[],
    amount: number,
    property: comparisonOption
  ) {
    super(enumerator);
    this.arg = arg;
    this.amount = amount;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.amount)) throw new Error("Invalid argument");
    if (!this.arg.length) throw new Error("Missing argument");
  }
  // this counts distinct terms, not overlapping. eg. ababab is one count of abab not two
  evaluate(test: number[]): boolean {
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
    arg: number[],
    amount: number,
    property: comparisonOption
  ) {
    super(enumerator);
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
  evaluate(test: number[]): boolean {
    if (test.length < this.arg.length) return false;
    const count = Array.from({ length: this.arg.length + 1 }, () =>
      Array(test.length + 1).fill(0)
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
      this.amount
    );
  }
  public estimateScale(): number {
    return Math.pow(this.enumerator.length, 2);
  }
}

export class Subsequence extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(): void {
    if (this.arg.some((e) => Number.isNaN(e)))
      throw new Error("Invalid value in argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Subsequence is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
    let matched = 0;
    for (let i = 0; i < test.length && matched < this.arg.length; i++) {
      if (test[i] === this.arg[matched]) matched++;
    }
    return matched === this.arg.length;
  }
}

export class Subarray extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(): void {
    if (this.arg.some((e) => Number.isNaN(e)))
      throw new Error("Invalid value in argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("Subarray is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
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
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("StartsWith is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
    for (let i = 0; i < this.arg.length; i++) {
      if (this.arg[i] !== test[i]) return false;
    }
    return true;
  }
}

export class EndsWith extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(): void {
    if (!this.arg.length) throw new Error("Missing argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("EndsWith is order dependent (permutations only)");
  }
  evaluate(test: number[]): boolean {
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
  constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
    super(enumerator);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {
    if (isNaN(this.arg)) throw new Error("Invalid argument");
    if (!this.enumerator.input.every((e) => !isNaN(Number(e))))
      throw new Error("Sum arguments must be numbers");
  }
  evaluate(test: number[]): boolean {
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
  evaluate(test: number[]): boolean {
    for (let i = 0; i < test.length >> 1; i++) {
      if (test[i] !== test[test.length - 1 - i]) return false;
    }
    return true;
  }
}

export class Distinct extends Condition {
  validate(): void {}
  evaluate(test: number[]): boolean {
    const set = new Set(test);
    return set.size === test.length;
  }
}

export class Maximum extends Condition {
  arg: number;
  property: comparisonOption;
  constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
    super(enumerator);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  evaluate(test: number[]): boolean {
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
  constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
    super(enumerator);
    this.arg = arg;
    this.property = property;
  }
  validate(): void {}
  evaluate(test: number[]): boolean {
    let min = Number(test[0]);
    for (let i = 1; i < test.length; i++) {
      const current = Number(test[i]);
      if (current < min) min = current;
    }
    return evaluateComparison(this.property, min, this.arg);
  }
}
