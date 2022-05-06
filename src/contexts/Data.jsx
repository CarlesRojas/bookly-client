import { createContext } from "react";

const APP_NAME = "bookly";

export const Data = createContext();
const DataProvider = (props) => {
    return (
        <Data.Provider
            value={{
                APP_NAME,
            }}
        >
            {props.children}
        </Data.Provider>
    );
};

export default DataProvider;
