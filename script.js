

async function fetchData() { 
    const response = await fetch('csv/cereales.csv');
    const data = await response.text();

    const rows = data.split('\n').slice(1);

    const colors = ['#E69F00', '#56B4E9', '#009E73', '#CC79A7', '#D55E00'];

    const traces = [];
    const annotations = [];

    rows.forEach((row, index) => {
        const cols = row.split(';');
        const brand = cols[0];
        const year1 = parseFloat(cols[1]);
        const year2 = parseFloat(cols[2]);
        const year4 = parseFloat(cols[4]); 

        if (!isNaN(year1) && !isNaN(year2) && !isNaN(year4) && brand) {
            traces.push({
                x: ['2010', '2015', '2024'],
                y: [year1, year2, year4],
                name: brand,
                type: 'scatter',
                mode: 'lines+markers',
                line: { shape: 'linear', color: colors[index % colors.length], width: 3 },
                marker: { size: 8, symbol: ['circle', 'circle', 'circle'] }
            });

            annotations.push(
                {
                    x: '2010' - 0.2,
                    y: year1,
                    xref: 'x',
                    yref: 'y',
                    text: `<b>${brand}</b> ${Math.round(year1)}`,
                    showarrow: false,
                    font: { color: 'black', size: 12 },
                    xanchor: 'right'
                },
                {
                    x: '2015',
                    y: year2 + 0.4,
                    xref: 'x',
                    yref: 'y',
                    text: ` ${Math.round(year2)}`,
                    showarrow: false,
                    font: { color: 'black', size: 12 },
                    xanchor: 'center'
                },
                {
                    x: '2024',
                    y: year4 + 0.4,
                    xref: 'x',
                    yref: 'y',
                    text: ` ${Math.round(year4)}`,
                    showarrow: false,
                    font: { color: 'black', size: 12 },
                    xanchor: 'left'
                }
            );
        }
    });

    return { traces, annotations };
}

fetchData().then(({ traces, annotations }) => {
    const layout = {
        title: 'Azúcares en Cereales [g/30g]',
        xaxis: {
            tickvals: ['2010', '2012', '2015', '2016', '2024'], 
            tickmode: 'array'
        },
        yaxis: {
            range: [0, 15],
            showticklabels: false
        },
        showlegend: false,
        margin: { l: 70, r: 100, t: 130 },
        annotations: [
            ...annotations,
            {
                x: '2016',
                y: 15,
                xref: 'x',
                yref: 'y',
                text: 'Implementación<br>sellos',
                showarrow: false,
                font: { color: 'black', size: 13 },
                xanchor: 'center',
                yanchor: 'bottom'
            },
            {
                x: '2012',
                y: 15,
                xref: 'x',
                yref: 'y',
                text: 'Aprobación<br>ley',
                showarrow: false,
                font: { color: 'black', size: 13 },
                xanchor: 'center',
                yanchor: 'bottom'
            },
            {
                x: '2010',
                y: 15,
                xref: 'x',
                yref: 'y',
                text: '<b>Cereales<b>',
                showarrow: false,
                font: { color: 'black', size: 14 },
                xanchor: 'right',
                yanchor: 'bottom'
            }
        ],
        shapes: [
            {
                type: 'line',
                x0: '2016',
                y0: 0,
                x1: '2016',
                y1: 50,
                xref: 'x',
                yref: 'y',
                line: {
                    color: 'black',
                    width: 2,
                    dash: 'dot'
                },
                layer: 'below'
            },
            {
                type: 'line',
                x0: '2012',
                y0: 0,
                x1: '2012',
                y1: 50,
                xref: 'x',
                yref: 'y',
                line: {
                    color: 'black',
                    width: 2,
                    dash: 'dot'
                },
                layer: 'below'
            },
            {
                type: 'line',
                x0: '2010',
                y0: 0,
                x1: '2010',
                y1: 0,
                xref: 'x',
                yref: 'y',
                line: {
                    color: 'black',
                    width: 2,
                    dash: 'dot'
                }
            }
        ]
    };
    Plotly.newPlot('myDiv', traces, layout);
});

