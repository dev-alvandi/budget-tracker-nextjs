export const currencies = [
  {
    value: "SEK",
    label: "kr Swedish Krona",
    locale: "sv-SE",
  },
  {
    value: "USD",
    label: "$ Dollar",
    locale: "en-US",
  },
  {
    value: "EUR",
    label: "€ Euro",
    locale: "de-DE",
  },
  {
    value: "GBP",
    label: "£ Pound",
    locale: "en-GB",
  },
];

export type CurrencyType = (typeof currencies)[0];
