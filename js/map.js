const toggleInput = document.getElementById("mode-toggle");

toggleInput.addEventListener("change", () => {
    markers.forEach((markerData) => {
        const { marker, usableBed } = markerData;

        if (toggleInput.checked) {
            // 토글이 체크된 경우: 가용병상이 없는 병원 마커 숨김
            if (usableBed <= 0) {
                marker.setMap(null);
            } else {
                marker.setMap(map);
            }
        } else {
            // 토글이 체크 해제된 경우: 모든 병원 마커 보임
            marker.setMap(map);
        }
    });
});

// getLatLon(url) => url을 파라미터로 받아서 위도와 경도를 배열로 리턴하는 함수
async function getLatLon(url) {
    try {
        let responseHosInfo = await fetch(url);
        if (!responseHosInfo.ok) {
            throw new Error(`HTTP error! status: ${responseHosInfo.status}`);
        }
        let t_xml_hosInfo = await responseHosInfo.text();
        let parseXMLHosInfo = new DOMParser();
        let xmlDocHosInfo = parseXMLHosInfo.parseFromString(t_xml_hosInfo, "text/xml");
        let hosInfoObject = xmlDocHosInfo.querySelectorAll("items item");

        // lat, lon 값을 담을 배열 생성
        let coordinates = [];
        hosInfoObject.forEach((value) => {
            let lat = value.querySelector("wgs84Lat").textContent;
            let lon = value.querySelector("wgs84Lon").textContent;
            coordinates.push({ lat, lon });
        });
        return coordinates; // lat, lon 객체 배열 반환
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // 에러 발생 시 null 반환
    }
}

const getLanLonUrl =
    "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire?serviceKey=6N1JeuU2GFvmzRpDpgjpymP4hREckoNOTCBysivZs3BakGZwtFTvdBNyf3e50vP8BaFH9O4GALYgNiUaHLIuUA%3D%3D&HPID=";

// // 사용 예시

// getLatLon(getLanLonUrl).then(coordinates => {
//     // console.log(coordinates); // [{ lat: "...", lon: "..." }, ...]
//     //coordinates의 lat 값 출력
//     // console.log(coordinates[0].lat); // lat 출력하는법
//     // console.log(coordinates[0].lon); // lon 출력하는법
// });

var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.5366059, 126.9771397), // 지도의 중심좌표
        level: 8, // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성

// 마커 이미지 설정
var redImageSrc = "img/redMarker.png", // 빨간마커이미지 주소
    greenImageSrc = "img/greenMarker.png", // 초록마커이미지 주소
    imageSize = new kakao.maps.Size(25, 38), // 마커이미지의 크기
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

// 마커의 이미지정보를 가지고 있는 마커이미지를 생성
var greenMarkerImage = new kakao.maps.MarkerImage(greenImageSrc, imageSize, imageOption);
var redMarkerImage = new kakao.maps.MarkerImage(redImageSrc, imageSize, imageOption);

// 병원 정보를 모아놓을 변수
let hospitalData = [];
// 마커들을 모아놓을 변수
var markers = [];

let currentOverlay = null; // 전역 변수로 오버레이 인스턴스를 저장

