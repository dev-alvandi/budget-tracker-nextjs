import { currencies } from "@/lib/currencies";
import { z } from "zod";

export const UpdateUserCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = currencies.some((currency) => currency.value === value);
    if (!found) {
      throw new Error(`Invalid currency: ${value}, (/Noah)`);
    }

    return value;
  }),
});
