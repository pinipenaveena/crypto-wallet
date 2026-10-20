// =====================================================
// CRYPTO WALLET - app.js
// =====================================================


// =====================================================
// REGISTER
// =====================================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document
                    .getElementById("registerUsername")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const message =
                document.getElementById("registerMessage");


            message.textContent = "Creating account...";


            try {

                const response =
                    await fetch("/auth/register", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    });


                const data =
                    await response.json();


                console.log(
                    "Register response:",
                    data
                );


                /*
                 * Your backend may return either:
                 *
                 * "Registration successful"
                 *
                 * or
                 *
                 * { message: "Registration successful" }
                 *
                 */

                let resultMessage =
                    typeof data === "string"
                        ? data
                        : data.message;


                message.textContent =
                    resultMessage;


                if (
                    resultMessage ===
                    "Registration successful"
                ) {

                    message.className =
                        "success";


                    // Give user a moment
                    // then move to login

                    setTimeout(
                        function () {

                            window.location.href =
                                "/login.html";

                        },
                        1000
                    );

                } else {

                    message.className =
                        "error";
                }


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                message.textContent =
                    "Registration failed.";

                message.className =
                    "error";
            }

        }
    );
}


// =====================================================
// LOGIN
// =====================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("loginUsername")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;


            const message =
                document.getElementById("loginMessage");


            message.textContent =
                "Logging in...";


            try {

                const response =
                    await fetch("/auth/login", {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            username: username,

                            password: password

                        })
                    });


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                if (data.success === true) {

                    /*
                     * SAVE JWT TOKEN
                     *
                     * This token is required
                     * to access /wallet/**
                     */

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    localStorage.setItem(
                        "username",
                        data.username
                    );


                    message.textContent =
                        "Login successful!";


                    message.className =
                        "success";


                    /*
                     * Move to wallet
                     */

                    setTimeout(
                        function () {

                            window.location.href =
                                "/wallet.html";

                        },
                        500
                    );


                } else {

                    message.textContent =
                        data.message ||
                        "Invalid username or password.";

                    message.className =
                        "error";
                }


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.textContent =
                    "Login failed. Please try again.";

                message.className =
                    "error";
            }

        }
    );
}


// =====================================================
// GET JWT TOKEN
// =====================================================

const token =
    localStorage.getItem("token");


// =====================================================
// WALLET PAGE
// =====================================================

if (
    document.getElementById("balance")
) {

    /*
     * User is not logged in
     */

    if (!token) {

        window.location.href =
            "/login.html";

    } else {

        /*
         * User is logged in
         */

        loadWallet();

        loadTransactions();

    }
}


// =====================================================
// LOAD WALLET BALANCE
// =====================================================

async function loadWallet() {

    try {

        const response =
            await fetch(
                "/wallet/me",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        /*
         * Token expired or invalid
         */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "/login.html";

            return;
        }


        const data =
            await response.json();


        console.log(
            "Wallet data:",
            data
        );


        /*
         * Display username
         */

        const usernameElement =
            document.getElementById(
                "username"
            );


        if (usernameElement) {

            usernameElement.textContent =
                data.username;

        }


        /*
         * Display account username
         */

        const accountUsername =
            document.getElementById(
                "accountUsername"
            );


        if (accountUsername) {

            accountUsername.textContent =
                data.username;

        }


        /*
         * Display balance
         */

        const balanceElement =
            document.getElementById(
                "balance"
            );


        if (balanceElement) {

            balanceElement.textContent =
                Number(data.balance)
                    .toFixed(4);

        }


    } catch (error) {

        console.error(
            "Wallet loading error:",
            error
        );

    }
}


// =====================================================
// SEND MONEY
// =====================================================

const sendForm =
    document.getElementById(
        "sendForm"
    );


