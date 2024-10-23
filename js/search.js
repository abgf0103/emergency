const searchContainer = document.querySelector(".search-container");

let currentInfoWindow = null;
document.getElementById("mode-toggle").addEventListener("change", (e) => {
    performSearch();
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";
});
function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const showAvailableOnly = document.getElementById("mode-toggle").checked;
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    const filteredHospitals = hospitalData.filter((hospital) => {
        const matchesSearchTerm = hospital.name.toLowerCase().includes(searchTerm);
        const hasAvailableBeds = !showAvailableOnly || hospital.usableBed > 0;
        return matchesSearchTerm && hasAvailableBeds;
    });

    filteredHospitals.forEach((hospital) => {
        const li = document.createElement("li");
        li.textContent = hospital.name;
        li.style.cursor = "pointer";
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

document.getElementById("searchButton").addEventListener("click", performSearch);

document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
    }
});

/* hidden button */
document.addEventListener("DOMContentLoaded", function () {
    // .hiddenBtn 클릭 시 search-container 위치를 위로 이동해 숨김
    const btnSearch = document.querySelector(".hidden");
    const searchContainer = document.querySelector(".search-container");
    const icon = btnSearch.querySelector("i"); // 아이콘 요소 선택
    const toggleContainer = document.querySelector(".toggle-container");

    let isSearchVisible = true;

    btnSearch.addEventListener("click", function (event) {
        event.preventDefault(); // 버튼 기본 동작 방지
        // 검색창의 높이 구하기
        const searchHeight = searchContainer.clientHeight;
        // mediaQuery.matches => 현재 윈도우 mobile크기면 ture, 아니면 false
        const mediaQuery = window.matchMedia("(max-width: 479px)");
        console.log(mediaQuery);
        if (isSearchVisible) {
            // 검색창을 화면 밖으로 위로 올려서 숨기기
            searchContainer.style.top = `-${searchHeight}px`; // 위로 숨김
            icon.classList.remove("fa-caret-up"); // 아이콘 변경
            icon.classList.add("fa-caret-down");
            toggleContainer.style.left = "20px";
            // 모바일 크기일때 실행
            if (mediaQuery.matches) {
                toggleContainer.style.left = "0";
            }
        } else {
            // 검색창을 원래 위치로 내려서 보이기
            searchContainer.style.top = ""; // 다시 보임
            icon.classList.remove("fa-caret-down"); // 아이콘 변경
            icon.classList.add("fa-caret-up");
            toggleContainer.style.left = "";
        }
        isSearchVisible = !isSearchVisible;
    });
});
