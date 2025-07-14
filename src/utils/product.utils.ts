import { IProduct, IProductVariant } from "@/ts/interfaces/product.interface";

import { generateHash } from "./hash-generate.utils";
import { findLongestIncreasingSubstrings } from "./substring-generate.utils";

export function generateProductCode(name: IProduct["name"]): string {
  const spaceCount = (name.match(/ /g) || []).length;

  const hash = generateHash(name);

  const { substrings, startIndices, endIndices } =
    findLongestIncreasingSubstrings(name);

  const concatenatedSubstring = substrings.join("").replace(/\s/g, "");
  const firstStart = startIndices[0];
  const lastEnd = endIndices[endIndices.length - 1] - spaceCount;

  return `${hash}-${firstStart}${concatenatedSubstring}${lastEnd}` as string;
}

export const getProductStatus = (stock: IProductVariant["stock"]) =>
  stock > 0 ? "in-stock" : "out-of-stock";

export async function calculateCurrentPrice(
  currPrice: IProductVariant["originalPrice"] = 0,
  discount: IProductVariant["discount"] = 0
): Promise<IProductVariant["price"]> {
  return parseFloat((await Promise.resolve(currPrice * (1 - discount / 100))).toFixed(2));
}
