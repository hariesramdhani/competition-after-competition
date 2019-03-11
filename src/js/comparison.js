export const comparison = function(id, filename) {

    let mouseX, mouseY;

    document.onmouseover = function(event) {
        event = event || window.event;
    
        mouseX = event.clientX;
        mouseY = event.clientY;
    }
    
    let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    }

    let padding = 50;

    let height = 300 - margin.left - margin.right,
        width = 680 - margin.top - margin.bottom;

    let svg = d3.select(`#${id}`)
                .append("div")
                .attr("id", "svg-container-comparison")
                .append("svg")
                .attr("preserveAspectRation", "xMinYMin meet")
                .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " +  (height + margin.top + margin.bottom))
                .classed("svg-content-responsive", true);
    
    let circleLinePosition = 190;

    let circleScale = d3.scaleLinear()
                    .domain([0, 1])
                    .range([5, 30]);

    let buttonInputs = {
        "male": false,
        "female": false,
        "group": false,
        "gf": false,
        "ngf": false,
        "ent": false,
        "spo": false,
        "nom": false,
        "won": false
    }

    let detailedData;

    let tooltip = d3.select("#additional-story-two")
                    .append("div")
                    .style("position", "fixed")
                    .style("z-index", 100)
                    .style("visibility", "hidden")
    

    d3.tsv(filename, (error, data) => {        

        let contenderData = data;
        let detailedData = data;

        let competitions = ["AFI", "Indonesian Idol", "Mamamia Show Indonesia", "X Factor Indonesia", "The Voice Indonesia", "Rising Star Indonesia", "Indonesia Mencari Bakat", "D'Academy"]
        let competitionCodes = ["AFI", "II", "MMI", "XFI", "TVI", "RSI", "IMB", "DA"]
        let competitionColors = ["#D59448", "#3B5090", "#C65687", "#D32939", "#965552", "#E3B449", "#354B95", "#883E97"]
        let contenderAmounts = {}


        competitions.forEach(competition => {
            contenderAmounts[competition] = contenderData.filter(datum => datum.competition == competition).length
        })


        let buttonData = [
            {
                "gCoordinates": [20, 20],
                "width": 80,
                "id": "male",
                "fill": "#B92D31",
                "fillClicked": "#D55154",
                "text": "Male",
                "textCoordinates": [40, 22.5]
            }, {
                "gCoordinates": [110, 20],
                "width": 80,
                "id": "female",
                "fill": "#B92D31",
                "fillClicked": "#D55154",
                "text": "Female",
                "textCoordinates": [40, 22.5]
            }, {
                "gCoordinates": [200, 20],
                "width": 80,
                "id": "group",
                "fill": "#B92D31",
                "fillClicked": "#D55154",
                "text": "Group",
                "textCoordinates": [40, 22.5]
            }, {
                "gCoordinates": [20, 60],
                "width": 140,
                "id": "gf",
                "fill": "#339461",
                "fillClicked": "#77D9A6",
                "text": "Grandfinalist",
                "textCoordinates": [70, 22.5]
            }, {
                "gCoordinates": [170, 60],
                "width": 170,
                "id": "ngf",
                "fill": "#339461",
                "fillClicked": "#77D9A6",
                "text": "Non-Grandfinalist",
                "textCoordinates": [85, 22.5]
            }, {
                "gCoordinates": [20, 110],
                "width": 60,
                "id": "ent",
                "fill": "#726268",
                "fillClicked": "#C0ABB2",
                "text": "ENT",
                "textCoordinates": [30, 22.5]
            }, {
                "gCoordinates": [90, 110],
                "width": 60,
                "id": "spo",
                "fill": "#726268",
                "fillClicked": "#C0ABB2",
                "text": "SPO",
                "textCoordinates": [30, 22.5]
            }, {
                "gCoordinates": [160, 110],
                "width": 60,
                "id": "nom",
                "fill": "#726268",
                "fillClicked": "#C0ABB2",
                "text": "NOM",
                "textCoordinates": [30, 22.5]
            }, {
                "gCoordinates": [230, 110],
                "width": 60,
                "id": "won",
                "fill": "#726268",
                "fillClicked": "#C0ABB2",
                "text": "WON",
                "textCoordinates": [30, 22.5]
            }
        ]
        
        for (let i in buttonData) {
    
        
            let button = svg.append("g")
                            .attr("transform", `translate(${buttonData[i].gCoordinates[0]}, ${buttonData[i].gCoordinates[1]})`)
                            .style("cursor", "pointer");

            let careerIDs = ["ent", "spo", "nom", "won"];
        
            button.append("rect")
                    .attr("width", buttonData[i].width)
                    .attr("height", 30)
                    .attr("rx", 4)
                    .attr("ry", 4)
                    .style("fill", buttonData[i].fill)
                    .attr("id", `button-${buttonData[i].id}`)
                    .attr("class", () => {
                        if (careerIDs.includes(buttonData[i].id)){
                            return "button-career";
                        }
                    })
        
            button.append("text")
                    .style("fill", "#282E3F")
                    .text(buttonData[i].text)
                    .attr("x", buttonData[i].textCoordinates[0])
                    .attr("y", buttonData[i].textCoordinates[1])
                    .attr("text-anchor", "middle")
                    .style("font-size", 18)

                
            button.on("click", function() {

                if (careerIDs.includes(buttonData[i].id)){
                    d3.selectAll(".button-career")
                        .style("fill", buttonData[i].fill)

                    let careerIDsFiltered = careerIDs.filter(id => id != buttonData[i].id)

                    for (let i in careerIDsFiltered) {
                        buttonInputs[careerIDsFiltered[i]] = false;
                    }
                }
        
                if (buttonInputs[buttonData[i].id] == false) {
                    d3.select(`#button-${buttonData[i].id}`)
                        .style("fill", buttonData[i].fillClicked);
                    
                    buttonInputs[buttonData[i].id] = true;
        
                } else {
                    d3.select(`#button-${buttonData[i].id}`)
                        .style("fill", buttonData[i].fill);
                    
                    buttonInputs[buttonData[i].id] = false;
                }
        
                if (buttonInputs.male || buttonInputs.female || buttonInputs.group) {
                    let genderFilter = datum => {
                        let genderQuery;
                        if (buttonInputs.male == true && buttonInputs.female == true && buttonInputs.group == true) {
                            genderQuery = (datum.gender == "M" || datum.gender == "F" || datum.gender == "G")
                        } else if (buttonInputs.male == true && buttonInputs.female == true) {
                            genderQuery = (datum.gender == "F" || datum.gender == "M")
                        } else if (buttonInputs.male == true && buttonInputs.group == true) {
                            genderQuery = (datum.gender == "M" || datum.gender == "G")
                        } else if (buttonInputs.female == true && buttonInputs.group == true) {
                            genderQuery = (datum.gender == "F" || datum.gender == "G")
                        } else if (buttonInputs.female == true) {
                            genderQuery = (datum.gender == "F")
                        } else if (buttonInputs.group == true) {
                            genderQuery = (datum.gender == "G")
                        } else if (buttonInputs.male == true) {
                            genderQuery = (datum.gender == "M")
                        }
                        return genderQuery;
                    }
                    
        
                    contenderData = contenderData.filter(genderFilter);
                }
        
                if (buttonInputs.gf || buttonInputs.ngf) {
                    let finalistFilter = datum => {
                        let finalistQuery;
                        if (buttonInputs.gf == true && buttonInputs.ngf == true) {
                            finalistQuery = (datum.rank)
                        } else if (buttonInputs.gf == true) {
                            finalistQuery = (datum.rank <= 3)
                        } else if (buttonInputs.ngf == true) {
                            finalistQuery = (datum.rank > 3)
                        }        
        
                        return finalistQuery;
                    }
        
                    contenderData = contenderData.filter(finalistFilter);
                }
                
                if (buttonInputs.ent || buttonInputs.spo || buttonInputs.nom || buttonInputs.won) {
                    let careerFilter = datum => {
                        let careerQuery;
                        if (buttonInputs.ent == true) {
                            careerQuery = (datum.career != "No")
                        } else if (buttonInputs.spo == true) {
                            careerQuery = (datum.monthly_listener > 1000)
                        } else if (buttonInputs.nom == true) {
                            careerQuery = (datum.awards_nominated > 0)
                        } else if (buttonInputs.won == true) {
                            careerQuery = (datum.awards_won > 0)
                        }
        
                        return careerQuery;
                    }
        
                    contenderData = contenderData.filter(careerFilter);
                }

                for (let i in competitions) {
                    let circleRadius = contenderData.filter(datum => datum.competition == competitions[i]).length/contenderAmounts[competitions[i]];

                    d3.select(`#show-${competitionCodes[i]}`)
                        .transition()
                        .duration(1000)
                        .attr("r", circleScale(circleRadius));
                }

                detailedData = contenderData;
                contenderData = data;
            })
        }
        
        svg.append("g")
            .selectAll(".show-circle")
            .data(competitionCodes)
            .enter().append("circle")
            .classed("show-circle", true)
            .attr("r", d => {
                return 30;
            })
            .attr("cx", (d, i) => {
                return i * 80 + padding;
            })
            .attr("cy", circleLinePosition)
            .style("opacity", 0.8)
            .attr("id", d => {
                return `show-${d}`;
            })
            .style("fill", (d,i) => {
                return competitionColors[i];
            })
            .on("mouseover", (d, i) => {
                let percentage = detailedData.filter(datum => datum.competition == competitions[i]).length/contenderAmounts[competitions[i]];

                tooltip.html(`
                <div class="circle-tooltip">
                    <span>${competitions[i].toUpperCase()}</span></br>
                    <span style='font-size: 1.75vw;'>${(percentage * 100).toFixed()}%</span>
                </div>
                `)

                tooltip.style("visibility", "visible");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", () => {
                tooltip.style("top", (d3.event.clientY + 30) + 'px').style("left", (d3.event.clientX - 50) + 'px');    
            })
    })

    let borderData = [
        {
            "x": 20,
            "y": 100
        }, {
            "x": 650,
            "y": 100
        }
    ]

    let borderLine = d3.line()
                    .x(d => {return d.x})
                    .y(d => {return d.y});
    
    svg.append("path")
        .data([borderData])
        .classed("legend", true)
        .attr("d", borderLine)
        .attr("fill", "none")
        .attr("stroke", "white")
        .style("stroke-dasharray", ("5, 5"))
        .style("opacity", 0.5)
        .style("z-index", 10000)


}