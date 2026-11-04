/** Verified Bedford historical landmark locations. Longitude, latitude order.
 * These are approximate public landmark pins, NOT entrance, crosswalk, or routing waypoints.
 * Do not connect the dots with invented route geometry.
 */
export type HistoricPoint = {
  id: string; name: string; subtitle: string; address: string;
  longitude: number; latitude: number; source: string;
};
export const HISTORIC_POINTS: HistoricPoint[] = [
  {
    id: 'old-town-hall', name: 'Old Town Hall', subtitle: '1856 town hall and civic landmark',
    address: '16 South Road, Bedford, MA 01730',
    longitude: -71.279000, latitude: 42.491400,
    source: 'https://commons.wikimedia.org/wiki/File:Old_Town_Hall,_Bedford_MA.jpg',
  },
  {
    id: 'revolutionary-memorial', name: 'Revolutionary War Memorial',
    subtitle: 'Honoring Bedford’s Revolutionary War participants',
    address: 'Old Burying Ground, Springs Road, Bedford, MA',
    longitude: -71.278617, latitude: 42.492733,
    source: 'https://www.hmdb.org/m.asp?m=309603',
  },
  {
    id: 'bedford-depot', name: 'Bedford Depot', subtitle: 'Historic railroad depot and rail trail',
    address: '80 Loomis Street, Bedford, MA 01730',
    longitude: -71.276014, latitude: 42.485958,
    source: 'https://en.wikipedia.org/wiki/National_Register_of_Historic_Places_listings_in_Middlesex_County,_Massachusetts',
  },
  {
    id: 'job-lane-house', name: 'Job Lane House', subtitle: 'Early 18th-century saltbox home',
    address: '295 North Road, Bedford, MA 01730',
    longitude: -71.283950, latitude: 42.512870,
    source: 'https://treealive.com/nr/73000278',
  },
  {
    id: 'wilson-mill', name: 'Wilson Mill Historic District marker',
    subtitle: 'A centuries-old mill site along Vine Brook',
    address: 'Wilson Mill Historic District, Bedford, MA',
    longitude: -71.246110, latitude: 42.501290,
    source: 'https://mapcarta.com/N12802388154',
  },
];
