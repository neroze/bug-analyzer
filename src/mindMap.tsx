import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  siem:   { b:"#3C3489", m:"#7F77DD", l:"#EEEDFE", d:"#26215C" },
  webapp: { b:"#BA7517", m:"#EF9F27", l:"#FAEEDA", d:"#412402" },
  ingest: { b:"#1D9E75", m:"#5DCAA5", l:"#E1F5EE", d:"#085041" },
  store:  { b:"#185FA5", m:"#378ADD", l:"#E6F1FB", d:"#042C53" },
  detect: { b:"#D85A30", m:"#F0997B", l:"#FAECE7", d:"#4A1B0C" },
  fleet:  { b:"#0F6E56", m:"#3DBF97", l:"#E1F5EE", d:"#04342C" },
  ndr:    { b:"#2563A8", m:"#85B7EB", l:"#E6F1FB", d:"#042C53" },
  soar:   { b:"#993556", m:"#D4537E", l:"#FBEAF0", d:"#4B1528" },
  dist:   { b:"#6B6A64", m:"#B4B2A9", l:"#F1EFE8", d:"#2C2C2A" },
  agent:  { b:"#3B6D11", m:"#97C459", l:"#EAF3DE", d:"#173404" },
  saas:   { b:"#854F0B", m:"#C98A2E", l:"#FAEEDA", d:"#412402" },
  aahc:   { b:"#2E7D5E", m:"#52BF97", l:"#E0F5EE", d:"#0d3325" },
  infra:  { b:"#555555", m:"#AAAAAA", l:"#EEEEEE", d:"#222222" },
};

const MATRIX_URL = "https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799308828/Web+Application+Feature-Test+Coverage+Matrix";
const DEP_URL = "https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799274741/Dependency+Document";

