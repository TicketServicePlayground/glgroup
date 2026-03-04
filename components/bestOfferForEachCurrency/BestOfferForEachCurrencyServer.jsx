import { supabase } from "@/lib/supabaseClient";
import BestOfferForEachCurrency from "./BestOfferForEachCurrency";
import { getCurrencies } from "@/lib/api";
import { headers } from "next/headers";

export default async function BestOfferForEachCurrencyServer({ blok }) {
    const locale = headers().get("x-next-intl-locale") || "en";

    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
        .from("exchange_rates_duplicate")
        .select("*")
        .gte("timestamp", `${today}T00:00:00`)
        .lte("timestamp", `${today}T23:59:59`)
        .order("timestamp", { ascending: false });

    if (!data || data.length === 0) {
        console.error("No exchange rates for today");
        return null;
    }

    const latestByBank = {};
    for (const row of data) {
        if (row.buy === 0 || row.sell === 0) continue;
        const key = `${row.bank}_${row.currency}`;
        if (!latestByBank[key]) latestByBank[key] = row;
    }

    const grouped = {};
    Object.values(latestByBank).forEach((row) => {
        if (!grouped[row.currency]) grouped[row.currency] = [];
        grouped[row.currency].push(row);
    });

    const rates = Object.entries(grouped)
        .map(([currency, rates]) => {
            const validRates = rates.filter((r) => r.buy > 0 && r.sell > 0);
            if (validRates.length === 0) return null;

            const bestBuy = validRates.reduce((min, r) => (r.buy < min.buy ? r : min), validRates[0]);
            const bestSell = validRates.reduce((max, r) => (r.sell > max.sell ? r : max), validRates[0]);

            return {
                currency,
                best_buy: { rate: bestBuy.buy, bank: bestBuy.bank },
                best_sell: { rate: bestSell.sell, bank: bestSell.bank },
            };
        })
        .filter(Boolean);

    const currenciesResponse = await getCurrencies(locale);
    const currenciesData = currenciesResponse?.data?.datasource_entries || [];

    const currenciesMap = Object.fromEntries(
        currenciesData.map((c) => [c.name, c.dimension_value || c.value])
    );

    const ratesWithName = currenciesData
        .map((c) => {
            const rate = rates.find((r) => r.currency === c.name);
            if (!rate) return null;
            return {
                ...rate,
                name: c.dimension_value || c.value,
            };
        })
        .filter(Boolean);

    return <BestOfferForEachCurrency blok={blok} initialRates={ratesWithName} locale={locale} />;
}
