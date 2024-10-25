const modal = document.getElementById("modal");
const modalOpenButton = document.getElementById("modalOpenButton");
const modalMember = document.getElementById("modal-member");
const memberForm = document.getElementById("memberForm");
const memberBtn = document.getElementById("memberBtn");
const modalContent = document.getElementById("modal-content");
const closeButton = document.getElementById("closeButton");
const inputField = document.getElementById("userInput");
const saveButton = document.getElementById("saveButton");
const editButton = document.getElementById("editButton");

// 입력값을 저장할 변수
let savedValue = "";

// 모달 창 열기
modalOpenButton.addEventListener("click", function () {
    modal.style.display = "block"; //모달 멤버 열기
    modalMember.style.display = "block"; // 모달 멤버 열기
    inputField.value = savedValue; // 이전 입력값 설정
    inputField.disabled = savedValue !== ""; // 값이 있으면 비활성화
    saveButton.style.display = savedValue === "" ? "inline" : "none"; // 초기 상태에 따라 버튼 표시
    editButton.style.display = savedValue !== "" ? "inline" : "none"; // 초기 상태에 따라 버튼 표시
});

// 멤버 ID 입력 버튼 클릭
memberBtn.addEventListener("click", function () {
    modalMember.style.display = "none";
    modalContent.style.display = "block";
});

// 멤버 조회
memberForm.addEventListener("submit", function (e) {
    e.preventDefault(); // 폼 기본 제출 동작을 방지 (새로고침 방지)

    // 입력된 닉네임 가져오기
    var memberID = document.getElementById("memberID").value?.trim();

    // 서버에 POST 요청 보내기
    fetch(`/check-memberID?nickname=${memberID}`, {
        method: "POST",
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => console.error("Error:", error));
});

closeButton.addEventListener("click", function () {
    modal.style.display = "none"; // 모달 닫기
    modalMember.style.display = "none";
    modalContent.style.display = "none";
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
        modalMember.style.display = "none";
        modalContent.style.display = "none";
    }
});
