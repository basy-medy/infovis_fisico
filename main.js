import "https://cdn.plot.ly/plotly-2.34.0.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/tone/15.1.3/Tone.min.js";
import CameraMovement from './js/cameraMovement.js';

import Protobject from './js/protobject.js';

const styles = `
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 200px; /* Adjust this value as needed */
}

.header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.logo {
    width: 150px;
    height: auto;
    margin-right: 20px;
}

.text {
    max-width: 600px;
    background-color: rgba(255, 255, 255, 0.8); /* White background with 80% opacity */
    padding: 15px; /* Add padding for spacing inside the box */
    border-radius: 10px; /* Optional: rounded corners */
}

.chart-container {
    display: flex;
    align-items: center;
}

.chart-text {
    max-width: 300px; /* Adjust width as needed */
    margin-right: 20px; /* Space between text and chart */
    text-align: left; /* Align text to the left */
}

.additional-image {
    max-width: 100%; /* Responsive image */
    height: auto; /* Maintain aspect ratio */
    margin-top: 10px; /* Add some space above the image */
}

#myDiv {
    width: 700px;
    height: 700px;
}

#newDiv {
    width: 700px;
    height: 700px;
}

#SodioDiv {
    width: 700px;
    height: 700px;
}

.image-boxes {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
  }
  
  .box {
    flex: 1;
    max-width: 100px; /* Set the max width of each box */
    text-align: center;
  }
  
  .box img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    transition: transform 0.3s;
  }
  
  .box img:hover {
    transform: scale(1.05);
  }   
  body {
      padding-top: 100px; /* Adjust this value as needed */
    }
    
.counter-container {
    position: fixed;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
    `

const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

document.body.insertAdjacentHTML('beforeend', `
<body>
  <div class="container">
    <div class="header">
      <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/sello.png" alt="Logo" class="logo">
      <div class="text">
        <p>
          En el año 2012 fue aprobada la <a href="https://www.bcn.cl/leychile/navegar?idNorma=1041570"><b>Ley de sellos (N° 20606)</b></a>, que tenía como principal objetivo fomentar los habitos saludables en Chile mediante un etiquetado claro y sencillo. Específicamente los cereales, modificaron sus fórmulas,
          reduciendo principalmente la cantidad de azúcares por porción.
        </p>
      </div>
    </div>

    <!-- New Section for Image Boxes with Links -->
    <div class="image-boxes">
      <div class="box" data-cereal="default">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/cereals.png" alt="Image 1">
        </a>
      </div>
      <div class="box" data-cereal="Monoballs">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Monoballs.png" alt="Image 2">
        </a>
      </div>
      <div class="box" data-cereal="ChocoKrispis">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Choco krispis.png" alt="Image 3">
        </a>
      </div>
      <div class="box" data-cereal="ColaCao">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Cola Cao.png" alt="Image 4">
        </a>
      </div>
      <div class="box" data-cereal="Trix">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Trix.png" alt="Image 5">
        </a>
      </div>
      <div class="box" data-cereal="Chocapic">
        <a href="javascript:void(0)">
          <img src="https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Chocapic.png" alt="Image 6">
        </a>
      </div>
    </div>

    <div class="text">
        <li>
          Has click en los logos de los cereales para ver datos sobre sus valores nutricionales a través de los años.
        </li>
        <li>
          Has click en el cereal genérico para volver al gráfico de azúcares por cereal.
        </li>
    </div>

    <div class="chart-container">
      <div id="myDiv" class="chart-box"></div> <!-- Initially visible -->
      <div id="newDiv" class="chart-box" style="display: none;"></div> <!-- Initially hidden -->
      <div id="SodioDiv" class="chart-box" style="display: none;"></div> <!-- Initially hidden -->
  	
     <div class="counter-container">
       <p>¡Cuidado! Estarías consumiendo:</p>
       <div class="counter" id="counter">0</div>
       <p>gramos de azúcar en esta ración</p>
    </div>
    </div>
  </div>`
          )
let counter = 0;

setInterval(() => {
    if (counter > 0) {
        const message = `Cuidado! Estarías consumiendo ${counter} gramos de azúcar en esta ración `;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'es'; // Set language to Spanish
        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
            counter = 0;
            document.getElementById('counter').textContent = counter;
        };
    } else {
        counter = 0;
        document.getElementById('counter').textContent = counter;
    }
}, 20000);

Protobject.onReceived((data) => {
    console.log(data.key);
    if (data.key >= 8) {
        // Adding a delay of 1 second (1000 milliseconds) before incrementing the counter
        setTimeout(() => {
            counter++;
            document.getElementById('counter').textContent = Math.round(counter * 0.8);
        }, 1000); // Delay in milliseconds
    } else {
        // Update the counter without a delay
        document.getElementById('counter').textContent = counter;
    }
});


async function fetchData() { 
    const response = await fetch('https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/cereales.csv');
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
        showlegend: true,
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
    const response = await fetch(`https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/${cereal}.csv`);
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
    const response = await fetch(`https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/${cereal}.csv`);
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
    Monoballs: 'https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Monoballs.mp3', 
    ChocoKrispis: 'https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/ChocoKrispis.mp3',
    ColaCao: 'https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/ColaCao.mp3', 
    Trix: 'https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Trix.mp3', 
    Chocapic: 'https://raw.githubusercontent.com/basy-medy/proyecto_infovis/main/Chocapic.mp3'
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
                showlegend: true,
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
                showlegend: true,
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