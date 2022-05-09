import { useContext, useEffect } from "react";
import SVG from "react-inlinesvg";
import MarkdownView from "react-showdown";

import { Data } from "../../contexts/Data";
import { Events } from "../../contexts/Events";

import Logo from "../../resources/icons/logo.svg";
import AmazonIcon from "../../resources/icons/amazon.svg";
import GoodreadsIcon from "../../resources/icons/goodreads.svg";
import LibrarythingIcon from "../../resources/icons/librarything.svg";
import LinkIcon from "../../resources/icons/link.svg";
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

    // #################################################
    //   NEW PAGE FOR LINKS
    // #################################################

    useEffect(() => {
        document.querySelectorAll("div #description a").forEach((item) => (item.target = "_blank"));
    });

    // #################################################
    //   BOOK DATA
    // #################################################

    if (!(id in books.current)) return null;

    const {
        amazonId,
        authors: bookAuthors,
        covers,
        description,
        goodreadsId,
        libraryThingId,
        links,
        numPages,
        publishDate,
        title,
    } = books.current[id];

    const authorInfo = bookAuthors.map((id) => (id in authors.current ? authors.current[id] : null));

    const { monthFinished, score, status, yearFinished } = getBookStatus(id);

    const correctStatus = status || "addToLibrary";
    const correctDescription =
        typeof description === "string" ? description : "value" in description ? description.value : null;

    let bookLinks = [];
    if (amazonId)
        bookLinks.push({
            title: "amazon",
            url: `https://www.amazon.com/exec/obidos/ASIN/${amazonId}`,
            icon: AmazonIcon,
        });
    if (goodreadsId)
        bookLinks.push({
            title: "goodreads",
            url: `https://www.goodreads.com/book/show/${goodreadsId}`,
            icon: GoodreadsIcon,
        });
    if (libraryThingId)
        bookLinks.push({
            title: "librarything",
            url: `https://www.librarything.com/work/${libraryThingId}`,
            icon: LibrarythingIcon,
        });
    if (links)
        for (const linkInfo of links) bookLinks.push({ title: linkInfo.title, url: linkInfo.url, icon: LinkIcon });
    bookLinks = bookLinks.slice(0, 4);

    // #################################################
    //   RENDER
    // #################################################

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
                        id="description"
                        markdown={correctDescription}
                        options={{ omitExtraWLInCodeBlocks: true, tables: true, emoji: true }}
                    />
                )}

                <div className="links">
                    {bookLinks.map(({ title, url, icon }, i) => (
                        <div className="link neoDiv" onClick={() => window.open(url, "_blank")} key={i}>
                            <div className="linkInfoContainer">
                                <SVG className="linkIcon" src={icon} />
                                <p className="linkName">{title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
