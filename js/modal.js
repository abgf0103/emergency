const modal = document.getElementById("modal");
const modalButton = document.getElementById("modalButton");
const closeButton = document.getElementById("closeButton");
const inputField = document.getElementById("userInput");
const saveButton = document.getElementById("saveButton");
const editButton = document.getElementById("editButton");

// 입력값을 저장할 변수
let savedValue = "";

modalButton.addEventListener("click", function () {
    modal.style.display = "block"; // 모달 열기
    inputField.value = savedValue; // 이전 입력값 설정
    inputField.disabled = savedValue !== ""; // 값이 있으면 비활성화
    saveButton.style.display = savedValue === "" ? "inline" : "none"; // 초기 상태에 따라 버튼 표시
    editButton.style.display = savedValue !== "" ? "inline" : "none"; // 초기 상태에 따라 버튼 표시
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none"; // 모달 닫기
});

saveButton.addEventListener("click", function () {
    const inputValue = inputField.value;

    savedValue = inputValue; // 입력값 저장
    inputField.disabled = true; // 입력 필드 비활성화
    inputField.classList.add("disabled"); // 비활성화 스타일 추가
    userTemperature.disabled = true;
    saveButton.style.display = "none"; // 저장 버튼 숨기기
    editButton.style.display = "inline"; // 수정 버튼 보이기
});

editButton.addEventListener("click", function () {
    inputField.disabled = false; // 입력 필드 활성화
    userTemperature.disabled = false; // 입력 필드 활성화
    inputField.classList.remove("disabled"); // 비활성화 스타일 제거
    saveButton.style.display = "inline"; // 저장 버튼 보이기
    editButton.style.display = "none"; // 수정 버튼 숨기기
    inputField.focus(); // 입력 필드에 포커스
});

// 모달 외부 클릭 시 모달 닫기
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // 모달 닫기
    }
});
