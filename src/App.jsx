
import React, { useState, useEffect } from 'react';

// Centralized ROLES configuration for strict RBAC
const ROLES = {
  BUSINESS_USER: 'BUSINESS_USER',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  SUPPLIER: 'SUPPLIER',
};

// Standardized status keys and mapping object for UI labels and colors
const STATUS_MAP = {
  DRAFT: { label: 'Draft', colorClass: 'status-DRAFT' },
  PENDING: { label: 'Pending Approval', colorClass: 'status-PENDING' },
  APPROVED: { label: 'Approved', colorClass: 'status-APPROVED' },
  REJECTED: { label: 'Rejected', colorClass: 'status-REJECTED' },
  IN_PROGRESS: { label: 'In Progress', colorClass: 'status-IN_PROGRESS' },
  COMPLETED: { label: 'Completed', colorClass: 'status-COMPLETED' },
  CANCELLED: { label: 'Cancelled', colorClass: 'status-CANCELLED' },
  ONBOARDED: { label: 'Onboarded', colorClass: 'status-ONBOARDED' },
  REVIEW: { label: 'Under Review', colorClass: 'status-REVIEW' },
};

// --- Dummy Data ---
const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomStatus = (entityType) => {
  const statuses = {
    REQUEST: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    SUPPLIER: ['DRAFT', 'PENDING', 'ONBOARDED', 'REJECTED', 'REVIEW'],
    ORDER: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
    INVOICE: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
  };
  const list = statuses[entityType] || [];
  return list[Math.floor(Math.random() * list.length)];
};

const dummyUsers = [
  { id: 'usr1', name: 'Alice Smith', role: ROLES.PROCUREMENT_OFFICER },
  { id: 'usr2', name: 'Bob Johnson', role: ROLES.BUSINESS_USER },
  { id: 'usr3', name: 'Charlie Brown', role: ROLES.SUPPLIER },
];

const dummySuppliers = [
  { id: 's001', name: 'Global Tech Solutions', contact: 'info@globaltech.com', status: getRandomStatus('SUPPLIER'), onboardingDate: '2023-01-15', tier: 'Preferred' },
  { id: 's002', name: 'ProcurePlus Inc.', contact: 'support@procureplus.net', status: getRandomStatus('SUPPLIER'), onboardingDate: '2022-11-01', tier: 'Standard' },
  { id: 's003', name: 'Innovate Logistics', contact: 'sales@innovatelog.org', status: getRandomStatus('SUPPLIER'), onboardingDate: '2023-03-20', tier: 'Strategic' },
  { id: 's004', name: 'Eco-Friendly Supplies', contact: 'eco@efs.co', status: getRandomStatus('SUPPLIER'), onboardingDate: '2023-06-01', tier: 'Preferred' },
  { id: 's005', name: 'DataServe Ltd.', contact: 'contact@dataserve.io', status: getRandomStatus('SUPPLIER'), onboardingDate: '2022-09-10', tier: 'Standard' },
];

