import React, { useMemo, useState, useEffect } from "react";
import { listBrokers } from '../../api/brokers';

const sampleBrokers = [
  {
    id: 1,
    name: 'AlphaTrade',
    tagline: 'Fast execution · Low spreads',
    instruments: ['Stocks', 'Options', 'Futures'],
    rating: 4.6,
    fees: '0.1% per trade',
    website: 'https://alphatrade.example',
    email: 'support@alphatrade.example',
    description: 'AlphaTrade is a low-latency broker focused on active traders and institutional order flow.'
  },
  {
    id: 2,
    name: 'Zenith Brokers',
    tagline: 'Research-driven investing',
    instruments: ['Stocks', 'ETFs', 'Bonds'],
    rating: 4.2,
    fees: 'Flat $4.99 per trade',
    website: 'https://zenith.example',
    email: 'help@zenith.example',
    description: 'Zenith provides premium research and portfolio tools for buy-and-hold investors.'
  },
  {
    id: 3,
    name: 'Delta Securities',
    tagline: 'Access global markets',
    instruments: ['Stocks', 'Forex', 'Crypto'],
    rating: 4.0,
    fees: 'Commission-free equities, spreads apply for FX',
    website: 'https://delta.example',
    email: 'contact@delta.example',
    description: 'Delta Securities offers multi-asset access with competitive pricing and advanced order types.'
  },
  {
    id: 4,
    name: 'Orion Markets',
    tagline: 'Options & derivatives specialist',
    instruments: ['Options', 'Futures'],
    rating: 4.4,
    fees: '$0.50 per options contract',
    website: 'https://orion.example',
    email: 'trade@orion.example',
    description: 'Orion focuses on derivatives traders and provides powerful options analytics.'
  }
];

const Brokers = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const [brokers, setBrokers] = useState([]);
  useEffect(() => { (async () => {
    try {
      const data = await listBrokers();
      setBrokers(data);
    } catch (e) { setBrokers(sampleBrokers); }
  })(); }, []);

  const instruments = useMemo(() => {
    const s = new Set();
    (brokers.length ? brokers : sampleBrokers).forEach(b => b.instruments.forEach(i => s.add(i)));
    return ['All', ...Array.from(s).sort()];
  }, [brokers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = brokers.length ? brokers : sampleBrokers;
    return arr.filter(b => {
      if (filter !== 'all' && !b.instruments.includes(filter)) return false;
      if (!q) return true;
      return b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || (b.tagline||'').toLowerCase().includes(q);
    });
  }, [query, filter, brokers]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-0">Brokers</h3>
          <div className="text-muted small">Find brokers by instruments, fees and services.</div>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <input className="form-control" style={{minWidth:240}} placeholder="Search brokers by name or description" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="form-select" style={{width:160}} value={filter} onChange={e=>setFilter(e.target.value)}>
            {instruments.map(i => <option key={i} value={i==='All'?'all':i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {filtered.map(b => (
          <div key={b.id} className="col-md-6">
            <div className="card h-100">
              <div className="card-body d-flex gap-3">
                <div style={{width:88, height:88, background:'#0d6efd', color:'#fff', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:20}}>
                  {b.name.split(' ').map(s=>s[0]).join('').slice(0,2)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{b.name}</h5>
                      <div className="small text-muted">{b.tagline}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">{b.rating} ★</div>
                      <div className="small text-muted">{b.fees}</div>
                    </div>
                  </div>
                  <p className="small text-muted mt-2 mb-2">{b.description}</p>
                  <div className="d-flex gap-2">
                    <a className="btn btn-sm btn-outline-primary" href={b.website} target="_blank" rel="noreferrer">Visit site</a>
                    <a className="btn btn-sm btn-outline-secondary" href={`mailto:${b.email}`}>Contact</a>
                    <div className="badge bg-light text-dark align-self-center">{b.instruments.join(' · ')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">No brokers match your search. Try clearing filters.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brokers;
