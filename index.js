//initialisation
const CYCLIST_DATA = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const CHART__WIDTH = 900;
const CHART__HEIGHT = 500;










//Calling API and function

const chartData = async(URL) => {

    /*-----------------------------------calling API-----------------------------------*/

    const fetchData = await fetch(URL);
    const response = await fetchData.json();

    /*-----------------------------------init-----------------------------------*/

    const MARGIN = {
        top: 100,
        right: 50,
        bottom: 100,
        left: 100
    }

    const MAX_YEAR = d3.max(response.map(element => {
        return element.Year;
    }))
    const MIN_YEAR = d3.min(response.map(element => {
        return element.Year;
    }))

    const MAX_TIME = d3.max(response.map(element => {
        let total = element.Seconds + 15;
        return total;
    }))
    const MIN_TIME = d3.min(response.map(element => {
        let total = element.Seconds - 15;
        return total;
    }))
    const MAX_TIME_AXIS = d3.max(response.map(element => {
        return new Date((element.Seconds * 1000) + 15000);
    }))
    const MIN_TIME_AXIS = d3.min(response.map(element => {
        return new Date((element.Seconds * 1000) - 15000);
    }))



    //Setting the ordinate and abscissa 
    const xScaleAxis = d3.scaleLinear().domain([MIN_YEAR - 1, MAX_YEAR + 1]).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScaleAxis = d3.scaleTime().domain([MAX_TIME_AXIS, MIN_TIME_AXIS]).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);

    //Setting the scale for the x and y data

    const xScaleData = d3.scaleLinear().domain([MIN_YEAR - 1, MAX_YEAR + 1]).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScaleData = d3.scaleLinear().domain([MAX_TIME, MIN_TIME]).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);


    /*-----------------------------------Create element-----------------------------------*/

    //creat SVG

    const chart__container = d3.select(".chart__container").append("svg");

    chart__container.attr("width", CHART__WIDTH)
        .attr("height", CHART__HEIGHT)
        .attr("class", "chart__container__svg")
        .style("background-color", "#003f5c")
        .style("opacity", "0.9")

    //create group for data

    const chart = chart__container.append("g")

    chart.selectAll(".dot")
        .data(response)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", d => xScaleData(d.Year))
        .attr("cy", d => {
            let answer = d.Seconds;
            return yScaleData(answer);
        })
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => new Date(d.Seconds * 1000))
        .attr("fill", d => d.Doping === "" ? "#ffa600" : "#bc5090")
        .attr("data-dopingTitle", d => d.Doping)
        .attr("data-name", d => d.Name)
        .attr("data-nationality", d => d.Nationality)
        .attr("data-place", d => d.Place)
        .attr("data-time", d => d.Time)
        .attr("data-year", d => d.Year)

    //create x-axis

    const abscissa = d3.axisBottom().scale(xScaleAxis).tickFormat(d3.format("d"));
    const xAxis = chart__container.append("g");
    xAxis.call(abscissa)
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${CHART__HEIGHT-MARGIN.bottom})`)
        .style("color", "#D0D0D0");

    //create x-axis legend

    chart__container.append("text")
        .attr("y", CHART__HEIGHT - (MARGIN.bottom / 2))
        .attr("x", CHART__WIDTH / 8 * 7)
        .text("Records' year")
        .attr("text-anchor", "middle")
        .style("fill", "#D0D0D0")



    //create y-axis

    const ordinate = d3.axisLeft().scale(yScaleAxis).tickFormat(d3.timeFormat("%M:%S"));
    const yAxis = chart__container.append("g");
    yAxis.call(ordinate).attr("id", "y-axis").attr("transform", `translate(${MARGIN.left},0)`).style("color", "#D0D0D0");

    //create y-axis legend

    chart__container.append("text")
        .text("Time (in minutes)")
        .attr("x", -CHART__HEIGHT / 2)
        .attr("y", MARGIN.left / 3)
        .attr("text-anchor", "middle")
        .style("transform", "rotate(-90deg)")
        .style("fill", "#D0D0D0")


    //create title

    chart__container.append("text")
        .text("Professional cycling’s 35 fastest times ever up Alpe d’Huez over the years")
        .attr("x", CHART__WIDTH / 2)
        .attr("y", MARGIN.top / 2)
        .attr("text-anchor", "middle")
        .attr("id", "title")
        .style("fill", "#D0D0D0")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("text-decoration", "underline")

    //creat legend

    const legend = chart__container.append("g");
    legend.attr("id", "legend")

    const legendDoped = legend.append("g");
    legendDoped.attr("class", "legend_doped")

    legendDoped.append("text")
        .attr("x", CHART__WIDTH / 4 * 3)
        .attr("y", CHART__HEIGHT / 2)
        .text("Accused of dopping")
        .style("fill", "#D0D0D0")
    legendDoped.append("circle")
        .attr("cx", (CHART__WIDTH / 4 * 3) - 10)
        .attr("cy", (CHART__HEIGHT / 2) - 2.5)
        .attr("r", 5)
        .attr("fill", "#bc5090")

    const legendClean = legend.append("g");
    legendClean.attr("class", "legend_clean")

    legendClean.append("text")
        .attr("x", CHART__WIDTH / 4 * 3)
        .attr("y", (CHART__HEIGHT / 2) + 17.5)
        .text("Not accused of dopping")
        .style("fill", "#D0D0D0")
    legendClean.append("circle")
        .attr("cx", (CHART__WIDTH / 4 * 3) - 10)
        .attr("cy", (CHART__HEIGHT / 2) + 15)
        .attr("r", 5)
        .attr("fill", "#ffa600")

    //toolbox

    const toolbox = d3.select(".chart__container").append("div")

    toolbox.style("position", "absolute")
        .style("background-color", "#00428d")
        .style("padding", "10px")
        .style("color", "#E7E7E7")
        .style("border-radius", "10px")
        .text("test")
        .attr("id", "tooltip")
        .style("opacity", "0")
        .attr("data-year", "data-xvalue")
        .style("top", "80px")
        .style("left", CHART__WIDTH / 4 * 3 + "px")
        .style("border", "1px solid #E7E7E7")

    chart.selectAll(".dot").on("mouseover", (e) => {
        toolbox.style("opacity", "1")
            .attr("data-year", e.Year)
            .html(`Name: ${e.Name}<br>
                Nationality: ${e.Nationality}<br>
                Rank: ${e.Place}<br>
                Time: ${e.Time}<br>
                Year: ${e.Year}<br>
            `)
    })

    chart.selectAll(".dot").on("mouseout", (e) => {
        toolbox.style("opacity", "0")
    })






















    console.log(response)
}

chartData(CYCLIST_DATA);