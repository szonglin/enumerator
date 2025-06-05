export const conditionData = [
  {
    condition: "subarray",
    description:
      "contains the argument as adjacent values, eg. 'sparkler' contains 'park'",
    argType: "subInput",
  },
  {
    condition: "subsequence",
    description:
      "contains the argument as a subsequence, eg. 'category' contains 'coy'",
    argType: "subInput",
  },
  {
    condition: "count",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second with only distinct (non-overlapping)" +
      " terms counted, eg. 'banana' has 1 copy of 'ana'",
    argType: "subInputComparison",
  },
  {
    condition: "contains",
    description:
      "contains the elements of the argument in any order, in the sense that the set of elements is a super(multi)set of the argument, eg. 'trace' contains 'art'",
    argType: "subInput",
  },
  {
    condition: "excludes",
    description:
      "does not contain any of the elements of the argument in any order, eg. 'warm' excludes 'hot'",
    argType: "subInput",
  },
  {
    condition: "startsWith",
    description: "begins with the argument, eg. 'teacher' starts with 'tea'",
    argType: "subInput",
  },
  {
    condition: "endsWith",
    description: "ends with the argument, eg. 'yellow' ends with 'low'",
    argType: "subInput",
  },
  {
    condition: "increasing",
    description:
      "values are in increasing order, strictly increasing requires each value to be strictly greater than the previous",
    argType: "strictness",
  },
  {
    condition: "decreasing",
    description:
      "values are in decreasing order, strictly decreasing requires each value to be strictly less than the previous",
    argType: "strictness",
  },
  {
    condition: "palindrome",
    description: "is the same as its reverse, eg. 'radar'",
    argType: "none",
  },
  {
    condition: "distinct",
    description: "has all elements distinct, eg. 'copyright'",
    argType: "none",
  },
  {
    condition: "countDistinct",
    description:
      "number of distinct elements compared with the argument, eg '1, 2, 2, 3' = '3'",
    argType: "numerical",
  },
  {
    condition: "derangement",
    description:
      "no value is in the same place as it was originally, eg. 'idea' is a derangement of 'aide'",
    argType: "none",
  },
  {
    condition: "sum",
    description:
      "sum of elements compared with the argument, eg. '1, 2, 3' = '6'",
    argType: "numerical",
  },
  {
    condition: "maximum",
    description:
      "largest element compared with the argument, eg. '1, 2, 3' < '4' or 'fazed' = 'z'",
    argType: "numerical",
  },
  {
    condition: "minimum",
    description:
      "smallest element compared with the argument, eg. '1, 2, 3' > '0' or 'glass' = 'a'",
    argType: "numerical",
  },
  {
    condition: "minFrequency",
    description:
      "lowest frequency of any element compared with the argument, eg. 'breeze' = '1'",
    argType: "numerical",
  },
  {
    condition: "maxFrequency",
    description:
      "highest frequency of any element compared with the argument, eg. 'breeze' = '3'",
    argType: "numerical",
  },
  {
    condition: "average",
    description:
      "average of elements compared with the argument, eg. '1, 2, 3' = '2'",
    argType: "numerical",
  },
  {
    condition: "median",
    description:
      "median of elements compared with the argument, eg. '1, 2, 3, 4' = '2.5'",
    argType: "numerical",
  },
  {
    condition: "countOverlap",
    description:
      "number of appearances of the first argument (as a subarray) compared with the second, including overlapping" +
      " terms, eg. 'banana' has 2 copies of 'ana'",
    argType: "subInputComparison",
  },
  {
    condition: "subseqCount",
    description:
      "number of appearances of the first argument (as a subsequence) compared with the second, eg. 'banana' has 4" +
      " subsequences of 'ana'",
    argType: "subInputComparison",
  },
];
