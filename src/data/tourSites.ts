/** Historic sites and addresses checked against Bedford's municipal and preservation sources. */
export type TourSite = {
  id: string;
  name: string;
  address: string;
  description: string;
  sourceUrl: string;
  privateProperty?: boolean;
};
export const TOUR_SITES: TourSite[] = [
  {
    id: 'old-town-hall',
    name: 'Old Town Hall',
    address: '16 South Road, Bedford, MA 01730',
    description: 'Built in 1856, Bedford’s Old Town Hall once held town offices and classrooms. Today it hosts the Bedford Historical Society museum.',
    sourceUrl: 'https://www.bedfordmahistory.org/',
  },
  {
    id: 'bedford-flag',
    name: 'The Bedford Flag',
    address: '7 Mudge Way, Bedford, MA 01730',
    description: 'The historic Bedford Flag, carried to Concord in 1775, is displayed at Bedford Free Public Library. Visit during library opening hours to see it.',
    sourceUrl: 'https://www.bedfordma.gov/DocumentCenter/View/908/Bedford-Cultural-District-Assets-Guide-PDF',
  },
  {
    id: 'fitch-tavern',
    name: 'Fitch Tavern',
    address: '12 Great Road, Bedford, MA 01730',
    description: 'Bedford minutemen gathered here before their march on April 19, 1775. This historic house is a private residence; view only from public space.',
    sourceUrl: 'https://revolutionaryvalley.org/listing/fitch-tavern/',
    privateProperty: true,
  },
  {
    id: 'bedford-depot',
    name: 'Bedford Depot Park',
    address: '80 Loomis Street, Bedford, MA 01730',
    description: 'Explore restored railroad buildings and the history of the Minuteman Bikeway, at the former Bedford railroad terminus.',
    sourceUrl: 'https://bedforddepot.org/about-the-bedford-depot-park-project/',
  },
  {
    id: 'job-lane-house',
    name: 'Job Lane House',
    address: '295 North Road, Bedford, MA 01730',
    description: 'A circa-1713 colonial saltbox house and museum associated with one of Bedford’s founding families. Interior tours are seasonal.',
    sourceUrl: 'https://bedfordmahistory.org/job_lane_house.htm',
  },
];
