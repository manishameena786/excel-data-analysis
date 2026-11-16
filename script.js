
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --green: #087f4b;
  --green-dark: #05643b;
  --green-light: #e8f5ed;
  --ink: #17251e;
  --muted: #718078;
  --surface: #ffffff;
  --background: #f7faf7;
  --border: #e5ece7;
  --shadow: 0 18px 55px rgba(27, 64, 43, .08);
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  overflow-x: hidden;
  transition: background .25s, color .25s;
}

button, input, select {
  font: inherit;
}

button, a {
  -webkit-tap-highlight-color: transparent;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  cursor: pointer;
}

.section-shell {
  width: min(1160px, calc(100% - 48px));
  margin-inline: auto;
}

/* HEADER */

.site-header {
  min-height: 78px;
  padding: 0 max(24px, calc((100% - 1160px) / 2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: rgba(255,255,255,.88);
  border-bottom: 1px solid rgba(225,235,227,.8);
  backdrop-filter: blur(18px);
  position: sticky;
  top: 0;
  z-index: 50;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--green);
  color: white;
  display: grid;
  place-items: center;
  font-family: Manrope, sans-serif;
  font-weight: 800;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-copy strong {
  font: 800 16px Manrope, sans-serif;
  letter-spacing: -.5px;
}

.brand-copy strong span {
  color: var(--green);
}

.brand-copy small {
  color: #8a9890;
  font-size: 8px;
  letter-spacing: 1.7px;
  font-weight: 700;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.main-nav a {
  color: #64736a;
  font-size: 12px;
  font-weight: 600;
  transition: .2s;
}

.main-nav a:hover {
  color: var(--green);
}

.theme-toggle {
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid var(--border);
  background: white;
  color: #53645a;
  padding: 9px 13px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
}

/* HERO */

.hero {
  min-height: 550px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 30px;
  padding-top: 45px;
  padding-bottom: 55px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.hero h1 {
  font: 800 clamp(42px, 5vw, 62px)/1.08 Manrope, sans-serif;
  letter-spacing: -3px;
  margin: 22px 0 18px;
}

.hero h1 span,
.section-heading h2 span,
.closing-cta h2 span {
  color: var(--green);
}

.hero-description {
  color: var(--muted);
  max-width: 460px;
  line-height: 1.8;
  font-size: 14px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-top: 30px;
}

.hero-proof {
  margin-top: 35px;
  color: #849087;
  font-size: 10px;
}

.hero-visual {
  min-height: 390px;
  position: relative;
  display: grid;
  place-items: center;
}

.dashboard-preview {
  width: min(440px, 90%);
  border-radius: 18px;
  overflow: hidden;
  background: white;
  box-shadow: 0 28px 70px rgba(30,75,48,.17);
  transform: rotate(-2deg);
  border: 1px solid #e4eee6;
}

.preview-top {
  height: 42px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 16px;
  border-bottom: 1px solid #edf1ed;
  color: #829087;
  font-size: 10px;
}

.preview-top span {
  margin-left: auto;
}

.preview-content {
  padding: 20px;
}

.preview-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.preview-metrics div {
  background: #f7faf7;
  border: 1px solid #edf2ee;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.preview-metrics small {
  color: #a1ada4;
  font-size: 7px;
  letter-spacing: 1px;
}

.preview-metrics b {
  font: 700 18px Manrope;
  color: var(--green);
}

.preview-chart {
  height: 120px;
  margin-top: 15px;
  border: 1px solid #edf2ee;
  border-radius: 8px;
  display: flex;
  align-items: end;
  padding: 12px;
  gap: 10px;
}

.preview-chart i {
  flex: 1;
  background: #8bc8a1;
  border-radius: 3px 3px 0 0;
}

.floating-chip {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 20px;
  background: white;
  box-shadow: 0 12px 35px rgba(28,67,44,.13);
  border: 1px solid #edf2ee;
  padding: 12px 15px;
  border-radius: 12px;
  color: var(--green);
  font-size: 11px;
  font-weight: 700;
}

/* BUTTONS */

.button {
  border: 0;
  border-radius: 10px;
  padding: 12px 17px;
  font-size: 11px;
  font-weight: 700;
  transition: transform .2s, box-shadow .2s, background .2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.button:hover {
  transform: translateY(-2px);
}

.button:disabled {
  opacity: .45;
  cursor: not-allowed;
  transform: none;
}

.button-primary {
  color: white;
  background: var(--green);
  box-shadow: 0 8px 18px rgba(8,127,75,.18);
}

.button-primary:hover {
  background: var(--green-dark);
}

.button-soft {
  background: #edf6f0;
  color: var(--green-dark);
}

.button-outline {
  background: white;
  border: 1px solid #cfe2d5;
  color: var(--green-dark);
}

.button-quiet {
  background: #f5f7f5;
  color: #64736a;
}

.button-light {
  background: white;
  color: var(--green-dark);
}

.text-link {
  font-size: 11px;
  font-weight: 700;
  color: #52645a;
}

/* TRUST STRIP */

.trust-strip {
  display: grid;
  grid-template-columns: repeat(4,1fr);
  padding: 22px 30px;
  background: white;
  border: 1px solid var(--border);
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(25,60,40,.04);
}

.trust-strip > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  border-right: 1px solid var(--border);
}

.trust-strip > div:last-child {
  border: 0;
}

.trust-strip b {
  font-size: 11px;
}

.trust-strip small {
  color: #8b9990;
  font-size: 9px;
}

/* SECTION HEADINGS */

.content-section {
  padding-top: 105px;
  scroll-margin-top: 90px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 28px;
}

.section-heading h2 {
  font: 800 38px/1.2 Manrope;
  letter-spacing: -1.8px;
  margin: 13px 0 8px;
}

.section-heading p {
  color: var(--muted);
  font-size: 12px;
  margin: 0;
}

.step-pill {
  padding: 8px 12px;
  border: 1px solid #dce9df;
  border-radius: 30px;
  color: var(--green);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* CARDS AND INPUTS */

.panel-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 25px;
  box-shadow: var(--shadow);
}

.upload-layout {
  display: grid;
  grid-template-columns: 1.35fr .85fr;
  gap: 18px;
}

.upload-card {
  text-align: center;
  padding: 35px;
}

.upload-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  border-radius: 15px;
  background: var(--green-light);
  display: grid;
  place-items: center;
  color: var(--green);
  font-size: 28px;
}

.upload-card h3,
.card-heading h3,
.table-heading h3,
.limits-card h3 {
  font: 700 17px Manrope;
  margin: 0;
}

.muted,
.card-heading p,
.table-heading p {
  color: var(--muted);
  font-size: 11px;
}

.file-drop {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  padding: 18px;
  margin: 22px 0 16px;
  border: 1px dashed #a9cbb3;
  border-radius: 12px;
  background: #f9fcf9;
  text-align: left;
  cursor: pointer;
}

.file-symbol {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  background: white;
  color: var(--green);
  border: 1px solid #e3eee5;
  border-radius: 9px;
  font-size: 20px;
}

.file-drop b,
.file-drop small {
  display: block;
}

.file-drop b {
  font-size: 11px;
}

.file-drop small {
  color: #89978e;
  font-size: 9px;
  margin-top: 4px;
}

.file-drop input {
  max-width: 170px;
  font-size: 9px;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status-message {
  min-height: 14px;
  color: var(--green);
  font-size: 10px;
  margin: 13px 0 0;
}

.limits-card h3 {
  margin-bottom: 8px;
}

.limits-card > p {
  margin: 7px 0 17px;
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.input-grid label,
.chart-controls label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #5e6e63;
  font-size: 10px;
  font-weight: 700;
}

.input-grid input,
.control-toolbar select,
.control-toolbar input,
.analyze-controls select,
.table-tools select,
.table-tools input,
.chart-controls select {
  min-width: 0;
  border: 1px solid #e1eae3;
  border-radius: 8px;
  padding: 10px;
  color: var(--ink);
  background: white;
  outline: none;
  font-size: 11px;
}

.input-grid input:focus,
select:focus,
input:focus {
  border-color: #8fc4a0;
}

.input-grid small,
.chart-controls small {
  color: #a1ada4;
  font-size: 8px;
  font-weight: 400;
}

.limits-card > .button {
  margin-top: 15px;
}

/* WORKSPACE */

.workspace-grid {
  display: grid;
  grid-template-columns: .8fr 1.2fr;
  gap: 18px;
  align-items: start;
}

.card-heading,
.table-heading > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-heading p,
.table-heading p {
  margin: 4px 0 0;
}

.mini-icon {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--green-light);
  color: var(--green);
  font-size: 17px;
  flex-shrink: 0;
}

.full-button {
  width: 100%;
  margin-top: 18px;
}

.tool-group {
  border-top: 1px solid #edf1ed;
  padding-top: 15px;
  margin-top: 16px;
}

.tool-label {
  display: block;
  color: #8b9990;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin-bottom: 10px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.toolbar .button {
  padding: 9px 11px;
  font-size: 9px;
}

.control-toolbar select,
.control-toolbar input {
  flex: 1;
  min-width: 90px;
  padding: 9px;
}

.control-toolbar input {
  min-width: 110px;
}

/* TABLE */

.table-card {
  margin-top: 18px;
}

.table-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  flex-wrap: wrap;
}

.export-actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.export-actions .button {
  padding: 10px 12px;
  font-size: 9px;
}

.table-tools {
  display: flex;
  gap: 9px;
  margin: 22px 0 13px;
}

.table-tools input {
  flex: 1;
}

.table-tools select {
  min-width: 130px;
}

.table-area {
  width: 100%;
  overflow: auto;
  border: 1px solid #e9efea;
  border-radius: 10px;
  min-height: 90px;
  max-height: 550px;
}

.table-area > p {
  padding: 15px;
  color: var(--muted);
  font-size: 11px;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 550px;
  font-size: 10px;
}

th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #eff7f1;
  color: #42634d;
  font-weight: 700;
  text-align: left;
}

th, td {
  padding: 7px 9px;
  border-bottom: 1px solid #edf1ed;
  white-space: nowrap;
}

td input {
  width: 100%;
  min-width: 70px;
  padding: 5px;
  border: 1px solid transparent;
  border-radius: 5px;
  background: transparent;
  color: var(--ink);
  font-size: 10px;
}

td input:focus {
  background: white;
  border-color: #9ccbaa;
  outline: none;
}

tr:hover td {
  background: #fbfdfb;
}

/* ANALYSIS */

.analysis-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.analyze-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.analyze-controls select {
  min-width: 140px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5,1fr);
  gap: 10px;
  margin-top: 25px;
}

