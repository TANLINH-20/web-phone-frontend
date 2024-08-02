import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { numberWithComma } from '../../utils/NumberFunctions'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import { Link } from 'react-router-dom'

const DashboardHome = () => {
  const [dashboardData, setDashboardData] = useState({
    annualEarning: [],
    monthlyEarning: [],
    ordersCompletedRatio: 0,
    ordersPending: 0,
    revenueSources: []
  })

  useEffect(() => {
    getData()
  }, [])

  const getData = () => {
    axios.get('http://127.0.0.1:8000/api/dashboard').then(result => {
      setDashboardData({
        annualEarning: result.data.annual_earnings,
        monthlyEarning: result.data.monthly_earnings,
        ordersCompletedRatio: (result.data.orders_completed_ratio * 100).toFixed(2),
        ordersPending: result.data.orders_pending,
        revenueSources: result.data.revenue_sources
      })
    })
  }

  const calculateAverage = (data) => {
    if (!data.length) return 0
    const sum = data.reduce((acc, curr) => acc + curr.sums, 0)
    return (sum / data.length).toFixed(0)
  }

  const annualEarningAvg = calculateAverage(dashboardData.annualEarning)
  const monthlyEarningAvg = calculateAverage(dashboardData.monthlyEarning)
  const sourceNames = dashboardData.revenueSources.map(s => s.name)

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <Link to={'/'} className="btn btn-sm btn-primary shadow-sm">
          <i className="bi bi-download me-1"></i> Generate Report
        </Link>
      </div>

      <div className="row">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-primary border-3 shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-primary text-uppercase mb-1">Earnings (Monthly)</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">${numberWithComma(monthlyEarningAvg)}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-calendar fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-success border-3 shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-success text-uppercase mb-1">Earnings (Annual)</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">${numberWithComma(annualEarningAvg)}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-currency-dollar fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-info border-3 shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-info text-uppercase mb-1">Orders Completed</div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 me-3 fw-bold text-gray-800">{dashboardData.ordersCompletedRatio}%</div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm me-2">
                        <div className="progress-bar bg-info" role="progressbar" style={{width: `${dashboardData.ordersCompletedRatio}%`}} aria-valuenow={dashboardData.ordersCompletedRatio} aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-clipboard-check fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-warning border-3 shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs fw-bold text-warning text-uppercase mb-1">Pending Orders</div>
                  <div className="h5 mb-0 fw-bold text-gray-800">{dashboardData.ordersPending}</div>
                </div>
                <div className="col-auto">
                  <i className="bi bi-clock-history fs-2 text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Earnings Overview</h6>
              <div className="dropdown">
                <button className="btn btn-link text-xs dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-area">
                {dashboardData.monthlyEarning.length > 0 && <LineChart data={dashboardData.monthlyEarning} />}
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 fw-bold text-primary">Revenue Sources</h6>
              <div className="dropdown">
                <button className="btn btn-link text-xs dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-pie pt-4 pb-2">
                {dashboardData.revenueSources.length > 0 && <PieChart data={dashboardData.revenueSources} />}
              </div>
              <div className="mt-4 text-center small">
                {sourceNames.map((name, index) => (
                  <span key={index} className="me-2">
                    <i className={`bi bi-circle-fill text-${['primary', 'success', 'info'][index]}`}></i> {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardHome