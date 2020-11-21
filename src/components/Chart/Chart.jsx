import React, { useState, useEffect } from "react";
import { fetchDailyData } from "../../api";
import { Line, Bar } from "react-chartjs-2";
import styles from "./Chart.module.css";
import Numeral from "numeral";

const Chart = ({ data: { confirmed, recovered, deaths }, country }) => {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const fetchAPI = async () => {
      setDailyData(await fetchDailyData());
    };

    fetchAPI();
  }, []);

  const lineChart = dailyData.length ? (
    <Line
      data={{
        labels: dailyData.map(({ date }) => date),
        datasets: [
          {
            data: dailyData.map(({ confirmed }) => confirmed),
            label: "Infected",
            borderColor: "rgba(0, 0, 255, 0.5)",
            backgroundColor: "rgba(0, 0, 255, 0.1)",
            fill: true,
          },
          {
            data: dailyData.map(({ deaths }) => deaths),
            label: "Deaths",
            borderColor: "rgba(255, 0, 0, 0.5)",
            backgroundColor: "rgba(255, 0, 0, 0.3)",
            fill: true,
          },
        ],
      }}
      options={{
        title: {
          display: true,
          text: `Current global stats for COVID-19`,
          fontSize: 20,
        },
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                callback(value) {
                  return Number(value).toLocaleString("en");
                },
              },
            },
          ],
        },
        tooltips: {
          mode: "label",
          label: "mylabel",
          callbacks: {
            label: function (tooltipItem, data) {
              return tooltipItem.yLabel
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
          },
        },
      }}
    />
  ) : null;

  const barChart = confirmed ? (
    <Bar
      data={{
        labels: ["Infected", "Recovered", "Deaths"],
        datasets: [
          {
            label: "People",
            backgroundColor: [
              "rgba(0, 0, 255, 0.5)",
              "rgba(0, 255, 0, 0.5)",
              "rgba(255, 0, 0, 0.5)",
            ],
            data: [confirmed.value, recovered.value, deaths.value],
          },
        ],
      }}
      options={{
        legend: { display: false },
        title: {
          display: true,
          text: `Current stats for ${country}`,
          fontSize: 20,
        },
        maintainAspectRatio: true,
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                callback(value) {
                  return Number(value).toLocaleString("en");
                },
              },
            },
          ],
        },
        tooltips: {
          mode: "label",
          label: "mylabel",
          callbacks: {
            label: function (tooltipItem) {
              return tooltipItem.yLabel
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            },
          },
        },
      }}
    />
  ) : null;

  return (
    <div className={styles.container}>{country ? barChart : lineChart}</div>
  );
};

export default Chart;