.stat-item {
  padding: 16px;
  border: 1px solid #eaf0eb;
  border-radius: 11px;
  background: #fbfdfb;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.stat-item small {
  color: #8b9990;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1px;
}

.stat-item strong {
  font: 800 22px Manrope;
  color: var(--green);
  overflow-wrap: anywhere;
}

.stat-item span {
  color: #94a097;
  font-size: 9px;
}

.insights-panel {
  margin-top: 17px;
  padding: 17px;
  border-radius: 11px;
  background: #f1f8f2;
}

.insights-panel h3 {
  margin: 0;
  color: var(--green);
  font-size: 12px;
}

.insights-panel ul {
  margin: 12px 0 0;
  padding-left: 17px;
  color: #65756a;
  font-size: 10px;
  line-height: 1.9;
}

/* CHARTS */

.charts-panel {
  margin-bottom: 20px;
}

.chart-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-controls {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 12px;
  align-items: end;
}

.chart-controls select {
  width: 100%;
  margin-top: 3px;
}

.chart-controls .button {
  min-height: 38px;
}

.chart-explanation {
  margin-top: 22px;
  padding: 15px 17px;
  border: 1px solid #dcece0;
  border-radius: 11px;
  background: #f5faf6;
}

.chart-explanation b {
  color: var(--green-dark);
  font-size: 11px;
}

