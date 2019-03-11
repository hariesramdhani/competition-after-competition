export const popularityBySeason = function(id, filename) {
    
    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }

    let padding = 40;

    let height = 300 - margin.left - margin.right,
        width = 750 - margin.top - margin.bottom;

    let svg = d3.select(`#${id}`)
                .append("div")
                .attr("id", "svg-container-popularity")
                .append("svg")
                .attr("preserveAspectRation", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +  (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true);
    
    let tooltip = d3.select(`#story`)
                    .append("div")
                    .style("position", "fixed")
                    .style("z-index", 1)
                    .style("visibility", "hidden");

    let circleLinePosition = 150;

    let circleScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([5, 30]);
    
    let circleColor = ["7EAB6F", "8DC17D", "9DD68B", "ACEB98", "B3ECA1", "BBEEAA", "C2F0B4", "CAF2BD", "D1F4C6"];

    d3.json(filename, (error, data) => {

        svg.append("g")
            .append("text")
            .attr("id", "season-popularity-label")
            .attr("y", 215)
            .attr("x", width/2)
            .text("HOVER OVER THE GREEN COLORED CIRCLE")
            .attr("fill", "#B3ECA1")
            .style("font-size", "18px")
            .attr("text-anchor", "middle")


        svg.append("g")
            .selectAll(".popularity-circle")
            .data(data)
            .enter().append("circle")
            .classed("popularity-circle", true)
            .attr("r", d => {
                return circleScale(d.popularity.all);
            })
            .attr("cx", (d, i) => {
                return i * 80 + padding;
            })
            .attr("cy", circleLinePosition)
            .attr("fill", d => {
                return `#${circleColor[d.season - 1]}`;
            })
            .style("opacity", 0.5)
            .on("mouseover", function(d, i) {

                let data = d3.select(this).data()[0]

                // Remove the 'all' key because it's not needed
                let logoIds = Object.keys(data.popularity).slice(1,);
                let logoIdValues = Object.values(data.popularity).slice(1,);

                for (let key in logoIds) {

                    let percentage = (logoIdValues[key] != '-' ) ? (logoIdValues[key] * 100).toFixed(0) +"%" : "-";

                    d3.select(`#logo-label-${logoIds[key]}`)
                        .transition(1000)
                        .text(`${percentage}`)

                }

                d3.select("#season-popularity-label")
                    .transition(1000)
                    .text(`SEASON ${i+1} (${data.popularity.all * 100}%)`)

                d3.selectAll(".popularity-circle")
                    .transition(1000)
                    .style("opacity", 0.3)

                d3.select(this)
                    .transition(1000)
                    .style("opacity", 1);

                d3.select(`#popularity-circle-border-${i}`)
                    .transition(500)
                    .style("opacity", 0.5)
            })
            .on("mouseout", function(d, i) {

                d3.selectAll(".logo-labels")
                    .transition(1000)
                    .delay(1000)
                    .text("-")

                d3.selectAll(".popularity-circle")
                    .transition(1000)
                    .style("opacity", 0.5)

                d3.select("#season-popularity-label")
                    .transition(1000)
                    .delay(1000)
                    .text("HOVER OVER THE GREEN COLORED CIRCLE")

                d3.select(`#popularity-circle-border-${i}`)
                    .transition(500)
                    .style("opacity", 0)
            })

    let circleBorderLabels = svg.append("g")
            .classed(".popularity-circle-borders", true)
            .selectAll(".popularity-circle-border")
            .data(data)
            .enter().append("circle")
            .attr("r", d => {
                return circleScale(d.popularity.all) + 5;
            })
            .attr("cx", (d, i) => {
                return i * 80 + padding;
            })
            .attr("cy", circleLinePosition)
            .attr("fill", d => {
                return "none";
            })
            .classed("popularity-circle-border", true)
            .attr("id", (d, i) => {
                return `popularity-circle-border-${i}`;
            })
            .style("stroke", "white")
            .style("stroke-dasharray", ("5, 5"))
            .attr("opacity", 0);

    })

    let logoData = ["AFI", "II", "MMI", "TVI", "DA", "RSI", "IMB", "XFI"]

    svg.append("g")
        .selectAll(".logo-labels")
        .data(logoData)
        .enter().append("text")
        .classed("logo-labels", true)
        .attr("x", (d, i) => {
            return i * 80 + 90;
        })
        .attr("y", 100)
        .text("-")
        .attr("fill", "#B3ECA1")
        .style("font-size", "20px")
        .attr("text-anchor", "middle")
        .attr("id", d => {
            return `logo-label-${d}`;
        })

    svg.append("g")
        .selectAll(".logos")
        .data(logoData)
        .enter().append("svg:image")
        .classed("logos", true)
        .attr("x", (d, i) => {
            return i * 80 + 60;
        })
        .attr("y", 20)
        .attr("width", 50)
        .attr("height", 50)
        .attr("xlink:href", d => {
            let iconName = d;

            let iconDir = `src/assets/img/logo/${iconName}.png`;

            return iconDir;
        })
        .attr("id", d => {
            return `logo-${d}`;
        })


}