const dummyRequests = [
  {
    id: 'req001',
    title: 'New Laptop Procurement for HR Dept',
    category: 'IT Hardware',
    requester: dummyUsers[1],
    approver: dummyUsers[0],
    supplierId: 's001',
    amount: 2500,
    status: getRandomStatus('REQUEST'),
    createdDate: '2023-10-26',
    dueDate: '2023-11-10',
    description: 'Procurement of 5 new laptops for the HR department employees. Standard Dell XPS 15 models.',
    workflow: [
      { stage: 'Submission', actor: dummyUsers[1].name, date: '2023-10-26', status: 'completed' },
      { stage: 'Manager Approval', actor: 'Sarah Lee', date: '2023-10-27', status: 'completed' },
      { stage: 'Procurement Review', actor: dummyUsers[0].name, date: '2023-10-28', status: 'in-progress' },
      { stage: 'Budget Approval', actor: 'Finance Dept', date: null, status: 'pending', slaBreached: true },
      { stage: 'Order Placement', actor: dummyUsers[0].name, date: null, status: 'pending' },
    ],
    auditLogs: [
      { id: 'log1', timestamp: '2023-10-26T10:00:00Z', user: dummyUsers[1].name, action: 'created', details: 'Request initiated' },
      { id: 'log2', timestamp: '2023-10-27T11:30:00Z', user: 'Sarah Lee', action: 'approved', details: 'Managerial approval' },
      { id: 'log3', timestamp: '2023-10-28T09:15:00Z', user: dummyUsers[0].name, action: 'reviewed', details: 'Procurement review started' },
    ],
  },
  {
    id: 'req002',
    title: 'Office Supplies Restock',
    category: 'Office Supplies',
    requester: dummyUsers[1],
    approver: dummyUsers[0],
    supplierId: 's002',
    amount: 300,
    status: getRandomStatus('REQUEST'),
    createdDate: '2023-10-25',
    dueDate: '2023-11-05',
    description: 'Bulk order for pens, notebooks, and printer paper for general office use.',
    workflow: [
      { stage: 'Submission', actor: dummyUsers[1].name, date: '2023-10-25', status: 'completed' },
      { stage: 'Manager Approval', actor: 'John Doe', date: '2023-10-25', status: 'completed' },
      { stage: 'Procurement Review', actor: dummyUsers[0].name, date: '2023-10-26', status: 'completed' },
      { stage: 'Budget Approval', actor: 'Finance Dept', date: '2023-10-27', status: 'completed' },
      { stage: 'Order Placement', actor: dummyUsers[0].name, date: '2023-10-28', status: 'completed' },
    ],
    auditLogs: [
      { id: 'log4', timestamp: '2023-10-25T14:00:00Z', user: dummyUsers[1].name, action: 'created', details: 'Office supplies request' },
      { id: 'log5', timestamp: '2023-10-26T10:00:00Z', user: dummyUsers[0].name, action: 'approved', details: 'Procurement officer approved' },
    ],
  },
  {
    id: 'req003',
    title: 'Marketing Software License Renewal',
    category: 'Software',
    requester: dummyUsers[1],
    approver: dummyUsers[0],
    supplierId: 's003',
    amount: 5000,
    status: getRandomStatus('REQUEST'),
    createdDate: '2023-10-20',
    dueDate: '2023-11-15',
    description: 'Renewal of annual license for Adobe Creative Cloud for Marketing team. 10 licenses.',
    workflow: [
      { stage: 'Submission', actor: dummyUsers[1].name, date: '2023-10-20', status: 'completed' },
      { stage: 'Manager Approval', actor: 'Jane Doe', date: '2023-10-21', status: 'pending' },
      { stage: 'Procurement Review', actor: dummyUsers[0].name, date: null, status: 'pending' },
    ],
    auditLogs: [
      { id: 'log6', timestamp: '2023-10-20T09:00:00Z', user: dummyUsers[1].name, action: 'created', details: 'Software license renewal request' },
    ],
  },
  {
    id: 'req004',
    title: 'Consulting Services for Project X',
    category: 'Professional Services',
    requester: dummyUsers[1],
    approver: dummyUsers[0],
    supplierId: 's001',
    amount: 15000,
    status: getRandomStatus('REQUEST'),
    createdDate: '2023-10-18',
    dueDate: '2023-11-30',
    description: 'Engage external consultants for architectural review of Project X infrastructure.',
    workflow: [
      { stage: 'Submission', actor: dummyUsers[1].name, date: '2023-10-18', status: 'completed' },
      { stage: 'Manager Approval', actor: 'Mark White', date: '2023-10-19', status: 'completed' },
      { stage: 'Procurement Review', actor: dummyUsers[0].name, date: '2023-10-20', status: 'completed' },
      { stage: 'Legal Review', actor: 'Legal Dept', date: '2023-10-25', status: 'pending' },
      { stage: 'Contract Signing', actor: dummyUsers[0].name, date: null, status: 'pending' },
    ],
    auditLogs: [
      { id: 'log7', timestamp: '2023-10-18T16:00:00Z', user: dummyUsers[1].name, action: 'created', details: 'Consulting services request' },
      { id: 'log8', timestamp: '2023-10-20T10:00:00Z', user: dummyUsers[0].name, action: 'forwarded', details: 'Forwarded to Legal for review' },
    ],
  },
  {
    id: 'req005',
    title: 'Server Rack Upgrade',
    category: 'Infrastructure',
    requester: dummyUsers[1],
    approver: dummyUsers[0],
    supplierId: 's005',
    amount: 7000,
    status: getRandomStatus('REQUEST'),
    createdDate: '2023-10-10',
    dueDate: '2023-11-20',
    description: 'Upgrade existing server racks in Data Center 1 to accommodate new hardware.',
    workflow: [
      { stage: 'Submission', actor: dummyUsers[1].name, date: '2023-10-10', status: 'completed' },
      { stage: 'Manager Approval', actor: 'Operations Head', date: '2023-10-11', status: 'completed' },
      { stage: 'Procurement Review', actor: dummyUsers[0].name, date: '2023-10-12', status: 'approved' },
      { stage: 'Order Placement', actor: dummyUsers[0].name, date: '2023-10-15', status: 'in-progress' },
      { stage: 'Installation', actor: 'Vendor Team', date: null, status: 'pending' },
    ],
    auditLogs: [
      { id: 'log9', timestamp: '2023-10-10T11:00:00Z', user: dummyUsers[1].name, action: 'created', details: 'Server rack upgrade request' },
      { id: 'log10', timestamp: '2023-10-12T14:00:00Z', user: dummyUsers[0].name, action: 'approved', details: 'Approved and initiated order' },
    ],
  },
];

const dummyOrders = [
  {
    id: 'ord001',
    title: 'PO for HR Laptops',
    requestId: 'req001',
    supplierId: 's001',
    amount: 2500,
    status: getRandomStatus('ORDER'),
    createdDate: '2023-11-01',
    deliveryDate: '2023-11-15',
    items: ['Dell XPS 15 (x5)'],
    approver: dummyUsers[0],
  },
  {
    id: 'ord002',
    title: 'PO for Office Supplies',
    requestId: 'req002',
    supplierId: 's002',
    amount: 300,
    status: getRandomStatus('ORDER'),
    createdDate: '2023-10-29',
    deliveryDate: '2023-11-05',
    items: ['Pens (x100)', 'Notebooks (x50)', 'Printer Paper (x10 reams)'],
    approver: dummyUsers[0],
  },
  {
    id: 'ord003',
    title: 'PO for Marketing Software',
    requestId: 'req003',
    supplierId: 's003',
    amount: 5000,
    status: getRandomStatus('ORDER'),
    createdDate: '2023-11-05',
    deliveryDate: '2023-11-05', // Instant delivery for software license
    items: ['Adobe Creative Cloud Licenses (x10)'],
    approver: dummyUsers[0],
  },
];

const dummyInvoices = [
  {
    id: 'inv001',
    orderId: 'ord001',
    supplierId: 's001',
    amount: 2500,
    status: getRandomStatus('INVOICE'),
    invoiceDate: '2023-11-16',
    dueDate: '2023-12-16',
    items: ['Dell XPS 15 (x5)'],
    paymentStatus: 'PENDING',
  },
  {
    id: 'inv002',
    orderId: 'ord002',
    supplierId: 's002',
    amount: 300,
    status: getRandomStatus('INVOICE'),
    invoiceDate: '2023-11-06',
    dueDate: '2023-12-06',
    items: ['Pens (x100)', 'Notebooks (x50)', 'Printer Paper (x10 reams)'],
    paymentStatus: 'PAID',
  },
];

const getSupplierName = (supplierId) => dummySuppliers?.find(s => s.id === supplierId)?.name || 'N/A';
const getRequesterName = (userId) => dummyUsers?.find(u => u.id === userId)?.name || 'N/A';


