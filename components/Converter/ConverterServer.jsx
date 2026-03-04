import { supabase } from "@/lib/supabaseClient";
import Converter from "./Converter";
import { getCurrencies } from "@/lib/api";
import { headers } from "next/headers";

export default async function ConverterServer({ blok }) {
    const locale = headers().get("x-next-intl-locale") || "en";

    /* === 1. BI latest rates === */
    const { data: ratesBIData } = await supabase
        .from("exchange_rates_bi_latest")
        .select("*");

    /* === 2. Latest rates === */
    const { data: ratesData } = await supabase
        .from("exchange_rates_latest")
        .select("*");

    /* === 3. Normalize currencies (CNH/RMB → CNY) === */
    const normalizeRates = (rates) =>
        (rates || []).map((rate) => ({
            ...rate,
            currency:
                rate.currency === "CNH" || rate.currency === "RMB"
                    ? "CNY"
                    : rate.currency,
        }));

    const normalizedRates = normalizeRates(ratesData);
    const normalizedRatesBI = normalizeRates(ratesBIData);

    /* === 4. Currencies from CMS datasource === */
    const currenciesResponse = await getCurrencies(locale);
    const currenciesData = currenciesResponse?.data?.datasource_entries || [];

    const currenciesMap = Object.fromEntries(
        currenciesData.map((c) => [c.name, c.dimension_value || c.value])
    );

    /* === 5. Banks map from blok === */
    const bankList = blok.BankList?.[0]?.banks || [];
    const banksMap = Object.fromEntries(
        bankList.map((b) => [
            b.id,
            {
                name: b.name,
                logo: b.logo?.filename || "",
                url: b.url?.cached_url || "",
                available: b.available ?? false,
            },
        ])
    );

    return (
        <Converter
            blok={blok}
            rates={normalizedRates}
            ratesBI={normalizedRatesBI}
            banksMap={banksMap}
            currenciesMap={currenciesMap}
        />
    );
}
