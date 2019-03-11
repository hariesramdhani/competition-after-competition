export const popularityHeatmap = function(id, filename) {

    
    
    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }

    let height = 500 - margin.left - margin.right,
        width = 680 - margin.top - margin.bottom;

    let svg = d3.select(`#${id}`)
                .append("div")
                .attr("id", "svg-container-heatmap")
                .append("svg")
                .attr("preserveAspectRation", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +  (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true);
    
    let tooltip = d3.select(`#story`)
                    .append("div")
                    .style("position", "fixed")
                    .style("z-index", 1)
                    .style("visibility", "hidden");;

    let cell = {
        size: 18,
        padding: 2,
        margin: {
            left: 25,
            top: 120
        }
    }

    let opacity = {
        label: {
            noEvent : 0,
            mouseOver: 0,
            mouseOut: 0
        }
    }

    let legendData = null;
    let legendLine = null;
    let legendPath = null;
    let legendMid = null;
    let legendLabel = null;

    d3.tsv(filename, (error, data) => {
        
        if (error) {
            throw error;
        }

        legendMid = {
            horizontal: (35 * (cell.size + cell.padding) + cell.margin.left)/2,
            vertical: (13 * (cell.size + cell.padding) + cell.margin.top) /2
        }


        legendData = [
            {
                x: cell.margin.left + cell.size/2,
                y: 13 * (cell.size + cell.padding) + cell.margin.top 
            }, {
                x: cell.margin.left + cell.size/2,
                y: cell.margin.top + cell.size/2
            }, {
                x: 32 * (cell.size + cell.padding) + cell.margin.left,
                y: cell.margin.top + cell.size/2
            }
        ]

        legendLine = d3.line()
                        .x(d => {return d.x})
                        .y(d => {return d.y});

        svg.append("text")
            .classed("legend", true)
            .attr("fill", "white")
            .text("TALENT SHOW")
            .attr("x", legendMid.horizontal)
            .attr("y", cell.margin.top)
            .attr("text-anchor", "middle")
            .style("opacity", 0);

        svg.append("text")
            .classed("legend", true)
            .attr("fill", "white")
            .text("RANK")
            .attr("x", cell.margin.left)
            .attr("y", legendMid.vertical)
            .attr("transform", "translate(-165, 285) rotate(-90)")
            .attr("text-anchor", "middle")
            .style("opacity", 0);
        
        

        legendPath = svg.append("path")
                        .data([legendData])
                        .classed("legend", true)
                        .attr("d", legendLine)
                        .attr("fill", "none")
                        .attr("stroke", "white")
                        .style("stroke-dasharray", ("5, 5"))
                        .style("opacity", 0);
                        


        svg.selectAll(".cell")
            .data(data)
            .enter().append("rect")
            .classed("cell", true)
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", d => {
                return d.season * (cell.size + cell.padding) + cell.margin.left;
            })
            .attr("y", d => {
                return d.rank * (cell.size + cell.padding) + cell.margin.top;
            })
            .attr("width", cell.size)
            .attr("height", cell.size)
            .attr("fill", d => {
                return "#D8E2EE";
            })
            .on("mouseover", function(d) {

                if (d3.select(this).style("opacity") != 0) {
                    
                    d3.select(`#column-label-${d.season - 1}`)
                        .classed("hover", true)
                        .style("opacity", opacity.label.mouseOver)

                    d3.select(`#row-label-${d.rank - 1}`)
                        .classed("hover", true)
                        .style("opacity", opacity.label.mouseOver)
                    
                    tooltip.html(`<div class="heatmap-tooltip">${d.name}</div>`);
                    tooltip.style("visibility", "visible");
                }
            })
            .on("mouseout", function(d) {
                if (d3.select(this).style("opacity") != 0) {
                    
                    d3.select(`#column-label-${d.season - 1}`)
                        .classed("hover", false)
                        .style("opacity", opacity.label.mouseOut)

                    d3.select(`#row-label-${d.rank - 1}`)
                        .classed("hover", false)
                        .style("opacity", opacity.label.mouseOut)
                    
                    tooltip.style("visibility", "hidden");
                }
            })
            .on("mousemove", function(d, i) {
                tooltip.style("top", (d3.event.clientY - 55) + 'px').style("left", (d3.event.clientX - 55) + 'px');    
            })
            .attr("opacity", 0);

    })
    
    // Create rank data from 1st to 12th
    let ranks = [...Array(12).keys()].map(x => x+1);

    // Create text row labels from 1st to 12th for the heatmap
    let rowLabels = svg.append("g")
                        .classed("row-labels", true)
                        .selectAll(".row-label")
                        .data(ranks)
                        .enter().append("text")
                        .attr("x", 0)
                        .attr("y", d => {
                            return d * (cell.size + cell.padding) + cell.margin.top;
                        })
                        .text(d => {
                            return d;
                        })
                        .style("text-anchor", "end")
                        // Transform the position of the row label so it will be next left to the heatmap
                        .attr("transform", d => {
                            return `translate(${cell.margin.left}, ${cell.size/1.5})`;
                        })
                        .classed("row-label", true)
                        .attr("id", (d, i) => {
                            return `row-label-${i}`;
                        })
                        .classed("ssp", true)
                        .attr("opacity", 0);

    // Generate data for the column labels
    let competitionNoOfSeasons = {
        "AFI": 5,
        "Indonesian Idol": 9,
        "X Factor Indonesia": 2,
        "The Voice Indonesia": 2,
        "Mamamia Show": 3,
        "Rising Star Indonesia": 2,
        "IMB": 4,
        "D'Academy": 4
    }

    let competition = null;
    let competitions = [];

    for (competition in competitionNoOfSeasons){
        for (let i=1; i < competitionNoOfSeasons[competition]+1; i++) {
            competitions.push([competition, i]);
        }
    }

    let columnLabels = svg.append("g")
                            .classed("column-labels", true)
                            .selectAll(".column-label")
                            .data(competitions)
                            .enter().append("text")
                            .attr("x", 0)
                            .attr("y", (d, i) => {
                                return (i + 1) * (cell.size + cell.padding) + cell.margin.top;
                            })
                            .text(d => {
                                return `${d[0]} S${d[1]}`;
                            })
                            .style("text-anchor", "start")
                            // Translate it so it will appear at the right position, it's manually positioned at the moment
                            .attr("transform", "translate(-85, 125) rotate(-90)")
                            .classed("column-label", true)
                            .attr("id", (d, i) => {
                                return `column-label-${i}`;
                            })
                            .attr("opacity", 0)
                            .classed("ssp", true);

    let controller = new ScrollMagic.Controller();

    let scrollMagicAttrs = [
        [
            "#par2",
            [0, 0, 0],
            ["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"],
            [1, 1, 1, 1, 1],
            [0, 0, 0],
            ["none", "none", "none", "none", "none"]
            [0, 0, 0, 0, 0]
        ], [
            "#legend-fade",
            [1, 1, 1],
            ["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"],
            [1, 1, 1, 1, 1],
            [0, 0, 0],
            ["none", "none", "none", "none", "none"]
            [0, 0, 0, 0, 0]
        ], [
            "#par3",
            [0, 1, 0],
            ["#8AE49C", "#8AE49C", "#8AE49C", "#8AE49C", "#CCCCCC"],
            [0.3, 1, 1, 1, 1],
            [1, 1, 1],
            ["#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC", "#CCCCCC"],
            [1, 1, 1, 1, 1]
        ], [
            "#par4",
            [0, 1, 0],
            ["#FFDA4A", "#FFDA4A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0.3, 1, 1, 1],
            [0, 1, 0],
            ["#8AE49C", "#8AE49C", "#8AE49C", "#8AE49C", "#CCCCCC"],
            [0.3, 1, 1, 1, 1]
        ], [
            "#par5",
            [0, 1, 0],
            ["#FF914A", "#FF914A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0, 0.3, 1, 1],
            [0, 1, 0],
            ["#FFDA4A", "#FFDA4A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0.3, 1, 1, 1]
        ], [
            "#par6",
            [0, 1, 0],
            ["#D55154", "#FF914A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0, 0, 0.3, 1],
            [0, 1, 0],
            ["#FF914A", "#FF914A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0, 0.3, 1, 1]
        ]
        , [
            "#heatmap-fade",
            [0, 0, 0],
            ["#D55154", "#FF914A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0, 0, 0, 0],
            [0, 1, 0],
            ["#D55154", "#FF914A", "#FFDA4A", "#8AE49C", "#CCCCCC"],
            [0, 0, 0, 0.3, 1]
        ]
    
    ];
    
    let heatmapScrollAnimation = (triggerElement, onEnterLabelOpacity, onEnterCellFill, onEnterCellOpacity, onLeaveLabelOpacity, onLeaveCellFill, onLeaveCellOpacity) => {
    
        new ScrollMagic.Scene({
                triggerElement: triggerElement,
                triggerHook: 0.3
            })
            .on("enter", () => {
    
                opacity.label.noEvent = onEnterLabelOpacity[0];
                opacity.label.mouseOver = onEnterLabelOpacity[1];
                opacity.label.mouseOut = onEnterLabelOpacity[2];

                if (triggerElement == "#par2") {
                    d3.selectAll(".legend")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                }

                d3.select("#svg-container-heatmap")
                    .style("width", "50%")
                    .style("margin-right", "0px")
                    .style("position", () => {
                            return "fixed";
                    });

                if (triggerElement == "#legend-fade") {
                        d3.selectAll(".legend")
                            .transition()
                            .duration(1000)
                            .style("opacity", 0);
                    }
    
                rowLabels.transition()
                    .duration(1000)
                    .style("opacity", opacity.label.noEvent);
                
                columnLabels.transition()
                    .duration(1000)
                    .style("opacity", opacity.label.noEvent);    

                svg.selectAll(".cell")
                    .transition()
                    .duration(500)
                    .style("fill", d => {
                        if (d.awards_won > 0) {
                            return onEnterCellFill[0];
                        } else if (d.awards_nominated > 0) {
                            return onEnterCellFill[1];
                        } else if (d.monthly_listener > 1000) {
                            return onEnterCellFill[2];
                        } else if (d.career != "No") {
                            return onEnterCellFill[3];
                        } else {
                            return onEnterCellFill[4];
                        }
                    })
                    .style("opacity", d => {
                        if (d.career == "No") {
                            return onEnterCellOpacity[0];
                        } else if (d.monthly_listener < 1000) {
                            return onEnterCellOpacity[1];
                        } else if (d.awards_nominated < 1) {
                            return onEnterCellOpacity[2];
                        } else if (d.awards_won < 1) {
                            return onEnterCellOpacity[3];
                        } else {
                            return onEnterCellOpacity[4];
                        }
                    })
                
                
            })
            .on("leave", () => {
                opacity.label.noEvent = onLeaveLabelOpacity[0];
                opacity.label.mouseOver = onLeaveLabelOpacity[1];
                opacity.label.mouseOut = onLeaveLabelOpacity[2];
    
                rowLabels.transition()
                    .duration(1000)
                    .style("opacity", opacity.label.noEvent);
                
                columnLabels.transition()
                    .duration(1000)
                    .style("opacity", opacity.label.noEvent);

                if (triggerElement == "#par2") {
                    d3.select("#svg-container-heatmap")
                        .style("width", "82.5%")
                        .style("margin-top", "-2.75vw")
                        .style("margin-right", "-1.9vw")
                        .style("position", "absolute");
                }

                if (triggerElement == "#legend-fade") {
                    d3.selectAll(".legend")
                        .transition()
                        .duration(1000)
                        .style("opacity", 1);
                }
                
                
                svg.selectAll(".cell")
                    .transition()
                    .duration(500)
                    .style("fill", d => {
                        if (d.awards_won > 0) {
                            return onLeaveCellFill[0];
                        } else if (d.awards_nominated > 0) {
                            return onLeaveCellFill[1];
                        } else if (d.monthly_listener > 1000) {
                            return onLeaveCellFill[2];
                        } else if (d.career != "No") {
                            return onLeaveCellFill[3];
                        } else {
                            return onLeaveCellFill[4];
                        }
                    })
                    .style("opacity", d => {
                        if (d.career == "No") {
                            return onLeaveCellOpacity[0];
                        } else if (d.monthly_listener < 1000) {
                            return onLeaveCellOpacity[1];
                        } else if (d.awards_nominated < 1) {
                            return onLeaveCellOpacity[2];
                        } else if (d.awards_won < 1) {
                            return onLeaveCellOpacity[3];
                        } else {
                            return onLeaveCellOpacity[4];
                        }
                    })
                
            })
            // Indicators are removed when it's deployed
            // .addIndicators({name: "#triggered"})
            .addTo(controller);
    }
    
    for (let i = 0; i < scrollMagicAttrs.length; i++) {
    
        let triggerElement = scrollMagicAttrs[i][0];
        let onEnterLabelOpacity = scrollMagicAttrs[i][1];
        let onEnterCellFill = scrollMagicAttrs[i][2];
        let onEnterCellOpacity = scrollMagicAttrs[i][3];
        let onLeaveLabelOpacity = scrollMagicAttrs[i][4];
        let onLeaveCellFill = scrollMagicAttrs[i][5];
        let onLeaveCellOpacity = scrollMagicAttrs[i][6];
    
        heatmapScrollAnimation(triggerElement, onEnterLabelOpacity, onEnterCellFill, onEnterCellOpacity, onLeaveLabelOpacity, onLeaveCellFill, onLeaveCellOpacity);
    }
}