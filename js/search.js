let currentInfoWindow = null;

function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();

    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    const filteredHospitals = hospitalData.filter((hospital) => {
        const matchesSearchTerm = hospital.name.toLowerCase().includes(searchTerm);

        return matchesSearchTerm;
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
