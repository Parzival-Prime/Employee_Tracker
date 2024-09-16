import { useEffect } from 'react';


function HomePage() {

  useEffect(() => {
    const platform = new H.service.Platform({
      'apikey': `${import.meta.env.VITE_HERE_MAP_API_KEY}`
    })

    // console.log("platform object:", platform)

    // configure an OMV service to use the `core` enpoint
    var omvService = platform.getOMVService({ path: 'v2/vectortiles/core/mc' });
    var baseUrl = 'https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/';

    // create a Japan specific style
    var style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);

    // instantiate provider and layer for the basemap
    var omvProvider = new H.service.omv.Provider(omvService, style);
    var omvlayer = new H.map.layer.TileLayer(omvProvider, { max: 22 });

    // instantiate (and display) a map:
    var map = new H.Map(
      document.getElementById('mapContainer'),
      omvlayer,
      {
        zoom: 8,
        center: { lat: 26.6937, lng: 80.5629 }
      });
  }, [])

  return (
    <div>
      {/* <h1>HomePage</h1> */}
      <div id="mapContainer" style={{ height: '100vh', width: '100%' }}></div>
    </div>
  )
}

export default HomePage
