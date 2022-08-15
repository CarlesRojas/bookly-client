import cn from 'classnames';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Data } from '../../contexts/Data';

const BUTTONS = {
    booksPerYear: 'books per year',
    pagesPerYear: 'pages per year'
};

export default function Stats() {
    const { finishedBooks, books } = useContext(Data);

    // #################################################
    //   GRAPH SWITCH
    // #################################################

    const [selected, setSelected] = useState(BUTTONS.pagesPerYear);

    // #################################################
    //   AGRUPATE BY YEAR
    // #################################################

    const minYear = useRef(0);
    const maxYear = useRef(0);

    const separateBooksByYear = useCallback(() => {
        const result = {};

        finishedBooks.forEach((book) => {
            const { yearFinished, rereads } = book;
            if (!(yearFinished in result)) result[yearFinished] = [];
            result[yearFinished].push({ ...book });

            rereads.forEach(({ year }) => {
                if (!(year in result)) result[year] = [];
                result[year].push({ ...book });
            });
        });

        minYear.current = Number.MAX_VALUE;
        maxYear.current = Number.MIN_VALUE;

        for (const year in result) {
            const y = parseInt(year);

            if (y > maxYear.current) maxYear.current = y;
            if (y < minYear.current) minYear.current = y;
        }

        return result;
    }, [finishedBooks]);

    // #################################################
    //   NUMBERS
    // #################################################

    const booksByYear = useRef({});
    const totalNumBooksFinished = useRef(0);
    const totalPagesRead = useRef(0);
    const averagePagesPerYear = useRef(0);
    const averageBookPerYear = useRef(0);
    const maxBooksPagesPeryear = useRef({ maxBooks: 0, maxPages: 0 });
    const booksPagesPerYear = useRef([]);
    const years = useRef([]);

    useEffect(() => {
        booksByYear.current = separateBooksByYear();

        totalNumBooksFinished.current = finishedBooks.length;
        totalPagesRead.current = finishedBooks.reduce((count, { bookId }) => books.current[bookId].numPages + count, 0);
        totalPagesRead.current += finishedBooks.reduce(
            (count, { bookId, rereads }) => (rereads ? books.current[bookId].numPages * rereads.length + count : count),
            0
        );

        averagePagesPerYear.current =
            Object.values(booksByYear.current)
                .map((yearBooks) => yearBooks.reduce((count, { bookId }) => books.current[bookId].numPages + count, 0))
                .reduce((count, pages) => pages + count, 0) /
            (maxYear.current - minYear.current + 1); // Object.values(booksByYear.current).length;

        averageBookPerYear.current =
            Object.values(booksByYear.current)
                .map((yearBooks) => yearBooks.length)
                .reduce((count, books) => books + count, 0) /
            (maxYear.current - minYear.current + 1); // Object.values(booksByYear.current).length;

        booksPagesPerYear.current = {};
        for (const year in booksByYear.current) {
            if (Object.hasOwnProperty.call(booksByYear.current, year)) {
                const yearBooks = booksByYear.current[year];

                booksPagesPerYear.current[year] = yearBooks.reduce(
                    ({ pageCount, bookCount }, { bookId }) => ({
                        pageCount: books.current[bookId].numPages + pageCount,
                        bookCount: bookCount + 1
                    }),
                    { pageCount: 0, bookCount: 0 }
                );
            }
        }

        maxBooksPagesPeryear.current = { maxBooks: 0, maxPages: 0 };
        Object.values(booksPagesPerYear.current).forEach(({ bookCount, pageCount }) => {
            if (bookCount > maxBooksPagesPeryear.current.maxBooks) maxBooksPagesPeryear.current.maxBooks = bookCount;
            if (pageCount > maxBooksPagesPeryear.current.maxPages) maxBooksPagesPeryear.current.maxPages = pageCount;
        });

        years.current = [];
        for (let i = maxYear.current; i >= minYear.current; i--) years.current.push(i);
    }, [books, finishedBooks, separateBooksByYear]);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Stats">
            <div className="grid">
                <div className="stat neoDiv">
                    <p className="title">total number of books read</p>
                    <p className="value">{totalNumBooksFinished.current}</p>
                </div>

                <div className="stat neoDiv">
                    <p className="title">total number of pages read</p>
                    <p className="value">{parseFloat(totalPagesRead.current.toFixed(2))}</p>
                </div>

                <div className="stat neoDiv">
                    <p className="title">average pages read per year</p>
                    <p className="value">{parseFloat(averagePagesPerYear.current.toFixed(0))}</p>
                </div>

                <div className="stat neoDiv">
                    <p className="title">average books read per year</p>
                    <p className="value">{parseFloat(averageBookPerYear.current.toFixed(2))}</p>
                </div>
            </div>

            {years.current.length > 0 && (
                <div className="graph neoDiv">
                    <div className="graphContent">
                        {years.current.map((year) => {
                            const value =
                                year in booksPagesPerYear.current
                                    ? booksPagesPerYear.current[year][
                                          selected === BUTTONS.pagesPerYear ? 'pageCount' : 'bookCount'
                                      ]
                                    : 0;

                            const maxValue =
                                maxBooksPagesPeryear.current[
                                    selected === BUTTONS.pagesPerYear ? 'maxPages' : 'maxBooks'
                                ];

                            return (
                                <div className="column" key={year}>
                                    <div className="barContainer">
                                        <div
                                            className="bar neoDiv"
                                            style={{
                                                height: `${(value / maxValue) * 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    <p className="year">{year}</p>
                                    <p className="value">{value}</p>
                                    <p className="unit">
                                        {selected === BUTTONS.pagesPerYear ? 'pages' : value !== 1 ? 'books' : 'book'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {years.current.length > 0 && (
                <div className="graphSwitch">
                    <div
                        className={cn('switch', 'neoButton', { active: selected === BUTTONS.pagesPerYear })}
                        onClick={() => setSelected(BUTTONS.pagesPerYear)}
                    >
                        pages per year
                    </div>
                    <div
                        className={cn('switch', 'neoButton', { active: selected === BUTTONS.booksPerYear })}
                        onClick={() => setSelected(BUTTONS.booksPerYear)}
                    >
                        books per year
                    </div>
                </div>
            )}
        </div>
    );
}
