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

    const [finishedBooks, setFinishedBooks] = useState([]);
    const [wantToReadBooks, setWantToReadBooks] = useState([]);
    const [readingBooks, setReadingBooks] = useState([]);

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
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
