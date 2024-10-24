const toggle = document.getElementById("mode-toggle");
const body = document.body;
const hidden = document.getElementById("hidden");

// toggle 버튼의 change를 감지
toggle.addEventListener("change", function () {
    if (this.checked) {
        body.classList.add("block-mode");
        localStorage.setItem("blockMode", "enabled");
    } else {
        body.classList.remove("block-mode");
        localStorage.setItem("blockMode", "disabled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    body.classList.remove("block-mode");
    localStorage.setItem("blockMode", "disabled");
});
