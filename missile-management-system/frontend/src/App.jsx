import React, { useState, useEffect } from 'react';
import * as api from './api';
import './App.css';
import { 
  Rocket, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Plus,
  Crosshair
} from 'lucide-react';

function App() {
  const [missiles, setMissiles] = useState([]);
  const [formData, setFormData] = useState({
    missile_name: '',
    missile_type: '',
    manufacturer: '',
    manufacture_date: '',
    status: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissiles();
  }, []);

  const fetchMissiles = async () => {
    try {
      setLoading(true);
      const response = await api.getMissiles();
      setMissiles(response.data);
    } catch (error) {
      console.error('Error fetching missiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateMissile(editingId, formData);
      } else {
        await api.createMissile(formData);
      }
      setFormData({
        missile_name: '',
        missile_type: '',
        manufacturer: '',
        manufacture_date: '',
        status: ''
      });
      setEditingId(null);
      fetchMissiles();
    } catch (error) {
      console.error('Error saving missile:', error);
    }
  };

  const handleEdit = (missile) => {
    setFormData({
      missile_name: missile.missile_name,
      missile_type: missile.missile_type,
      manufacturer: missile.manufacturer,
      manufacture_date: missile.manufacture_date,
      status: missile.status
    });
    setEditingId(missile.missile_id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('WARNING: Confirm deletion of classified asset?')) {
      try {
        await api.deleteMissile(id);
        fetchMissiles();
      } catch (error) {
        console.error('Error deleting missile:', error);
      }
    }
  };

  const getStatusClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active': return 'status-active';
      case 'maintenance': return 'status-maintenance';
      default: return 'status-decommissioned';
    }
  };

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="header">
        <div className="brand">
          <Rocket size={32} />
          <h1>MMS // COMMAND CENTER</h1>
        </div>
        <div className="system-status">
          <div className="status-indicator">
            <Shield size={18} color="#00f3ff" />
            <span>SYSTEM: SECURE</span>
          </div>
          <div className="status-indicator">
            <Activity size={18} color="#00f3ff" />
            <span>NET: ONLINE</span>
          </div>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span>DEFCON: 4</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Control Panel (Form) */}
        <div className="panel control-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Crosshair size={24} />
              <h3>{editingId ? 'UPDATE PARAMETERS' : 'NEW ASSET ENTRY'}</h3>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="control-form">
            <div className="input-group">
              <label>Codename</label>
              <input 
                type="text" 
                name="missile_name" 
                className="control-input"
                placeholder="Ex: TRIDENT-II" 
                value={formData.missile_name} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Class / Type</label>
              <input 
                type="text" 
                name="missile_type" 
                className="control-input"
                placeholder="Ex: BALLISTIC" 
                value={formData.missile_type} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Manufacturer</label>
              <input 
                type="text" 
                name="manufacturer" 
                className="control-input"
                placeholder="Ex: LOCKHEED MARTIN" 
                value={formData.manufacturer} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Deployment Date</label>
              <input 
                type="date" 
                name="manufacture_date" 
                className="control-input"
                value={formData.manufacture_date} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="input-group">
              <label>Operational Status</label>
              <select 
                name="status" 
                className="control-input"
                value={formData.status} 
                onChange={handleChange} 
                required
              >
                <option value="">SELECT STATUS</option>
                <option value="Active">ACTIVE</option>
                <option value="Maintenance">MAINTENANCE</option>
                <option value="Decommissioned">DECOMMISSIONED</option>
              </select>
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingId ? <Save size={18} /> : <Plus size={18} />}
                {editingId ? 'UPDATE ASSET' : 'DEPLOY ASSET'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => { 
                    setEditingId(null); 
                    setFormData({ missile_name: '', missile_type: '', manufacturer: '', manufacture_date: '', status: '' }); 
                  }}
                >
                  <X size={18} /> CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Inventory Panel (Table) */}
        <div className="panel inventory-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Activity size={24} />
              <h3>FLEET INVENTORY</h3>
            </div>
            <div className="status-indicator">
              <span>TOTAL UNITS: {missiles.length}</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CODENAME</th>
                  <th>TYPE</th>
                  <th>ORIGIN</th>
                  <th>DATE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {missiles.map(missile => (
                  <tr key={missile.missile_id}>
                    <td style={{ color: 'var(--text-secondary)' }}>#{missile.missile_id}</td>
                    <td style={{ color: 'var(--text-accent)', fontWeight: 'bold' }}>{missile.missile_name}</td>
                    <td>{missile.missile_type}</td>
                    <td>{missile.manufacturer}</td>
                    <td>{missile.manufacture_date}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(missile.status)}`}>
                        {missile.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(missile)}
                          title="Edit Parameters"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-icon danger" 
                          onClick={() => handleDelete(missile.missile_id)}
                          title="Decommission Asset"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {missiles.length === 0 && !loading && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                      <AlertTriangle size={48} style={{ marginBottom: '10px', opacity: 0.5 }} />
                      <div>NO ASSETS DETECTED IN DATABASE</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
