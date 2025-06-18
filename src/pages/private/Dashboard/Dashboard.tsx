import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import RecentUsers from "./components/RecentUsers";

const Dashboard: React.FC = () => {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const [lineChart, setLineChart] = useState<echarts.EChartsType | null>(null);
  const [barChart, setBarChart] = useState<echarts.EChartsType | null>(null);

  // Initialize charts
  useEffect(() => {
    // Cleanup function to dispose charts when component unmounts
    const cleanupCharts = () => {
      if (lineChart) {
        lineChart.dispose();
      }
      if (barChart) {
        barChart.dispose();
      }
    };

    // Initialize line chart
    if (lineChartRef.current && !lineChart) {
      try {
        // Make sure the container is visible and has dimensions
        lineChartRef.current.style.width = "100%";
        lineChartRef.current.style.height = "16rem";

        // Initialize with renderer explicitly set
        const chart = echarts.init(lineChartRef.current, null, {
          renderer: "canvas",
        });

        const option = {
          animation: false,
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            axisLine: {
              lineStyle: {
                color: "#ddd",
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: 30,
            interval: 7,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
                type: "dashed",
              },
            },
          },
          series: [
            {
              name: "Properties",
              type: "line",
              data: [28, 10, 21, 22, 19, 27],
              symbol: "circle",
              symbolSize: 6,
              itemStyle: {
                color: "#1a202c",
              },
              lineStyle: {
                width: 2,
                color: "#1a202c",
              },
            },
          ],
          tooltip: {
            trigger: "axis",
          },
        };
        chart.setOption(option);
        setLineChart(chart);
      } catch (error) {
        console.error("Failed to initialize line chart:", error);
      }
    }

    // Initialize bar chart
    if (barChartRef.current && !barChart) {
      try {
        // Make sure the container is visible and has dimensions
        barChartRef.current.style.width = "100%";
        barChartRef.current.style.height = "16rem";

        // Initialize with renderer explicitly set
        const chart = echarts.init(barChartRef.current, null, {
          renderer: "canvas",
        });

        const option = {
          animation: false,
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: [
              "Indore",
              "Indore",
              "INDORE",
              "Delhi",
              "indore",
              "mardan",
              "ISLAMABAD",
            ],
            axisLabel: {
              interval: 0,
              rotate: 30,
              fontSize: 10,
            },
            axisLine: {
              lineStyle: {
                color: "#ddd",
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: {
            type: "value",
            max: 20,
            interval: 5,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                color: "#eee",
                type: "dashed",
              },
            },
          },
          series: [
            {
              name: "Properties",
              type: "bar",
              data: [20, 11, 17, 12, 2, 3, 2],
              itemStyle: {
                color: "#1a202c",
              },
              barWidth: "60%",
            },
          ],
          tooltip: {
            trigger: "axis",
          },
        };
        chart.setOption(option);
        setBarChart(chart);
      } catch (error) {
        console.error("Failed to initialize bar chart:", error);
      }
    }

    // Handle window resize
    const handleResize = () => {
      // Force recalculation of container dimensions
      if (lineChart && lineChartRef.current) {
        // Ensure the container has proper dimensions
        lineChartRef.current.style.width = "100%";
        lineChartRef.current.style.height = "16rem";

        // Force chart to resize to container
        setTimeout(() => {
          lineChart.resize();
        }, 0);
      }

      if (barChart && barChartRef.current) {
        // Ensure the container has proper dimensions
        barChartRef.current.style.width = "100%";
        barChartRef.current.style.height = "16rem";

        // Force chart to resize to container
        setTimeout(() => {
          barChart.resize();
        }, 0);
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      cleanupCharts();
    };
  }, []);

  // Force resize charts after component has mounted, on window resize, and when sidebar is toggled
  useEffect(() => {
    if (lineChart || barChart) {
      // Function to resize charts
      const resizeCharts = () => {
        if (lineChart && lineChartRef.current) {
          lineChart.resize();
        }
        if (barChart && barChartRef.current) {
          barChart.resize();
        }
      };

      // Initial resize with a delay to ensure DOM is ready
      const timer = setTimeout(resizeCharts, 200);

      // Add a resize observer to detect container size changes
      if (lineChartRef.current || barChartRef.current) {
        const resizeObserver = new ResizeObserver(() => {
          resizeCharts();
        });

        if (lineChartRef.current) {
          resizeObserver.observe(
            lineChartRef.current.parentElement || lineChartRef.current
          );
        }

        if (barChartRef.current) {
          resizeObserver.observe(
            barChartRef.current.parentElement || barChartRef.current
          );
        }

        return () => {
          clearTimeout(timer);
          resizeObserver.disconnect();
        };
      }

      return () => clearTimeout(timer);
    }
  }, [lineChart, barChart]); // Add sidebarOpen to dependencies to resize charts when sidebar is toggled

  return (
    <main className="flex-1 p-5 transition-all duration-300">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h2>
      </div>

      {/* Mobile Title - Only visible on small screens */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 md:hidden">
        Dashboard Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Properties Card */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Properties Listed</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">77</h3>
              <p className="text-xs text-green-500 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <i className="fas fa-building text-xl"></i>
            </div>
          </div>
        </div>

        {/* Visits Card */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Visits Scheduled</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">23</h3>
              <p className="text-xs text-green-500 mt-1">+8% from last month</p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
          </div>
        </div>

        {/* Users Card */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Total Users Registered</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">10</h3>
              <p className="text-xs text-green-500 mt-1">
                +15% from last month
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <i className="fas fa-users text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Properties Added Over Time
          </h3>
          <div
            ref={lineChartRef}
            className="w-full h-64"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "16rem",
              position: "relative",
            }}
          ></div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Properties by Location
          </h3>
          <div
            ref={barChartRef}
            className="w-full h-64"
            style={{
              width: "100%",
              height: "100%",
              minHeight: "16rem",
              position: "relative",
            }}
          ></div>
        </div>
      </div>
      <RecentUsers />
    </main>
  );
};

export default Dashboard;
