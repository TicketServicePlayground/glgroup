import { supabase } from "@/lib/supabaseClient";
import SingleCurrencyTable from "./SingleCurrencyTable";
import { getCurrencies } from "@/lib/api";
import { headers } from "next/headers";

export default async function SingleCurrencyTableServer({ blok }) {
    const locale = headers().get("x-next-intl-locale") || "en";

    const { data: ratesData } = await supabase
        .from("exchange_rates_latest")
        .select("*")
        .eq("currency", blok.idcurrency);

    const normalizeRates = (rates) =>
        (rates || []).map((rate) => ({
            ...rate,
            currency:
                rate.currency === "CNH" || rate.currency === "RMB"
                    ? "CNY"
                    : rate.currency,
        }));
    const normalizedRatesData = normalizeRates(ratesData);

    const currenciesResponse = await getCurrencies(locale);
    const currenciesData = currenciesResponse?.data?.datasource_entries || [];

    const currenciesMap = Object.fromEntries(
        currenciesData.map((c) => [c.name, c.dimension_value || c.value])
    );

    const currenciesList = currenciesData.map((c) => c.name);

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

    const filterAvailableBanks = (rates) =>
        rates.filter((rate) => banksMap[rate.bank]?.available);
    const filteredRatesData = filterAvailableBanks(normalizedRatesData);
    return (
        <SingleCurrencyTable
            blok={blok}
            rates={filteredRatesData}
            locale={locale}
            currenciesMap={currenciesMap}
            currenciesList={currenciesList}
            banksMap={banksMap}
        />
    );
}