// Function to fetch and plot data for the nutritional chart in 'newDiv'
async function fetchData1(cereal) {
    const response = await fetch(`csv/${cereal}.csv`);
    const data = await response.text();
    const rows = data.split('\n').slice(1,8);

    const colors = ['#E69F00', '#56B4E9', '#009E73', '#CC79A7', '#D55E00'];
    const traces = [];
    const annotations = [];

    rows.forEach((row, index) => {
        const cols = row.split(',');
        const brand = cols[0];
        const year1 = parseFloat(cols[1]);
        const year2 = parseFloat(cols[2]);
        const year4 = parseFloat(cols[4]);

        if (!isNaN(year1) && !isNaN(year2) && !isNaN(year4) && brand) {
            traces.push({
                x: ['2010', '2015', '2024'],
                y: [year1, year2, year4],
                name: brand,
                type: 'scatter',
                mode: 'lines+markers',
                line: { shape: 'linear', color: colors[index % colors.length], width: 3 },
                marker: { size: 8, symbol: ['circle', 'circle', 'circle'] }
            });

            annotations.push(
                { x: '2010', y: year1, xref: 'x', yref: 'y', text: `<b>${brand}</b> ${Math.round(year1)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'right' },
                { x: '2015', y: year2 + 0.4, xref: 'x', yref: 'y', text: ` ${Math.round(year2)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'center' },
                { x: '2024', y: year4 + 0.4, xref: 'x', yref: 'y', text: ` ${Math.round(year4)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'left' }
            );
        }
    });

    return { traces, annotations, cereal };
}

// Function to fetch and plot sodium data for the sodium chart in 'SodioDiv'
async function fetchSodio(cereal) {
    const response = await fetch(`csv/${cereal}.csv`);
    const data = await response.text();
    const rows = data.split('\n').slice(8, 9);  // Select only the 9th line

    const colors = ['#E69F00', '#56B4E9', '#009E73', '#CC79A7', '#D55E00'];
    const traces = [];
    const annotations = [];

    rows.forEach((row, index) => {
        const cols = row.split(',');
        const brand = cols[0];
        const year1 = parseFloat(cols[1]);
        const year2 = parseFloat(cols[2]);
        const year4 = parseFloat(cols[4]);

        if (!isNaN(year1) && !isNaN(year2) && !isNaN(year4) && brand) {
            traces.push({
                x: ['2010', '2015', '2024'],
                y: [year1, year2, year4],
                name: brand,
                type: 'scatter',
                mode: 'lines+markers',
                line: { shape: 'linear', color: colors[index % colors.length], width: 3 },
                marker: { size: 8, symbol: ['circle', 'circle', 'circle'] }
            });

            annotations.push(
                { x: '2010', y: year1, xref: 'x', yref: 'y', text: `<b>${brand}</b> ${Math.round(year1)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'right' },
                { x: '2015', y: year2 + 2, xref: 'x', yref: 'y', text: ` ${Math.round(year2)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'center' },
                { x: '2024', y: year4 + 0.4, xref: 'x', yref: 'y', text: ` ${Math.round(year4)}`, showarrow: false, font: { color: 'black', size: 12 }, xanchor: 'left' }
            );
        }
    });

    return { traces, annotations, cereal };
}

// Import Tone.js library (make sure to include the Tone.js library in your HTML file)
const audioFiles = {
    Monoballs: 'mp3/Monoballs.mp3', 
    ChocoKrispis: 'mp3/ChocoKrispis.mp3',
    ColaCao: 'mp3/ColaCao.mp3', 
    Trix: 'mp3/Trix.mp3', 
    Chocapic: 'mp3/Chocapic.mp3'
};

// Load audio files into Tone.js Players
const audioMap = {};
const players = new Tone.Players(audioFiles).toDestination();

for (const [cereal] of Object.entries(audioFiles)) {
    audioMap[cereal] = players.player(cereal);
}

function setVolume(cereal, volume) {
    if (audioMap[cereal]) {
        audioMap[cereal].volume.value = volume;
    }
}

// Function to handle keyboard events
document.addEventListener("keydown", (event) => {
    // Find the box element with the matching data-key attribute
    const box = document.querySelector(`.box[data-key="${event.key}"]`);
    if (box) {
      // Trigger a click on the found box
      box.querySelector("a").click();
    }
  });

  
// Event listener for image boxes to load new charts on click
document.querySelectorAll('.image-boxes .box').forEach(box => {
    box.addEventListener('click', () => {
        const cereal = box.getAttribute('data-cereal');

        // Check if the clicked box is "Image 1" (default view)
        if (cereal === 'default') {
            // Show 'myDiv' and hide 'newDiv' and 'SodioDiv'
            document.getElementById('myDiv').style.display = 'block';
            document.getElementById('newDiv').style.display = 'none';
            document.getElementById('SodioDiv').style.display = 'none';
            return; // Exit the function to avoid further processing
        }

        // For other image boxes, hide 'myDiv' and show 'newDiv' and 'SodioDiv'
        document.getElementById('myDiv').style.display = 'none';
        document.getElementById('newDiv').style.display = 'block';
        document.getElementById('SodioDiv').style.display = 'block';

        // Stop all other sounds and play the new sound
        players.stopAll();
        if (cereal && audioMap[cereal]) {
            // Set volume for the current cereal (example volume level)
            setVolume(cereal, -10); // Adjust -10 to desired volume level for each cereal
            audioMap[cereal].start();
        }

        // Fetch and display nutritional data chart in 'newDiv'
        fetchData1(cereal).then(({ traces, annotations, cereal }) => {
            const layout = {
                title: `Datos Nutricionales de ${cereal}`,
                xaxis: { tickvals: ['2010', '2012', '2015', '2016', '2024'], tickmode: 'array' },
                yaxis: { range: [0, 26], showticklabels: false },
                showlegend: false,
                margin: { l: 70, r: 100, t: 130 },
                annotations: [
                    ...annotations,
                    {
                        x: '2016',
                        y: 26,
                        xref: 'x',
                        yref: 'y',
                        text: 'Implementación<br>sellos',
                        showarrow: false,
                        font: { color: 'black', size: 13 },
                        xanchor: 'center',
                        yanchor: 'bottom'
                    },
                    {
                        x: '2012',
                        y: 26,
                        xref: 'x',
                        yref: 'y',
                        text: 'Aprobación<br>ley',
                        showarrow: false,
                        font: { color: 'black', size: 13 },
                        xanchor: 'center',
                        yanchor: 'bottom'
                    },
                    {
                        x: '2010',
                        y: 26,
                        xref: 'x',
                        yref: 'y',
                        text: '<b>Nutrientes[g]<b>',
                        showarrow: false,
                        font: { color: 'black', size: 14 },
                        xanchor: 'right',
                        yanchor: 'bottom'
                    }
                ],
                shapes: [
                    { type: 'line', x0: '2016', y0: 0, x1: '2016', y1: 50, xref: 'x', yref: 'y', line: { color: 'black', width: 2, dash: 'dot' }, layer: 'below' },
                    { type: 'line', x0: '2012', y0: 0, x1: '2012', y1: 50, xref: 'x', yref: 'y', line: { color: 'black', width: 2, dash: 'dot' }, layer: 'below' }
                ]
            };
            Plotly.newPlot('newDiv', traces, layout);
        });

        // Fetch and display sodium data chart in 'SodioDiv'
        fetchSodio(cereal).then(({ traces, annotations, cereal }) => {
            const layout = {
                title: `Datos Sodio[mg] de ${cereal}`,
                xaxis: { tickvals: ['2010', '2012', '2015', '2016', '2024'], tickmode: 'array' },
                yaxis: { range: [0, 145], showticklabels: false },
                showlegend: false,
                margin: { l: 70, r: 100, t: 130 },
                annotations: [
                    ...annotations,
                    {
                        x: '2016',
                        y: 145,
                        xref: 'x',
                        yref: 'y',
                        text: 'Implementación<br>sellos',
                        showarrow: false,
                        font: { color: 'black', size: 13 },
                        xanchor: 'center',
                        yanchor: 'bottom'
                    },
                    {
                        x: '2012',
                        y: 145,
                        xref: 'x',
                        yref: 'y',
                        text: 'Aprobación<br>ley',
                        showarrow: false,
                        font: { color: 'black', size: 13 },
                        xanchor: 'center',
                        yanchor: 'bottom'
                    },
                    {
                        x: '2010',
                        y: 145,
                        xref: 'x',
                        yref: 'y',
                        text: '<b>Sodio[mg]<b>',
                        showarrow: false,
                        font: { color: 'black', size: 14 },
                        xanchor: 'right',
                        yanchor: 'bottom'
                    }
                ],
                shapes: [
                    { type: 'line', x0: '2016', y0: 0, x1: '2016', y1: 145, xref: 'x', yref: 'y', line: { color: 'black', width: 2, dash: 'dot' }, layer: 'below' },
                    { type: 'line', x0: '2012', y0: 0, x1: '2012', y1: 145, xref: 'x', yref: 'y', line: { color: 'black', width: 2, dash: 'dot' }, layer: 'below' }
                ]
            };
            Plotly.newPlot('SodioDiv', traces, layout);
        });
    });
});


