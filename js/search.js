// 검색창
function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    const filteredHospitals = hospitalData.filter((hospital) => hospital.name.toLowerCase().includes(searchTerm));

    filteredHospitals.forEach((hospital) => {
        const li = document.createElement("li");
        li.textContent = hospital.name;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            const markerData = markers.find((m) => m.name === hospital.name);
            if (markerData) {
                map.setCenter(markerData.position);
                //infowindow.open(map, markerData.marker);
            }
        });
        resultList.appendChild(li);
    });

    if (filteredHospitals.length === 0) {
        resultList.innerHTML = "<li>검색 결과가 없습니다.</li>";
    }
}

document.getElementById("searchButton").addEventListener("click", performSearch);

// Add search on Enter key
document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        performSearch();
    }
});
