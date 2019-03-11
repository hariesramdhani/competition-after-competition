# Competition After Competition: A Dataviz Essay
A dataviz of the journey of breaking into Indonesia's entertainment industry and trying to make it big after the talent shows

### Built With
- **D3.js** for the data visualizations
- **ScrollMagic.js** for the scroll animation
- **Pandas** for the data analysis

### Repo Structures
- **design** - stores the initial design of the web page
- **src** - stores the js, css source codes
  - **assets** - stores data, images and global scripst (d3.js & scrollmagic)
  - **css** - the css script goes here
  - **js** - stores js codes (mostly the codes to generate the visualizations)
  
### Data
- airdate.txt - the airdate of the shows data 
  - `date`: initial date of the shows
- contenders.txt - the data of the contenders of the 31 different shows
  - `rank`: rank of the contenders
  - `monthly_listener`: amount of spotify monthly listeners
- contenders_season.txt - a fixed version of the contenders.txt (seasons showing the right numbers)
- season_popularity.json - the popularity of the shows by season data, the `keys` are the initial names of the shows
- top10_data.json - the data of the Top 10 contenders with the highest number of awards won, the keys should be explanatory
