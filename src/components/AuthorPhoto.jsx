import { useContext, useEffect, useState } from "react";
import Dotdotdot from "react-dotdotdot";
import SVG from "react-inlinesvg";
import cn from "classnames";

import { Data } from "../contexts/Data";
import { API } from "../contexts/API";

import Logo from "../resources/icons/logo.svg";

export default function AuthorPhoto({ authorId, coverHeight, last }) {
    const { books, authors } = useContext(Data);
    const { getAuthorInfo } = useContext(API);

    const [authorInfo, setAuthorInfo] = useState(null);

    useEffect(() => {
        if (!authorId) return;

        const getAuthorData = async () => {
            if (!Object.keys(authors.current).includes(authorId)) {
                const response = await getAuthorInfo(authorId);
                if ("error" in response) {
                    console.log(response.error);
                    return;
                }
            }

            setAuthorInfo(authors.current[authorId]);
        };

        getAuthorData();
    }, [authorId, authors, getAuthorInfo]);

    const style = {
        height: `${coverHeight}px`,
        minHeight: `${coverHeight}px`,
        maxHeight: `${coverHeight}px`,
        width: `${coverHeight * 0.65}px`,
        minWidth: `${coverHeight * 0.65}px`,
        maxWidth: `${coverHeight * 0.65}px`,
    };

    console.log(authorInfo);

    return <div className="AuthorPhoto"></div>;

    // return  (bookInfo && "title" in bookInfo && authorInfo && "name" in authorInfo) ? (
    //     <div className={cn("AuthorPhoto", "neoDiv", { last })} style={style}>
    //         {bookInfo && bookInfo.covers && bookInfo.covers.length ? (
    //             <img src={bookInfo.covers[0]} alt="" className="cover" style={style} />
    //         ) : (
    //             <div className="noCoverContainer">
    //                 <SVG className="icon" src={Logo} />

    //                 {bookInfo && "title" in bookInfo && (
    //                     <Dotdotdot clamp={4}>
    //                         <p className="title">{bookInfo.title}</p>
    //                     </Dotdotdot>
    //                 )}

    //                 {authorInfo && "name" in authorInfo && (
    //                     <Dotdotdot clamp={2}>
    //                         <p className="author">{authorInfo.name}</p>
    //                     </Dotdotdot>
    //                 )}
    //             </div>
    //         )}
    //     </div>
    // ) : null;
}
