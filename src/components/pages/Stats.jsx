import { useContext } from "react";

import { API } from "../../contexts/API";

export default function Stats() {
    const { logout } = useContext(API);

    return (
        <div className="Stats" onClick={logout}>
            Stats
        </div>
    );
}
