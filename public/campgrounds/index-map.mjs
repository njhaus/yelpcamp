
// Get coordinates if search terms exist
const docCoords = document.getElementById('search-coordinates');
const searchCoords = docCoords
  ? docCoords.innerText.split(',').map(coord => parseFloat(coord))
  : [-94.59179687498357, 39.66995747013945];

// get zoom depending on whether search coordinates have been entered
const docMiles = document.getElementById("search-miles");
const miles = !docMiles ? 10000 : parseInt(docMiles.innerText);
const longitudeRange = (1 / 54) * miles;
const longitudeMax = searchCoords[0] + longitudeRange;
const longitudeMin = searchCoords[0] - longitudeRange;
const latitudeRange = (1 / 69) * miles;
const latitudeMax = searchCoords[1] + latitudeRange;
const latitudeMin = searchCoords[1] - latitudeRange;


// get title filter
const docFilter = document.getElementById("search-title");
const titleFilter = docFilter ? docFilter.innerText : '';

// Get RADAR Map key
const radarKey = async () => {
  try {
    const response = await fetch('/data/getMaptiler');
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

// Zoom in on map based upon search tearms (how many mile radius from location user wants to see campgrounds)
const getZoom = () => {
  if (docCoords && miles) {
    if (miles < 500 && miles >= 200) {
      return 5; 
    }
    if (miles < 200 && miles >= 100) {
      return 6;
    }
    if (miles < 100) {
      return 7;
    }
    else {
      return 3;
    }
  }
  else {
    return 3;
  }
}

const zoom = getZoom();

const cgData = async () => {

  try {
    const response = await fetch('/data/allMapData');
    const data = await response.json();
    const filteredData = data.filter(
      (cg) =>
        cg.title.match(new RegExp(titleFilter, 'i')) &&
        cg.geocode.coordinates[0] < longitudeMax &&
        parseFloat(cg.geocode.coordinates[0]) > longitudeMin &&
        parseFloat(cg.geocode.coordinates[1]) < latitudeMax &&
        parseFloat(cg.geocode.coordinates[1]) > latitudeMin
    );
    if (!response.ok) {
      throw new Error('Request failed. Response status:' + response.status);
    }
    else {
      const key = await radarKey();
      createMap(filteredData, key)
    }
  } catch (err) {
    console.log(err);
  }
}
cgData();

// const cgData = parseData(campgroundsString);
const createMap = (data, key) => {
  // Put campground data into the format expected by the map
  const cgMapData = {
    type: "FeatureCollection",
    features: data.map((cg) => ({
      type: "feature",
      properties: {
        id: cg._id,
        title: cg.title,
        location: cg.location,
        description: cg.description,
        price: cg.price,
        img: cg.img[0]?.url
      },
      geometry: {
        type: "Point",
        coordinates: cg.geocode.coordinates,
      },
    })),
  };
  // FILTER FUNCTION -- filter by property and value! (Probably make these queries on the ejs page so it affects map and campgrond list)

  const container = document.querySelector("#map");

  const map = new maplibregl.Map({
    container: container,
    style:
      `https://api.maptiler.com/maps/streets/style.json?key=${key}`,
    center: searchCoords,
    zoom: zoom,
  });

  map.addControl(new maplibregl.NavigationControl());

  map.on("load", () => {
    // Add a new source from our GeoJSON data and
    // set the 'cluster' option to true. GL-JS will
    // add the point_count property to your source data.
    map.addSource("campgrounds", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ campgrounds
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: cgMapData,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });

    map.addLayer({
      id: "clusters",
      type: "circle",
      source: "campgrounds",
      filter: ["has", "point_count"],
      paint: {
        // Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
        // with three steps to implement three types of circles:
        //   * Blue, 20px circles when point count is less than 100
        //   * Yellow, 30px circles when point count is between 100 and 750
        //   * Pink, 40px circles when point count is greater than or equal to 750
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          10,
          "#f1f075",
          25,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
      },
    });

    map.addLayer({
      id: "cluster-count",
      type: "symbol",
      source: "campgrounds",
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });

    map.addLayer({
      id: "unclustered-point",
      type: "circle",
      source: "campgrounds",
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": "#11b4da",
        "circle-radius": 9,
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
      },
    });

    // inspect a cluster on click
    map.on("click", "clusters", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ["clusters"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource("campgrounds")
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom,
          });
        });
    });

    // When a click event occurs on a feature in
    // the unclustered-point layer, open a popup at
    // the location of the feature, with
    // description HTML from its properties.

    map.on("click", "unclustered-point", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const title = e.features[0].properties.title;
      const location = e.features[0].properties.location;
      const img = e.features[0].properties.img;
      const id = e.features[0].properties.id;

      // Ensure that if the map is zoomed out such that
      // multiple copies of the feature are visible, the
      // popup appears over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
      // Create elements to avoid dangerously setting inner HTML
      // container
        const cgContainer = document.createElement("div");
        cgContainer
          .setAttribute("class", "map-container");
      // Image
      const cgImg = document.createElement("img");
      cgImg.setAttribute("src", img);
        cgImg.setAttribute("width", "100");
        cgImg.setAttribute('class', 'map-img');
      // content-div
      const cgInfo = document.createElement("section");
      cgInfo.setAttribute("class", "map-info");
      // title container
      const cgTitleContainer = document.createElement("div");
      cgInfo.setAttribute("class", "map-title-container");
      // Title text
      const cgTitle = document.createElement("a");
      cgTitle.setAttribute("class", "map-title");
      cgTitle.setAttribute('href', `/campgrounds/${id}`);
        cgTitle.textContent = title;
      // location
      const cgLocation = document.createElement("p");
      cgLocation.textContent = location;
      cgLocation.setAttribute("class", "map-location");

      // Fit content in divs.

      cgTitleContainer.append(cgTitle);
      cgInfo.append(cgTitleContainer, cgLocation);
      cgContainer.append(cgImg, cgInfo);


    new maplibregl.Popup()
        .setLngLat(coordinates)
      .setDOMContent(cgContainer)
      .addTo(map);
      

    });


      map.on("mouseenter", "clusters", () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", () => {
        map.getCanvas().style.cursor = "";
      });
    });
  }