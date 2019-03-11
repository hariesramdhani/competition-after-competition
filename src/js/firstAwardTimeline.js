export const firstAwardTimeline = function(id, filename) {

    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }

    let padding = 200;

    let parseDate = d3.timeParse("%m/%d/%Y");

    let height = 1500 - margin.left - margin.right,
        width = 1500 - margin.top - margin.bottom;

    let svg = d3.select(`#${id}`)
                .append("div")
                .attr("id", "svg-container-timeline")
                .append("svg")
                .attr("preserveAspectRation", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +  (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true);
    
    let tooltip = d3.select("#story")
                .append("div")
                .style("position", "fixed")
                .style("z-index", 1)
                .style("visibility", "hidden");;


    let icon = {
        size: 100,
        padding: 40
    }


    d3.json(filename, (error, data) => {
        
        if (error) {
            throw error;
        }

        svg.append("g")
            .selectAll(".timeline-icon")
            .data(data)
            .enter().append("svg:image")
            .classed("timeline-icon", true)
            .attr("x", 0)
            .attr("y", (d, i) => {
                return i * (icon.size + icon.padding) + icon.size/2
            })
            .attr("width", icon.size)
            .attr("height", icon.size)
            .attr("xlink:href", d => {
                let iconName = d.name.split(" ")[0].toLowerCase();

                let iconDir = `src/assets/img/${iconName}.png`;

                return iconDir;
            })
            .on("mouseover", (d) => {
                tooltip.html(`
                <div class="timeline-tooltip">
                    <span class="title-bold">${d.name.toUpperCase()}</span></br>
                    ${d.competition} Season ${d.season} (${d.rank}) </br>
                    Nominations: ${d["awards nominated"]}</br>
                    Awards Won: ${d["awards won"]}
                </div>
                `)

                tooltip.style("visibility", "visible");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", () => {
                tooltip.style("top", (d3.event.clientY - 55) + 'px').style("left", (d3.event.clientX + 50) + 'px');    
            })

        let timelinePoints = {
            end: [],
            start: []
        }

        for(let i = 0; i < data.length; i++) {

            let timelineScale = d3.scaleTime()
                                .domain(
                                    [
                                        d3.min(data[i].timeline, d => {
                                            return parseDate(d.date)
                                        }),
                                        d3.min(data[i].timeline, d => {
                                            let maxTimelineYear = parseInt(d.date.substring(6,)) + 7;

                                            let maxTimelineDate = d.date.substring(0, 6) + maxTimelineYear.toString();
                                            return parseDate(maxTimelineDate);
                                        })
                                    ]
                                )
                                .range([padding, width - icon.size]);
            
            let timelinePoint = {
                end: timelineScale(parseDate(data[i].timeline[data[i].timeline.length - 1].date)),
                start: parseDate(data[i].timeline[0].date)
            }
            
            timelinePoints.end.push(timelinePoint.end);
            timelinePoints.start.push(timelinePoint.start);

            svg.append("g")
                .selectAll(".timeline-event")
                .data(data[i].timeline)
                .enter().append("circle")
                .classed("timeline-event", true)
                .attr("r", d => {
                    return 15;
                })
                .attr("cx", d => {
                    return timelineScale(parseDate(d.date));
                })
                .attr("cy", i * (icon.size + icon.padding) + icon.size)
                .attr("opacity", 0.5)
                .attr("fill", d => {
                    if (d.type == "Competition") {
                        return "None";
                    } else if (d.type == "Movie") {
                        return "#85B4FF";
                    } else if (d.type == "Single") {
                        return "#8AE49C";
                    } else if (d.type == "Album") {
                        return "#FFDA4A";
                    } else if (d.type == "Nominated") {
                        return "#FF914A";
                    } else if (d.type == "Award Won") {
                        return "#D55154";
                    } else if (d.type == "FTV") {
                        return "#934B83";
                    }
                })
            
                .on("mouseover", function(d) {

                    let textPadding = 20;

                    let rowTime = {
                        start: timelinePoints.start[(d3.select(this).attr("cy") - 100) / (icon.size + icon.padding)],
                        end: parseDate(d3.select(this).data()[0].date)
                    }

                    let event = {
                        type: d3.select(this).data()[0].type,
                        desc: d3.select(this).data()[0].event
                    }
                    
                    let newRadius = parseInt(d3.select(this).attr("r"))*1.5;
                    d3.select(this).style("r", newRadius);

                    svg.append("text")
                    
                        .classed("mouse-over-timeline-year", true)
                        .attr("y", parseInt(d3.select(this).attr("cy")) - textPadding)
                        .attr("x", padding)
                        .text(rowMonthToYear(rowTime.end, rowTime.start))
                        .style("font-size", "2em")
                        .style("fill", "white")
                            
                    svg.append("text")
                        .classed("mouse-over-timeline-desc", true)
                        .attr("y", parseInt(d3.select(this).attr("cy")) + textPadding * 2)
                        .attr("x", padding)
                        .html("" + event.type + " : " + event.desc)
                        .style("font-size", "2em")
                        .style("fill", "white")
                        .style("fill", () => {
                            let type = d3.select(this).data()[0].type;

                            if (type == "Competition") {
                                return "None";
                            } else if (type == "Movie") {
                                return "#85B4FF";
                            } else if (type == "Single") {
                                return "#8AE49C";
                            } else if (type == "Album") {
                                return "#FFDA4A";
                            } else if (type == "Nominated") {
                                return "#FF914A";
                            } else if (type == "Award Won") {
                                return "#D55154";
                            } else if (d.type == "FTV") {
                                return "#934B83";
                            }
                        })                    
                })
                .on("mouseout", function() {

                    d3.selectAll(".mouse-over-timeline-desc").remove();
                    d3.selectAll(".mouse-over-timeline-year").remove();

                    let newRadius = parseInt(d3.select(this).attr("r"));
                    
                    d3.select(this).style("r", newRadius);
                })



        }

        // Create the timeline axes
        svg.append("g")
            .selectAll(".timeline-axes")
            .data(data)
            .enter().append("line")
            .style("stroke", "white")
            .attr("x1", padding)
            .attr("y1", (d, i) => {
                return i * (icon.size + icon.padding) + icon.size;
            })
            .attr("x2", (d, i) => {
                return timelinePoints.end[i];
            })
            .attr("y2", (d, i) => {
                return i * (icon.size + icon.padding) + icon.size;
            })
            .style("stroke-dasharray", ("7, 7"));
    })
    
    
}

const rowMonthToYear = (rowEndTime, rowStartTime) => {
    let timeInMonth = 1000 * 60 * 60 * 24 * 30;

    let totalMonths = (rowEndTime - rowStartTime)/timeInMonth;

    if (totalMonths < 12 && totalMonths > 1) {
        return Math.floor(totalMonths) + " months after the competition";
    } else if (totalMonths <= 1 && totalMonths >= 0) { 
        return "At the same month with the end of competition";
    } else {
        let totalYears = Math.floor(totalMonths/12);
        let remainingMonths = Math.floor(totalMonths % 12);

        if (totalYears > 1 && remainingMonths > 1) {
            return totalYears + " years and " + remainingMonths + " months after the competition";
        } else if (totalYears > 1 && remainingMonths == 1) {
            return totalYears + " years and " + remainingMonths + " month after the competition";
        } else if (totalYears == 1 && remainingMonths > 1) {
            return totalYears + " year and " + remainingMonths + " months after the competition";
        } else {
            return totalYears + " year after the competition";
        }
    }
}