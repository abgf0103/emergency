const toggle = document.getElementById("mode-toggle");
const body = document.body;
const hidden = document.getElementById("hidden");

toggle.addEventListener("change", function () {
    if (this.checked) {
        body.classList.add("block-mode");
        localStorage.setItem("blockMode", "enabled");
    } else {
        body.classList.remove("block-mode");
        localStorage.setItem("blockMode", "disabled");
    }
});

// check for saved user preference, if any, on load of the website
document.addEventListener("DOMContentLoaded", () => {
    body.classList.remove("block-mode");
    localStorage.setItem("blockMode", "disabled");
});
