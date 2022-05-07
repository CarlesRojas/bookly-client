import { useContext } from "react";

import { Data } from "../../contexts/Data";

export default function Home() {
    const { userBooks } = useContext(Data);
    console.log(userBooks);

    return <div className="Home">Home</div>;
}
