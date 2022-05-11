import { useContext, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";
import BookCover from "../BookCover";
import AuthorPhoto from "../AuthorPhoto";
import useResize from "../../hooks/useResize";

import { Data } from "../../contexts/Data";
import { API } from "../../contexts/API";

import LoadingIcon from "../../resources/icons/loading.svg";

const PADDING = 0.5;
const TITLE_HEIGHT = 2.5;
const REM_PX = 16;

export default function Search() {
    const { searchedBooks, setSearchedBooks, searchedAuthors, setSearchedAuthors } = useContext(Data);
    const { searchBooks } = useContext(API);

    const containerRef = useRef();
    const [hideResults, setHideResults] = useState(false);
    const [coverHeight, setCoverHeight] = useState(0);

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();

        setCoverHeight((box.height - (TITLE_HEIGHT * 2 + PADDING * 4) * REM_PX) / 3);
    };
    useResize(handleResize, true);

    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        inputRef.current.blur();

        setLoading(true);

        const { query } = document.forms[0];
        const { parsedWorks, parsedAuthors } = await searchBooks(query.value);

        if (parsedWorks) setSearchedBooks(parsedWorks);
        if (parsedAuthors) setSearchedAuthors(parsedAuthors);

        setLoading(false);
    };

    return (
        <div className="Search" ref={containerRef}>
            <div
                className={cn("results", { visible: !hideResults && (searchedAuthors.length || searchedBooks.length) })}
            >
                <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                    authors
                </p>
                <div
                    className="container"
                    style={{ height: `${coverHeight + PADDING * REM_PX * 2}px`, padding: `${PADDING}rem 0` }}
                >
                    {searchedAuthors.map((authorId, i) => (
                        <AuthorPhoto
                            key={authorId}
                            authorId={authorId}
                            coverHeight={coverHeight}
                            last={i === searchedAuthors.length - 1}
                        />
                    ))}
                </div>

                <p className="section" style={{ height: `${TITLE_HEIGHT}rem` }}>
                    books
                </p>
                <div
                    className="container"
                    style={{ height: `${coverHeight + PADDING * REM_PX * 2}px`, padding: `${PADDING}rem 0` }}
                >
                    {searchedBooks.map((bookId, i) => (
                        <BookCover
                            key={bookId}
                            bookId={bookId}
                            coverHeight={coverHeight}
                            last={i === searchedBooks.length - 1}
                        />
                    ))}
                </div>
            </div>

            <div className="inputsContainer">
                <form className="form" onSubmit={handleSubmit} autoComplete="off">
                    <input
                        className="input neoInput"
                        type="text"
                        name="query"
                        placeholder={"book title or author"}
                        autocomlete={"new-password"}
                        ref={inputRef}
                        onFocus={() => setHideResults(true)}
                        onBlur={() => setHideResults(false)}
                    />
                    <button className="submit neoButton" type="submit">
                        {loading ? <SVG className="loadingIcon spin infinite" src={LoadingIcon} /> : "search"}
                    </button>
                </form>
            </div>
        </div>
    );
}
