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
        hosInfoObject.forEach(value => {
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
const getLanLonUrl = "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytBassInfoInqire?serviceKey=6N1JeuU2GFvmzRpDpgjpymP4hREckoNOTCBysivZs3BakGZwtFTvdBNyf3e50vP8BaFH9O4GALYgNiUaHLIuUA%3D%3D&HPID=";

// // 사용 예시

// getLatLon(getLanLonUrl).then(coordinates => {
//     // console.log(coordinates); // [{ lat: "...", lon: "..." }, ...]
//     //coordinates의 lat 값 출력
//     // console.log(coordinates[0].lat); // lat 출력하는법
//     // console.log(coordinates[0].lon); // lon 출력하는법
// });

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.5366059, 126.9771397), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도 생성


// 마커들을 모아놓을 변수
var markers = [];

// 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
function makeOverListener(map, marker, infowindow) {
    return function() {
        infowindow.open(map, marker);
    };
}

// 인포윈도우를 닫는 클로저를 만드는 함수입니다 
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
};

function makeToggleListener(map, marker, infowindow) {
    let isOpen = false; // 인포윈도우가 열려 있는지 여부를 추적하는 변수

    return function() {
        if (isOpen) {
            infowindow.close(); // 인포윈도우가 열려 있다면 닫기
        } else {
            infowindow.open(map, marker); // 인포윈도우가 닫혀 있다면 열기
        }
        isOpen = !isOpen; // 상태 토글
    };
}

(async () => {
    let responseEmer = await fetch("https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire?serviceKey=6N1JeuU2GFvmzRpDpgjpymP4hREckoNOTCBysivZs3BakGZwtFTvdBNyf3e50vP8BaFH9O4GALYgNiUaHLIuUA%3D%3D&STAGE1=%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C&numOfRows=100");
    let t_xml_emer = await responseEmer.text(); // 텍스트 형태로 가져오고
    
    // 자바스크립트로 다루기위해, 파서를 통해 텍스트를 xml문서로 변환한다.
    let parseXMLEmer = new DOMParser();
    let xmlDocEmer = parseXMLEmer.parseFromString(t_xml_emer, "text/xml");
    let emerObject = xmlDocEmer.querySelectorAll("items item");
    emerObject.forEach(value => {
        let name = value.querySelector("dutyName").textContent; //병원 이름
        let hpid = value.querySelector("hpid").textContent; //병원 고유 ID
        let usableBed = value.querySelector("hvec").textContent; //가용병상
        let totalBed = value.querySelector("hvs01").textContent; //보유병상
        let tel = value.querySelector("dutyTel3").textContent; //전화번호
        let updateTime = value.querySelector("hvidate").textContent; //업데이트 최신화 시간
        getLatLon(getLanLonUrl+hpid).then((data) => {
            //마커 생성
            var marker = new kakao.maps.Marker({
                map: map, //마커를 생성할 지도
                position: new kakao.maps.LatLng(data[0].lat, data[0].lon) //마커 위치
            });
                // 마커에 표시할 인포윈도우를 생성합니다 
            var infowindow = new kakao.maps.InfoWindow({
                content: "<br>" + name + "<br>" + tel + "<br>" + usableBed + "/" + totalBed + " (가용병상 / 총병상)<br>" + "&nbsp" // 인포윈도우에 표시할 내용
            });
            //마우스 오버 이벤트
            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker, infowindow));
            //마우스 아웃 이벤트 (오버 상태에서 마우스가 마커에 나갈때 발생하는 이벤트)
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
            //마우스 클릭 이벤트 (토글상태로 다시 클릭하면 인포 윈도우가 사라짐) 
            kakao.maps.event.addListener(marker, 'click', makeToggleListener(map, marker, infowindow));
            //모바일 상태 터치 이벤트 추후 구현
            //kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
        });

        // console.log('============');
        // console.log(name);
        // console.log(hpid);
        // console.log(usableBed);
        // console.log(totalBed);
        // console.log(tel);
        // console.log(updateTime);
    })
})();