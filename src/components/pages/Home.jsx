import { useContext, useRef, useEffect, useState } from "react";
import BookCover from "../BookCover";

import { Data } from "../../contexts/Data";

export default function Home() {
    const { finishedBooks, wantToReadBooks, readingBooks } = useContext(Data);

    const homeRef = useRef();
    const [coverHeight, setCoverHeight] = useState(0);

    const onResize = () => {
        const box = homeRef.current.getBoundingClientRect();

        setCoverHeight((box.height - (3.6 * 3 + 2) * 16) / 3);
    };

    useEffect(() => {
        onResize();

        return () => {};
    }, []);

    return (
        <div className="Home" ref={homeRef}>
            <p className="section">reading</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {readingBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookData={bookData}
                        coverHeight={coverHeight}
                        last={i === readingBooks.length - 1}
                    />
                ))}
            </div>

            <p className="section">want to read</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {wantToReadBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookData={bookData}
                        coverHeight={coverHeight}
                        last={i === wantToReadBooks.length - 1}
                    />
                ))}
            </div>

            <p className="section">finished</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {finishedBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookData={bookData}
                        coverHeight={coverHeight}
                        last={i === finishedBooks.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
