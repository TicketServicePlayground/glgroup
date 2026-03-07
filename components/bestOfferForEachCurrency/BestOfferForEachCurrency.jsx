"use client";

import React, { useState, useMemo, Fragment, useRef } from "react";
import styles from "./bestOfferForEachCurrency.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Link from "next/link";

function formatNumber(value) {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function processRates(initialRates, currenciesMap) {
    if (!Array.isArray(initialRates)) return [];

    // --- Беремо останній запис для кожного банку по кожній валюті ---
    const latestByBank = {};
    for (const row of initialRates) {
        if (!row.buy || !row.sell) continue;
        const key = `${row.bank}_${row.currency}`;
        if (!latestByBank[key]) latestByBank[key] = row;
    }

    // --- Групуємо за валютою ---
    const grouped = {};
    Object.values(latestByBank).forEach((row) => {
        if (!grouped[row.currency]) grouped[row.currency] = [];
        grouped[row.currency].push(row);
    });

    // --- Визначаємо кращий курс купівлі/продажу ---
    const processed = Object.entries(grouped)
        .map(([currency, rates]) => {
            const validRates = rates.filter((r) => r.buy > 0 && r.sell > 0);
            if (!validRates.length) return null;

            const bestBuy = validRates.reduce(
                (max, r) => (r.buy > max.buy ? r : max),
                validRates[0]
            );
            const bestSell = validRates.reduce(
                (min, r) => (r.sell < min.sell ? r : min),
                validRates[0]
            );

            return {
                currency,
                name: currenciesMap[currency] || currency,
                best_buy: { rate: bestBuy.buy, bank: bestBuy.bank },
                best_sell: { rate: bestSell.sell, bank: bestSell.bank },
            };
        })
        .filter(Boolean);

    // --- Сортування за порядком currenciesMap ---
    const currencyOrder = Object.values(currenciesMap);
    processed.sort((a, b) => {
        const indexA = currencyOrder.indexOf(a.name);
        const indexB = currencyOrder.indexOf(b.name);
        return indexA - indexB;
    });

    return processed;
}

const BestOfferForEachCurrency = ({
                                      blok,
                                      initialRates = [],
                                      currenciesMap = {},
                                      banksMap = {},
                                      locale,
                                  }) => {
    const processedRates = useMemo(
        () => processRates(initialRates, currenciesMap),
        [initialRates, currenciesMap]
    );

    const [visibleCount, setVisibleCount] = useState(5);
    const isExpanded = visibleCount >= processedRates.length;

    const tableRef = useRef(null);

    const handleToggle = () => {
        if (isExpanded) {
            setVisibleCount(5);

            setTimeout(() => {
                tableRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 0);
        } else {
            setVisibleCount(processedRates.length);
        }
    };

    const visibleData = processedRates.slice(0, visibleCount);

    return (
        <section
            className={clsx(styles.bestOfferForEachCurrency)}
            {...storyblokEditable(blok)}
        >
            <div className={clsx("container", styles.content)}>
                <div className={styles.mobiletext}>{blok.mobiletext}</div>

                <div className={styles.contentBlock}>
                    <div className={styles.tableWrapper} ref={tableRef}>
                        <div className={styles.table}>
                            <div className={clsx(styles.row, styles.header)}>
                                <div>{render(blok.currency?.[locale] || blok.currency)}</div>
                                <div>{render(blok.bestbuy?.[locale] || blok.bestbuy)}</div>
                                <div>{render(blok.bestsell?.[locale] || blok.bestsell)}</div>
                            </div>

                            {visibleData.map((item, i) => (
                                <Fragment key={i}>
                                    <div className={styles.row}>
                                        <Link
                                            href={`/${locale}/currency/${item.currency.toLowerCase()}`}
                                            className={styles.currency}
                                        >
                                            <img
                                                src={`/img/flags/twemoji_flag-${item.currency}.svg`}
                                                alt={item.currency}
                                                className={styles.flag}
                                            />
                                            <span className={styles.namedt}>{item.name}</span>
                                        </Link>

                                        <div className={styles.buy}>
                                            <div className={styles.buy_mobile}>
                                                {render(blok.buy?.[locale] || blok.buy)}
                                            </div>
                                            <div className={styles.buy_wrap}>
                                                <span>{formatNumber(item.best_buy?.rate)} IDR</span>
                                                <span className={styles.bank}>
                                                    <Link
                                                        href={banksMap[item.best_buy?.bank]?.url || "#"}
                                                    >
                                                        <img
                                                            src={banksMap[item.best_buy?.bank]?.logo}
                                                            alt={item.best_buy?.bank}
                                                            title={banksMap[item.best_buy?.bank]?.name}
                                                            className={styles.flag}
                                                        />
                                                    </Link>
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.sell}>
                                            <div className={styles.sell_mobile}>
                                                {render(blok.sell?.[locale] || blok.sell)}
                                            </div>
                                            <div className={styles.sell_wrap}>
                                                <span>{formatNumber(item.best_sell?.rate)} IDR</span>
                                                <span className={styles.bank}>
                                                    <Link
                                                        href={banksMap[item.best_sell?.bank]?.url || "#"}
                                                    >
                                                        <img
                                                            src={banksMap[item.best_sell?.bank]?.logo}
                                                            alt={item.best_sell?.bank}
                                                            title={banksMap[item.best_sell?.bank]?.name}
                                                            className={styles.flag}
                                                        />
                                                    </Link>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Fragment>
                            ))}
                        </div>
                    </div>

                    {processedRates.length > 5 && (
                        <div className={styles.buttonWrapper}>
                            <button
                                className={styles.showMoreBtn}
                                onClick={handleToggle}
                            >
                                {render(
                                    blok[isExpanded ? "showless" : "showmore"]?.[locale] ||
                                    blok[isExpanded ? "showless" : "showmore"]
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BestOfferForEachCurrency;
