let currentInfoWindow = null; 

function performSearch() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const showAvailableOnly = document.getElementById("availableOnly").checked;
    const resultList = document.getElementById("resultList");
    resultList.innerHTML = "";

    const filteredHospitals = hospitalData.filter((hospital) => {
        const matchesSearchTerm = hospital.name.toLowerCase().includes(searchTerm);
        const hasAvailableBeds = !showAvailableOnly || hospital.usableBed > 0;
        return matchesSearchTerm && hasAvailableBeds;
    });
    
    filteredHospitals.forEach((hospital) => {
        const li = document.createElement("li");
        const infowindow = new kakao.maps.InfoWindow({
            content: `<div id=content>
            ${hospital.name}<br>${hospital.tel}<br>${hospital.usableBed}/${hospital.totalBed} (가용병상/총병상)</div>`
        });
        li.textContent = hospital.name;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
            const markerData = markers.find((m) => m.name === hospital.name);
            
            if (markerData) {
                map.setCenter(markerData.position);
                if (currentInfoWindow) {
                    currentInfoWindow.close(); 
                }
                currentInfoWindow = infowindow; 
                infowindow.open(map, markerData.marker);
            } 
        });
        li.addEventListener("mouseout", ()=> {
            closeInfoWindow(); 
        })
        resultList.appendChild(li);
    });

    if (filteredHospitals.length === 0) {
        resultList.innerHTML = "<li>검색 결과가 없습니다.</li>";
    }
}

function closeInfoWindow() {
    if (currentInfoWindow) {
        currentInfoWindow.close();
        currentInfoWindow = null; 
    }
}

document.getElementById("searchButton").addEventListener("click", performSearch);

document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); 
        performSearch();
    }
});
