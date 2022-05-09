import { useContext } from "react";

import { Data } from "../../contexts/Data";

export default function Author({ id }) {
    const { authors } = useContext(Data);

    return (
        <div className="Author">
            <div className="mainContent neoDiv">{authors.current[id].name}</div>
        </div>
    );
}
