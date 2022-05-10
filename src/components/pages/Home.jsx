import { useContext, useRef, useState } from "react";
import BookCover from "../BookCover";
import useResize from "../../hooks/useResize";

import { Data } from "../../contexts/Data";

export default function Home() {
    const { finishedBooks, wantToReadBooks, readingBooks } = useContext(Data);

    // #################################################
    //   COVER HEIGHT
    // #################################################

    const containerRef = useRef();
    const [coverHeight, setCoverHeight] = useState(0);

    const handleResize = () => {
        const box = containerRef.current.getBoundingClientRect();

        setCoverHeight((box.height - (3.6 * 3 + 2) * 16) / 3);
    };
    useResize(handleResize, true);

    // #################################################
    //   RENDER
    // #################################################

    return (
        <div className="Home" ref={containerRef}>
            <p className="section">reading</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {readingBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookId={bookData.bookId}
                        coverHeight={coverHeight}
                        last={i === readingBooks.length - 1}
                        forceShow
                    />
                ))}
            </div>

            <p className="section">want to read</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {wantToReadBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookId={bookData.bookId}
                        coverHeight={coverHeight}
                        last={i === wantToReadBooks.length - 1}
                        forceShow
                    />
                ))}
            </div>

            <p className="section">finished</p>
            <div className="container" style={{ height: `${coverHeight + 16}px` }}>
                {finishedBooks.map((bookData, i) => (
                    <BookCover
                        key={bookData.bookId}
                        bookId={bookData.bookId}
                        coverHeight={coverHeight}
                        last={i === finishedBooks.length - 1}
                        forceShow
                    />
                ))}
            </div>
        </div>
    );
}
