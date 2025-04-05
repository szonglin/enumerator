import { Enumerator } from "./enumerator";

export const conditionTypes = ["increasing", "decreasing", "subarray"];

export abstract class Condition {
  enumerator: Enumerator;
  constructor(enumerator: Enumerator) {
    this.enumerator = enumerator;
  }
  abstract validate(input: number[]): void;
  abstract evaluate(test: number[]): boolean;
}

type comparisonOption = "less" | "more" | "equal";

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
  validate(input: number[]) {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("This condition is order dependent (permutations only)");
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
  validate(input: number[]) {
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("This condition is order dependent (permutations only)");
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

// export class Contains extends Condition {
//   arg: number[];
//   constructor(enumerator: Enumerator, arg: number[]) {
//     super(enumerator);
//     this.arg = arg;
//   }
//   validate(input: number[], length?: number): void {
//     if (!this.arg.length) throw new Error("Missing argument");
//     if (!this.evaluate(input))
//       throw new Error("This condition will always be false");
//     if (length && length < this.arg.length)
//       throw new Error("This condition will always be false");
//   }
//   evaluate(test: number[]): boolean {
//     // check what the optimal approach is (for, for), (method, method), (for, method), (method, for)
//     for (const e of this.arg) {
//       if (!test.includes(e)) return false;
//     }
//     return true;
//   }
// }

// export class Count extends Condition {
//   arg: number[];
//   amount: number;
//   property: comparisonOption;
//   constructor(
//     enumerator: Enumerator,
//     arg: number[],
//     amount: number,
//     property: comparisonOption
//   ) {
//     super(enumerator);
//     this.arg = arg;
//     this.amount = amount;
//     this.property = property;
//   }
//   validate(input: number[]): void {
//     if (isNaN(this.amount)) throw new Error("Invalid argument");
//     if (!this.arg.length) throw new Error("Missing argument");
//     throw new Error("Method not implemented.");
//   }
//   // this counts distinct terms, not overlapping. eg. ababab is one count of abab not two
//   evaluate(test: number[]): boolean {
//     let res = 0;
//     let seen = 0;
//     for (let i = 0; i < test.length; i++) {
//       if (seen === this.arg.length) {
//         res++;
//         seen = 0;
//       }
//       seen = test[i] === this.arg[seen] ? seen + 1 : 0;
//     }
//     return evaluateComparison(this.property, res, this.amount);
//   }
// }

// export class Subsequence extends Condition {
//   arg: number[];
//   constructor(enumerator: Enumerator, arg: number[]) {
//     super(enumerator);
//     this.arg = arg;
//   }
//   validate(input: number[], length?: number): void {
//     if (!this.arg.length) throw new Error("Missing argument");
//     if (this.enumerator.enumerationType !== "permutation")
//       throw new Error("This condition is order dependent (permutations only)");
//     const contains = new Contains(this.enumerator, this.arg);
//     contains.validate(input, length);
//   }
//   evaluate(test: number[]): boolean {
//     let j = 0;
//     for (let i = 0; i < this.arg.length && j < test.length; i++) {
//       if (this.arg[i] === test[j]) j++;
//     }
//     return j === test.length;
//   }
// }

export class Subarray extends Condition {
  arg: number[];
  constructor(enumerator: Enumerator, arg: number[]) {
    super(enumerator);
    this.arg = arg;
  }
  validate(input: number[], length?: number): void {
    if (this.arg.some((e) => Number.isNaN(e)))
      throw new Error("Invalid value in argument");
    if (this.enumerator.enumerationType !== "permutation")
      throw new Error("This condition is order dependent (permutations only)");
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

// export class StartsWith extends Condition {
//   arg: number[];
//   constructor(enumerator: Enumerator, arg: number[]) {
//     super(enumerator);
//     this.arg = arg;
//   }
//   validate(input: number[], length?: number): void {
//     if (!this.arg.length) throw new Error("Missing argument");
//     if (this.enumerator.enumerationType !== "permutation")
//       throw new Error("This condition is order dependent (permutations only)");
//     const contains = new Contains(this.enumerator, this.arg);
//     contains.validate(input, length);
//   }
//   evaluate(test: number[]): boolean {
//     for (let i = 0; i < this.arg.length; i++) {
//       if (this.arg[i] !== test[i]) return false;
//     }
//     return true;
//   }
// }

// export class EndsWith extends Condition {
//   arg: number[];
//   constructor(enumerator: Enumerator, arg: number[]) {
//     super(enumerator);
//     this.arg = arg;
//   }
//   validate(input: number[], length?: number): void {
//     if (!this.arg.length) throw new Error("Missing argument");
//     if (this.enumerator.enumerationType !== "permutation")
//       throw new Error("This condition is order dependent (permutations only)");
//     const contains = new Contains(this.enumerator, this.arg);
//     contains.validate(input, length);
//   }
//   evaluate(test: number[]): boolean {
//     const startIndex = test.length - this.arg.length;
//     if (startIndex < 0) return false;
//     for (let i = 0; i < this.arg.length; i++) {
//       if (this.arg[i] !== test[startIndex + i]) return false;
//     }
//     return true;
//   }
// }

// export class AtPosition extends Condition {
//   maximumIndex: number;
//   arg1: number;
//   arg2: number;
//   constructor(enumerator: Enumerator, arg1: number, arg2: number) {
//     super(enumerator);
//     this.arg1 = arg1;
//     this.arg2 = arg2;
//   }
//   validate(input: number[], length?: number): void {
//     if (this.enumerator.enumerationType !== "permutation")
//       throw new Error("This condition is order dependent (permutations only)");
//     const contains = new Contains(this.enumerator, [this.arg2]);
//     contains.validate(input, length);
//   }
//   evaluate(test: number[]): boolean {
//     if (this.maximumIndex >= test.length) return false;
//     for (const e of this.arg) {
//       if (test[e[0]] !== e[1]) return false;
//     }
//     return true;
//   }
// }

// export class Sum extends Condition {
//   arg: number;
//   property: comparisonOption;
//   constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
//     super(enumerator);
//     this.arg = arg;
//     this.property = property;
//   }
//   validate(input: number[]): void {
//     if (isNaN(this.arg)) throw new Error("Invalid argument");
//     if (!input.every((e) => !isNaN(Number(e))))
//       throw new Error("Inputs must be numbers");
//   }
//   evaluate(test: number[]): boolean {
//     let sum = 0;
//     for (let i = 0; i < test.length; i++) sum += test[i];
//     return evaluateComparison(this.property, sum, this.arg);
//   }
// }

// export class Palindrome extends Condition {
//   validate(input: number[], length?: number): void {
//     if (this.enumerator.enumerationType !== "permutation")
//       throw new Error("This condition is order dependent (permutations only)");
//   }
//   evaluate(test: number[]): boolean {
//     for (let i = 0; i < test.length >> 1; i++) {
//       if (test[i] !== test[test.length - 1 - i]) return false;
//     }
//     return true;
//   }
// }

// export class Distinct extends Condition {
//   validate(input: number[]): void {
//     if (this.evaluate(input))
//       throw new Error("This condition will always be true.");
//   }
//   evaluate(test: number[]): boolean {
//     const set = new Set(test);
//     return set.size === test.length;
//   }
// }

// export class Maximum extends Condition {
//   arg: number;
//   property: comparisonOption;
//   constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
//     super(enumerator);
//     this.arg = arg;
//     this.property = property;
//   }
//   validate(input: number[]): void {}
//   evaluate(test: number[]): boolean {
//     let max = test[0];
//     for (let i = 1; i < test.length; i++) {
//       const current = test[i];
//       if (current > max) max = current;
//     }
//     return evaluateComparison(this.property, max, this.arg);
//   }
// }

// export class Minimum extends Condition {
//   arg: number;
//   property: comparisonOption;
//   constructor(enumerator: Enumerator, arg: number, property: comparisonOption) {
//     super(enumerator);
//     this.arg = arg;
//     this.property = property;
//   }
//   validate(input: number[]): void {}
//   evaluate(test: number[]): boolean {
//     let min = Number(test[0]);
//     for (let i = 1; i < test.length; i++) {
//       const current = Number(test[i]);
//       if (current < min) min = current;
//     }
//     return evaluateComparison(this.property, min, this.arg);
//   }
// }