.chart-explanation p {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
  margin: 7px 0 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 15px;
  margin-top: 22px;
}

.chart-box {
  min-width: 0;
  min-height: 340px;
  padding: 18px;
  border: 1px solid #eaf0eb;
  border-radius: 12px;
  background: #fff;
  position: relative;
}

.chart-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 15px;
}

.chart-title b {
  font: 700 13px Manrope;
}

.chart-title span {
  color: #98a49b;
  font-size: 9px;
}

.canvas-wrap {
  position: relative;
  width: 100%;
  height: 265px;
}

/* FOOTER CTA */

.closing-cta {
  margin-top: 100px;
  margin-bottom: 70px;
  border-radius: 20px;
  padding: 48px 55px;
  background: #eaf5ec;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}

.closing-cta h2 {
  font: 800 40px/1.15 Manrope;
  letter-spacing: -1.5px;
  margin: 17px 0 10px;
}

.closing-cta p {
  color: #728078;
  font-size: 11px;
}

.site-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 0 30px;
  border-top: 1px solid var(--border);
  color: #8b9990;
  font-size: 10px;
}

.site-footer > a:last-child {
  color: var(--green);
  font-weight: 700;
}

/* DARK MODE */

body.dark-mode {
  --ink: #e6eee8;
  --muted: #9aa99f;
  --surface: #18251e;
  --background: #101a14;
  --border: #2b3a30;
  --green-light: #203c2b;
  --shadow: 0 18px 55px rgba(0,0,0,.16);
}

.dark-mode .site-header {
  background: rgba(19,31,23,.94);
  border-color: #2b3a30;
}

