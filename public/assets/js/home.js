// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJnBJDnb4F6yfRUAZecsX-GPiXmrO6K3o",
  authDomain: "working-ba4f3.firebaseapp.com",
  databaseURL:
    "https://working-ba4f3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "working-ba4f3",
  storageBucket: "working-ba4f3.appspot.com",
  messagingSenderId: "170127063382",
  appId: "1:170127063382:web:d90e7415f30a11bb00bef7",
  measurementId: "G-TTHR04NDRL",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Reference to your database
const dataRef1 = database.ref("dc_voltage");
const dataRef2 = database.ref("power");
const dataRef3 = database.ref("total_power");

// Fetch the data and update battery level and chart
dataRef1.on(
  "value",
  function (snapshot) {
    const volt = snapshot.val();
    document.getElementById("voltage1").textContent = volt + "v";

    // Update battery level and percentage based on voltage
    updateBatteryLevel(volt);

    // Update chart with new data
    updateChart(volt);

    blinkIcons(volt);
  },
  function (error) {
    // Error handler that logs any issues to the console
    console.error("Error fetching data:", error);
  }
);
dataRef2.on(
  "value",
  function (snapshot) {
    const watt = snapshot.val();
    document.getElementById("power").textContent = watt + "watts";

    // Update chart with new data
  },
  function (error) {
    // Error handler that logs any issues to the console
    console.error("Error fetching data:", error);
  }
);

dataRef3.on(
  "value",
  function (snapshot) {
    const tot = snapshot.val();
    document.getElementById("tot-power").textContent = tot + "watts";

    // Update chart with new data
  },
  function (error) {
    // Error handler that logs any issues to the console
    console.error("Error fetching data:", error);
  }
);

function updateBatteryLevel(voltage) {
  const batteryLevel = document.getElementById("battery-level");
  const batteryPercentage = document.getElementById("battery-percentage");

  // Define the voltage range for 0% to 100%
  const minVoltage = 11.8; // 0%
  const maxVoltage = 12.7; // 100%

  // Calculate the battery percentage based on the voltage
  let percentage = ((voltage - minVoltage) / (maxVoltage - minVoltage)) * 100;

  // Clamp the percentage between 0 and 100
  percentage = Math.min(Math.max(percentage, 0), 100);

  // Update the battery level width and text content
  batteryLevel.style.width = percentage + "%";
  batteryPercentage.textContent = percentage.toFixed(2) + "%";
}
setInterval(() => {
  const volt = window.currentVoltage || 0; // Use the current voltage if available
  const currentTime = new Date().toLocaleTimeString();
  window.myLineChart.data.labels.push(currentTime);
  window.myLineChart.data.datasets.forEach((dataset) => {
    dataset.data.push(volt);
  });
  window.myLineChart.update();
}, 1000); // Update every second

// Update the global current voltage whenever a new value comes in
dataRef1.on("value", function (snapshot) {
  window.currentVoltage = snapshot.val();
});
// Update chart with new data function
// Update chart with new data function
function updateChart(voltage) {
  // Initialize chart if it does not exist
  const ctx = document.getElementById("myChart").getContext("2d");
  if (!window.myLineChart) {
    window.myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "Voltage",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            data: [],
            fill: false,
            lineTension: 0.3, // Make lines smoother
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 10, // Limit the number of ticks on the x-axis to 10
            },
            scaleLabel: {
              display: true,
              labelString: "Time",
            },
          },
          y: {
            scaleLabel: {
              display: true,
              labelString: "Voltage (V)",
            },
          },
        },
        legend: {
          display: false,
        },
        tooltips: {
          intersect: false,
          mode: "index",
        },
        elements: {
          point: {
            radius: 0, // Remove points
          },
        },
        title: {
          display: true,
          text: "Voltage over Time", // Add chart title
          fontSize: 16, // Increase font size
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
        borderColor: "#ccc", // Add border color
        borderWidth: 1, // Add border width
      },
    });
  }

  // Add new data
  const currentTime = new Date().toLocaleTimeString();
  window.myLineChart.data.labels.push(currentTime);
  window.myLineChart.data.datasets.forEach((dataset) => {
    dataset.data.push(voltage);
  });

  // Remove oldest data if more than 10 data points
  if (window.myLineChart.data.labels.length > 10) {
    window.myLineChart.data.labels.shift();
    window.myLineChart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
    });
  }

  window.myLineChart.update();
}

function updateBarChart(totPower) {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (!window.myBarChart) {
    window.myBarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "Total Power",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
            data: [],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "Month",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: "Power (W)",
              },
            },
          ],
        },
      },
    });
  }

  const currentMonth = new Date().toLocaleString("default", { month: "long" }); // Get current month name
  const currentYear = new Date().getFullYear(); // Get current year
  const currentLabel = `${currentMonth} ${currentYear}`;

  // Check if the current month label exists in the chart data
  const index = window.myBarChart.data.labels.indexOf(currentLabel);
  if (index !== -1) {
    // If the current month label exists, update the corresponding dataset value
    window.myBarChart.data.datasets[0].data[index] = totPower;
  } else {
    // If the current month label does not exist, add it and its corresponding dataset value
    window.myBarChart.data.labels.push(currentLabel);
    window.myBarChart.data.datasets[0].data.push(totPower);
  }

  if (window.myBarChart.data.labels.length > 12) {
    // Limit the number of bars to 12 (one year)
    window.myBarChart.data.labels.shift();
    window.myBarChart.data.datasets[0].data.shift();
  }

  window.myBarChart.update();
}

// Update bar chart with new data
dataRef3.on("value", function (snapshot) {
  const totPower = snapshot.val();
  updateBarChart(totPower);
});

document.querySelectorAll(".input-box label").forEach((label) => {
  label.addEventListener("click", () => {
    label.previousElementSibling.focus();
  });
});