// 마커와 커스텀 오버레이를 추가하는 함수
async function addMarkerWithOverlay(data, name, tel, usableBed, totalBed, updateTime) {
    const markerPosition = new kakao.maps.LatLng(data[0].lat, data[0].lon);
    const marker = new kakao.maps.Marker({
        map: map,
        position: markerPosition,
        image: usableBed > 0 ? greenMarkerImage : redMarkerImage,
    });
    markers.push({
        marker,
        position: markerPosition,
        name,
        tel,
        usableBed,
        totalBed,
        updateTime,
    });

    // 병상 가용 여부에 따라 클래스 설정
    let overlayClass = usableBed > 0 ? "greenOverlay" : "redOverlay";
    let bedClass = usableBed > 0 ? "greenBed" : "redBed";

    // 커스텀 오버레이에 표시할 내용
    var content = `
    <div class="infoWindow ${overlayClass}">
      <div class="box">
          <h4 class="name">${name}</h4>
          <p class="tel">${tel}</p>
          <p class="bedCount ${bedClass}">${usableBed}/${totalBed}</p>
          <p class="updateTime">갱신시간 : ${updateTime.substr(8, 2)}시 ${updateTime.substr(10, 2)}분</p>
      </div>
        <div class="close" onclick="closeOverlay()" title="닫기"></div>
      </div>
    </div>`;

    // 커스텀 오버레이 생성
    const overlay = new kakao.maps.CustomOverlay({
        content: content,
        map: null, // 초기에는 지도에 표시하지 않음
        position: marker.getPosition(),
    });

    // 마커에 클릭 이벤트 추가
    kakao.maps.event.addListener(marker, "click", function () {
        // 현재 오버레이가 열려있으면 닫고, 없으면 열기
        if (currentOverlay) {
            currentOverlay.setMap(null); // 현재 열려 있는 오버레이를 닫음
        }

        if (currentOverlay !== overlay) {
            // 새로운 오버레이가 열려야 할 경우에만 설정
            overlay.setMap(map);
            currentOverlay = overlay; // 현재 오버레이로 설정
        } else {
            currentOverlay = null; // 같은 오버레이를 클릭하면 현재 오버레이를 null로 설정
        }
    });

    // 마우스 오버 이벤트
    kakao.maps.event.addListener(marker, "mouseover", function () {
        overlay.setMap(map);
    });

    // 마우스 아웃 이벤트
    kakao.maps.event.addListener(marker, "mouseout", function () {
        overlay.setMap(null);
    });
}

//모바일 상태 터치 이벤트 추후 구현
//kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));

// 인포윈도우 닫기 함수
function closeOverlay(overlay) {
    overlay.setMap(null);
}
//인포윈도우 닫기 함수
// function closeOverlay() {
//   if (currentOverlay) {
//     currentOverlay.setMap(null); // 현재 오버레이 닫기
//     currentOverlay = null; // 현재 오버레이 변수 초기화
//   }
// }

//서울의 응급실들의 데이터 가공
(async () => {
    let responseEmer = await fetch(
        "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=6N1JeuU2GFvmzRpDpgjpymP4hREckoNOTCBysivZs3BakGZwtFTvdBNyf3e50vP8BaFH9O4GALYgNiUaHLIuUA%3D%3D&STAGE1=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&numOfRows=100"
    );
    let t_xml_emer = await responseEmer.text(); // 텍스트 형태로 가져오고

    // 자바스크립트로 다루기위해, 파서를 통해 텍스트를 xml문서로 변환한다.
    let parseXMLEmer = new DOMParser();
    let xmlDocEmer = parseXMLEmer.parseFromString(t_xml_emer, "text/xml");
    let emerObject = xmlDocEmer.querySelectorAll("items item");
    emerObject.forEach((value) => {
        let name = value.querySelector("dutyName").textContent; // 병원 이름
        let hpid = value.querySelector("hpid").textContent; // 병원 고유 ID
        let usableBed = value.querySelector("hvec").textContent; // 가용병상
        let totalBed = value.querySelector("hvs01").textContent; // 보유병상
        let tel = value.querySelector("dutyTel3").textContent; // 전화번호
        let updateTime = value.querySelector("hvidate").textContent; //업데이트 최신화 시간

        hospitalData.push({ name, hpid, usableBed, totalBed, tel });

        getLatLon(getLanLonUrl + hpid).then((data) => {
            addMarkerWithOverlay(data, name, tel, usableBed, totalBed, updateTime);
        });
        // console.log("============");
        // console.log(name);
        // console.log(hpid);
        // console.log(usableBed);
        // console.log(totalBed);
        // console.log(tel);
        // console.log(updateTime);
    });
})();
// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);
