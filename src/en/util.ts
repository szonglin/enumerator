export type enumerationType = "permutation" | "combination";

export class Util {
  // converts a string input to an array of numbers
  static inputToArray = (input: string): number[] => {
    input = input.trim();
    let res;
    if (input.includes(",")) {
      res = input.replace(/\s+/g, "").split(",");
    } else if (input.includes(" ")) {
      res = input.split(" ");
    } else {
      res = input.split("");
    }
    return res.map((e) => {
      const _e = Number(e);
      if (!isNaN(_e)) return _e;
      else if (e.length === 1) return e.charCodeAt(0);
      else return NaN;
    });
  };

  // checks that a string does not contain any characters that are not ' ', ',' , a number, or a character ascii
  static validateString = (input: string) => {
    if (/[^a-zA-Z0-9\s,]/.test(input))
      throw new Error(
        "Invalid input: please use only spaces, commas, numbers, or alphabetical characters."
      );
  };

  // evaluates the factorial of a number
  static factorial(n: number): number {
    return n === 0 ? 1 : n * this.factorial(n - 1);
  }

  // evaluates n permute r
  static nPr(n: number, r: number): number {
    let res = 1;
    for (let i = 0; i < r; i++) res *= n - i;
    return res;
  }

  // evaluates n choose r
  static nCr(n: number, r: number): number {
    return this.roundDivision(this.nPr(n, r), this.factorial(r));
  }

  // performs a division and rounds the result
  static roundDivision(a: number, b: number): number {
    return Math.round(a / b);
  }

  // next permutation algorithm
  // adapted from cppreference
  static nextPermutation(arr: number[]): boolean {
    let left = arr.length - 2;
    while (left >= 0 && arr[left] >= arr[left + 1]) left--;
    if (left === -1) return false;

    let right = arr.length - 1;
    while (arr[right] <= arr[left]) right--;

    [arr[left], arr[right]] = [arr[right], arr[left]];
    for (let l = left + 1, r = arr.length - 1; l < r; l++, r--) {
      [arr[l], arr[r]] = [arr[r], arr[l]];
    }
    return true;
  }

  // checks if an array is sorted
  static isSorted(arr: number[]): boolean {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] > arr[i + 1]) return false;
    }
    return true;
  }

  // generates a mask with n-r zeroes followed by r ones
  static mask(n: number, r: number): number[] {
    let res = Array(n).fill(0);
    for (let i = 0; i < r; i++) res[n - 1 - i] = 1;
    return res;
  }

  // converts a number to an ascii character if it is alphabetical, number otherwise
  static permElementToString(e: number): string {
    return (e >= 65 && e <= 90) || (e >= 97 && e <= 122)
      ? String.fromCharCode(e)
      : e.toString();
  }

  // remove duplicates from an array - output is guaranteed to be sorted
  static removeDuplicates(arr: number[]): number[] {
    return Array.from(new Set(arr).keys()).sort((a, b) => a - b);
  }

  // random int
  static randInt(upperBound: number): number {
    return Math.floor(Math.random() * upperBound);
  }

  // random array element
  static randElement(arr: number[]): number {
    return arr[this.randInt(arr.length)];
  }

  // random permutation
  static randPerm(arr: number[], length: number): number[] {
    return this.randPermFull(arr).splice(0, length);
  }

  // fisher-yates shuffle: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  static randPermFull(arr: number[]): number[] {
    const permed = [...arr];
    for (let i = permed.length; i > 0; i--) {
      const j = this.randInt(i + 1);
      [permed[j], permed[i]] = [permed[i], permed[j]];
    }
    return permed;
  }

  // random permutation with repeats, arr must not have repeats
  static randPermRp(arr: number[], length: number): number[] {
    return Array.from({ length }, () => this.randElement(arr));
  }

  // random choice - output is not guaranteed to be sorted
  static randChoice(arr: number[], length: number): number[] {
    // honestly not sure if its the same distribution to just do fisheryates and then sort but this *feels* better
    let bitmask = this.randPermFull(this.mask(arr.length, length));
    const res = [];
    // faster than reduce
    for (let i = 0; i < arr.length; i++) {
      if (bitmask[i]) res.push(arr[i]);
    }
    return res;
  }

  // random choice with repeats, arr must not have repeats
  static randChoiceRp(arr: number[], length: number): number[] {
    return this.randPermRp(arr, length).sort((a, b) => a - b);
  }
}
