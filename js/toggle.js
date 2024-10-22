const toggle = document.getElementById("mode-toggle");
const body = document.body;

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
document.addEventListener("DOMContentLoaded", (event) => {
    const blockMode = localStorage.getItem("blockMode");

    if (blockMode === "enabled") {
        body.classList.add("block-mode");
        toggle.checked = false;
    }
});
