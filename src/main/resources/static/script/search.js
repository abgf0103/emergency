const searchContainer = document.querySelector(".search-container");

let currentInfoWindow = null;
let showAvailableOnly = false;
// 토글 버튼 이벤트
document.getElementById("mode-toggle").addEventListener("change", (e) => {
    showAvailableOnly = e.target.checked;
    //검색시에만 performSearch() 작동
    const searchTerm = document.getElementById("searchInput").value.trim();
    if (searchTerm) {
        performSearch();
    }
});
//검색 버튼을 눌렀을시 작동
function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";
    //병원 이름 / 토글버튼 작동시 가용가능한 병원만 검색목록 return
    const filteredHospitals = hospitalData.filter((hospital) => {
        const matchesSearchTerm = hospital.name.toLowerCase().includes(searchTerm);
        const hasAvailableBeds = !showAvailableOnly || hospital.usableBed > 0;
        return matchesSearchTerm && hasAvailableBeds;
    });
    //검색 목록
    filteredHospitals.forEach((hospital) => {
        const li = document.createElement("li");
        li.textContent = hospital.name;
        li.style.cursor = "pointer";
        //검색 목록 클릭시 이벤트
        li.addEventListener("click", () => {
            const markerData = markers.find((m) => m.name === hospital.name);
            if (markerData) {
                map.setCenter(markerData.position);
                closeInfoWindow(); // 현재 인포윈도우 닫기
                // 커스텀 오버레이 생성
                const content = `
          <div class="infoWindow ${markerData.usableBed > 0 ? "greenOverlay" : "redOverlay"}">
            <div class="box">
              <h4 class="name">${hospital.name}</h4>
              <p class="tel">${hospital.tel}</p>
              <p class="bedCount ${markerData.usableBed > 0 ? "greenBed" : "redBed"}">${markerData.usableBed}/${
                    markerData.totalBed
                }</p>
              <p class="updateTime">갱신시간 : ${markerData.updateTime.substr(8, 2)}시 ${markerData.updateTime.substr(
                    10,
                    2
                )}분</p>
            </div>
            <div class="close" onclick="closeInfoWindow()" title="닫기"></div>
          </div>
        `;

                const customOverlay = new kakao.maps.CustomOverlay({
                    content: content,
                    map: map,
                    position: markerData.position,
                });

                currentInfoWindow = customOverlay;
            }
        });

        //모바일 상태 확인 후 모바일 상태면 검색결과를 누른 순간 hidden 버튼 누른 효과
        if (window.innerWidth <= 479) {
            const hiddenBtn = document.querySelector(".hidden");
            const icon = hiddenBtn.querySelector("i"); // 아이콘 요소 선택
            hiddenBtn.classList.add("hiddenBtn");
            li.addEventListener("click", function () {
                if (isSearchVisible) {
                    searchHeight = searchContainer.clientHeight;
                    console.log(searchHeight);
                    // 검색창을 화면 밖으로 위로 올려서 숨기기
                    searchContainer.style.top = `-${searchHeight}px`;
                    // 위로 숨김
                    icon.classList.remove("fa-caret-up");
                    // 아이콘 변경
                    icon.classList.add("fa-caret-down");
                    isSearchVisible = false;
                }
            });
        }
        //검색목록에서 마우스아웃 하면 인포윈도우를 닫는다.
        li.addEventListener("mouseout", () => {
            closeInfoWindow();
        });
        resultList.appendChild(li);
    });

    if (filteredHospitals.length === 0) {
        resultList.innerHTML = "<li>검색 결과가 없습니다.</li>";
    }
}

function closeInfoWindow() {
    if (currentInfoWindow) {
        currentInfoWindow.setMap(null); // 커스텀 오버레이 닫기
        currentInfoWindow = null; // 현재 인포윈도우 변수 초기화
    }
}
//검색 버튼 클릭시 검색
document.getElementById("searchButton").addEventListener("click", performSearch);
//엔터 키로 검색 기능
document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
    }
});

/* hidden button */

// mediaQuery.matches => 현재 윈도우 mobile크기면 ture, 아니면 false
const mediaQuery = window.matchMedia("(max-width: 479px)");
let isSearchVisible = true;
document.addEventListener("DOMContentLoaded", function () {
    // .hiddenBtn 클릭 시 search-container 위치를 위로 이동해 숨김
    const hiddenBtn = document.querySelector(".hidden");
    const icon = hiddenBtn.querySelector("i"); // 아이콘 요소 선택
    const toggleContainer = document.querySelector(".toggle-container");

    hiddenBtn.addEventListener("click", function (event) {
        // 검색창의 높이 구하기
        const searchHeight = searchContainer.clientHeight;

        event.preventDefault(); // 버튼 기본 동작 방지

        if (isSearchVisible) {
            // 검색창을 화면 밖으로 위로 올려서 숨기기
            searchContainer.style.top = `-${searchHeight}px`;
            // 위로 숨김
            icon.classList.remove("fa-caret-up");
            // 아이콘 변경
            icon.classList.add("fa-caret-down");
            toggleContainer.style.left = mediaQuery.matches ? "0" : "20px";
        } else {
            // 검색창을 원래 위치로 내려서 보이기
            searchContainer.style.top = ""; // 다시 보임
            icon.classList.remove("fa-caret-down"); // 아이콘 변경
            icon.classList.add("fa-caret-up");
            toggleContainer.style.left = "";
            const searchTerm = document.getElementById("searchInput").value.trim();
            if (searchTerm) {
                performSearch();
            }
        }
        isSearchVisible = !isSearchVisible;
    });
});