// ════════════════════════════════════════════════════════════════════════════
// WEB APPLICATION BRANCH — exact Module → Feature → SubFeature hierarchy
// from the Feature-Test Coverage Matrix (page 4799308828)
// ════════════════════════════════════════════════════════════════════════════
const WEBAPP = {
  id:"webapp", label:"Web Application (UI)", sub:"19 modules · Feature-Test Matrix", c:C.webapp,
  desc:"The SIEM web UI component. This branch mirrors the official Feature-Test Coverage Matrix exactly: Module → Feature → SubFeature. ExtJS shell migrating to React. All URLs gated by site permissions (permission.json per module, levels 1=read/2=write/3=delete).",
  url:MATRIX_URL,
  deps:["webserver","site-permissions"],
  children:[
    { id:"m-login", label:"Login", sub:"Module · 4 features", c:C.webapp,
      desc:"Login module. Users must access Logpoint via provided credentials. Dependent on User module for credential validation.", url:MATRIX_URL, deps:["m-user-account"],
      children:[
        { id:"f-login-normal", label:"Normal User Login", sub:"Feature", desc:"Standard local-credential login flow.", url:MATRIX_URL,
          children:[ { id:"sf-user-creation", label:"User Creation", sub:"SubFeature", desc:"User creation flow tested as part of normal user login. A user group must be assigned to create a user." } ] },
        { id:"f-login-admin",  label:"AdminUser Login", sub:"Feature", desc:"Admin user login. Logpoint Administrator usergroup bypasses all site-permission checks." },
        { id:"f-login-ldap",   label:"LDAP User Login", sub:"Feature", desc:"Login via LDAP-authenticated user. Depends on LDAP Authentication strategy config.", deps:["f-auth-ldap"] },
        { id:"f-login-pwrec",  label:"Password Recovery", sub:"Feature", desc:"Password recovery flow for local users." },
      ]
    },
    { id:"m-auth", label:"Authentication", sub:"Module · 7 strategies", c:C.webapp,
      desc:"Authentication strategies module. Per credentials inventory: stores LDAP, SAML, OAuth, LPSaaS and Radius credentials. Jinja2 templating supported for LDAP strategies.", url:MATRIX_URL, deps:["credentials"],
      children:[
        { id:"f-auth-lp",     label:"Logpoint Authentication", sub:"100% TC · 70% automated", desc:"Native authentication. Test set LP-56775. 100% test-case coverage, 70% automated, 2h manual execution." },
        { id:"f-auth-saml",   label:"SAML Authentication", sub:"Feature", desc:"SAML 2.0 SSO federation with enterprise IdPs." },
        { id:"f-auth-radius", label:"Radius Authentication", sub:"Feature", desc:"RADIUS protocol authentication. Dedicated troubleshooting guide exists in the WebApp team folder.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5290885194/Troubleshooting+Radius+Authentication" },
        { id:"f-auth-oauth",  label:"OAuth Authentication", sub:"Feature", desc:"OAuth/OIDC authentication. Troubleshooting guide in WebApp folder. Also used in Postfix email (OAuth in Postfix design doc).", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5380669521/Troubleshooting+OAuth+Authentication" },
        { id:"f-auth-adfs",   label:"AD FS Authentication", sub:"Feature", desc:"Active Directory Federation Services SSO." },
        { id:"f-auth-ldap",   label:"LDAP Authentication", sub:"Feature", desc:"LDAP bind authentication. Same LDAP config shared with the LDAP Enrichment Source (per Dependency Document).", deps:["f-enrichment-sources"] },
        { id:"f-auth-duo",    label:"Duo Authentication", sub:"100% TC · 0% automated", desc:"DUO 2FA. Test set LP-29396: 100% TC coverage, 0% automated, 2h manual. Troubleshooting guide in WebApp folder.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5339447551/Troubleshooting+DUO+2+factor+Authentication" },
      ]
    },
    { id:"m-dashboards", label:"Dashboards", sub:"Module · 2 features", c:C.webapp,
      desc:"Dashboard module. Quick Start links to all modules. Dashboards can also be created via 'Add Search to' in Search. Data displayed per selected repos. Widgets poll Premerger live searches.", url:MATRIX_URL, deps:["premerger","m-search","repos-be"],
      children:[
        { id:"f-dash-all",      label:"All Dashboard", sub:"Feature", desc:"Full dashboard list view, CRUD, sharing to user groups, import (import-only in Import/Export)." },
        { id:"f-dash-overview", label:"Overview", sub:"Feature", desc:"Overview dashboard with security posture KPIs and Quick Start links to all modules." },
      ]
    },
    { id:"m-investigation", label:"Investigation", sub:"Module · 2 features", c:C.webapp,
      desc:"Investigation module. 'View Data' in incidents redirects to Search. Incidents can be added from Search, Dashboard, Search Template and UEBA via 'Add Search to'.", url:MATRIX_URL, deps:["m-search","alert-engine-be"],
      children:[
        { id:"f-incident", label:"Incident", sub:"Feature", desc:"Incident triage view. 1:1 mapping with alert rule. Incident User Groups govern assignment. View Data → Search redirect. Incident API accessible when license valid." },
        { id:"f-cases",    label:"Cases", sub:"Feature", desc:"Case management for grouped investigation. Evidence attachment from search results." },
      ]
    },
    { id:"m-search-templates", label:"Search Templates", sub:"Module", c:C.webapp,
      desc:"Saved parameterised LPL queries. Drilldown from search page via 'Drilldown to Search Template'. Data displayed per selected repos. Shareable; import-only in Import/Export.", url:MATRIX_URL, deps:["m-search"] },
    { id:"m-search", label:"Search", sub:"Module · LPL engine", c:C.webapp,
      desc:"Core search module. Select Repos lists all repos and scopes results. Export Logs → Export Management targets. View Table Data → Enrichment Source. WHOIS/DNS lookup, Interesting Fields. One-click: save search, add to dashboard/alert/incident.", url:MATRIX_URL, deps:["merger-be","premerger","repos-be","f-export-mgmt"] },
    { id:"m-ueba-dash", label:"UEBA Dashboard", sub:"Module", c:C.webapp,
      desc:"UEBA anomaly board. Entity risk scores, baseline deviations. Anomalies list served by Merger. UEBA Board depends on Dashboard module per Dependency Document.", url:MATRIX_URL, deps:["ueba-be","m-dashboards"] },
    { id:"m-playbook", label:"Playbook", sub:"Module · SOAR embed", c:C.webapp,
      desc:"SOAR playbook module surfaced in SIEM UI. Visual playbook listing and execution monitoring.", url:MATRIX_URL, deps:["soar"] },
    { id:"m-reports", label:"Reports", sub:"Module", c:C.webapp,
      desc:"Report creation with dashboard screenshots or searched-log screenshots. Reports generated per selected repos. Password-protected reports store access credentials. Report templates + layout templates importable/exportable.", url:MATRIX_URL, deps:["m-dashboards","m-search","credentials"] },

    { id:"m-user-account", label:"Settings » User Account", sub:"Module · 4 features", c:C.webapp,
      desc:"User account administration. Delete User impacts Dashboard and Alert ownership. User group cannot be deleted without deleting its users first.", url:MATRIX_URL,
      children:[
        { id:"f-users",      label:"Users", sub:"Feature", desc:"User CRUD. A user group must be assigned to create a user. LDAP users tracked locally. Username/password credentials stored per credentials inventory.", deps:["f-user-groups"] },
        { id:"f-user-groups",label:"User Groups", sub:"Feature", desc:"Access scopes: repos + devices assigned per group. Required for: user creation, Share popup (lists all groups/users), Incident User Group creation. Permission group must be assigned when creating/editing.", deps:["f-permission-groups","f-repo","f-devices"] },
        { id:"f-permission-groups", label:"Permission Groups", sub:"Feature · 2 subfeatures",
          desc:"Site-permission control. permission.json per module defines required level per URL: 1=read, 2=write/create/edit, 3=delete. Logpoint Administrator bypasses all checks. Checked centrally in permission_manager.py.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5334040690/Site+permissions+-+What+can+a+User+do",
          children:[
            { id:"sf-crud-op",  label:"CRUD Operation", sub:"SubFeature", desc:"Create/read/update/delete operations on permission groups themselves." },
            { id:"sf-obj-perm", label:"Object Permission", sub:"SubFeature · LP-24137", desc:"Object-level permissions: which objects inside components the user can act on. Site-permissions (feature-level) + object-permissions together provide full authorization." },
          ]
        },
        { id:"f-inc-user-groups", label:"Incident User Groups", sub:"Feature", desc:"Created from User Groups. Required by Alert Rules for incident routing — incidents are assigned/managed by users in the incident user group.", deps:["f-user-groups","f-alert-rules"] },
      ]
    },

    { id:"m-configuration", label:"Settings » Configuration", sub:"Module · 15 features", c:C.webapp,
      desc:"Core SIEM configuration module — the policy pipeline lives here: Routing → Normalization → Enrichment → Processing → Log Collection Policies → Devices.", url:MATRIX_URL,
      children:[
        { id:"f-repo", label:"Repo", sub:"Feature", desc:"Repo CRUD. Routing Policy provides the rule to save data to repos. User Group editing assigns repo accessibility. Search/Dashboard/Report/Alert/SearchTemplate all scope to selected repos.", deps:["f-routing-policy","f-user-groups"] },
        { id:"f-routing-policy", label:"Routing Policy", sub:"Feature", desc:"Device→repo routing rules. Required when creating a Processing Policy.", deps:["f-processing-policies"] },
        { id:"f-norm-policies", label:"Normalization Policies", sub:"Feature", desc:"Assigns normalization packages per device type. Required by Processing Policy. Duplicate normalization policy caused Logsource issue LP-68898.", deps:["f-norm-packages","f-processing-policies"] },
        { id:"f-enrichment-sources", label:"Enrichment Sources", sub:"Feature", desc:"Source types: CSV, Oracle/ODBC, STIX/TAXII, LDAP, IPtoHost, GeoIP. Tables from Lists & Tables also appear here. View Table Data in Search reads from here. Enrichment SSL stores certs/keys.", deps:["f-lists-tables","credentials"] },
        { id:"f-enrichment-policies", label:"Enrichment Policies", sub:"Feature", desc:"Created using enrichment sources in the enrichment criteria. Required by Processing Policy.", deps:["f-enrichment-sources","f-processing-policies"] },
        { id:"f-processing-policies", label:"Processing Policies", sub:"Feature", desc:"Master pipeline policy = Routing + Normalization + Enrichment policy. Collectors/Fetchers collect logs per the processing policy selected in Log Collection Policy." },
        { id:"f-dist-collectors", label:"Distributed Collectors", sub:"Feature", desc:"LPC management. Logs from a device can be collected on a distributed collector. Site permission: read/write/delete on 'Distributed Collectors'.", deps:["lpc-be"] },
        { id:"f-log-coll-policies", label:"Log Collection Policies", sub:"Feature", desc:"Associates Processing Policy with devices — logs collected per the policy selected here.", deps:["f-processing-policies","f-devices"] },
        { id:"f-devices", label:"Devices", sub:"Feature · 1 subfeature", desc:"Device registry. 'No of Sources' in the license = max devices addable. User Group editing assigns device accessibility. Devices assigned to Device Groups.", deps:["f-licenses","f-device-groups"],
          children:[ { id:"sf-default-log-accept", label:"Default Log Accept (Syslog)", sub:"SubFeature · LP-62420 · 100%/0%", desc:"Default log acceptance for syslog devices. 100% TC coverage, 0% automated, 1.5h manual execution." } ] },
        { id:"f-device-groups", label:"Device Groups", sub:"Feature", desc:"Devices can be assigned to device groups for bulk management and sync export/import." },
        { id:"f-dist-logpoints", label:"Distributed Logpoints", sub:"Feature", desc:"DLP management incl. DLP Switcher (manage log sources on remote DLPs from Search Head, v7.6+). DLP comms being revamped (Distributed Logpoint Communication Revamp). HTTPS used in LP-LP communication.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5226365232/Distributed+Logpoint+Communication+Revamp", deps:["dlp-be"] },
        { id:"f-export-mgmt", label:"Export Management", sub:"Feature", desc:"Export targets for Search 'Export Logs'. FTP and SCP/SSH delivery. SSL variant stores username/password credentials.", deps:["credentials"] },
        { id:"f-raw-syslog-fwd", label:"Raw Syslog Forwarder", sub:"Feature", desc:"Forwards logs TCP/UDP mode; receives via collector/fetcher other than syslog/snare; supports logs >5KB. Forwarded logs must display in Search. Known limitation: cannot forward URAF or non-syslog sources (LP-75714).", deps:["m-search"] },
        { id:"f-ueba-board", label:"UEBA Board", sub:"Feature", desc:"UEBA board configuration. Depends on Dashboard module per Dependency Document.", deps:["m-dashboards"] },
        { id:"f-data-privacy", label:"Data Privacy Module", sub:"Feature", desc:"Field masking across Search, Alert, Dashboard, Report, Search Template, Search Views. Complex Encryption stores encryption keys per credentials inventory. Uses Fields definitions.", deps:["f-fields","credentials"] },
      ]
    },

    { id:"m-logsource", label:"Settings » Logsource", sub:"Module · 4 subfeatures", c:C.webapp,
      desc:"New Log Source onboarding UI (replacing legacy Devices flow). Syslog Collector now configurable through LogSource. Issue history: duplicate normalization policy LP-68898.", url:MATRIX_URL,
      children:[
        { id:"f-logsource", label:"Logsource", sub:"Feature · 4 subfeatures", desc:"Log source CRUD with template-driven onboarding.",
          children:[
            { id:"sf-ftp-ls",   label:"FTP Fetcher Log Sources", sub:"LP-62415/62416 · 100%/80%", desc:"FTP fetcher as log source. 100% TC coverage, 80% automated, 4h manual. FTP credentials stored per credentials inventory." },
            { id:"sf-odbc-ls",  label:"ODBC Fetcher", sub:"LP-61839/61828 · 100%/0%", desc:"ODBC fetcher log source. 100% TC, 0% automated. 9 days execution including driver configuration. ODBC DB login credentials stored." },
            { id:"sf-traffic-light", label:"Traffic Light Monitoring", sub:"LP-65756 · 100%/0%", desc:"Traffic-light indicator for inactive log sources. 100% TC, 0% automated, 1h manual." },
            { id:"sf-logsrc-tpl", label:"Logsource Template", sub:"LP-49966 · 16h execution", desc:"Template-driven log source creation. 16 hours manual execution time." },
          ]
        },
      ]
    },

    { id:"m-knowledge-base", label:"Settings » Knowledge Base", sub:"Module · 9 features", c:C.webapp,
      desc:"Content management: packages, rules, fields, lists, macros, views. Most items support import/export for cross-instance sharing.", url:MATRIX_URL,
      children:[
        { id:"f-norm-packages", label:"Normalization Packages", sub:"Feature", desc:"Regex definition packages with int/float/word/date definers. Add/Edit Normalization Policy depends on these. Importable + exportable." },
        { id:"f-label-packages", label:"Label Packages", sub:"Feature", desc:"Label rule sets powering the labeling service. Search labels addable via 'Add Search to'. Import-only.", deps:["m-search"] },
        { id:"f-search-packages", label:"Search Packages", sub:"Feature", desc:"Saved Search with Public URL — addable via 'Add Search to' or 'Save Search' in Search. Shareable.", deps:["m-search"] },
        { id:"f-alert-rules", label:"Alert Rules", sub:"Feature · 2 subfeatures", desc:"Detection rule CRUD. Addable from Search, Dashboard, Search Template via 'Add Search to'. Incidents trigger per selected repos. Incident User Group assignment required.", deps:["m-search","m-dashboards","f-inc-user-groups","ar-module"],
          children:[
            { id:"sf-auto-share", label:"Auto-share to Admin", sub:"LP-61889 · 100%/0%", desc:"Analytics content auto-shares to the Admin user. 100% TC, 0% automated, 4h manual." },
            { id:"sf-bulk-op",    label:"Bulk Operation", sub:"LP-53863/65886", desc:"Mass enable/disable/delete of alert rules for fleet-scale rule management." },
          ]
        },
        { id:"f-kb-dashboards", label:"Dashboards (KB)", sub:"Feature", desc:"Dashboard package management in Knowledge Base. Import-only in Import/Export." },
        { id:"f-fields", label:"Fields", sub:"Feature", desc:"Field definitions listed for Data Privacy module and Alert Throttling. Importable/exportable.", deps:["f-data-privacy"] },
        { id:"f-lists-tables", label:"List and Tables", sub:"Feature", desc:"Static + dynamic lists/tables (dynamic_entity_service / dynamic_table_service, stored in MongoDB). Tables viewable in Enrichment Source. Values usable in search/dashboard/report/alert/search-template queries.", deps:["mongodb","f-enrichment-sources"] },
        { id:"f-macros", label:"Macros", sub:"Feature", desc:"Reusable LPL fragments usable in search, dashboard, alerts, report templates, search templates. Importable/exportable." },
        { id:"f-search-views", label:"Search Views", sub:"Feature", desc:"Custom column layouts for search results. Self-contained — not dependent on other modules per Dependency Document." },
      ]
    },

    { id:"m-system-settings", label:"Settings » System Settings", sub:"Module · 9 features", c:C.webapp,
      desc:"System administration. ExtJS→React migration Phase 1 covers System Monitor + Backup & Restore landing pages (LP-75155, LP-76132) with feature flags and RBAC integration.", url:MATRIX_URL,
      children:[
        { id:"f-system-monitor", label:"System Monitor", sub:"Feature", desc:"Disk/memory/MPS/CPU usage via system_metrics. System Notifications creatable from System Monitor Dashboard. React migration Phase 1.", deps:["f-sys-notification"] },
        { id:"f-system-settings-gen", label:"System Settings (general)", sub:"LP-66281 · 100%/0%", desc:"General system settings. 100% TC, 0% automated, 5h manual execution." },
        { id:"f-licenses", label:"Licenses", sub:"Feature · 5 subfeatures", desc:"All Logpoint components inaccessible once license expires. 'No of Sources' = max devices. Entitlement Service (design in WebApp folder) brings license-aware feature access.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5442109447/Design+Document+Entitlement+Service",
          children:[
            { id:"sf-lic-siem", label:"SIEM License", sub:"LP-54893/54540", desc:"SIEM license functionality and notification behaviour." },
            { id:"sf-lic-soar", label:"SOAR License", sub:"LP-61837 · 3h", desc:"SOAR license functionality and notification. 3h manual execution." },
            { id:"sf-lic-ueba", label:"UEBA License", sub:"SubFeature", desc:"UEBA license functionality and notification." },
            { id:"sf-lic-consumption", label:"License Consumption", sub:"LP-61116/61113 · 3h", desc:"License consumption tracking. Agent-based node counting: FileKeeper stores agent colTs in Redis DB index 2; LogTsPopulatorThread syncs; counter.py counts unique active agents.", deps:["redis"] },
            { id:"sf-lic-removal", label:"License Removal Modes", sub:"LP-54893 · 1h", desc:"Removal of license in different deployment modes. 1h manual execution." },
          ]
        },
        { id:"f-updates", label:"Updates", sub:"Feature", desc:"Patch upload + install. Post-install: version updates in About section, clean installation logs, Updates page shows proper info.", deps:["f-about"] },
        { id:"f-open-door", label:"Open Door", sub:"Feature", desc:"Enable/disable support tunnel + LPC/DLP paths — both must work properly when enabled. Stores password per credentials inventory. Internal workflow documented in WebApp folder.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5714379771/Open+Door+Internal+workflow", deps:["lpc-be","dlp-be","credentials"] },
        { id:"f-backup-restore", label:"Backup and Restore", sub:"Feature", desc:"Config + logs backup (scheduled/ad-hoc). Transport to external via public key. Restore from previous versions. React migration Phase 1." },
        { id:"f-plugins", label:"Plugins", sub:"Feature", desc:"Plugin installation and management (normalization packs, SOAR, NDR collector, applications)." },
        { id:"f-sync", label:"Sync", sub:"Feature", desc:"Export/Import: Device Groups, Norm Packages, Norm Policies, Processing Policies, Labeling Rules, Devices, Repos, Log Collection Policies — all must be synced after import." },
        { id:"f-applications", label:"Applications", sub:"Feature", desc:"Installable application management (SOAR, AAHC, NDR Collector). Total imported-application counts displayed. Functionality doc: page 5116690486." },
      ]
    },

    { id:"m-soar-settings", label:"Settings » SOAR Settings", sub:"Module", c:C.webapp,
      desc:"SOAR configuration inside SIEM UI. Site permissions cover: Integrations, API Key, Licensing, My Products, Lists Management, Import, System Health, Manage Cases.", url:MATRIX_URL, deps:["soar"],
      children:[
        { id:"f-soar-teaser", label:"SOAR Teaser", sub:"LP-61432 · 100%/75%", desc:"SOAR teaser page for unlicensed users. 100% TC coverage, 75% automated, 4h manual execution." },
      ]
    },
    { id:"m-system-time", label:"System Time", sub:"Module", c:C.webapp, desc:"System time configuration (NTP). Critical for log timestamp accuracy across all collection services.", url:MATRIX_URL },
    { id:"m-system-notification", label:"System Notification", sub:"Module", c:C.webapp, desc:"System notification display and management. Created from System Monitor Dashboard (disk, memory, license expiry, service failures).", url:MATRIX_URL,
      children:[ { id:"f-sys-notification", label:"Notification rules", sub:"Feature", desc:"Configurable notification rules from System Monitor metrics (disk usage, memory usage, MPS, CPU)." } ] },
    { id:"m-help-center", label:"Help Center", sub:"Module · 6 features", c:C.webapp,
      desc:"Help and support module.", url:MATRIX_URL,
      children:[
        { id:"f-about", label:"About Page", sub:"Feature", desc:"Version info — must update after patch installation." },
        { id:"f-documentation", label:"Documentation", sub:"Feature", desc:"Links to product documentation." },
        { id:"f-help-center", label:"Help Center", sub:"Feature", desc:"In-product help center." },
        { id:"f-contact-support", label:"Contact Support", sub:"Feature", desc:"Support contact flow." },
        { id:"f-give-feedback", label:"Give Feedback", sub:"Feature", desc:"Product feedback submission." },
        { id:"f-eula", label:"EULA", sub:"Feature", desc:"End-user license agreement display." },
      ]
    },
    { id:"m-user-profile", label:"User Profile", sub:"Module · 2 features", c:C.webapp,
      desc:"User profile management. User Preferences store session/token-based credentials.", url:MATRIX_URL, deps:["credentials"],
      children:[
        { id:"f-my-preference", label:"My Preference", sub:"Feature", desc:"Per-user preferences (timezone, defaults). Session/token credentials stored." },
        { id:"f-logout", label:"Logout", sub:"Feature", desc:"Session termination. Sessions persisted in Redis by webserver.", deps:["redis"] },
      ]
    },
  ]
};

// ════════════════════════════════════════════════════════════════════════════
// ALERTING & INCIDENTS — DEEP DOMAIN BRANCH
// Sources: Alert folder 4853661705, Engineering Assessment 6116606003,
// Alert Engine tech doc 5359337811, WebApp folder 5165678922
// ════════════════════════════════════════════════════════════════════════════
const ALERT_FOLDER = "https://logpoint.atlassian.net/wiki/spaces/LP/folder/4853661705";

const ALERTS_DOMAIN = {
  id:"alerts-domain", label:"Alerting & Incidents", sub:"Deep dive · 16-page design folder", c:C.detect,
  desc:"End-to-end alerting domain: AlertRule (input) → live search → Alert Engine evaluation → Incident (output) → Dispatcher notifications. AlertRules are the search configs + trigger conditions; triggered alerts are 'Incidents'. Full design-doc folder linked below covers schema, APIs, notifications, 3rd-party incident ingestion and the 2026 re-architecture assessment.",
  url:ALERT_FOLDER,
  deps:["f-alert-rules","premerger","mongodb","redis"],
  children:[

    // ── ALERT RULES (module) ────────────────────────────────────────────────
    { id:"ar-module", label:"Alert Rules (module)", sub:"Detection rules · MongoDB 'alertrules'", c:C.detect,
      desc:"AlertRules define an active Livesearch config + trigger conditions, plus metadata: taxonomy, incident ownership, RBAC ownership, notifications, MITRE tagging, data privacy. Saved in MongoDB collection 'alertrules'; triggered incidents in 'alert_incidents'. Rule = input, Incident = output.",
      url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278582/Alert+rules+and+Incidents+in+Logpoint",
      children:[

        { id:"ar-codemap", label:"Data model & code map", sub:"documents.py · controller.py · services.py", c:C.detect,
          desc:"Developer map: model class 'AlertRules' in documents.py; APIs/views in controller.py; HTTP input parsing & validation in validation.py; create/update business logic in services.py.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278582/Alert+rules+and+Incidents+in+Logpoint",
          children:[
            { id:"ar-collections", label:"MongoDB collections", sub:"alertrules · alert_incidents", desc:"Rules persist in 'alertrules'; fired incidents in 'alert_incidents'. Both readable via makalu DB.", deps:["mongodb"] },
            { id:"ar-ids", label:"alertrule_id vs alert_id", sub:"Identity vs change-detection", desc:"alertrule_id stays CONSTANT for the same rule across edits (identity). alert_id CHANGES on every edit — this is how Alert Engine detects config changes for a rule. Critical test point and common source of confusion." },
            { id:"ar-configjson", label:"config.json propagation", sub:"AlertEngine + AlertDispatcher configs", desc:"All UI-configurable rule parameters must persist to DB AND appear in config.json for both AlertEngine and AlertDispatcher. Verifying this propagation is a mandatory release test.", deps:["config-gen"] },
          ]
        },

        { id:"ar-creation", label:"Creation paths", sub:"10 documented use cases", c:C.detect,
          desc:"Every path that creates/updates an AlertRule — each is a distinct test scenario and risk surface. Name-conflict handling across use/create/import/clone is a known sanity-test area.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278582/Alert+rules+and+Incidents+in+Logpoint",
          children:[
            { id:"arc-ui", label:"Custom rule from UI", sub:"Create + update", desc:"Standard creation/update from Knowledge Base » Alert Rules UI." },
            { id:"arc-plugin", label:"Vendor rule via Plugin install", sub:"Create + update on patch", desc:"Vendor rules created/updated during plugin installation. All plugins bundle into a Logpoint patch/ISO.", deps:["f-plugins"] },
            { id:"arc-use-vendor", label:"'Use' a vendor rule", sub:"Active copy created", desc:"Using a vendor rule creates an editable 'used' copy. Vendor original is immutable to users." },
            { id:"arc-shared", label:"Use a shared rule (RBAC)", sub:"Copy created per user", desc:"Using a custom rule shared via RBAC creates a per-user copy." },
            { id:"arc-clone", label:"Clone", sub:"Any shared/vendor/own rule", desc:"Cloning any accessible rule creates a copy owned by the cloner." },
            { id:"arc-pak", label:"Import PAK", sub:"User + vendor rule PAKs", desc:"Import of rule PAKs exported from another Logpoint machine — including PAKs containing vendor rules." },
            { id:"arc-from-search", label:"From Search / Dashboard / Template", sub:"'Add Search to' flow", desc:"Rules created directly from Search, Search Template and Dashboard contexts.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799273456/Create+Incidents+Alerts+directly+from+Dashboard+and+Search+Template", deps:["m-search","m-dashboards"] },
          ]
        },

        { id:"ar-vendor", label:"Vendor Alert Rules", sub:"SR/DI-authored · plugin-bundled", c:C.detect,
          desc:"Default rules shipped by Guardsix (authored by SR + DI teams, attached to plugins, bundled in patch/ISO). Browse: Knowledge Base » Alert Rules » Vendor. Disabled by default; users must 'use' them. Patch updates touch ONLY the vendor original — 'used' child copies remain as-is (drift risk to assess each release).",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278582/Alert+rules+and+Incidents+in+Logpoint",
          children:[
            { id:"arv-api", label:"Alertrule HTTP API client", sub:"JWT · fetch-all script · MITRE file", desc:"Internal API client for fetching all vendor rules with details from a Logpoint machine: JWT token generation guide, downloadable client script, MITRE information file.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/6009192469/Vendor+Alertrule+Details" },
            { id:"arv-top-rules", label:"Top Detection Rules", sub:"Rule corpus analysis", desc:"Analysis of the most important detection rules — basis for the generalized analysis-type taxonomy in the Engineering Assessment.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/6115885148" },
            { id:"arv-security", label:"Rule config security audit", sub:"Semgrep findings 2023", desc:"Security vulnerability identification (semgrep) on the alertrule-configuration codebase — input for risk assessment.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278054" },
          ]
        },

        { id:"ar-config", label:"Rule configuration features", sub:"10 features · each a test surface", c:C.detect,
          desc:"Every configurable behaviour of an AlertRule. Each one maps to explicit test cases in the 'Major Test cases' checklist — use this sub-tree to scope release test plans.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278582/Alert+rules+and+Incidents+in+Logpoint",
          children:[
            { id:"arf-livesearch", label:"Livesearch binding", sub:"Per-user · object-permission scoped", desc:"Each rule drives a Premerger livesearch. For shared rules, a livesearch must populate PER shared user according to their object permissions — verify config per user.", deps:["premerger","sf-obj-perm"] },
            { id:"arf-conditions", label:"Trigger conditions", sub:"Threshold on search results", desc:"Conditions evaluated against livesearch results; when met, an Incident fires." },
            { id:"arf-repo-time", label:"Repo / timerange selector", sub:"UI dropdown", desc:"Rule's repo scope and timerange changeable from a dropdown — incidents trigger per selected repos.", deps:["f-repo"] },
            { id:"arf-flush", label:"Flush on trigger", sub:"Log used once per incident", desc:"With flush-on-trigger enabled, a single log can contribute to firing only ONE incident from a rule — prevents re-counting." },
            { id:"arf-throttle", label:"Alert throttling", sub:"Suppress x min per field-value set", desc:"Incidents subdued for x minutes for the same set of values of a chosen field. Uses Fields definitions.", deps:["f-fields"] },
            { id:"arf-jinja", label:"Jinja incident template", sub:"Incident data rendering", desc:"Incident data rendered per the rule's Jinja template + the logs responsible. Template errors = malformed incidents; verify rendering each release." },
            { id:"arf-mitre", label:"MITRE tagging", sub:"Taxonomy metadata", desc:"Rules carry MITRE ATT&CK technique tags consumed by dashboards and the vendor-rule API's MITRE info file." },
            { id:"arf-privacy", label:"Data privacy (four-eyes)", sub:"Approval workflow", desc:"With data privacy enabled, rule create/update requires a four-eyes approval before results are visible.", deps:["f-data-privacy"] },
            { id:"arf-visibility", label:"Incident visibility control", sub:"Who sees fired incidents", desc:"Controls visibility of incidents fired by a rule — distinct from rule-edit RBAC." },
            { id:"arf-rbac", label:"RBAC sharing semantics", sub:"Parent↔child sync · 3 permission tiers", c:C.detect,
              desc:"The most intricate rule behaviour: shared rules maintain parent/child document relationships with bidirectional update rules. Edit-permission users can edit/activate/deactivate the ORIGINAL and its notifications; read-only users cannot edit; full-permission users can delete and re-share. All sharees see the rule's incidents AND incident data. Ownership is transferable. 'Used' vendor rules are themselves shareable.",
              children:[
                { id:"arf-rbac-sync", label:"Parent↔child doc sync", sub:"Bidirectional update", desc:"When a sharee with edit perms updates the shared doc, all child & parent docs update; when the owner updates the parent, children update. Sync bugs here are high-severity regressions." },
                { id:"arf-rbac-transfer", label:"Ownership transfer", sub:"User → user", desc:"Rule ownership transferable between users — livesearches, notifications and incident visibility must follow the new owner." },
              ]
            },
          ]
        },

        { id:"ar-detection-types", label:"Detection analysis taxonomy", sub:"2026 Engineering Assessment · 15 categories", c:C.detect,
          desc:"Engineering assessment generalizing all analysis types rules need (basis for next-gen alerting architecture; Flink identified as strong for CEP/event-time/stateful streams). Hard problems flagged: high-cardinality state explosion, multi-match CEP memory, rule optimization, operational debugging, backpressure under bursty load. Target: any rule runs on any underlying engine behind one UX; rules as Sigma/Detection-as-Code; full lifecycle (draft→simulation→review→production→tuning→retire).",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/6116606003/Engineering+Assessment+for+Alerting",
          children:[
            { id:"dt-kv", label:"Simple key-value matching", sub:"Bounded + unbounded", desc:"[key=value] within x minutes. The baseline detection type — current Lucene-query rules." },
            { id:"dt-agg", label:"Aggregation predicates", sub:"count · distinct_count · avg · max", desc:"e.g. category=authentication | chart distinct_count(username) > 5 within 1m. Note: high-cardinality aggregation (password spray: COUNT DISTINCT user GROUP BY src_ip) requires HLL/sketch state, not exact sets — concrete engine requirement." },
            { id:"dt-seq", label:"Sequence / CEP", sub:"Staged predicates · until/negation/strict", desc:"Ordered predicate stages keyed by entity within a window (EQL-style). Stages support until, negation, strict combinations; includes absence-of-event via timer-driven primitives (Flink CEP).", deps:["analyzer-be"] },
            { id:"dt-baseline", label:"Baseline-based (UEBA)", sub:"Per-entity dynamic thresholds", desc:"Dynamic per-entity thresholds incl. peer-group comparison, not just self-baseline. Maps to Anomaly Detection Engine.", deps:["ueba-be"] },
            { id:"dt-aiml", label:"AI/ML zero-day detection", sub:"Isolation forest · vector sim · GNN · LLM", desc:"ML-based single-event anomaly detection for zero-days. Refer 'AI Detection Algorithms 2026'." },
            { id:"dt-newterms", label:"New-terms / first-seen", sub:"Set-membership vs persisted seen-set", desc:"e.g. first K8s exec, first cross-account AssumeRole. Structurally different from baselines: set membership against a persisted seen-set, different state shape." },
            { id:"dt-absence", label:"Absence-of-event", sub:"Deadline timers · EDR-silent", desc:"'Expected event did not arrive in window' (EDR silent, ingest gap). Needs timer-fired primitives, not event-fired — Flink CEP capability." },
            { id:"dt-fingerprint", label:"Stateful fingerprint match", sub:"Session token theft · TTL state", desc:"'Remember attribute at first sight, alert on divergence' — same session/refresh-token from different UA/ASN/JA4/device, impossible travel in one session. Per-entity state with TTL; different shape from sequences." },
            { id:"dt-crossstream", label:"Cross-stream correlation", sub:"Multi-schema · per-host joins", desc:"e.g. ransomware: process + file + service events on one host within minutes. Different schemas correlated per-host across event types — doesn't fit stage sequences." },
            { id:"dt-spectral", label:"Statistical / spectral", sub:"Beaconing · CV · FFT", desc:"Periodicity detection (beaconing via coefficient of variation, FFT). Distinct state/compute profile — warrants its own engine category." },
            { id:"dt-meta", label:"Attack Discovery (meta-detection)", sub:"Rules against rule-firings", desc:"Higher-order detections on the OUTPUT of other detections: risk scoring, alert correlation, NL summaries to cut alert noise. Rules-against-rule-firings, not events-against-rules." },
            { id:"dt-pipeline", label:"Recommended eval pipeline", sub:"filter → enrich → analyze → SOAR → correlate", desc:"Performance order: (1) filter stream maximally, (2) enrich (joins, GeoIP), (3) run analysis, (4) fire alert → SOAR, (5) correlation engine on top aggregates alerts → Incident.", deps:["soar"] },
          ]
        },
      ]
    },

    // ── ALERT ENGINE (service) ──────────────────────────────────────────────
    { id:"ae-engine", label:"Alert Engine (service)", sub:"alert_engine · evaluation core", c:C.detect,
      desc:"Polls Premerger for livesearch results of each active rule, evaluates conditions, generates Incidents into MongoDB and forwards to Alert Dispatcher. Detects rule-config changes via alert_id rotation. High-level architecture: interacts with Premerger, MongoDB, Alert Dispatcher socket, and (since 7.6.0) Redis Stream for 3rd-party incidents.",
      url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5359337811/Alert+Engine+A+Technical+Documentation",
      deps:["premerger","mongodb","ar-module"],
      children:[
        { id:"ae-interval", label:"Search interval & frequency", sub:"Derived from query time range", desc:"A rule is analysed every search_interval minutes. Premerger runs a SINGLE shared livesearch when a dashboard widget and a rule effectively query the same thing — dedup with permission implications. Widget default interval calculated from query time range.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5285150793/Search+interval+Alerting+frequency", deps:["premerger"] },
        { id:"ae-incident-handler", label:"Incident Handler (Redis Stream)", sub:"3rd-party incidents · since 7.6.0", c:C.detect,
          desc:"Design Approach 1 (implemented 7.6.0): a Redis Stream is the sink for third-party services to create incidents OUTSIDE the Premerger path. Muninn (NDR) and Windows Defender publish via the documented API contract; the Incident Handler thread in Alert Engine consumes and persists them so they appear in the normal Incident UI.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4908220417/Incidents+from+Third-Party+Logsources+Munnin",
          deps:["redis-ndr","ndr"],
          children:[
            { id:"ae-api-contract", label:"Incident API contract", sub:"Redis Stream schema · Muninn/Defender", desc:"Documented schema for 3rd-party incident creation: payload fields, severity mapping, dedup expectations. The contract page is the source of truth for integration testing.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4993384539/Incident+API+Contract+Muninn+Windows+Defender" },
            { id:"ae-3p-minutes", label:"Integration decisions", sub:"DI + WebApp + SR meeting minutes", desc:"Cross-team decisions on 3rd-party incident integration (Jan 2025) — useful context for why Design Approach 1 was chosen.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4920737822" },
          ]
        },
        { id:"ae-known-issues", label:"Known issues & regressions", sub:"Risk register input", desc:"Post-7.8.0 field report: 'Alerts not firing' (8com). Cross-reference when scoping regression suites for any release touching Premerger, livesearch lifecycle or alert_id rotation.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/6199214177" },
        { id:"ae-cloud", label:"Cloud Streaming engine path", sub:"Cloud Analytics mode · simple queries", desc:"In Cloud Analytics mode, simple-query rules process in the Cloud Streaming engine instead of Premerger — requires Cloud Analytics SaaS setup to test. Dual-path = dual test matrix.", deps:["saas"] },
      ]
    },

    // ── ALERT DISPATCHER / NOTIFICATIONS ───────────────────────────────────
    { id:"ad-dispatcher", label:"Alert Dispatcher & Notifications", sub:"alert_dispatcher · 6 channels", c:C.detect,
      desc:"Receives fired incidents and dispatches notifications. Channel configs documented per-scenario (Email, HTTP, Syslog, SMS). Bulk update of incident notifications is a covered test case. All channels store credentials (SSH keys, HTTP tokens, SMTP login, SNMP strings).",
      url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799278584/Alert+Notification+Configuration",
      deps:["ae-engine","credentials"],
      children:[
        { id:"nt-email",  label:"Email (SMTP)", sub:"Jinja body · SMTP login", desc:"SMTP notification with Jinja-templated body. SMTP server credentials stored. Custom Postfix relay for Microsoft Graph API + OAuth in Postfix designed in WebApp folder.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5545787395" },
        { id:"nt-http",   label:"HTTP webhook", sub:"Tokens · custom payloads", desc:"HTTP notification with token auth and templated payloads." },
        { id:"nt-syslog", label:"Syslog", sub:"Forward incident as syslog", desc:"Incident forwarded as syslog message to external SIEM/collector." },
        { id:"nt-sms", label:"SMS via SMPP", sub:"TON/NPI configurable · long-message support", c:C.detect,
          desc:"SMPP-based SMS notification. TON/NPI values configurable for source and destination addresses.",
          url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799276636/SMPP+support+to+send+alert+notification+via+SMS",
          children:[
            { id:"nt-sms-long", label:"Long messages (SMPP)", sub:"TLV vs PDU segmentation", desc:"Two modes for >160-char messages: TLV (message_payload) vs segmented PDUs via SMSC. Design doc covers both.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799277780" },
          ]
        },
        { id:"nt-ssh",    label:"SSH", sub:"Key-based remote command", desc:"SSH notification action with stored keys." },
        { id:"nt-snmp",   label:"SNMP trap", sub:"Community strings", desc:"SNMP trap notification using stored community strings/user credentials." },
        { id:"nt-mdr",    label:"MDR integration", sub:"Webserver + Config Updater + Alert Engine", desc:"MDR feature is an enhancement over Alert/Notifications/Incidents — spans three repositories: Webserver, Config Updater, Alert Engine. Historical but explains current notification extensibility.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799285261/Technical+Document+on+MDR" },
      ]
    },

    // ── INCIDENTS (output side) ─────────────────────────────────────────────
    { id:"inc-module", label:"Incidents (output)", sub:"alert_incidents · UI · APIs", c:C.detect,
      desc:"The output side of alerting. Incidents persist in 'alert_incidents', surface in the Investigation » Incident UI, feed SecOps dashboards, and are accessible via internal REST APIs.",
      url:ALERT_FOLDER,
      deps:["f-incident","mongodb"],
      children:[
        { id:"inc-paths", label:"Incident creation paths", sub:"3 routes", desc:"(1) Alert Engine fires on rule condition; (2) direct creation from Dashboard & Search Template ('Add Search to'); (3) 3rd-party via Redis Stream (Muninn, Windows Defender).", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799273456", deps:["ae-incident-handler"] },
        { id:"inc-apis", label:"User Alert REST APIs", sub:"OpenAPI/Swagger · machine-internal only", desc:"'External' REST APIs for alerts/incidents documented as OpenAPI contract — but only requestable INTERNALLY within the Logpoint machine. Important boundary for integration design and pen-test scoping.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799277740/User+Alert+REST+APIs" },
        { id:"inc-secops", label:"SecOps summarization", sub:"By status · by severity", desc:"Technical methodology for incident data summarization powering SecOps dashboard graphs (incidents by status / by severity).", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799277885", deps:["m-dashboards"] },
        { id:"inc-monitoring", label:"Monitoring from Report & Search", sub:"Incident telemetry queries", desc:"Enhancement enabling users to monitor incidents (and alerts) from Report and Search modules — incident metadata becomes searchable.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/4799273379", deps:["m-search","m-reports"] },
      ]
    },
  ]
};

// ════════════════════════════════════════════════════════════════════════════
// BACKEND + INFRA + PRODUCT BRANCHES
// ════════════════════════════════════════════════════════════════════════════
const TREE = {
  id:"siem", label:"Guardsix SIEM", sub:"Core platform", c:C.siem,
  desc:"Central platform for collecting, normalising, correlating and analysing security event data. webserver + MongoDB are universal dependencies; Redis carries transient cross-service state.",
  url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5088346224",
  children:[

    WEBAPP,

    ALERTS_DOMAIN,

    // ── BACKEND PIPELINE ───────────────────────────────────────────────────
    { id:"backend", label:"Backend Pipeline", sub:"Collection → Norm → Enrich → Store", c:C.ingest,
      desc:"The data-plane services. Collection (collectors/fetchers) → NormFront/Normalizer → Enrichment → Store Handler → FileKeeper.", url:DEP_URL,
      children:[
        { id:"collection-be", label:"Collection services", sub:"13 collector/fetcher services", c:C.ingest,
          desc:"syslog_collector, snmptrapd_listener, filesystem_collector, sflow_collector, ftp_collector/fetcher, scp_fetcher, wmi_fetcher, snmp_fetcher, sdee_fetcher, snare_collector, batch_processor, store_handler.", url:DEP_URL, deps:["f-processing-policies","f-devices"],
          children:[
            { id:"svc-syslog", label:"syslog_collector", sub:"Service", desc:"Syslog UDP/TCP listener. Now configurable through LogSource UI. Feeds Syslog Forwarder sink." },
            { id:"svc-batch",  label:"batch_processor", sub:"Service", desc:"Batches SCP/FTP fetched files for normalisation." },
            { id:"svc-store-handler", label:"store_handler", sub:"Service", desc:"Routes enriched events to the correct FileKeeper per Routing Policy.", deps:["f-routing-policy","filekeeper-be"] },
          ]
        },
        { id:"norm-be", label:"Normalisation services", sub:"norm_front · normalizer_ · labeling", c:C.ingest,
          desc:"norm_front load-balances the normalizer_ pool; norm_lookup resolves field lookups; labeling attaches semantic labels powering Label Packages.", url:DEP_URL, deps:["f-norm-packages"] },
        { id:"enrich-be", label:"Enrichment services", sub:"enrichment_service · populator · sync", c:C.ingest,
          desc:"enrichment_service applies policies; enrich_db_populater fills SQLite enrichment.db; enrich_sync_service keeps it synced; csvenrichmentsource + ldapenrichmentsource + threat_intelligence handle source types.", url:DEP_URL, deps:["f-enrichment-sources"] },
      ]
    },

    // ── STORAGE ────────────────────────────────────────────────────────────
    { id:"storage-be", label:"Storage & Search Engine", sub:"Lucene · per-repo services", c:C.store,
      desc:"file_keeper_ + indexsearcher_ per repo. Merger fans out; Premerger caches live searches; file_responder_ reads raw logs.", url:DEP_URL,
      children:[
        { id:"filekeeper-be", label:"FileKeeper", sub:"file_keeper_ · raw JSON + Redis LLR", desc:"Stores raw event JSON per repo. Publishes 'Last log received' timestamp per device to Redis (consumed by Webserver for traffic-light). Midnight compression job caches state in Redis. Agent license colTs in Redis DB index 2.", deps:["redis","f-routing-policy"] },
        { id:"indexsearcher-be", label:"IndexSearcher", sub:"indexsearcher_ · Lucene", desc:"Lucene index per repo. Serves Merger/Premerger/Analyzer. Heap auto-tuned.", deps:["filekeeper-be"] },
        { id:"merger-be", label:"Merger", sub:"Fan-out + aggregate", desc:"Serves Search, Report, UEBA Dashboard anomalies list. Distributes to all IndexSearchers.", deps:["indexsearcher-be"] },
        { id:"premerger", label:"Premerger", sub:"Live search cache", desc:"Continuous live queries for Dashboard widgets + Alert rules. Search interval calculated from query time range. Future: Redis pub/sub channels for SSE real-time UI updates.", deps:["merger-be","redis"] },
        { id:"repos-be", label:"Repos", sub:"optimize_repo_listing", desc:"Storage partitions; sizes recalculated to MongoDB by optimize_repo_listing.", deps:["mongodb"] },
      ]
    },

    // ── ANALYTICS ──────────────────────────────────────────────────────────
    { id:"analytics-be", label:"Analytics Engine", sub:"Alerting · Correlation · UEBA · TI", c:C.detect,
      desc:"alert_engine + alert_dispatcher, analyzer (Java correlation), threat_intelligence, UEBA service family.", url:DEP_URL,
      children:[
        { id:"alert-engine-be", label:"Alert Engine", sub:"alert_engine · + Incident Handler", desc:"Evaluates rules via Premerger. Contains an Incident Handler thread that consumes NDR (Muninn) incidents published to Redis by the Muninn Compiled Normalizer — direct NDR→SIEM incident path.", deps:["premerger","redis","f-alert-rules"],
          children:[
            { id:"sf-incident-handler", label:"Incident Handler thread", sub:"Redis consumer", desc:"Thread inside Alert Engine consuming NDR detections from Redis channel published by Muninn compiled normalizer (3rd-party service integration)." },
          ]
        },
        { id:"alert-dispatcher-be", label:"Alert Dispatcher", sub:"alert_dispatcher", desc:"Dispatches incidents to notification channels: SSH (keys), HTTP (tokens), SMTP (login), SNMP (community strings) — all credentialed per credentials inventory. Jinja2 templating.", deps:["alert-engine-be","credentials"] },
        { id:"analyzer-be", label:"Analyzer", sub:"Java correlation · joins", desc:"Serves Search, Dashboard, Alert, Report, UEBA Dashboard for join/followed-by queries." },
        { id:"ueba-be", label:"UEBA service family", sub:"entity_store · sync · streamer · validators", desc:"entity_store + entity_sync (wraps its own Redis instance for main↔DLP entity sharing), streamer/stream_forwarder, ueba_validation_aggregator, lp_ueba_output_consumer. On-prem CustomerConfig API holds MongoDB connection string.", deps:["redis","mongodb","credentials"] },
        { id:"ti-be", label:"threat_intelligence", sub:"IOC/TI table service", desc:"Serves enrichment + dashboards from TI table fed by STIX/TAXII enrichment source." },
      ]
    },

    // ── INFRASTRUCTURE ─────────────────────────────────────────────────────
    { id:"infra", label:"Infrastructure", sub:"webserver · MongoDB · Redis · authz", c:C.infra,
      desc:"Universal dependencies. Storage tech split: MongoDB (long-term structured), Redis (fast transient), SQLite (enrichment.db), LevelDB, Kafka (LPC buffering).", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5289738893/Redis+DB+-+Usages",
      children:[
        { id:"webserver", label:"Webserver", sub:"HTTPS entry · permission checks · Redis sessions", desc:"Single HTTPS entry point. Persists user sessions in Redis. Consumes Last-Log-Received timestamps from Redis (published by FileKeeper). Central permission check in permission_manager.py per request. Saves config to MongoDB → triggers config regeneration.", deps:["mongodb","redis","site-permissions"] },
        { id:"mongodb", label:"MongoDB", sub:"Long-term structured store", desc:"Service configs, user groups, alert rules, incidents, enrichment configs, dynamic lists/tables, repo metadata, anomalies. Used when data must be kept + queried. localhost-only." },
        { id:"redis", label:"Redis", sub:"In-memory transient store · 7 use cases", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5289738893/Redis+DB+-+Usages",
          desc:"In-RAM store at /etc/service/redis. Used when ultra-fast transient data passing is needed; never for long-term storage.",
          children:[
            { id:"redis-sessions", label:"Web sessions", sub:"Webserver", desc:"Persistence of web users' session information." },
            { id:"redis-llr", label:"Last Log Received", sub:"FileKeeper → Webserver", desc:"Per-device last-log timestamps published by FileKeeper, consumed by Webserver — powers log-source traffic-light monitoring.", deps:["sf-traffic-light"] },
            { id:"redis-ndr", label:"NDR incident channel", sub:"Muninn normalizer → Alert Engine", desc:"NDR detections published by Muninn Compiled Normalizer; consumed by Incident Handler thread in Alert Engine.", deps:["ndr"] },
            { id:"redis-compression", label:"Midnight compression cache", sub:"FileKeeper", desc:"FileKeeper's midnight compression job caches compression-related state." },
            { id:"redis-ueba", label:"UEBA entity sharing", sub:"Entity Sync wraps own Redis", desc:"Shares UEBA entities between main and DLP entity stores. Separate Redis instance wrapped inside UEBA Entity Sync service." },
            { id:"redis-license", label:"Agent license counting", sub:"DB index 2 · EXPIREAT", desc:"FileKeeper stores agent collection timestamps (colTs); LogTsPopulatorThread syncs in-memory map to Redis; counter.py counts unique active agents as license nodes; monthly auto-cleanup via EXPIREAT.", deps:["sf-lic-consumption"] },
            { id:"redis-sse", label:"SSE pub/sub (future)", sub:"Webserver + Premerger · WIP", desc:"Planned: Redis pub/sub channels for Server-Sent Events to push real-time UI updates." },
          ]
        },
        { id:"site-permissions", label:"Site Permissions (authz)", sub:"permission.json · levels 1/2/3", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5334040690/Site+permissions+-+What+can+a+User+do",
          desc:"Feature-level access control. Each module ships permission.json mapping URL→required level (1 read, 2 write, 3 delete). LP Administrator bypasses all. Empty/missing entries = open access. Checked in permission_manager.py on every request. Combined with object permissions = full authorization.",
          children:[
            { id:"sp-config", label:"Configurations perms", sub:"Devices · LPC · ProcPolicy · Enrichment · DLP · Export", desc:"r/w/d levels controllable for: Devices+DeviceGroups+LogCollectionPolicy+Parsers, Distributed Collectors, Processing Policy, EnrichmentSource, Distributed LogPoints, Export Management." },
            { id:"sp-kb", label:"Knowledge Base perms", sub:"NormPkgs · Lists · Fields · Macros · LabelPkgs", desc:"r/w/d levels for Normalization Packages, Lists, Fields, Macros, Label Packages." },
            { id:"sp-soar", label:"SOAR perms", sub:"Integrations · API Key · Licensing · Cases", desc:"r/w/d for SOAR Integrations, API Key, Licensing, My Products, Lists Management, Import, System Health, Manage Cases." },
            { id:"sp-analytics", label:"Analytics perms (7.8.0.1)", sub:"Dashboards · Alerts · Incidents · Reports · Search", desc:"Planned 7.8.0.1: r/w/d for Dashboards, AlertRules, Incidents, Reports, ReportTemplates, SearchTemplates, Search (read), SearchPackages, SearchViews." },
          ]
        },
        { id:"credentials", label:"Credential storage", sub:"14 modules · Keystore/Vault migration", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5489426459/List+of+Modules+Storing+or+Using+Credentials",
          desc:"Modules storing credentials: User Account, User Preferences, Auth Plugins (LDAP/SAML/OAuth/LPSaaS/Radius), FTP/ODBC fetchers, UEBA Mongo string, Report password, Data Privacy encryption keys, SNMP strings, Enrichment SSL certs, Open Door, SMTP, Alert Notification SSH/HTTP, LDAP bind, Export Mgmt SSL. Migration to Vault + parameterized Keystore in progress.",
          children:[
            { id:"cred-keystore", label:"Keystore tooling", sub:"Keystore API · parameterization", desc:"Keystore API + tool usage docs; keystore parameterization; key storage tools comparison done in WebApp folder.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5299536118/Keystore+API" },
            { id:"cred-vault", label:"Vault migration", sub:"Source → Vault integration", desc:"Migrating credentials from existing storage into HashiCorp-style Vault and integrating services with it.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5272764501" },
          ]
        },
        { id:"config-gen", label:"Config generator", sub:"MongoDB → JSON configs", desc:"Regenerates /opt/immune/etc/config/<svc>/config.json. Config regeneration process queue enhanced (page 5263753255).", deps:["mongodb"] },
        { id:"security-hardening", label:"Security hardening", sub:"XSS · SSL · Nginx", desc:"XSS validation (nh3 implementation), malicious HTML tag filtering, SSL enhancement for inter-Logpoint HTTPS, Nginx upgrade proposal, Snyk vulnerability resolution — all WebApp-team folder workstreams." },
      ]
    },

    // ── DISTRIBUTED ────────────────────────────────────────────────────────
    { id:"distributed", label:"Distributed SIEM", sub:"DLP · LPC · Forwarders", c:C.dist,
      desc:"Search Head federates across DLP Data Nodes. LPC buffers via Kafka. HTTPS in LP-LP communication; comms revamp + 780 DLP upgrade issues documented.", url:"https://logpoint.atlassian.net/wiki/spaces/LP/pages/5226365232",
      children:[
        { id:"dlp-be", label:"Data Nodes (DLP)", sub:"ha_collector_ · ha_forwarder_ · SSL certs", desc:"Per-node FileKeeper+IndexSearcher. DLP certificate issues (LP-70198) and 780 upgrade issues documented in WebApp folder. UEBA entities shared with main via Redis-backed Entity Sync.", deps:["filekeeper-be","redis-ueba"] },
        { id:"lpc-be", label:"LPC", sub:"lpc_kafka_producer · forwarder · collector_", desc:"Kafka/Docker-buffered collection node. Managed via Distributed Collectors feature.", deps:["f-dist-collectors"] },
        { id:"forwarders-be", label:"Forwarders", sub:"syslog_forwarder · raw_syslog_forwarder · Log Forwarder", desc:"Syslog Forwarder (TCP/UDP, >5KB logs) + raw variant + new v7.10 SIEM→SIEM normalised Log Forwarder.", deps:["f-raw-syslog-fwd"] },
      ]
    },

    // ── FLEET ──────────────────────────────────────────────────────────────
    { id:"fleet", label:"Guardsix Fleet", sub:"Director · LPSM · MSSP", c:C.fleet,
      desc:"Multi-SIEM orchestration: Fleet API (DSL CodeGen → Java + RST), Fabric (OpenVPN/Zookeeper/HDFS/Kerberos), per-SIEM Config Service, Fleet Console, LPSM.", url:"https://logpoint.atlassian.net/wiki/spaces/~620a040d07f51e006941db6f/pages/6071189542",
      children:[
        { id:"fleet-api", label:"Fleet API", sub:"ConfigAPI · MonitoringAPI · DirectorAPI", desc:"DSL compiles to Java handler classes + RST docs, packaged as WAR for Tomcat (DirectorAPI deep-dive page 5476515848). orderID-based request tracking via Zookeeper." },
        { id:"fleet-fabric", label:"Fabric", sub:"OpenVPN · Zookeeper · HDFS · Kerberos", desc:"OpenVPN tunnels (needs Open Door enabled on SIEM), Zookeeper request/response nodes, HDFS bulk storage, Kerberos mutual auth.", deps:["f-open-door"] },
        { id:"lpsm", label:"LPSM", sub:"Federated search · Pool Manager · SOAR MT", desc:"Cross-tenant search + incident queue. pool_info.json via cron poolReader. SOAR v3.0 multi-tenancy (50 tenants) hosted here. scheduled_lpsm_backup.", deps:["merger-be","soar"] },
      ]
    },

    // ── SOAR ───────────────────────────────────────────────────────────────
    { id:"soar", label:"Guardsix SOAR", sub:"Microservices · playbooks", c:C.soar,
      desc:"soar-engine, soar-api-service, soar-notifications (pushes real-time alerts to SIEM UI via webserver API), soar-audit, soar-mssp, soar-debug-playground. v3.0 MSSP multi-tenant from LPSM.", url:"https://logpoint.atlassian.net/wiki/spaces/PMU/pages/5881397289",
      deps:["alert-engine-be","webserver","m-playbook"],
      children:[
        { id:"soar-engine-svc", label:"soar-engine", sub:"Playbook runtime", desc:"Executes block graphs with retries and branching. LDAPS support requires shared JVM TrustStore across api-service/engine/debug-playground." },
        { id:"soar-playbook-builder", label:"Playbook builder", sub:"Visual · versioned · N8N-style redesign", desc:"20–40+ block visual builder. Redesign: explicit I/O mapping, inline block testing, auto Start/End, sub-playbook extraction." },
        { id:"soar-cases-mod", label:"Case management", sub:"SLA · multi-tenant v3.0", desc:"SOC case workflow. v3.0: isolated per-customer tenants (≤50) governed from LPSM with RBAC + data isolation." },
      ]
    },

    // ── NDR ────────────────────────────────────────────────────────────────
    { id:"ndr", label:"Guardsix NDR", sub:"AI Detect · AI Prevent · Central", c:C.ndr,
      desc:"Muninn-based NDR. Sensors (DPI + ML) → Central (Birdseye, Chain of Events). Detections flow into SIEM via Muninn Compiled Normalizer → Redis → Alert Engine Incident Handler.", url:"https://logpoint.atlassian.net/wiki/spaces/NDR/pages/5521276932",
      deps:["redis-ndr","alert-engine-be"],
      children:[
        { id:"ndr-sensor", label:"NDR Sensor", sub:"AI Detect · AI Prevent · DPI", desc:"Packet capture at TAP/SPAN; ML behavioural detection (AI Detect); autonomous blocking (AI Prevent); N-S + E-W coverage." },
        { id:"ndr-central", label:"NDR Central", sub:"Birdseye · Chain of Events · sensor mgmt", desc:"Fleet aggregation for SOC: asset map, MITRE-mapped attack chains, sensor lifecycle." },
        { id:"ndr-collector", label:"Muninn Compiled Normalizer", sub:"NDR → Redis → SIEM", desc:"SIEM-side component publishing NDR incidents to Redis channel consumed by the Alert Engine Incident Handler thread.", deps:["redis-ndr"] },
      ]
    },

    // ── AGENT ──────────────────────────────────────────────────────────────
    { id:"agent", label:"Guardsix Agent", sub:"Endpoint collection · AMC", c:C.agent,
      desc:"Cross-platform endpoint agent (Win/Linux/macOS). mTLS, policy-driven, buffered. AMC embedded in SIEM + Fleet. Agent-based license counting via Redis DB index 2.", url:"https://logpoint.atlassian.net/wiki/spaces/PMU/pages/5285871738",
      deps:["redis-license","collection-be"],
      children:[
        { id:"agent-runtime", label:"Agent runtime", sub:"ETW · file collector · policy · mTLS", desc:"Windows ETW + Linux syslog/journal/file collection. YAML/JSON policy scoped per OS. mTLS with cert lifecycle via AMC." },
        { id:"amc", label:"Agent Mgmt Console", sub:"Enrollment · health · bulk policy", desc:"Token enrollment with auto-approve, heartbeat health dashboard, versioned bulk policy assignment. Tenant-scoped module in Fleet Console." },
      ]
    },

    // ── SaaS ───────────────────────────────────────────────────────────────
    { id:"saas", label:"Guardsix SaaS", sub:"Cloud SIEM · Cirrus · Tunnel", c:C.saas,
      desc:"Cloud-hosted SIEM, feature-equivalent. Cloud Connector → Cirrus Ingest. AWS ECS Tunnel Server relays browser↔SIEM via SiemAgent Tunnel Client.", url:"https://logpoint.atlassian.net/wiki/spaces/UX/pages/5584552307",
      deps:["f-open-door"],
      children:[
        { id:"cloud-connector", label:"Cloud Connector", sub:"Cirrus Ingest bridge", desc:"On-prem appliance forwarding normalised logs to SaaS via Cirrus Ingest pipeline." },
        { id:"tunnel", label:"Tunnel Server/Client", sub:"AWS ECS · SiemAgent", desc:"ECS Tunnel Server correlates browser sessions; SiemAgent subprocess relays HTTP from each SIEM." },
      ]
    },

    // ── HEALTHCARE ─────────────────────────────────────────────────────────
    { id:"aahc", label:"Governance for Healthcare", sub:"AAHC · patient audit", c:C.aahc,
      desc:"Patient audit reporting on EHR access via SIEM search + labels. React 18/AntD 5 frontend GA-ready. IDP SSO.", url:"https://logpoint.atlassian.net/wiki/spaces/WA/pages/5524586624",
      deps:["m-search","m-reports","m-auth"],
      children:[
        { id:"aahc-reports", label:"Patient audit reports", sub:"EHR access · journal logs", desc:"Who accessed which patient record, when, from which medical system — built on normalised SIEM labels." },
        { id:"aahc-platform", label:"Platform", sub:"React 18 · AntD 5 · IDP SSO", desc:"Redesigned admin frontend (GA-ready prototype, PROD-253). OAuth/OIDC hospital SSO." },
      ]
    },
  ]
};

// ════════════════════════════════════════════════════════════════════════════
// AUGMENT — deep design-doc layers injected under existing nodes.
// Every node links its source page. Built from the full 183-page inventory
// of the WebApp team folder (5165678922) + module subfolders.
// ════════════════════════════════════════════════════════════════════════════
const WIKI = "https://logpoint.atlassian.net/wiki/spaces/LP/pages/";

const AUGMENT = {

  // ── 1. SEARCH ──────────────────────────────────────────────────────────────
  "m-search": [
    { id:"srch-internals", label:"Search engine internals", sub:"Design docs · performance",
      desc:"Backend search mechanics owned by the WebApp + DI teams. Each child is a dedicated design doc covering a performance or correctness concern of the Merger/Premerger/IndexSearcher query path.",
      url: WIKI + "4799280190",
      children:[
        { id:"srch-merger-req", label:"Merger requests", sub:"Webserver↔Merger protocol", desc:"How the webserver constructs, batches and tracks search requests to Merger — part of the webserver framework onboarding series.", url: WIKI + "4799280190" },
        { id:"srch-topk", label:"Top-k aggregation trade-off", sub:"Performance vs accuracy", desc:"Analysis of accuracy loss vs speed for top-k aggregation queries across distributed IndexSearchers — relevant when validating chart correctness in tests.", url: WIKI + "4799271290" },
        { id:"srch-distinct", label:"Distinct cardinality computation", sub:"distinct_count() internals", desc:"How distinct-count queries are computed across repos/nodes; ties into the HLL/sketch-state requirement flagged in the Alerting assessment.", url: WIKI + "4799272053" },
        { id:"srch-packets", label:"Packet optimization", sub:"Interleaving · fewer intermediates", desc:"Two design docs: packet interleaving, and reducing intermediate packets transferred between search services — throughput levers for large result sets.", url: WIKI + "4799272733" },
        { id:"srch-delayed", label:"Delayed log handling", sub:"3 docs · Premerger perspective", desc:"How logs arriving late (collector lag, forwarder buffering) are handled so live searches and alert rules don't miss them: general design, Premerger-specific handling, and alternative approaches.", url: WIKI + "4799271680",
          children:[
            { id:"srch-delayed-pm", label:"Premerger handling", sub:"Late-log windows", desc:"Delayed log handling in PreMerger — windowing logic so live searches still see late events.", url: WIKI + "4799274452" },
            { id:"srch-delayed-alt", label:"Alternative approaches", sub:"Pre_merger options", desc:"Alternative ways to handle delayed logs from pre_merger's perspective — options analysis.", url: WIKI + "4799275777" },
          ]
        },
        { id:"srch-shared-ls", label:"Widget & rule livesearch sharing", sub:"Single livesearch dedup", desc:"WIP doc on how searches for widgets & alert rules are deduplicated into shared livesearches — the permission-sensitive dedup also flagged in alerting test cases.", url: WIKI + "4891705564", deps:["arf-livesearch"] },
      ]
    },
  ],

  // ── 2. SEARCH TEMPLATES ───────────────────────────────────────────────────
  "m-search-templates": [
    { id:"stpl-sharing", label:"Template sharing design", sub:"v6.12.0 design doc", desc:"Technical design for Search Template sharing — RBAC semantics, per-user copies and share-popup behaviour (mirrors alert-rule sharing patterns).", url: WIKI + "4799274215", deps:["f-user-groups"] },
    { id:"stpl-savedsearch", label:"Applications/SavedSearch", sub:"Backend application", desc:"The SavedSearch webserver application backing templates and saved searches — code location and behaviour.", url: WIKI + "4799274719" },
  ],

  // ── 3. REPORTS ────────────────────────────────────────────────────────────
  "m-reports": [
    { id:"rpt-pdf-backend", label:"Backend-only PDF generation", sub:"PDF injection removal", desc:"Assessment to remove PDF injection in Search Report by generating the report purely in the backend — security-driven architecture change; key for pen-test scope.", url: WIKI + "4966678646" },
    { id:"rpt-password", label:"Password-protected reports", sub:"Credential inventory item", desc:"Report access passwords are one of the 14 credential-storing features — include in credential-handling test scope.", url: WIKI + "5489426459", deps:["credentials"] },
    { id:"rpt-incident-mon", label:"Incident monitoring in reports", sub:"Incidents as report data", desc:"Reports can monitor incidents & alerts — incident metadata exposed to the report engine.", url: WIKI + "4799273379", deps:["inc-monitoring"] },
  ],

  // ── 4. DASHBOARDS ─────────────────────────────────────────────────────────
  "m-dashboards": [
    { id:"dash-widgets", label:"Dashboard & Widgets internals", sub:"Core design doc", desc:"Foundational design of dashboards and widget data flow (widget → Premerger livesearch → render).", url: WIKI + "4799280787", deps:["premerger"] },
    { id:"dash-tabs-sharing", label:"DashboardTabs sharing", sub:"Technical design", desc:"Technical design for sharing dashboard tabs — parent/child copy semantics analogous to alert-rule RBAC sharing.", url: WIKI + "4854251521", deps:["f-user-groups"] },
    { id:"dash-framework", label:"Alert/Dashboard framework improvements", sub:"Shared framework", desc:"Improvement proposal for the framework shared by Alerts and Dashboards (livesearch lifecycle, config handling).", url: WIKI + "4799271924" },
    { id:"dash-secops", label:"SecOps dashboard", sub:"Requirements + data summarization", desc:"SecOps dashboard requirements (meeting minutes) and the incident-data summarization methodology powering its by-status/by-severity graphs.", url: WIKI + "4799278913", deps:["inc-secops"] },
  ],

  // ── 5. LOGSOURCES ─────────────────────────────────────────────────────────
  "f-logsource": [
    { id:"ls-techdesign", label:"Log Source technical design", sub:"Core design + FE/BE contract", desc:"Technical Design for Log Source plus the explicit frontend↔backend contract — the authoritative pair for how the new Logsource flow works.", url: WIKI + "4799277224",
      children:[
        { id:"ls-contract", label:"FE↔BE contract", sub:"API shapes per source type", desc:"Log Source contract between frontend & backend — payload shapes per source type.", url: WIKI + "4799277198" },
        { id:"ls-fileupload", label:"File upload challenges", sub:"Design constraints", desc:"Challenges and approach for file upload in Log Source (cert files, key files).", url: WIKI + "4799280088" },
        { id:"ls-overview", label:"Logsources overview", sub:"Concept page", desc:"Top-level Logsources concept documentation.", url: WIKI + "4799281311" },
      ]
    },
    { id:"ls-llr", label:"Last Log Received (LLR)", sub:"FileKeeper → Redis → Webserver", desc:"LLR design: FileKeeper publishes per-device last-log timestamps to Redis; webserver consumes them — the data feed behind Traffic Light monitoring.", url: WIKI + "4799277455", deps:["redis-llr"] },
    { id:"ls-syslog-via-ls", label:"Syslog Collector via LogSource", sub:"Migration of legacy flow", desc:"Design for configuring the Syslog Collector through the LogSource UI instead of legacy Devices.", url: WIKI + "5657493505" },
    { id:"ls-dup-norm-issue", label:"Duplicate norm-policy issue", sub:"LP-68898 · field issue", desc:"Logsource breakage caused by duplicate Normalization policy — documented failure mode for regression suites.", url: WIKI + "5466456321", deps:["f-norm-policies"] },
    { id:"ls-marketplace", label:"Downloadable device configs", sub:"Content Marketplace", desc:"Content Marketplace design: downloadable configuration packages for Devices/log sources.", url: WIKI + "4799276373" },
  ],
  "sf-traffic-light": [
    { id:"tl-design", label:"Design: Traffic Lights", sub:"Main design doc", desc:"The Traffic Light feature design — states, thresholds and LLR consumption.", url: WIKI + "4850516054" },
    { id:"tl-approach", label:"Solution approach + minutes", sub:"Jan 2024 decisions", desc:"Solution-approach doc (7 Jan 2024) and meeting minutes recording why the Redis LLR approach was chosen.", url: WIKI + "4906090513" },
  ],
  "sf-ftp-ls": [
    { id:"ftp-design", label:"FTP Fetcher design", sub:"Design + FE assessment", desc:"FTP Fetcher in LogSource design document plus frontend assessment.", url: WIKI + "4799281313" },
    { id:"ftp-troubleshoot", label:"Troubleshooting + minutes", sub:"Support runbook", desc:"Troubleshoot FTP Fetcher runbook and the FTP Fetcher LogSource meeting minutes.", url: WIKI + "4799281513" },
  ],
  "sf-default-log-accept": [
    { id:"dla-design", label:"Design + qualification", sub:"2 docs", desc:"'Default Logsource to accept Syslogs' design document and its qualification (test evidence) page.", url: WIKI + "4799281564" },
  ],

  // ── 6. DEVICES ────────────────────────────────────────────────────────────
  "f-devices": [
    { id:"dev-node-meta", label:"Node metadata contracts", sub:"Team contracts", desc:"Cross-team contracts for node metadata information — what each service must report about nodes/devices (feeds licensing node counting).", url: WIKI + "4799280737", deps:["f-licenses"] },
  ],

  // ── 7. ALERT & INCIDENTS (already deep — add references node) ─────────────
  "ae-engine": [
    { id:"ae-realtime-refs", label:"Real-time alerting references", sub:"Research corpus", desc:"Reference collection for the real-time alerting re-architecture (Flink, CEP engines, competitor approaches) — companion to the Engineering Assessment.", url: WIKI + "6115917917" },
  ],

  // ── 8. LICENSE ────────────────────────────────────────────────────────────
  "f-licenses": [
    { id:"lic-node-model", label:"Node-count licensing model (v2)", sub:"Current licensing basis", desc:"The licensing model based on node count v2 — defines what counts as a node and how consumption is computed. Foundation for all license features.", url: WIKI + "4799308094",
      children:[
        { id:"lic-agent-counting", label:"Agent-based node counting", sub:"Design + func test + perf test", desc:"Agent-based license node counting: FileKeeper writes agent colTs to Redis DB index 2; counter.py counts unique agents; EXPIREAT monthly cleanup. Has dedicated functional-testing and FileKeeper performance-testing pages.", url: WIKI + "6075121708", deps:["redis-license"],
          children:[
            { id:"lic-agent-func", label:"Functional testing", sub:"Test evidence", desc:"Functional testing for agent-based license node counting.", url: WIKI + "6150520879" },
            { id:"lic-agent-perf", label:"Performance testing", sub:"FileKeeper impact", desc:"Performance testing of agent-based license counting inside FileKeeper.", url: WIKI + "6157795433" },
            { id:"lic-agent-options", label:"Node counting options", sub:"Options analysis", desc:"Guardsix Agents – node counting options considered before the Redis design was selected.", url: WIKI + "6032261140" },
          ]
        },
        { id:"lic-cloud-nodes", label:"Cloud nodes calculation", sub:"Webserver-side design", desc:"Design document for cloud node calculation in the webserver (SaaS deployments).", url: WIKI + "4799280739", deps:["saas"] },
      ]
    },
    { id:"lic-single-upload", label:"Single license upload (SIEM+SOAR)", sub:"Design doc", desc:"One upload provisions both SIEM and SOAR licenses — cross-product license flow.", url: WIKI + "4799280871", deps:["soar"] },
    { id:"lic-entitlement", label:"Entitlement Service", sub:"Design + service contract", desc:"License-aware feature access: Entitlement Service design document plus the WIP service contract — customers see entitlements, unlicensed features hidden.", url: WIKI + "5442109447",
      children:[
        { id:"lic-ent-contract", label:"Service contract [WIP]", sub:"API contract", desc:"Entitlement Service contract — API surface other services consume for license gating.", url: WIKI + "5460230171" },
      ]
    },
  ],

  // ── 9. AUTHENTICATION / LOGIN ─────────────────────────────────────────────
  "m-auth": [
    { id:"auth-layer", label:"Authentication Layer design", sub:"Core architecture", desc:"The webserver authentication layer design — strategy plugin model that all 7 auth methods implement.", url: WIKI + "4799275844" },
    { id:"auth-jwt", label:"JWT authentication family", sub:"3 designs + POC", desc:"JWT-based auth designs: client-signed JWT in webserver, IDP-signed JWT, the original POC, and the alternative auth mechanism for the private user_access_key endpoint.", url: WIKI + "5091950615",
      children:[
        { id:"auth-jwt-client", label:"Client-signed JWT", sub:"Webserver design", desc:"Client-signed JWT-based authentication in the webserver — used by API clients incl. the vendor alertrule fetch script.", url: WIKI + "5091950615", deps:["arv-api"] },
        { id:"auth-jwt-idp", label:"IDP-signed JWT", sub:"Federation design", desc:"IDP-signed JWT-based authentication in the webserver — external identity provider tokens.", url: WIKI + "4799277706" },
        { id:"auth-private-api", label:"Private API alternative auth", sub:"user_access_key endpoint", desc:"Alternative authentication mechanism to access the private/user_access_key API endpoint.", url: WIKI + "4799276429" },
      ]
    },
    { id:"auth-scopes", label:"API scopes [WIP]", sub:"Scope-based authz for APIs", desc:"Scopes in Logpoint APIs — granular API authorization model under design.", url: WIKI + "5091492163", deps:["site-permissions"] },
    { id:"auth-internal", label:"Internal-comms authorization", sub:"Service-to-service", desc:"LogPoint Authorization on internal communication — how services authenticate to each other.", url: WIKI + "4799267574" },
    { id:"auth-soar", label:"SOAR ↔ SIEM authentication", sub:"Cross-product SSO", desc:"How SOAR authenticates with SIEM — shared session/token design.", url: WIKI + "4799278308", deps:["soar"] },
    { id:"auth-troubleshooting", label:"Troubleshooting runbooks", sub:"5 per-strategy guides", desc:"Per-strategy support runbooks: LDAP, SAML, Radius (incl. Radius server setup/credentials), OAuth, DUO 2FA — direct onboarding material for support-facing engineers.", url: WIKI + "4838588666",
      children:[
        { id:"auth-ts-ldap",   label:"LDAP",   sub:"Runbook", desc:"Troubleshooting LDAP Authentication.", url: WIKI + "4838588666" },
        { id:"auth-ts-saml",   label:"SAML",   sub:"Runbook", desc:"Troubleshooting SAML Authentication.", url: WIKI + "4799281530" },
        { id:"auth-ts-radius", label:"Radius", sub:"Runbook + server setup", desc:"Troubleshooting Radius Authentication + Radius server set-up / credentials page.", url: WIKI + "5290885194" },
        { id:"auth-ts-oauth",  label:"OAuth",  sub:"Runbook", desc:"Troubleshooting OAuth Authentication.", url: WIKI + "5380669521" },
        { id:"auth-ts-duo",    label:"DUO",    sub:"Runbook", desc:"Troubleshooting DUO 2-factor Authentication.", url: WIKI + "5339447551" },
      ]
    },
    { id:"auth-plugin-creds", label:"Auth plugin credentials", sub:"Credential storage map", desc:"Where each authentication plugin stores its credentials (LDAP/SAML/OAuth/LPSaaS/Radius).", url: WIKI + "4799280555", deps:["credentials"] },
  ],

  // ── 10. INFRASTRUCTURE ────────────────────────────────────────────────────
  "webserver": [
    { id:"ws-framework", label:"Webserver framework series", sub:"11-page onboarding gold", desc:"The complete webserver framework documentation series — THE onboarding path for new WebApp engineers: Framework, Installation, Database & configuration, Routing, Controllers, Validation & permissions, Debugging, CSRF protection, Sessions, Requests, Responses (+ Merger requests).", url: WIKI + "4799280145",
      children:[
        { id:"ws-fw-routing",  label:"Routing · Controllers", sub:"Request lifecycle", desc:"How URLs route to controllers; controllers→services refactoring doc also exists (4799274327).", url: WIKI + "4799280151" },
        { id:"ws-fw-validate", label:"Validation & permissions", sub:"Per-request checks", desc:"Input validation + the central permission check (permission_manager.py) in the request pipeline.", url: WIKI + "4799280155", deps:["site-permissions"] },
        { id:"ws-fw-csrf",     label:"CSRF · Sessions", sub:"Security primitives", desc:"CSRF protection and Redis-backed session pages of the framework series.", url: WIKI + "4799280159", deps:["redis-sessions"] },
        { id:"ws-fw-debug",    label:"Debugging · Req/Resp", sub:"Dev workflow", desc:"Debugging guide plus Requests/Responses object documentation.", url: WIKI + "4799280157" },
      ]
    },
    { id:"ws-fastapi", label:"New Fast-APIs", sub:"Implementation details", desc:"Migration of webserver endpoints to FastAPI — implementation details for the new API layer.", url: WIKI + "5705007210" },
    { id:"ws-websocket", label:"WebSocket duplex", sub:"UI↔backend push", desc:"WebSocket design for duplex communication between UI & backend (predecessor to the Redis SSE plan).", url: WIKI + "4799276818", deps:["redis-sse"] },
    { id:"ws-xss", label:"XSS validation framework", sub:"nh3 · request pipeline", desc:"XSS validation framework in the request pipeline; BeautifulSoup→nh3 migration; malicious HTML tag catalogue; FE assessment — full input-sanitization workstream.", url: WIKI + "5139562499" },
    { id:"ws-analytics", label:"Product analytics instrumentation", sub:"POC 2024", desc:"Instrumenting the webserver to capture events + deployment metadata for product analytics.", url: WIKI + "4799279258" },
  ],
  "infra": [
    { id:"infra-apis", label:"REST API program", sub:"Configurations API + per-module endpoints", desc:"RESTful API workstream: Configurations API design, Repo / List-Table / Alertrule (v1) / Alert-Notification API endpoints, Multiport configuration API, API improvement options, OpenAPI spec generation guide, endpoint optimization.", url: WIKI + "5196382620",
      children:[
        { id:"api-repo",    label:"Repo API", sub:"Endpoint doc", desc:"Repo API endpoint documentation.", url: WIKI + "5165678865" },
        { id:"api-listtab", label:"List/Table API", sub:"Endpoint doc", desc:"List/Table API endpoint documentation.", url: WIKI + "5151653942" },
        { id:"api-alertrule",label:"Alertrule APIs (v1)", sub:"3 endpoint docs", desc:"Alertrule API endpoint, Alertrule API v1 and Alertrules APIs pages.", url: WIKI + "5152899345", deps:["ar-module"] },
        { id:"api-multiport",label:"Multiport config API", sub:"Endpoint doc", desc:"Multiport configuration API documentation.", url: WIKI + "5365071898" },
        { id:"api-openapi", label:"OpenAPI spec generation", sub:"How-to", desc:"How to generate OpenAPI specs for webserver endpoints.", url: WIKI + "4799278586" },
      ]
    },
    { id:"infra-docker", label:"Containerization", sub:"Docker · base images", desc:"Dockerize Webserver/Nginx/MongoDB/Redis, Dockerize Redis, Python service base image, shared-objects analysis inside Docker images, Docker-based test running.", url: WIKI + "4799276712" },
    { id:"infra-vuln", label:"Vulnerability management", sub:"Snyk · CVE upgrades · Nginx", desc:"Snyk vulnerability resolution report + remaining issues, Python package CVE upgrade assessment, Nginx upgrade proposal — security posture inputs for risk assessment.", url: WIKI + "5396955603" },
    { id:"infra-mongo-tools", label:"MongoDB tooling", sub:"Migration tool · Compass · commands", desc:"MongoDB migration tool design + meeting minutes, Mongo Compass local setup, Mongo command reference.", url: WIKI + "4799278964", deps:["mongodb"] },
    { id:"infra-testing", label:"Test infrastructure", sub:"Unit pipeline · Jenkins · PTF", desc:"GitLab unit-test pipeline, Jenkins automation, PTF Python unit-test coverage, running tests on Logpoint machines and Docker, webserver unit test case catalogue.", url: WIKI + "5021892622" },
  ],

  // ── 11. DISTRIBUTED SIEM ──────────────────────────────────────────────────
  "dlp-be": [
    { id:"dlp-revamp", label:"DLP communication revamp", sub:"Architecture redesign", desc:"Distributed Logpoint Communication Revamp — redesign of Search-Head↔DLP comms (reliability + security).", url: WIKI + "5226365232" },
    { id:"dlp-https", label:"HTTPS / SSL in LP-LP", sub:"2 designs", desc:"HTTPS in LP-LP communication + enhancing SSL for inter-Logpoint HTTPS — TLS posture between nodes.", url: WIKI + "5332598864" },
    { id:"dlp-issues", label:"Field issues", sub:"Cert LP-70198 · 780 upgrade", desc:"DLP certificate issue report (LP-70198) and the 7.8.0 DLP upgrade issue+solution — known-failure catalogue for release risk assessment.", url: WIKI + "5719261480" },
  ],
  "lpc-be": [
    { id:"lpc-users", label:"LPC user administration", sub:"Design doc", desc:"Administrating users in LPC — how user management works on collector nodes.", url: WIKI + "4799273423" },
  ],
  "distributed": [
    { id:"dist-backup", label:"Backup & restore engineering", sub:"4 design docs", desc:"Logpoint Backup overview, incremental-backup enhancement design, daily checkpointing assessment, and old-logs-handling impact on backup systems — the backup engineering corpus.", url: WIKI + "4802281480",
      children:[
        { id:"bkp-incremental", label:"Incremental backup", sub:"Enhancement design", desc:"Enhancing LogPoint Backup/Restore using incremental backup.", url: WIKI + "4849369093", deps:["f-backup-restore"] },
        { id:"bkp-checkpoint", label:"Daily checkpointing", sub:"Assessment", desc:"Enhancing daily log backup checkpointing.", url: WIKI + "4802281490" },
      ]
    },
    { id:"dist-saas-sync", label:"On-prem → SaaS config sync", sub:"Cloud Analytics", desc:"Syncing config from on-prem LP to SaaS Analytics LP — hybrid deployment config flow.", url: WIKI + "4951801904", deps:["saas"] },
    { id:"dist-opendoor", label:"Open Door internal workflow", sub:"Support tunnel mechanics", desc:"Internal workflow when Open Door is enabled — VPN bring-up, LPC/DLP path activation.", url: WIKI + "5714379771", deps:["f-open-door"] },
  ],

  // Webapp UEBA module gets its LDAP-entity design
  "m-ueba-dash": [
    { id:"ueba-ldap-entity", label:"LDAP usergroup entity selection", sub:"Technical design", desc:"Technical design for LDAP-usergroup-based entity selection for UEBA — how UEBA entities are scoped from directory groups.", url: WIKI + "4799305381", deps:["f-auth-ldap"] },
  ],
};

// ════════════════════════════════════════════════════════════════════════════
// GRAPH INDEX
// ════════════════════════════════════════════════════════════════════════════
const NODE_MAP = {};
const PARENT = {};
(function index(node, parentId, depth) {
  NODE_MAP[node.id] = node;
  PARENT[node.id] = parentId;
  node._depth = depth;
  const aug = AUGMENT[node.id];
  if (aug && !node._augmented) {
    node.children = [...(node.children || []), ...aug];
    node._augmented = true;
  }
  (node.children || []).forEach(ch => index(ch, node.id, depth + 1));
})(TREE, null, 0);

const ALL_NODES = Object.values(NODE_MAP);

const DEP_EDGES = [];
ALL_NODES.forEach(n => (n.deps || []).forEach(d => {
  if (NODE_MAP[d]) DEP_EDGES.push({ fid: n.id, tid: d });
}));

function getColor(node) {
  if (node.c) return node.c;
  const p = NODE_MAP[PARENT[node.id]];
  return p ? getColor(p) : C.siem;
}

// Node box size per depth
function nodeSize(d) {
  if (d === 0) return { w: 200, h: 56 };
  if (d === 1) return { w: 215, h: 48 };
  if (d === 2) return { w: 200, h: 42 };
  if (d === 3) return { w: 188, h: 36 };
  if (d === 4) return { w: 176, h: 32 };
  return { w: 162, h: 28 };
}

// ════════════════════════════════════════════════════════════════════════════
// LEFT→RIGHT TIDY TREE LAYOUT (recomputed per expansion state)
// ════════════════════════════════════════════════════════════════════════════
const COL_X = [60, 340, 625, 895, 1150, 1390, 1615, 1825];
const ROW_GAP = 10;

function computeLayout(expandedSet) {
  const pos = {};
  let cursorY = 60;
  function walk(node) {
    const d = node._depth;
    const { h } = nodeSize(d);
    const kids = expandedSet.has(node.id) ? (node.children || []) : [];
    if (kids.length === 0) {
      pos[node.id] = { x: COL_X[Math.min(d, COL_X.length - 1)], y: cursorY };
      cursorY += h + ROW_GAP;
    } else {
      kids.forEach(walk);
      const first = pos[kids[0].id], last = pos[kids[kids.length - 1].id];
      const midY = (first.y + last.y + nodeSize(kids[kids.length - 1]._depth).h) / 2 - h / 2;
      pos[node.id] = { x: COL_X[Math.min(d, COL_X.length - 1)], y: midY };
    }
  }
  walk(TREE);
  return pos;
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function NodeBox({ node, x, y, isSelected, isExpanded, hasChildren, onPointerDown }) {
  const col = getColor(node);
  const d = node._depth;
  const { w, h } = nodeSize(d);
  const bg = isSelected ? col.b : d === 0 ? col.b : d === 1 ? col.b : d === 2 ? col.m : "#181822";
  const stroke = isSelected ? "#ffffff" : d <= 1 ? col.d : col.b;
  const tMain = d <= 1 ? col.l : isSelected ? col.l : d === 2 ? col.d : col.m;
  const tSub = d <= 1 ? col.m : isSelected ? col.m : col.b;
  const fs = d === 0 ? 14 : d === 1 ? 12.5 : d === 2 ? 11.5 : 10.5;
  const maxC = Math.floor(w / (fs * 0.58));
  const label = node.label.length > maxC ? node.label.slice(0, maxC - 1) + "…" : node.label;
  return (
    <g transform={`translate(${x},${y})`} onPointerDown={e => onPointerDown(e, node)}
      style={{ cursor: "pointer" }}>
      <rect width={w} height={h} rx={d <= 1 ? 10 : 7} fill={bg}
        stroke={stroke} strokeWidth={isSelected ? 2.2 : d <= 1 ? 1.2 : 0.7} />
      <text x={10} y={node.sub ? h / 2 - 4 : h / 2} fontSize={fs} fontWeight={600}
        fill={tMain} fontFamily="system-ui,sans-serif" dominantBaseline="middle">{label}</text>
      {node.sub && (
        <text x={10} y={h - 8} fontSize={8.5} fill={tSub}
          fontFamily="system-ui,sans-serif">{node.sub.substring(0, Math.floor(w / 5.4))}</text>
      )}
      {hasChildren && (
        <g transform={`translate(${w - 16},${h / 2})`}>
          <circle r={8} fill={isExpanded ? col.b : "#0c0c14"} stroke={col.m} strokeWidth={0.8} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={10}
            fill={isExpanded ? col.l : col.m} fontFamily="system-ui,sans-serif">
            {isExpanded ? "−" : "+"}
          </text>
        </g>
      )}
    </g>
  );
}

function edgePath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function Panel({ node, onClose }) {
  if (!node) return null;
  const col = getColor(node);
  const depNodes = (node.deps || []).map(id => NODE_MAP[id]).filter(Boolean);
  const usedBy = DEP_EDGES.filter(e => e.tid === node.id).map(e => NODE_MAP[e.fid]).filter(Boolean);
  const childCount = (node.children || []).length;
  const tiers = ["Platform", "Module / Product", "Feature / Sub-module", "SubFeature / Component", "Detail"];
  return (
    <div style={{ position:"absolute", bottom:18, right:18, width:"min(440px,92vw)",
      background:"rgba(5,5,12,0.97)", border:`1.5px solid ${col.b}`, borderRadius:14,
      padding:"20px 22px", boxShadow:`0 8px 48px ${col.b}55`, zIndex:300,
      backdropFilter:"blur(18px)", maxHeight:"70vh", overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:9, fontWeight:800, color:col.b, textTransform:"uppercase",
            letterSpacing:"0.14em", marginBottom:4 }}>{tiers[Math.min(node._depth, 4)]}</div>
          <div style={{ fontSize:18, fontWeight:700, color:col.l, lineHeight:1.25 }}>{node.label}</div>
          {node.sub && <div style={{ fontSize:10.5, color:"#666", marginTop:3,
            fontFamily:"Menlo,monospace" }}>{node.sub}</div>}
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"#555",
          cursor:"pointer", fontSize:22, padding:"0 2px", flexShrink:0 }}>×</button>
      </div>
      {node.desc && <p style={{ fontSize:13, color:"#ccc", marginTop:13, lineHeight:1.75,
        borderTop:`1px solid ${col.b}33`, paddingTop:13 }}>{node.desc}</p>}
      {depNodes.length > 0 && (
        <div style={{ marginTop:12 }}>
          <div style={{ fontSize:9, fontWeight:800, color:col.b, textTransform:"uppercase",
            letterSpacing:"0.12em", marginBottom:6 }}>Depends on</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {depNodes.map(dn => (
              <span key={dn.id} style={{ fontSize:10.5, padding:"2px 8px", borderRadius:4,
                border:`1px solid ${col.b}55`, color:col.m, background:`${col.b}22` }}>{dn.label}</span>
            ))}
          </div>
        </div>
      )}
      {usedBy.length > 0 && (
        <div style={{ marginTop:10 }}>
          <div style={{ fontSize:9, fontWeight:800, color:"#777", textTransform:"uppercase",
            letterSpacing:"0.12em", marginBottom:6 }}>Used by</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {usedBy.slice(0, 10).map(un => (
              <span key={un.id} style={{ fontSize:10.5, padding:"2px 8px", borderRadius:4,
                border:"1px solid #444", color:"#999", background:"#1a1a22" }}>{un.label}</span>
            ))}
            {usedBy.length > 10 && <span style={{ fontSize:10.5, color:"#555" }}>+{usedBy.length - 10} more</span>}
          </div>
        </div>
      )}
      {childCount > 0 && (
        <div style={{ marginTop:8, fontSize:10.5, color:"#444" }}>
          Click +/− on the node to expand / collapse its {childCount} child node{childCount > 1 ? "s" : ""}. Drag the node body to reposition.
        </div>
      )}
      {node.url && <a href={node.url} target="_blank" rel="noopener noreferrer"
        style={{ display:"inline-block", marginTop:12, fontSize:11, color:col.b,
          textDecoration:"none", borderBottom:`1px solid ${col.b}55` }}>View source →</a>}
    </div>
  );
}

const LEG = [
  ["Web Application", C.webapp.b], ["Backend pipeline", C.ingest.b],
  ["Storage/Search", C.store.b], ["Analytics", C.detect.b],
  ["Infrastructure", C.infra.b], ["Distributed", C.dist.b],
  ["Fleet/LPSM", C.fleet.b], ["SOAR", C.soar.b], ["NDR", C.ndr.b],
  ["Agent", C.agent.b], ["SaaS", C.saas.b], ["Healthcare", C.aahc.b],
];

// ════════════════════════════════════════════════════════════════════════════
// APP
// ════════════════════════════════════════════════════════════════════════════
const ZMN = 0.15, ZMX = 3.5;
const CLICK_TOLERANCE = 5;

export default function App() {
  const [expanded, setExpanded] = useState(() => new Set(["siem", "webapp"]));
  const [selected, setSelected] = useState(null);
  const [overrides, setOverrides] = useState({});   // id → {dx, dy} drag offsets
  const [zoom, setZoom] = useState(0.8);
  const [pan, setPan] = useState({ x: 40, y: 0 });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDeps, setShowDeps] = useState(true);

  const svgRef = useRef(null);
  // drag state: { mode: 'pan'|'node', id, startX, startY, origin:{...}, moved }
  const drag = useRef(null);

  // search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const lq = query.toLowerCase();
    setResults(ALL_NODES.filter(n =>
      n.label.toLowerCase().includes(lq) ||
      (n.sub || "").toLowerCase().includes(lq) ||
      (n.desc || "").toLowerCase().includes(lq)
    ).slice(0, 12));
  }, [query]);

  // visibility = all ancestors expanded
  const isVisible = useCallback((node) => {
    let pid = PARENT[node.id];
    while (pid) {
      if (!expanded.has(pid)) return false;
      pid = PARENT[pid];
    }
    return true;
  }, [expanded]);

  // layout (memo-light: recompute every render; tree is small)
  const basePos = computeLayout(expanded);
  const getPos = (id) => {
    const p = basePos[id];
    if (!p) return null;
    const o = overrides[id];
    return o ? { x: p.x + o.dx, y: p.y + o.dy } : p;
  };

  const visibleNodes = ALL_NODES.filter(n => isVisible(n) && basePos[n.id]);
  const visibleIds = new Set(visibleNodes.map(n => n.id));

  // ── click = expand/collapse + select; drag = move node ────────────────────
  const toggleNode = useCallback((node) => {
    setSelected(prev => prev?.id === node.id ? node : node); // always select on click
    const hasKids = !!(node.children && node.children.length);
    if (!hasKids) return;
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        const rm = (id) => { next.delete(id); (NODE_MAP[id].children || []).forEach(c => rm(c.id)); };
        rm(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }, []);

  const onNodePointerDown = useCallback((e, node) => {
    e.stopPropagation();
    e.preventDefault();
    drag.current = {
      mode: "node", id: node.id, node,
      startX: e.clientX, startY: e.clientY,
      orig: overrides[node.id] || { dx: 0, dy: 0 },
      moved: false,
    };
  }, [overrides]);

  const onBgPointerDown = useCallback((e) => {
    drag.current = {
      mode: "pan",
      startX: e.clientX, startY: e.clientY,
      orig: { ...pan }, moved: false,
    };
  }, [pan]);

  const onPointerMove = useCallback((e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > CLICK_TOLERANCE) d.moved = true;
    if (d.mode === "pan") {
      setPan({ x: d.orig.x + dx, y: d.orig.y + dy });
    } else if (d.mode === "node" && d.moved) {
      setOverrides(prev => ({
        ...prev,
        [d.id]: { dx: d.orig.dx + dx / zoom, dy: d.orig.dy + dy / zoom },
      }));
    }
  }, [zoom]);

  const onPointerUp = useCallback(() => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.mode === "node" && !d.moved) {
      // It was a click, not a drag → toggle + select
      toggleNode(d.node);
    }
  }, [toggleNode]);

  // search jump: expand ancestors, select, center
  const jumpTo = useCallback((node) => {
    setExpanded(prev => {
      const next = new Set(prev);
      let pid = PARENT[node.id];
      while (pid) { next.add(pid); pid = PARENT[pid]; }
      if (node.children && node.children.length) next.add(node.id);
      return next;
    });
    setSelected(node);
    setQuery(""); setResults([]);
    // center after layout recompute on next frame
    requestAnimationFrame(() => {
      const p = computeLayout((() => {
        const s = new Set(expanded);
        let pid = PARENT[node.id];
        while (pid) { s.add(pid); pid = PARENT[pid]; }
        if (node.children && node.children.length) s.add(node.id);
        return s;
      })())[node.id];
      if (!p) return;
      const el = svgRef.current;
      const W = el?.clientWidth || 1200, H = el?.clientHeight || 800;
      setPan({ x: W / 2 - (p.x + nodeSize(node._depth).w / 2) * zoom,
               y: H / 2 - (p.y + nodeSize(node._depth).h / 2) * zoom });
    });
  }, [expanded, zoom]);

  // wheel zoom
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const fn = e => {
      e.preventDefault();
      setZoom(z => Math.min(ZMX, Math.max(ZMN, z * (e.deltaY < 0 ? 1.1 : 0.91))));
    };
    el.addEventListener("wheel", fn, { passive: false });
    return () => el.removeEventListener("wheel", fn);
  }, []);

  const zoomBy = f => setZoom(z => Math.min(ZMX, Math.max(ZMN, z * f)));
  const resetView = () => {
    setZoom(0.8); setPan({ x: 40, y: 0 });
    setExpanded(new Set(["siem", "webapp"]));
    setOverrides({}); setSelected(null);
  };
  const expandAll = () => {
    const s = new Set();
    ALL_NODES.forEach(n => { if (n.children && n.children.length) s.add(n.id); });
    setExpanded(s);
  };

  // tree edges among visible
  const treeEdges = [];
  visibleNodes.forEach(n => {
    const pid = PARENT[n.id];
    if (pid && visibleIds.has(pid)) treeEdges.push({ fid: pid, tid: n.id });
  });
  const depEdgesVisible = showDeps
    ? DEP_EDGES.filter(e => visibleIds.has(e.fid) && visibleIds.has(e.tid))
    : [];

  return (
    <div style={{ height:"100vh", background:"#07070f", position:"relative",
      overflow:"hidden", fontFamily:"system-ui,sans-serif", userSelect:"none" }}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
      <svg ref={svgRef} width="100%" height="100%" onPointerDown={onBgPointerDown}
        style={{ display:"block", cursor: drag.current?.mode === "pan" ? "grabbing" : "default" }}>
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ffffff05" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)"/>

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* Dependency edges — dashed */}
          {depEdgesVisible.map((e, i) => {
            const f = getPos(e.fid), t = getPos(e.tid);
            if (!f || !t) return null;
            const fn = NODE_MAP[e.fid], tn = NODE_MAP[e.tid];
            const fs = nodeSize(fn._depth), ts = nodeSize(tn._depth);
            const col = getColor(fn);
            return (
              <path key={`d${i}`}
                d={edgePath(f.x + fs.w, f.y + fs.h / 2, t.x + ts.w, t.y + ts.h / 2 + 4)}
                fill="none" stroke={col.b} strokeWidth={0.7} strokeOpacity={0.28}
                strokeDasharray="5 4"/>
            );
          })}

          {/* Tree edges — solid bezier LR */}
          {treeEdges.map((e, i) => {
            const f = getPos(e.fid), t = getPos(e.tid);
            if (!f || !t) return null;
            const fn = NODE_MAP[e.fid], tn = NODE_MAP[e.tid];
            const fs = nodeSize(fn._depth), ts = nodeSize(tn._depth);
            const col = getColor(tn);
            return (
              <path key={`t${i}`}
                d={edgePath(f.x + fs.w, f.y + fs.h / 2, t.x, t.y + ts.h / 2)}
                fill="none" stroke={col.b}
                strokeWidth={fn._depth === 0 ? 2 : fn._depth === 1 ? 1.4 : 0.9}
                strokeOpacity={fn._depth <= 1 ? 0.55 : 0.4}/>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const p = getPos(node.id);
            return (
              <NodeBox key={node.id} node={node} x={p.x} y={p.y}
                isSelected={selected?.id === node.id}
                isExpanded={expanded.has(node.id)}
                hasChildren={!!(node.children && node.children.length)}
                onPointerDown={onNodePointerDown}/>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div style={{ position:"absolute", top:12, left:12, display:"flex", flexWrap:"wrap",
        gap:"4px 13px", maxWidth:430, pointerEvents:"none" }}>
        {LEG.map(([l, bc]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:9, height:9, borderRadius:2, background:bc }}/>
            <span style={{ fontSize:10, color:"#666" }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:"absolute", top:12, left:"50%", transform:"translateX(-50%)",
        width:"min(320px,55vw)", zIndex:50 }}>
        <input value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search modules, features, sub-features…"
          style={{ width:"100%", padding:"8px 14px", borderRadius:10,
            border:"1.5px solid #2a2a3a", background:"#0e0e18", color:"#eee",
            fontSize:12.5, outline:"none" }}/>
        {results.length > 0 && query && (
          <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0,
            background:"#0e0e18", border:"1px solid #2a2a3a", borderRadius:10,
            overflow:"hidden", boxShadow:"0 4px 24px #000b", maxHeight:"50vh", overflowY:"auto" }}>
            {results.map(n => {
              const col = getColor(n);
              return (
                <div key={n.id} onClick={() => jumpTo(n)}
                  style={{ padding:"8px 13px", cursor:"pointer", fontSize:12,
                    color:"#ccc", borderBottom:"1px solid #1a1a24" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1a1a2e"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ color:col.b, marginRight:8 }}>
                    {["⬡","◈","●","◆","▪"][Math.min(n._depth, 4)]}
                  </span>
                  {n.label}
                  {n.sub && <span style={{ fontSize:9.5, color:"#444", marginLeft:8 }}>
                    {n.sub.split("·")[0].trim().substring(0, 26)}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div style={{ position:"absolute", top:12, right:12, display:"flex",
        flexDirection:"column", gap:6 }}>
        {[["+", () => zoomBy(1.2), "Zoom in"],
          ["−", () => zoomBy(0.83), "Zoom out"],
          ["⊞", expandAll, "Expand all"],
          ["⊙", resetView, "Reset view"]].map(([l, fn, t]) => (
          <button key={t} onClick={fn} title={t}
            style={{ width:34, height:34, border:"1px solid #2a2a3a", borderRadius:8,
              background:"#0e0e18", color:"#bbb", cursor:"pointer", fontSize:15,
              display:"flex", alignItems:"center", justifyContent:"center" }}>{l}</button>
        ))}
        <button onClick={() => setShowDeps(v => !v)}
          title={showDeps ? "Hide dependency edges" : "Show dependency edges"}
          style={{ width:34, height:34, border:`1px solid ${showDeps ? "#888" : "#2a2a3a"}`,
            borderRadius:8, background: showDeps ? "#222236" : "#0e0e18",
            color: showDeps ? "#eee" : "#555", cursor:"pointer", fontSize:13,
            display:"flex", alignItems:"center", justifyContent:"center" }}>⇢</button>
      </div>

      {/* Counter + hint */}
      <div style={{ position:"absolute", bottom:14, left:14, fontSize:10.5,
        color:"#2a2a3a", pointerEvents:"none" }}>
        {visibleNodes.length} / {ALL_NODES.length} nodes
      </div>
      {!selected && (
        <div style={{ position:"absolute", bottom:14, left:"50%",
          transform:"translateX(-50%)", fontSize:11, color:"#2d2d40",
          pointerEvents:"none", whiteSpace:"nowrap" }}>
          Click node = select + expand/collapse · Drag node = reposition · Drag background = pan · Scroll = zoom
        </div>
      )}

      <Panel node={selected} onClose={() => setSelected(null)}/>
    </div>
  );
}