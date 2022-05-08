import { useContext } from "react";
import ShowMoreText from "react-show-more-text";
import SVG from "react-inlinesvg";
import cn from "classnames";

import { Data } from "../contexts/Data";

import Logo from "../resources/icons/logo.svg";

export default function BookCover({ bookId, coverHeight, last, forceShow }) {
    const { books, authors } = useContext(Data);

    const bookInfo = books.current[bookId];

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
                        <ShowMoreText
                            lines={4}
                            className="titleContent"
                            anchorClass="anchor"
                            expanded={false}
                            width={coverHeight * 0.6}
                            truncatedEndingComponent={"..."}
                        >
                            <p className="title">{bookInfo.title}</p>
                        </ShowMoreText>
                    )}

                    {authorInfo && "name" in authorInfo && (
                        <ShowMoreText
                            lines={2}
                            className="authorContent"
                            anchorClass="anchor"
                            expanded={false}
                            width={coverHeight * 0.6}
                            truncatedEndingComponent={"..."}
                        >
                            <p className="author">{authorInfo.name}</p>
                        </ShowMoreText>
                    )}
                </div>
            )}
        </div>
    ) : null;
}
