"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./InfoByCurrency.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Image from "next/image";
import Link from "next/link";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

function formatDynamicText(rawText, locale, placeholders = {}, bolder = false) {
    if (!rawText) return "";
    let text = "";

    if (typeof rawText === "string") text = rawText;
    else if (Array.isArray(rawText) || typeof rawText === "object") {
        if (typeof rawText?.[locale] === "string") text = rawText[locale];
        else if (typeof rawText?.content === "string") text = rawText.content;
        else text = "";
    }

    Object.entries(placeholders).forEach(([key, value]) => {
        const replacement = value ?? "";
        const finalVal = bolder ? `<strong>${replacement}</strong>` : replacement;
        text = text.replace(new RegExp(`{${key}}`, "g"), finalVal);
    });

    return text;
}

function formatDateLongByLocale(dateInput = new Date(), locale = "ru", timeZone = "Asia/Jakarta") {
    const date = new Date(dateInput);
    const options = { timeZone, day: "2-digit", month: "long", year: "numeric" };
    return new Intl.DateTimeFormat(locale, options).format(date);
}

function formatNumber(value) {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Dropdown({ list, selected, setSelected, getLabel, getIcon }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button
                type="button"
                className={clsx(styles.dropdownButton, "flex items-center justify-between")}
                onClick={() => setOpen(!open)}
            >
                <div className="flex items-center gap-2">
                    {getIcon && (
                        <div className={styles.circle}>
                            <img src={getIcon(selected)} alt={selected} className={styles.flag} />
                        </div>
                    )}
                    <span>{getLabel(selected)}</span>
                </div>

                <img
                    src="/img/icons/arrow-down.svg"
                    alt="arrow"
                    className={clsx(styles.arrow, open && styles.arrowOpen)}
                />
            </button>

            {open && (
                <div className={styles.dropdownListWrapper}>
                    <ul className={styles.dropdownList}>
                        {list.map((item) => (
                            <li
                                key={item}
                                className={clsx(styles.dropdownItem, item === selected && styles.active)}
                                onClick={() => {
                                    setSelected(item);
                                    setOpen(false);
                                }}
                            >
                                {getIcon && (
                                    <div className={styles.circle}>
                                        <img src={getIcon(item)} alt={item} className={styles.flag} />
                                    </div>
                                )}
                                <span>{getLabel(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const InfoByCurrency = ({ blok, rates = [], currenciesMap = {}, currenciesList = [], banksMap, locale, bankid }) => {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [selectedPeriod, setSelectedPeriod] = useState("1w");
    const [showBuy, setShowBuy] = useState(true);
    const [showSell, setShowSell] = useState(true);
    const tableRef = useRef(null);
    const [chartRates, setChartRates] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);

    const toggleBuy = () => setShowBuy(prev => !prev);
    const toggleSell = () => setShowSell(prev => !prev);

    const now = new Date();
    const startDate = useMemo(() => {
        switch (selectedPeriod) {
            case "1w": return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
            case "1m": return new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            case "6m": return new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
            default: return new Date(0);
        }
    }, [selectedPeriod]);

    useEffect(() => {
        if (!bankid || !selectedCurrency) return;

        setChartLoading(true);

        let range = "7d";
        if (selectedPeriod === "1w") range = "7d";
        else if (selectedPeriod === "1m") range = "1m";
        else if (selectedPeriod === "6m") range = "6m";

        fetch(`/api/exchange/chart?bank=${bankid}&currency=${selectedCurrency}&range=${range}`)
            .then(r => r.json())
            .then(data => {
                setChartRates(Array.isArray(data) ? data : []);
            })
            .catch(() => {
                setChartRates([]);
            })
            .finally(() => setChartLoading(false));

    }, [bankid, selectedCurrency, selectedPeriod]);

    const availableCurrencies = useMemo(() => {
        const set = Array.from(
            new Set(
                rates.filter(r => r.bank === bankid).map(r => r.currency)
            )
        );

        return set.sort(
            (a, b) => currenciesList.indexOf(a) - currenciesList.indexOf(b)
        );
    }, [rates, bankid, currenciesList]);

    useEffect(() => {
        if (!availableCurrencies.includes(selectedCurrency) && availableCurrencies.length > 0) {
            setSelectedCurrency(availableCurrencies[0]);
        }
    }, [availableCurrencies]);

    const ratesForSelected = chartRates;

    const chartData = ratesForSelected.map(r => ({
        date: r.timestamp,
        buy: r.buy,
        sell: r.sell
    }));

    const hasLines = showBuy || showSell;

    const [dataMin, dataMax] = useMemo(() => {
        const vals = [];
        if (showBuy) vals.push(...chartData.map(d => d.buy));
        if (showSell) vals.push(...chartData.map(d => d.sell));
        if (!vals.length) return [0, 100]; // fallback
        return [Math.min(...vals), Math.max(...vals)];
    }, [chartData, showBuy, showSell]);

    const getXTicks = (data) => {
        if (data.length === 0) return [];
        if (data.length <= 8) {
            return data.map(d => d.date);
        }

        const ticks = [];
        const step = Math.floor((data.length - 1) / 7);

        for (let i = 0; i < 8; i++) {
            const index = i * step;
            if (i === 7) {
                ticks.push(data[data.length - 1].date);
            } else {
                ticks.push(data[index].date);
            }
        }

        return ticks;
    };
    const yTicks = useMemo(() => {
        if (!chartData.length || dataMin === dataMax) return [];

        const range = dataMax - dataMin;
        const magnitude = Math.pow(10, Math.floor(Math.log10(range || 1)));

        let niceStep;
        const normalizedRange = range / magnitude;
        if (normalizedRange <= 1.5) niceStep = magnitude * 0.2;
        else if (normalizedRange <= 3) niceStep = magnitude * 0.5;
        else if (normalizedRange <= 7) niceStep = magnitude;
        else niceStep = magnitude * 2;

        // Оригінальний відступ — один крок зверху і знизу
        // Тепер зменшуємо його на 50% — додаємо/віднімаємо лише половину кроку
        const halfStep = niceStep / 2;

        const minRounded = Math.floor(dataMin / niceStep) * niceStep - halfStep;
        const maxRounded = Math.ceil(dataMax / niceStep) * niceStep + halfStep;

        const step = (maxRounded - minRounded) / 4; // 4 інтервали між 5 мітками

        const ticks = [];
        for (let i = 0; i < 5; i++) {
            ticks.push(minRounded + i * step);
        }

        return ticks.map(v => Math.round(v));
    }, [dataMin, dataMax]);

    const visibleTicks = yTicks.slice(1);

    const domainMin = yTicks[0] || 0;
    const domainMax = yTicks[4] || 100;

    const periodOptions = [
        { label: blok.oneweek?.[locale] || blok.oneweek, value: "1w" },
        { label: blok.onemonth?.[locale] || blok.onemonth, value: "1m" },
        { label: blok.sixmonth?.[locale] || blok.sixmonth, value: "6m" },
    ];

    const [sortField, setSortField] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);
    const [expanded, setExpanded] = useState(false);

    const filteredByOtherBanks = useMemo(() => {
        const latest = rates
            .filter(r => r.currency === selectedCurrency && r.bank !== bankid)
            .reduce((acc, r) => {
                if (!acc[r.bank] || new Date(r.timestamp) > new Date(acc[r.bank].timestamp)) {
                    acc[r.bank] = r;
                }
                return acc;
            }, {});

        return Object.values(latest);
    }, [rates, selectedCurrency, bankid]);

    const bestBuyRate = filteredByOtherBanks.length ? Math.min(...filteredByOtherBanks.map(r => r.buy)) : 0;
    const bestSellRate = filteredByOtherBanks.length ? Math.max(...filteredByOtherBanks.map(r => r.sell)) : 0;

    const bestBankBuyEntry = filteredByOtherBanks.find(r => r.buy === bestBuyRate);
    const bestBankSellEntry = filteredByOtherBanks.find(r => r.sell === bestSellRate);

    const baseSortedRates = useMemo(() => {
        let data = [...filteredByOtherBanks];

        if (sortField) {
            data.sort((a, b) => sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
        }

        return data;
    }, [filteredByOtherBanks, sortField, sortAsc]);

    const visibleData = useMemo(() => {
        const data = [...baseSortedRates];
        const result = [];

        if (!sortField) {
            if (bestBankBuyEntry) {
                const index = data.findIndex(r => r === bestBankBuyEntry);
                if (index !== -1) {
                    result.push(...data.splice(index, 1));
                }
            }

            if (bestBankSellEntry && bestBankSellEntry !== bestBankBuyEntry) {
                const index = data.findIndex(r => r === bestBankSellEntry);
                if (index !== -1) {
                    result.push(...data.splice(index, 1));
                }
            }
        }

        const remainingToShow = expanded ? data.length : 5 - result.length;
        result.push(...data.slice(0, remainingToShow));

        return result;
    }, [baseSortedRates, bestBankBuyEntry, bestBankSellEntry, expanded, sortField]);

    const latestForSelected = ratesForSelected[ratesForSelected.length - 1];
    const currencyBuy = latestForSelected ? formatNumber(latestForSelected.buy) : "-";
    const currencySell = latestForSelected ? formatNumber(latestForSelected.sell) : "-";
    const placeholders = {
        date: formatDateLongByLocale(latestForSelected?.timestamp, locale),
        currency: selectedCurrency,
        currency_buy: currencyBuy,
        currency_sell: currencySell,
        bank_name: banksMap[bankid]?.name,
    };

    const dynamicText = formatDynamicText(blok.description, locale, placeholders);
    const dynamicText1 = formatDynamicText(blok.title1, locale, placeholders, true);
    const dynamicText2 = formatDynamicText(blok.title2, locale, placeholders);

    const showMoreTextRaw =
        blok[expanded ? "showless" : "showmore"]?.[locale] ||
        blok[expanded ? "showless" : "showmore"];

    const showMoreText = formatDynamicText(showMoreTextRaw, locale, placeholders);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    return (
        <section className={clsx(styles.InfoByCurrency)} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div className={styles.description}>{render(dynamicText)}</div>

                <div className={styles.wrapperBlock}>
                    <div className={styles.chartTitle} dangerouslySetInnerHTML={{ __html: dynamicText1 }} />

                    <div className={styles.chartWrap}>
                        <div className={styles.controlsBlock}>
                            <div className={styles.chartSwitchers}>
                                <label className={clsx(styles.buttonSwapped, showBuy && styles.active)}>
                                    <input type="checkbox" checked={showBuy} onChange={toggleBuy} />
                                    {blok.buying}
                                </label>

                                <label className={clsx(styles.buttonSwapped, showSell && styles.active)}>
                                    <input type="checkbox" checked={showSell} onChange={toggleSell} />
                                    {blok.selling}
                                </label>
                            </div>

                            <div className={styles.chartFilters}>
                                <Dropdown
                                    list={periodOptions.map(p => p.value)}
                                    selected={selectedPeriod}
                                    setSelected={setSelectedPeriod}
                                    getLabel={(value) => periodOptions.find(p => p.value === value)?.label ?? value}
                                />

                                <Dropdown
                                    list={availableCurrencies}
                                    selected={selectedCurrency}
                                    setSelected={setSelectedCurrency}
                                    getLabel={cur => cur}
                                    getIcon={cur => `/img/flags/twemoji_flag-${cur}.svg`}
                                />
                            </div>
                        </div>

                        <div className={styles.chartBlock}>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 30, left: 20 }}>
                                    <CartesianGrid vertical={false} />

                                    <XAxis
                                        axisLine={false}
                                        dataKey="date"
                                        ticks={getXTicks(chartData)}
                                        padding={{ left: 20, right: 20 }}
                                        tickFormatter={(timestamp) => {
                                            const d = new Date(timestamp);
                                            return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`;
                                        }}
                                    />

                                    <YAxis
                                        axisLine={false}
                                        domain={[domainMin, domainMax]}
                                        tickFormatter={(v) => Math.round(v).toLocaleString("en-US")}
                                        ticks={visibleTicks}
                                        tick={{ dy: 5 }}
                                    />

                                    <Tooltip
                                        formatter={(v) => Math.round(v).toLocaleString("en-US")}
                                        labelFormatter={(label) => {
                                            const d = new Date(label);
                                            return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
                                        }}
                                    />

                                    {showBuy && <Line type="monotone" dataKey="buy" stroke="#3FA822" strokeWidth={2} dot={false} />}
                                    {showSell && <Line type="monotone" dataKey="sell" stroke="#1a73e8" strokeWidth={2} dot={false} />}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className={styles.chartTitle2}>{render(dynamicText2)}</div>

                    <div className={styles.tableWrapper} ref={tableRef}>
                        <div className={styles.table}>
                            <div className={clsx(styles.row, styles.header)}>
                                <div>{render(blok.bank?.[locale] || blok.bank)}</div>

                                <div className={styles.sortable} onClick={() => handleSort("buy")}>
                                    {render(blok.buyrate?.[locale] || blok.buyrate)}
                                    <span className={styles.sortIcons}>
                                        {sortField === "buy"
                                            ? <img src={`/img/icons/${sortAsc ? "sortarrowup" : "sortarrowdown"}.svg`} />
                                            : <img src="/img/icons/sortarrow2.svg" />}
                                    </span>
                                </div>

                                <div className={styles.sortable} onClick={() => handleSort("sell")}>
                                    {render(blok.sellrate?.[locale] || blok.sellrate)}
                                    <span className={styles.sortIcons}>
                                        {sortField === "sell"
                                            ? <img src={`/img/icons/${sortAsc ? "sortarrowup" : "sortarrowdown"}.svg`} />
                                            : <img src="/img/icons/sortarrow2.svg" />}
                                    </span>
                                </div>
                            </div>

                            {visibleData.length > 0 ? (
                                visibleData.map((r, i) => (
                                    <div key={i} className={styles.row}>
                                        <div className={styles.bank}>
                                            <img src={banksMap[r.bank]?.logo} alt={banksMap[r.bank]?.name} className={styles.flag} />
                                            {banksMap[r.bank]?.name}
                                        </div>

                                        <div className={clsx(styles.buy, r.buy === bestBuyRate && styles.best_buy)}>
                                            <div className={styles.buy_mobile}>{render(blok.buyrate?.[locale] || blok.buyrate)}</div>
                                            <div className={styles.buy_wrap}>
                                                {r.buy === bestBuyRate && (
                                                    <span className={styles.crownWrapper}>
                                                        <span className={styles.crown}>
                                                            <img src="/img/icons/crown.png" alt={render(blok.bestbuy)} className={styles.crown} />
                                                        </span>
                                                        <span className={styles.tooltip}>{render(blok.bestbuy)}</span>
                                                    </span>
                                                )}
                                                <span className={styles.boldnumber}>{formatNumber(r.buy)}</span> IDR
                                            </div>
                                        </div>

                                        <div className={clsx(styles.sell, r.sell === bestSellRate && styles.best_sell)}>
                                            <div className={styles.sell_mobile}> {render(blok.sellrate?.[locale] || blok.sellrate)}</div>
                                            <div className={styles.sell_wrap}>
                                                {r.sell === bestSellRate && (
                                                    <span className={styles.crownWrapper}>
                                                        <img src="/img/icons/crown.png" alt={render(blok.bestsell)} className={styles.crown} />
                                                        <span className={styles.tooltip}>{render(blok.bestsell)}</span>
                                                    </span>
                                                )}
                                                <span className={styles.boldnumber}>{formatNumber(r.sell)}</span> IDR
                                            </div>
                                        </div>

                                        <div className={styles.wrapdetail}>
                                            <Link
                                                href={`${(banksMap[r.bank]?.url || "#").startsWith("/") ? "" : "/"}${banksMap[r.bank]?.url || "#"}`}
                                                passHref
                                                className={styles.detail}
                                            >
                                                {blok.details}
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.noData}>No data for {selectedCurrency}</div>
                            )}
                        </div>
                    </div>

                    {filteredByOtherBanks.length > 5 && (
                        <div className={styles.buttonWrapper}>
                            <button className={styles.showMoreBtn} onClick={() => {
                                if (expanded) {
                                    setExpanded(false);
                                    setTimeout(() => {
                                        tableRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "start",
                                        });
                                    }, 0);
                                } else {
                                    setExpanded(true);
                                }
                            }}>
                                {render(showMoreText)}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default InfoByCurrency;