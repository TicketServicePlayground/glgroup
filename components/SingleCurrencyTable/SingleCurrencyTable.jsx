"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Breadcrumbs from "./Breadcrumbs";
import styles from "./SingleCurrencyTable.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Link from "next/link";

function formatNumber(value) {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatTimeByLocale(dateInput = new Date(), locale = "ru", timeZone = "Asia/Jakarta") {
    const date = new Date(dateInput);
    const options = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    };
    return locale.startsWith("ru")
        ? `Обновлено в ${new Intl.DateTimeFormat(locale, options).format(date)}`
        : `Updated at ${new Intl.DateTimeFormat(locale, options).format(date)}`;
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

const SingleCurrencyTable = ({
                                 blok,
                                 rates = [],
                                 locale = "ru",
                                 currenciesList = [],
                                 currenciesMap = {},
                                 banksMap = {},
                             }) => {
    const selectedCurrency = blok.idcurrency;
    const availableDates = useMemo(() => {
        return Array.from(
            new Set(
                rates
                    .filter((r) => r.currency === selectedCurrency)
                    .map((r) => new Date(r.timestamp).toISOString().split("T")[0])
            )
        ).map((d) => new Date(d));
    }, [rates, selectedCurrency]);

    const lastAvailableDate = useMemo(() => {
        if (availableDates.length === 0) return new Date();
        return availableDates.reduce((a, b) => (a > b ? a : b));
    }, [availableDates]);

    const [selectedDate, setSelectedDate] = useState(lastAvailableDate);
    useEffect(() => {
        setSelectedDate(lastAvailableDate);
    }, [lastAvailableDate]);

    const [sortField, setSortField] = useState(null);
    const [sortAsc, setSortAsc] = useState(true);

    const selectedDateString = selectedDate.toISOString().split("T")[0];

    const filteredRates = rates.filter((r) => {
        const itemDate = new Date(r.timestamp).toISOString().split("T")[0];
        return (
            r.currency === selectedCurrency &&
            itemDate === selectedDateString &&
            r.buy > 0 &&
            r.sell > 0
        );
    });

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

    const bestBuyEntry = latestByBank.find((r) => r.buy === bestBuyRate);
    const bestSellEntry = latestByBank.find((r) => r.sell === bestSellRate);

    const sortedRates = [...latestByBank].sort((a, b) => {
        if (!sortField) return 0;
        return sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
    });

    const visibleData = useMemo(() => {
        const data = [...sortedRates];
        const result = [];

        if (bestBuyEntry) {
            const index = data.findIndex(r => r.bank === bestBuyEntry.bank);
            if (index !== -1) {
                result.push(data.splice(index, 1)[0]);
            }
        }

        if (bestSellEntry && bestSellEntry.bank !== bestBuyEntry?.bank) {
            const index = data.findIndex(r => r.bank === bestSellEntry.bank);
            if (index !== -1) {
                result.push(data.splice(index, 1)[0]);
            }
        }

        result.push(...data);
        return result;
    }, [sortedRates, bestBuyEntry, bestSellEntry]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const formattedDateForHeader = formatTimeByLocale(selectedDate, locale);
    function getTodayDateFormatted() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    }
    return (
        <section className={styles.bestOfferForEachBank} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div>
                    <Breadcrumbs onHero={true} links={blok.breadcrumbs}/>
                </div>
                <div className={styles.topBlock}>
                    <div className={clsx(styles.date, "z-10 relative mb-5 lg:mb-12")}>{getTodayDateFormatted()}</div>
                </div>
                <h1>{blok.title}</h1>
                <div className={styles.description}>{blok.description}</div>
                <div className={styles.tableWrapper}>
                    <div className={styles.table}>
                        <div className={clsx(styles.row, styles.header)}>
                            <div>{render(blok.bank?.[locale] || blok.bank)}</div>

                            <div className={styles.sortable} onClick={() => handleSort("buy")}>
                                {render(blok.buy?.[locale] || blok.buy)}
                                <span className={styles.sortIcons}>
                                    {sortField === "buy" ? (
                                        sortAsc ? (
                                            <img
                                                src="/img/icons/sortarrowup.svg"
                                                alt="Sort ascending"
                                                className={styles.sortArrow}
                                            />
                                        ) : (
                                            <img
                                                src="/img/icons/sortarrowdown.svg"
                                                alt="Sort descending"
                                                className={styles.sortArrow}
                                            />
                                        )
                                    ) : (
                                        <img
                                            src="/img/icons/sortarrow2.svg"
                                            alt="Unsorted"
                                            className={styles.sortArrow}
                                        />
                                    )}
                                </span>
                            </div>

                            <div className={styles.sortable} onClick={() => handleSort("sell")}>
                                {render(blok.sell?.[locale] || blok.sell)}
                                <span className={styles.sortIcons}>
                                    {sortField === "sell" ? (
                                        sortAsc ? (
                                            <img
                                                src="/img/icons/sortarrowup.svg"
                                                alt="Sort ascending"
                                                className={styles.sortArrow}
                                            />
                                        ) : (
                                            <img
                                                src="/img/icons/sortarrowdown.svg"
                                                alt="Sort descending"
                                                className={styles.sortArrow}
                                            />
                                        )
                                    ) : (
                                        <img
                                            src="/img/icons/sortarrow2.svg"
                                            alt="Unsorted"
                                            className={styles.sortArrow}
                                        />
                                    )}
                                </span>
                            </div>
                        </div>

                        {visibleData.length > 0 ? (
                            visibleData.map((r, i) => (
                                <div key={i} className={styles.row}>
                                    <div className={styles.bank}>
                                        {banksMap[r.bank]?.logo && (
                                            <img
                                                src={banksMap[r.bank]?.logo}
                                                alt={banksMap[r.bank]?.name}
                                                className={styles.flag}
                                            />
                                        )}
                                        {banksMap[r.bank]?.name || r.bank}
                                    </div>

                                    <div
                                        className={clsx(
                                            styles.buy,
                                            r.buy === bestBuyRate && styles.best_buy
                                        )}
                                    >
                                        <div className={styles.buy_mobile}>
                                            {render(blok.buy?.[locale] || blok.buy)}
                                        </div>
                                        <div className={styles.buy_wrap}>
                                            {r.buy === bestBuyRate && (
                                                <span className={styles.crownWrapper}>
                                                    <span className={styles.crown}>
                                                        <img
                                                            src="/img/icons/crown.png"
                                                            alt="Best buy rate"
                                                            className={styles.crown}
                                                        />
                                                    </span>
                                                    <span className={styles.tooltip}>Best buy rate</span>
                                                </span>
                                            )}
                                            <span className={styles.boldnumber}>
                                                {formatNumber(r.buy)}
                                            </span>{" "}
                                            IDR
                                        </div>
                                    </div>

                                    <div
                                        className={clsx(
                                            styles.sell,
                                            r.sell === bestSellRate && styles.best_sell
                                        )}
                                    >
                                        <div className={styles.sell_mobile}>
                                            {render(blok.sell?.[locale] || blok.sell)}
                                        </div>
                                        <div className={styles.sell_wrap}>
                                            {r.sell === bestSellRate && (
                                                <span className={styles.crownWrapper}>
                                                    <img
                                                        src="/img/icons/crown.png"
                                                        alt="Best sell rate"
                                                        className={styles.crown}
                                                    />
                                                    <span className={styles.tooltip}>Best sell rate</span>
                                                </span>
                                            )}
                                            <span className={styles.boldnumber}>
                                                {formatNumber(r.sell)}
                                            </span>{" "}
                                            IDR
                                        </div>
                                    </div>

                                    <div className={styles.wrapdetail}>
                                        <Link
                                            href={banksMap[r.bank]?.url || "#"}
                                            className={styles.detail}
                                        >
                                            {blok.detail}
                                        </Link>
                                    </div>

                                    {r.img && (
                                        <div className={styles.serviceImg}>
                                            <Image
                                                src={r.img}
                                                alt={banksMap[r.bank]?.name || ""}
                                                fill
                                                style={{ objectFit: "cover" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noData}>
                                No data for {selectedCurrency}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SingleCurrencyTable;