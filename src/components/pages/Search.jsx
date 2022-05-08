import { useContext, useRef, useState } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";
import BookCover from "../BookCover";
import AuthorPhoto from "../AuthorPhoto";
import useResize from "../../hooks/useResize";

import { Data } from "../../contexts/Data";
import { API } from "../../contexts/API";

import LoadingIcon from "../../resources/icons/loading.svg";

export default function Search() {
    const { searchedBooks, setSearchedBooks, searchedAuthors, setSearchedAuthors } = useContext(Data);
    const { searchBooks } = useContext(API);

    const containerRef = useRef();
    const [coverHeight, setCoverHeight] = useState(0);

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();

        setCoverHeight((box.height - (3.6 * 3 + 2) * 16) / 3);
    };
    useResize(handleResize, true);

    const [loading, setLoading] = useState(false);
    const bookInputRef = useRef();
    const authorInputRef = useRef();

    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        bookInputRef.current.blur();
        authorInputRef.current.blur();

        setLoading(true);

        const { bookQuery, authorQuery } = document.forms[0];
        const { parsedWorks, parsedAuthors } = await searchBooks(bookQuery.value, authorQuery.value);

        if (parsedWorks) setSearchedBooks(parsedWorks);
        if (parsedAuthors) setSearchedAuthors(parsedAuthors);

        setLoading(false);
    };

    return (
        <div className="Search" ref={containerRef}>
            <div className={cn("results", { visible: searchedAuthors.length || searchedBooks.length })}>
                <p className="section">authors</p>
                <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                    {searchedAuthors.map((authorId, i) => (
                        <AuthorPhoto
                            key={authorId}
                            authorId={authorId}
                            coverHeight={coverHeight}
                            last={i === searchedAuthors.length - 1}
                        />
                    ))}
                </div>

                <p className="section">books</p>
                <div className="container" style={{ height: `${coverHeight + 16}px` }}>
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
                        name="bookQuery"
                        placeholder={"book name"}
                        autocomlete={"new-password"}
                        ref={bookInputRef}
                    />
                    <input
                        className="input neoInput"
                        type="text"
                        name="authorQuery"
                        placeholder={"author name"}
                        autocomlete={"new-password"}
                        ref={authorInputRef}
                    />
                    <button className="submit neoButton" type="submit">
                        {loading ? <SVG className="loadingIcon spin infinite" src={LoadingIcon} /> : "search"}
                    </button>
                </form>
            </div>
        </div>
    );
}
