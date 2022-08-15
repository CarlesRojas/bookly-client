import { useContext, useRef, useState, useCallback, useEffect } from "react";
import BookCover from "../BookCover";
import useResize from "../../hooks/useResize";
import cn from "classnames";
import SVG from "react-inlinesvg";
import useClickOutsideRef from "../../hooks/useClickOutsideRef";

import { Data } from "../../contexts/Data";

import SortIcon from "../../resources/icons/sort.svg";
import Logo from "../../resources/icons/logo.svg";

const MARGIN = 0.6;
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

export default function NewHome() {
    const { finishedBooks, wantToReadBooks, readingBooks, sort, setSortOption } = useContext(Data);

    // #################################################
    //   COVER WIDTH
    // #################################################

    const containerRef = useRef();
    // const horizontalTiles = useRef(1);
    // const [coverWidth, setCoverWidth] = useState(0);
    const [horizontalTiles, setHorizontalTiles] = useState(0);

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();

        let newCoverWidth = 0;
        let currHorizontalTiles = 1;

        do {
            let newWidth = box.width / currHorizontalTiles;
            if (newWidth > 180) currHorizontalTiles++;
            else newCoverWidth = newWidth;
        } while (newCoverWidth === 0);

        setHorizontalTiles(currHorizontalTiles);
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
    //   RENDER
    // #################################################

    const containerStyle = {
        gridGap: `${MARGIN}rem`,
        gridTemplateColumns: `repeat(${horizontalTiles}, 1fr)`,
        padding: `${MARGIN}rem`,
        width: "100%",
        minWidth: "100%",
        maxWidth: "100%",
    };

    const booksAvailable = finishedBooks.length > 0 || wantToReadBooks.length > 0 || readingBooks.length > 0;

    return (
        <div className={cn("NewHome", { empty: !booksAvailable })} ref={containerRef}>
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

                    <div className="container" style={containerStyle}>
                        {readingBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                // coverWidth={coverWidth}
                                last={i === readingBooks.length - 1}
                                MARGIN={MARGIN}
                                REM_PX={REM_PX}
                                forceShow
                            />
                        ))}
                    </div>

                    <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                        want to read
                    </p>
                    <div className="container" style={containerStyle}>
                        {wantToReadBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                // coverWidth={coverWidth}
                                last={i === wantToReadBooks.length - 1}
                                MARGIN={MARGIN}
                                REM_PX={REM_PX}
                                forceShow
                            />
                        ))}
                    </div>

                    <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                        finished
                    </p>
                    <div className="container" style={containerStyle}>
                        {finishedBooks.map((bookData, i) => (
                            <BookCover
                                key={bookData.bookId}
                                bookId={bookData.bookId}
                                // coverWidth={coverWidth}
                                last={i === finishedBooks.length - 1}
                                MARGIN={MARGIN}
                                REM_PX={REM_PX}
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
