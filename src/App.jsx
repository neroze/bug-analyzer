import { useState, useMemo } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, ComposedChart, Line, Area, CartesianGrid, ReferenceLine } from "recharts";

const PC = { Top:"#ef4444", Major:"#f97316", Minor:"#eab308", None:"#64748b" };
const SC = { Closed:"#22c55e", Open:"#3b82f6", "In Progress":"#a855f7", "In Review":"#f59e0b" };
const PO = { Top:0, Major:1, Minor:2, None:3 };
const TABS = ["Overview","Bug Table","Version Trends","Customer Impact"];
const RC  = ["#38bdf8","#818cf8","#34d399","#f59e0b","#f87171","#a78bfa"];

const DATA = [
  {key:"LP-66914",s:"Upgrade: Debian Package installation stuck on grub-pc ",status:"Closed",p:"Top",zd:37,v:"7.6.0.0",re:"No",cxc:29,cx:["Nationalt Genom Center", "CGI Suomi Oy", "Staatliche Feuerwehrschule Geretsried", "Unicredit Leasing (Austria) GmbH", "guardsix DK A/S"]},
  {key:"LP-68473",s:" systemd-tmpfiles-clean.timer clears the Logpoint Services files in /tmp directory.",status:"Closed",p:"Top",zd:20,v:"7.6.1.0",re:"No",cxc:19,cx:["G?teborgs Universitet IT Enheten", "Orange Cyberdefense Sweden AB", "Bornholms Regionskommune", "Thakral One Nepal Pvt. Ltd.", "SysArmy"]},
  {key:"LP-75952",s:"Local Privilege Escalation in Seconds via Copy Fail Vulnerability (CVE-2026-31431)",status:"Closed",p:"Top",zd:14,v:"7.8.2.0",re:"No",cxc:8,cx:["Advania Sverige AB", "Bornholms Regionskommune", "Konstfack", "Nordlo Evolve AB", "Danmarks Tekniske Universitet"]},
  {key:"LP-70108",s:"DLP connection breaks and UI is inaccessible due to missing SSL certificate.",status:"Closed",p:"Top",zd:11,v:"7.8.0.2",re:"No",cxc:11,cx:["Qvantel Finland", "CGI Deutschland B.V. & Co. KG", "RAM-IT", "Governikus GmbH & Co. KG", "Bechtle GmbH IT-Systemhaus Dortmund"]},
  {key:"LP-69567",s:"Director Settings Inaccessible when Logpoint license is expired",status:"Closed",p:"Top",zd:10,v:"7.7.1.0",re:"No",cxc:10,cx:["SachsenEnergie AG", "Bechtle Austria GmbH", "OHB Digital Services GmbH", "KMD A/S", "IaaS365"]},
  {key:"LP-66944",s:"Logpoint server using ZFS and booting in UEFI mode fail to boot and stuck in BIOS menu a",status:"Closed",p:"Top",zd:8,v:"7.5.0.5",re:"No",cxc:8,cx:["LATECOERE", "K?benhavns Kommune", "Waagner-Biro Austria Stage GmbH", "CGI Sverige AB", "Liverpool John Moores University"]},
  {key:"LP-68950",s:"ZMQ sockets are not threadsafe but a socket is shared between two threads on ha_collecto",status:"Closed",p:"Minor",zd:8,v:"7.7.1.0",re:"No",cxc:8,cx:["Netia SA", "UNIVERSITE MOHAMMED VI POLYTECHNIQUE - UM6P", "Gemeente Het Hogeland", "IT-Total AB", "CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-66300",s:"UEBA: Outgoing logs from streamer service drops to zero",status:"Closed",p:"Top",zd:7,v:"7.5.0",re:"No",cxc:6,cx:["JOANNEUM RESEARCH Forschungsgesellschaft MbH", "Telia Cygate AB", "Staatliche Feuerwehrschule Geretsried", "RAM-System GmbH", "Bechtle"]},
  {key:"LP-66655",s:"Logs and Indexes exist but are not visible on search.",status:"Closed",p:"Top",zd:7,v:"7.4.0.2",re:"No",cxc:7,cx:["Nowega GmbH", "Loomis AB", "Telia Cygate Finland", "Strata Service Solutions Ltd", "Bechtle GmbH IT-Systemhaus Dortmund"]},
  {key:"LP-73497",s:"IPv4 Forwarding Disabled in 780 Flex Patch Causing SIEM-to-UEBA Log Forwarding Failure",status:"Closed",p:"Major",zd:7,v:"7.8.2.0",re:"No",cxc:6,cx:["Bechtle Austria GmbH", "Dhaka Stock Exchange", "Ober?sterreichische Versicherung AG", "LAUFENBERG GMBH", "2WAY B.V - Netherland"]},
  {key:"LP-68375",s:"Log discarded by indexsearchers when a raw log contains a segment of size > 32KiB",status:"Closed",p:"Major",zd:6,v:"7.0.0",re:"No",cxc:5,cx:["NPO Torino S.r.l", "AGENCE SPATIALE EUROPEENNE - ESA", "NG Security (UK) Ltd.", "IT-Total AB", "Cinia Oy"]},
  {key:"LP-69362",s:"Log Search Timeout Encountered in v7.7.1",status:"Closed",p:"Major",zd:6,v:"7.7.0.3",re:"No",cxc:5,cx:["Region J?nk?pings L?n", "Renk Group", "SVD B?romanagement GmbH", "Siemens", "NG Security (UK) Ltd."]},
  {key:"LP-73311",s:"System Notifications not starting the collection layer services after sufficient storage",status:"Closed",p:"Top",zd:6,v:"7.2.0",re:"No",cxc:5,cx:["Qvantel Finland", "Ringk?bing-Skjern Kommune", "Nordlo Evolve AB", "SysArmy", "guardsix DK A/S"]},
  {key:"LP-66935",s:"Too many open files on lookup indexsearcher.",status:"Closed",p:"Major",zd:5,v:"7.5.0.5",re:"No",cxc:5,cx:["SAGEMCOM", "Bornholms Regionskommune", "ASSIA", "V?stra G?taland Regionen (VGR)", "Thakral One Nepal Pvt. Ltd."]},
  {key:"LP-68170",s:"Handle future dates in the last log received feature under devices.",status:"Closed",p:"Major",zd:5,v:"7.7.1.0",re:"No",cxc:5,cx:["Tallinna lennujaam AS", "CGI Sverige AB", "dacoso GmbH - Unterf?hring", "Aller Media A/S", "guardsix DK A/S"]},
  {key:"LP-68519",s:"Update failed while configuring  grub on multipath disk",status:"Closed",p:"Top",zd:5,v:"7.7.0.3",re:"No",cxc:5,cx:["CGI Sverige AB", "Enk?pings Kommun", "Ringk?bing-Skjern Kommune", "K?benhavns Kommune", "EDNON"]},
  {key:"LP-68659",s:"XSS filtering logic flags valid queries",status:"Closed",p:"Major",zd:5,v:"7.7.0.3",re:"No",cxc:5,cx:["Telia Lithuania", "SachsenEnergie AG", "Netia SA", "Thakral One Nepal Pvt. Ltd.", "Deloitte Espana"]},
  {key:"LP-68871",s:"Few Plugins Failed to Install After Upgrade to v7.7.0",status:"Closed",p:"Top",zd:5,v:"7.7.0.3",re:"No",cxc:4,cx:["guardsix DK A/S", "Telia Cygate Finland", "Cinia Oy", "LATECOERE"]},
  {key:"LP-69752",s:"Error while importing license after disconnecting from fabric",status:"Closed",p:"Major",zd:5,v:"7.5.0.4",re:"No",cxc:5,cx:["APIXIT", "Cyllene", "FOXiT GmbH", "STORMSHIELD", "Cinia Oy"]},
  {key:"LP-69820",s:"Swap usage is full even if physical memory is available",status:"Closed",p:"Major",zd:5,v:"7.6.0.3",re:"No",cxc:3,cx:["Telia Cygate Finland", "Ringk?bing-Skjern Kommune", "KMD A/S"]},
  {key:"LP-70312",s:"Logpoint 7.8.2:  su command cannot be run by li-admin user",status:"Closed",p:"Major",zd:5,v:"7.8.2.0",re:"No",cxc:5,cx:["Jupiter Technology Corporation", "Telia Cygate Finland", "KMD A/S", "Varde Kommune", "Loomis AB"]},
  {key:"LP-73329",s:"Patch uploads and installs are not consistent in LP 7.8",status:"Closed",p:"Major",zd:5,v:"7.8.1.0",re:"No",cxc:5,cx:["H?llefors Kommun", "State Cyber Protection Center (SCPC)", "Rigspolitiet 2", "Exchange Bank", "KMD A/S"]},
  {key:"LP-75801",s:"Issue observed in alert_engine where alert queries have \"TABLE\" ",status:"Closed",p:"Major",zd:5,v:"7.8.0",re:"No",cxc:3,cx:["guardsix DK A/S", "Renk Group", "dacoso GmbH - Unterf?hring"]},
  {key:"LP-76043",s:"Hyper-V based systems inaccessible after 7.9.0 upgrade",status:"In Progress",p:"Major",zd:5,v:"7.9.0.4",re:"No",cxc:4,cx:["guardsix DK A/S", "P/F Formula", "SysArmy", "FOXiT GmbH"]},
  {key:"LP-66528",s:"Error in merger service logs when \"|\" is not used with aggregation query",status:"Closed",p:"Major",zd:4,v:"7.6.0.1",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-68927",s:"Upgrade to 7.7.0 fails when /boot partition is in LVM.",status:"Closed",p:"Top",zd:4,v:"7.7.0",re:"No",cxc:4,cx:["OneWorld Infotech Bangladesh", "Nordlo Evolve AB", "Thakral One Nepal Pvt. Ltd.", "Konstfack"]},
  {key:"LP-69422",s:"Premerger service failing to start up",status:"Closed",p:"Top",zd:4,v:"7.7.0.3",re:"No",cxc:3,cx:["Renk Group", "Oduma Solutions Ltd", "ODIGO"]},
  {key:"LP-69479",s:"Unable to query cloned vendor alert rules from the AlertRules API",status:"Closed",p:"Major",zd:4,v:"7.7.1.0",re:"No",cxc:4,cx:["Capgemini America USA", "Heyra Cyber ApS", "SpaceNet AG", "METCloud (Managed Enterprise Technologies Limited T/A )"]},
  {key:"LP-69577",s:"null mtu value in mongodb breaks the remote connection",status:"Closed",p:"Major",zd:4,v:"7.7.1.0",re:"No",cxc:3,cx:["K?benhavns Kommune", "CDISCOUNT", "CGI IT UK Limited"]},
  {key:"LP-70584",s:"Autotuner service creating too many normalizer services resulting in memory exhaustion",status:"Closed",p:"Major",zd:4,v:"7.7.0.3",re:"No",cxc:3,cx:["AGENCE SPATIALE EUROPEENNE - ESA", "Netia SA", "Qvantel Finland"]},
  {key:"LP-73301",s:"Logpoint v7.8.4.0 upgrade failed during mongosh upgrade. ",status:"Closed",p:"Top",zd:4,v:"7.8.4.0",re:"No",cxc:4,cx:["H?gskoleservice i J?nk?ping AB", "Fondation oeuvre de la Croix Saint Simon", "DIRECTION DES SERVICES ADMINISTRATIF ET FINANCIER - SERVICES DU PREMIER MINISTRE", "Jupiter Technology Corporation"]},
  {key:"LP-74949",s:"Issues installing LogPoint ISO from USB drive",status:"Closed",p:"None",zd:4,v:"7.7.0",re:"No",cxc:4,cx:["SCALTEL GmbH & Co. KG", "Durham County Council", "NetNordic Sweden AB", "Aeven A/S"]},
  {key:"LP-75881",s:"Logpoint UI not responsive because of uvicorn workers stuck on mongo topology discover",status:"Closed",p:"Top",zd:4,v:"7.9.0",re:"No",cxc:4,cx:["Governikus GmbH & Co. KG", "Exchange Bank", "Bechtle Austria GmbH", "SVD B?romanagement GmbH"]},
  {key:"LP-76033",s:"Assess Exposure and Mitigation for Linux ?Dirty Frag? Local Privilege Escalation Vulnera",status:"Closed",p:"Major",zd:4,v:"7.9.0",re:"No",cxc:4,cx:["Konstfack", "Family Building Society", "Nordlo Evolve AB", "SpaceNet AG"]},
  {key:"LP-76329",s:"Wheel packages not updated in 7.9.2 ",status:"Closed",p:"Top",zd:4,v:"7.9.2.0",re:"No",cxc:3,cx:["Governikus GmbH & Co. KG", "Exchange Bank", "SVD B?romanagement GmbH"]},
  {key:"LP-66133",s:"Premerger timeouts during restart blocking its operation",status:"Closed",p:"Major",zd:3,v:"7.3.1",re:"No",cxc:3,cx:["V?stra G?taland Regionen (VGR)", "VILLE DE MARTIGUES", "AEROPORT DE PARIS (ADP)"]},
  {key:"LP-66351",s:"UX : Search Report Generation Fails when dark mode is enabled in the Logpoint via User's",status:"Closed",p:"Major",zd:3,v:"7.5.0.5",re:"No",cxc:3,cx:["guardsix DK A/S", "University of Winchester", "Staatsbetrieb S?chsische Informatik Dienste"]},
  {key:"LP-66443",s:"Display total number of nodes on LP UI for which license was generated.",status:"Closed",p:"Major",zd:3,v:"7.5.0.5",re:"No",cxc:2,cx:["Thakral One Nepal Pvt. Ltd.", "BlueZebra Co. Ltd."]},
  {key:"LP-66919",s:"Batch Processor does not read NDJSON file after 7.6.0 upgrade",status:"Closed",p:"Top",zd:3,v:"7.6.0.3",re:"No",cxc:3,cx:["KMD A/S", "Varde Kommune", "K?benhavns Kommune"]},
  {key:"LP-67388",s:"Alert (Incident) search link not working in logpoint v7.6.0",status:"Closed",p:"Top",zd:3,v:"7.6.0.3",re:"No",cxc:3,cx:["Liverpool John Moores University", "Scildon N.V.", "MEDIAPOSTE"]},
  {key:"LP-67747",s:"nfs-common package missing in 760 ISO",status:"Closed",p:"Major",zd:3,v:"7.6.0.3",re:"No",cxc:3,cx:["H?gskoleservice i J?nk?ping AB", "IT-Total AB", "Hull University Teaching Hospitals NHS Trust"]},
  {key:"LP-68076",s:"Repo offline due to flags issue on the CPU allocated to LP",status:"Closed",p:"Minor",zd:3,v:"7.6.0.3",re:"No",cxc:3,cx:["OHB Digital Services GmbH", "guardsix DK A/S", "Bizsecure Asia Pacific Pte Ltd"]},
  {key:"LP-69281",s:"Unable to edit alert email notifications with the valid jinja template expression",status:"Closed",p:"Major",zd:3,v:"7.7.1.0",re:"No",cxc:3,cx:["APIXIT", "AEROPORT DE PARIS (ADP)", "Ondu Cloud"]},
  {key:"LP-70077",s:"UEB: No analytics  for reasonable amount of Logs Sent to UEBA",status:"Closed",p:"Major",zd:3,v:"7.7.1.0",re:"No",cxc:3,cx:["Durham Public Schools", "Brookfield CEE Holding GmbH", "JOANNEUM RESEARCH Forschungsgesellschaft MbH"]},
  {key:"LP-70198",s:"DLP connection cannot be successful because of certificate issue",status:"Closed",p:"Top",zd:3,v:"7.8.0",re:"No",cxc:3,cx:["RAM-IT", "Telia Estonia", "V?stra G?taland Regionen (VGR)"]},
  {key:"LP-73341",s:"LPC can't connect to a Data Node residing behind a public network.",status:"Closed",p:"Major",zd:3,v:"7.8.0",re:"No",cxc:3,cx:["FOXiT GmbH", "NPO Torino S.r.l", "IOCO INFRASTRUCTURE SERVICES (PTY) LTD"]},
  {key:"LP-73489",s:"Cannot upload soar license in director connected logpoint.",status:"Closed",p:"Major",zd:3,v:"7.8.4.0",re:"No",cxc:3,cx:["Ondu Cloud", "Cyllene", "ETS Consulting (MSSP)"]},
  {key:"LP-73496",s:"Enrichment service in subscriber mode uses deleted files, filling up /opt/makalu/appstor",status:"Closed",p:"Top",zd:3,v:"7.7.0",re:"Yes",cxc:3,cx:["RAM-IT", "WienIT EDV Dienstleistungsgesellschaft mbH & Co KG", "State Cyber Protection Center (SCPC)"]},
  {key:"LP-75683",s:"False positive alerts and dashboard widget results triggered due to newline character in",status:"Closed",p:"Major",zd:3,v:"7.9.0",re:"No",cxc:3,cx:["Heyra Cyber ApS", "SpaceNet AG", "Telia Lithuania"]},
  {key:"LP-75880",s:"Issue observed in alerts created from searchmaster and director API without defining sea",status:"Closed",p:"Top",zd:3,v:"7.8.0",re:"No",cxc:3,cx:["APP Group (Canada) Inc.", "8com GmbH & Co. KG", "Siemens"]},
  {key:"LP-76194",s:"Reports failing with java.lang.ClassCastException",status:"In Review",p:"Top",zd:3,v:"7.8.0.0",re:"No",cxc:3,cx:["SVD B?romanagement GmbH", "CDISCOUNT", "NSC Soft"]},
  {key:"LP-65959",s:"Critical Memory Leak in Merger Service",status:"Closed",p:"Major",zd:2,v:"7.4.2",re:"No",cxc:2,cx:["AGENCE SPATIALE EUROPEENNE - ESA", "CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-65981",s:"Incident Data and View Data of an alert incident display different results ",status:"Closed",p:"Major",zd:2,v:"7.5.0",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-66017",s:"Critical Vulnerability in OpenSSH - CVE-2025-4891 - [PSIRP Simulation Exercise - Case I]",status:"Closed",p:"Major",zd:2,v:"7.6.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-66376",s:"DUO: Logpoint-Dashboards Not Running Due to last_login time not updated by DUO Plugin.",status:"Closed",p:"Major",zd:2,v:"6.12.2",re:"No",cxc:2,cx:["Siemens", "CryptoGen Nepal Pvt. Ltd"]},
  {key:"LP-66358",s:"Malformed queries on using search button under alerts.",status:"Closed",p:"Major",zd:2,v:"7.5.0",re:"No",cxc:2,cx:["Telia Cygate Finland", "Telia Lithuania"]},
  {key:"LP-66373",s:"SCP Fetcher: Config is generated incorrectly",status:"Closed",p:"Major",zd:2,v:"7.5.0",re:"No",cxc:2,cx:["KMD A/S", "K?benhavns Kommune"]},
  {key:"LP-66908",s:"Wrong kernel (Azure) installed when upgrading to 7.6 in QEMU environment.",status:"Closed",p:"Top",zd:2,v:"7.6.0.0",re:"No",cxc:2,cx:["Staatliche Feuerwehrschule Geretsried", "CGI Sverige AB"]},
  {key:"LP-66920",s:"Indexes are written to immutable partition (even on the secondary tier after retention).",status:"Closed",p:"Major",zd:2,v:"7.2.0",re:"No",cxc:1,cx:["G?teborgs Stad"]},
  {key:"LP-67031",s:"Issue in efibootmanager path used in LP 750 which will result in boot failure on 760",status:"Closed",p:"Top",zd:2,v:"7.5.0",re:"No",cxc:2,cx:["Waagner-Biro Austria Stage GmbH", "CH ALES"]},
  {key:"LP-67190",s:"Unsupported SASL Auth mechanisms between Postfix relay and SMTP server",status:"Closed",p:"Major",zd:2,v:"7.6.0.3",re:"No",cxc:1,cx:["Loomis AB"]},
  {key:"LP-67409",s:"Misleading count for configured agents for LPA Collector when configured through log col",status:"Closed",p:"Top",zd:2,v:"7.6.0.0",re:"No",cxc:2,cx:["RAM-IT", "Seine Maritime"]},
  {key:"LP-67487",s:"UEBA: All Repo Logs Sent to Streamer Even When None Selected in UI",status:"Closed",p:"Major",zd:2,v:"7.5.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-67676",s:"Walinuxagent service down due to use of deleted python module \"imp\"",status:"Closed",p:"Major",zd:2,v:"7.6.0.3",re:"No",cxc:2,cx:["Jtltraining", "SEA TPI"]},
  {key:"LP-67680",s:"HA repo path does not change for already configured repo even after updating Base Repo P",status:"Closed",p:"Major",zd:2,v:"7.6.1.0",re:"No",cxc:2,cx:["Aeven A/S", "Telia Cygate AB"]},
  {key:"LP-68025",s:"SNMP settings page doesn't load on a 7.6.0 collector",status:"Closed",p:"Top",zd:2,v:"7.6.0",re:"No",cxc:2,cx:["Siemens", "dacoso GmbH - Unterf?hring"]},
  {key:"LP-68144",s:"Can't import CSV role map in Radius Authentication plugin",status:"Closed",p:"Major",zd:2,v:"7.6.1.0",re:"No",cxc:1,cx:["Ringk?bing-Skjern Kommune"]},
  {key:"LP-68288",s:"Inconsistent Graph Outputs in Reports Generated from Templates",status:"Closed",p:"Major",zd:2,v:"7.6.0.0",re:"No",cxc:1,cx:["Heyra Cyber ApS"]},
  {key:"LP-68515",s:"Interesting field displays wrong values for the field when multiple repos are selected.",status:"Closed",p:"Major",zd:2,v:"7.7.0.0",re:"No",cxc:2,cx:["guardsix DK A/S", "Staatsbetrieb S?chsische Informatik Dienste"]},
  {key:"LP-68569",s:"7.7.0 Upgrade: Excessive delay in reflecting configuration change to service config in d",status:"Closed",p:"Top",zd:2,v:"7.7.0.1",re:"No",cxc:2,cx:["ASSIA", "dacoso GmbH - Unterf?hring"]},
  {key:"LP-68838",s:"Device details for devices using syslog collector with proxy cannot be viewed",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-68898",s:"Extremely large normalizer/norm_lookup config.json created by Log sources - causing perf",status:"Closed",p:"Top",zd:2,v:"7.6.1.0",re:"No",cxc:1,cx:["Ringk?bing-Skjern Kommune"]},
  {key:"LP-69010",s:"XSS detection logic flags block safe logs testing in universal normalizer configuration",status:"Closed",p:"Major",zd:2,v:"7.7.0",re:"No",cxc:2,cx:["Hamburger Energiewerke GmbH", "IDEAL lebensversicherung a. G."]},
  {key:"LP-69177",s:"java.util.ConcurrentModificationException seen on logs of indexsearcher.",status:"Closed",p:"Minor",zd:2,v:"7.7.0.3",re:"No",cxc:1,cx:["Sheffield Hallam University"]},
  {key:"LP-69544",s:"Alert details of shared alert rules are not visible to any users",status:"Closed",p:"Minor",zd:2,v:"7.7.0",re:"No",cxc:1,cx:["Heyra Cyber ApS"]},
  {key:"LP-69570",s:"Searching results of aggregation query shows \"Incomplete query\" when the field is empt",status:"Closed",p:"Major",zd:2,v:"7.7.1.0",re:"No",cxc:2,cx:["dacoso GmbH - Unterf?hring", "Siemens"]},
  {key:"LP-69682",s:"LP SaaS : Incidents tab and other UI elements not visible for a user despite correct per",status:"Closed",p:"Top",zd:2,v:"7.8.0.1",re:"No",cxc:2,cx:["dacoso GmbH - Unterf?hring", "BPHA"]},
  {key:"LP-69733",s:"Personalized layout report template not updating old configuration",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",cxc:2,cx:["Regent University", "guardsix DK A/S"]},
  {key:"LP-69751",s:"No means to resolve system notifications for LPC",status:"Closed",p:"Major",zd:2,v:"7.7.1.0",re:"No",cxc:1,cx:["Oduma Solutions Ltd"]},
  {key:"LP-69872",s:"Logs discarded by Indexsearcher when UTF-8 encoding inflates segment size and segment si",status:"Closed",p:"Top",zd:2,v:"7.6.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-69939",s:"Critical and High Risk Vulnerability Found on Nessus VA Scan on Logpoint 7.8.0.2 with sc",status:"Closed",p:"Top",zd:2,v:"7.8.0.2",re:"No",cxc:2,cx:["guardsix DK A/S", "Energinet.DK"]},
  {key:"LP-69962",s:"HA Collector Consuming tremendous amount of memory.",status:"Closed",p:"Top",zd:2,v:"7.7.0.3",re:"No",cxc:2,cx:["IT-Total AB", "SVD B?romanagement GmbH"]},
  {key:"LP-70192",s:"Concern regarding CVE-2025-14847",status:"Closed",p:"Major",zd:2,v:"7.8.0.2",re:"No",cxc:2,cx:["Telia Cygate Finland", "Royal Wolverhampton NHS Trust"]},
  {key:"LP-70262",s:"Config regeneration stuck on write syscall",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",cxc:1,cx:["Renk Group"]},
  {key:"LP-70350",s:"Results are missing for aliased stream query values in the PDF report format ",status:"Closed",p:"Major",zd:2,v:"7.7.1.0",re:"No",cxc:2,cx:["K?benhavns Kommune", "Thales DIS Thailand Ltd"]},
  {key:"LP-70394",s:"Network interface name changes across reboots",status:"Closed",p:"Major",zd:2,v:"7.8.0.2",re:"No",cxc:2,cx:["guardsix DK A/S", "SCALTEL GmbH & Co. KG"]},
  {key:"LP-70431",s:"Released version of s3fs tools not compatible with 7.8.3.",status:"Closed",p:"Top",zd:2,v:"7.8.0",re:"No",cxc:2,cx:["SpaceNet AG", "Jupiter Technology Corporation"]},
  {key:"LP-70434",s:"Searches containing wildcards in the query times out.",status:"Closed",p:"Top",zd:2,v:"7.5.0",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-70664",s:"Duplicate alert_id & alertrule_id generated by Alertrules API causing missing Alerts",status:"Closed",p:"Major",zd:2,v:"7.7.0.1",re:"No",cxc:1,cx:["CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-73313",s:"False Positive Incidents Generated for Aggregation Queries After Upgrade to 7.9.0.0",status:"Closed",p:"Top",zd:2,v:"7.9.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-73360",s:"ha_collector reboot breaks ha_forwarder communication causing storage buildup on ha_forw",status:"Closed",p:"Major",zd:2,v:"7.8.4.0",re:"No",cxc:2,cx:["CGI Deutschland B.V. & Co. KG", "UNIVERSITE MOHAMMED VI POLYTECHNIQUE - UM6P"]},
  {key:"LP-73397",s:"SIEM node license details not visible in co?managed Fabric mode",status:"Closed",p:"Major",zd:2,v:"7.8.4.0",re:"No",cxc:2,cx:["KMD A/S", "NPO Torino S.r.l"]},
  {key:"LP-73405",s:" Log Sources per?page selection doesn?t change rows displayed; list stays at 10",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",cxc:2,cx:["STORMSHIELD", "guardsix DK A/S"]},
  {key:"LP-75034",s:"LPC containers failing to start up after system reboot",status:"Closed",p:"Top",zd:2,v:"7.5.0.0",re:"No",cxc:2,cx:["Nordlo Evolve AB", "Xpress Bill Pay"]},
  {key:"LP-75811",s:"Alertrules created from API with flush_on_trigger: true is triggered only once and then ",status:"Closed",p:"Top",zd:2,v:"7.7.0.2",re:"No",cxc:2,cx:["Heyra Cyber ApS", "8com GmbH & Co. KG"]},
  {key:"LP-75848",s:"IndexSearcher retention job fails with generic error message, lacking detailed logs for ",status:"Open",p:"Minor",zd:2,v:"7.8.0",re:"No",cxc:1,cx:["Nhs"]},
  {key:"LP-75917",s:"Embedded widget url not working after v7.9.0",status:"Closed",p:"Major",zd:2,v:"7.9.0.4",re:"No",cxc:2,cx:["Staatsbetrieb S?chsische Informatik Dienste", "Ringk?bing-Skjern Kommune"]},
  {key:"LP-76000",s:"Stale tunnel 10001 interface IP in api_config_service configuration file on SIEM",status:"Closed",p:"Top",zd:2,v:"7.9.0",re:"No",cxc:2,cx:["SCALTEL GmbH & Co. KG", "Netia SA"]},
  {key:"LP-66028",s:"Authentication bypass Vunerability- [PSIRP Simulation Exercise - Case III]",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-66032",s:"The \"Send compressed report on email\" option in the report template doesn't actually c",status:"Closed",p:"Major",zd:1,v:"7.5.0",re:"No",cxc:1,cx:["CDISCOUNT"]},
  {key:"LP-66038",s:"Search API returns \"Invalid session\" error for getsearchlogs",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["SysArmy"]},
  {key:"LP-66075",s:"Rsync: Remote Code Execution and Related Vulnerabilities",status:"Closed",p:"Top",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-66113",s:"Cannot set a day in search interval while creating alerts.",status:"Closed",p:"Top",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["NPO Torino S.r.l"]},
  {key:"LP-66151",s:"Enrichment Service Fails to Resume After Disk Space is Freed",status:"Closed",p:"Major",zd:1,v:"7.5.0.1",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-66196",s:"Invalid way to check if a repopath is writable by loginspect",status:"Closed",p:"Major",zd:1,v:"7.4.2",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-66247",s:"UI Bug in Collector's configuration page after connecting to the Director",status:"Closed",p:"Minor",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["NGS GmbH Next Generation Security  ein Unternehmen der Dr. Kraft & Partners Group, IL"]},
  {key:"LP-66357",s:"Non IP fields added to type_ip by sflow collector causing queue build up in indexsearche",status:"Closed",p:"Major",zd:1,v:"7.6.0.1",re:"No",cxc:1,cx:["FastLeanSmart"]},
  {key:"LP-66447",s:"Config generation for scp_fetcher and scp_fetcher_lite is buggy",status:"Closed",p:"Major",zd:1,v:"7.4.2",re:"No",cxc:1,cx:["KMD A/S"]},
  {key:"LP-66469",s:"Incorrect MTU Value Returned Due to Improper Client Filtering in MongoDB Query.",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["SYSDREAM"]},
  {key:"LP-66829",s:"Potential Critical Vulnerabilites in Logpoint Core SIEM 7.5.1",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-66472",s:"Password containing an <h> tag triggers an XSS (Cross-Site Scripting) validation excepti",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["Deloitte Espana"]},
  {key:"LP-66500",s:"System Notification Service Doesn't Stop AgentX collector Causing Disk to Become Full",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-66529",s:"UEBA: Logpoint connector did not recover after remote UEBA clusters were back up after a",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["LAUFENBERG GMBH"]},
  {key:"LP-66628",s:"\"CHANGE REPOS\" option in Dasboard tab is confusing and misleading.",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["INSTITUT CURIE"]},
  {key:"LP-66635",s:"Sorting with log_ts doesn't work with all date formats in dashboards",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["Zuri Technologies"]},
  {key:"LP-66636",s:"Error: unbalanced parenthesis - in merger service logs",status:"Closed",p:"Minor",zd:1,v:"7.5.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-66644",s:"Export Management : Log Export fails when \"\\\" is used as path separator in path field",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["CGI Suomi Oy"]},
  {key:"LP-66646",s:"Inconsistent search result while exporting it in CSV or Excel from UI search view for ti",status:"Closed",p:"Major",zd:1,v:"7.4.2",re:"No",cxc:1,cx:["APIXIT"]},
  {key:"LP-66742",s:"Mailsender does not include Date field in the email header",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["Edhec-dbd"]},
  {key:"LP-66917",s:"SCP Fetcher: Stack trace shown in case of Error reading Banner ",status:"Closed",p:"Major",zd:1,v:"7.2.4.1",re:"No",cxc:1,cx:["KMD A/S"]},
  {key:"LP-66888",s:"When strings surrounded by angular brackets (\"<\" and \">\") are placed as values in a ",status:"Closed",p:"Major",zd:1,v:"7.5.0",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-66895",s:"Repacking LogPoint ISO 7.5.0 without encrypted files",status:"Closed",p:"Top",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["Energinet.DK"]},
  {key:"LP-66896",s:"Alert risk is calculated incorrectly in simple query, as well as in distributed setup",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["IT-Total AB"]},
  {key:"LP-66898",s:"Invalid user login for non existing user is never removed from db resulting in a possibl",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["Thakral One Nepal Pvt. Ltd."]},
  {key:"LP-66982",s:"other grouping with limit doesn't work with the distinct_list command after update to 7.",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["dacoso GmbH - Unterf?hring"]},
  {key:"LP-66987",s:"Dynamic list is not populated by a triggered alert rule when the \"Flush On Trigger\" pa",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["FOXiT GmbH"]},
  {key:"LP-67010",s:"Alert  triggering multiple times within bucket interval when latest by query is used.",status:"Closed",p:"Major",zd:1,v:"7.5.0.3",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-67024",s:"FE: Selecting \"use as proxy\" in syslog collector LogSource configuration crashes the p",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-67025",s:"No results found message seen in dashboard even if there are results for the query.",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["Zuri Technologies"]},
  {key:"LP-67110",s:"Temporary files are not cleared up",status:"Closed",p:"Major",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-67174",s:"LP_Pool import failed missing multipath deb package",status:"Closed",p:"Top",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["CGI Sverige AB"]},
  {key:"LP-67175",s:"Difference in how SMTP Test works vs how actual mail is sent via alerts",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["Loomis AB"]},
  {key:"LP-67191",s:"Alert rule search not working properly",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:0,cx:[]},
  {key:"LP-67293",s:"Only 10 IPs are shown using detect blocked IP feature.",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["Aller Media A/S"]},
  {key:"LP-67362",s:"Error in merger service when using '| order by' after '| latest by'",status:"Closed",p:"Minor",zd:1,v:"7.6.1.0",re:"No",cxc:1,cx:["Security Service of Ukraine (SSU)"]},
  {key:"LP-67389",s:"Followed by query joins the same log from both streams if both streams return same logs",status:"Closed",p:"Minor",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-67437",s:"All repos are not shown in dropdown during repo selection in LogSource routing configura",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["Plikt- och pr?vningsverket"]},
  {key:"LP-67609",s:"Multiple vulnerabilities in openssh package",status:"Closed",p:"Top",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["CommuniGate Kommunikationsservice GmbH"]},
  {key:"LP-67520",s:"Doc: SNMP monitoring for the Log Sources and Devices doesn't work as expected.",status:"Closed",p:"Top",zd:1,v:"7.2.4",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-67522",s:"Error not properly shown on Enrichment Policy",status:"Closed",p:"Major",zd:1,v:"7.6.1.0",re:"No",cxc:1,cx:["State Cyber Protection Center (SCPC)"]},
  {key:"LP-67606",s:"XSS detection logic flags and blocks process eval and many other safe queries",status:"Closed",p:"Top",zd:1,v:"7.7.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-67610",s:"New lines are not previewed in the Jinja template",status:"Closed",p:"Minor",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["dacoso GmbH - Unterf?hring"]},
  {key:"LP-67781",s:"Security: Vulnerable Version of commons-collections4 and quartz Library Detected in LogP",status:"Closed",p:"Top",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-67797",s:"Concern about CVE-2024-6387 - Remote Unauthenticated Code Execution Vulnerability in Ope",status:"Closed",p:"Major",zd:1,v:"7.6.0.1",re:"No",cxc:1,cx:["Zuri Technologies"]},
  {key:"LP-67863",s:"The repo count in the search UI doesn't display the actual repo selected in the savedsea",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["KMD A/S"]},
  {key:"LP-67888",s:"\"Active-Backup\" mode in ethernet bonding not working when active interface is down.",status:"Closed",p:"Major",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["Region ?sterg?tland"]},
  {key:"LP-67901",s:"chart count() after join doesn't work with fields created by process eval ",status:"Closed",p:"Minor",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-67905",s:"Issue with resolving incidents for incident ids with certain format.",status:"Closed",p:"Major",zd:1,v:"7.4.2",re:"No",cxc:1,cx:["IOCO INFRASTRUCTURE SERVICES (PTY) LTD"]},
  {key:"LP-67924",s:"Some Jinja Methods Do Not Work after 7.6.0 update in Search Templates",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["Region J?nk?pings L?n"]},
  {key:"LP-67944",s:"restore_url params doesn't work with soar endpoints",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-68108",s:"Unexpected behavior due when using tab characters in a list",status:"Closed",p:"Minor",zd:1,v:"7.5.1.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-68117",s:"High Bandwidth Usage by OpenVPN in Distributed Setup",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["SysArmy"]},
  {key:"LP-68250",s:"SLS - query is truncated while searching for some saved searches",status:"Closed",p:"Major",zd:1,v:"7.3.0",re:"No",cxc:1,cx:["STORMSHIELD"]},
  {key:"LP-68301",s:"RadiusAuthentication: Importing CSV role map overrides the group mapping information",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["Ringk?bing-Skjern Kommune"]},
  {key:"LP-68336",s:"Observations in Proxmox VM Deployments",status:"Closed",p:"Minor",zd:1,v:"7.5.0",re:"No",cxc:1,cx:["Cyllene"]},
  {key:"LP-68367",s:"Incorrect Result displayed  on UI when search/filter command query is used.",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["K?benhavns Kommune"]},
  {key:"LP-68441",s:"Email attachment not visible on Microsoft Outlook App",status:"Closed",p:"Top",zd:1,v:"7.6.1.0",re:"No",cxc:1,cx:["Thakral One Nepal Pvt. Ltd."]},
  {key:"LP-68494",s:"OVA Deployment Fails in vSphere Due to Incorrect File Order of OVF Descriptor",status:"Closed",p:"Major",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["APIXIT"]},
  {key:"LP-68509",s:"Multipath boot package missing in 7.7.0 logpoint.",status:"Closed",p:"Top",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["CGI Sverige AB"]},
  {key:"LP-68558",s:"Update ulimit for max user processes",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Cyllene"]},
  {key:"LP-68617",s:"Audit log for alert rule update is incomplete",status:"Closed",p:"Major",zd:1,v:"7.6.0.2",re:"No",cxc:1,cx:["CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-68619",s:"False alerts triggered for condition \"Equals to 0\"",status:"Closed",p:"Top",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-68701",s:"Unresponsive nfs-server causing delay in logpoint upgrade",status:"Closed",p:"Top",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Orange Cyberdefense Sweden AB"]},
  {key:"LP-68718",s:"35 CVEs Reported by Customer, Primarily in Java Packages",status:"Closed",p:"Top",zd:1,v:"7.6.0.3",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-68774",s:"Last Log Received for device never gets cleared up",status:"Closed",p:"Major",zd:1,v:"7.6.0.2",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-68775",s:"Cannot search for inactive devices using Logpoint query",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-68802",s:"using quoted fields in distinct_list query results empty responses",status:"Closed",p:"Minor",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-68817",s:"Opendoor connection failure when Netmask is set to 255.255.255.248",status:"Closed",p:"Top",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["dacoso GmbH - Unterf?hring"]},
  {key:"LP-68818",s:"Issue in ISO installation during the running of ./parts/migrate_to_dnsmasq.py",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Terma A/S"]},
  {key:"LP-68870",s:"Unable to add/modify multiple routing criteria for device added via logsource",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Governikus GmbH & Co. KG"]},
  {key:"LP-68921",s:" Indexes without indexKey values in 7.5.0 are not moving to the next tier after expirati",status:"Closed",p:"Minor",zd:1,v:"7.5.0",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-70097",s:"SNMP Protocol Vulnerabilities in Logpoint SIEM and Director",status:"Closed",p:"Major",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-68947",s:"distinct_count() times-out when used on stream fields (s1.fieldName)",status:"Closed",p:"Minor",zd:1,v:"7.7.0.0",re:"Yes",cxc:1,cx:["Heyra Cyber ApS"]},
  {key:"LP-69032",s:"Pagination for SearchAPI not defined properly",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["Thisted Kommune"]},
  {key:"LP-69084",s:"LogPoint 7.6.0 AMI GA not available on AWS logpoint-nepal-ami-sharing account",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-69099",s:"Audit log missing when editing alert rule criteria",status:"Closed",p:"Top",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-69105",s:"Multiple CVEs reported by customer",status:"Closed",p:"Minor",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-69137",s:"ODBC enrichment source password gets reset without intent",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["Region V?sterbotten"]},
  {key:"LP-69203",s:"LDAPEnrichment: Error Handling when objectSID or objecGUID is None.",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"Yes",cxc:1,cx:["Telonic GmbH"]},
  {key:"LP-69204",s:"LDAPEnrichment: UI Displays Misleading Error When NoneType Exception Occurs.",status:"Closed",p:"Minor",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["Telonic GmbH"]},
  {key:"LP-69234",s:"Alert not triggered when query using chart count() returns no results",status:"Closed",p:"Major",zd:1,v:"7.0.0",re:"No",cxc:1,cx:["CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-69254",s:"Oauth Authentication: Issue while logging out when oauth authentication is used with Ent",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["SDIS 35"]},
  {key:"LP-69280",s:"Audit log for de-activated alert rule update is incorrect.",status:"Closed",p:"Major",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["CGI Deutschland B.V. & Co. KG"]},
  {key:"LP-69314",s:"process dns adds a dot '.' at the end of the hostname",status:"Closed",p:"Minor",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-69344",s:"SLS: Quick Start and SNS Interface dashboards are not shown in dashboards page.",status:"Closed",p:"Minor",zd:1,v:"SLS-2.0.0",re:"No",cxc:1,cx:["STORMSHIELD"]},
  {key:"LP-69448",s:"timechart count() every 1 day in last x days behaves differently when preceded by join q",status:"Closed",p:"Minor",zd:1,v:"7.7.1.0",re:"No",cxc:0,cx:[]},
  {key:"LP-69503",s:"CVE-2025-10230 on clients machine",status:"Closed",p:"Major",zd:1,v:"7.7.0.1",re:"No",cxc:1,cx:["Netia SA"]},
  {key:"LP-69453",s:"change-ip command does not consider which interface is currently in use.",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["KMD A/S"]},
  {key:"LP-69502",s:"Vulnerabilities in Logpoint version 7.7.1",status:"Closed",p:"Major",zd:1,v:"7.7.0.1",re:"No",cxc:1,cx:["Nassau County Police Federal Credit Union (NCPD FCU)"]},
  {key:"LP-69509",s:"Manual incident creation from search query with event_received_ts fails to populate inci",status:"Closed",p:"Minor",zd:1,v:"7.7.0.1",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-69598",s:"Some Plugins were not installed during the system update to 7.8.0",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-69608",s:"EOL packages detected",status:"Closed",p:"Major",zd:1,v:"7.7.0.1",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-69609",s:"Unable to add multiple emails when manually running a report",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["K?benhavns Kommune"]},
  {key:"LP-69610",s:"Permalink not working as expected",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Telia Lithuania"]},
  {key:"LP-69686",s:"Log Source is allowed to save on UI even if the mandatory field is empty and missing man",status:"Closed",p:"Major",zd:1,v:"7.8.0.1",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-69760",s:"Changing Open Door Internal IP from DLP Causes Enrichment Failure in Collector",status:"Closed",p:"Major",zd:1,v:"7.7.0.0",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-69863",s:"Incident Data not accessible after upgrade to 7.8.0.1 when Jinja Template is Applied and",status:"Closed",p:"Top",zd:1,v:"7.8.0.1",re:"No",cxc:1,cx:["SpaceNet AG"]},
  {key:"LP-69963",s:"OutOfMemory exceptions in HA forwarder ",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["IT-Total AB"]},
  {key:"LP-70001",s:"RocksDB in Enrichment Service Stuck After Disk Full Condition and does Not Recover After",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["Region ?sterg?tland"]},
  {key:"LP-70046",s:"Read-only system settings data is editable in v7.7 and 7.8.",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-70052",s:"Configuration-> Devices: Sort by  only works on Name and Address Column, and not others",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-70086",s:"Cannot set unique field other than sAMAccountName for LDAP enrichment source for UEBA En",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-70092",s:"Leaking file descriptors are filling up the app_store mount point, causing log collectio",status:"Closed",p:"Top",zd:1,v:"7.8.0.0",re:"No",cxc:1,cx:["Energinet.DK"]},
  {key:"LP-70088",s:"Cannot use emails having a single character in TLD's for manual reports.",status:"Closed",p:"Minor",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["Cinia Oy"]},
  {key:"LP-70219",s:"Issue with grub installation in case of unused disk",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["Bechtle Austria GmbH"]},
  {key:"LP-70228",s:"CVE-2023-46604 - activemq-client",status:"Closed",p:"Major",zd:1,v:"7.7.0.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-70283",s:"hrStorageUsed.2 (OID 1.3.6.1.2.1.25.2.3.1.6.2) may not return disk usage on Linux",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",cxc:1,cx:["Qvantel Finland"]},
  {key:"LP-70308",s:"Potential Vulnerability in ODBC Enrichment Plugin",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-70392",s:"Grub-pc configuration fixed not working on some servers",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["WienIT EDV Dienstleistungsgesellschaft mbH & Co KG"]},
  {key:"LP-70393",s:"7.8.3 upgrade taking excessive time on high data volume systems.",status:"Closed",p:"Top",zd:1,v:"7.8.3.0",re:"No",cxc:1,cx:["Skanderborg Kommune"]},
  {key:"LP-70400",s:"'process toList' takes all the results even after 'process spot' command",status:"Closed",p:"Major",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["Orange Cyberdefense Sweden AB"]},
  {key:"LP-70402",s:"UEBA PreConfiguration Plugin v5.2.1 not available on ServiceDesk",status:"Closed",p:"None",zd:1,v:"7.5.0.5",re:"No",cxc:1,cx:["ASSIA"]},
  {key:"LP-70430",s:"SFTP Backup and Restore fails after upgrade to 7.8.3 due to missing loginspect user in A",status:"Closed",p:"Top",zd:1,v:"7.8.3.0",re:"No",cxc:1,cx:["Bechtle GmbH IT-Systemhaus Dortmund"]},
  {key:"LP-70462",s:"Concern regarding CVE-2025-61984",status:"Closed",p:"None",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["SCALTEL GmbH & Co. KG"]},
  {key:"LP-70465",s:"Logpoint installation take more time during installation",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["SCALTEL GmbH & Co. KG"]},
  {key:"LP-70472",s:"Redis connection timeout exception on Filekeeper Service during services restart.",status:"Closed",p:"None",zd:1,v:"7.5.0",re:"No",cxc:1,cx:["SEA TPI"]},
  {key:"LP-70479",s:"Compatibility Check button for UEBA not enabled",status:"Closed",p:"Major",zd:1,v:"7.8.1.0",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-70480",s:"AlertRules read_api fails for cloned vendor alerts with search_interval_minute set as No",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["SpaceNet AG"]},
  {key:"LP-70583",s:"Issue seen in report engine log of Stormshield server",status:"Closed",p:"Major",zd:1,v:"7.8.1.0",re:"No",cxc:1,cx:["STORMSHIELD"]},
  {key:"LP-70615",s:"Search via Search Head fails with AttributeError unless Search Head is explicitly select",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Nordlo Evolve AB"]},
  {key:"LP-73328",s:"Admin user \"Last Login Time\" updates on UI refresh in Distributed Mode without actual ",status:"Closed",p:"Minor",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["Orange Cyberdefense Sweden AB"]},
  {key:"LP-73338",s:"NullPointer Exception Observed in Premerger when computing timechart queries with large ",status:"Closed",p:"None",zd:1,v:"7.9.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-73339",s:"CVE-2025-66516 Reported by customer",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-73406",s:"Inconsistency in kernel installation on logpoint installed on dell server via 7.8.0 ISO.",status:"Closed",p:"Major",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["SCALTEL GmbH & Co. KG"]},
  {key:"LP-73422",s:"Website not rendering for users with operator permission when trying to login to Search ",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["Nordlo Evolve AB"]},
  {key:"LP-73764",s:"Potential malicious content detected in fields: email_template",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:0,cx:[]},
  {key:"LP-74879",s:"Sync feature not respecting the usability of HA configured repos",status:"Closed",p:"None",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["Nordlo Evolve AB"]},
  {key:"LP-74921",s:"Misleading \"Permission Denied\" Error When Querying Non-Existent Incident Object  Summa",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-74964",s:"Upgrade to 7.9.0.1 Fails Due to Race Condition Between runit Startup and MongoDB Force-S",status:"Closed",p:"None",zd:1,v:"7.9.0.1",re:"No",cxc:1,cx:["Family Building Society"]},
  {key:"LP-74967",s:"Sync: LogSources Not Visible in Web GUI After Sync Import due to Missing LogSourceTempla",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["Fondation oeuvre de la Croix Saint Simon"]},
  {key:"LP-74968",s:"Enrichment Propagation: Enrichment Inbox/Outbox Folders Not Cleaned Up After Mode Change",status:"Closed",p:"None",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["RAM-IT"]},
  {key:"LP-75010",s:"Quoted definer extracts value without quotes but retains quotes in field name",status:"Closed",p:"Minor",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["8com GmbH & Co. KG"]},
  {key:"LP-75050",s:"Threat Intelligence configuration cannot be deleted in Logpoint configured as an Enrichm",status:"Closed",p:"Minor",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["RAM-IT"]},
  {key:"LP-75083",s:"Duo authentication doesn't work due to the outdated duo_universal_python library",status:"Closed",p:"Top",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["SecurityPal"]},
  {key:"LP-75120",s:"Enrich sync service failing to open port in distributed collector",status:"Closed",p:"Major",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["Lancaster University"]},
  {key:"LP-75127",s:"CIFS collection halts during upgrades in customer environment",status:"Open",p:"Minor",zd:1,v:"7.7.1.0",re:"No",cxc:1,cx:["Oxford Health NHS Foundation Trust"]},
  {key:"LP-75149",s:"Precondition Failure on /opt/makalu/storage Despite Sufficient Available Free Space",status:"Closed",p:"Top",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["SeAMK (Sein?joen Ammattikorkeakoulu Oy / Sedu)"]},
  {key:"LP-75166",s:"Custom Metadata values are not displayed when used as Jinja Placeholders in Incident Dat",status:"Closed",p:"Major",zd:1,v:"7.8.0.0",re:"No",cxc:0,cx:[]},
  {key:"LP-75190",s:"Guardsix SIEM dashboard totals mismatch: Mongo alert_incidents vs Logpoint audit logs",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["Qvantel Finland"]},
  {key:"LP-75196",s:"Not able to SSH via partner user",status:"Closed",p:"None",zd:1,v:"7.8.2.0",re:"No",cxc:1,cx:["Telia Cygate Finland"]},
  {key:"LP-75479",s:"Predictable network naming fails on the system where udev rules are applied, and the con",status:"Closed",p:"Top",zd:1,v:"7.9.0.2",re:"No",cxc:1,cx:["Renk Group"]},
  {key:"LP-75480",s:"Logpoint UI published in port 8443 introducing a security risk",status:"Closed",p:"Minor",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["NEXOVA GROUP"]},
  {key:"LP-75595",s:"Inconsistent Editing feature in Shared Alert Rules",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["SYSDREAM"]},
  {key:"LP-75611",s:"guardsix UI: Some of the local guardsix users are missing on Web-GUI under User Accounts",status:"Closed",p:"Major",zd:1,v:"7.6.1.0",re:"Yes",cxc:1,cx:["KMD A/S"]},
  {key:"LP-75658",s:"Issues Encountered While Using Sync Functionality Across Data Nodes via Search Head",status:"Open",p:"Major",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Nordlo Evolve AB"]},
  {key:"LP-75665",s:"Migration of Mongo Credentials to Keystore fails silently in SaaS",status:"Closed",p:"Major",zd:1,v:"7.9.0.2",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75676",s:"Inconsistency in Extracting Vendor Alert Rules Between UI & Alertrules API",status:"Closed",p:"Major",zd:1,v:"7.9.0.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75717",s:"Alertrules created from the API show an empty box in alert throttling when editing them ",status:"Closed",p:"Major",zd:1,v:"7.7.0.2",re:"No",cxc:1,cx:["Heyra Cyber ApS"]},
  {key:"LP-75826",s:"Cannot set path to \"/\" in Export management using FTP",status:"In Progress",p:"Minor",zd:1,v:"7.9.0",re:"No",cxc:1,cx:["H?rsholm Kommune"]},
  {key:"LP-75827",s:"Removing unused devices in Syslog Forwarder UI removes valid devices if devices are adde",status:"Closed",p:"Major",zd:1,v:"7.9.0",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75828",s:"Devices without distributed collector are synced to Syslog Forwarder, causing confusion ",status:"Open",p:"Minor",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75829",s:"Deleted devices from Main Logpoint are not removed from Syslog Forwarder after sync and ",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75830",s:"Duplicate devices created in Syslog Forwarder when device is re-added with same IP but d",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75834",s:"RBAC bypass in Syslog Forwarder: users with no permissions can modify forwarding configu",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75839",s:"Patch install can leave webapiserver log path absent if symlink is present breaking serv",status:"Closed",p:"Major",zd:1,v:"7.9.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75866",s:"Syslog Forwarder Architecture Revamp to Address Security, Data Reliability, and Scalabil",status:"Open",p:"None",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["SachsenEnergie AG"]},
  {key:"LP-75965",s:"VLAN DNS not handled in runtime extraction in update_dnsmasq.py",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75966",s:"Incorrect resolvectl parsing in update_dnsmasq.py",status:"In Review",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75967",s:"Race condition when multiple instances of update_dnsmasq.py run causing invalid entry on",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75969",s:"Search domain trailing space causes parsing mismatch on update_dnsmasq_netplan.py",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75973",s:"Over-triggering of networkd-dispatcher due to routeable interface docker0 ",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-75996",s:"Sorting order broken in Parallel Coordinates and Sankey graphs; fields displayed alphabe",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-76021",s:"SaaS: View Incident Data fails with 'No Response from Server'",status:"Closed",p:"Top",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["guardsix DK A/S"]},
  {key:"LP-76041",s:"Some fields are missing in alert incidents for delayed logs",status:"Open",p:"Major",zd:1,v:"7.7.0.0",re:"No",cxc:1,cx:["APP Group (Canada) Inc."]},
  {key:"LP-76058",s:"Raw Syslog Forwarder forwards all localhost logs to remote target even when only HTTP Co",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",cxc:1,cx:["Jupiter Technology Corporation"]},
  {key:"LP-76108",s:"Premerger query counter leak leading to stall of the detection pipeline",status:"Closed",p:"Top",zd:1,v:"7.8.0",re:"No",cxc:1,cx:["Renk Group"]},
  {key:"LP-76140",s:"HTTP notification fails for JSON array body due to dict-only update logic",status:"Closed",p:"Major",zd:1,v:"7.4.0",re:"No",cxc:1,cx:["Siemens"]},
  {key:"LP-76143",s:"Premerger halted at 0 UTC",status:"In Progress",p:"Top",zd:1,v:"7.8.0.2",re:"No",cxc:1,cx:["Telia Estonia"]},
  {key:"LP-76159",s:"Inactivity Threshold doesn't accept \"60\" as valid value",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["Capgemini America USA"]},
  {key:"LP-76189",s:"Alert Dialog Box: Incorrect Space Formatting in Query on Overview Tab",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["Renk Group"]},
  {key:"LP-76202",s:"Failed patch installations are not visible in the updates section of the UI",status:"Open",p:"Major",zd:1,v:"7.7.0",re:"No",cxc:1,cx:["Advania Sverige AB"]},
  {key:"LP-76212",s:"[UEBA] IP forwarding not enabled on distributed search head when selected repos belong o",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",cxc:1,cx:["SVD B?romanagement GmbH"]},
  {key:"LP-76224",s:"Port 5050 not opened in AgentX",status:"Open",p:"None",zd:1,v:"7.8.4.0",re:"No",cxc:1,cx:["NPO Torino S.r.l"]},
  {key:"LP-76241",s:"Unable to restore configuration and logs backup in other machine",status:"In Progress",p:"Top",zd:1,v:"7.9.0.4",re:"No",cxc:1,cx:["SysArmy"]},
  {key:"LP-76354",s:"Upgrade fails - GRUB script writes incorrect EFI partition to /etc/fstab on ZFS systems ",status:"Open",p:"None",zd:1,v:"7.7.0.3",re:"No",cxc:1,cx:["Thakral One Nepal Pvt. Ltd."]},
  {key:"LP-76366",s:"Configuration restore doesn't restore/update the vpn certificate",status:"Open",p:"Major",zd:1,v:"7.9.0.4",re:"No",cxc:1,cx:["SysArmy"]},
];

const RT  = [{"r": "6.12", "bugs": 1, "zd": 2, "avg": 2.0, "top": 0, "open": 0, "cx": 2}, {"r": "7.0", "bugs": 2, "zd": 7, "avg": 3.5, "top": 0, "open": 0, "cx": 6}, {"r": "7.2", "bugs": 4, "zd": 10, "avg": 2.5, "top": 2, "open": 0, "cx": 7}, {"r": "7.3", "bugs": 2, "zd": 4, "avg": 2.0, "top": 0, "open": 0, "cx": 4}, {"r": "7.4", "bugs": 7, "zd": 14, "avg": 2.0, "top": 1, "open": 0, "cx": 14}, {"r": "7.5", "bugs": 45, "zd": 77, "avg": 1.7, "top": 8, "open": 0, "cx": 50}, {"r": "7.6", "bugs": 55, "zd": 136, "avg": 2.5, "top": 15, "open": 1, "cx": 75}, {"r": "7.7", "bugs": 81, "zd": 157, "avg": 1.9, "top": 15, "open": 5, "cx": 81}, {"r": "7.8", "bugs": 57, "zd": 119, "avg": 2.1, "top": 17, "open": 12, "cx": 65}, {"r": "7.9", "bugs": 21, "zd": 39, "avg": 1.9, "top": 6, "open": 4, "cx": 22}];
const REG = [{"region": "Nordic", "cx": 45, "zd": 198}, {"region": "DACH", "cx": 32, "zd": 117}, {"region": "Other", "cx": 39, "zd": 93}, {"region": "France", "cx": 21, "zd": 45}, {"region": "UK / Ireland", "cx": 17, "zd": 26}, {"region": "Asia / Pacific", "cx": 10, "zd": 28}];
const CX  = [{"name": "guardsix DK A/S", "zd": 51, "bugs": 45, "keys": ["LP-66017", "LP-66028", "LP-66351", "LP-66528", "LP-66636", "LP-66914"]}, {"name": "Siemens", "zd": 18, "bugs": 18, "keys": ["LP-66376", "LP-67781", "LP-68025", "LP-68108", "LP-68718", "LP-68774"]}, {"name": "Nordlo Evolve AB", "zd": 17, "bugs": 10, "keys": ["LP-66914", "LP-68927", "LP-70615", "LP-73311", "LP-73422", "LP-74879"]}, {"name": "Telia Cygate Finland", "zd": 14, "bugs": 13, "keys": ["LP-66075", "LP-66358", "LP-66655", "LP-66829", "LP-66914", "LP-67010"]}, {"name": "K?benhavns Kommune", "zd": 12, "bugs": 10, "keys": ["LP-66373", "LP-66914", "LP-66919", "LP-66944", "LP-68367", "LP-68519"]}, {"name": "8com GmbH & Co. KG", "zd": 11, "bugs": 11, "keys": ["LP-65981", "LP-66196", "LP-66888", "LP-66914", "LP-67110", "LP-68473"]}, {"name": "SVD B?romanagement GmbH", "zd": 10, "bugs": 14, "keys": ["LP-66151", "LP-66500", "LP-67389", "LP-68950", "LP-69362", "LP-69760"]}, {"name": "CGI Deutschland B.V. & Co. KG", "zd": 10, "bugs": 11, "keys": ["LP-65959", "LP-66914", "LP-68473", "LP-68617", "LP-68950", "LP-69099"]}, {"name": "KMD A/S", "zd": 10, "bugs": 12, "keys": ["LP-66373", "LP-66447", "LP-66917", "LP-66919", "LP-67863", "LP-69453"]}, {"name": "Thakral One Nepal Pvt. Ltd.", "zd": 9, "bugs": 9, "keys": ["LP-66443", "LP-66898", "LP-66914", "LP-66935", "LP-68441", "LP-68473"]}, {"name": "SysArmy", "zd": 8, "bugs": 7, "keys": ["LP-66038", "LP-68117", "LP-68473", "LP-73311", "LP-76043", "LP-76241"]}, {"name": "dacoso GmbH - Unterf?hring", "zd": 8, "bugs": 9, "keys": ["LP-66982", "LP-67610", "LP-68025", "LP-68170", "LP-68569", "LP-68817"]}, {"name": "Heyra Cyber ApS", "zd": 8, "bugs": 7, "keys": ["LP-68288", "LP-68947", "LP-69479", "LP-69544", "LP-75683", "LP-75717"]}, {"name": "Ringk?bing-Skjern Kommune", "zd": 8, "bugs": 7, "keys": ["LP-68144", "LP-68301", "LP-68519", "LP-68898", "LP-69820", "LP-73311"]}, {"name": "NPO Torino S.r.l", "zd": 7, "bugs": 7, "keys": ["LP-66113", "LP-66655", "LP-68375", "LP-68473", "LP-73341", "LP-73397"]}, {"name": "Cinia Oy", "zd": 6, "bugs": 5, "keys": ["LP-66914", "LP-68375", "LP-68871", "LP-69752", "LP-70088"]}, {"name": "Netia SA", "zd": 6, "bugs": 6, "keys": ["LP-68473", "LP-68659", "LP-68950", "LP-69503", "LP-70584", "LP-76000"]}, {"name": "Renk Group", "zd": 6, "bugs": 7, "keys": ["LP-69362", "LP-69422", "LP-70262", "LP-75479", "LP-75801", "LP-76108"]}, {"name": "Qvantel Finland", "zd": 6, "bugs": 6, "keys": ["LP-68473", "LP-70108", "LP-70283", "LP-70584", "LP-73311", "LP-75190"]}, {"name": "STORMSHIELD", "zd": 5, "bugs": 5, "keys": ["LP-68250", "LP-69344", "LP-69752", "LP-70583", "LP-73405"]}, {"name": "APIXIT", "zd": 5, "bugs": 5, "keys": ["LP-66646", "LP-68473", "LP-68494", "LP-69281", "LP-69752"]}, {"name": "IT-Total AB", "zd": 5, "bugs": 6, "keys": ["LP-66896", "LP-67747", "LP-68375", "LP-68950", "LP-69962", "LP-69963"]}, {"name": "CGI Sverige AB", "zd": 5, "bugs": 7, "keys": ["LP-66908", "LP-66944", "LP-67174", "LP-68170", "LP-68473", "LP-68509"]}, {"name": "Bechtle Austria GmbH", "zd": 5, "bugs": 4, "keys": ["LP-69567", "LP-70219", "LP-73497", "LP-75881"]}, {"name": "SpaceNet AG", "zd": 5, "bugs": 7, "keys": ["LP-69479", "LP-69863", "LP-70431", "LP-70480", "LP-75683", "LP-75952"]}, {"name": "SCALTEL GmbH & Co. KG", "zd": 5, "bugs": 6, "keys": ["LP-70394", "LP-70462", "LP-70465", "LP-73406", "LP-74949", "LP-76000"]}, {"name": "Aeven A/S", "zd": 4, "bugs": 4, "keys": ["LP-66655", "LP-66914", "LP-67680", "LP-74949"]}, {"name": "FOXiT GmbH", "zd": 4, "bugs": 4, "keys": ["LP-66987", "LP-69752", "LP-73341", "LP-76043"]}, {"name": "G?teborgs Stad", "zd": 4, "bugs": 3, "keys": ["LP-66920", "LP-68473", "LP-70108"]}, {"name": "WienIT EDV Dienstleistungsgesellschaft mbH & Co KG", "zd": 4, "bugs": 3, "keys": ["LP-66914", "LP-70392", "LP-73496"]}, {"name": "RAM-IT", "zd": 4, "bugs": 6, "keys": ["LP-67409", "LP-70108", "LP-70198", "LP-73496", "LP-74968", "LP-75050"]}, {"name": "Telia Lithuania", "zd": 4, "bugs": 4, "keys": ["LP-66358", "LP-68659", "LP-69610", "LP-75683"]}, {"name": "SachsenEnergie AG", "zd": 4, "bugs": 9, "keys": ["LP-67901", "LP-68659", "LP-69567", "LP-75827", "LP-75828", "LP-75829"]}, {"name": "Orange Cyberdefense Sweden AB", "zd": 4, "bugs": 4, "keys": ["LP-68473", "LP-68701", "LP-70400", "LP-73328"]}, {"name": "Cyllene", "zd": 4, "bugs": 4, "keys": ["LP-68336", "LP-68558", "LP-69752", "LP-73489"]}, {"name": "Governikus GmbH & Co. KG", "zd": 4, "bugs": 4, "keys": ["LP-68870", "LP-70108", "LP-75881", "LP-76329"]}, {"name": "Sheffield Hallam University", "zd": 4, "bugs": 2, "keys": ["LP-66914", "LP-69177"]}, {"name": "Jupiter Technology Corporation", "zd": 4, "bugs": 4, "keys": ["LP-70312", "LP-70431", "LP-73301", "LP-76058"]}, {"name": "AGENCE SPATIALE EUROPEENNE - ESA", "zd": 3, "bugs": 3, "keys": ["LP-65959", "LP-68375", "LP-70584"]}, {"name": "CDISCOUNT", "zd": 3, "bugs": 3, "keys": ["LP-66032", "LP-69577", "LP-76194"]}, {"name": "Telia Cygate AB", "zd": 3, "bugs": 3, "keys": ["LP-66300", "LP-66914", "LP-67680"]}, {"name": "V?stra G?taland Regionen (VGR)", "zd": 3, "bugs": 4, "keys": ["LP-66133", "LP-66935", "LP-70108", "LP-70198"]}, {"name": "LAUFENBERG GMBH", "zd": 3, "bugs": 3, "keys": ["LP-66300", "LP-66529", "LP-73497"]}, {"name": "Loomis AB", "zd": 3, "bugs": 4, "keys": ["LP-66655", "LP-67175", "LP-67190", "LP-70312"]}, {"name": "Energinet.DK", "zd": 3, "bugs": 3, "keys": ["LP-66895", "LP-69939", "LP-70092"]}, {"name": "Bornholms Regionskommune", "zd": 3, "bugs": 3, "keys": ["LP-66935", "LP-68473", "LP-75952"]}, {"name": "Udenrigsministeriet", "zd": 3, "bugs": 1, "keys": ["LP-66914"]}, {"name": "Bechtle GmbH IT-Systemhaus Dortmund", "zd": 3, "bugs": 3, "keys": ["LP-66655", "LP-70108", "LP-70430"]}, {"name": "Telonic GmbH", "zd": 3, "bugs": 4, "keys": ["LP-66914", "LP-66944", "LP-69203", "LP-69204"]}, {"name": "State Cyber Protection Center (SCPC)", "zd": 3, "bugs": 3, "keys": ["LP-67522", "LP-73329", "LP-73496"]}];
const TOP_CX = [{"key": "LP-66914", "s": "Upgrade: Debian Package installation stuck on grub-pc ", "zd": 37, "cx_count": 29, "p": "Top"}, {"key": "LP-68473", "s": " systemd-tmpfiles-clean.timer clears the Logpoint Services files in /t", "zd": 20, "cx_count": 19, "p": "Top"}, {"key": "LP-70108", "s": "DLP connection breaks and UI is inaccessible due to missing SSL certif", "zd": 11, "cx_count": 11, "p": "Top"}, {"key": "LP-69567", "s": "Director Settings Inaccessible when Logpoint license is expired", "zd": 10, "cx_count": 10, "p": "Top"}, {"key": "LP-75952", "s": "Local Privilege Escalation in Seconds via Copy Fail Vulnerability (CVE", "zd": 14, "cx_count": 8, "p": "Top"}, {"key": "LP-66944", "s": "Logpoint server using ZFS and booting in UEFI mode fail to boot and st", "zd": 8, "cx_count": 8, "p": "Top"}, {"key": "LP-68950", "s": "ZMQ sockets are not threadsafe but a socket is shared between two thre", "zd": 8, "cx_count": 8, "p": "Minor"}, {"key": "LP-66655", "s": "Logs and Indexes exist but are not visible on search.", "zd": 7, "cx_count": 7, "p": "Top"}, {"key": "LP-66300", "s": "UEBA: Outgoing logs from streamer service drops to zero", "zd": 7, "cx_count": 6, "p": "Top"}, {"key": "LP-73497", "s": "IPv4 Forwarding Disabled in 780 Flex Patch Causing SIEM-to-UEBA Log Fo", "zd": 7, "cx_count": 6, "p": "Major"}, {"key": "LP-68375", "s": "Log discarded by indexsearchers when a raw log contains a segment of s", "zd": 6, "cx_count": 5, "p": "Major"}, {"key": "LP-69362", "s": "Log Search Timeout Encountered in v7.7.1", "zd": 6, "cx_count": 5, "p": "Major"}, {"key": "LP-73311", "s": "System Notifications not starting the collection layer services after ", "zd": 6, "cx_count": 5, "p": "Top"}, {"key": "LP-66935", "s": "Too many open files on lookup indexsearcher.", "zd": 5, "cx_count": 5, "p": "Major"}, {"key": "LP-68170", "s": "Handle future dates in the last log received feature under devices.", "zd": 5, "cx_count": 5, "p": "Major"}];

function trend(data, key) {
  const n=data.length, xs=data.map((_,i)=>i), ys=data.map(d=>d[key]);
  const xm=xs.reduce((a,b)=>a+b,0)/n, ym=ys.reduce((a,b)=>a+b,0)/n;
  const slope=xs.reduce((s,x,i)=>s+(x-xm)*(ys[i]-ym),0)/xs.reduce((s,x)=>s+(x-xm)**2,0);
  const ic=ym-slope*xm;
  return data.map((d,i)=>({...d,trend:Math.max(0,parseFloat((ic+slope*i).toFixed(1)))}));
}

function Card({title,children,style={}}) {
  return (
    <div style={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:12,padding:20,...style}}>
      {title&&<div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#475569",marginBottom:14}}>{title}</div>}
      {children}
    </div>
  );
}
function PBadge({p}) {
  const c=PC[p]||"#64748b";
  return <span style={{padding:"2px 7px",borderRadius:4,fontSize:11,fontWeight:600,background:c+"22",color:c,border:"1px solid "+c+"44",whiteSpace:"nowrap"}}>{p}</span>;
}
function SBadge({s}) {
  const c=SC[s]||"#94a3b8";
  return <span style={{padding:"2px 7px",borderRadius:4,fontSize:11,fontWeight:600,background:c+"22",color:c,border:"1px solid "+c+"44",whiteSpace:"nowrap"}}>{s}</span>;
}
function Kpi({label,value,sub,color}) {
  return (
    <div style={{textAlign:"center",padding:"8px 16px",background:"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid "+color+"30"}}>
      <div style={{fontSize:24,fontWeight:700,color:color}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:color+"aa",fontWeight:600}}>{sub}</div>}
      <div style={{fontSize:10,color:"#64748b",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:1}}>{label}</div>
    </div>
  );
}

function getPathFromTab(tab) {
  return "/bug-dashboard/" + tab.toLowerCase().replace(/\s+/g, "-");
}

function getTabFromPath(pathname) {
  const tabMap = {
    "/bug-dashboard": "Overview",
    "/bug-dashboard/overview": "Overview",
    "/bug-dashboard/bug-table": "Bug Table",
    "/bug-dashboard/version-trends": "Version Trends",
    "/bug-dashboard/customer-impact": "Customer Impact"
  };
  return tabMap[pathname] || "Overview";
}

function BugDashboard() {
  const location = useLocation();
  const tab = getTabFromPath(location.pathname);
  
  const totalZD=DATA.reduce((s,r)=>s+r.zd,0);
  const openCount=DATA.filter(r=>r.status!=="Closed").length;
  const reopened=DATA.filter(r=>r.re==="Yes").length;
  const totalCx=164;

  return (
    <>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', flexWrap: 'wrap'}}>
        <div style={{width:34,height:34,borderRadius:8,background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18}}>{"\uD83D\uDC1B"}</div>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:'#f8fafc'}}>LogPoint Bug Intelligence</div>
          <div style={{fontSize:10,color:'#64748b',letterSpacing:'0.08em'}}>{"project = LogPoint \u00B7 issuetype = Bug \u00B7 createdDate \u2265 2025-01-01 \u00B7 ZD Count > 0 \u00B7 "}
            <span style={{color:'#38bdf8',fontWeight:600}}>276 bugs \u00B7 164 customers \u00B7 514 ZD tickets</span>
          </div>
        </div>
        <div style={{marginLeft:'auto',display:'flex',gap:10,flexWrap:'wrap'}}>
          <Kpi label="Jira Bugs"    value={276}       color="#3b82f6"/>
          <Kpi label="Customers"    value={totalCx}   sub="named orgs" color="#22c55e"/>
          <Kpi label="ZD Tickets"   value={totalZD}   color="#8b5cf6"/>
          <Kpi label="Still Open"   value={openCount} color="#f97316"/>
          <Kpi label="Reopened"     value={reopened}  color="#ef4444"/>
        </div>
      </div>
      <div style={{display:'flex',gap:0,marginBottom:'18px'}}>
        {TABS.map(t=>(
          <Link key={t} to={getPathFromTab(t)} style={{padding:'7px 18px',border:'none',background:'transparent',cursor:'pointer',color:tab===t?'#38bdf8':'#64748b',borderBottom:tab===t?'2px solid #38bdf8':'2px solid transparent',fontFamily:'inherit',fontSize:12,fontWeight:tab===t?600:400,letterSpacing:'0.05em',transition:'all 0.15s',textDecoration:'none'}}>{t}</Link>
        ))}
      </div>
      <Routes>
        <Route path="/" element={<Overview/>}/>
        <Route path="overview" element={<Overview/>}/>
        <Route path="bug-table" element={<BugTable/>}/>
        <Route path="version-trends" element={<VersionTrends/>}/>
        <Route path="customer-impact" element={<CustomerImpact/>}/>
      </Routes>
    </>
  );
}

export { BugDashboard, LpMindmap };

function Overview() {
  const top15=DATA.slice(0,15);
  const prioMap=DATA.reduce((m,r)=>{m[r.p]=(m[r.p]||0)+1;return m;},{});
  const prioData=Object.entries(prioMap).sort((a,b)=>(PO[a[0]]??9)-(PO[b[0]]??9)).map(([name,value])=>({name,value}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Top 15 Bugs by Zendesk Ticket Count">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={top15} layout="vertical" margin={{left:10,right:50,top:0,bottom:0}}>
              <XAxis type="number" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="key" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} width={82}/>
              <Tooltip cursor={{fill:"rgba(59,130,246,0.07)"}} contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:11}} formatter={(v,_,p)=>{const r=top15.find(x=>x.key===p.payload.key);return [v+" ZD tickets | "+r.cxc+" customers",""];}} labelFormatter={k=>k}/>
              <Bar dataKey="zd" radius={[0,4,4,0]}>
                {top15.map(r=><Cell key={r.key} fill={PC[r.p]||"#3b82f6"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:14,marginTop:8}}>
            {Object.entries(PC).map(([p,c])=>(
              <span key={p} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:10,height:10,borderRadius:2,background:c,display:"inline-block"}}/>{p}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Top 15 Bugs by Customer Breadth">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={TOP_CX} layout="vertical" margin={{left:10,right:50,top:0,bottom:0}}>
              <XAxis type="number" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="key" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} width={82}/>
              <Tooltip cursor={{fill:"rgba(34,197,94,0.07)"}} contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:11}} formatter={(v)=> [v+" customers impacted",""]} labelFormatter={k=>{const r=TOP_CX.find(x=>x.key===k);return k+(r?" — "+r.s.slice(0,50):"");}}/>
              <Bar dataKey="cx_count" radius={[0,4,4,0]}>
                {TOP_CX.map(r=><Cell key={r.key} fill={PC[r.p]||"#22c55e"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{fontSize:10,color:"#475569",marginTop:6}}>Number of distinct named customers per bug</div>
        </Card>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Priority Distribution (276 bugs)">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={prioData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({name,value})=>name+": "+value} fontSize={11}>
                {prioData.map(e=><Cell key={e.name} fill={PC[e.name]||"#64748b"}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Key Stats">
          {[
            ["Customers identified (real orgs)","164 across 514 ZD tickets","#22c55e"],
            ["Most impacted bug","LP-66914 — 29 customers, 37 ZD","#ef4444"],
            ["Most impacted customer","guardsix DK A/S — 51 ZD, 45 bugs","#f97316"],
            ["Peak release line","7.7.x — 81 bugs, 81 unique customers","#f59e0b"],
            ["7.8.x unresolved","12 open bugs affecting 65 customers","#f97316"],
            ["Bugs still open",""+DATA.filter(r=>r.status!=="Closed").length,"#f97316"],
            ["Reopened bugs","4 (7.6-7.7 era)","#ef4444"],
          ].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f",marginBottom:7,fontSize:12}}>
              <span style={{color:"#94a3b8"}}>{l}</span>
              <span style={{fontWeight:600,color:c,textAlign:"right",maxWidth:260}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Th({ col, label, sk, sd, setSk, setSd, setPg }) {
  return (
    <th onClick={() => { if (sk === col) setSd(d => d === "asc" ? "desc" : "asc"); else { setSk(col); setSd("desc"); setPg(0); } }}
      style={{ padding: "8px 10px", textAlign: "left", color: "#475569", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap", userSelect: "none", fontSize: 11 }}>
      {label} {sk === col ? <span style={{ color: "#38bdf8" }}>{sd === "asc" ? "\u2191" : "\u2193"}</span> : <span style={{ color: "#334155" }}>\u21C5</span>}
    </th>
  );
}

function BugTable() {
  const [sk,setSk]=useState("zd");
  const [sd,setSd]=useState("desc");
  const [fp,setFp]=useState("All");
  const [fs,setFs]=useState("All");
  const [q,setQ]=useState("");
  const [pg,setPg]=useState(0);
  const PAGE=50;

  const filtered=useMemo(()=>{
    let d=[...DATA];
    if(fp!=="All")d=d.filter(r=>r.p===fp);
    if(fs!=="All")d=d.filter(r=>r.status===fs);
    if(q)d=d.filter(r=>r.s.toLowerCase().includes(q.toLowerCase())||r.key.toLowerCase().includes(q.toLowerCase()));
    d.sort((a,b)=>{
      let va=a[sk],vb=b[sk];
      if(sk==="p"){va=PO[va]??9;vb=PO[vb]??9;}
      if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}
      return sd==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0);
    });
    return d;
  },[sk,sd,fp,fs,q]);

  const pages=Math.ceil(filtered.length/PAGE);
  const rows=filtered.slice(pg*PAGE,(pg+1)*PAGE);

  return (
    <Card>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>{setQ(e.target.value);setPg(0);}} placeholder="Search key or summary..."
          style={{flex:1,minWidth:180,padding:"6px 11px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,outline:"none"}}/>
        <select value={fp} onChange={e=>{setFp(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {["All","Top","Major","Minor","None"].map(p=><option key={p}>{p}</option>)}
        </select>
        <select value={fs} onChange={e=>{setFs(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {["All","Closed","Open","In Progress","In Review"].map(s=><option key={s}>{s}</option>)}
        </select>
        <span style={{fontSize:12,color:"#475569"}}>{filtered.length} results</span>
        <div style={{display:"flex",gap:6,marginLeft:"auto",alignItems:"center"}}>
          <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0}
            style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg===0?"#334155":"#94a3b8",cursor:pg===0?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2190 Prev"}</button>
          <span style={{fontSize:11,color:"#475569"}}>{pg+1}/{pages||1}</span>
          <button onClick={()=>setPg(p=>Math.min(pages-1,p+1))} disabled={pg>=pages-1}
            style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg>=pages-1?"#334155":"#94a3b8",cursor:pg>=pages-1?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"Next \u2192"}</button>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{borderBottom:"1px solid #1e3a5f"}}>
              <Th col="key" label="Key" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="zd" label="ZD #" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="cxc" label="Customers" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="p" label="Priority" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="status" label="Status" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="v" label="Aff. Ver" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <Th col="re" label="Reopen" sk={sk} sd={sd} setSk={setSk} setSd={setSd} setPg={setPg} />
              <th style={{padding:"8px 10px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:11}}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.key} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}>
                  <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer" style={{color:"#38bdf8",textDecoration:"none",fontWeight:600}}>{r.key}</a>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:r.zd>=10?"#ef4444":r.zd>=5?"#f97316":"#e2e8f0"}}>{r.zd}</td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>
                  <span style={{fontWeight:700,color:r.cxc>=10?"#22c55e":r.cxc>=5?"#38bdf8":"#94a3b8"}}>{r.cxc}</span>
                </td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><PBadge p={r.p}/></td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><SBadge s={r.status}/></td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap",color:"#94a3b8"}}>{r.v}</td>
                <td style={{padding:"7px 10px",textAlign:"center"}}>{r.re==="Yes"?<span style={{color:"#ef4444",fontWeight:700}}>{"\u26A0"}</span>:<span style={{color:"#334155"}}>{"\u2014"}</span>}</td>
                <td style={{padding:"7px 10px",color:"#cbd5e1",maxWidth:340}}>
                  <span title={r.s}>{r.s.length>85?r.s.slice(0,85)+"\u2026":r.s}</span>
                  {r.cx.length>0&&<div style={{fontSize:10,color:"#475569",marginTop:2}}>{r.cx.slice(0,3).join(", ")}{r.cxc>3?" +("+(r.cxc-3)+" more)":""}</div>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function VersionTrends() {
  const [metric,setMetric]=useState("zd");
  const opts=[
    {k:"zd",   label:"ZD Tickets",         color:"#38bdf8"},
    {k:"bugs", label:"Bug Count",           color:"#818cf8"},
    {k:"avg",  label:"Avg ZD / Bug",        color:"#f59e0b"},
    {k:"top",  label:"Top Priority Bugs",   color:"#ef4444"},
    {k:"open", label:"Open Bugs",           color:"#f97316"},
    {k:"cx",   label:"Unique Customers",    color:"#22c55e"},
  ];
  const active=opts.find(o=>o.k===metric);
  const td=trend(RT,metric);
  const peak=[...RT].sort((a,b)=>b[metric]-a[metric])[0];
  const last=RT[RT.length-1];
  const prev=RT[RT.length-2];
  const delta=last[metric]-prev[metric];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card title="Release-line trend — bug volume, customer impact and quality metrics">
        <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
          {opts.map(o=>(
            <button key={o.k} onClick={()=>setMetric(o.k)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid "+(metric===o.k?o.color:"#1e3a5f"),background:metric===o.k?o.color+"18":"transparent",color:metric===o.k?o.color:"#64748b",fontFamily:"inherit",fontSize:12,fontWeight:metric===o.k?700:400,cursor:"pointer",transition:"all 0.15s"}}>{o.label}</button>
          ))}
          <div style={{marginLeft:"auto",fontSize:12}}>
            <span style={{color:"#64748b"}}>Latest ({last.r}) vs prior ({prev.r}): </span>
            <span style={{color:delta<0?"#22c55e":delta>0?"#ef4444":"#94a3b8",fontWeight:700}}>
              {delta>0?"\u25B2":delta<0?"\u25BC":"="} {Math.abs(delta)} {delta<0?" (improving)":delta>0?" (worsening)":" (flat)"}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={td} margin={{left:0,right:24,top:10,bottom:8}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
            <XAxis dataKey="r" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}} formatter={(v,name)=>[v,name==="trend"?"Linear trend":active.label]}/>
            <Area type="monotone" dataKey={metric} fill={active.color+"18"} stroke={active.color} strokeWidth={2} dot={{r:4,fill:active.color,strokeWidth:0}} activeDot={{r:6,fill:active.color}} name={active.label}/>
            <Line type="monotone" dataKey="trend" stroke="#475569" strokeWidth={1.5} strokeDasharray="6 3" dot={false} name="trend"/>
            <ReferenceLine x={peak.r} stroke="#f59e0b" strokeDasharray="4 4" label={{value:"Peak: "+peak[metric],fill:"#f59e0b",fontSize:10,position:"insideTopRight"}}/>
          </ComposedChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:18,marginTop:10,paddingTop:10,borderTop:"1px solid #1e3a5f"}}>
          <span style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:6}}><span style={{width:20,height:2,background:active.color,display:"inline-block"}}/>{active.label}</span>
          <span style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:6}}><span style={{width:20,borderTop:"1.5px dashed #475569",display:"inline-block"}}/>Linear trendline</span>
        </div>
      </Card>

      <Card title="Release line summary — bugs, customers, open issues">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1e3a5f"}}>
                {["Release","Bugs","ZD Tickets","Avg ZD/Bug","Top Priority","Open Bugs","Unique Customers"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#475569",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RT.map((r,i)=>(
                <tr key={r.r} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.12)"}}>
                  <td style={{padding:"8px 12px",fontWeight:700,color:"#7dd3fc"}}>{r.r}</td>
                  <td style={{padding:"8px 12px"}}>{r.bugs}</td>
                  <td style={{padding:"8px 12px",fontWeight:700,color:r.zd>=100?"#ef4444":r.zd>=50?"#f97316":"#e2e8f0"}}>{r.zd}</td>
                  <td style={{padding:"8px 12px",color:"#94a3b8"}}>{r.avg}</td>
                  <td style={{padding:"8px 12px",color:r.top>10?"#ef4444":r.top>5?"#f97316":"#94a3b8"}}>{r.top||"\u2014"}</td>
                  <td style={{padding:"8px 12px",color:r.open>0?"#f97316":"#22c55e"}}>{r.open>0?"\u26A0 "+r.open:"All closed"}</td>
                  <td style={{padding:"8px 12px",fontWeight:700,color:"#22c55e"}}>{r.cx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function CustomerImpact() {
  const [q,setQ]=useState("");
  const [pg,setPg]=useState(0);
  const PAGE=20;

  const filtered=useMemo(()=>{
    if(!q) return CX;
    return CX.filter(c=>c.name.toLowerCase().includes(q.toLowerCase()));
  },[q]);
  const pages=Math.ceil(filtered.length/PAGE);
  const slice=filtered.slice(pg*PAGE,(pg+1)*PAGE);

  const top10=CX.slice(0,10);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>

      <Card title="Top 10 customers by Zendesk ticket count">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={top10} layout="vertical" margin={{left:200,right:50,top:4,bottom:4}}>
            <XAxis type="number" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              width={200}
              tick={(props)=>{
                const {x,y,payload}=props;
                const name=payload.value;
                const words=name.split(" ");
                const lines=[];
                let cur="";
                for(const w of words){
                  if((cur+" "+w).trim().length>28&&cur.length>0){lines.push(cur);cur=w;}
                  else{cur=(cur+" "+w).trim();}
                }
                if(cur)lines.push(cur);
                return (
                  <g transform={"translate("+x+","+y+")"}>
                    {lines.map((line,i)=>(
                      <text key={i} x={-6} y={0} dy={(i-(lines.length-1)/2)*14}
                        textAnchor="end" fill="#94a3b8" fontSize={11}>{line}</text>
                    ))}
                  </g>
                );
              }}
            />
            <Tooltip
              cursor={{fill:"rgba(34,197,94,0.07)"}}
              contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}
              formatter={(v,n,p)=>[v+" ZD tickets | "+p.payload.bugs+" Jira bugs",""]}
              labelFormatter={v=>v}
            />
            <Bar dataKey="zd" radius={[0,4,4,0]} fill="#22c55e" label={{position:"right",fill:"#22c55e",fontSize:11,fontWeight:700}}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Customer distribution by region">
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,alignItems:"center"}}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={REG} dataKey="cx" nameKey="region" cx="50%" cy="50%" outerRadius={90} label={({region,cx})=>region+": "+cx} fontSize={11}>
                {REG.map((e,i)=><Cell key={e.region} fill={RC[i%RC.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}} formatter={(v,n,p)=>[v+" customers | "+p.payload.zd+" ZD tickets",p.payload.region]}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {REG.map((r,i)=>(
              <div key={r.region} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f"}}>
                <span style={{width:10,height:10,borderRadius:2,background:RC[i%RC.length],flexShrink:0,display:"inline-block"}}/>
                <span style={{fontSize:12,color:"#e2e8f0",flex:1}}>{r.region}</span>
                <span style={{fontSize:12,fontWeight:700,color:RC[i%RC.length]}}>{r.cx}</span>
                <span style={{fontSize:11,color:"#475569"}}>{r.zd} ZD</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card title={"All 164 named customers — " + filtered.length + " shown"}>
        <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
          <input value={q} onChange={e=>{setQ(e.target.value);setPg(0);}} placeholder="Search customer name..."
            style={{flex:1,minWidth:200,padding:"6px 11px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,outline:"none"}}/>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0}
              style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg===0?"#334155":"#94a3b8",cursor:pg===0?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2190"}</button>
            <span style={{fontSize:11,color:"#475569"}}>{pg+1}/{pages||1}</span>
            <button onClick={()=>setPg(p=>Math.min(pages-1,p+1))} disabled={pg>=pages-1}
              style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg>=pages-1?"#334155":"#94a3b8",cursor:pg>=pages-1?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2192"}</button>
          </div>
          <span style={{fontSize:11,color:"#475569"}}>{filtered.length} customers</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1e3a5f"}}>
                {["#","Customer","ZD Tickets","Jira Bugs","Impacted Versions (sample)"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:11}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slice.map((c,i)=>(
                <tr key={c.name} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                  <td style={{padding:"7px 10px",color:"#475569",fontSize:11}}>{pg*PAGE+i+1}</td>
                  <td style={{padding:"7px 10px",fontWeight:600,color:"#f1f5f9"}}>{c.name}</td>
                  <td style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:c.zd>=10?"#22c55e":c.zd>=5?"#38bdf8":"#94a3b8"}}>{c.zd}</td>
                  <td style={{padding:"7px 10px",textAlign:"center",color:"#94a3b8"}}>{c.bugs}</td>
                  <td style={{padding:"7px 10px",fontSize:11}}>
                    {c.keys.slice(0,4).map(k=>(
                      <a key={k} href={"https://logpoint.atlassian.net/browse/"+k} target="_blank" rel="noreferrer"
                        style={{color:"#38bdf8",textDecoration:"none",marginRight:6,fontWeight:600}}>{k}</a>
                    ))}
                    {c.keys.length>4&&<span style={{color:"#475569"}}>+{c.keys.length-4} more</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function LpMindmap() {
  return (
    <div style={{
      textAlign: "center",
      padding: "50px",
      fontSize: "32px",
      color: "#38bdf8",
      fontWeight: "bold"
    }}>
      Hello World! 👋
    </div>
  );
}