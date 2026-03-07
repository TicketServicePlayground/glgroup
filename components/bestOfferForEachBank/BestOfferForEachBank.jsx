"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import styles from "./bestOfferForEachBank.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import id from "date-fns/locale/id";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClientClient";

function formatNumber(value) {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTimeByLocale(dateInput = new Date(), locale = "ru", updatedat, timeZone = "Asia/Jakarta") {
    const date = new Date(dateInput);
    const options = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    return `${updatedat} ${new Intl.DateTimeFormat(locale, options).format(date)}`;
}

function formatDateLongByLocale(dateInput = new Date(), locale = "ru", timeZone = "Asia/Jakarta") {
    const date = new Date(dateInput);
    const options = {
        timeZone,
        day: "2-digit",
        month: "long",
        year: "numeric",
    };
    return new Intl.DateTimeFormat(locale, options).format(date);
}

function CurrencyDropdown({ currenciesList, selectedCurrency, setSelectedCurrency }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
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
                    <div className={styles.circle}>
                        <img
                            src={`/img/flags/twemoji_flag-${selectedCurrency}.svg`}
                            alt={selectedCurrency}
                            className={styles.flag}
                        />
                    </div>
                    <span>{selectedCurrency}</span>
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
                        {currenciesList.map((cur) => (
                            <li
                                key={cur}
                                className={clsx(styles.dropdownItem, cur === selectedCurrency && styles.active)}
                                onClick={() => {
                                    setSelectedCurrency(cur);
                                    setOpen(false);
                                }}
                            >
                                <div className={styles.circle}>
                                    <img src={`/img/flags/twemoji_flag-${cur}.svg`} alt={cur} className={styles.flag} />
                                </div>
                                <span>{cur}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

function formatDynamicText(rawText, locale, placeholders = {}) {
    if (!rawText) return "";

    let text = "";

    if (typeof rawText === "string") {
        text = rawText;
    } else if (Array.isArray(rawText) || typeof rawText === "object") {
        if (typeof rawText?.[locale] === "string") text = rawText[locale];
        else if (typeof rawText?.content === "string") text = rawText.content;
        else text = "";
    }

    Object.entries(placeholders).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{${key}}`, "g"), value ?? "");
    });

    return text;
}

const BestOfferForEachBank = ({
                                  blok,
                                  availableDates = [],
                                  currenciesList = [],
                                  locale,
                                  currenciesMap = {},
                                  banksMap = {},
                              }) => {
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [selectedDate, setSelectedDate] = useState(null);
    const [ratesForDate, setRatesForDate] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const [sortField, setSortField] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);

    const tableRef = useRef(null);

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    // Масив об'єктів Date для DatePicker
    const availableDateObjects = useMemo(() => {
        return availableDates
            .filter((d) => typeof d === "string" && d.length === 10)
            .map((d) => new Date(d))
            .filter((d) => !isNaN(d.getTime()));
    }, [availableDates]);

    // Початкова дата — найновіша доступна
    useEffect(() => {
        if (availableDateObjects.length > 0 && !selectedDate) {
            setSelectedDate(availableDateObjects[0]);
        }
    }, [availableDateObjects]);

    // Завантаження курсів при зміні дати або валюти
    useEffect(() => {
        if (!selectedDate || !selectedCurrency) {
            setRatesForDate([]);
            return;
        }

        const fetchRates = async () => {
            const selectedDateString = selectedDate.toISOString().split("T")[0];

            const { data, error } = await supabase
                .from("exchange_rates")
                .select("*")
                .eq("currency", selectedCurrency)
                .gte("timestamp", `${selectedDateString} 00:00:00`)
                .lte("timestamp", `${selectedDateString} 23:59:59`)
                .gt("buy", 0)
                .gt("sell", 0)
                .order("timestamp", { ascending: false });

            if (error) {
                console.error("Помилка завантаження курсів:", error);
                setRatesForDate([]);
            } else {
                const latestByBank = {};
                data?.forEach((row) => {
                    if (!latestByBank[row.bank] || new Date(row.timestamp) > new Date(latestByBank[row.bank].timestamp)) {
                        latestByBank[row.bank] = row;
                    }
                });
                setRatesForDate(Object.values(latestByBank));
            }
        };

        fetchRates();
    }, [selectedDate, selectedCurrency]);

    const hasTodayData = useMemo(() => {
        return availableDates.includes(todayString);
    }, [availableDates, todayString]);

    const isTodaySelected =
        selectedDate &&
        selectedDate.getFullYear() === today.getFullYear() &&
        selectedDate.getMonth() === today.getMonth() &&
        selectedDate.getDate() === today.getDate();

    const formattedDateForHeader = selectedDate ? formatTimeByLocale(selectedDate, locale, blok.updatedat) : "";

    const filteredRates = ratesForDate.filter((r) => r.currency === selectedCurrency && r.buy > 0 && r.sell > 0);

    const latestByBank = Object.values(
        filteredRates.reduce((acc, r) => {
            if (!acc[r.bank] || new Date(r.timestamp) > new Date(acc[r.bank].timestamp)) {
                acc[r.bank] = r;
            }
            return acc;
        }, {})
    );

    const bestBuyRate = latestByBank.length ? Math.max(...latestByBank.map((r) => r.buy)) : 0;
    const bestSellRate = latestByBank.length ? Math.min(...latestByBank.map((r) => r.sell)) : 0;

    const bestBankBuyEntry = latestByBank.find((r) => r.buy === bestBuyRate);
    const bestBankSellEntry = latestByBank.find((r) => r.sell === bestSellRate);

    const bestBankBuy = bestBankBuyEntry ? banksMap[bestBankBuyEntry.bank]?.name || "-" : "-";
    const bestBankSell = bestBankSellEntry ? banksMap[bestBankSellEntry.bank]?.name || "-" : "-";

    const sortedRates = [...latestByBank].sort((a, b) => {
        if (!sortField) return 0;
        return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });

    const visibleData = useMemo(() => {
        const data = [...sortedRates];
        const result = [];

        if (bestBankBuyEntry) {
            const index = data.findIndex((r) => r === bestBankBuyEntry);
            if (index !== -1) result.push(...data.splice(index, 1));
        }

        if (bestBankSellEntry && bestBankSellEntry !== bestBankBuyEntry) {
            const index = data.findIndex((r) => r === bestBankSellEntry);
            if (index !== -1) result.push(...data.splice(index, 1));
        }

        result.push(...data.slice(0, visibleCount - result.length));
        return result.slice(0, visibleCount);
    }, [sortedRates, bestBankBuyEntry, bestBankSellEntry, visibleCount]);

    const isExpanded = visibleCount >= sortedRates.length;

    const CustomInput = React.forwardRef(({ onClick }, ref) => {
        const displayValue = isTodaySelected
            ? blok.today
            : selectedDate
                ? new Intl.DateTimeFormat(locale, {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                }).format(selectedDate)
                : "Оберіть дату";

        return (
            <button
                type="button"
                className={clsx(
                    "flex items-center gap-2 px-3 py-2 border rounded-lg text-sm bg-white",
                    styles.datepickerbutton
                )}
                onClick={onClick}
                ref={ref}
            >
                <img src="/img/icons/datepicker.svg" alt="datepicker" className={styles.datepickersvg} />
                <span>{displayValue}</span>
            </button>
        );
    });

    const currencyBuy = bestBuyRate ? formatNumber(bestBuyRate) : "-";
    const currencySell = bestSellRate ? formatNumber(bestSellRate) : "-";

    const placeholders = {
        date: formatDateLongByLocale(selectedDate, locale),
        currency: selectedCurrency,
        best_bank_buy: bestBankBuy,
        best_bank_sell: bestBankSell,
        currency_buy: currencyBuy,
        currency_sell: currencySell,
        best_buy: currencyBuy,
        best_sell: currencySell,
        bank_list: Object.values(banksMap).map((b) => b.name).join(", "),
    };

    const dynamicText1 = formatDynamicText(blok.text1, locale, placeholders);
    const dynamicText2 = formatDynamicText(blok.text2, locale, placeholders);
    const dynamicText3 = formatDynamicText(blok.text3, locale, placeholders);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const showMoreTextRaw =
        blok[isExpanded ? "hideall" : "showall"]?.[locale] ||
        blok[isExpanded ? "hideall" : "showall"];
    const showMoreText = showMoreTextRaw?.replace(/%s/g, selectedCurrency);

    const datePickerLocale = locale === "ru" ? ru : locale === "id" ? id : undefined;

    return (
        <section className={styles.bestOfferForEachBank} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div className={styles.text1Block} dangerouslySetInnerHTML={{ __html: dynamicText1.replace(/\n/g, "<br>") }} />

                <div className={styles.filterBlock}>
                    <div className={styles.filterBlockDate}>
                        {isTodaySelected && hasTodayData && formattedDateForHeader}
                    </div>
                    <div className={styles.filterBlockFilter}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={setSelectedDate}
                            dateFormat="dd MMMM yyyy"
                            locale={datePickerLocale}
                            includeDates={availableDateObjects}
                            customInput={<CustomInput />}
                        />

                        <CurrencyDropdown
                            currenciesList={currenciesList}
                            selectedCurrency={selectedCurrency}
                            setSelectedCurrency={setSelectedCurrency}
                        />
                    </div>
                </div>

                {ratesForDate.length === 0 ? (
                    <div className={styles.noData}></div>
                ) : (
                    <>
                        <div className={styles.tableWrapper} ref={tableRef}>
                            <div className={styles.table}>
                                <div className={clsx(styles.row, styles.header)}>
                                    <div>{render(blok.bank?.[locale] || blok.bank)}</div>

                                    <div className={styles.sortable} onClick={() => handleSort("buy")}>
                                        {render(blok.buy?.[locale] || blok.buy)}
                                        <span className={styles.sortIcons}>
                      {sortField === "buy" ? (
                          sortAsc ? (
                              <img src="/img/icons/sortarrowup.svg" alt="Sort ascending" className={styles.sortArrow} />
                          ) : (
                              <img src="/img/icons/sortarrowdown.svg" alt="Sort descending" className={styles.sortArrow} />
                          )
                      ) : (
                          <img src="/img/icons/sortarrow2.svg" alt="Unsorted" className={styles.sortArrow} />
                      )}
                    </span>
                                    </div>

                                    <div className={styles.sortable} onClick={() => handleSort("sell")}>
                                        {render(blok.sell?.[locale] || blok.sell)}
                                        <span className={styles.sortIcons}>
                      {sortField === "sell" ? (
                          sortAsc ? (
                              <img src="/img/icons/sortarrowup.svg" alt="Sort ascending" className={styles.sortArrow} />
                          ) : (
                              <img src="/img/icons/sortarrowdown.svg" alt="Sort descending" className={styles.sortArrow} />
                          )
                      ) : (
                          <img src="/img/icons/sortarrow2.svg" alt="Unsorted" className={styles.sortArrow} />
                      )}
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
                                                <div className={styles.buy_mobile}>{render(blok.buy?.[locale] || blok.buy)}</div>
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
                                                <div className={styles.sell_mobile}>{render(blok.sell?.[locale] || blok.sell)}</div>
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
                                                <Link href={banksMap[r.bank]?.url || "#"} passHref className={styles.detail}>
                                                    {blok.detail}
                                                </Link>
                                            </div>

                                            {r.img && (
                                                <div className={styles.serviceImg}>
                                                    <Image src={r.img} alt={banksMap[r.bank]?.name || ""} fill style={{ objectFit: "cover" }} />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noData}></div>
                                )}
                            </div>
                        </div>

                        {sortedRates.length > 5 && (
                            <div className={styles.buttonWrapper}>
                                <button
                                    className={styles.showMoreBtn}
                                    onClick={() => {
                                        if (isExpanded) {
                                            setVisibleCount(5);
                                            setTimeout(() => {
                                                tableRef.current?.scrollIntoView({
                                                    behavior: "smooth",
                                                    block: "start",
                                                });
                                            }, 0);
                                        } else {
                                            setVisibleCount(sortedRates.length);
                                        }
                                    }}
                                >
                                    {render(showMoreText)}
                                </button>
                            </div>
                        )}
                    </>
                )}

                <div className={styles.text2Block} dangerouslySetInnerHTML={{ __html: dynamicText2.replace(/\n/g, "<br>") }} />
            </div>
        </section>
    );
};

export default BestOfferForEachBank;