import {popularityHeatmap} from './popularityHeatmap.js';
import {firstAwardTimeline} from './firstAwardTimeline.js';
import {comparison} from './comparison.js';
// import {airdateTimeline} from './airdateTimeline.js';
// import {popularityBySeason} from './popularityBySeason.js';

const dataPath = "src/assets/data"

popularityHeatmap("story-heatmap", `${dataPath}/contenders.txt`);
firstAwardTimeline("story-timeline", `${dataPath}/top10_data.json`);
comparison("story-comparison", `${dataPath}/contenders.txt`);
// airdateTimeline("story-airdate", `${dataPath}/airdate.txt`);
// popularityBySeason("story-season-popularity", `${dataPath}/season_popularity.json`)