import React, { useState, useEffect, useRef } from "react";
import * as echarts from "echarts";
import RecentUsers from "./components/RecentUsers";
import { useQuery } from "@tanstack/react-query";
import { dashboardStatsApi } from "../../../utils/api";

interface DashboardData {
  totalProperties: number;
  totalVisits: number;
  totalUsers: number;
  propertiesOverTime: Array<{ month: string; count: number }>;
  propertiesByLocation: Array<{ location: string; count: number }>;
  recentUsers: Array<{
    username: string;
    email: string;
    phone: string;
    loginType: string;
  }>;
}

const Dashboard: React.FC = () => {
  const lineChartRef = useRef<HTMLDivElement>(null);
  const barChartRef = useRef<HTMLDivElement>(null);
  const [lineChart, setLineChart] = useState<echarts.EChartsType | null>(null);
  const [barChart, setBarChart] = useState<echarts.EChartsType | null>(null);

  // get dashboard stats
  const { data, isLoading, isError, error } = useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await dashboardStatsApi();
      return await res.data;
    },
  });

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
    if (lineChartRef.current && !lineChart && data) {
      try {
        // Make sure the container is visible and has dimensions
        lineChartRef.current.style.width = "100%";
        lineChartRef.current.style.height = "16rem";

        // Initialize with renderer explicitly set
        const chart = echarts.init(lineChartRef.current, null, {
          renderer: "canvas",
        });

        // Default months if no data is available
        const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const defaultData = [0, 0, 0, 0, 0, 0];
        
        // Use API data if available, otherwise use defaults
        const months = data.propertiesOverTime && data.propertiesOverTime.length > 0 
          ? data.propertiesOverTime.map(item => item.month) 
          : defaultMonths;
          
        const counts = data.propertiesOverTime && data.propertiesOverTime.length > 0 
          ? data.propertiesOverTime.map(item => item.count) 
          : defaultData;
        
        // Find max value for y-axis or use default if no data
        const maxValue = counts.length > 0 ? Math.max(...counts, 10) : 10;
        const interval = Math.ceil(maxValue / 4);

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
            data: months,
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
            max: maxValue,
            interval: interval,
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
              data: counts,
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
    if (barChartRef.current && !barChart && data) {
      try {
        // Make sure the container is visible and has dimensions
        barChartRef.current.style.width = "100%";
        barChartRef.current.style.height = "16rem";

        // Initialize with renderer explicitly set
        const chart = echarts.init(barChartRef.current, null, {
          renderer: "canvas",
        });

        // Default locations if no data is available
        const defaultLocations = ["No Data"];
        const defaultCounts = [0];
        
        // Use API data if available, otherwise use defaults
        const locations = data.propertiesByLocation && data.propertiesByLocation.length > 0 
          ? data.propertiesByLocation.map(item => item.location) 
          : defaultLocations;
          
        const counts = data.propertiesByLocation && data.propertiesByLocation.length > 0 
          ? data.propertiesByLocation.map(item => item.count) 
          : defaultCounts;
        
        // Find max value for y-axis or use default if no data
        const maxValue = counts.length > 0 ? Math.max(...counts, 5) : 5;
        const interval = Math.ceil(maxValue / 4);

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
            data: locations,
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
            max: maxValue,
            interval: interval,
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
              data: counts,
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
  }, [data, lineChart, barChart]);

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
  }, [lineChart, barChart, data]); // Added data to dependencies to resize charts when data changes

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

      {/* Error State */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm">{(error as Error)?.message || "Please try again later"}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Content when data is loaded */}
      {!isLoading && !isError && data && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Properties Card */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Total Properties Listed</p>
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">{data.totalProperties}</h3>
                  <p className="text-xs text-green-500 mt-1">
                    Updated today
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
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">{data.totalVisits}</h3>
                  <p className="text-xs text-green-500 mt-1">Updated today</p>
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
                  <h3 className="text-3xl font-bold mt-2 text-gray-800">{data.totalUsers}</h3>
                  <p className="text-xs text-green-500 mt-1">
                    Updated today
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
              {data.propertiesOverTime && data.propertiesOverTime.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">No time series data available</p>
                </div>
              )}
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Properties by Location
              </h3>
              {data.propertiesByLocation && data.propertiesByLocation.length > 0 ? (
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
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-50 rounded">
                  <p className="text-gray-500">No location data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Users Section */}
          {data.recentUsers && data.recentUsers.length > 0 ? (
            <RecentUsers users={data.recentUsers} />
          ) : (
            <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow-sm mt-6">
              <p className="text-gray-500">No recent users data available</p>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Dashboard;
