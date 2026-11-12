/**
 * Bedford historical tour content.
 * Coordinates are static approximate landmark pins in [longitude, latitude] order.
 * They are NOT surveyed pedestrian entrances or guaranteed routing snap points.
 * Photography is linked to Wikimedia Commons and credited in the UI.
 */
export type TourSite = {
  id: string;
  name: string;
  address: string;
  coordinate: [longitude: number, latitude: number];
  description: string;
  narration: string;
  sourceUrl: string;
  photoUrl: string;
  photoSourceUrl: string;
  photoCredit: string;
  photoLicense: string;
  privateProperty?: boolean;
};

const commonsPhoto = (filename: string) =>
  'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(filename) + '?width=960';

export const TOUR_SITES: TourSite[] = [
  {
    id: 'old-town-hall',
    name: 'Old Town Hall',
    address: '16 South Road, Bedford, MA 01730',
    coordinate: [-71.279000, 42.491400],
    description: 'Built in 1856, Old Town Hall once housed Bedford town government and school activities. The restored building remains a landmark in the historic town center.',
    narration: 'Welcome to Bedford’s Old Town Hall, built in 1856. Imagine Bedford residents gathering here to discuss town business, attend meetings, and take part in their community. The building was more than a government office: it also served educational and civic functions. As Bedford grew, town services moved to newer buildings. Old Town Hall survived as a reminder of nineteenth-century civic life. Take a moment to look at its windows, roofline, and position near the town common. This site connects Bedford’s present-day community with generations of people who helped shape the town.',
    sourceUrl: 'https://www.bedfordmahistory.org/',
    photoUrl: commonsPhoto('Old Town Hall, Bedford MA.jpg'),
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Old_Town_Hall,_Bedford_MA.jpg',
    photoCredit: 'John Phelan / Wikimedia Commons',
    photoLicense: 'CC BY-SA 3.0',
  },
  {
    id: 'bedford-flag',
    name: 'The Bedford Flag',
    address: 'Bedford Free Public Library, 7 Mudge Way, Bedford, MA 01730',
    coordinate: [-71.28215, 42.49274],
    description: 'The Bedford Flag is an extraordinary surviving colonial-era banner associated with Bedford’s minutemen in April 1775. The original is displayed in a protected space at Bedford Free Public Library.',
    narration: 'This stop celebrates the Bedford Flag, one of the oldest surviving flags associated with the American Revolution. The crimson silk flag bears an armored arm holding a sword and a Latin motto meaning Conquer or Die. It is traditionally associated with the Bedford minutemen who marched toward Concord on April nineteenth, seventeen seventy-five. The banner itself is older than the Revolution, reflecting colonial militia traditions. The original flag is preserved at Bedford Free Public Library, where a carefully controlled display protects its fragile fabric. The flag offers a remarkable connection between Bedford’s local history and the events that helped begin the American Revolution.',
    sourceUrl: 'https://bedfordlibrary.net/about/history/',
    photoUrl: commonsPhoto('Bedford Flag at Bedford Library.png'),
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bedford_Flag_at_Bedford_Library.png',
    photoCredit: 'Bedford Free Public Library / Wikimedia Commons',
    photoLicense: 'Public domain reproduction',
  },
  {
    id: 'fitch-tavern',
    name: 'Fitch Tavern',
    address: '12 Great Road, Bedford, MA 01730',
    coordinate: [-71.283000, 42.493444],
    description: 'Built around 1730, this colonial house became Jeremiah Fitch’s tavern. Bedford minutemen gathered here before marching toward Concord on April 19, 1775. It remains a private residence.',
    narration: 'You are near Fitch Tavern, a historic house built around seventeen thirty. Jeremiah Fitch operated a tavern here in the years leading up to the American Revolution. On the morning of April nineteenth, seventeen seventy-five, Bedford minutemen gathered at the tavern and shared a cold breakfast before assembling to march toward Concord. Those events placed this ordinary-looking house close to an extraordinary moment in American history. The building later passed through several families and still stands today. Fitch Tavern is a private residence, so please remain on public sidewalks and appreciate the building without entering the property.',
    sourceUrl: 'https://revolutionaryvalley.org/listing/fitch-tavern/',
    photoUrl: commonsPhoto('Fitch Tavern, Bedford MA.jpg'),
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Fitch_Tavern,_Bedford_MA.jpg',
    photoCredit: 'Wikimedia Commons contributors',
    photoLicense: 'See file page for license',
    privateProperty: true,
  },
  {
    id: 'bedford-depot',
    name: 'Bedford Depot Park',
    address: '80 Loomis Street, Bedford, MA 01730',
    coordinate: [-71.277081, 42.485889],
    description: 'The Bedford Depot area preserves reminders of the town’s railroad past, including historic station buildings and a rail-trail connection. Passenger rail service once linked Bedford to neighboring communities.',
    narration: 'Welcome to Bedford Depot Park. Bedford’s railroad connection began in the nineteenth century, when trains offered an important link between this town and communities closer to Boston. The old depot area became a center of local transportation and commerce. Passenger rail service eventually ended, but the station buildings and railroad corridor remained part of Bedford’s landscape. Today this area connects the railroad past with recreation, including the nearby Minuteman Bikeway. Look at the preserved buildings and imagine the sound of arriving trains, people waiting on the platform, and goods traveling through town long before modern car traffic dominated the roads.',
    sourceUrl: 'https://bedforddepot.org/about-the-bedford-depot-park-project/',
    photoUrl: commonsPhoto('Bedford Depot Park.jpg'),
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Bedford_Depot_Park.jpg',
    photoCredit: 'Tim Pierce / Wikimedia Commons',
    photoLicense: 'Public domain',
  },
  {
    id: 'job-lane-house',
    name: 'Job Lane House',
    address: '295 North Road, Bedford, MA 01730',
    coordinate: [-71.283950, 42.512870],
    description: 'The Job Lane House is an early-eighteenth-century saltbox-style home and museum linked to an early Bedford family. The town owns the property; seasonal programs explore daily life in colonial Bedford.',
    narration: 'Our final historic home is the Job Lane House on North Road. The oldest portion is believed to date to around seventeen thirteen, making it one of Bedford’s oldest surviving houses. The building’s sloping saltbox roof and traditional wooden construction reveal how homes were built and adapted over generations. The property is associated with the Job Lane family, whose connections to this area reach back to the seventeenth century. Today, the town-owned property is cared for as a museum, with seasonal tours and educational events. Visitors can learn about colonial household life, work, farming, and the people who lived in early Bedford. Check the museum schedule before planning an interior visit.',
    sourceUrl: 'https://joblanefarmmuseum.org/house-tour-programs/',
    photoUrl: commonsPhoto('Job Lane House August 2003.JPG'),
    photoSourceUrl: 'https://commons.wikimedia.org/wiki/File:Job_Lane_House_August_2003.JPG',
    photoCredit: 'Wikimedia Commons contributors',
    photoLicense: 'See file page for license',
  },
];
