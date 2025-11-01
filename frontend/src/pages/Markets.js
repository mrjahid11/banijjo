import React from 'react';

export default function Markets() {
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="mb-0">Markets</h3>
          <div className="text-muted small">Explore markets, assets and tools to discover opportunities.</div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-4">
          <a href="/market" className="card text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title">Buy & Trade</h5>
              <p className="card-text text-muted">Place trades, view market depth and buy stocks.</p>
            </div>
          </a>
        </div>
        <div className="col-md-4">
          <a href="/markets/world" className="card text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title">World Markets</h5>
              <p className="card-text text-muted">Global market indices and cross-country comparisons.</p>
            </div>
          </a>
        </div>
        <div className="col-md-4">
          <a href="/markets/countries" className="card text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title">Country Markets</h5>
              <p className="card-text text-muted">Markets by country and local exchanges.</p>
            </div>
          </a>
        </div>

        <div className="col-md-4">
          <a href="/products" className="card text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title">Products & Tools</h5>
              <p className="card-text text-muted">Charts, screeners and portfolio tools.</p>
            </div>
          </a>
        </div>
        <div className="col-md-4">
          <a href="/education" className="card text-decoration-none h-100">
            <div className="card-body">
              <h5 className="card-title">Learn & Explore</h5>
              <p className="card-text text-muted">Educational content and courses about markets.</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
