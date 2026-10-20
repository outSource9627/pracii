"use client";

import { getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { useSyncExternalStore, type FocusEvent, type FormEvent } from "react";
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/motion";

const OPTIONS = COUNTRIES.map(([code, name]) => [code, name, getCountryCallingCode(code)] as const);
const NAMES = new Map<string, string>(COUNTRIES);

const flagOf = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));

/** India, unless the browser clearly says the visitor is somewhere else. */
function guessCountry(): CountryCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "IN";
    for (const lang of navigator.languages ?? [navigator.language]) {
      const region = new Intl.Locale(lang).maximize().region;
      if (region && NAMES.has(region)) return region as CountryCode;
    }
  } catch {
    // older browsers without Intl.Locale — fall through
  }
  return "IN";
}

const never = () => () => {};

/** The country the picker starts on. "IN" while rendering on the server, the visitor's guess after. */
export function useDefaultCountry(): CountryCode {
  return useSyncExternalStore(never, guessCountry, () => "IN");
}

export type PhoneCheck =
  | { ok: true; phone: string; country: string; dialCode: string }
  | { ok: false; error: string };

/** Validates the number for the picked country. Empty is fine — the field is optional. */
export function checkPhone(raw: string, country: CountryCode): PhoneCheck {
  const value = raw.trim();
  if (!value) return { ok: true, phone: "", country: "", dialCode: "" };
  const parsed = parsePhoneNumberFromString(value, country);
  if (!parsed?.isValid()) {
    return { ok: false, error: `That doesn’t look like a valid ${NAMES.get(country) ?? ""} phone number.` };
  }
  return { ok: true, phone: parsed.number, country: parsed.country ?? country, dialCode: parsed.countryCallingCode };
}

type Props = {
  country: CountryCode;
  onCountryChange: (country: CountryCode) => void;
  value: string;
  onValueChange: (value: string) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onInput?: (e: FormEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  className?: string;
};

export function PhoneField({ country, onCountryChange, value, onValueChange, onFocus, onInput, onBlur, className }: Props) {
  // A number typed with its own +code ("+1 415…") picks its country by itself.
  const settle = () => {
    if (!value.trim().startsWith("+")) return;
    const parsed = parsePhoneNumberFromString(value);
    if (parsed?.isValid() && parsed.country) {
      onCountryChange(parsed.country);
      onValueChange(parsed.nationalNumber);
    }
  };

  return (
    <div
      className={cn(
        "flex rounded-[14px] bg-cream ring-1 ring-ink/[0.08] transition-shadow duration-300 focus-within:ring-2 focus-within:ring-sky",
        className,
      )}
    >
      <div className="relative flex shrink-0 items-center gap-1.5 border-r border-ink/[0.08] pl-4 pr-3 text-[0.98rem] font-medium text-ink">
        <span aria-hidden className="text-[1.15rem] leading-none">
          {flagOf(country)}
        </span>
        <span aria-hidden>+{getCountryCallingCode(country)}</span>
        <svg aria-hidden viewBox="0 0 12 12" className="h-3 w-3 text-body" fill="none" stroke="currentColor" strokeWidth={1.6}>
          <path d="m3 4.5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <select
          aria-label="Country code"
          value={country}
          onChange={(e) => onCountryChange(e.target.value as CountryCode)}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
          {OPTIONS.map(([code, name, dial]) => (
            <option key={code} value={code}>
              {name} (+{dial})
            </option>
          ))}
        </select>
      </div>
      <input
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        aria-label="Phone number (optional)"
        placeholder="Phone (optional)"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={onFocus}
        onInput={onInput}
        onBlur={() => {
          settle();
          onBlur?.();
        }}
        className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[0.98rem] font-medium text-ink outline-none placeholder:text-faint"
      />
    </div>
  );
}
