import { useContext, useEffect, useState, useRef } from "react";
import SVG from "react-inlinesvg";
import ShowMoreText from "react-show-more-text";
import MarkdownView from "react-showdown";
import useResize from "../../hooks/useResize";
import BookCover from "../BookCover";
import cn from "classnames";

import { Data } from "../../contexts/Data";
import { API } from "../../contexts/API";

import AuthorIcon from "../../resources/icons/author.svg";
import LinkIcon from "../../resources/icons/link.svg";
import LoadingIcon from "../../resources/icons/loading.svg";

export default function Author({ id }) {
    const { authors, books } = useContext(Data);
    const { getAuthorWorks } = useContext(API);

    // #################################################
    //   COVER HEIGHT
    // #################################################

    const containerRef = useRef();
    const [coverHeight, setCoverHeight] = useState(0);

    // #################################################
    //   LOAD WORKS
    // #################################################

    const [, setWorksLoaded] = useState(false);

    useEffect(() => {
        const getWorks = async () => {
            await getAuthorWorks(id);

            setWorksLoaded(true);
        };

        getWorks();
    }, [id, getAuthorWorks]);

    // #################################################
    //   LINK CONTAINER
    // #################################################

    const linksContainerRef = useRef();
    const [linksContainerBox, setLinksContainerBox] = useState({ width: 0 });

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();
        setCoverHeight((box.height - (3.6 * 3 + 2) * 16) / 3);

        const linksBox = linksContainerRef.current ? linksContainerRef.current.getBoundingClientRect() : { width: 0 };
        setLinksContainerBox(linksBox);
    };
    useResize(handleResize, true);

    // #################################################
    //   BOOK DATA
    // #################################################

    if (!(id in authors.current)) return null;

    const { links, name, birth_date, bio, works, photos } = authors.current[id];

    const correctBio = typeof bio === "string" ? bio : bio && "value" in bio ? bio.value : null;

    let authorLinks = [];
    if (links)
        for (const linkInfo of links) authorLinks.push({ title: linkInfo.title, url: linkInfo.url, icon: LinkIcon });
    authorLinks = authorLinks.slice(0, 4);

    const authorWorks = works ? [...works] : [];
    authorWorks.filter((id) => id in books.current);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Author" ref={containerRef}>
            <div className="mainContent neoDiv">
                {photos && photos.length ? (
                    <img src={photos[0]} alt="" className="photo neoDiv" />
                ) : (
                    <div className="noPhoto neoDiv">
                        <SVG className="icon" src={AuthorIcon} />
                    </div>
                )}

                {birth_date && <div className="details">{birth_date && <span>{`born on ${birth_date}`}</span>}</div>}

                <p className="title name">{name || "untitled"}</p>

                {correctBio && (
                    <MarkdownView
                        className="description"
                        id="description"
                        markdown={correctBio}
                        options={{ omitExtraWLInCodeBlocks: true, tables: true, emoji: true }}
                    />
                )}

                <div
                    className={cn("container", { center: !authorWorks || !authorWorks.length })}
                    style={{ height: `${coverHeight + 16}px`, minHeight: `${coverHeight + 16}px` }}
                >
                    {(!authorWorks || !authorWorks.length) && (
                        <>
                            <SVG className="loading spin infinite" src={LoadingIcon} />
                            <p className="loadingWorks">loading works...</p>
                        </>
                    )}

                    {authorWorks &&
                        authorWorks.map((bookId, i) => (
                            <BookCover
                                key={bookId}
                                bookId={bookId}
                                coverHeight={coverHeight}
                                last={i === authorWorks.length - 1}
                                forceShow
                            />
                        ))}
                </div>

                <div className="links">
                    {authorLinks.map(({ title, url, icon }, i) => (
                        <div className="link neoDiv" onClick={() => window.open(url, "_blank")} key={i}>
                            <div className="linkInfoContainer" ref={linksContainerRef}>
                                <SVG className="linkIcon" src={icon} />
                                <ShowMoreText
                                    lines={1}
                                    className="linkName"
                                    anchorClass="anchor"
                                    expanded={false}
                                    width={linksContainerBox.width}
                                    truncatedEndingComponent={"..."}
                                >
                                    <p>{title}</p>
                                </ShowMoreText>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
