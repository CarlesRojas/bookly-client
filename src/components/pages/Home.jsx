import { useContext, useRef, useState, useCallback, useEffect } from "react";
import BookCover from "../BookCover";
import useResize from "../../hooks/useResize";
import cn from "classnames";
import SVG from "react-inlinesvg";
import useClickOutsideRef from "../../hooks/useClickOutsideRef";

import { Data } from "../../contexts/Data";

import SortIcon from "../../resources/icons/sort.svg";
import Logo from "../../resources/icons/logo.svg";

const PADDING = 0.5;
const TITLE_HEIGHT = 2.5;
const REM_PX = 16;
const SCORE_HEIGHT = 2;

const SORTS = {
    title: "title",
    author: "author",
    rating: "rating",
};

const SORT_OPTIONS = {
    title: {
        author: "author",
        rating: "rating",
    },
    author: {
        title: "title",
        rating: "rating",
    },
    rating: {
        title: "title",
        author: "author",
    },
};

export default function Home() {
    const { finishedBooks, wantToReadBooks, readingBooks, sort, setSortOption } = useContext(Data);

    // #################################################
    //   COVER HEIGHT
    // #################################################

    const containerRef = useRef();
    const [coverHeight, setCoverHeight] = useState(0);

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();

        setCoverHeight((box.height - (TITLE_HEIGHT * 3 + PADDING * 6 + SCORE_HEIGHT) * REM_PX) / 3);
    };
    useResize(handleResize, true);

    // #################################################
    //   EXPAND
    // #################################################

    const [expanded, setExpanded] = useState(false);

    const handleButtonClicked = () => {
        if (expanded) return;

        setExpanded(true);
    };

    const handleOptionClicked = (option) => {
        if (!expanded) return;

        setSortOption(option);
        setExpanded(false);
    };

    // #################################################
    //   CLICK OUTSIDE
    // #################################################

    const handleClickOutside = useCallback(() => {
        setExpanded(false);
    }, []);

    const sortRef = useRef();
    useClickOutsideRef(sortRef, handleClickOutside);

    // #################################################
    //   SCROLL HORIZONTALLY
    // #################################################

    const readingContainerRef = useRef();
    const wantToReadContainerRef = useRef();
    const finishedContainerRef = useRef();

    const scrollReading = (event) => {
        event.preventDefault();
        readingContainerRef.current.scrollLeft += event.deltaY;
    };

    const scrollWantToRead = (event) => {
        event.preventDefault();
        wantToReadContainerRef.current.scrollLeft += event.deltaY;
    };

    const scrollFinished = (event) => {
        event.preventDefault();
        finishedContainerRef.current.scrollLeft += event.deltaY;
    };

    useEffect(() => {
        let readingContainerRefAux = readingContainerRef.current;
        let wantToReadContainerRefAux = wantToReadContainerRef.current;
        let finishedContainerRefAux = finishedContainerRef.current;

        readingContainerRefAux.addEventListener("wheel", scrollReading, { passive: false });
        wantToReadContainerRefAux.addEventListener("wheel", scrollWantToRead, { passive: false });
        finishedContainerRefAux.addEventListener("wheel", scrollFinished, { passive: false });

        return () => {
            readingContainerRefAux.removeEventListener("wheel", scrollReading, { passive: false });
            wantToReadContainerRefAux.removeEventListener("wheel", scrollWantToRead, { passive: false });
            finishedContainerRefAux.removeEventListener("wheel", scrollFinished, { passive: false });
        };
    }, []);

    // #################################################
    //   RENDER
    // #################################################

    const booksAvailable = finishedBooks.length > 0 || wantToReadBooks.length > 0 || readingBooks.length > 0;

    return (
        <div className={cn("Home", { empty: !booksAvailable })} ref={containerRef}>
            {booksAvailable && (
                <>
                    <div className="topSection" style={{ height: `${TITLE_HEIGHT}rem` }}>
                        <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                            reading
                        </p>

                        <div
                            className={cn("sortPopup", "neoPopup", { expanded })}
                            onClick={handleButtonClicked}
                            ref={sortRef}
                        >
                            {Object.keys(SORT_OPTIONS[sort]).map((elem) => (
                                <p
                                    className={cn("newSortOption", { visible: expanded })}
                                    onClick={() => handleOptionClicked(elem)}
                                    key={elem}
                                >
                                    {SORT_OPTIONS[sort][elem]}
                                </p>
                            ))}

                            <p className="sortOption" onClick={handleClickOutside}>
                                {SORTS[sort]}
                            </p>

                            <SVG className="sortIcon" src={SortIcon} />
                        </div>
                    </div>

                    <div
                        className="container"
                        ref={readingContainerRef}
                        style={{ height: `${coverHeight + PADDING * REM_PX * 2}px`, padding: `${PADDING}rem 0` }}
                    >
                        {readingBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                coverHeight={coverHeight}
                                last={i === readingBooks.length - 1}
                                forceShow
                            />
                        ))}
                    </div>

                    <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                        want to read
                    </p>
                    <div
                        className="container"
                        ref={wantToReadContainerRef}
                        style={{ height: `${coverHeight + PADDING * REM_PX * 2}px`, padding: `${PADDING}rem 0` }}
                    >
                        {wantToReadBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                coverHeight={coverHeight}
                                last={i === wantToReadBooks.length - 1}
                                forceShow
                            />
                        ))}
                    </div>

                    <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                        finished
                    </p>
                    <div
                        className="container"
                        ref={finishedContainerRef}
                        style={{
                            height: `${coverHeight + PADDING * REM_PX * 2 + SCORE_HEIGHT * REM_PX}px`,
                            padding: `${PADDING}rem 0`,
                        }}
                    >
                        {finishedBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                coverHeight={coverHeight}
                                last={i === finishedBooks.length - 1}
                                forceShow
                                showScore
                                scoreHeight={SCORE_HEIGHT * REM_PX}
                            />
                        ))}
                    </div>
                </>
            )}

            {!booksAvailable && (
                <div className="welcome neoDiv">
                    <SVG className="icon" src={Logo} />
                    <p className="title">welcome to bookly</p>
                    <p className="text">start by searching for books and adding them to your library</p>
                </div>
            )}
        </div>
    );
}
