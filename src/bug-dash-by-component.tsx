import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
         PieChart, Pie, ComposedChart, Line, CartesianGrid, LineChart,
         RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const PC  = { Top:"#ef4444", Major:"#f97316", Minor:"#eab308", None:"#64748b" };
const SC  = { Closed:"#22c55e", Open:"#3b82f6", "In Progress":"#a855f7", "In Review":"#f59e0b" };
const PO  = { Top:0, Major:1, Minor:2, None:3 };
const CC  = ["#38bdf8","#818cf8","#34d399","#f59e0b","#f87171","#a78bfa","#fb923c","#e879f9","#4ade80","#fbbf24"];
const TABS = ["Overview","Component Analysis","Trend Patterns","Bug Table","Open Bugs"];

const DATA = [
  {key:"LP-75952",s:"Local Privilege Escalation in Seconds via Copy Fail Vulnerability (CVE-2026-31431)",status:"Closed",p:"Top",zd:14,v:"7.8.2.0",re:"No",comp:"Build & Deployment",created:"2026-05-01"},
  {key:"LP-73497",s:"IPv4 Forwarding Disabled in 780 Flex Patch Causing SIEM-to-UEBA Log Forwarding Failure",status:"Closed",p:"Major",zd:7,v:"7.8.2.0",re:"No",comp:"Build & Deployment",created:"2026-02-27"},
  {key:"LP-75881",s:"Logpoint UI not responsive because of uvicorn workers stuck on mongo topology discover",status:"Closed",p:"Top",zd:6,v:"7.9.0",re:"No",comp:"Web Configuration",created:"2026-04-28"},
  {key:"LP-73311",s:"System Notifications not starting the collection layer services after sufficient storage s",status:"Closed",p:"Top",zd:6,v:"7.2.0",re:"No",comp:"Data Pipeline",created:"2026-02-11"},
  {key:"LP-76043",s:"Hyper-V based systems inaccessible after 7.9.0 upgrade",status:"In Progress",p:"Major",zd:5,v:"7.9.0.4",re:"No",comp:"Build & Deployment",created:"2026-05-09"},
  {key:"LP-75801",s:"Issue observed in alert_engine where alert queries have \"TABLE\" ",status:"Closed",p:"Major",zd:5,v:"7.8.0",re:"No",comp:"Alert & Incidents",created:"2026-04-22"},
  {key:"LP-73329",s:"Patch uploads and installs are not consistent in LP 7.8",status:"Closed",p:"Major",zd:5,v:"7.8.1.0",re:"No",comp:"Web Configuration",created:"2026-02-13"},
  {key:"LP-73301",s:"Logpoint v7.8.4.0 upgrade failed during mongosh upgrade. ",status:"Closed",p:"Top",zd:5,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-02-10"},
  {key:"LP-70312",s:"Logpoint 7.8.2:  su command cannot be run by li-admin user",status:"Closed",p:"Major",zd:5,v:"7.8.2.0",re:"No",comp:"Build & Deployment",created:"2026-01-13"},
  {key:"LP-76329",s:"Wheel packages not updated in 7.9.2 ",status:"Closed",p:"Top",zd:4,v:"7.9.2.0",re:"No",comp:"Build & Deployment",created:"2026-05-29"},
  {key:"LP-76033",s:"Assess Exposure and Mitigation for Linux ?Dirty Frag? Local Privilege Escalation Vulnerabi",status:"Closed",p:"Major",zd:4,v:"7.9.0",re:"No",comp:"Build & Deployment",created:"2026-05-08"},
  {key:"LP-74949",s:"Issues installing LogPoint ISO from USB drive",status:"Closed",p:"None",zd:4,v:"7.7.0",re:"No",comp:"Build & Deployment",created:"2026-03-09"},
  {key:"LP-70584",s:"Autotuner service creating too many normalizer services resulting in memory exhaustion",status:"Closed",p:"Major",zd:4,v:"7.7.0.3",re:"No",comp:"Data Analytics",created:"2026-02-05"},
  {key:"LP-76194",s:"Reports failing with java.lang.ClassCastException",status:"In Review",p:"Top",zd:3,v:"7.8.0.0",re:"No",comp:"Data Analytics",created:"2026-05-21"},
  {key:"LP-75880",s:"Issue observed in alerts created from searchmaster and director API without defining searc",status:"Closed",p:"Top",zd:3,v:"7.8.0",re:"No",comp:"Alert & Incidents",created:"2026-04-28"},
  {key:"LP-75683",s:"False positive alerts and dashboard widget results triggered due to newline character in s",status:"Closed",p:"Major",zd:3,v:"7.9.0",re:"No",comp:"Alert & Incidents",created:"2026-04-15"},
  {key:"LP-73496",s:"Enrichment service in subscriber mode uses deleted files, filling up /opt/makalu/appstore ",status:"Closed",p:"Top",zd:3,v:"7.7.0",re:"Yes",comp:"Data Analytics",created:"2026-02-27"},
  {key:"LP-73489",s:"Cannot upload soar license in director connected logpoint.",status:"Closed",p:"Major",zd:3,v:"7.8.4.0",re:"No",comp:"SOAR Integration",created:"2026-02-27"},
  {key:"LP-73341",s:"LPC can't connect to a Data Node residing behind a public network.",status:"Closed",p:"Major",zd:3,v:"7.8.0",re:"No",comp:"Web Configuration",created:"2026-02-16"},
  {key:"LP-76000",s:"Stale tunnel 10001 interface IP in api_config_service configuration file on SIEM",status:"Closed",p:"Top",zd:2,v:"7.9.0",re:"No",comp:"LPSM",created:"2026-05-01"},
  {key:"LP-75917",s:"Embedded widget url not working after v7.9.0",status:"Closed",p:"Major",zd:2,v:"7.9.0.4",re:"No",comp:"Web Configuration",created:"2026-04-29"},
  {key:"LP-75848",s:"IndexSearcher retention job fails with generic error message, lacking detailed logs for tr",status:"Open",p:"Minor",zd:2,v:"7.8.0",re:"No",comp:"Data Analytics",created:"2026-04-27"},
  {key:"LP-75811",s:"Alertrules created from API with flush_on_trigger: true is triggered only once and then ne",status:"Closed",p:"Top",zd:2,v:"7.7.0.2",re:"No",comp:"Alert & Incidents",created:"2026-04-23"},
  {key:"LP-75034",s:"LPC containers failing to start up after system reboot",status:"Closed",p:"Top",zd:2,v:"7.5.0.0",re:"No",comp:"Collection",created:"2026-03-16"},
  {key:"LP-73405",s:" Log Sources per?page selection doesn?t change rows displayed; list stays at 10",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",comp:"Web Configuration",created:"2026-02-23"},
  {key:"LP-73397",s:"SIEM node license details not visible in co?managed Fabric mode",status:"Closed",p:"Major",zd:2,v:"7.8.4.0",re:"No",comp:"Web Configuration",created:"2026-02-20"},
  {key:"LP-73360",s:"ha_collector reboot breaks ha_forwarder communication causing storage buildup on ha_forwar",status:"Closed",p:"Major",zd:2,v:"7.8.4.0",re:"No",comp:"Data Pipeline",created:"2026-02-18"},
  {key:"LP-73313",s:"False Positive Incidents Generated for Aggregation Queries After Upgrade to 7.9.0.0",status:"Closed",p:"Top",zd:2,v:"7.9.0.0",re:"No",comp:"Data Analytics",created:"2026-02-11"},
  {key:"LP-70664",s:"Duplicate alert_id & alertrule_id generated by Alertrules API causing missing Alerts",status:"Closed",p:"Major",zd:2,v:"7.7.0.1",re:"No",comp:"Alert & Incidents",created:"2026-02-06"},
  {key:"LP-70434",s:"Searches containing wildcards in the query times out.",status:"Closed",p:"Top",zd:2,v:"7.5.0",re:"No",comp:"Data Analytics",created:"2026-01-26"},
  {key:"LP-70431",s:"Released version of s3fs tools not compatible with 7.8.3.",status:"Closed",p:"Top",zd:2,v:"7.8.0",re:"No",comp:"Build & Deployment",created:"2026-01-23"},
  {key:"LP-70394",s:"Network interface name changes across reboots",status:"Closed",p:"Major",zd:2,v:"7.8.0.2",re:"No",comp:"Build & Deployment",created:"2026-01-22"},
  {key:"LP-70350",s:"Results are missing for aliased stream query values in the PDF report format ",status:"Closed",p:"Major",zd:2,v:"7.7.1.0",re:"No",comp:"Data Analytics",created:"2026-01-19"},
  {key:"LP-70262",s:"Config regeneration stuck on write syscall",status:"Closed",p:"Major",zd:2,v:"7.7.0.3",re:"No",comp:"Data Analytics",created:"2026-01-09"},
  {key:"LP-76425",s:"Failure to deserialize indexsearcher response when delayedMaps key contains surrogate pair",status:"Open",p:"None",zd:1,v:"7.9.0.2",re:"No",comp:"Alert & Incidents",created:"2026-06-05"},
  {key:"LP-76366",s:"Configuration restore doesn't restore/update the vpn certificate",status:"Open",p:"Major",zd:1,v:"7.9.0.4",re:"No",comp:"Web Configuration",created:"2026-06-02"},
  {key:"LP-76354",s:"Upgrade fails - GRUB script writes incorrect EFI partition to /etc/fstab on ZFS systems wi",status:"Open",p:"None",zd:1,v:"7.7.0.3",re:"No",comp:"Build & Deployment",created:"2026-06-01"},
  {key:"LP-76241",s:"Unable to restore configuration and logs backup in other machine",status:"In Progress",p:"Top",zd:1,v:"7.9.0.4",re:"No",comp:"Web Configuration",created:"2026-05-26"},
  {key:"LP-76224",s:"Port 5050 not opened in AgentX",status:"Open",p:"None",zd:1,v:"7.8.4.0",re:"No",comp:"Collection",created:"2026-05-25"},
  {key:"LP-76212",s:"[UEBA] IP forwarding not enabled on distributed search head when selected repos belong onl",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",comp:"Build & Deployment",created:"2026-05-22"},
  {key:"LP-76202",s:"Failed patch installations are not visible in the updates section of the UI",status:"In Progress",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Web Configuration",created:"2026-05-21"},
  {key:"LP-76189",s:"Alert Dialog Box: Incorrect Space Formatting in Query on Overview Tab",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",comp:"UX Analytics",created:"2026-05-20"},
  {key:"LP-76159",s:"Inactivity Threshold doesn't accept \"60\" as valid value",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",comp:"Web Configuration",created:"2026-05-18"},
  {key:"LP-76143",s:"Premerger halted at 0 UTC",status:"In Progress",p:"Top",zd:1,v:"7.8.0.2",re:"No",comp:"Data Analytics",created:"2026-05-15"},
  {key:"LP-76140",s:"HTTP notification fails for JSON array body due to dict-only update logic",status:"Closed",p:"Major",zd:1,v:"7.4.0",re:"No",comp:"Alert & Incidents",created:"2026-05-15"},
  {key:"LP-76108",s:"Premerger query counter leak leading to stall of the detection pipeline",status:"Closed",p:"Top",zd:1,v:"7.8.0",re:"No",comp:"Data Analytics",created:"2026-05-14"},
  {key:"LP-76058",s:"Raw Syslog Forwarder forwards all localhost logs to remote target even when only HTTP Coll",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",comp:"Data Pipeline",created:"2026-05-11"},
  {key:"LP-76041",s:"Some fields are missing in alert incidents for delayed logs",status:"Open",p:"Major",zd:1,v:"7.7.0.0",re:"No",comp:"Alert & Incidents",created:"2026-05-09"},
  {key:"LP-76021",s:"SaaS: View Incident Data fails with 'No Response from Server'",status:"Closed",p:"Top",zd:1,v:"7.8.0",re:"No",comp:"Alert & Incidents",created:"2026-05-08"},
  {key:"LP-75996",s:"Sorting order broken in Parallel Coordinates and Sankey graphs; fields displayed alphabeti",status:"Closed",p:"Major",zd:1,v:"7.9.0.4",re:"No",comp:"Web Configuration",created:"2026-05-06"},
  {key:"LP-75973",s:"Over-triggering of networkd-dispatcher due to routeable interface docker0 ",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-05-04"},
  {key:"LP-75969",s:"Search domain trailing space causes parsing mismatch on update_dnsmasq_netplan.py",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-05-04"},
  {key:"LP-75967",s:"Race condition when multiple instances of update_dnsmasq.py run causing invalid entry on /",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-05-04"},
  {key:"LP-75966",s:"Incorrect resolvectl parsing in update_dnsmasq.py",status:"In Review",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-05-04"},
  {key:"LP-75965",s:"VLAN DNS not handled in runtime extraction in update_dnsmasq.py",status:"Open",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Build & Deployment",created:"2026-05-04"},
  {key:"LP-75866",s:"Syslog Forwarder Architecture Revamp to Address Security, Data Reliability, and Scalabilit",status:"Open",p:"None",zd:1,v:"7.8.0.2",re:"No",comp:"Collection",created:"2026-04-27"},
  {key:"LP-75839",s:"Patch install can leave webapiserver log path absent if symlink is present breaking servic",status:"Closed",p:"Major",zd:1,v:"7.9.0",re:"No",comp:"Build & Deployment",created:"2026-04-24"},
  {key:"LP-75834",s:"RBAC bypass in Syslog Forwarder: users with no permissions can modify forwarding configura",status:"Closed",p:"Major",zd:1,v:"7.6.0",re:"No",comp:"Web Configuration",created:"2026-04-24"},
  {key:"LP-75830",s:"Duplicate devices created in Syslog Forwarder when device is re-added with same IP but dif",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Web Configuration",created:"2026-04-24"},
  {key:"LP-75829",s:"Deleted devices from Main Logpoint are not removed from Syslog Forwarder after sync and ca",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Web Configuration",created:"2026-04-24"},
  {key:"LP-75828",s:"Devices without distributed collector are synced to Syslog Forwarder, causing confusion an",status:"Open",p:"Minor",zd:1,v:"7.6.0",re:"No",comp:"Collection",created:"2026-04-24"},
  {key:"LP-75827",s:"Removing unused devices in Syslog Forwarder UI removes valid devices if devices are added ",status:"Closed",p:"Major",zd:1,v:"7.9.0",re:"No",comp:"Collection",created:"2026-04-24"},
  {key:"LP-75826",s:"Cannot set path to \"/\" in Export management using FTP",status:"In Progress",p:"Minor",zd:1,v:"7.9.0",re:"No",comp:"Web Configuration",created:"2026-04-23"},
  {key:"LP-75717",s:"Alertrules created from the API show an empty box in alert throttling when editing them fr",status:"Closed",p:"Major",zd:1,v:"7.7.0.2",re:"No",comp:"Web Configuration",created:"2026-04-16"},
  {key:"LP-75676",s:"Inconsistency in Extracting Vendor Alert Rules Between UI & Alertrules API",status:"Closed",p:"Major",zd:1,v:"7.9.0.0",re:"No",comp:"Alert & Incidents",created:"2026-04-15"},
  {key:"LP-75665",s:"Migration of Mongo Credentials to Keystore fails silently in SaaS",status:"Closed",p:"Major",zd:1,v:"7.9.0.2",re:"No",comp:"Build & Deployment",created:"2026-04-13"},
  {key:"LP-75658",s:"Issues Encountered While Using Sync Functionality Across Data Nodes via Search Head",status:"In Progress",p:"Major",zd:1,v:"7.7.0.3",re:"No",comp:"Web Configuration",created:"2026-04-10"},
  {key:"LP-75611",s:"guardsix UI: Some of the local guardsix users are missing on Web-GUI under User Accounts",status:"Closed",p:"Major",zd:1,v:"7.6.1.0",re:"Yes",comp:"Web Configuration",created:"2026-04-07"},
  {key:"LP-75595",s:"Inconsistent Editing feature in Shared Alert Rules",status:"Open",p:"Minor",zd:1,v:"7.8.4.0",re:"No",comp:"Alert & Incidents",created:"2026-04-06"},
  {key:"LP-75480",s:"Logpoint UI published in port 8443 introducing a security risk",status:"Closed",p:"Minor",zd:1,v:"7.8.0",re:"No",comp:"Web Configuration",created:"2026-04-02"},
  {key:"LP-75479",s:"Predictable network naming fails on the system where udev rules are applied, and the conne",status:"Closed",p:"Top",zd:1,v:"7.9.0.2",re:"No",comp:"Build & Deployment",created:"2026-04-02"},
  {key:"LP-75196",s:"Not able to SSH via partner user",status:"Closed",p:"None",zd:1,v:"7.8.2.0",re:"No",comp:"Build & Deployment",created:"2026-03-31"},
  {key:"LP-75190",s:"Guardsix SIEM dashboard totals mismatch: Mongo alert_incidents vs Logpoint audit logs",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Alert & Incidents",created:"2026-03-30"},
  {key:"LP-75166",s:"Custom Metadata values are not displayed when used as Jinja Placeholders in Incident Data",status:"Closed",p:"Major",zd:1,v:"7.8.0.0",re:"No",comp:"Alert & Incidents",created:"2026-03-27"},
  {key:"LP-75149",s:"Precondition Failure on /opt/makalu/storage Despite Sufficient Available Free Space",status:"Closed",p:"Top",zd:1,v:"7.8.0.2",re:"No",comp:"Build & Deployment",created:"2026-03-26"},
  {key:"LP-75127",s:"CIFS collection halts during upgrades in customer environment",status:"Open",p:"Minor",zd:1,v:"7.7.1.0",re:"No",comp:"Collection",created:"2026-03-25"},
  {key:"LP-75120",s:"Enrich sync service failing to open port in distributed collector",status:"Closed",p:"Major",zd:1,v:"7.8.0.2",re:"No",comp:"Data Pipeline",created:"2026-03-24"},
  {key:"LP-75083",s:"Duo authentication doesn't work due to the outdated duo_universal_python library",status:"Closed",p:"Top",zd:1,v:"7.7.0",re:"No",comp:"Web Configuration",created:"2026-03-19"},
  {key:"LP-75050",s:"Threat Intelligence configuration cannot be deleted in Logpoint configured as an Enrichmen",status:"Closed",p:"Minor",zd:1,v:"7.8.0.2",re:"No",comp:"Web Configuration",created:"2026-03-16"},
  {key:"LP-75010",s:"Quoted definer extracts value without quotes but retains quotes in field name",status:"Closed",p:"Minor",zd:1,v:"7.8.0.2",re:"No",comp:"Data Analytics",created:"2026-03-12"},
  {key:"LP-74968",s:"Enrichment Propagation: Enrichment Inbox/Outbox Folders Not Cleaned Up After Mode Change",status:"Closed",p:"None",zd:1,v:"7.8.4.0",re:"No",comp:"Data Pipeline",created:"2026-03-10"},
  {key:"LP-74967",s:"Sync: LogSources Not Visible in Web GUI After Sync Import due to Missing LogSourceTemplate",status:"Closed",p:"Major",zd:1,v:"7.8.4.0",re:"No",comp:"Web Configuration",created:"2026-03-10"},
  {key:"LP-74964",s:"Upgrade to 7.9.0.1 Fails Due to Race Condition Between runit Startup and MongoDB Force-Sto",status:"Closed",p:"None",zd:1,v:"7.9.0.1",re:"No",comp:"Build & Deployment",created:"2026-03-09"},
  {key:"LP-74921",s:"Misleading \"Permission Denied\" Error When Querying Non-Existent Incident Object  Summary",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Alert & Incidents",created:"2026-03-06"},
  {key:"LP-74879",s:"Sync feature not respecting the usability of HA configured repos",status:"Closed",p:"None",zd:1,v:"7.8.4.0",re:"No",comp:"Web Configuration",created:"2026-03-04"},
  {key:"LP-73764",s:"Potential malicious content detected in fields: email_template",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Alert & Incidents",created:"2026-03-02"},
  {key:"LP-73422",s:"Website not rendering for users with operator permission when trying to login to Search He",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Web Configuration",created:"2026-02-24"},
  {key:"LP-73406",s:"Inconsistency in kernel installation on logpoint installed on dell server via 7.8.0 ISO.",status:"Closed",p:"Major",zd:1,v:"7.8.0.2",re:"No",comp:"Build & Deployment",created:"2026-02-23"},
  {key:"LP-73339",s:"CVE-2025-66516 Reported by customer",status:"Closed",p:"Major",zd:1,v:"7.7.0",re:"No",comp:"Data Analytics",created:"2026-02-16"},
  {key:"LP-73338",s:"NullPointer Exception Observed in Premerger when computing timechart queries with large ti",status:"Closed",p:"None",zd:1,v:"7.9.0.0",re:"No",comp:"Data Analytics",created:"2026-02-16"},
  {key:"LP-73328",s:"Admin user \"Last Login Time\" updates on UI refresh in Distributed Mode without actual lo",status:"Closed",p:"Minor",zd:1,v:"7.7.1.0",re:"No",comp:"Web Configuration",created:"2026-02-13"},
  {key:"LP-70615",s:"Search via Search Head fails with AttributeError unless Search Head is explicitly selected",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",comp:"Web Configuration",created:"2026-02-06"},
  {key:"LP-70583",s:"Issue seen in report engine log of Stormshield server",status:"Closed",p:"Major",zd:1,v:"7.8.1.0",re:"No",comp:"Data Analytics",created:"2026-02-05"},
  {key:"LP-70480",s:"AlertRules read_api fails for cloned vendor alerts with search_interval_minute set as None",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",comp:"Alert & Incidents",created:"2026-02-03"},
  {key:"LP-70479",s:"Compatibility Check button for UEBA not enabled",status:"Closed",p:"Major",zd:1,v:"7.8.1.0",re:"No",comp:"Data Analytics",created:"2026-02-03"},
  {key:"LP-70472",s:"Redis connection timeout exception on Filekeeper Service during services restart.",status:"Closed",p:"None",zd:1,v:"7.5.0",re:"No",comp:"Data Pipeline",created:"2026-02-02"},
  {key:"LP-70465",s:"Logpoint installation take more time during installation",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",comp:"Build & Deployment",created:"2026-02-02"},
  {key:"LP-70462",s:"Concern regarding CVE-2025-61984",status:"Closed",p:"None",zd:1,v:"7.7.1.0",re:"No",comp:"Build & Deployment",created:"2026-01-30"},
  {key:"LP-70430",s:"SFTP Backup and Restore fails after upgrade to 7.8.3 due to missing loginspect user in All",status:"Closed",p:"Top",zd:1,v:"7.8.3.0",re:"No",comp:"Build & Deployment",created:"2026-01-23"},
  {key:"LP-70402",s:"UEBA PreConfiguration Plugin v5.2.1 not available on ServiceDesk",status:"Closed",p:"None",zd:1,v:"7.5.0.5",re:"No",comp:"UEBA Integration",created:"2026-01-22"},
  {key:"LP-70219",s:"Issue with grub installation in case of unused disk",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",comp:"Build & Deployment",created:"2026-01-02"},
  {key:"LP-70228",s:"CVE-2023-46604 - activemq-client",status:"Closed",p:"Major",zd:1,v:"7.7.0.0",re:"No",comp:"Data Pipeline",created:"2026-01-06"},
  {key:"LP-70283",s:"hrStorageUsed.2 (OID 1.3.6.1.2.1.25.2.3.1.6.2) may not return disk usage on Linux",status:"Closed",p:"Major",zd:1,v:"7.6.0.0",re:"No",comp:"Web Configuration",created:"2026-01-12"},
  {key:"LP-70308",s:"Potential Vulnerability in ODBC Enrichment Plugin",status:"Closed",p:"Major",zd:1,v:"7.8.0",re:"No",comp:"Web Configuration",created:"2026-01-13"},
  {key:"LP-70392",s:"Grub-pc configuration fixed not working on some servers",status:"Closed",p:"Major",zd:1,v:"7.7.0.3",re:"No",comp:"Build & Deployment",created:"2026-01-21"},
  {key:"LP-70393",s:"7.8.3 upgrade taking excessive time on high data volume systems.",status:"Closed",p:"Top",zd:1,v:"7.8.3.0",re:"No",comp:"Build & Deployment",created:"2026-01-21"},
  {key:"LP-70400",s:"'process toList' takes all the results even after 'process spot' command",status:"Closed",p:"Major",zd:1,v:"7.7.1.0",re:"No",comp:"Data Pipeline",created:"2026-01-22"},
];

const COMP     = [{"comp": "Build & Deployment", "bugs": 30, "zd": 72, "open": 6, "top": 8, "avg": 2.4}, {"comp": "Web Configuration", "bugs": 28, "zd": 42, "open": 6, "top": 3, "avg": 1.5}, {"comp": "Data Analytics", "bugs": 15, "zd": 27, "open": 3, "top": 6, "avg": 1.8}, {"comp": "Alert & Incidents", "bugs": 16, "zd": 26, "open": 3, "top": 3, "avg": 1.6}, {"comp": "Data Pipeline", "bugs": 8, "zd": 14, "open": 0, "top": 1, "avg": 1.8}, {"comp": "Collection", "bugs": 6, "zd": 7, "open": 4, "top": 1, "avg": 1.2}, {"comp": "SOAR Integration", "bugs": 1, "zd": 3, "open": 0, "top": 0, "avg": 3.0}, {"comp": "LPSM", "bugs": 1, "zd": 2, "open": 0, "top": 1, "avg": 2.0}, {"comp": "UX Analytics", "bugs": 1, "zd": 1, "open": 1, "top": 0, "avg": 1.0}, {"comp": "UEBA Integration", "bugs": 1, "zd": 1, "open": 0, "top": 0, "avg": 1.0}];
const MONTHLY  = [{"month": "2026-01", "Build_Deployment": 8, "Web_Configuration": 2, "Data_Analytics": 3, "Alert_Incidents": 0, "Data_Pipeline": 2, "Collection": 0}, {"month": "2026-02", "Build_Deployment": 4, "Web_Configuration": 7, "Data_Analytics": 7, "Alert_Incidents": 2, "Data_Pipeline": 3, "Collection": 0}, {"month": "2026-03", "Build_Deployment": 4, "Web_Configuration": 4, "Data_Analytics": 1, "Alert_Incidents": 4, "Data_Pipeline": 2, "Collection": 2}, {"month": "2026-04", "Build_Deployment": 3, "Web_Configuration": 10, "Data_Analytics": 1, "Alert_Incidents": 6, "Data_Pipeline": 0, "Collection": 3}, {"month": "2026-05", "Build_Deployment": 10, "Web_Configuration": 4, "Data_Analytics": 3, "Alert_Incidents": 3, "Data_Pipeline": 1, "Collection": 1}, {"month": "2026-06", "Build_Deployment": 1, "Web_Configuration": 1, "Data_Analytics": 0, "Alert_Incidents": 1, "Data_Pipeline": 0, "Collection": 0}];
const PATTERNS = [{"name": "Service Crash/OOM", "bugs": 29, "zd": 73, "color": "#ef4444"}, {"name": "Upgrade/Install", "bugs": 20, "zd": 42, "color": "#f97316"}, {"name": "Alert & Search", "bugs": 27, "zd": 41, "color": "#f59e0b"}, {"name": "UI/UX", "bugs": 18, "zd": 28, "color": "#38bdf8"}, {"name": "API Issues", "bugs": 12, "zd": 17, "color": "#818cf8"}, {"name": "UEBA", "bugs": 4, "zd": 10, "color": "#a78bfa"}, {"name": "Authentication", "bugs": 4, "zd": 4, "color": "#34d399"}, {"name": "Data Loss", "bugs": 2, "zd": 2, "color": "#fb923c"}];
const TOP_BUGS = [{"key": "LP-75952", "s": "Local Privilege Escalation in Seconds via Copy Fail Vulnerability (CVE-2026-31431)", "p": "Top", "zd": 14, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-73497", "s": "IPv4 Forwarding Disabled in 780 Flex Patch Causing SIEM-to-UEBA Log Forwarding Failure", "p": "Major", "zd": 7, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-75881", "s": "Logpoint UI not responsive because of uvicorn workers stuck on mongo topology discover", "p": "Top", "zd": 6, "comp": "Web Configuration", "status": "Closed"}, {"key": "LP-73311", "s": "System Notifications not starting the collection layer services after sufficient storage s", "p": "Top", "zd": 6, "comp": "Data Pipeline", "status": "Closed"}, {"key": "LP-76043", "s": "Hyper-V based systems inaccessible after 7.9.0 upgrade", "p": "Major", "zd": 5, "comp": "Build & Deployment", "status": "In Progress"}, {"key": "LP-75801", "s": "Issue observed in alert_engine where alert queries have \\\"TABLE\\\" ", "p": "Major", "zd": 5, "comp": "Alert & Incidents", "status": "Closed"}, {"key": "LP-73329", "s": "Patch uploads and installs are not consistent in LP 7.8", "p": "Major", "zd": 5, "comp": "Web Configuration", "status": "Closed"}, {"key": "LP-73301", "s": "Logpoint v7.8.4.0 upgrade failed during mongosh upgrade. ", "p": "Top", "zd": 5, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-70312", "s": "Logpoint 7.8.2:  su command cannot be run by li-admin user", "p": "Major", "zd": 5, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-76329", "s": "Wheel packages not updated in 7.9.2 ", "p": "Top", "zd": 4, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-76033", "s": "Assess Exposure and Mitigation for Linux ?Dirty Frag? Local Privilege Escalation Vulnerabi", "p": "Major", "zd": 4, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-74949", "s": "Issues installing LogPoint ISO from USB drive", "p": "None", "zd": 4, "comp": "Build & Deployment", "status": "Closed"}, {"key": "LP-70584", "s": "Autotuner service creating too many normalizer services resulting in memory exhaustion", "p": "Major", "zd": 4, "comp": "Data Analytics", "status": "Closed"}, {"key": "LP-76194", "s": "Reports failing with java.lang.ClassCastException", "p": "Top", "zd": 3, "comp": "Data Analytics", "status": "In Review"}, {"key": "LP-75880", "s": "Issue observed in alerts created from searchmaster and director API without defining searc", "p": "Top", "zd": 3, "comp": "Alert & Incidents", "status": "Closed"}];
const OPEN     = [{"key": "LP-76043", "s": "Hyper-V based systems inaccessible after 7.9.0 upgrade", "p": "Major", "zd": 5, "comp": "Build & Deployment", "status": "In Progress"}, {"key": "LP-76194", "s": "Reports failing with java.lang.ClassCastException", "p": "Top", "zd": 3, "comp": "Data Analytics", "status": "In Review"}, {"key": "LP-75848", "s": "IndexSearcher retention job fails with generic error message, lacking detailed logs for tr", "p": "Minor", "zd": 2, "comp": "Data Analytics", "status": "Open"}, {"key": "LP-76425", "s": "Failure to deserialize indexsearcher response when delayedMaps key contains surrogate pair", "p": "None", "zd": 1, "comp": "Alert & Incidents", "status": "Open"}, {"key": "LP-76366", "s": "Configuration restore doesn't restore/update the vpn certificate", "p": "Major", "zd": 1, "comp": "Web Configuration", "status": "Open"}, {"key": "LP-76354", "s": "Upgrade fails - GRUB script writes incorrect EFI partition to /etc/fstab on ZFS systems wi", "p": "None", "zd": 1, "comp": "Build & Deployment", "status": "Open"}, {"key": "LP-76241", "s": "Unable to restore configuration and logs backup in other machine", "p": "Top", "zd": 1, "comp": "Web Configuration", "status": "In Progress"}, {"key": "LP-76224", "s": "Port 5050 not opened in AgentX", "p": "None", "zd": 1, "comp": "Collection", "status": "Open"}, {"key": "LP-76202", "s": "Failed patch installations are not visible in the updates section of the UI", "p": "Major", "zd": 1, "comp": "Web Configuration", "status": "In Progress"}, {"key": "LP-76189", "s": "Alert Dialog Box: Incorrect Space Formatting in Query on Overview Tab", "p": "Minor", "zd": 1, "comp": "UX Analytics", "status": "Open"}, {"key": "LP-76159", "s": "Inactivity Threshold doesn't accept \\\"60\\\" as valid value", "p": "Minor", "zd": 1, "comp": "Web Configuration", "status": "Open"}, {"key": "LP-76143", "s": "Premerger halted at 0 UTC", "p": "Top", "zd": 1, "comp": "Data Analytics", "status": "In Progress"}, {"key": "LP-76041", "s": "Some fields are missing in alert incidents for delayed logs", "p": "Major", "zd": 1, "comp": "Alert & Incidents", "status": "Open"}, {"key": "LP-75973", "s": "Over-triggering of networkd-dispatcher due to routeable interface docker0 ", "p": "Major", "zd": 1, "comp": "Build & Deployment", "status": "Open"}, {"key": "LP-75967", "s": "Race condition when multiple instances of update_dnsmasq.py run causing invalid entry on /", "p": "Major", "zd": 1, "comp": "Build & Deployment", "status": "Open"}, {"key": "LP-75966", "s": "Incorrect resolvectl parsing in update_dnsmasq.py", "p": "Major", "zd": 1, "comp": "Build & Deployment", "status": "In Review"}, {"key": "LP-75965", "s": "VLAN DNS not handled in runtime extraction in update_dnsmasq.py", "p": "Major", "zd": 1, "comp": "Build & Deployment", "status": "Open"}, {"key": "LP-75866", "s": "Syslog Forwarder Architecture Revamp to Address Security, Data Reliability, and Scalabilit", "p": "None", "zd": 1, "comp": "Collection", "status": "Open"}, {"key": "LP-75828", "s": "Devices without distributed collector are synced to Syslog Forwarder, causing confusion an", "p": "Minor", "zd": 1, "comp": "Collection", "status": "Open"}, {"key": "LP-75826", "s": "Cannot set path to \\\"/\\\" in Export management using FTP", "p": "Minor", "zd": 1, "comp": "Web Configuration", "status": "In Progress"}, {"key": "LP-75658", "s": "Issues Encountered While Using Sync Functionality Across Data Nodes via Search Head", "p": "Major", "zd": 1, "comp": "Web Configuration", "status": "In Progress"}, {"key": "LP-75595", "s": "Inconsistent Editing feature in Shared Alert Rules", "p": "Minor", "zd": 1, "comp": "Alert & Incidents", "status": "Open"}, {"key": "LP-75127", "s": "CIFS collection halts during upgrades in customer environment", "p": "Minor", "zd": 1, "comp": "Collection", "status": "Open"}];

const COMP_KEYS = ["Build_Deployment","Web_Configuration","Data_Analytics","Alert_Incidents","Data_Pipeline","Collection"];
const COMP_LABELS = {"Build_Deployment":"Build & Deployment","Web_Configuration":"Web Configuration",
  "Data_Analytics":"Data Analytics","Alert_Incidents":"Alert & Incidents",
  "Data_Pipeline":"Data Pipeline","Collection":"Collection"};

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
      <div style={{fontSize:22,fontWeight:700,color:color}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:color+"aa",fontWeight:600,marginTop:1}}>{sub}</div>}
      <div style={{fontSize:10,color:"#64748b",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{label}</div>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("Overview");
  const totalZD=DATA.reduce((s,r)=>s+r.zd,0);
  const openCount=DATA.filter(r=>r.status!=="Closed").length;
  const topComp=COMP[0];
  return (
    <div style={{fontFamily:"'DM Mono','Fira Code',monospace",background:"#0a0f1e",minHeight:"100vh",color:"#e2e8f0"}}>
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e1b4b)",borderBottom:"1px solid #1e3a5f",padding:"18px 24px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4,flexWrap:"wrap"}}>
          <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{"\uD83D\uDC1B"}</div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"#f8fafc"}}>LogPoint Bug Intelligence — 2026</div>
            <div style={{fontSize:10,color:"#64748b",letterSpacing:"0.08em"}}>
              {"createdDate \u2265 2026-01-01 \u00B7 ZD Count > 0 \u00B7 "}
              <span style={{color:"#38bdf8",fontWeight:600}}>{"107 bugs \u00B7 195 ZD tickets \u00B7 10 components"}</span>
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:10,flexWrap:"wrap"}}>
            <Kpi label="Bugs"        value={107}                           color="#3b82f6"/>
            <Kpi label="ZD Tickets"  value={totalZD}                       color="#8b5cf6"/>
            <Kpi label="Open Bugs"   value={openCount}                     color="#f97316"/>
            <Kpi label="Top Component" value={topComp.comp.split(" ")[0]+"..."} sub={topComp.zd+" ZD"} color="#ef4444"/>
          </div>
        </div>
        <div style={{display:"flex",gap:0,marginTop:14}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#38bdf8":"#64748b",borderBottom:tab===t?"2px solid #38bdf8":"2px solid transparent",fontFamily:"inherit",fontSize:12,fontWeight:tab===t?600:400,letterSpacing:"0.04em",transition:"all 0.15s"}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"22px 24px"}}>
        {tab==="Overview"            && <Overview/>}
        {tab==="Component Analysis"  && <ComponentAnalysis/>}
        {tab==="Trend Patterns"      && <TrendPatterns/>}
        {tab==="Bug Table"           && <BugTable/>}
        {tab==="Open Bugs"           && <OpenBugs/>}
      </div>
    </div>
  );
}

function Overview() {
  const pieData = COMP.map((c,i)=>({name:c.comp,value:c.bugs,color:CC[i%CC.length]}));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="ZD Tickets by Component">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={COMP} margin={{left:0,right:30,top:0,bottom:60}}>
              <XAxis dataKey="comp" tick={{fill:"#64748b",fontSize:10}} angle={-35} textAnchor="end" interval={0} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}
                formatter={(v,n,p)=>[v+" ZD tickets | "+p.payload.bugs+" bugs | "+p.payload.open+" open",""]}/>
              <Bar dataKey="zd" radius={[4,4,0,0]}>
                {COMP.map((c,i)=><Cell key={c.comp} fill={CC[i%CC.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Bug Count Distribution by Component">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95}
                label={({name,value})=>name.split(" ")[0]+": "+value} fontSize={10}>
                {pieData.map((e,i)=><Cell key={e.name} fill={CC[i%CC.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Monthly Bug Volume by Component (Jan–Jun 2026)">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY} margin={{left:0,right:20,top:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
            <Bar dataKey="Build_Deployment"  name="Build & Deployment"  stackId="a" fill={CC[0]}/>
            <Bar dataKey="Web_Configuration" name="Web Configuration"   stackId="a" fill={CC[1]}/>
            <Bar dataKey="Data_Analytics"    name="Data Analytics"      stackId="a" fill={CC[2]}/>
            <Bar dataKey="Alert_Incidents"   name="Alert & Incidents"   stackId="a" fill={CC[3]}/>
            <Bar dataKey="Data_Pipeline"     name="Data Pipeline"       stackId="a" fill={CC[4]}/>
            <Bar dataKey="Collection"        name="Collection"          stackId="a" fill={CC[5]} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
          {COMP_KEYS.map((k,i)=>(
            <span key={k} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:CC[i],display:"inline-block"}}/>{COMP_LABELS[k]}
            </span>
          ))}
        </div>
      </Card>

      <Card title="Top 15 Bugs (2026) by ZD Ticket Count">
        <ResponsiveContainer width="100%" height={310}>
          <BarChart data={TOP_BUGS} layout="vertical" margin={{left:10,right:50,top:0,bottom:0}}>
            <XAxis type="number" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="key" tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false} width={82}/>
            <Tooltip cursor={{fill:"rgba(59,130,246,0.07)"}} contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:11}}
              formatter={(v,n,p)=>[v+" ZD | "+p.payload.comp,""]} labelFormatter={k=>{const r=TOP_BUGS.find(x=>x.key===k);return k+(r?" — "+r.s.slice(0,55):"");}}/>
            <Bar dataKey="zd" radius={[0,4,4,0]}>
              {TOP_BUGS.map(r=><Cell key={r.key} fill={PC[r.p]||"#3b82f6"}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

function ComponentAnalysis() {
  const [sel,setSel]=useState(null);
  const selComp = sel || COMP[0].comp;
  const compBugs = DATA.filter(r=>r.comp===selComp).sort((a,b)=>b.zd-a.zd);

  const radarData = COMP.map(c=>({
    comp: c.comp.split(" ")[0],
    bugs: c.bugs,
    zd: c.zd,
    open: c.open,
    top: c.top,
  }));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Component scorecard — click to drill down">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {COMP.map((c,i)=>(
              <div key={c.comp} onClick={()=>setSel(c.comp)}
                style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",background:selComp===c.comp?"rgba(59,130,246,0.12)":"#0a0f1e",borderRadius:7,border:"1px solid "+(selComp===c.comp?"#3b82f6":"#1e3a5f"),cursor:"pointer",transition:"all 0.15s"}}>
                <span style={{width:10,height:10,borderRadius:2,background:CC[i],flexShrink:0,display:"inline-block"}}/>
                <span style={{flex:1,fontSize:12,fontWeight:selComp===c.comp?700:400,color:selComp===c.comp?"#f1f5f9":"#94a3b8"}}>{c.comp}</span>
                <span style={{fontSize:12,fontWeight:700,color:CC[i],minWidth:28,textAlign:"right"}}>{c.bugs}</span>
                <span style={{fontSize:11,color:"#475569",minWidth:32,textAlign:"right"}}>{c.zd} ZD</span>
                <span style={{fontSize:11,color:c.open>0?"#f97316":"#334155",minWidth:30,textAlign:"right"}}>{c.open>0?"\u26A0 "+c.open:""}</span>
                <span style={{fontSize:11,color:c.top>0?"#ef4444":"#334155",minWidth:28,textAlign:"right"}}>{c.top>0?"\u25CF "+c.top:""}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,marginTop:12,fontSize:11,color:"#475569"}}>
            <span>Bugs</span><span style={{marginLeft:"auto"}}>ZD</span>
            <span style={{color:"#f97316"}}>Open</span>
            <span style={{color:"#ef4444"}}>Top</span>
          </div>
        </Card>

        <Card title={"Bugs in: "+selComp}>
          <div style={{fontSize:11,color:"#475569",marginBottom:10}}>
            {compBugs.length+" bugs · "+compBugs.reduce((s,r)=>s+r.zd,0)+" ZD tickets · "+compBugs.filter(r=>r.status!=="Closed").length+" open"}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:380,overflowY:"auto"}}>
            {compBugs.map(r=>(
              <div key={r.key} style={{padding:"8px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f",borderLeft:"3px solid "+(PC[r.p]||"#475569")}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                  <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer"
                    style={{color:"#38bdf8",fontWeight:700,fontSize:12,textDecoration:"none"}}>{r.key}</a>
                  <PBadge p={r.p}/><SBadge s={r.status}/>
                  <span style={{marginLeft:"auto",color:r.zd>=5?"#ef4444":r.zd>=3?"#f97316":"#94a3b8",fontWeight:700,fontSize:13}}>{r.zd+" ZD"}</span>
                </div>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5}}>{r.s.length>80?r.s.slice(0,80)+"\u2026":r.s}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Multi-dimension component comparison">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#1e3a5f"/>
            <PolarAngleAxis dataKey="comp" tick={{fill:"#64748b",fontSize:10}}/>
            <PolarRadiusAxis tick={{fill:"#334155",fontSize:9}}/>
            <Radar name="Bug Count" dataKey="bugs" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.15} strokeWidth={2}/>
            <Radar name="ZD Tickets" dataKey="zd" stroke="#f97316" fill="#f97316" fillOpacity={0.1} strokeWidth={2}/>
            <Radar name="Open Bugs" dataKey="open" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} strokeWidth={2}/>
            <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
          </RadarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:20,marginTop:8,justifyContent:"center"}}>
          {[["Bug Count","#38bdf8"],["ZD Tickets","#f97316"],["Open Bugs","#ef4444"]].map(([l,c])=>(
            <span key={l} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:2,background:c,display:"inline-block"}}/>{l}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TrendPatterns() {
  const monthlyZD = MONTHLY.map(m=>({
    month:m.month,
    zd: DATA.filter(r=>r.created.startsWith(m.month)).reduce((s,r)=>s+r.zd,0)
  }));

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Recurring bug patterns — by category">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={PATTERNS} layout="vertical" margin={{left:10,right:50,top:0,bottom:0}}>
              <XAxis type="number" tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name"
                width={160} tick={{fill:"#94a3b8",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}
                formatter={(v,n,p)=>[v+(n==="zd"?" ZD tickets":" bugs"),""]}/>
              <Bar dataKey="zd" name="zd" radius={[0,4,4,0]}>
                {PATTERNS.map(p=><Cell key={p.name} fill={p.color}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly ZD ticket volume trend">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={monthlyZD} margin={{left:0,right:20,top:10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
              <Bar dataKey="zd" fill="#8b5cf622" stroke="#8b5cf6" strokeWidth={1} radius={[4,4,0,0]} name="ZD Tickets"/>
              <Line type="monotone" dataKey="zd" stroke="#38bdf8" strokeWidth={2} dot={{r:4,fill:"#38bdf8"}} name="Trend"/>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Trend Analysis — What keeps recurring">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[
            {icon:"\uD83D\uDD25",color:"#ef4444",title:"Service Crash / Out-of-Memory is the #1 recurring pattern (29 bugs, 73 ZD)",
             body:"Services running out of memory, crashing, or getting stuck are the single biggest source of ZD tickets in 2026. Autotuner creating too many normalizer services (LP-70584, 4 ZD), Premerger halting at 0 UTC (LP-76143), and uvicorn workers stuck on MongoDB (LP-75881, 6 ZD). This pattern appears across Build & Deployment, Web Config, and Data Analytics components — it is not isolated to one team."},
            {icon:"\u26A1",color:"#f97316",title:"Build & Deployment is the most impacted component (30 bugs, 72 ZD, 6 open)",
             body:"Every major upgrade path is causing issues. Hyper-V upgrade failure (LP-76043, 5 ZD, still In Progress), dnsmasq race conditions (LP-75965/66/67), GRUB EFI partition script (LP-76354), and CVE-2026-31431 privilege escalation (LP-75952, 14 ZD). Upgrade reliability is the top engineering risk right now."},
            {icon:"\uD83D\uDD0D",color:"#f59e0b",title:"Web Configuration surged in April (10 bugs in one month)",
             body:"April 2026 saw the highest single-month spike for Web Configuration bugs (10 bugs). Root causes include backup restore failures (LP-76241, LP-76366), failed patch visibility (LP-76202), FTP export path issues (LP-75826), and Data Node sync problems (LP-75658). Likely triggered by a major patch release in late March/early April."},
            {icon:"\uD83D\uDEA8",color:"#a855f7",title:"Alert & Incidents bugs are growing month-on-month (0 → 1 → 4 → 6 → 3)",
             body:"Alert reliability bugs are escalating: false positives from newline chars (LP-75683), missing fields in delayed log incidents (LP-76041), inconsistent shared alert rule editing (LP-75595), and IndexSearcher deserialization failure (LP-76425). Three are still open. This tracks with growing customer use of automated alert workflows."},
            {icon:"\uD83D\uDD01",color:"#22c55e",title:"dnsmasq / network config is a recurring cluster in Build & Deployment",
             body:"LP-75965, LP-75966, LP-75967, LP-75973 are four separate bugs all rooted in the same dnsmasq/network configuration scripts introduced in 7.8.4 — VLAN DNS handling, resolvectl parsing, race conditions in update_dnsmasq.py, and networkd-dispatcher over-triggering. All are still open. This is one root cause masquerading as multiple tickets."},
            {icon:"\uD83D\uDCCB",color:"#38bdf8",title:"Reports and Data Analytics bugs return every release cycle",
             body:"Report generation failures appear in every quarterly window: ClassCastException on reports (LP-76194, 3 ZD, In Review), IndexSearcher retention job failures (LP-75848), Premerger halt (LP-76143). Data Analytics had 7 bugs in February alone. The Java reporting stack needs dedicated regression coverage each release."},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",gap:12,padding:"13px 15px",background:"#0a0f1e",borderRadius:8,border:"1px solid "+r.color+"33",borderLeft:"3px solid "+r.color}}>
              <div style={{fontSize:20,lineHeight:1,marginTop:2,flexShrink:0}}>{r.icon}</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:r.color,marginBottom:5}}>{r.title}</div>
                <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.7}}>{r.body}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BugTable() {
  const [sk,setSk]=useState("zd");
  const [sd,setSd]=useState("desc");
  const [fc,setFc]=useState("All");
  const [fp,setFp]=useState("All");
  const [q,setQ]=useState("");
  const [pg,setPg]=useState(0);
  const PAGE=30;

  const comps=["All",...new Set(DATA.map(r=>r.comp))];

  const filtered=useMemo(()=>{
    let d=[...DATA];
    if(fc!=="All")d=d.filter(r=>r.comp===fc);
    if(fp!=="All")d=d.filter(r=>r.p===fp);
    if(q)d=d.filter(r=>r.s.toLowerCase().includes(q.toLowerCase())||r.key.toLowerCase().includes(q.toLowerCase()));
    d.sort((a,b)=>{
      let va=a[sk],vb=b[sk];
      if(sk==="p"){va=PO[va]??9;vb=PO[vb]??9;}
      if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}
      return sd==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0);
    });
    return d;
  },[sk,sd,fc,fp,q]);

  const pages=Math.ceil(filtered.length/PAGE);
  const rows=filtered.slice(pg*PAGE,(pg+1)*PAGE);

  function Th({col,label}) {
    return (
      <th onClick={()=>{if(sk===col)setSd(d=>d==="asc"?"desc":"asc");else{setSk(col);setSd("desc");setPg(0);}}}
        style={{padding:"8px 10px",textAlign:"left",color:"#475569",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",fontSize:11}}>
        {label}{sk===col?<span style={{color:"#38bdf8",marginLeft:3}}>{sd==="asc"?"\u2191":"\u2193"}</span>:<span style={{color:"#334155",marginLeft:3}}>\u21C5</span>}
      </th>
    );
  }

  return (
    <Card>
      <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>{setQ(e.target.value);setPg(0);}} placeholder="Search key or summary..."
          style={{flex:1,minWidth:160,padding:"6px 11px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,outline:"none"}}/>
        <select value={fc} onChange={e=>{setFc(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {comps.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={fp} onChange={e=>{setFp(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {["All","Top","Major","Minor","None"].map(p=><option key={p}>{p}</option>)}
        </select>
        <span style={{fontSize:12,color:"#475569"}}>{filtered.length} bugs</span>
        <div style={{display:"flex",gap:5,alignItems:"center",marginLeft:"auto"}}>
          <button onClick={()=>setPg(p=>Math.max(0,p-1))} disabled={pg===0}
            style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg===0?"#334155":"#94a3b8",cursor:pg===0?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2190"}</button>
          <span style={{fontSize:11,color:"#475569"}}>{pg+1}/{pages||1}</span>
          <button onClick={()=>setPg(p=>Math.min(pages-1,p+1))} disabled={pg>=pages-1}
            style={{padding:"4px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:5,color:pg>=pages-1?"#334155":"#94a3b8",cursor:pg>=pages-1?"default":"pointer",fontFamily:"inherit",fontSize:11}}>{"\u2192"}</button>
        </div>
      </div>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr style={{borderBottom:"1px solid #1e3a5f"}}>
              <Th col="key" label="Key"/>
              <Th col="zd" label="ZD #"/>
              <Th col="p" label="Priority"/>
              <Th col="status" label="Status"/>
              <Th col="comp" label="Component"/>
              <Th col="v" label="Version"/>
              <Th col="created" label="Created"/>
              <th style={{padding:"8px 10px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:11}}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.key} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}>
                  <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer"
                    style={{color:"#38bdf8",textDecoration:"none",fontWeight:600}}>{r.key}</a>
                </td>
                <td style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:r.zd>=10?"#ef4444":r.zd>=5?"#f97316":"#e2e8f0"}}>{r.zd}</td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><PBadge p={r.p}/></td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><SBadge s={r.status}/></td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap",fontSize:11,color:"#7dd3fc"}}>{r.comp}</td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap",color:"#94a3b8",fontSize:11}}>{r.v}</td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap",color:"#64748b",fontSize:11}}>{r.created}</td>
                <td style={{padding:"7px 10px",color:"#cbd5e1",maxWidth:340}}><span title={r.s}>{r.s.length>80?r.s.slice(0,80)+"\u2026":r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function OpenBugs() {
  const byComp = OPEN.reduce((m,r)=>{if(!m[r.comp])m[r.comp]=[];m[r.comp].push(r);return m;},{});
  const sorted = Object.entries(byComp).sort((a,b)=>b[1].length-a[1].length);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        {sorted.map(([comp,bugs],i)=>(
          <div key={comp} style={{padding:"8px 14px",background:"#0f1729",borderRadius:8,border:"1px solid "+CC[i%CC.length]+"44",borderLeft:"3px solid "+CC[i%CC.length]}}>
            <div style={{fontSize:12,fontWeight:700,color:CC[i%CC.length]}}>{comp}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#f1f5f9",marginTop:2}}>{bugs.length}</div>
            <div style={{fontSize:10,color:"#475569"}}>open bugs</div>
          </div>
        ))}
      </div>
      {sorted.map(([comp,bugs],i)=>(
        <Card key={comp} title={comp+" — "+bugs.length+" open bugs"} style={{borderLeft:"3px solid "+CC[i%CC.length]}}>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {bugs.sort((a,b)=>b.zd-a.zd).map(r=>(
              <div key={r.key} style={{display:"flex",gap:8,alignItems:"flex-start",padding:"8px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f",flexWrap:"wrap"}}>
                <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer"
                  style={{color:"#38bdf8",fontWeight:700,fontSize:12,textDecoration:"none",minWidth:85,flexShrink:0}}>{r.key}</a>
                <PBadge p={r.p}/>
                <SBadge s={r.status}/>
                <span style={{color:"#94a3b8",fontSize:12,flex:1}}>{r.s}</span>
                <span style={{color:r.zd>=5?"#ef4444":r.zd>=3?"#f97316":"#94a3b8",fontWeight:700,fontSize:13,flexShrink:0}}>{r.zd+" ZD"}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}