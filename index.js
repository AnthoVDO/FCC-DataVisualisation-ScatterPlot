//initialisation
const CYCLIST_DATA = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

const CHART__WIDTH = 900;
const CHART__HEIGHT = 450;










//Calling API and function

const chartData = async(URL) => {

    //calling API

    const fetchData = await fetch(URL);
    const response = await fetchData.json();

    /*-----------------------------------init-----------------------------------*/

    const MARGIN = {
        top: 20,
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
        let tempTime = ":" + element.Seconds.toString();
        let total = element.Time + tempTime;
        return total;
    }))
    const MIN_TIME = d3.min(response.map(element => {
        let tempTime = ":" + element.Seconds.toString();
        let total = element.Time + tempTime;
        return total;
    }))

    const MAX_TIME_DATA = d3.max(response.map(element => {
        let tempTime = element.Time.split(":");
        let minutes = parseInt(tempTime[0], 10) * 60000;
        let seconds = parseInt(tempTime[1], 10) * 1000;
        let milliSeconds = element.Seconds;
        let answer = minutes + seconds + milliSeconds;
        return answer;
    }))

    const MIN_TIME_DATA = d3.min(response.map(element => {
        let tempTime = element.Time.split(":");
        let minutes = parseInt(tempTime[0], 10) * 60000;
        let seconds = parseInt(tempTime[1], 10) * 1000;
        let milliSeconds = element.Seconds;
        let answer = minutes + seconds + milliSeconds;
        return answer;
    }))

    //Setting the ordinate and abscissa 
    const xScaleAxis = d3.scaleLinear().domain([MIN_YEAR - 1, MAX_YEAR + 1]).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScaleAxis = d3.scaleLinear().domain([MAX_TIME, MIN_TIME]).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);

    //Setting the scale for the x and y data

    const xScaleData = d3.scaleLinear().domain([MIN_YEAR - 1, MAX_YEAR + 1]).range([MARGIN.left, CHART__WIDTH - MARGIN.right]);
    const yScaleData = d3.scaleLinear().domain([MAX_TIME_DATA, MIN_TIME_DATA]).range([CHART__HEIGHT - MARGIN.bottom, MARGIN.top]);


    /*-----------------------------------Create element-----------------------------------*/

    //creat SVG

    const chart__container = d3.select(".chart__container").append("svg");

    chart__container.attr("width", CHART__WIDTH)
        .attr("height", CHART__HEIGHT)
        .attr("class", "chart__container__svg")
        .style("background-color", "yellow")

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
            let tempTime = d.Time.split(":");
            let minutes = parseInt(tempTime[0], 10) * 60000;
            let seconds = parseInt(tempTime[1], 10) * 1000;
            let milliSeconds = d.Seconds;
            let answer = minutes + seconds + milliSeconds;
            return yScaleData(answer);
        })
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Time + ":" + d.Seconds)

    //create x-axis

    const abscissa = d3.axisBottom().scale(xScaleAxis);
    const xAxis = chart__container.append("g");
    xAxis.call(abscissa)
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${CHART__HEIGHT-MARGIN.bottom})`);



    //create y-axis

    const ordinate = d3.axisLeft().scale(yScaleAxis);
    const yAxis = chart__container.append("g");
    yAxis.call(ordinate).attr("id", "y-axis").attr("transform", `translate(${MARGIN.left},0)`);











    console.log(response[0])
}

chartData(CYCLIST_DATA);