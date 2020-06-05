const BUFFER_NORTH = 5;
const BUFFER_EAST = 15;
const BUFFER_SOUTH = -10;
const BUFFER_WEST = -20;
const SIN_LATITUDE =   1.35019;
const SIN_LONGITUDE =  103.994003;

export const setZoomAndGeoPointFocus = ( chartObj, north, east, south, west, zoomlevel, center, duration ) => {
          if(east<SIN_LONGITUDE) east = SIN_LONGITUDE;
          if(west>SIN_LONGITUDE) west = SIN_LONGITUDE;
          if(north<SIN_LATITUDE) north = SIN_LATITUDE;
          if(south>SIN_LATITUDE) south = SIN_LATITUDE;
          //if(east >130) east -=50; 

          requestAnimationFrame( () => {
          chartObj.zoomToRectangle(
                    north + BUFFER_NORTH ,
                    east + BUFFER_EAST,
                    south + BUFFER_SOUTH,
                    west + BUFFER_WEST,
                    zoomlevel,
                    center,
                    duration
                  )
          }
        );
};