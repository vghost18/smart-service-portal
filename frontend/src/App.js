import React, { useState, useEffect } from 'react';

const API_GATEWAY = 'http://localhost:3000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ category: '', status: '', priority: '' });
  const [formData, setFormData] = useState({ title: '', category: '', description: '', priority: '', requester: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_GATEWAY}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: e.target.username.value, password: e.target.password.value })
      });
      const data = await res.json();
      if (data.token) {
        setToken(data.token);
        setRole(data.role);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
      } else {
        alert('Invalid credentials.');
      }
    } catch (err) {
      alert('Ensure API Gateway and Services are running.');
    }
  };

  const handleLogout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const fetchRequests = async () => {
    const query = new URLSearchParams(filter).toString();
    const res = await fetch(`${API_GATEWAY}/requests?${query}`, {
      headers: { 'Authorization': token }
    });
    if (res.ok) {
      setRequests(await res.json());
    } else if (res.status === 403 || res.status === 401) {
      handleLogout();
    }
  };

  useEffect(() => {
    if (token) fetchRequests();
    // eslint-disable-next-line
  }, [token, filter]);

  const createRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch(`${API_GATEWAY}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify(formData)
    });
    setFormData({ title: '', category: '', description: '', priority: '', requester: '' });
    setIsSubmitting(false);
    fetchRequests();
  };

  const updateStatus = async (id, newStatus) => {
    await fetch(`${API_GATEWAY}/requests/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ status: newStatus })
    });
    fetchRequests();
  };

  // NEW FUNCTION: Update Priority
  const updatePriority = async (id, newPriority) => {
    await fetch(`${API_GATEWAY}/requests/${id}/priority`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ priority: newPriority })
    });
    fetchRequests();
  };

  const getBadgeStyle = (value) => {
    const styles = {
      'Open': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-amber-100 text-amber-700 border-amber-200',
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'High': 'bg-rose-100 text-rose-700 border-rose-200',
      'Medium': 'bg-orange-100 text-orange-700 border-orange-200',
      'Low': 'bg-slate-100 text-slate-700 border-slate-200',
    };
    return styles[value] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Smart Service Portal</h2>
            <p className="text-gray-500 mt-2 text-sm">admin/admin (Support) OR user/user (Student)</p>
          </div>
          <form onSubmit={login} className="space-y-5">
            <input name="username" placeholder="Username" required className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <input name="password" type="password" placeholder="Password" required className="w-full px-5 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <header className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Smart Service Portal</h1>
            <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider mt-1">Role: {role}</p>
          </div>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors">Log out</button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
              <h3 className="text-lg font-bold mb-6">New Request</h3>
              <form onSubmit={createRequest} className="space-y-4">
                <input placeholder="Request Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" />
                <input placeholder="Requester Name/Email" value={formData.requester} onChange={e => setFormData({...formData, requester: e.target.value})} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all" />
                <textarea placeholder="Describe issue, Will detect priority/category if left blank." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required rows="3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all"></textarea>
                
                <div className="grid grid-cols-2 gap-4">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all">
                    <option value=""> Auto-Assign</option>
                    <option value="IT">IT</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all">
                    <option value=""> Auto-Detect</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md">Submit Request</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-bold">Request Queue</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select onChange={e => setFilter({...filter, category: e.target.value})} className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All Categories</option>
                    <option value="IT">IT</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <select onChange={e => setFilter({...filter, priority: e.target.value})} className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <select onChange={e => setFilter({...filter, status: e.target.value})} className="w-full sm:w-auto px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Request info</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Priority</th>
                      {role === 'admin' && <th className="px-6 py-4">Action (Status)</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.length === 0 ? (
                      <tr><td colSpan={role === 'admin' ? 4 : 3} className="px-6 py-8 text-center text-slate-400">No requests found.</td></tr>
                    ) : requests.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-slate-800 text-base">{r.title}</p>
                          <div className="text-xs text-slate-500 mt-1">{r.category} • {r.requester}</div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(r.status)}`}>{r.status}</span>
                        </td>
                        <td className="px-6 py-5">
                          {/* NEW PRIORITY DROPDOWN FOR ADMINS */}
                          {role === 'admin' ? (
                            <select 
                              value={r.priority} 
                              onChange={(e) => updatePriority(r.id, e.target.value)} 
                              className={`px-3 py-1 rounded-full text-xs font-bold border outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm appearance-none text-center ${getBadgeStyle(r.priority)}`}
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          ) : (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeStyle(r.priority)}`}>{r.priority}</span>
                          )}
                        </td>
                        {role === 'admin' && (
                          <td className="px-6 py-5">
                            <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 text-slate-700 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-sm">
                              <option value="Open">Move to Open</option>
                              <option value="In Progress">Move to Progress</option>
                              <option value="Resolved">Mark Resolved</option>
                            </select>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}