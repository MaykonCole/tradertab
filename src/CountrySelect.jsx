import React, { useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

const COUNTRY_CODES = `
AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ
BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ
CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ
DE DJ DK DM DO DZ
EC EE EG EH ER ES ET
FI FJ FK FM FO FR
GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY
HK HM HN HR HT HU
ID IE IL IM IN IO IQ IR IS IT
JE JM JO JP
KE KG KH KI KM KN KP KR KW KY KZ
LA LB LC LI LK LR LS LT LU LV LY
MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ
NA NC NE NF NG NI NL NO NP NR NU NZ
OM
PA PE PF PG PH PK PL PM PN PR PS PT PW PY
QA
RE RO RS RU RW
SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ
TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ
UA UG UM US UY UZ
VA VC VE VG VI VN VU
WF WS
XK
YE YT
ZA ZM ZW
`
  .trim()
  .split(/\s+/);

const localeByLanguage = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const normalizeText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const getCountryOptions = (language) => {
  const locale = localeByLanguage[language] || "pt-BR";
  const names = new Intl.DisplayNames([locale], { type: "region" });

  return COUNTRY_CODES.map((code) => ({
    code,
    name: names.of(code) || code,
  }))
    .filter((country) => country.name !== country.code || country.code === "XK")
    .sort((a, b) => a.name.localeCompare(b.name, locale));
};

export const getCountryName = (countryCode, language) =>
  getCountryOptions(language).find((country) => country.code === countryCode)
    ?.name || "";

export const findCountryCodeByName = (countryName, language) => {
  const normalizedName = normalizeText(countryName);
  if (!normalizedName) return "";

  return (
    getCountryOptions(language).find(
      (country) => normalizeText(country.name) === normalizedName,
    )?.code || ""
  );
};

export default function CountrySelect({
  language,
  value,
  onChange,
  label,
  placeholder,
  required = false,
}) {
  const options = useMemo(() => getCountryOptions(language), [language]);
  const selectedCountry = options.find((country) => country.code === value);
  const [search, setSearch] = useState(selectedCountry?.name || "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSearch(selectedCountry?.name || "");
  }, [selectedCountry?.name]);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return options.slice(0, 12);

    return options
      .filter(
        (country) =>
          normalizeText(country.name).includes(normalizedSearch) ||
          country.code.toLowerCase().includes(normalizedSearch),
      )
      .slice(0, 12);
  }, [options, search]);

  const selectCountry = (country) => {
    setSearch(country.name);
    onChange(country.code);
    setOpen(false);
  };

  return (
    <label className="country-select-field">
      <span>{label}</span>
      <div className={`country-combobox ${open ? "open" : ""}`}>
        <Search size={17} />
        <input
          value={search}
          placeholder={placeholder}
          autoComplete="country-name"
          required={required}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 140);
          }}
          onChange={(event) => {
            const nextSearch = event.target.value;
            setSearch(nextSearch);
            setOpen(true);

            const exactCountry = options.find(
              (country) =>
                normalizeText(country.name) === normalizeText(nextSearch),
            );
            onChange(exactCountry?.code || "");
          }}
        />
        <ChevronDown size={16} />

        {open && (
          <div className="country-options" role="listbox">
            {filteredCountries.length ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  role="option"
                  aria-selected={country.code === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectCountry(country)}
                >
                  <span>{country.name}</span>
                  <small>{country.code}</small>
                  {country.code === value && <Check size={16} />}
                </button>
              ))
            ) : (
              <p>Nenhum país encontrado</p>
            )}
          </div>
        )}
      </div>
    </label>
  );
}
