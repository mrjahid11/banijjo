import React from "react";
import "./footer.css"; // we'll store the CSS here

export const Footer = () => {
  return (
    <footer className="tv-footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <h2 className="site-name">Banijjo</h2>
          <p className="site-motto">Empowering Traders Worldwide</p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="footer-columns">
          <div>
            <h4>More than a product</h4>
            <ul>
              <li>Supercharts</li>
            </ul>
            <h5>Screeners</h5>
            <ul>
              <li>Stocks</li>
              <li>ETFs</li>
              <li>Bonds</li>
              <li>Crypto coins</li>
              <li>CEX pairs</li>
              <li>DEX pairs</li>
              <li>Pine</li>
            </ul>
            <h5>Heatmaps</h5>
            <ul>
              <li>Stocks</li>
              <li>ETFs</li>
              <li>Crypto</li>
            </ul>
            <h5>Calendars</h5>
            <ul>
              <li>Economic</li>
              <li>Earnings</li>
              <li>Dividends</li>
            </ul>
            <h5>More products</h5>
            <ul>
              <li>Yield Curves</li>
              <li>Options</li>
              <li>News Flow</li>
              <li>Pine Script®</li>
            </ul>
            <h5>Apps</h5>
            <ul>
              <li>Mobile</li>
              <li>Desktop</li>
            </ul>
          </div>

          <div>
            <h4>Tools & subscriptions</h4>
            <ul>
              <li>Features</li>
              <li>Pricing</li>
              <li>Market data</li>
            </ul>
            <h5>Trading</h5>
            <ul>
              <li>Overview</li>
              <li>Brokers</li>
            </ul>
            <h5>Special offers</h5>
            <ul>
              <li>CME Group futures</li>
              <li>Eurex futures</li>
              <li>US stocks bundle</li>
            </ul>
            <h5>About company</h5>
            <ul>
              <li>Who we are</li>
              <li>Space mission</li>
              <li>Blog</li>
              <li>Careers</li>
              <li>Media kit</li>
            </ul>
            <h5>Merch</h5>
            <ul>
              <li>TradingView store</li>
              <li>Tarot cards for traders</li>
              <li>The C63 TradeTime</li>
            </ul>
            <h5>Policies & security</h5>
            <ul>
              <li>Terms of Use</li>
              <li>Disclaimer</li>
              <li>Privacy Policy</li>
              <li>Cookies Policy</li>
              <li>Accessibility Statement</li>
              <li>Security tips</li>
              <li>Bug Bounty program</li>
              <li>Status page</li>
            </ul>
          </div>

          <div>
            <h4>Community</h4>
            <ul>
              <li>Social network</li>
              <li>Wall of Love</li>
              <li>Refer a friend</li>
              <li>House Rules</li>
              <li>Moderators</li>
            </ul>
            <h5>Ideas</h5>
            <ul>
              <li>Trading</li>
              <li>Education</li>
              <li>Editors' picks</li>
            </ul>
            <h5>Pine Script</h5>
            <ul>
              <li>Indicators & strategies</li>
              <li>Wizards</li>
              <li>Freelancers</li>
            </ul>
          </div>

          <div>
            <h4>Business solutions</h4>
            <ul>
              <li>Widgets</li>
              <li>Charting libraries</li>
              <li>Lightweight Charts™</li>
              <li>Advanced Charts</li>
              <li>Trading Platform</li>
            </ul>
            <h5>Growth opportunities</h5>
            <ul>
              <li>Advertising</li>
              <li>Brokerage integration</li>
              <li>Partner program</li>
              <li>Education program</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Banijjo. All rights reserved.</p>
      </div>
    </footer>
  );
};
