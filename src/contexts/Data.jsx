import { createContext, useRef, useState, useContext } from "react";

import { Utils } from "./Utils";

const APP_NAME = "bookly";

export const Data = createContext();
const DataProvider = (props) => {
    const { getInfo, setInfo } = useContext(Utils);

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

    const [finishedBooks, setFinishedBooks] = useState([]);
    const [wantToReadBooks, setWantToReadBooks] = useState([]);
    const [readingBooks, setReadingBooks] = useState([]);
    const [sort, setSort] = useState(getInfo(`${APP_NAME}_sortOption`) || "title");

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

        const { sortedFinishedBooks, sortedWantToReadBooks, sortedReadingBooks } = sortBooks(
            {
                finished,
                wantToRead,
                reading,
            },
            sort
        );

        setFinishedBooks(sortedFinishedBooks);
        setWantToReadBooks(sortedWantToReadBooks);
        setReadingBooks(sortedReadingBooks);
    };

    // Call only when the api to change the status has returned without erros
    const changeUserBookStatus = (bookId, oldStatus, newStatus, newBookData) => {
        const finished = [...finishedBooks];
        const wantToRead = [...wantToReadBooks];
        const reading = [...readingBooks];

        if (oldStatus !== "addToLibrary") {
            let currArray = oldStatus === "finished" ? finished : oldStatus === "wantToRead" ? wantToRead : reading;
            let index = currArray.findIndex(({ bookId: id }) => id === bookId);
            currArray.splice(index, 1);
        }

        if (newStatus !== "remove") {
            let newArray = newStatus === "finished" ? finished : newStatus === "wantToRead" ? wantToRead : reading;
            newArray.unshift({ ...newBookData });
        }

        const { sortedFinishedBooks, sortedWantToReadBooks, sortedReadingBooks } = sortBooks(
            {
                finished,
                wantToRead,
                reading,
            },
            sort
        );

        setFinishedBooks(sortedFinishedBooks);
        setWantToReadBooks(sortedWantToReadBooks);
        setReadingBooks(sortedReadingBooks);
    };

    // Call only when the api to change the score has returned without erros
    const changeUserBookScore = (bookId, updatedBookInfo) => {
        const finished = [...finishedBooks];
        const wantToRead = [...wantToReadBooks];
        const reading = [...readingBooks];

        for (const i in finished) {
            const { bookId: id } = finished[i];

            if (bookId === id) {
                finished[i] = { ...updatedBookInfo };
                break;
            }
        }

        const { sortedFinishedBooks, sortedWantToReadBooks, sortedReadingBooks } = sortBooks(
            {
                finished,
                wantToRead,
                reading,
            },
            sort
        );

        setFinishedBooks(sortedFinishedBooks);
        setWantToReadBooks(sortedWantToReadBooks);
        setReadingBooks(sortedReadingBooks);
    };

    // Call only when the api to change the finished date has returned without erros
    const changeUserBookFinishDate = (bookId, updatedBookInfo) => {
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
    //   USER BOOKS SORT
    // #################################################

    const setSortOption = (sortOption) => {
        if (!["title", "author", "rating"].includes(sortOption)) return;

        setInfo(`${APP_NAME}_sortOption`, sortOption);

        if (sort === sortOption) return;

        const { sortedFinishedBooks, sortedWantToReadBooks, sortedReadingBooks } = sortBooks(
            {
                finished: [...finishedBooks],
                wantToRead: [...wantToReadBooks],
                reading: [...readingBooks],
            },
            sortOption
        );

        setFinishedBooks(sortedFinishedBooks);
        setWantToReadBooks(sortedWantToReadBooks);
        setReadingBooks(sortedReadingBooks);

        setSort(sortOption);
    };

    const removeFirstArticle = (value) => {
        const articles = ["the ", "an ", "a "];

        for (const article of articles) if (value.startsWith(article)) return value.replace(article, "");

        return value;
    };

    const sortBooks = ({ finished, wantToRead, reading }, sortBy) => {
        const wantToReadCopy = [...wantToRead];
        const readingCopy = [...reading];
        const finishedCopy = [...finished];

        finishedCopy.sort((first, second) => {
            if (!(first.bookId in books.current) || books.current[first.bookId] === null) return 1;
            if (!(second.bookId in books.current) || books.current[second.bookId] === null) return -1;

            const firstBook = books.current[first.bookId];
            const secondBook = books.current[second.bookId];

            if (sortBy === "title" || (sortBy === "rating" && second.score === first.score))
                return removeFirstArticle(firstBook.title.toLowerCase()).localeCompare(
                    removeFirstArticle(secondBook.title.toLowerCase())
                );
            else if (sortBy === "author") {
                if (!("authors" in firstBook) || !firstBook.authors.length) return 1;
                if (!("authors" in secondBook) || !secondBook.authors.length) return 1;

                const firstAuthor = authors.current[firstBook.authors[0]];
                const secondAuthor = authors.current[secondBook.authors[0]];

                return firstAuthor.name.localeCompare(secondAuthor.name);
            }
            if (sortBy === "rating") return second.score - first.score;
            else return 0;
        });

        wantToReadCopy.sort((first, second) => {
            if (!(first.bookId in books.current) || books.current[first.bookId] === null) return 1;
            if (!(second.bookId in books.current) || books.current[second.bookId] === null) return -1;

            const firstBook = books.current[first.bookId];
            const secondBook = books.current[second.bookId];

            if (sortBy === "title" || sortBy === "rating")
                return removeFirstArticle(firstBook.title.toLowerCase()).localeCompare(
                    removeFirstArticle(secondBook.title.toLowerCase())
                );
            else if (sortBy === "author") {
                if (!("authors" in firstBook) || !firstBook.authors.length) return 1;
                if (!("authors" in secondBook) || !secondBook.authors.length) return 1;

                const firstAuthor = authors.current[firstBook.authors[0]];
                const secondAuthor = authors.current[secondBook.authors[0]];

                return firstAuthor.name.localeCompare(secondAuthor.name);
            } else return 0;
        });

        readingCopy.sort((first, second) => {
            if (!(first.bookId in books.current) || books.current[first.bookId] === null) return 1;
            if (!(second.bookId in books.current) || books.current[second.bookId] === null) return -1;

            const firstBook = books.current[first.bookId];
            const secondBook = books.current[second.bookId];

            if (sortBy === "title" || sortBy === "rating")
                return removeFirstArticle(firstBook.title.toLowerCase()).localeCompare(
                    removeFirstArticle(secondBook.title.toLowerCase())
                );
            else if (sortBy === "author") {
                if (!("authors" in firstBook) || !firstBook.authors.length) return 1;
                if (!("authors" in secondBook) || !secondBook.authors.length) return 1;

                const firstAuthor = authors.current[firstBook.authors[0]];
                const secondAuthor = authors.current[secondBook.authors[0]];

                return firstAuthor.name.localeCompare(secondAuthor.name);
            } else return 0;
        });
        return {
            sortedFinishedBooks: finishedCopy,
            sortedWantToReadBooks: wantToReadCopy,
            sortedReadingBooks: readingCopy,
        };
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
                changeUserBookFinishDate,
                getBookStatus,

                // SORT
                sort,
                setSortOption,

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
