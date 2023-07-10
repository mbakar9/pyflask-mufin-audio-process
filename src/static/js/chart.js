let myFirstData = $('.data').text();

let first = myFirstData.split(',')[0].split(':')[0].trim();

$('h1 span').text(first.toUpperCase());

let howData = [];
let howDataPer = [];

let howColor = [
    '#2ecc71', '#e67e22', '#9b59b6', '#273c75', '#9c88ff', '#fbc531', '#487eb0', '#f3a683', '#cf6a87', '#63cdda'
];

let howHovColor = [
    '#27ae60', '#d35400', '#8e44ad', '#192a56', '#8c7ae6', '#e1b12c', '#40739e', '#f19066', '#f78fb3', '#3dc1d3'
];

let realColor = [];
let realHovColor = [];

for (let index = 0; index < (myFirstData.split(',').length - 1); index++) {
    howData.push(myFirstData.split(',')[index].split(':')[0].trim());
    howDataPer.push(parseInt(myFirstData.split(',')[index].split(':')[1].replace(' ', '').replace('%', '')));
    realColor.push(howColor[index]);
    realHovColor.push(howHovColor[index]);
}

const PLATFORMS = howData;
const COLORS = realColor;
const HOVERCOLORS = realHovColor;

const data = {
    labels: PLATFORMS,
    datasets: [{
        label: "ŞARKI TÜRÜ",
        backgroundColor: COLORS,
        borderWidth: 0,
        hoverBackgroundColor: HOVERCOLORS,
        data: howDataPer,
    }]
};

const options = {
    maintainAspectRatio: false,
    plugins: {
        title: {
            display: false,
        },
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                boxWidth: 20,
                padding: 20,
                COLORS: ['#fff', '#fff', '#fff']
            }
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                    return `${label}: ${percentage}%`;
                }
            }
        },
    },
    layout: {
        padding: {
            top: 20,
            left: 30,
            right: 30,
            bottom: 20
        }
    },
};

new Chart('chart', {
    type: 'doughnut',
    options: options,
    data: data
});