if (sendForm) {

    sendForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /*
             * Get receiver username
             */

            const receiverUsername =
                document
                    .getElementById(
                        "receiverUsername"
                    )
                    .value
                    .trim();


            /*
             * Get amount
             */

            const amount =
                document
                    .getElementById(
                        "sendAmount"
                    )
                    .value;


            /*
             * Message area
             */

            const message =
                document.getElementById(
                    "sendMessage"
                );


            message.textContent =
                "Sending coins...";


            message.className = "";


            /*
             * Basic frontend validation
             */

            if (!receiverUsername) {

                message.textContent =
                    "Enter receiver username.";

                message.className =
                    "error";

                return;
            }


            if (
                !amount ||
                Number(amount) <= 0
            ) {

                message.textContent =
                    "Amount must be greater than zero.";

                message.className =
                    "error";

                return;
            }


            try {

                const response =
                    await fetch(
                        "/wallet/send",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token

                            },

                            body: JSON.stringify({

                                receiverUsername:
                                    receiverUsername,

                                amount:
                                    amount

                            })

                        }
                    );


                /*
                 * Unauthorized
                 */

                if (
                    response.status === 401 ||
                    response.status === 403
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "username"
                    );


                    window.location.href =
                        "/login.html";

                    return;
                }


                const data =
                    await response.json();


                console.log(
                    "Send response:",
                    data
                );


                message.textContent =
                    data.message ||
                    "Transfer completed.";


                /*
                 * SUCCESS
                 */

                if (
                    data.message ===
                    "Transfer successful"
                ) {

                    message.className =
                        "success";


                    /*
                     * Clear receiver field
                     */

                    document
                        .getElementById(
                            "receiverUsername"
                        )
                        .value = "";


                    /*
                     * Clear amount field
                     */

                    document
                        .getElementById(
                            "sendAmount"
                        )
                        .value = "";


                    /*
                     * Reload balance
                     */

                    loadWallet();


                    /*
                     * Reload transactions
                     */

                    loadTransactions();

                } else {

                    /*
                     * Backend returned an error
                     */

                    message.className =
                        "error";
                }


            } catch (error) {

                console.error(
                    "Send money error:",
                    error
                );


                message.textContent =
                    "Transfer failed. Please try again.";

                message.className =
                    "error";
            }

        }
    );
}


// =====================================================
// LOAD TRANSACTIONS
// =====================================================

async function loadTransactions() {

    const transactionList =
        document.getElementById(
            "transactionList"
        );


    /*
     * If transaction section
     * doesn't exist, stop.
     */

    if (!transactionList) {

        return;

    }


    try {

        const response =
            await fetch(
                "/wallet/transactions",
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        /*
         * Unauthorized
         */

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "username"
            );


            window.location.href =
                "/login.html";

            return;
        }


        const transactions =
            await response.json();


        console.log(
            "Transactions:",
            transactions
        );


        /*
         * No transactions
         */

        if (
            !transactions ||
            transactions.length === 0
        ) {

            transactionList.innerHTML = `
                <div class="loading">
                    No transactions yet.
                </div>
            `;

            return;
        }


        /*
         * Clear old transactions
         */

        transactionList.innerHTML = "";


        /*
         * Get current username
         */

        const currentUsername =
            localStorage.getItem(
                "username"
            );


        /*
         * Display transactions
         */

        transactions.forEach(
            function (transaction) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "transaction";


                /*
                 * Determine SENT or RECEIVED
                 */

                const isSent =
                    transaction.senderUsername ===
                    currentUsername;


                if (isSent) {

                    item.innerHTML = `

                        <p>
                            <strong>Type:</strong>
                            <span class="sent">
                                Sent
                            </span>
                        </p>

                        <p>
                            <strong>To:</strong>
                            ${escapeHtml(
                                transaction.receiverUsername
                            )}
                        </p>

                        <p>
                            <strong>Amount:</strong>
                            -${transaction.amount}
                            COINS
                        </p>

                    `;

                } else {

                    item.innerHTML = `

                        <p>
                            <strong>Type:</strong>
                            <span class="received">
                                Received
                            </span>
                        </p>

                        <p>
                            <strong>From:</strong>
                            ${escapeHtml(
                                transaction.senderUsername
                            )}
                        </p>

                        <p>
                            <strong>Amount:</strong>
                            +${transaction.amount}
                            COINS
                        </p>

                    `;

                }


                transactionList.appendChild(
                    item
                );

            }
        );


    } catch (error) {

        console.error(
            "Transaction loading error:",
            error
        );


        transactionList.innerHTML = `
            <div class="loading">
                Unable to load transactions.
            </div>
        `;
    }
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";

    }


    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");
}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    /*
     * Remove JWT
     */

    localStorage.removeItem(
        "token"
    );


    /*
     * Remove username
     */

    localStorage.removeItem(
        "username"
    );


    /*
     * Go back to login
     */

    window.location.href =
        "/login.html";
}