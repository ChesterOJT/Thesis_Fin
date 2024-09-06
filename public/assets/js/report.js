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

const dataRef1 = database.ref("dc_voltage");

dataRef1.on(
  "value",
  function (snapshot) {
    const volt = snapshot.val();
    document.getElementById("voltage1").textContent = volt + "v";

    // Update battery level and percentage based on voltage
    updateBatteryLevel(volt);

    // Update the global current voltage
    window.currentVoltage = volt;
  },
  function (error) {
    // Error handler that logs any issues to the console
    console.error("Error fetching data:", error);
  }
);
// Function to update the bar chart with new data
function updateBarChart(totPower) {
  const ctx = document.getElementById("barChart").getContext("2d");

  // Define all months
  const allMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthIndex = new Date().getMonth(); // Get current month index (0-11)

  if (!window.myBarChart) {
    window.myBarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: allMonths, // Initialize with all months
        datasets: [
          {
            label: "Total Power Consumption (kWh)",
            backgroundColor: "rgba(204, 85, 0, 0.8)",
            borderColor: "rgba(204, 85, 0, 1)",
            borderWidth: 1,
            data: new Array(12).fill(0), // Initialize data for 12 months
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
          },
          y: {
            beginAtZero: true,
            scaleLabel: {
              display: true,
              labelString: "Power (kWh)",
            },
          },
        },
      },
    });
  }

  // Update the data for the current month
  window.myBarChart.data.datasets[0].data[currentMonthIndex] = totPower;

  window.myBarChart.update();
}

// Fetch total power from Firebase and update the chart
database.ref("total_power_kwh").on(
  "value",
  function (snapshot) {
    const totPower = snapshot.val();
    console.log("Total Power:", totPower); // Debugging log
    updateBarChart(totPower);
  },
  function (error) {
    console.error("Error fetching total power data:", error);
  }
);

// Function to update the line chart with new data
function updateLineChart(voltageData, timeLabels) {
  const ctx = document.getElementById("lineChart").getContext("2d");

  if (!window.myLineChart) {
    window.myLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: timeLabels, // Time labels for the last 24 hours
        datasets: [
          {
            label: "Battery Voltage (V)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            data: voltageData, // Voltage data for the last 24 hours
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
              maxTicksLimit: 24, // Limit the number of ticks on the x-axis to 24
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
          text: "Battery Voltage over Last 24 Hours", // Add chart title
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
  } else {
    window.myLineChart.data.labels = timeLabels;
    window.myLineChart.data.datasets[0].data = voltageData;
    window.myLineChart.update();
  }
}

// Fetch historical data for the last 24 hours from Firebase
function fetchHistoricalData() {
  const dataRef = firebase.database().ref("Logs");
  const endTime = new Date(); // Current time
  const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  dataRef.once("value", (snapshot) => {
    const logs = snapshot.val();
    const labels = [];
    const voltages = [];

    for (const date in logs) {
      if (logs.hasOwnProperty(date)) {
        for (const timestamp in logs[date]) {
          if (logs[date].hasOwnProperty(timestamp)) {
            const logTime = new Date(timestamp);
            if (logTime >= startTime && logTime <= endTime) {
              labels.push(logTime.toLocaleTimeString());
              voltages.push(logs[date][timestamp].dc_voltage);
            }
          }
        }
      }
    }

    updateLineChart(voltages, labels);
  });
}

// Fetch the historical data on page load
fetchHistoricalData();

window.onload = function () {
  setTimeout(function () {
    window.print();
  }, 2000);
};