function App() {
  const [view, setView] = useState({ screen: 'LOGIN', params: {} });
  const [userRole, setUserRole] = useState(ROLES.PROCUREMENT_OFFICER); // Default role for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [globalSearchActive, setGlobalSearchActive] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Define navigation function within component scope
  const navigate = (screenName, params = {}) => {
    setView({ screen: screenName, params });
    setGlobalSearchActive(false); // Close search when navigating
    setGlobalSearchTerm('');
  };

  const handleLogin = (role) => {
    setIsLoggedIn(true);
    setUserRole(role);
    navigate('DASHBOARD');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('LOGIN');
  };

  const getBreadcrumbs = () => {
    const crumbs = [{ label: 'Home', screen: 'DASHBOARD' }];
    switch (view.screen) {
      case 'DASHBOARD':
        crumbs.push({ label: 'Dashboard', screen: 'DASHBOARD' });
        break;
      case 'REQUEST_LIST':
        crumbs.push({ label: 'Requests', screen: 'REQUEST_LIST' });
        break;
      case 'REQUEST_DETAIL':
      case 'REQUEST_EDIT':
        crumbs.push({ label: 'Requests', screen: 'REQUEST_LIST' });
        const requestId = view.params?.id;
        const request = dummyRequests?.find(r => r.id === requestId);
        if (request) {
          crumbs.push({ label: `Request: ${request.title}`, screen: 'REQUEST_DETAIL', params: { id: requestId } });
        }
        if (view.screen === 'REQUEST_EDIT') {
          crumbs.push({ label: 'Edit', screen: 'REQUEST_EDIT', params: { id: requestId } });
        }
        break;
      case 'SUPPLIER_LIST':
        crumbs.push({ label: 'Suppliers', screen: 'SUPPLIER_LIST' });
        break;
      case 'SUPPLIER_DETAIL':
        crumbs.push({ label: 'Suppliers', screen: 'SUPPLIER_LIST' });
        const supplierId = view.params?.id;
        const supplier = dummySuppliers?.find(s => s.id === supplierId);
        if (supplier) {
          crumbs.push({ label: `Supplier: ${supplier.name}`, screen: 'SUPPLIER_DETAIL', params: { id: supplierId } });
        }
        break;
      case 'ORDER_LIST':
        crumbs.push({ label: 'Orders', screen: 'ORDER_LIST' });
        break;
      case 'ORDER_DETAIL':
        crumbs.push({ label: 'Orders', screen: 'ORDER_LIST' });
        const orderId = view.params?.id;
        const order = dummyOrders?.find(o => o.id === orderId);
        if (order) {
          crumbs.push({ label: `Order: ${order.title}`, screen: 'ORDER_DETAIL', params: { id: orderId } });
        }
        break;
      case 'INVOICE_LIST':
        crumbs.push({ label: 'Invoices', screen: 'INVOICE_LIST' });
        break;
      case 'INVOICE_DETAIL':
        crumbs.push({ label: 'Invoices', screen: 'INVOICE_LIST' });
        const invoiceId = view.params?.id;
        const invoice = dummyInvoices?.find(i => i.id === invoiceId);
        if (invoice) {
          crumbs.push({ label: `Invoice: ${invoice.id}`, screen: 'INVOICE_DETAIL', params: { id: invoiceId } });
        }
        break;
      case 'PROFILE':
        crumbs.push({ label: 'Profile', screen: 'PROFILE' });
        break;
      default:
        break;
    }
    return crumbs;
  };

  const globalSearchResults = globalSearchTerm.length > 2
    ? [
        ...dummyRequests
          .filter(r => r.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) || r.id.toLowerCase().includes(globalSearchTerm.toLowerCase()))
          .map(r => ({ type: 'Request', id: r.id, title: r.title, screen: 'REQUEST_DETAIL' })),
        ...dummySuppliers
          .filter(s => s.name.toLowerCase().includes(globalSearchTerm.toLowerCase()) || s.id.toLowerCase().includes(globalSearchTerm.toLowerCase()))
          .map(s => ({ type: 'Supplier', id: s.id, title: s.name, screen: 'SUPPLIER_DETAIL' })),
        ...dummyOrders
          .filter(o => o.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) || o.id.toLowerCase().includes(globalSearchTerm.toLowerCase()))
          .map(o => ({ type: 'Order', id: o.id, title: o.title, screen: 'ORDER_DETAIL' })),
        ...dummyInvoices
          .filter(i => i.id.toLowerCase().includes(globalSearchTerm.toLowerCase()))
          .map(i => ({ type: 'Invoice', id: i.id, title: `Invoice ${i.id}`, screen: 'INVOICE_DETAIL' })),
      ].slice(0, 10) // Limit results
    : [];


  // --- Screens ---

  // Login Screen
  const LoginScreen = () => {
    return (
      <div className="main-content text-center" style={{ maxWidth: '400px', margin: '60px auto' }}>
        <div className="detail-page">
          <h2>Welcome to Tail Spend Management</h2>
          <p>Please select a role to log in:</p>
          <div className="button-group" style={{ justifyContent: 'center' }}>
            <button className="button button-primary" onClick={() => handleLogin(ROLES.PROCUREMENT_OFFICER)}>
              Log in as Procurement Officer
            </button>
            <button className="button button-secondary" onClick={() => handleLogin(ROLES.BUSINESS_USER)}>
              Log in as Business User
            </button>
            <button className="button button-outline" onClick={() => handleLogin(ROLES.SUPPLIER)}>
              Log in as Supplier
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Screen
  const DashboardScreen = () => {
    // Dummy KPI data
    const totalRequests = dummyRequests?.length || 0;
    const pendingApprovals = dummyRequests?.filter(r => r.status === 'PENDING').length || 0;
    const totalSpend = dummyRequests?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;
    const newSuppliers = dummySuppliers?.filter(s => new Date(s.onboardingDate).getMonth() === new Date().getMonth()).length || 0;

    // Dummy chart data (placeholders)
    const spendByCategory = [
      { category: 'IT Hardware', value: 12000 },
      { category: 'Software', value: 8000 },
      { category: 'Office Supplies', value: 1500 },
      { category: 'Professional Services', value: 20000 },
    ];
    const requestStatusDistribution = [
      { status: 'Approved', value: 40 },
      { status: 'Pending', value: 30 },
      { status: 'Draft', value: 20 },
      { status: 'Rejected', value: 10 },
    ];

    return (
      <div className="dashboard-screen">
        <h1 className="mb-md">Dashboard</h1>

        <div className="dashboard-metrics">
          <div className="metric-card">
            <h3>Total Requests</h3>
            <p>{totalRequests}</p>
          </div>
          <div className="metric-card">
            <h3>Pending Approvals</h3>
            <p>{pendingApprovals}</p>
          </div>
          <div className="metric-card">
            <h3>Total Spend (YTD)</h3>
            <p>${totalSpend.toLocaleString()}</p>
          </div>
          <div className="metric-card">
            <h3>New Suppliers (MTD)</h3>
            <p>{newSuppliers}</p>
          </div>
        </div>

        <div className="dashboard-charts">
          <div className="chart-container">
            <h4>Spend by Category (Bar Chart)</h4>
            <div className="chart-placeholder">Bar Chart Placeholder</div>
            <div className="button-group" style={{ marginTop: 'var(--spacing-md)' }}>
              <button className="button button-outline">Export PDF</button>
              <button className="button button-outline">Export Excel</button>
            </div>
          </div>
          <div className="chart-container">
            <h4>Request Status Distribution (Donut Chart)</h4>
            <div className="chart-placeholder">Donut Chart Placeholder</div>
            <div className="button-group" style={{ marginTop: 'var(--spacing-md)' }}>
              <button className="button button-outline">Export PDF</button>
              <button className="button button-outline">Export Excel</button>
            </div>
          </div>
          <div className="chart-container">
            <h4>Monthly Savings Trend (Line Chart)</h4>
            <div className="chart-placeholder">Line Chart Placeholder</div>
            <div className="button-group" style={{ marginTop: 'var(--spacing-md)' }}>
              <button className="button button-outline">Export PDF</button>
              <button className="button button-outline">Export Excel</button>
            </div>
          </div>
          <div className="chart-container">
            <h4>SLA Compliance Rate (Gauge Chart)</h4>
            <div className="chart-placeholder">Gauge Chart Placeholder</div>
            <div className="button-group" style={{ marginTop: 'var(--spacing-md)' }}>
              <button className="button button-outline">Export PDF</button>
              <button className="button button-outline">Export Excel</button>
            </div>
          </div>
        </div>

        <div className="recent-activities">
          <h4 className="mb-md">Recent Activities</h4>
          <ul>
            <li className="activity-item">
              <span className="icon">📄</span>
              <div className="details">
                <p>New request <a href="#" onClick={() => navigate('REQUEST_DETAIL', { id: 'req001' })}>#req001</a> created by Alice Smith.</p>
                <span className="time">5 minutes ago</span>
              </div>
            </li>
            <li className="activity-item">
              <span className="icon">✅</span>
              <div className="details">
                <p>Request <a href="#" onClick={() => navigate('REQUEST_DETAIL', { id: 'req002' })}>#req002</a> approved by Bob Johnson.</p>
                <span className="time">1 hour ago</span>
              </div>
            </li>
            <li className="activity-item">
              <span className="icon">✍️</span>
              <div className="details">
                <p>Supplier <a href="#" onClick={() => navigate('SUPPLIER_DETAIL', { id: 's003' })}>Innovate Logistics</a> updated profile.</p>
                <span className="time">2 hours ago</span>
              </div>
            </li>
            <li className="activity-item">
              <span className="icon">⚠️</span>
              <div className="details">
                <p>SLA for request <a href="#" onClick={() => navigate('REQUEST_DETAIL', { id: 'req001' })}>#req001</a> breached in Budget Approval stage.</p>
                <span className="time">3 hours ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Request List Screen
  const RequestListScreen = ({ role }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [sortKey, setSortKey] = useState('createdDate');
    const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

    const filteredRequests = dummyRequests?.filter(req => {
      const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.requester?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

    const sortedRequests = [...filteredRequests].sort((a, b) => {
      const valA = a?.[sortKey];
      const valB = b?.[sortKey];

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const handleSort = (key) => {
      if (sortKey === key) {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKey(key);
        setSortOrder('asc');
      }
    };

    return (
      <div>
        <h1 className="mb-md">Procurement Requests</h1>
        <div className="search-filter-bar">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_MAP).filter(([key, _]) => key.includes('REQUEST')).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <div className="button-group">
            <button className="button button-outline" onClick={() => handleSort('createdDate')}>Sort by Date {sortKey === 'createdDate' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</button>
            <button className="button button-outline" onClick={() => handleSort('amount')}>Sort by Amount {sortKey === 'amount' ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</button>
            {(role === ROLES.PROCUREMENT_OFFICER || role === ROLES.BUSINESS_USER) && (
              <button className="button button-primary" onClick={() => { /* Implement bulk actions */ }}>Bulk Actions</button>
            )}
            <button className="button button-outline">Export</button>
          </div>
        </div>

        {sortedRequests.length > 0 ? (
          <div className="card-grid">
            {sortedRequests?.map(request => (
              <div
                key={request.id}
                className="card"
                onClick={() => navigate('REQUEST_DETAIL', { id: request.id })}
              >
                <div>
                  <div className="card-title">{request.title}</div>
                  <div className="card-subtitle">ID: {request.id} | Requester: {request.requester?.name}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Category: {request.category}
                  </p>
                </div>
                <div className="card-meta">
                  <span>${request.amount?.toLocaleString()}</span>
                  <span className={`card-status ${STATUS_MAP[request.status]?.colorClass}`}>
                    {STATUS_MAP[request.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img src="https://via.placeholder.com/150/f0f0f0/6c757d?text=No+Requests" alt="No Requests" />
            <h3>No requests found.</h3>
            <p>It looks like there are no procurement requests matching your criteria.</p>
            {role === ROLES.BUSINESS_USER && (
              <button className="button button-primary">Create New Request</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Request Detail Screen
  const RequestDetailScreen = ({ requestId, role }) => {
    const request = dummyRequests?.find(r => r.id === requestId);

    if (!request) {
      return <div className="detail-page">Request not found.</div>;
    }

    const currentWorkflowStage = request.workflow?.find(stage => stage.status === 'in-progress' || stage.status === 'pending');

    const handleApprove = () => {
      // Implement approval logic: update request status, add audit log, move workflow stage
      const updatedRequests = dummyRequests.map(r =>
        r.id === requestId
          ? { ...r, status: 'APPROVED',
              workflow: r.workflow.map(stage =>
                (stage.status === 'in-progress' || stage.status === 'pending')
                  ? { ...stage, status: 'completed', date: new Date().toISOString().split('T')[0] }
                  : stage
              ),
              auditLogs: [...(r.auditLogs || []), { id: generateId(), timestamp: new Date().toISOString(), user: dummyUsers[0].name, action: 'approved', details: 'Request approved by Procurement Officer' }]
            }
          : r
      );
      // In a real app, you'd update state or call an API
      // setDummyRequests(updatedRequests);
      alert(`Request ${requestId} Approved! (This is a dummy action)`);
      navigate('REQUEST_LIST');
    };

    const handleReject = () => {
      // Implement rejection logic
      const updatedRequests = dummyRequests.map(r =>
        r.id === requestId
          ? { ...r, status: 'REJECTED',
              workflow: r.workflow.map(stage => (stage.status === 'in-progress' || stage.status === 'pending') ? { ...stage, status: 'cancelled' } : stage),
              auditLogs: [...(r.auditLogs || []), { id: generateId(), timestamp: new Date().toISOString(), user: dummyUsers[0].name, action: 'rejected', details: 'Request rejected by Procurement Officer' }]
            }
          : r
      );
      alert(`Request ${requestId} Rejected! (This is a dummy action)`);
      navigate('REQUEST_LIST');
    };

    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>Request: {request.title}</h2>
          <div className="button-group">
            {role === ROLES.PROCUREMENT_OFFICER && (
              <>
                <button className="button button-primary" onClick={handleApprove}>Approve</button>
                <button className="button button-danger" onClick={handleReject}>Reject</button>
              </>
            )}
            {(role === ROLES.PROCUREMENT_OFFICER || role === ROLES.BUSINESS_USER) && (
              <button className="button button-outline" onClick={() => navigate('REQUEST_EDIT', { id: request.id })}>
                Edit
              </button>
            )}
            <button className="button button-outline">Export PDF</button>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Overview</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Request ID</label>
              <p>{request.id}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`card-status ${STATUS_MAP[request.status]?.colorClass}`}>
                  {STATUS_MAP[request.status]?.label}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Requester</label>
              <p>{request.requester?.name}</p>
            </div>
            <div className="detail-item">
              <label>Category</label>
              <p>{request.category}</p>
            </div>
            <div className="detail-item">
              <label>Amount</label>
              <p>${request.amount?.toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Created Date</label>
              <p>{request.createdDate}</p>
            </div>
            <div className="detail-item">
              <label>Due Date</label>
              <p>{request.dueDate}</p>
            </div>
            <div className="detail-item">
              <label>Associated Supplier</label>
              <p><a href="#" onClick={() => navigate('SUPPLIER_DETAIL', { id: request.supplierId })}>{getSupplierName(request.supplierId)}</a></p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Description</h4>
          <p>{request.description}</p>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Workflow Tracker</h4>
          <div className="workflow-tracker">
            {request.workflow?.map((stage, index) => (
              (userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
                <div key={index} className={`workflow-stage ${stage.status} ${stage.slaBreached ? 'sla-breach' : ''}`}>
                  <div className="stage-circle">{index + 1}</div>
                  <div className="stage-details">
                    <div className="stage-name">{stage.stage}</div>
                    <div className="stage-date">{stage.date ? stage.date : 'N/A'} {stage.slaBreached && '(SLA Breached)'}</div>
                    <div className="stage-actor">{stage.actor}</div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {(userRole === ROLES.PROCUREMENT_OFFICER) && (
          <div className="detail-section">
            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Audit Log</h4>
            <div className="audit-logs">
              {request.auditLogs?.map(log => (
                <div key={log.id} className="audit-log-item">
                  <div className="user">{log.user}</div>
                  <div className="action">{log.action}</div>
                  <div className="details">{log.details}</div>
                  <div className="timestamp">{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Related Records</h4>
          <div className="card-grid">
            {dummyOrders?.filter(o => o.requestId === request.id)?.map(order => (
              <div
                key={order.id}
                className="card"
                onClick={() => navigate('ORDER_DETAIL', { id: order.id })}
              >
                <div>
                  <div className="card-title">Order: {order.title}</div>
                  <div className="card-subtitle">ID: {order.id} | Supplier: {getSupplierName(order.supplierId)}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Created: {order.createdDate}
                  </p>
                </div>
                <div className="card-meta">
                  <span>${order.amount?.toLocaleString()}</span>
                  <span className={`card-status ${STATUS_MAP[order.status]?.colorClass}`}>
                    {STATUS_MAP[order.status]?.label}
                  </span>
                </div>
              </div>
            ))}
            {dummyInvoices?.filter(inv => dummyOrders?.find(o => o.id === inv.orderId)?.requestId === request.id)?.map(invoice => (
              <div
                key={invoice.id}
                className="card"
                onClick={() => navigate('INVOICE_DETAIL', { id: invoice.id })}
              >
                <div>
                  <div className="card-title">Invoice: {invoice.id}</div>
                  <div className="card-subtitle">Order: {invoice.orderId} | Supplier: {getSupplierName(invoice.supplierId)}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Invoice Date: {invoice.invoiceDate}
                  </p>
                </div>
                <div className="card-meta">
                  <span>${invoice.amount?.toLocaleString()}</span>
                  <span className={`card-status ${STATUS_MAP[invoice.status]?.colorClass}`}>
                    {STATUS_MAP[invoice.status]?.label}
                  </span>
                </div>
              </div>
            ))}
            {(dummyOrders?.filter(o => o.requestId === request.id)?.length === 0 && dummyInvoices?.filter(inv => dummyOrders?.find(o => o.id === inv.orderId)?.requestId === request.id)?.length === 0) && (
              <p style={{ color: 'var(--color-text-secondary)' }}>No related orders or invoices found.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Request Edit Screen (Simplified for example)
  const RequestEditScreen = ({ requestId }) => {
    const request = dummyRequests?.find(r => r.id === requestId);
    const [formData, setFormData] = useState(request || {});
    const [errors, setErrors] = useState({});

    useEffect(() => {
      if (request) {
        setFormData(request);
      }
    }, [request]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData?.title) newErrors.title = 'Title is mandatory.';
      if (!formData?.category) newErrors.category = 'Category is mandatory.';
      if (!formData?.amount || formData.amount <= 0) newErrors.amount = 'Amount must be positive.';
      // More validations for other fields
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!validateForm()) {
        alert('Please fix the form errors.');
        return;
      }
      // In a real application, you would update the dummyRequests array
      // setDummyRequests(prevRequests => prevRequests.map(r => r.id === requestId ? formData : r));
      alert('Request updated! (Dummy save)');
      navigate('REQUEST_DETAIL', { id: requestId });
    };

    const handleCancel = () => {
      navigate('REQUEST_DETAIL', { id: requestId });
    };

    if (!request) {
      return <div className="detail-page">Request not found for editing.</div>;
    }

    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>Edit Request: {request.title}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData?.title || ''}
              onChange={handleChange}
              required
            />
            {errors?.title && <p className="form-error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Category <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData?.category || ''}
              onChange={handleChange}
              required
            />
            {errors?.category && <p className="form-error">{errors.category}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount <span style={{ color: 'var(--color-danger)' }}>*</span></label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData?.amount || ''}
              onChange={handleChange}
              required
            />
            {errors?.amount && <p className="form-error">{errors.amount}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData?.description || ''}
              onChange={handleChange}
            ></textarea>
          </div>
          {/* File Upload Placeholder */}
          <div className="form-group">
            <label htmlFor="file-upload">Attach Documents</label>
            <input type="file" id="file-upload" name="fileUpload" />
            <p style={{fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)'}}>Max file size 5MB. Supported formats: PDF, DOCX, XLSX.</p>
          </div>

          <div className="form-actions">
            <button type="button" className="button button-outline" onClick={handleCancel}>Cancel</button>
            <button type="submit" className="button button-primary">Save Changes</button>
          </div>
        </form>
      </div>
    );
  };


  // Supplier List Screen
  const SupplierListScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredSuppliers = dummySuppliers?.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || s.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

    return (
      <div>
        <h1 className="mb-md">Suppliers</h1>
        <div className="search-filter-bar">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_MAP).filter(([key, _]) => key.includes('ONBOARDED') || key.includes('REVIEW') || key.includes('PENDING') || key.includes('REJECTED')).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          {userRole === ROLES.PROCUREMENT_OFFICER && (
            <button className="button button-primary">New Supplier</button>
          )}
        </div>

        {filteredSuppliers.length > 0 ? (
          <div className="card-grid">
            {filteredSuppliers?.map(supplier => (
              <div
                key={supplier.id}
                className="card"
                onClick={() => navigate('SUPPLIER_DETAIL', { id: supplier.id })}
              >
                <div>
                  <div className="card-title">{supplier.name}</div>
                  <div className="card-subtitle">ID: {supplier.id} | Tier: {supplier.tier}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Contact: {supplier.contact}
                  </p>
                </div>
                <div className="card-meta">
                  <span>Onboarded: {supplier.onboardingDate}</span>
                  <span className={`card-status ${STATUS_MAP[supplier.status]?.colorClass}`}>
                    {STATUS_MAP[supplier.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img src="https://via.placeholder.com/150/f0f0f0/6c757d?text=No+Suppliers" alt="No Suppliers" />
            <h3>No suppliers found.</h3>
            <p>It looks like there are no suppliers matching your criteria.</p>
            {userRole === ROLES.PROCUREMENT_OFFICER && (
              <button className="button button-primary">Onboard New Supplier</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Supplier Detail Screen
  const SupplierDetailScreen = ({ supplierId }) => {
    const supplier = dummySuppliers?.find(s => s.id === supplierId);

    if (!supplier) {
      return <div className="detail-page">Supplier not found.</div>;
    }

    const relatedOrders = dummyOrders?.filter(order => order.supplierId === supplier.id) || [];

    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>Supplier: {supplier.name}</h2>
          <div className="button-group">
            {userRole === ROLES.PROCUREMENT_OFFICER && (
              <button className="button button-primary">Edit Supplier</button>
            )}
            <button className="button button-outline">View Contracts</button>
            <button className="button button-outline">Export Profile</button>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Overview</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Supplier ID</label>
              <p>{supplier.id}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`card-status ${STATUS_MAP[supplier.status]?.colorClass}`}>
                  {STATUS_MAP[supplier.status]?.label}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Contact Email</label>
              <p>{supplier.contact}</p>
            </div>
            <div className="detail-item">
              <label>Onboarding Date</label>
              <p>{supplier.onboardingDate}</p>
            </div>
            <div className="detail-item">
              <label>Tier</label>
              <p>{supplier.tier}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Related Orders</h4>
          <div className="card-grid">
            {relatedOrders.length > 0 ? (
              relatedOrders.map(order => (
                <div
                  key={order.id}
                  className="card"
                  onClick={() => navigate('ORDER_DETAIL', { id: order.id })}
                >
                  <div>
                    <div className="card-title">Order: {order.title}</div>
                    <div className="card-subtitle">ID: {order.id} | Request: {order.requestId}</div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Amount: ${order.amount?.toLocaleString()}
                    </p>
                  </div>
                  <div className="card-meta">
                    <span>Created: {order.createdDate}</span>
                    <span className={`card-status ${STATUS_MAP[order.status]?.colorClass}`}>
                      {STATUS_MAP[order.status]?.label}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-secondary)' }}>No orders associated with this supplier.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Order List Screen
  const OrderListScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredOrders = dummyOrders?.filter(order => {
      const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSupplierName(order.supplierId).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

    return (
      <div>
        <h1 className="mb-md">Purchase Orders</h1>
        <div className="search-filter-bar">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_MAP).filter(([key, _]) => key.includes('ORDER') || key.includes('APPROVED') || key.includes('PENDING')).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
            <button className="button button-primary">Create PO</button>
          )}
        </div>

        {filteredOrders.length > 0 ? (
          <div className="card-grid">
            {filteredOrders?.map(order => (
              <div
                key={order.id}
                className="card"
                onClick={() => navigate('ORDER_DETAIL', { id: order.id })}
              >
                <div>
                  <div className="card-title">{order.title}</div>
                  <div className="card-subtitle">ID: {order.id} | Supplier: {getSupplierName(order.supplierId)}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Req: {order.requestId} | Items: {order.items?.length}
                  </p>
                </div>
                <div className="card-meta">
                  <span>${order.amount?.toLocaleString()}</span>
                  <span className={`card-status ${STATUS_MAP[order.status]?.colorClass}`}>
                    {STATUS_MAP[order.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img src="https://via.placeholder.com/150/f0f0f0/6c757d?text=No+Orders" alt="No Orders" />
            <h3>No purchase orders found.</h3>
            <p>It looks like there are no orders matching your criteria.</p>
            {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
              <button className="button button-primary">Create New PO</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Order Detail Screen
  const OrderDetailScreen = ({ orderId }) => {
    const order = dummyOrders?.find(o => o.id === orderId);

    if (!order) {
      return <div className="detail-page">Order not found.</div>;
    }

    const relatedInvoices = dummyInvoices?.filter(inv => inv.orderId === order.id) || [];

    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>Purchase Order: {order.title}</h2>
          <div className="button-group">
            {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
              <button className="button button-primary">Generate Invoice</button>
            )}
            <button className="button button-outline">Export PDF</button>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Overview</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Order ID</label>
              <p>{order.id}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`card-status ${STATUS_MAP[order.status]?.colorClass}`}>
                  {STATUS_MAP[order.status]?.label}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Supplier</label>
              <p><a href="#" onClick={() => navigate('SUPPLIER_DETAIL', { id: order.supplierId })}>{getSupplierName(order.supplierId)}</a></p>
            </div>
            <div className="detail-item">
              <label>Associated Request</label>
              <p><a href="#" onClick={() => navigate('REQUEST_DETAIL', { id: order.requestId })}>{order.requestId}</a></p>
            </div>
            <div className="detail-item">
              <label>Amount</label>
              <p>${order.amount?.toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Created Date</label>
              <p>{order.createdDate}</p>
            </div>
            <div className="detail-item">
              <label>Expected Delivery</label>
              <p>{order.deliveryDate}</p>
            </div>
            <div className="detail-item">
              <label>Approver</label>
              <p>{order.approver?.name}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Items</h4>
          <ul>
            {order.items?.map((item, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-xxs)' }}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Related Invoices</h4>
          <div className="card-grid">
            {relatedInvoices.length > 0 ? (
              relatedInvoices.map(invoice => (
                <div
                  key={invoice.id}
                  className="card"
                  onClick={() => navigate('INVOICE_DETAIL', { id: invoice.id })}
                >
                  <div>
                    <div className="card-title">Invoice: {invoice.id}</div>
                    <div className="card-subtitle">Order: {invoice.orderId} | Supplier: {getSupplierName(invoice.supplierId)}</div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      Amount: ${invoice.amount?.toLocaleString()} | Due: {invoice.dueDate}
                    </p>
                  </div>
                  <div className="card-meta">
                    <span>Payment Status: {invoice.paymentStatus}</span>
                    <span className={`card-status ${STATUS_MAP[invoice.status]?.colorClass}`}>
                      {STATUS_MAP[invoice.status]?.label}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--color-text-secondary)' }}>No invoices associated with this order.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Invoice List Screen
  const InvoiceListScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const filteredInvoices = dummyInvoices?.filter(invoice => {
      const matchesSearch = invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getSupplierName(invoice.supplierId).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || invoice.status === filterStatus;
      return matchesSearch && matchesStatus;
    }) || [];

    return (
      <div>
        <h1 className="mb-md">Invoices</h1>
        <div className="search-filter-bar">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="icon">🔍</span>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: 'var(--spacing-sm)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)' }}>
            <option value="ALL">All Statuses</option>
            {Object.entries(STATUS_MAP).filter(([key, _]) => key.includes('APPROVED') || key.includes('PENDING')).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.SUPPLIER) && (
            <button className="button button-primary">Upload Invoice</button>
          )}
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="card-grid">
            {filteredInvoices?.map(invoice => (
              <div
                key={invoice.id}
                className="card"
                onClick={() => navigate('INVOICE_DETAIL', { id: invoice.id })}
              >
                <div>
                  <div className="card-title">Invoice: {invoice.id}</div>
                  <div className="card-subtitle">Order: {invoice.orderId} | Supplier: {getSupplierName(invoice.supplierId)}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    Amount: ${invoice.amount?.toLocaleString()} | Due: {invoice.dueDate}
                  </p>
                </div>
                <div className="card-meta">
                  <span>Payment Status: {invoice.paymentStatus}</span>
                  <span className={`card-status ${STATUS_MAP[invoice.status]?.colorClass}`}>
                    {STATUS_MAP[invoice.status]?.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <img src="https://via.placeholder.com/150/f0f0f0/6c757d?text=No+Invoices" alt="No Invoices" />
            <h3>No invoices found.</h3>
            <p>It looks like there are no invoices matching your criteria.</p>
            {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.SUPPLIER) && (
              <button className="button button-primary">Upload New Invoice</button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Invoice Detail Screen
  const InvoiceDetailScreen = ({ invoiceId }) => {
    const invoice = dummyInvoices?.find(i => i.id === invoiceId);

    if (!invoice) {
      return <div className="detail-page">Invoice not found.</div>;
    }

    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>Invoice: {invoice.id}</h2>
          <div className="button-group">
            {userRole === ROLES.PROCUREMENT_OFFICER && (
              <button className="button button-primary">Approve Payment</button>
            )}
            <button className="button button-outline">Download PDF</button>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Overview</h4>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Invoice ID</label>
              <p>{invoice.id}</p>
            </div>
            <div className="detail-item">
              <label>Status</label>
              <p>
                <span className={`card-status ${STATUS_MAP[invoice.status]?.colorClass}`}>
                  {STATUS_MAP[invoice.status]?.label}
                </span>
              </p>
            </div>
            <div className="detail-item">
              <label>Payment Status</label>
              <p>{invoice.paymentStatus}</p>
            </div>
            <div className="detail-item">
              <label>Supplier</label>
              <p><a href="#" onClick={() => navigate('SUPPLIER_DETAIL', { id: invoice.supplierId })}>{getSupplierName(invoice.supplierId)}</a></p>
            </div>
            <div className="detail-item">
              <label>Associated Order</label>
              <p><a href="#" onClick={() => navigate('ORDER_DETAIL', { id: invoice.orderId })}>{invoice.orderId}</a></p>
            </div>
            <div className="detail-item">
              <label>Amount</label>
              <p>${invoice.amount?.toLocaleString()}</p>
            </div>
            <div className="detail-item">
              <label>Invoice Date</label>
              <p>{invoice.invoiceDate}</p>
            </div>
            <div className="detail-item">
              <label>Due Date</label>
              <p>{invoice.dueDate}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Items Covered</h4>
          <ul>
            {invoice.items?.map((item, index) => (
              <li key={index} style={{ marginBottom: 'var(--spacing-xxs)' }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  // Profile Screen
  const ProfileScreen = () => {
    return (
      <div className="detail-page">
        <div className="detail-header">
          <h2>User Profile</h2>
          <button className="button button-primary">Edit Profile</button>
        </div>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Name</label>
            <p>Current User</p>
          </div>
          <div className="detail-item">
            <label>Role</label>
            <p>{userRole}</p>
          </div>
          <div className="detail-item">
            <label>Email</label>
            <p>user@example.com</p>
          </div>
        </div>
      </div>
    );
  };

  // Conditional rendering of main content based on view state
  const renderScreen = () => {
    if (!isLoggedIn) {
      return <LoginScreen />;
    }

    switch (view.screen) {
      case 'DASHBOARD':
        return <DashboardScreen />;
      case 'REQUEST_LIST':
        return <RequestListScreen role={userRole} />;
      case 'REQUEST_DETAIL':
        return <RequestDetailScreen requestId={view.params?.id} role={userRole} />;
      case 'REQUEST_EDIT':
        return <RequestEditScreen requestId={view.params?.id} />;
      case 'SUPPLIER_LIST':
        return <SupplierListScreen />;
      case 'SUPPLIER_DETAIL':
        return <SupplierDetailScreen supplierId={view.params?.id} />;
      case 'ORDER_LIST':
        return <OrderListScreen />;
      case 'ORDER_DETAIL':
        return <OrderDetailScreen orderId={view.params?.id} />;
      case 'INVOICE_LIST':
        return <InvoiceListScreen />;
      case 'INVOICE_DETAIL':
        return <InvoiceDetailScreen invoiceId={view.params?.id} />;
      case 'PROFILE':
        return <ProfileScreen />;
      default:
        return <p>404: Screen not found</p>;
    }
  };

  return (
    <div className="app-container">
      {isLoggedIn && (
        <header className="app-header">
          <h1 onClick={() => navigate('DASHBOARD')}>TSM</h1>
          <nav className="header-nav">
            <ul>
              {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
                <li key="dashboard">
                  <a href="#" onClick={() => navigate('DASHBOARD')} className={view.screen === 'DASHBOARD' ? 'active' : ''}>
                    Dashboard
                  </a>
                </li>
              )}
              {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER) && (
                <li key="requests">
                  <a href="#" onClick={() => navigate('REQUEST_LIST')} className={view.screen.startsWith('REQUEST') ? 'active' : ''}>
                    Requests
                  </a>
                </li>
              )}
              {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.SUPPLIER) && (
                <li key="suppliers">
                  <a href="#" onClick={() => navigate('SUPPLIER_LIST')} className={view.screen.startsWith('SUPPLIER') ? 'active' : ''}>
                    Suppliers
                  </a>
                </li>
              )}
              {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER || userRole === ROLES.SUPPLIER) && (
                <li key="orders">
                  <a href="#" onClick={() => navigate('ORDER_LIST')} className={view.screen.startsWith('ORDER') ? 'active' : ''}>
                    Orders
                  </a>
                </li>
              )}
              {(userRole === ROLES.PROCUREMENT_OFFICER || userRole === ROLES.BUSINESS_USER || userRole === ROLES.SUPPLIER) && (
                <li key="invoices">
                  <a href="#" onClick={() => navigate('INVOICE_LIST')} className={view.screen.startsWith('INVOICE') ? 'active' : ''}>
                    Invoices
                  </a>
                </li>
              )}
              <li key="profile">
                <a href="#" onClick={() => navigate('PROFILE')} className={view.screen === 'PROFILE' ? 'active' : ''}>
                  Profile
                </a>
              </li>
            </ul>
          </nav>
          <div className="header-actions">
            <button onClick={() => setGlobalSearchActive(true)} style={{ marginRight: 'var(--spacing-xs)' }}>Search</button>
            <button onClick={handleLogout}>Logout ({userRole})</button>
          </div>
        </header>
      )}

      {isLoggedIn && (
        <main className="main-content">
          <div className="breadcrumbs">
            {getBreadcrumbs()?.map((crumb, index, arr) => (
              (index < arr.length - 1) ? (
                <React.Fragment key={crumb.label}>
                  <a href="#" onClick={() => navigate(crumb.screen, crumb.params)}>{crumb.label}</a>
                  <span> / </span>
                </React.Fragment>
              ) : (
                <span key={crumb.label}>{crumb.label}</span>
              )
            ))}
          </div>
          {renderScreen()}
        </main>
      )}

      {/* Global Search Overlay */}
      {globalSearchActive && (
        <div className="global-search-overlay" onClick={() => setGlobalSearchActive(false)}>
          <div className="global-search-content" onClick={e => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Search everything..."
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              autoFocus
            />
            {globalSearchResults.length > 0 && (
              <div className="global-search-results">
                <ul>
                  {globalSearchResults?.map(result => (
                    <li key={`${result.type}-${result.id}`} onClick={() => navigate(result.screen, { id: result.id })}>
                      <strong>{result.type}:</strong> {result.title} (ID: {result.id})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {globalSearchTerm.length > 2 && globalSearchResults.length === 0 && (
              <p className="text-center" style={{ color: 'var(--color-text-secondary)' }}>No results found for "{globalSearchTerm}".</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;