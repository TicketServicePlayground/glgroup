import { supabase } from "@/lib/supabaseClient";
import ExchangeDashboardMain from "./ExchangeDashboardMain";
import { getCurrencies } from "@/lib/api";
import { headers } from "next/headers";

export default async function ExchangeDashboardMainServer({ blok }) {
    const locale = headers().get("x-next-intl-locale") || "en";

    /* === 1. Доступні дати === */
    const { data: datesRaw } = await supabase
        .from("exchange_rates")
        .select("timestamp")
        .gt("buy", 0)
        .gt("sell", 0);

    const availableDates = [...new Set(
        (datesRaw || [])
            .map(d => {
                const date = new Date(d.timestamp);
                return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
            })
            .filter(Boolean)
    )].sort((a, b) => b.localeCompare(a));

    /* === 2. Latest rates === */
    const { data: ratesData } = await supabase
        .from("exchange_rates_latest")
        .select("*");

    /* === 3. BI latest rates === */
    const { data: ratesBIData } = await supabase
        .from("exchange_rates_bi_latest")
        .select("*");

    /* === 4. Нормалізація валют (CNH / RMB → CNY) === */
    const normalizeRates = (rates) =>
        (rates || []).map((rate) => ({
            ...rate,
            currency:
                rate.currency === "CNH" || rate.currency === "RMB"
                    ? "CNY"
                    : rate.currency,
        }));
    const normalizeRatesBi = (rates) => {
        if (!rates || !Array.isArray(rates)) return [];

        const result = [];
        const seen = new Map();

        for (const rate of rates) {
            let currency = rate.currency;
            if (currency === 'CNH' || currency === 'RMB') {
                currency = 'CNY';
            }

            const current = seen.get(currency);
            if (!current) {
                seen.set(currency, { ...rate, currency });
                continue;
            }
            if (currency === 'CNY') {
                const newRate = rate.buy > 0 && rate.sell > 0 ? rate : null;
                const currRate = current.buy > 0 && current.sell > 0 ? current : null;
                const currentSource = current.originalCurrency || 'CNY';
                const newSource = rate.currency;

                let shouldReplace = false;

                if (!currRate && newRate) {
                    shouldReplace = true;
                } else if (newRate && currRate) {
                    if (newSource === 'CNY' && currentSource !== 'CNY') {
                        shouldReplace = true;
                    } else if (newSource === 'CNH' && currentSource === 'RMB') {
                        shouldReplace = true;
                    }
                }

                if (shouldReplace) {
                    seen.set(currency, { ...rate, currency, originalCurrency: rate.currency });
                }
            }
            else {
                seen.set(currency, { ...rate, currency });
            }
        }
        const ordered = [];
        for (const rate of rates) {
            const normCurrency = (rate.currency === 'CNH' || rate.currency === 'RMB') ? 'CNY' : rate.currency;
            if (seen.has(normCurrency) && !ordered.some(r => r.currency === normCurrency)) {
                ordered.push(seen.get(normCurrency));
            }
        }
        for (const [currency, rate] of seen) {
            if (!ordered.some(r => r.currency === currency)) {
                ordered.push(rate);
            }
        }

        return ordered;
    };
    const normalizedRatesData = normalizeRates(ratesData);
    const normalizedRatesBIData = normalizeRatesBi(ratesBIData);
    /* === 5. Дані про валюти з API === */
    const currenciesResponse = await getCurrencies(locale);
    const currenciesData = currenciesResponse?.data?.datasource_entries || [];

    const currenciesMap = Object.fromEntries(
        currenciesData.map((c) => [c.name, c.dimension_value || c.value])
    );

    const currenciesList = currenciesData.map((c) => c.name);

    /* === 6. Дані про банки === */
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

    /* === 7. Фільтрація по доступних банках === */
    const filterAvailableBanks = (rates) =>
        rates.filter((rate) => banksMap[rate.bank]?.available);

    const filteredRatesData = filterAvailableBanks(normalizedRatesData);
    const filteredRatesBIData = normalizedRatesBIData;
    /* === 8. Передаємо все у клієнтський компонент === */
    return (
        <ExchangeDashboardMain
            blok={blok}
            availableDates={availableDates}
            rates={filteredRatesData}
            ratesBI={filteredRatesBIData}
            currenciesMap={currenciesMap}
            currenciesList={currenciesList}
            banksMap={banksMap}
            locale={locale}
        />
    );
}
