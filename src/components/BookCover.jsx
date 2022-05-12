import { useContext } from "react";
import ShowMoreText from "react-show-more-text";
import SVG from "react-inlinesvg";
import cn from "classnames";
import Score from "./Score";

import { Data } from "../contexts/Data";
import { Events } from "../contexts/Events";

import Logo from "../resources/icons/logo.svg";

export default function BookCover({ bookId, coverHeight, last, forceShow, showScore, scoreHeight }) {
    const { books, authors, getBookUserData } = useContext(Data);
    const { emit } = useContext(Events);

    const bookInfo = books.current[bookId];

    const coverStyle = {
        height: `${coverHeight}px`,
        minHeight: `${coverHeight}px`,
        maxHeight: `${coverHeight}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    const containerStyle = {
        height: `${coverHeight + (showScore ? scoreHeight : 0)}px`,
        minHeight: `${coverHeight + (showScore ? scoreHeight : 0)}px`,
        maxHeight: `${coverHeight + (showScore ? scoreHeight : 0)}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    const { score } = getBookUserData(bookId);

    const authorInfo =
        bookInfo && "authors" in bookInfo && bookInfo.authors.length ? authors.current[bookInfo.authors[0]] : null;

    return forceShow || (bookInfo && "title" in bookInfo && authorInfo && "name" in authorInfo) ? (
        <div className={cn("BookCover", { last })} style={containerStyle}>
            <div
                className="imageContainer neoDiv"
                style={coverStyle}
                onClick={() => emit("onNewPage", { pageId: bookId, type: "book" })}
            >
                {bookInfo && bookInfo.covers && bookInfo.covers.length ? (
                    <img src={bookInfo.covers[0]} alt="" className="cover" style={coverStyle} />
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
            {showScore && <Score score={score} bookId={bookId} height={scoreHeight} />}
        </div>
    ) : null;
}
