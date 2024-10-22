const myLocationButton = document.getElementById("myLocationButton");

// 마커 이미지 설정
var imageSrc = "img/emer.png", // 이미지 주소
    imageSize = new kakao.maps.Size(40, 40), // 마커이미지의 크기
    imageOption = { offset: new kakao.maps.Point(27, 69) }; // 마커이미지의 옵션

// 마커의 이미지정보를 가지고 있는 마커이미지를 생성
var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
var lat = "",
    lon = "";

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다
if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function (position) {
        (lat = position.coords.latitude), // 위도
            (lon = position.coords.longitude); // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다 // 인포윈도우에 표시될 내용입니다

        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition);

        myLocationButton.addEventListener("click", function () {
            panTo();
        });
    });
} else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    var locPosition = new kakao.maps.LatLng(37.433008, 127.001686);

    displayMarker(locPosition);
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(locPosition) {
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
        image: markerImage,
        // class: myLocation,
    });

    // 커스텀 오버레이 (퍼지는 효과)를 생성합니다
    var customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        content: `<div class="myLocation"></div>`,
        position: locPosition,
    });
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);
}

function panTo() {
    // 이동할 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(lat, lon);

    // 지도 중심을 부드럽게 이동시킵니다
    // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
    map.panTo(moveLatLon);
}
