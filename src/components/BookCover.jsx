import { useContext, useEffect, useState } from "react";
import cn from "classnames";

import { Data } from "../contexts/Data";
import { API } from "../contexts/API";

export default function BookCover({ bookData, coverHeight, last }) {
    const { books } = useContext(Data);
    const { getBookInfo } = useContext(API);

    const { bookId } = bookData;

    const [bookInfo, setBookInfo] = useState(null);

    useEffect(() => {
        const getBookData = async () => {
            if (!Object.keys(books.current).includes(bookId)) {
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

    return (
        <div className={cn("BookCover", "newDiv", { last })} style={style}>
            {bookInfo && bookInfo.covers && bookInfo.covers.length ? (
                <img src={bookInfo.covers[0]} alt="" className="cover" style={style} />
            ) : null}
        </div>
    );
}
