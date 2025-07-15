import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';

const { 
  FiUsers, 
  FiTrendingUp, 
  FiBarChart2, 
  FiPieChart,
  FiCalendar,
  FiMap,
  FiSearch
} = FiIcons;

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - Replace with actual data from your backend
  const mockStudentData = {
    totalStudents: 1250,
    activeStudents: 980,
    newThisMonth: 145,
    verifiedStudents: 1100,
  };

  const mockEnrollmentData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [120, 150, 180, 220, 250, 280],
  };

  const mockSubjectPopularity = {
    'SAT': 450,
    'ACT': 380,
    'PSAT': 290,
    'AP Subjects': 420,
    'Algebra 1': 310,
    'Algebra 2': 280,
    'Pre-Calculus': 260,
    'AP Pre-Calculus': 240,
  };

  const mockGeographicData = {
    'New York': 300,
    'California': 280,
    'Texas': 220,
    'Florida': 190,
    'Illinois': 160,
  };

  // Chart Options
  const enrollmentChartOption = {
    title: {
      text: 'Enrollment Trends',
      left: 'center',
      top: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: mockEnrollmentData.labels
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: mockEnrollmentData.data,
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.3
      },
      itemStyle: {
        color: '#3B82F6'
      }
    }]
  };

  const subjectChartOption = {
    title: {
      text: 'Subject Popularity',
      left: 'center',
      top: 0
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '18',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: Object.entries(mockSubjectPopularity).map(([name, value]) => ({
        name,
        value
      }))
    }]
  };

  const geographicChartOption = {
    title: {
      text: 'Geographic Distribution',
      left: 'center',
      top: 0
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: Object.keys(mockGeographicData)
    },
    series: [{
      type: 'bar',
      data: Object.values(mockGeographicData),
      itemStyle: {
        color: '#3B82F6'
      }
    }]
  };

  const StatCard = ({ icon, title, value, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="p-3 rounded-full bg-blue-100">
          <SafeIcon icon={icon} className="w-6 h-6 text-blue-600" />
        </div>
        {trend && (
          <span className="text-green-500 flex items-center text-sm">
            <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
            {trend}%
          </span>
        )}
      </div>
      <h3 className="text-xl font-semibold mt-4">{value.toLocaleString()}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-gray-600">
              Analytics and insights for student management
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="relative">
              <SafeIcon 
                icon={FiSearch} 
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FiUsers}
            title="Total Students"
            value={mockStudentData.totalStudents}
            trend={12}
          />
          <StatCard
            icon={FiUsers}
            title="Active Students"
            value={mockStudentData.activeStudents}
            trend={8}
          />
          <StatCard
            icon={FiCalendar}
            title="New This Month"
            value={mockStudentData.newThisMonth}
            trend={15}
          />
          <StatCard
            icon={FiUsers}
            title="Verified Students"
            value={mockStudentData.verifiedStudents}
            trend={10}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Enrollment Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <ReactECharts option={enrollmentChartOption} style={{ height: '400px' }} />
          </motion.div>

          {/* Subject Popularity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <ReactECharts option={subjectChartOption} style={{ height: '400px' }} />
          </motion.div>

          {/* Geographic Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg col-span-1 lg:col-span-2"
          >
            <ReactECharts option={geographicChartOption} style={{ height: '400px' }} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;