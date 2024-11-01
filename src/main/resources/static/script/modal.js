const modal = document.getElementById("modal");
const modalOpenButton = document.getElementById("modalOpenButton");
const modalMember = document.getElementById("modal-member");
const memberInfoChkBtn = document.getElementById("memberInfoChkBtn");
const modalContent = document.getElementById("modal-content");
const closeButton = document.getElementById("closeButton");
const contentField = document.getElementById("content");
const saveButton = document.getElementById("saveButton");
const editButton = document.getElementById("editButton");
const temperature = document.getElementById("temperature");

contentField.value = '';
// 모달 창 열기
modalOpenButton.addEventListener("click", function () {
    modal.style.display = "block"; //모달 멤버 열기
    modalMember.style.display = "block"; // 모달 멤버 열기
});

// 멤버 ID 입력 버튼 클릭
memberInfoChkBtn.addEventListener("click", function (e) {

    modalMember.style.display = "none";
    modalContent.style.display = "block";
    const memberID = document.getElementById('memberID').value;

    // memberID를 입력한 경우 회원 조회 후 내용 출력, 회원이 조회되지 않으면 회원가입
    if(!memberID == "") {
        e.preventDefault();
        let hasResult = false;
        // 회원 조회
        fetch('/member/check?memberID=' + memberID,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // 전송할 데이터 형식
            }
        })
        .then(res => {
            if(!res.ok){
                throw  new Error('Error !');
            }else{ //회원이 조회되면
                hasResult = true;
            }

            //회원이 조회가 되지 않으면 회원 등록
            if(!hasResult){
                fetch('/member/insert',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // 전송할 데이터 형식
                    },
                    body: JSON.stringify({
                        memberID : memberID,
                        temperature : 36.5
                    }) //데이터를 JSON형태로 변환
                })
                    .then(res => {
                        if(!res.ok){
                            throw  new Error('Insert failed');
                        }else{
                            contentField.value = '';
                            temperature.value = 36.5;
                            ableInput(); // input 요소 비활성화
                            contentField.value="";
                        }
                    })
                    .catch(()=> console.log("error while insert a new member"));
            }

            return res.json();
        })


            .then(data => {
                contentField.value = data.content;
                temperature.value = data.temperature;
                disableInput(); // input 요소 비활성화
            })


        .catch(() => { //ID가 조회되지 않을경우 ID등록
            console.log("member not found");
        })


    }else{// memberID를 입력하지 않은 경우 (비회원)
        e.preventDefault();
    }
});

// // 멤버 조회
// memberForm.addEventListener("submit", function (e) {
//     e.preventDefault(); // 폼 기본 제출 동작을 방지 (새로고침 방지)
//     this.submit();
// });

function disableInput (){
    contentField.disabled = true; // 입력 필드 비활성화
    contentField.classList.add("disabled"); // 비활성화 스타일 추가
    temperature.disabled = true;
    saveButton.style.display = "none"; // 저장 버튼 숨기기
    editButton.style.display = "inline"; // 수정 버튼 보이기
}

function ableInput (){
    contentField.disabled = false; // 입력 필드 비활성화
    contentField.classList.remove("disabled"); // 비활성화 스타일 추가
    temperature.disabled = false;
    saveButton.style.display = "inline"; // 저장 버튼 숨기기
    editButton.style.display = "none"; // 수정 버튼 보이기
}

closeButton.addEventListener("click", function () {
    modal.style.display = "none"; // 모달 닫기
    modalMember.style.display = "none";
    modalContent.style.display = "none";
});

saveButton.addEventListener("click", function () {
    disableInput();
    const memberID = document.getElementById('memberID').value;

    // AJAX 요청
    fetch('/member/update',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // 전송할 데이터 형식
        },
        body: JSON.stringify({
            memberID: memberID,
            content: contentField.value,
            temperature: temperature.value
        }) //데이터를 JSON형태로 변환
    })
    .then(res => {
        if(!res.ok){
            throw  new Error('Error !');
        }
    })

});

editButton.addEventListener("click", function () {
    contentField.disabled = false; // 입력 필드 활성화
    temperature.disabled = false; // 입력 필드 활성화
    contentField.classList.remove("disabled"); // 비활성화 스타일 제거
    saveButton.style.display = "inline"; // 저장 버튼 보이기
    editButton.style.display = "none"; // 수정 버튼 숨기기
    contentField.focus(); // 입력 필드에 포커스
});

// 모달 외부 클릭 시 모달 닫기
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // 모달 닫기
        modalMember.style.display = "none";
        modalContent.style.display = "none";
    }
});
