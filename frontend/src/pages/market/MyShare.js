import React, { useEffect, useMemo, useState } from 'react';
import { myHoldings, listHoldingForSale, publicListings, buyFromListing } from '../../api/market';

const Badge = ({ children, type = 'secondary' }) => (
  <span className={`badge text-bg-${type}`} style={{ fontSize: '0.8rem' }}>{children}</span>
);

const NumberFmt = ({ value }) => <span>{new Intl.NumberFormat().format(value)}</span>;

export default function MyShare() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [holdings, setHoldings] = useState([]); // my holdings (OWNED and FOR_SALE)
  const [sold, setSold] = useState([]); // my sold history
  const [listings, setListings] = useState([]); // others' for sale

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await myHoldings();
      setHoldings(me.holdings || []);
      setSold(me.sold || []);
      const ls = await publicListings();
      setListings(ls || []);
    } catch (e) {
      setError(e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); }, []);

  const owned = useMemo(() => holdings.filter(h => h.status === 'OWNED'), [holdings]);
  const forSale = useMemo(() => holdings.filter(h => h.status === 'FOR_SALE'), [holdings]);

  const [sellPrice, setSellPrice] = useState({});
  const onListForSale = async (h) => {
    const price = parseFloat(sellPrice[h.id] ?? h.askPricePerShare ?? 0);
    if (!price || price <= 0) return alert('Enter a valid price');
    await listHoldingForSale(h.id, price);
    await reload();
  };

  const [buyQty, setBuyQty] = useState({});
  const onBuyListing = async (l) => {
    const qty = parseInt(buyQty[l.id] ?? 0);
    if (!qty || qty <= 0 || qty > l.quantity) return alert('Invalid quantity');
    await buyFromListing(l.id, qty);
    await reload();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-3">My Share</h2>
      {error && <div className="alert alert-danger">{String(error)}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}

      {/* Owned holdings */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Owned</strong>
          <Badge type="primary">{owned.length}</Badge>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {owned.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted">No holdings yet</td></tr>
              ) : owned.map(h => (
                <tr key={h.id}>
                  <td>{h.company?.name}</td>
                  <td><code>{h.company?.symbol}</code></td>
                  <td><NumberFmt value={h.quantity} /></td>
                  <td style={{ minWidth: 260 }}>
                    <div className="input-group">
                      <span className="input-group-text">Price</span>
                      <input type="number" className="form-control" step="0.01" min="0"
                        value={sellPrice[h.id] ?? ''}
                        placeholder={h.askPricePerShare ?? '0.00'}
                        onChange={e => setSellPrice({ ...sellPrice, [h.id]: e.target.value })}
                      />
                      <button className="btn btn-outline-primary" onClick={() => onListForSale(h)}>
                        Sell (list)
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My listings (for sale) */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>My Listings</strong>
          <Badge type="warning">{forSale.length}</Badge>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Ask Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {forSale.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted">No active listings</td></tr>
              ) : forSale.map(h => (
                <tr key={h.id}>
                  <td>{h.company?.name}</td>
                  <td><code>{h.company?.symbol}</code></td>
                  <td><NumberFmt value={h.quantity} /></td>
                  <td>${h.askPricePerShare?.toFixed?.(2) ?? '-'}</td>
                  <td><Badge type="warning">FOR SALE</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market (others' listings) */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Market</strong>
          <Badge type="success">{listings.length}</Badge>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Ask Price</th>
                <th>Buy</th>
              </tr>
            </thead>
            <tbody>
              {listings.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted">No listings available</td></tr>
              ) : listings.map(l => (
                <tr key={l.id}>
                  <td>{l.company?.name}</td>
                  <td><code>{l.company?.symbol}</code></td>
                  <td><NumberFmt value={l.quantity} /></td>
                  <td>${l.askPricePerShare?.toFixed?.(2) ?? '-'}</td>
                  <td style={{ minWidth: 220 }}>
                    <div className="input-group">
                      <span className="input-group-text">Qty</span>
                      <input type="number" className="form-control" min="1" max={l.quantity}
                        value={buyQty[l.id] ?? ''}
                        onChange={e => setBuyQty({ ...buyQty, [l.id]: e.target.value })}
                      />
                      <button className="btn btn-outline-success" onClick={() => onBuyListing(l)}>
                        Buy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sold History */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Sold History</strong>
          <Badge type="secondary">{sold.length}</Badge>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Company</th>
                <th>Symbol</th>
                <th>Quantity</th>
                <th>Price/Share</th>
                <th>Sold At</th>
              </tr>
            </thead>
            <tbody>
              {sold.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-muted">No sales yet</td></tr>
              ) : sold.map(s => (
                <tr key={s.id}>
                  <td>{s.company?.name}</td>
                  <td><code>{s.company?.symbol}</code></td>
                  <td><NumberFmt value={s.quantity} /></td>
                  <td>${s.pricePerShare?.toFixed?.(2) ?? '-'}</td>
                  <td>{new Date(s.soldAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
