import { useContext } from "react";
import ShowMoreText from "react-show-more-text";
import SVG from "react-inlinesvg";
import cn from "classnames";
import Score from "./Score";

import { Data } from "../contexts/Data";
import { Events } from "../contexts/Events";

import Logo from "../resources/icons/logo.svg";

const ASPECT_RATIO = 1.53;

export default function BookCover({ bookId, coverWidth, last, forceShow, showScore, scoreHeight, MARGIN, REM_PX }) {
    const { books, authors, getBookUserData } = useContext(Data);
    const { emit } = useContext(Events);

    const bookInfo = books.current[bookId];

    const coverStyle = {
        height: `${coverWidth * ASPECT_RATIO - MARGIN * 2 * REM_PX}px`,
        minHeight: `${coverWidth * ASPECT_RATIO - MARGIN * 2 * REM_PX}px`,
        maxHeight: `${coverWidth * ASPECT_RATIO - MARGIN * 2 * REM_PX}px`,
        width: `${coverWidth - MARGIN * REM_PX}px`,
        minWidth: `${coverWidth - MARGIN * REM_PX}px`,
        maxWidth: `${coverWidth - MARGIN * REM_PX}px`,
    };
    const containerStyle = {
        height: `${coverWidth * ASPECT_RATIO + (showScore ? scoreHeight : 0)}px`,
        minHeight: `${coverWidth * ASPECT_RATIO + (showScore ? scoreHeight : 0)}px`,
        maxHeight: `${coverWidth * ASPECT_RATIO + (showScore ? scoreHeight : 0)}px`,
        width: `${coverWidth + (last ? MARGIN * REM_PX : 0)}px`,
        minWidth: `${coverWidth + (last ? MARGIN * REM_PX : 0)}px`,
        maxWidth: `${coverWidth + (last ? MARGIN * REM_PX : 0)}px`,
        padding: `${MARGIN}rem ${last ? MARGIN : 0}rem ${MARGIN}rem ${MARGIN}rem`,
    };

    const { score } = getBookUserData(bookId);

    const authorInfo =
        bookInfo && "authors" in bookInfo && bookInfo.authors.length ? authors.current[bookInfo.authors[0]] : null;

    return forceShow || (bookInfo && "title" in bookInfo && authorInfo && "name" in authorInfo) ? (
        <div className="BookCover" style={containerStyle}>
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
                                width={coverWidth * 0.9}
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
                                width={coverWidth * 0.9}
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
