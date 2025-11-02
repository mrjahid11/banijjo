import React, { useContext, useEffect, useState } from "react";
import { getToken } from "../api/client";
import { logout as doLogout, getProfile } from "../api/auth";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const token = getToken();
  const role = typeof window !== 'undefined' ? localStorage.getItem('user_role') : null;
  const handleLogout = async () => {
    try {
      await doLogout();
    } catch (e) {
      // ignore
    }
    window.location.href = "/";
  };
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [displayName, setDisplayName] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadName() {
      try {
        if (!token) return;
        const uid = Number(localStorage.getItem("userId"));
        if (!uid) return;
        const data = await getProfile(uid);
        if (!mounted) return;
        setDisplayName(data?.username || data?.name || `User${uid}`);
      } catch (e) {
        // ignore silently
      }
    }
    loadName();
    return () => { mounted = false; };
  }, [token]);

  return (
    <>
  <style>{`
        .navbar-brand {
          font-weight: 800;
          color: #ffffff !important;
          margin-right: 1rem;
        }

        /* Centered nav with compact links */
        .nav-link {
          color: rgba(255,255,255,0.9) !important;
          padding: 0.45rem 0.7rem;
          font-weight: 500;
          font-size: 0.95rem;
        }
        .nav-link:hover { color: #9dd1ff !important; }

        /* Large dark dropdown panel like the mock */
        .dropdown-menu {
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.03);
          box-shadow: 0 6px 20px rgba(0,0,0,0.5);
          border-radius: 8px;
          padding: 0.5rem 0;
        }
        .dropdown-item { color: #e6eef8; padding: 0.6rem 1.2rem; }
        .dropdown-item:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .dropdown-label { color: #9fb3c7; padding: 0.5rem 1.2rem; }

        /* Search in center: darker rounded input */
        .search-form { max-width: 640px; width: 48%; }
        .search-form .form-control {
          border-radius: 999px;
          padding: 0.4rem 1rem;
          border: none;
          background: rgba(255,255,255,0.03);
          color: #e6eef8;
          box-shadow: none;
        }
        /* keep search input stable on focus (no bright blue halo) */
        .search-form .form-control:focus {
          outline: none;
          background: rgba(255,255,255,0.03);
          box-shadow: none;
          border-color: transparent;
        }
        .search-form .form-control::placeholder { color: rgba(255,255,255,0.45); }
        /* prevent browser autofill from tinting the search box */
        .search-form input.form-control:-webkit-autofill,
        .search-form textarea.form-control:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.03) inset !important;
                  box-shadow: 0 0 0px 1000px rgba(255,255,255,0.03) inset !important;
          -webkit-text-fill-color: #e6eef8 !important;
        }
        .search-form .btn {
          margin-left: 0.5rem;
          border-radius: 999px;
          padding: 0.35rem 0.9rem;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        /* center nav region */
        .navbar-nav.middle-nav { flex: 1 1 auto; justify-content: flex-start; gap: 0.25rem; }
        .navbar-nav.middle-nav > .nav-item:first-child { margin-left: 0.5rem; }

        /* Username button minimal */
        .account-btn { background: transparent; border: none; padding: 0.2rem 0.6rem; color: #fff; }
        .account-btn:hover { background: rgba(255,255,255,0.03); color: #fff; }
        .account-btn.dropdown-toggle { box-shadow: none; }

        /* Dropdown alignment and viewport safety */
        .navbar .dropdown-menu.dropdown-menu-end { right: 0; left: auto; min-width: 12rem; max-width: 92vw; }
        @media (max-width: 767.98px) {
          .search-form { width: 100%; margin: 0.5rem 0; }
          .navbar-nav.middle-nav { justify-content: center; }
          .navbar .dropdown-menu { position: static !important; width: 100%; }
        }
        /* dark-mode: ensure search input matches dark panel color and no blue halo */
        [data-bs-theme="dark"] .search-form .form-control {
          background: rgba(255,255,255,0.02);
          color: #e6eef8;
        }
        [data-bs-theme="dark"] .search-form .form-control:focus {
          background: rgba(255,255,255,0.02);
          box-shadow: none;
          border-color: transparent;
        }
        [data-bs-theme="dark"] .search-form input.form-control:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.02) inset !important;
                  box-shadow: 0 0 0px 1000px rgba(255,255,255,0.02) inset !important;
          -webkit-text-fill-color: #e6eef8 !important;
        }
        /* Submenu (open to the right) with subtle animation */
        .dropdown-submenu { position: relative; }
        .dropdown-submenu > .dropdown-toggle { position: relative; padding-right: 2rem; }
        /* hide browser/bootstrap pseudo-caret for nested toggles so we can use an explicit element */
        .dropdown-submenu > .dropdown-toggle::after { content: none !important; }

        /* explicit submenu caret element to avoid overlap and allow easy rotation */
        .submenu-caret {
          position: absolute;
          right: 0.6rem;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.9;
          font-size: 0.9rem;
          transition: transform 150ms ease, opacity 150ms ease;
          pointer-events: none;
        }
        .dropdown-submenu > .dropdown-toggle[aria-expanded="true"] .submenu-caret {
          transform: translateY(-50%) rotate(90deg);
        }

        .dropdown-submenu > .dropdown-menu {
          position: absolute;
          top: 0;
          left: 100%;
          margin-left: 0.35rem;
          z-index: 1050; /* above parent dropdown */
          min-width: 12rem;
          display: block; /* keep in flow for transition but hidden by opacity/transform */
          opacity: 0;
          transform: translateX(-8px);
          transform-origin: left center;
          transition: opacity 160ms ease, transform 160ms ease;
          pointer-events: none;
        }
        .dropdown-submenu > .dropdown-menu.show {
          opacity: 1;
          transform: translateX(0);
          pointer-events: auto;
        }

        /* Ensure top-level caret still points down */
        .nav-item.dropdown > .nav-link.dropdown-toggle::after { transform: none; }

        @media (max-width: 767.98px) {
          /* On mobile make submenus full-width stacked beneath parent; disable side animation */
          .dropdown-submenu > .dropdown-menu { position: static !important; left: auto; margin-left: 0; opacity: 1; transform: none; pointer-events: auto; width: 100%; }
          .dropdown-submenu > .dropdown-toggle .submenu-caret { position: static; transform: none; margin-left: 0.5rem; right: auto; display: inline-block; }
        }
  `}</style>

  <nav className={`navbar navbar-expand-lg ${isDark ? 'navbar-dark' : 'navbar-light'}`}>
        <div className="container-fluid">
          <a className={`navbar-brand ${isDark ? 'text-white' : 'text-dark'}`} href="/">
            Banijjo
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav middle-nav">
              {/* Search */}
              <form className="d-flex search-form me-3" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search markets, assets..."
                  aria-label="Search"
                />
                <button className="btn" type="submit">
                  Search
                </button>
              </form>

              {/* Products */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/products"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Products
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/products/supercharts">
                      Supercharts
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/portfolios">
                      Portfolios
                    </a>
                  </li>
                  <li>
                    <span className="dropdown-label">Individual Tools</span>
                  </li>

                  {/* Screeners with sub-options */}
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="/products/screeners"
                      aria-expanded="false"
                    >
                      Screeners
                      <span className="submenu-caret" aria-hidden="true">▸</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/screeners/stocks"
                        >
                          Stocks
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/screeners/etfs"
                        >
                          ETFs
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/screeners/bonds"
                        >
                          Bonds
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/screeners/crypto"
                        >
                          Crypto
                        </a>
                      </li>
                    </ul>
                  </li>

                  {/* Calendars with sub-options */}
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="/products/calenders"
                      aria-expanded="false"
                    >
                      Calendars
                      <span className="submenu-caret" aria-hidden="true">▸</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/calenders/earnings"
                        >
                          Earnings
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/calenders/ipo"
                        >
                          IPO
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/products/calenders/dividends"
                        >
                          Dividends
                        </a>
                      </li>
                    </ul>
                  </li>

                  {/* Remaining options */}
                  <li>
                    <a
                      className="dropdown-item"
                      href="/products/fundementalgraphs"
                    >
                      Fundamental Graphs
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/yieldcurves">
                      Yield Curves
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/products/options">
                      Options
                    </a>
                  </li>
                </ul>
              </li>

              {/* Dashboard */}
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">Dashboard</a>
              </li>

              {/* Community */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/community"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Community
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/community/newsfeed">
                      Newsfeed
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/community/create">
                      Create a Community
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/community/mine">
                      My Communities
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/community/newsfeed">
                      Visit Newsfeed
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/community/post/create">
                      Create Post
                    </a>
                  </li>
                </ul>
              </li>

              {/* Markets */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  Markets
                </a>
                <ul className="dropdown-menu">
                  {(role === 'broker' || role === 'admin') && (
                    <li>
                      <a className="dropdown-item" href="/brokers">Brokers</a>
                    </li>
                  )}
                  <li>
                    <a className="dropdown-item" href="/market">
                      Buy Stock
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/admin/market">
                      Admin Monitor
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/world">
                      World
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/countries">
                      Countries
                    </a>
                  </li>

                  {/* Assets label */}
                  <li>
                    <span className="dropdown-label">Assets</span>
                  </li>

                  {/* Assets options */}
                  <li>
                    <a className="dropdown-item" href="/markets/assets/indices">
                      Indices
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/assets/stocks">
                      Stocks
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/assets/crypto">
                      Crypto
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/assets/futures">
                      Futures
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/assets/forex">
                      Forex
                    </a>
                  </li>

                  {/* Bonds with sub-sub-options */}
                  <li className="dropdown-submenu">
                    <a
                      className="dropdown-item dropdown-toggle"
                      href="/markets/assets/bonds"
                      aria-expanded="false"
                    >
                      Bonds
                      <span className="submenu-caret" aria-hidden="true">▸</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="/markets/assets/bonds/government"
                        >
                          Government Bonds
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="/markets/assets/bonds/corporate"
                        >
                          Corporate Bonds
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <a className="dropdown-item" href="/markets/assets/etfs">
                      ETFs
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/markets/assets/economy">
                      Economy
                    </a>
                  </li>
                </ul>
              </li>

              {/* Brokers (no submenu) */}
              <li className="nav-item">
                <a
                  className="nav-link"
                  href="/brokers"
                >
                  Brokers
                </a>
              </li>

              {/* More */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={(e) => e.preventDefault()}
                >
                  More
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/blog">
                      <i className="fa fa-newspaper me-2 text-primary"></i>
                      Blog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/market/my-share">
                      <i className="fa fa-layer-group me-2 text-primary"></i>
                      My Share
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/blog/create">
                      <i className="fa fa-pen-to-square me-2 text-success"></i>
                      Write a Blog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/education/hub">
                      <i className="fa fa-school me-2 text-primary"></i>
                      Education Hub
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/education/your-courses">
                      <i className="fa fa-book me-2 text-success"></i>
                      Your Courses
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/education">
                      <i className="fa fa-graduation-cap me-2 text-info"></i>
                      Learn
                    </a>
                  </li>
                  {role === 'admin' && (
                    <li>
                      <a className="dropdown-item" href="/admin/education/courses">
                        <i className="fa fa-chalkboard-teacher me-2 text-warning"></i>
                        Course
                      </a>
                    </li>
                  )}
                  {role === 'admin' ? (
                    <li>
                      <a className="dropdown-item" href="/admin/help">
                        <i className="fa fa-life-ring me-2 text-warning"></i>
                        Help Requests
                      </a>
                    </li>
                  ) : (
                    <li>
                      <a className="dropdown-item" href="/more/help">
                        <i className="fa fa-circle-question me-2 text-info"></i>
                        Help Center
                      </a>
                    </li>
                  )}
                  <li>
                    <a className="dropdown-item" href="/more/aboutus">
                      About Us
                    </a>
                  </li>
                </ul>
              </li>
            </ul>

            {/* Right side auth controls */}
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-2">
                <button
                  type="button"
                  className="nav-link account-btn theme-toggle"
                  onClick={toggleTheme}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {/* use solid icons for clearer glyphs */}
                  <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
                </button>
              </li>
            {token ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link account-btn dropdown-toggle"
                    id="accountDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    type="button"
                  >
                    {displayName || 'Account'}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="accountDropdown">
                        <li>
                          <a className="dropdown-item" href="/profile">Profile</a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="/brokers/hire">Hire broker</a>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>Sign out</button>
                        </li>
                  </ul>
                </li>
              </>
            ) : (
                <>
                  <li className="nav-item me-2">
                    <a className="nav-link account-btn" href="/signin">Sign in</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link account-btn" href="/signup">Get Started</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
