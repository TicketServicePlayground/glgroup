"use client";

import React, { useState, useMemo, Fragment, useRef} from "react";
import styles from "./BankExchangeList.module.scss";
import clsx from "clsx";
import { render } from "storyblok-rich-text-react-renderer";
import {storyblokEditable} from "@/lib/storyblokCompat";
import Link from "next/link";

function formatNumber(value) {
    if (typeof value !== "number" || isNaN(value)) return "-";
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function processRates(initialRates, bankid, currenciesMap, currenciesList = []) {
    if (!Array.isArray(initialRates)) return [];

    // 🔹 Фільтруємо лише дані для потрібного банку
    const bankRates = initialRates.filter((r) => r.bank === bankid);

    // 🔹 Групуємо по валюті
    const grouped = {};
    for (const r of bankRates) {
        if (!grouped[r.currency]) grouped[r.currency] = [];
        grouped[r.currency].push(r);
    }

    // 🔹 Сортуємо по даті (новіші зверху)
    for (const currency in grouped) {
        grouped[currency].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // 🔹 Беремо останній і попередній записи
    const processed = Object.entries(grouped).map(([currency, list]) => {
        const latest = list[0];
        const previous = list[1];

        const diffBuy = previous ? latest.buy - previous.buy : null;
        const diffSell = previous ? latest.sell - previous.sell : null;

        return {
            currency,
            name: currenciesMap[currency] || currency,
            buy: latest.buy,
            sell: latest.sell,
            diffBuy,
            diffSell,
        };
    });

    // 🔹 Сортуємо згідно з currenciesList
    processed.sort((a, b) => {
        const indexA = currenciesList.indexOf(a.currency);
        const indexB = currenciesList.indexOf(b.currency);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return processed;
}


const BankExchangeList = ({ blok, initialRates = [], currenciesMap = {}, currenciesList = {}, locale }) => {
    const bankid = blok.bankid;
    const processedRates = useMemo(
        () => processRates(initialRates, bankid, currenciesMap, currenciesList),
        [initialRates, bankid, currenciesMap, currenciesList]
    );

    const [visibleCount, setVisibleCount] = useState(5);
    const visibleData = processedRates.slice(0, visibleCount);
    const isExpanded = visibleCount >= processedRates.length;
    const tableRef = useRef(null);
    const formatDiff = (diff) => {
        if (diff === null || diff === 0) return "";
        const sign = diff > 0 ? "+" : "";
        return ` ${sign}${diff.toFixed(2)}`;
    };

    return (
        <section className={clsx(styles.BankExchangeList)} {...storyblokEditable(blok)}>
            <div className={clsx("container", styles.content)}>
                <div className={styles.contentBlock}>
                    <div className={styles.tableWrapper} ref={tableRef}>
                        <div className={styles.table}>
                            <div className={clsx(styles.row, styles.header)}>
                                <div>{render(blok.currency?.[locale] || blok.currency)}</div>
                                <div>{render(blok.buy?.[locale] || blok.buy)}</div>
                                <div>{render(blok.sell?.[locale] || blok.sell)}</div>
                            </div>

                            {visibleData.map((item, i) => (
                                <Fragment key={i}>
                                    <div className={styles.row}>
                                        <Link href={`/${locale}/currency/${item.currency.toLowerCase()}`} passHref className={styles.currency}>
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
                                                {formatNumber(item.buy)} IDR
                                                <span className={clsx(styles.diff, {
                                                    [styles.positive]: item.diffBuy > 0,
                                                    [styles.negative]: item.diffBuy < 0,
                                                })}>{formatDiff(item.diffBuy)}</span>
                                            </div>
                                        </div>
                                        <div className={styles.sell}>
                                            <div className={styles.sell_mobile}>
                                                {render(blok.sell?.[locale] || blok.sell)}
                                            </div>
                                            <div className={styles.sell_wrap}>
                                                {formatNumber(item.sell)} IDR
                                                <span className={clsx(styles.diff, {
                                                    [styles.positive]: item.diffSell > 0,
                                                    [styles.negative]: item.diffSell < 0,
                                                })}>{formatDiff(item.diffSell)}</span>
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
                                onClick={() => {
                                    if (isExpanded) {
                                        setVisibleCount(5);
                                        setTimeout(() => {
                                            tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                                        }, 0);
                                    } else {
                                        setVisibleCount(processedRates.length);
                                    }
                                }}
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

export default BankExchangeList;
