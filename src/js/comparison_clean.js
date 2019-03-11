buttonData = [
    {
        "gCoordinates": [20, 20],
        "width": 80,
        "id": "male",
        "fill": "#6699CC",
        "fillClicked": "#CCCCCC",
        "text": "Male",
        "textCoordinates": [40, 22.5]
    }, {
        "gCoordinates": [buttonData[0].gCoordinates[0] + buttonData[0].width + 10, buttonData[0].gCoordinates[1]],
        "width": 80,
        "id": "female",
        "fill": "#6699CC",
        "fillClicked": "#CCCCCC",
        "text": "Female",
        "textCoordinates": [40, 22.5]
    }
]

for (let i in buttonData) {

    console.log(buttonData[i]);

    let button = svg.append("g")
                    .attr("transform", `translate(${buttonData[i].gCoordinates[0]}, ${buttonData[i].gCoordinates[1]})`)
                    .style("cursor", "pointer");

    button.append("rect")
            .attr("width", buttonData[i].width)
            .attr("height", 30)
            .attr("rx", 4)
            .attr("ry", 4)
            .style("fill", buttonData[i].fill)
            .attr("id", `button-${buttonData[i].id}`)

    button.append("text")
            .style("fill", "white")
            .text(buttonData[i].text)
            .attr("x", buttonData.textCoordinates[0])
            .attr("y", buttonData.textCoordinates[1])
            .attr("text-anchor", "middle")
            .style("font-size", 18)
        
    button.on("click", function() {

        if (buttonInputs[buttonData[i].id] == false) {
            d3.select(`#button-${buttonData[i].id}`)
                .style("fill", buttonData[i].fillClicked);
            
            buttonInputs[buttonData[i].id] = true;

        } else {
            d3.select(`#button-${buttonData[i].id}`)
                .style("fill", buttonData[i].fill);
            
            buttonInputs[buttonData[i].id] = false;
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

        // contenderData = contenderData.filter(careerFilter);


        console.log(contenderData);

        contenderData = data;
    })
}