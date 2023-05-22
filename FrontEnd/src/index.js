import "./css/styles.css";
import templateMap from './hbs/Map.hbs';
import templateRoot from './hbs/root.hbs';
import templateNavbar from './hbs/Navbar.hbs';
import tt from "@tomtom-international/web-sdk-maps"
import ipLocation from "./js/ipLocation";
import mapstyle from "./js/maplook";
import jslocation from "./js/jslocation";
import tennisLocation from "./js/tennisLocation";


let appEl = document.getElementById("app");
let mainEl;
appEl.innerHTML = templateRoot({ siteInfo: { title: "Map" } }); 

var distance;
const locationMarkers = [];

window.onload = () => {

	mainEl = document.getElementById("main");
	mainEl.innerHTML = templateMap();

	ipLocation().then((json) => {

		initMap(json);
	});
};
let map;

var markerHeight = 40, markerRadius = 10, linearOffset = 25;
var popupOffsets = {
	'top': [0, 0],
	'top-left': [0, 0],
	'top-right': [0, 0],
	'bottom': [0, -markerHeight],
	'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
	'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
	'left': [markerRadius, (markerHeight - markerRadius) * -1],
	'right': [-markerRadius, (markerHeight - markerRadius) * -1]
};


let initMap = (location) => { 
	map = tt.map({
		key: "tJS1gAM0m7fhCfDwZkkckGd7H0pSyxhC",
		container: "map",
		style: mapstyle, 
		center: [location.long, location.lat], 
		zoom: 10,
		pitch: 10 
	});

	let userLong;
	let userLat;

	jslocation((pos) => {
		userLat = pos.latitude;
		userLong = pos.longitude;
		let pin = new tt.Marker({
			color: 'blue'
		}).setLngLat([pos.longitude, pos.latitude]).addTo(map);
	});

	tennisLocation((tennisPin) => {

		var i = 0;
		for (let park of tennisPin.features) {
			let pin = new tt.Marker().setLngLat([park.long, park.lat]).addTo(map);
			park.mid = i;
			locationMarkers[i] = (pin);
			i = i + 1;
			(function (pin) {
				pin.getElement().addEventListener('click', function (e) {
					map.easeTo({ center: pin.getLngLat(), zoom: 12, pitch: 40, bearing: 40, duration: 2000 });
					e.stopPropagation();
					let pinPos = pin.getLngLat();
					let pinLat = pinPos.lat;
					let pinLong = pinPos.lng;
					const apiKey = "tJS1gAM0m7fhCfDwZkkckGd7H0pSyxhC";
					const distanceUrl = `https://api.tomtom.com/routing/1/calculateRoute/
		${userLat},${userLong}:${pinLat},${pinLong}/json?key=${apiKey}`;

					fetch(distanceUrl)
						.then(response => response.json())
						.then(data => {
							if (distance === null || distance === undefined) {
								distance = document.getElementById("howfaruare");
							}
							var meterDist = data.routes[0].summary.lengthInMeters;
							var kiloDist = meterDist / 1000;
							let outputText = `Distance to marker: ${kiloDist} Kms `;
							distance.innerHTML = outputText;
						})
						.catch(error => {
							console.error('Error:', error);
						});
				});

			})(pin);
		}
		let navEl = document.getElementById("navbar"); 
		navEl.innerHTML = templateNavbar(tennisPin); 
		document.getElementById("selector").addEventListener('change', function (e) {

			let selected = this.options[e.target.selectedIndex];

			let pinLat = selected.dataset.lat;
			let pinLong = selected.dataset.long;
			let pin = locationMarkers[selected.dataset.mid];

			pin.getElement().click();




		});




	});

};
