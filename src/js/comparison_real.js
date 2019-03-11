export const comparison = function(id, filename) {
    
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
    

    d3.tsv(filename, (error, data) => {        

        let contenderData = data;

        svg.append("g")
            .append("text")
            .attr("id", "season-popularity-label")
            .attr("y", 215)
            .attr("x", width/2)
            .text("HOVER OVER THE GREEN COLORED CIRCLE")
            .attr("fill", "#B3ECA1")
            .style("font-size", "18px")
            .attr("text-anchor", "middle")

        let showData = ["AFI", "II", "MMI", "TVI", "DA", "RSI", "IMB", "XFI"]

        svg.append("g")
            .selectAll(".show-circle")
            .data(showData)
            .enter().append("circle")
            .classed("show-circle", true)
            .attr("r", d => {
                return 30;
            })
            .attr("cx", (d, i) => {
                return i * 80 + padding;
            })
            .attr("cy", circleLinePosition)
            .style("opacity", 0.5)
            .attr("id", d => {
                return `show-${d}`;
            })

        

        let button = svg.append("g")
                .attr("transform", "translate(20, 20)")
                .style("cursor", "pointer");

        button.append("rect")
            .attr("width", 80)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "#6699CC")
            .style("opacity", 1)
            .attr("id", "button-male")

        button.on("click", function() {

            if (buttonInputs.male == false) {
                d3.select("#button-male")
                    .style("fill", "black");
                
                buttonInputs.male = true;

            } else {
                d3.select("#button-male")
                    .style("fill", "#6699CC");
                
                buttonInputs.male = false;
            }

            if (buttonInputs.male || buttonInputs.female) {
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
                        careerQuery = (datum.awards_won > 1000)
                    }
    
                    return careerQuery;
                }
    
                contenderData = contenderData.filter(careerFilter);
            }


            console.log(contenderData);

            contenderData = data;
        })
        
        button.append("text")
            .style("fill", "white")
            .text("Male")
            .attr("x", 40)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18)
        


        let button2 = svg.append("g")
                .attr("transform", "translate(110, 20)")
                .style("cursor", "pointer");

        button2.append("rect")
            .attr("width", 80)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "#6699CC")
            .style("opacity", 1)
            .attr("id", "button-female")
        
        button2.on("click", function() {

            if (buttonInputs.female == false) {
                d3.select("#button-female")
                    .style("fill", "black");
                
                buttonInputs.female = true;

            } else {
                d3.select("#button-female")
                    .style("fill", "#6699CC");
                
                buttonInputs.female = false;
            }


            if (buttonInputs.male || buttonInputs.female) {
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
                        careerQuery = (datum.awards_won > 1000)
                    }
    
                    return careerQuery;
                }

                contenderData = contenderData.filter(careerFilter);
    
            }



            console.log(contenderData);
            console.log(buttonInputs)

            contenderData = data;
        })

        button2.append("text")
            .style("fill", "white")
            .text("Female")
            .attr("x", 40)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);
        

        let button3 = svg.append("g")
            .attr("transform", "translate(20, 60)")

        button3.append("rect")
            .attr("width", 140)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red")
            .style("opacity", 1)
            .attr("id", "button-grandfinalist")

        button3.on("click", function() {
            if (buttonInputs.gf == false) {
                d3.select("#button-grandfinalist")
                    .style("fill", "black");
                
                buttonInputs.gf = true;

            } else {
                d3.select("#button-grandfinalist")
                    .style("fill", "#6699CC");
                
                buttonInputs.gf = false;
            }


            
            if (buttonInputs.male || buttonInputs.female) {
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
                        careerQuery = (datum.awards_won > 1000)
                    }
    
                    return careerQuery;
                }

                contenderData = contenderData.filter(careerFilter);
    
            }



            console.log(contenderData);

            contenderData = data;
        })

        button3.append("text")
            .style("fill", "white")
            .text("Grand Finalist")
            .attr("x", 70)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);

        let borderData = [
            {
                "x": 20,
                "y": 100
            }, {
                "x": 400,
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
            .style("opacity", 1);
        
        let button4 = svg.append("g")
            .attr("transform", "translate(170, 60)")


        button4.append("rect")
            .attr("width", 170)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red")
            .style("opacity", 1)
            .attr("id", "button-nongrandfinalist")

        button4.on("click", function() {

            if (buttonInputs.ngf == false) {
                d3.select("#button-nongrandfinalist")
                    .style("fill", "black");
                
                buttonInputs.ngf = true;

            } else {
                d3.select("#button-nongrandfinalist")
                    .style("fill", "#6699CC");
                
                buttonInputs.ngf = false;
            }


            
            if (buttonInputs.male || buttonInputs.female) {
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
                        careerQuery = (datum.awards_won > 1000)
                    }
    
                    return careerQuery;
                
                }

                contenderData = contenderData.filter(careerFilter);
    
            }

            console.log(contenderData);

            contenderData = data;
        })

        button4.append("text")
            .style("fill", "white")
            .text("Non-Grand Finalist")
            .attr("x", 85)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);
        
        let button5 = svg.append("g")
            .attr("transform", "translate(20, 110)")

        button5.append("rect")
            .attr("width", 60)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red")
            .attr("id", "button-nom")

        button5.on("click", function() {

            if (buttonInputs.nom == false) {
                d3.select("#button-nom")
                    .style("fill", "black");
                
                buttonInputs.nom = true;

            } else {
                d3.select("#button-nom")
                    .style("fill", "#6699CC");
                
                buttonInputs.nom = false;
            }


            
            if (buttonInputs.male || buttonInputs.female) {
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
                        careerQuery = (datum.awards_won > 1000)
                    }
    
                    return careerQuery;
                }

                contenderData = contenderData.filter(careerFilter);
    
            }

            console.log(contenderData);
            console.log(buttonInputs);

            contenderData = data;
        })
    

        button5.append("text")
            .style("fill", "white")
            .text("ENT")
            .attr("x", 30)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);

        let button6 = svg.append("g")
            .attr("transform", "translate(90, 110)")

        button6.append("rect")
            .attr("width", 60)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red");

        button6.append("text")
            .style("fill", "white")
            .text("SPO")
            .attr("x", 30)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);

        let button7 = svg.append("g")
            .attr("transform", "translate(160, 110)")

        button7.append("rect")
            .attr("width", 60)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red");

        button7.append("text")
            .style("fill", "white")
            .text("NOM")
            .attr("x", 30)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);
            
        let button8 = svg.append("g")
            .attr("transform", "translate(230, 110)")

        button8.append("rect")
            .attr("width", 60)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", "red");

        button8.append("text")
            .style("fill", "white")
            .text("WON")
            .attr("x", 30)
            .attr("y", (30/2) + (30/2)/2)
            .attr("text-anchor", "middle")
            .style("font-size", 18);

    })


}