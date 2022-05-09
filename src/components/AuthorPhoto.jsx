import { useContext } from "react";
import ShowMoreText from "react-show-more-text";
import SVG from "react-inlinesvg";
import cn from "classnames";

import { Data } from "../contexts/Data";
import { Events } from "../contexts/Events";

import AuthorIcon from "../resources/icons/author.svg";

export default function AuthorPhoto({ authorId, coverHeight, last }) {
    const { authors } = useContext(Data);
    const { emit } = useContext(Events);

    const authorInfo = authors.current[authorId];

    const style = {
        height: `${coverHeight}px`,
        minHeight: `${coverHeight}px`,
        maxHeight: `${coverHeight}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    const photoStyle = {
        height: `${coverHeight * 0.75}px`,
        minHeight: `${coverHeight * 0.75}px`,
        maxHeight: `${coverHeight * 0.75}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    return authorInfo && "name" in authorInfo ? (
        <div
            className={cn("AuthorPhoto", "neoDiv", { last })}
            style={style}
            onClick={() => emit("onNewPage", { pageId: authorId, type: "author" })}
        >
            <div className="coverContainer">
                {authorInfo && authorInfo.photos && authorInfo.photos.length ? (
                    <img src={authorInfo.photos[0]} alt="" className="photo neoDiv" style={photoStyle} />
                ) : (
                    <SVG className="icon neoDiv" src={AuthorIcon} style={photoStyle} />
                )}

                <ShowMoreText
                    lines={2}
                    className="content"
                    anchorClass="anchor"
                    expanded={false}
                    width={coverHeight * 0.6}
                    truncatedEndingComponent={"..."}
                >
                    <p className="author">{authorInfo.name}</p>
                </ShowMoreText>
            </div>
        </div>
    ) : null;
}