.dark-mode .theme-toggle,
.dark-mode .limits-card,
.dark-mode .dashboard-preview,
.dark-mode .floating-chip,
.dark-mode .file-drop,
.dark-mode .input-grid input,
.dark-mode .control-toolbar select,
.dark-mode .control-toolbar input,
.dark-mode .analyze-controls select,
.dark-mode .table-tools select,
.dark-mode .table-tools input,
.dark-mode .chart-controls select,
.dark-mode .chart-box,
.dark-mode .table-area {
  background: #1c2b22;
  color: var(--ink);
  border-color: #34483a;
}

.dark-mode .brand-copy strong,
.dark-mode .floating-chip,
.dark-mode .upload-card h3,
.dark-mode .card-heading h3,
.dark-mode .table-heading h3,
.dark-mode .limits-card h3 {
  color: var(--ink);
}

.dark-mode .main-nav a,
.dark-mode .text-link {
  color: #b1c0b5;
}

.dark-mode .trust-strip,
.dark-mode .panel-card {
  background: var(--surface);
  border-color: var(--border);
}

.dark-mode .insights-panel,
.dark-mode .closing-cta,
.dark-mode .chart-explanation {
  background: #20372a;
  border-color: #34483a;
}

.dark-mode .chart-explanation b {
  color: #b9e2c6;
}

.dark-mode .stat-item,
.dark-mode th {
  background: #203329;
  border-color: #34483a;
  color: var(--ink);
}

.dark-mode td input {
  color: var(--ink);
}

.dark-mode tr:hover td {
  background: #203329;
}

.dark-mode .button-soft,
.dark-mode .button-quiet {
  background: #294333;
  color: #c4e4ce;
}

.dark-mode .button-outline {
  background: #1c2b22;
  color: #c4e4ce;
  border-color: #476650;
}

.dark-mode .file-drop small,
.dark-mode .chart-title span {
  color: #a4b3a8;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .main-nav { gap: 15px; }
  .main-nav a { font-size: 10px; }
  .hero { gap: 10px; }
  .hero h1 { font-size: 48px; }
  .workspace-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(3,1fr); }
}

@media (max-width: 650px) {
  .section-shell {
    width: min(100% - 30px, 1160px);
  }

  .site-header {
    min-height: 68px;
    padding: 12px 15px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .brand-copy strong { font-size: 14px; }

  .main-nav {
    order: 3;
    width: 100%;
    overflow-x: auto;
    justify-content: space-between;
    padding: 7px 0 3px;
  }

  .main-nav a { white-space: nowrap; }

  .theme-toggle {
    margin-left: auto;
    padding: 8px 10px;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 5px;
    min-height: auto;
    padding-top: 58px;
    padding-bottom: 36px;
  }

  .hero h1 {
    font-size: clamp(40px,11vw,55px);
    letter-spacing: -2px;
  }

  .hero-description { font-size: 14px; }
  .hero-visual { min-height: 300px; margin-top: 12px; }
  .dashboard-preview { width: 88%; }

  .trust-strip {
    grid-template-columns: repeat(2,1fr);
    gap: 17px 8px;
    padding: 18px 10px;
  }

  .trust-strip > div {
    border: 0;
    justify-content: center;
  }

  .content-section { padding-top: 75px; }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 13px;
  }

  .section-heading h2 { font-size: 34px; }

  .upload-layout { grid-template-columns: 1fr; }
  .upload-card { padding: 24px 17px; }
  .file-drop { justify-content: flex-start; }

  .panel-card {
    padding: 18px;
    border-radius: 17px;
  }

  .table-heading { align-items: flex-start; }
  .export-actions { width: 100%; }

  .export-actions .button {
    flex: 1;
    padding-inline: 8px;
    font-size: 9px;
  }

  .analysis-heading { align-items: flex-start; }
  .analyze-controls { width: 100%; }
  .analyze-controls select { flex: 1; }

  .chart-controls {
    grid-template-columns: 1fr;
  }

  .charts-grid { grid-template-columns: 1fr; }
  .chart-box { min-height: 320px; padding: 16px; }

  .closing-cta {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 75px;
    padding: 34px 25px;
  }

  .closing-cta h2 { font-size: 32px; }

  .site-footer { flex-wrap: wrap; }
  .site-footer > span { order: 3; width: 100%; }
}

@media (max-width: 390px) {
  .hero-actions { gap: 15px; }
  .hero-proof { flex-wrap: wrap; font-size: 9px; }
  .input-grid { grid-template-columns: 1fr; }
  .file-drop { flex-wrap: wrap; }
  .toolbar .button { flex: 1 1 auto; }

  .control-toolbar select,
  .control-toolbar input {
    flex-basis: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2,1fr);
  }
}
