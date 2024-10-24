const userLocationButton = document.getElementById("myLocationButton");

// 마커 이미지 설정
var userImageSrc = "img/emer.png", // 유저 마커 이미지 주소
    userImageSize = new kakao.maps.Size(40, 40); // 유저 마커이미지의 크기

// 마커의 이미지정보를 가지고 있는 마커이미지를 생성
var userMarkerImage = new kakao.maps.MarkerImage(userImageSrc, userImageSize, imageOption);

var userLat = "",
    userLon = "";

// HTML5의 geolocation으로 사용할 수 있는지 확인
if (navigator.geolocation) {
    // GeoLocation을 이용해서 접속 위치를 얻기
    navigator.geolocation.getCurrentPosition(function (position) {
        (userLat = position.coords.latitude), // 위도
            (userLon = position.coords.longitude); // 경도

        // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성
        var locPosition = new kakao.maps.LatLng(userLat, userLon);

        // 마커를 표시
        displayMarker(locPosition);
        // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
        var locPosition = new kakao.maps.LatLng(37.433008, 127.001686);

        displayMarker(locPosition);
    });
} else {
    // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정
    var locPosition = new kakao.maps.LatLng(37.433008, 127.001686);

    displayMarker(locPosition);
}

// 내 위치 버튼을 눌러 내 위치로 부드럽게 이동
userLocationButton.addEventListener("click", function () {
    // 이동할 유저의 위도 경도 위치를 생성합니다
    var moveLatLon = new kakao.maps.LatLng(userLat, userLon);
    map.panTo(moveLatLon);
});

// 지도에 유저마커를 표시하는 함수
function displayMarker(locPosition) {
    // 유저마커를 생성
    var marker = new kakao.maps.Marker({
        map: map,
        position: locPosition,
        image: userMarkerImage,
    });

    // 커스텀 오버레이 (퍼지는 효과)를 생성
    var customOverlay = new kakao.maps.CustomOverlay({
        map: map,
        content: `<div class="myLocation"></div>`,
        position: locPosition,
    });
    // 지도 중심좌표를 접속위치로 변경
    map.setCenter(locPosition);
}
