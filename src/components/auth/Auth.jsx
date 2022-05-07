import { useState, useContext } from "react";
import SVG from "react-inlinesvg";
import cn from "classnames";

import { API } from "../../contexts/API";

import Logo from "../../resources/icons/logo.svg";
import LoadingIcon from "../../resources/icons/loading.svg";

export default function Auth({ setLoggedIn }) {
    const { login, register } = useContext(API);

    const [optionSelected, setOptionSelected] = useState("login");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (to) => {
        setError(false);
        setLoading(false);
        setOptionSelected(to);
    };

    const handleSubmit = async (event) => {
        // Prevent page reload
        event.preventDefault();

        setLoading(true);

        if (optionSelected === "login") {
            const { email, password } = document.forms[0];

            const loginResult = await login(email.value, password.value);
            setLoading(false);

            if ("error" in loginResult) return setError(loginResult.error);

            setLoggedIn(true);
        } else {
            const { email, password, confirmPassword } = document.forms[0];

            if (password.value !== confirmPassword.value) {
                setLoading(false);
                return setError("Passwords do not match");
            }

            const registerResult = await register(email.value, password.value);
            if ("error" in registerResult) {
                setLoading(false);
                return setError(registerResult.error);
            }

            const loginResult = await login(email.value, password.value);
            if ("error" in loginResult) {
                setLoading(false);
                return setError(loginResult.error);
            }

            setLoading(false);
            setLoggedIn(true);
        }
    };

    const form =
        optionSelected === "login" ? (
            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input neoInput"
                    type="text"
                    name="email"
                    placeholder={"email"}
                    autocomlete={"email"}
                    required
                />
                <input
                    className="input neoInput"
                    type="password"
                    name="password"
                    placeholder={"password"}
                    autocomlete={"current-password"}
                    required
                />
                <button className="submit neoButton" type="submit">
                    {loading ? <SVG className="loadingIcon" src={LoadingIcon} /> : "log in"}
                </button>
                <p className="change" onClick={() => handleChange("register")}>
                    register
                </p>
            </form>
        ) : (
            <form className="form" onSubmit={handleSubmit}>
                <input
                    className="input neoInput"
                    type="email"
                    name="email"
                    placeholder={"email"}
                    autocomlete={"email"}
                    required
                />
                <input
                    className="input neoInput"
                    type="password"
                    name="password"
                    placeholder={"password"}
                    autocomlete={"new-password"}
                    required
                />
                <input
                    className="input neoInput"
                    type="password"
                    name="confirmPassword"
                    placeholder={"confirm password"}
                    autocomlete={"new-password"}
                    required
                />
                <button className="submit neoButton" type="submit">
                    {loading ? <SVG className="loadingIcon spin infinite" src={LoadingIcon} /> : "register"}
                </button>
                <p className="change" onClick={() => handleChange("login")}>
                    log in
                </p>
            </form>
        );

    return (
        <div className="Auth">
            <div className="formContainer">
                <SVG className="icon" src={Logo} />
                <p className="title">bookly</p>

                {form}
            </div>

            <div className={cn("error", { visible: !!error })}>{error || "-"}</div>
        </div>
    );
}
