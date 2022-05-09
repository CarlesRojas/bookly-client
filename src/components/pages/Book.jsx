import { useContext } from "react";

import { Data } from "../../contexts/Data";

export default function Book({ id }) {
    const { books } = useContext(Data);

    return (
        <div className="Book">
            <div className="mainContent neoDiv">{books.current[id].title}</div>
        </div>
    );
}
