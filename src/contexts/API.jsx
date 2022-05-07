import { createContext, useContext } from "react";

// Contexts
import { Utils } from "./Utils";
import { Data } from "./Data";
import { Events } from "./Events";
import { GlobalState } from "./GlobalState";

const API_VERSION = "api_v1";
const API_URL = "https://bookly-server.herokuapp.com/"; // "http://localhost:3100/"
const OPEN_LIB_API_URL = "https://openlibrary.org";

export const API = createContext();
const APIProvider = (props) => {
    const { getInfo, setInfo, clearInfo } = useContext(Utils);
    const { APP_NAME, token, user, books, authors } = useContext(Data);
    const { emit } = useContext(Events);
    const { set, get } = useContext(GlobalState);

    // #################################################
    //   USER API
    // #################################################

    const register = async (email, password) => {
        const postData = { email: email.toLowerCase(), password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/register`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            user.current = response;
            set("userUpdated", get("userUpdated") + 1);

            return response;
        } catch (error) {
            return { error: `Unknown registration error` };
        }
    };

    const login = async (email, password) => {
        const postData = { email: email.toLowerCase(), password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/login`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Return with error if it is the case
            if ("error" in response) return response;

            // Save token
            if ("token" in response) {
                token.current = response.token;
                setInfo(`${APP_NAME}_token`);
            }

            return response;
        } catch (error) {
            return { error: "Unknown login error" };
        }
    };

    const testToken = async (token) => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/testToken`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token,
                },
            });

            const response = await rawResponse.json();

            // Return with error if it is the case
            if ("error" in response) return response;

            return response;
        } catch (error) {
            return { error: `Test token error: ${error}` };
        }
    };

    const getUserInfo = async () => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/getUserInfo`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) {
                clearInfo(APP_NAME);
                return response;
            }
            user.current = response;
            set("userUpdated", get("userUpdated") + 1);

            return response;
        } catch (error) {
            clearInfo(APP_NAME);
            return { error: `Get user info error: ${error}` };
        }
    };

    const isLoggedIn = async () => {
        const tokenInCookie = getInfo(`${APP_NAME}_token`);
        if (!tokenInCookie) return false;

        const response = await testToken(tokenInCookie);
        if ("error" in response) return false;

        // Set token
        token.current = tokenInCookie;
        setInfo(`${APP_NAME}_token`);

        // Save user info
        await getUserInfo();

        return true;
    };

    const logout = () => {
        token.current = null;
        user.current = null;
        set("userUpdated", get("userUpdated") + 1);

        clearInfo(APP_NAME);
        emit("onLogout");
    };

    const tryToLogInWithToken = async () => {
        const tokenInCookie = getInfo(`${APP_NAME}_token`);

        // If token in cookie
        if (tokenInCookie) {
            token.current = tokenInCookie;

            const result = await getUserInfo();
            if ("error" in result) {
                logout();
                return false;
            }

            return true;
        }
        return false;
    };

    const changeEmail = async (password, newEmail) => {
        const postData = { password, email: newEmail.toLowerCase() };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/changeEmail`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            user.current = response;
            set("userUpdated", get("userUpdated") + 1);

            return response;
        } catch (error) {
            return { error: `Change email error: ${error}` };
        }
    };

    const changePassword = async (password, newPassword) => {
        const postData = { password, newPassword };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/changePassword`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Save new user
            if ("error" in response) return response;
            user.current = response;
            set("userUpdated", get("userUpdated") + 1);

            return response;
        } catch (error) {
            return { error: `Change password error: ${error}` };
        }
    };

    const deleteAccount = async (password) => {
        const postData = { password };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/user/deleteAccount`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            // Logout
            if ("success" in response) logout();

            return response;
        } catch (error) {
            return { error: `Delete account error: ${error}` };
        }
    };

    // #################################################
    //   BOOK API
    // #################################################

    const changeBookStatus = async (bookId, status) => {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();

        const postData = { bookId, status, month, year };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeStatus`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            return response;
        } catch (error) {
            return { error: "Unknown error" };
        }
    };

    const changeBookScore = async (bookId, score) => {
        const postData = { bookId, score };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeScore`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            return response;
        } catch (error) {
            return { error: "Unknown error" };
        }
    };

    const changeBookFinishDate = async (bookId, month, year) => {
        const postData = { bookId, month, year };

        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/changeFinishDate`, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(postData),
            });

            const response = await rawResponse.json();

            return response;
        } catch (error) {
            return { error: "Unknown error" };
        }
    };

    const getAllUserBooks = async () => {
        try {
            const rawResponse = await fetch(`${API_URL}${API_VERSION}/book/getAll`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    token: token.current,
                },
            });

            const response = await rawResponse.json();

            return response;
        } catch (error) {
            clearInfo(APP_NAME);
            return { error: `Get user info error: ${error}` };
        }
    };

    // #################################################
    //   OPEN LIBRARY API
    // #################################################

    const getBookInfo = async (bookId) => {
        try {
            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/works/${bookId}.json`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            const response = await rawResponse.json();
            const { description, links, title, authors, covers } = response;

            // Parse response
            const parsedResponse = {
                bookId,
                description,
                links,
                title,
                authors: authors.map(({ author }) => author.key.replace("/authors/", "")),
                covers: covers
                    .filter((coverKey) => coverKey !== -1)
                    .map((coverKey) => `https://covers.openlibrary.org/b/id/${coverKey}-M.jpg`),
            };

            // Update book
            books.current[bookId] = parsedResponse;

            // Get authors info
            parsedResponse.authors.forEach((authorId) => {
                getAuthorInfo(authorId);
            });

            return parsedResponse;
        } catch (error) {
            return { error: `Get book info error: ${error}` };
        }
    };

    const getAuthorInfo = async (authorId) => {
        try {
            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/authors/${authorId}.json`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            const response = await rawResponse.json();
            const { links, name, birth_date, bio, photos } = response;

            // Get author works
            const works = await getAuthorWorks(authorId);

            // Parse response
            const parsedResponse = {
                links,
                authorId,
                name,
                birth_date,
                bio,
                works,
                photos: photos
                    .filter((photoKey) => photoKey !== -1)
                    .map((photoKey) => `https://covers.openlibrary.org/b/id/${photoKey}-M.jpg`),
            };

            // Update book
            authors.current[authorId] = parsedResponse;

            return parsedResponse;
        } catch (error) {
            return { error: `Get author info error: ${error}` };
        }
    };

    const getAuthorWorks = async (authorId) => {
        try {
            const rawResponse = await fetch(`${OPEN_LIB_API_URL}/search.json?author=${authorId}&language=eng`, {
                method: "get",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            const response = await rawResponse.json();

            const parsedResponse = response.docs
                .filter(({ type }) => type === "work")
                .map(({ key }) => key.replace("/works/", ""));

            return parsedResponse;
        } catch (error) {
            return { error: `Get author info error: ${error}` };
        }
    };

    return (
        <API.Provider
            value={{
                // USER API
                register,
                login,
                isLoggedIn,
                tryToLogInWithToken,
                changeEmail,
                changePassword,
                deleteAccount,

                // BOOK API
                changeBookStatus,
                changeBookScore,
                changeBookFinishDate,
                getAllUserBooks,

                // OPEN LIBRARY API
                getBookInfo,
                getAuthorInfo,
            }}
        >
            {props.children}
        </API.Provider>
    );
};

export default APIProvider;
