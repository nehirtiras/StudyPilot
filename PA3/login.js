const switchBtn = document.getElementById("switch");
const switchLabel = document.getElementById("switchLabel");
const title = document.getElementById("form-title");
const submitBtn = document.getElementById("submitBtn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

let isLogin = true;

switchBtn.addEventListener("click", () => {
    isLogin = !isLogin;

    if (isLogin) {
        title.textContent = "Login";
        submitBtn.textContent = "Login";
        switchLabel.textContent = "Don't have an account?";
        switchBtn.textContent = "Sign up";
    } else {
        title.textContent = "Sign Up";
        submitBtn.textContent = "Create Account";
        switchLabel.textContent = "Do you have an account?";
        switchBtn.textContent = "Login";
    }
});

if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify({}));
}

submitBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username === "" || password === "") {
        alert("Please fill all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users"));

    if (isLogin) {
        if (!users[username]) {
            alert("This user does not exist!");
            return;
        }

        if (users[username] !== password) {
            alert("Incorrect password!");
            return;
        }

        localStorage.setItem("currentUser", username);

        window.location.href = "index.html";
        return;
    }

    if (!isLogin) {
        if (users[username]) {
            alert("This username is already taken!");
            return;
        }

        users[username] = password;
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("currentUser", username);

        window.location.href = "index.html";
    }
});
