
// MAP container
const mapContainer = document.getElementById('map');
map.style.width = '100%';
map.style.height = '100%';
map.style.minHeight = '250px';

// CAMPGROUND id
const cg = document.getElementsByClassName('title')[0];
const cgId = cg.id;

// Get RADAR Map key
const radarKey = async () => {
  try {
    const response = await fetch('/data/getRadar');
    const data = await response.text();
    if (response.ok) {
      return data;
    }
    else {
      throw new Error('Key request failed' + response.status);
    }
  } catch (err) {
    console.log(err);
  }
}

// Get data for specific campground
const cgData = async () => {
  try {
    const response = await fetch(`/data/oneMapData/${cgId}`)
    const data = await response.json();
    if (response.ok) {
      const key = await radarKey();
      createMap(data, key); 
    }
    else {
      throw new Error('Failed request' + response.status);
    }
  } catch (err) {
    console.log(err);
  }
}
cgData();

// Make map 
const createMap = (data, key) => {
  Radar.initialize(key);
  const geoData = data.geocode;

// create a map
const map = Radar.ui.map({
  container: "map",
  style: "radar-default-v1",
  center: geoData.coordinates,
  zoom: 11,
});

// add a marker to the map
const marker = Radar.ui
  .marker({ text: cgData.title })
  .setLngLat(geoData.coordinates)
  .addTo(map);
}
