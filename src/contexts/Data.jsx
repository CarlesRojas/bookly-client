import { createContext, useRef } from "react";

const APP_NAME = "bookly";

export const Data = createContext();
const DataProvider = (props) => {
    // #################################################
    //   USER INFO
    // #################################################

    const token = useRef(null);
    const user = useRef(null);
    const books = useRef({});
    const authors = useRef({});

    return (
        <Data.Provider
            value={{
                APP_NAME,
                token,
                user,
                books,
                authors,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
