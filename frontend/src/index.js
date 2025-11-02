import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './context/ThemeContext';
// Bootstrap JS (includes Popper) required for dropdowns, tooltips, collapse, etc.
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Small global helper: enable click-to-toggle behaviour for nested dropdown-submenu items
// (Bootstrap 5 doesn't provide nested submenu handling out of the box)
try {
  // Use capture phase so we can prevent Bootstrap's dropdown handler from closing the menu
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('.dropdown-submenu > .dropdown-toggle');
    if (!toggle) return;
    e.preventDefault();
    e.stopPropagation();
    const submenu = toggle.nextElementSibling;
    if (!submenu || !submenu.classList.contains('dropdown-menu')) return;

    const parent = toggle.closest('.dropdown-menu');
    // Close other open submenus on this level and reset their toggles
    Array.from(parent?.querySelectorAll(':scope > .dropdown-submenu') || [])
      .forEach(smLi => {
        const sm = smLi.querySelector(':scope > .dropdown-menu');
        const t = smLi.querySelector(':scope > .dropdown-toggle');
        if (sm && t && sm !== submenu && sm.classList.contains('show')) {
          sm.classList.remove('show');
          t.setAttribute('aria-expanded', 'false');
        }
      });

    const willShow = !submenu.classList.contains('show');
    if (willShow) {
      submenu.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
    } else {
      submenu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }, true);

  // Close any open submenus when a dropdown is hidden (so state is clean)
  document.addEventListener('hidden.bs.dropdown', function (e) {
    const menus = e.target.querySelectorAll('.dropdown-submenu .dropdown-menu.show');
    menus.forEach(m => m.classList.remove('show'));
    // also reset aria-expanded on submenu toggles
    const toggles = e.target.querySelectorAll('.dropdown-submenu > .dropdown-toggle[aria-expanded="true"]');
    toggles.forEach(t => t.setAttribute('aria-expanded', 'false'));
  });
} catch (err) {
  // ignore in non-browser environments
}
