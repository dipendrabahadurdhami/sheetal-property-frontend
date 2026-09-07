// Single source of truth for the "Reason(s) for contact" multi-select and
// "Preferred contact time" select used on the Schedule Tour, Contact Owner,
// and Contact Agent forms. Keep this in sync with the backend's
// app/Support/ContactReasons.php — the `value` here is what gets stored.

export const CONTACT_REASON_OPTIONS = [
  { value: "buying", label: "Buying a Property" },
  { value: "renting_leasing", label: "Renting / Leasing" },
  { value: "selling", label: "Selling a Property" },
  { value: "investment", label: "Investment Inquiry" },
  { value: "valuation", label: "Property Valuation" },
  { value: "legal_documentation", label: "Legal / Documentation Help" },
  { value: "site_visit", label: "Site Visit Only" },
  { value: "price_negotiation", label: "Price Negotiation" },
  { value: "other", label: "Other" },
];

export const PREFERRED_CONTACT_TIME_OPTIONS = [
  { value: "morning", label: "Morning (9 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM – 4 PM)" },
  { value: "evening", label: "Evening (4 PM – 7 PM)" },
  { value: "anytime", label: "Anytime" },
];
