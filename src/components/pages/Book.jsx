import { useContext } from "react";
import SVG from "react-inlinesvg";
import MarkdownView from "react-showdown";

import { Data } from "../../contexts/Data";
import { Events } from "../../contexts/Events";

import Logo from "../../resources/icons/logo.svg";
import Score from "../Score";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function Book({ id }) {
    const { books, authors, getBookStatus } = useContext(Data);
    const { emit } = useContext(Events);

    // #################################################
    //   HANDLERS
    // #################################################

    const handleAuthorClicked = (authorId) => {
        emit("onNewPage", { pageId: authorId, type: "author" });
    };
    //
    // #################################################
    //   BOOK DATA
    // #################################################

    if (!(id in books.current)) return null;

    const {
        // amazonId,
        authors: bookAuthors,
        covers,
        description,
        // goodreadsId,
        // libraryThingId,
        // links,
        numPages,
        publishDate,
        title,
    } = books.current[id];

    const authorInfo = bookAuthors.map((id) => (id in authors.current ? authors.current[id] : null));

    const { monthFinished, score, status, yearFinished } = getBookStatus(id);

    const correctStatus = status || "addToLibrary";
    const correctDescription =
        typeof description === "string" ? description : "value" in description ? description.value : null;

    // #################################################
    //   RENDER
    // #################################################

    console.log(correctDescription);

    return (
        <div className="Book">
            <div className="mainContent neoDiv">
                {covers && covers.length ? (
                    <img src={covers[0]} alt="" className="cover neoDiv" />
                ) : (
                    <SVG className="noCover neoDiv" src={Logo} />
                )}

                {publishDate && (
                    <div className="details">
                        <span>{`published on ${publishDate}`}</span>
                        <span>{`${numPages} pages`}</span>
                    </div>
                )}

                <p className="title">{title || "untitled"}</p>

                {authorInfo.length ? (
                    <p className="author" onClick={() => handleAuthorClicked(authorInfo[0].authorId)}>
                        {authorInfo[0].name}
                    </p>
                ) : (
                    <p className="author">unknown author</p>
                )}

                {correctStatus && <div className="status neoButton">{correctStatus}</div>}

                {status === "finished" && <Score score={score} bookId={id} />}

                {status === "finished" && yearFinished && (
                    <div className="finishedOn neoButton">
                        <p className="label">finished on</p>
                        <p className="date">{`${
                            monthFinished >= 0 && monthFinished <= 11 ? MONTHS[monthFinished] : ""
                        } ${yearFinished}`}</p>
                    </div>
                )}

                {correctDescription && (
                    <MarkdownView
                        className="description"
                        markdown={correctDescription}
                        options={{ omitExtraWLInCodeBlocks: true, tables: true, emoji: true }}
                    />
                )}
            </div>
        </div>
    );
}
