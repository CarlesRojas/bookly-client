import { createContext, useRef, useState } from "react";

const APP_NAME = "bookly";

export const Data = createContext();
const DataProvider = (props) => {
    // #################################################
    //   USER INFO
    // #################################################

    const token = useRef(null);
    const user = useRef(null);

    // #################################################
    //   BOOK AND AUTHOR INFO
    // #################################################

    const books = useRef({});
    const authors = useRef({});

    // #################################################
    //   USER BOOKS
    // #################################################

    const setUserBooks = (userBooks) => {
        const finished = [];
        const wantToRead = [];
        const reading = [];

        userBooks.forEach(({ userId, bookId, status, score, monthFinished, yearFinished }) => {
            if (status === "finished") finished.push({ userId, bookId, status, score, monthFinished, yearFinished });
            else if (status === "wantToRead")
                wantToRead.push({ userId, bookId, status, score, monthFinished, yearFinished });
            else if (status === "reading") reading.push({ userId, bookId, status, score, monthFinished, yearFinished });
        });

        setFinishedBooks(finished);
        setWantToReadBooks(wantToRead);
        setReadingBooks(reading);
    };

    // Call only when the api to change the status has returned without erros
    const changeUserBookStatus = (bookId, oldStatus, newStatus, newBookData) => {
        const finished = [...finishedBooks];
        const wantToRead = [...wantToReadBooks];
        const reading = [...readingBooks];

        let currArray = oldStatus === "finished" ? finished : oldStatus === "wantToRead" ? wantToRead : reading;
        let index = currArray.findIndex(({ bookId: id }) => id === bookId);
        currArray.splice(index, 1);
        console.log(index);

        if (newStatus !== "remove") {
            let newArray = newStatus === "finished" ? finished : newStatus === "wantToRead" ? wantToRead : reading;
            newArray.unshift({ ...newBookData });
        }

        setFinishedBooks(finished);
        setWantToReadBooks(wantToRead);
        setReadingBooks(reading);
    };

    // Call only when the api to change the score has returned without erros
    const changeUserBookScore = (bookId, updatedBookInfo) => {
        for (const i in finishedBooks) {
            const { bookId: id } = finishedBooks[i];

            if (bookId === id) {
                setFinishedBooks((prev) => {
                    const copy = [...prev];
                    copy[i] = { ...updatedBookInfo };
                    return copy;
                });
                return;
            }
        }
    };

    const [finishedBooks, setFinishedBooks] = useState([]);
    const [wantToReadBooks, setWantToReadBooks] = useState([]);
    const [readingBooks, setReadingBooks] = useState([]);

    const getBookStatus = (id) => {
        for (const bookInfo of finishedBooks) {
            if (id === bookInfo.bookId) return { ...bookInfo };
        }

        for (const bookInfo of wantToReadBooks) {
            if (id === bookInfo.bookId) return { ...bookInfo };
        }

        for (const bookInfo of readingBooks) {
            if (id === bookInfo.bookId) return { ...bookInfo };
        }

        return {};
    };

    // #################################################
    //   SEARCH
    // #################################################

    const [searchedAuthors, setSearchedAuthors] = useState([]);
    const [searchedBooks, setSearchedBooks] = useState([]);

    const filterDuplicateAuthors = (authorIds) => {
        const result = [];

        for (const id of authorIds) {
            let foundDuplicate = false;

            for (let i = 0; i < result.length; i++) {
                const oldId = result[i];

                const name1 = authors.current[id] && "name" in authors.current[id] ? authors.current[id].name : "";
                const name2 =
                    authors.current[oldId] && "name" in authors.current[oldId] ? authors.current[oldId].name : "-";

                if (name1 === name2) {
                    foundDuplicate = true;

                    const newPhotosLength =
                        authors.current[id] && "photos" in authors.current[id] && authors.current[id].photos
                            ? authors.current[id].photos.length
                            : 0;
                    const oldPhotosLength =
                        authors.current[oldId] && "photos" in authors.current[oldId] && authors.current[oldId].photos
                            ? authors.current[oldId].photos.length
                            : 0;
                    if (newPhotosLength > oldPhotosLength) result[i] = id;
                }
            }

            if (!foundDuplicate) result.push(id);
        }

        return result;
    };

    const booksHaveSameAuthor = (authors1, authors2) => {
        for (const authorId of authors1) {
            if (authors2.includes(authorId)) return true;
        }
        return false;
    };

    const titlesAreSimilar = (title1, title2) => {
        return title1.includes(title2) || title2.includes(title1);
    };

    const filterDuplicateBooks = (booksIds) => {
        const result = [];

        for (const id of booksIds) {
            let foundDuplicate = false;

            for (let i = 0; i < result.length; i++) {
                const oldId = result[i];

                const authors1 = books.current[id] && "authors" in books.current[id] ? books.current[id].authors : [""];
                const authors2 =
                    books.current[oldId] && "authors" in books.current[oldId] ? books.current[oldId].authors : [""];
                const title1 = books.current[id] && "title" in books.current[id] ? books.current[id].title : "";
                const title2 =
                    books.current[oldId] && "title" in books.current[oldId] ? books.current[oldId].title : "";

                if (booksHaveSameAuthor(authors1, authors2) && titlesAreSimilar(title1, title2)) {
                    foundDuplicate = true;

                    const newCoversLength =
                        books.current[id] && "covers" in books.current[id] && books.current[id].covers
                            ? books.current[id].covers.length
                            : 0;
                    const oldCoversLength =
                        books.current[oldId] && "covers" in books.current[oldId] && books.current[oldId].covers
                            ? books.current[oldId].covers.length
                            : 0;

                    if (newCoversLength > oldCoversLength) result[i] = id;
                }
            }

            if (!foundDuplicate) result.push(id);
        }

        return result;
    };

    return (
        <Data.Provider
            value={{
                APP_NAME,

                // USER INFO
                token,
                user,

                // BOOK AND AUTHOR INFO
                books,
                authors,

                // USER BOOKS
                setUserBooks,
                finishedBooks,
                wantToReadBooks,
                readingBooks,
                changeUserBookStatus,
                changeUserBookScore,
                getBookStatus,

                // SEARCH
                searchedAuthors,
                setSearchedAuthors,
                searchedBooks,
                setSearchedBooks,
                filterDuplicateAuthors,
                filterDuplicateBooks,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
