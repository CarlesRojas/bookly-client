import { useContext, useEffect, useState } from "react";
import Dotdotdot from "react-dotdotdot";
import SVG from "react-inlinesvg";
import cn from "classnames";

import { Data } from "../contexts/Data";
import { API } from "../contexts/API";

import Logo from "../resources/icons/logo.svg";

export default function BookCover({ bookId, coverHeight, last, forceShow }) {
    const { books, authors } = useContext(Data);
    const { getBookInfo } = useContext(API);

    const [bookInfo, setBookInfo] = useState(null);

    useEffect(() => {
        console.log(bookId);
        if (!bookId) return;

        const getBookData = async () => {
            if (!(bookId in books.current)) {
                const response = await getBookInfo(bookId);
                if ("error" in response) return;
            }

            setBookInfo(books.current[bookId]);
        };

        getBookData();
    }, [bookId, books, getBookInfo]);

    const style = {
        height: `${coverHeight}px`,
        minHeight: `${coverHeight}px`,
        maxHeight: `${coverHeight}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    const authorInfo =
        bookInfo && "authors" in bookInfo && bookInfo.authors.length ? authors.current[bookInfo.authors[0]] : null;

    return forceShow || (bookInfo && "title" in bookInfo && authorInfo && "name" in authorInfo) ? (
        <div className={cn("BookCover", "neoDiv", { last })} style={style}>
            {bookInfo && bookInfo.covers && bookInfo.covers.length ? (
                <img src={bookInfo.covers[0]} alt="" className="cover" style={style} />
            ) : (
                <div className="noCoverContainer">
                    <SVG className="icon" src={Logo} />

                    {bookInfo && "title" in bookInfo && (
                        <Dotdotdot clamp={4}>
                            <p className="title">{bookInfo.title}</p>
                        </Dotdotdot>
                    )}

                    {authorInfo && "name" in authorInfo && (
                        <Dotdotdot clamp={2}>
                            <p className="author">{authorInfo.name}</p>
                        </Dotdotdot>
                    )}
                </div>
            )}
        </div>
    ) : null;
}
