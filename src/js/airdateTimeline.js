export const airdateTimeline = function(id, filename) {
    
    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }

    let height = 200 - margin.left - margin.right,
        width = 690 - margin.top - margin.bottom;

    let padding = 40;

    let parseDate = d3.timeParse("%m/%d/%Y");

    let svg = d3.select(`#${id}`)
                .append("div")
                .attr("id", "svg-container-airdate")
                .append("svg")
                .attr("preserveAspectRation", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +  (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true)
                .attr("z-index", 0);

    // Create the timeline for airdate
    svg.append("line")
        .style("stroke", "white")
        .attr("x1", padding)
        .attr("y1", height / 2)
        .attr("x2", width)
        .attr("y2", height / 2)
        // .style("stroke-dasharray", ("7, 7"))
        .style("stroke-width", 2)
        .style("z-index", 2)
    
    d3.tsv(filename, (error, data) => {

        if (error) {
            throw error
        }
    
        const timelineScale = d3.scaleTime()
                                        .domain([
                                            d3.min(data, d => {
                                                return parseDate(d.date);
                                            }),
                                            d3.max(data, d=> {
                                                return parseDate(d.date);
                                            })
                                        ])
                                        .range([padding, width]);
    
        svg.append("g")
            .selectAll(".airdate-timeline-event")
            .data(data)
            .enter().append("circle")
            .classed(".airdate-timeline-event", true)
            .attr("r", 5)
            .attr("cx", d=> {
                console.log(parseDate(d.date));
                return timelineScale(parseDate(d.date));
            })
            .attr("cy", height/2)
            .attr("fill", d => {
                if (d.name == "Akademi Fantasi Indosiar") {
                    return "#D88743";
                } else if (d.name == "Indonesian Idol") {
                    return "#85B4FF";
                } else if (d.name == "D'Academy") {
                    return "#8AE49C";
                } else if (d.name == "The Voice Indonesia") {
                    return "#FFDA4A";
                } else if (d.name == "X Factor Indonesia") {
                    return "#FF914A";
                } else if (d.name == "Mammamia Show Indonesia") {
                    return "#D55154";
                }
            })
            .style("opacity", 0.5);
                
    })

    let controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        triggerElement: "#airdate-fade",
        triggerHook: 0.3
    })
    .on("enter", () => {        
        d3.select("#svg-container-airdate")
            .style("visibility", "hidden");
    })
    .on("leave", () => {
        d3.select("#svg-container-airdate")
            .style("visibility", "visible");
    })
    .addIndicators({name: "airdate-fade"})
    .addTo(controller);

}