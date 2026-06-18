import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
         ComposedChart, Line, Area, CartesianGrid, ReferenceLine,
         PieChart, Pie } from "recharts";

const PC  = { Top:"#ef4444", Major:"#f97316", Minor:"#eab308", None:"#64748b" };
const SC  = { Closed:"#22c55e", Open:"#3b82f6", "In Progress":"#a855f7", "In Review":"#f59e0b" };
const PO  = { Top:0, Major:1, Minor:2, None:3 };
const CC  = ["#38bdf8","#818cf8","#34d399","#f59e0b","#f87171","#a78bfa","#fb923c","#4ade80"];
const TABS = ["Backlog Drift","Severity Analysis","Root Causes","Component Health","Sprint & Labels","Bug Table"];

const DATA = [
  {key:"LP-70204",s:"Invalid environment variable syntax in /etc/environment",created:"2026-01-01",resolved:"2026-01-09",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint1",zd:0,reporter:"Ujjwal Karna",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70210",s:"li-admin-pass-auth enable command not working",created:"2026-01-01",resolved:"2026-01-01",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Build & Deployment",sprint:"",zd:0,reporter:"Siddhant Shrestha",assignee:"Ashutosh Bohara",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70211",s:"Unable to connect and disconnect logpoint to director.",created:"2026-01-01",resolved:"2026-01-02",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"",zd:0,reporter:"Pritam Shakya",assignee:"Kalpesh Manandhar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70213",s:"Bundled plugins are not upgraded when applying develop patch",created:"2026-01-02",resolved:"2026-01-07",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint1",zd:0,reporter:"Bipul Neupane",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70219",s:"Issue with grub installation in case of unused disk",created:"2026-01-02",resolved:"2026-03-09",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:1,reporter:"Aayush Sah",assignee:"Prabin Lama",hasFix:true,labels:["QA_required", "doc_required", "jira_escalated"]},
  {key:"LP-70228",s:"CVE-2023-46604 - activemq-client",created:"2026-01-06",resolved:"2026-02-20",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint4",zd:1,reporter:"Utsav Amatya",assignee:"Juned Alam",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70260",s:"Issue in Logsource Creation due to Norm package version mismatch",created:"2026-01-09",resolved:"",status:"Open",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:0,reporter:"Sameer Kattel",assignee:"Ayush Lal Shrestha",hasFix:false,labels:["doc_not_required"]},
  {key:"LP-70262",s:"Config regeneration stuck on write syscall",created:"2026-01-09",resolved:"2026-01-15",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint2",zd:2,reporter:"Nabin Khanal",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70273",s:"synk - @lp/license - External Control of File Name or Path in jspdf",created:"2026-01-12",resolved:"2026-01-12",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-70276",s:"snyk - @lp/log-sources - Cross-site Scripting (XSS) in react-router",created:"2026-01-12",resolved:"2026-01-15",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-70283",s:"hrStorageUsed.2 (OID 1.3.6.1.2.1.25.2.3.1.6.2) may not return disk usage on Linux",created:"2026-01-12",resolved:"2026-02-04",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint3",zd:1,reporter:"Abhin Acharya",assignee:"Ritendra Raj Shakya",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70303",s:"Credential Leakage via Insecure Logic & SSRF in ODBC Enrichment Source",created:"2026-01-13",resolved:"2026-01-14",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Ujjwal Karna",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70308",s:"Potential Vulnerability in ODBC Enrichment Plugin",created:"2026-01-13",resolved:"2026-02-04",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:1,reporter:"Sagar Kumar Thapa",assignee:"Suresh Pantha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70312",s:"Logpoint 7.8.2:  su command cannot be run by li-admin user",created:"2026-01-13",resolved:"2026-01-16",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"",zd:5,reporter:"Ishwor Khanal",assignee:"Ashutosh Bohara",hasFix:true,labels:["jira_escalated", "support_priority_solved"]},
  {key:"LP-70314",s:"Patch installation failed when upgrading from 7820 to 7900.1",created:"2026-01-14",resolved:"2026-01-15",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint2",zd:0,reporter:"Anuj Prasad Subedi",assignee:"Prabin Lama",hasFix:true,labels:[]},
  {key:"LP-70315",s:"Error in delayed timechart query alert",created:"2026-01-14",resolved:"2026-02-20",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint4",zd:0,reporter:"Anuj Prasad Subedi",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70337",s:"Snyk - logpoint/Report - Deserialization of Untrusted Data in net.sf.jasperreports:jasperr",created:"2026-01-16",resolved:"2026-01-23",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"AD_Q1_26Sprint2",zd:0,reporter:"Balaram Sharma",assignee:"Balaram Sharma",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70342",s:"docker-image|logpoint_patch_build_slave - Race Condition in node",created:"2026-01-16",resolved:"2026-01-21",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:0,reporter:"Prabin Lama",assignee:"Prabin Lama",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70345",s:"docker-image|logpoint_patch_build_slave - Out-of-bounds Write in gnupg2/gpgconf",created:"2026-01-16",resolved:"2026-01-21",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint2",zd:0,reporter:"Prabin Lama",assignee:"Prabin Lama",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70350",s:"Results are missing for aliased stream query values in the PDF report format ",created:"2026-01-19",resolved:"2026-04-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint1",zd:2,reporter:"Dinesh Lamichhane",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70352",s:"Email delivery failure due to SMTP issue",created:"2026-01-19",resolved:"2026-01-20",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Sabita Guragain",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70362",s:"Email feature Not Working Due to Duplicate Database Migration ID",created:"2026-01-20",resolved:"2026-01-20",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Sabita Guragain",assignee:"Ujjwal Karna",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70386",s:"snyk - Allocation of Resources Without Limits or Throttling in pyasn1",created:"2026-01-20",resolved:"",status:"In Pause",p:"Major",sev:"Sev-3-Low",comp:"Collection",sprint:"Agents_Q1_26Sprint4",zd:0,reporter:"Prabin Lama",assignee:"Ram Krishna Gubhaju",hasFix:false,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-70378",s:"snyk - upgrade urllib3 from 2.6.2 from 2.6.3 - Improper Handling of Highly Compressed Data",created:"2026-01-20",resolved:"2026-03-04",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Prabin Lama",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-70391",s:"Webserver fails to start in Staging after 7900 patch upgrade",created:"2026-01-21",resolved:"2026-02-05",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"WebApplication_Q1_26Sprint2",zd:0,reporter:"Ujjwal Karna",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70392",s:"Grub-pc configuration fixed not working on some servers",created:"2026-01-21",resolved:"2026-03-12",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:1,reporter:"Ranjan Shrestha",assignee:"Prabin Lama",hasFix:true,labels:["QA_required", "doc_required", "jira_escalated"]},
  {key:"LP-70393",s:"7.8.3 upgrade taking excessive time on high data volume systems.",created:"2026-01-21",resolved:"2026-02-03",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint3",zd:1,reporter:"Adithya Pokharel",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority_solved"]},
  {key:"LP-70394",s:"Network interface name changes across reboots",created:"2026-01-22",resolved:"2026-03-31",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint7",zd:2,reporter:"Urgen Norbu Sherpa",assignee:"Siddhant Shrestha",hasFix:true,labels:["jira_escalated", "support_priority_solved"]},
  {key:"LP-70400",s:"'process toList' takes all the results even after 'process spot' command",created:"2026-01-22",resolved:"2026-04-30",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Pipeline",sprint:"AD_Q2_26Sprint2",zd:1,reporter:"Urmila Maharjan",assignee:"Subash Basnet",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70402",s:"UEBA PreConfiguration Plugin v5.2.1 not available on ServiceDesk",created:"2026-01-22",resolved:"2026-02-13",status:"Closed",p:"None",sev:"Sev-1-High",comp:"UEBA Integration",sprint:"",zd:1,reporter:"Ishwor Khanal",assignee:"Jyoti Dahal",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-70430",s:"SFTP Backup and Restore fails after upgrade to 7.8.3 due to missing loginspect user in All",created:"2026-01-23",resolved:"2026-02-02",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint3",zd:1,reporter:"Kaushik Panta",assignee:"Prabin Lama",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority_solved"]},
  {key:"LP-70431",s:"Released version of s3fs tools not compatible with 7.8.3.",created:"2026-01-23",resolved:"2026-02-11",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint4",zd:2,reporter:"Adithya Pokharel",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_not_required", "jira_escalated"]},
  {key:"LP-70434",s:"Searches containing wildcards in the query times out.",created:"2026-01-26",resolved:"2026-03-09",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Data Analytics",sprint:"",zd:2,reporter:"Nabin Khanal",assignee:"Balaram Sharma",hasFix:true,labels:["jira_escalated", "support_priority_solved"]},
  {key:"LP-70435",s:"installed - Deserialization of Untrusted Data in ply",created:"2026-01-26",resolved:"2026-01-26",status:"Closed",p:"None",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Prabin Lama",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70444",s:"installed - Directory Traversal in wheel",created:"2026-01-26",resolved:"2026-01-26",status:"Closed",p:"None",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Prabin Lama",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70460",s:"SFTP Authentication Failure Persists After Upgrade to 7840 from 7830",created:"2026-01-29",resolved:"2026-02-02",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint3",zd:0,reporter:"Ujjwal Karna",assignee:"Prabin Lama",hasFix:true,labels:[]},
  {key:"LP-70462",s:"Concern regarding CVE-2025-61984",created:"2026-01-30",resolved:"2026-02-16",status:"Closed",p:"None",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Sagar Kumar Thapa",assignee:"Raju Tandukar",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-70465",s:"Logpoint installation take more time during installation",created:"2026-02-02",resolved:"2026-03-10",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Abhin Acharya",assignee:"Nitesh Palikhe",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-70468",s:"docker-image|logpoint_iso_build_slave:/usr/local/lib/node_modules - Command Injection in g",created:"2026-02-02",resolved:"2026-04-28",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint2",zd:0,reporter:"Prabin Lama",assignee:"Suresh Pantha",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70472",s:"Redis connection timeout exception on Filekeeper Service during services restart.",created:"2026-02-02",resolved:"2026-02-04",status:"Closed",p:"None",sev:"Sev-1-High",comp:"Data Pipeline",sprint:"",zd:1,reporter:"Ishwor Khanal",assignee:"Unassigned",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-70475",s:"docker-image|logpoint_patch_build_slave:/usr/bin/yq - Denial of Service (DoS) in golang.or",created:"2026-02-03",resolved:"2026-05-21",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:0,reporter:"Siddhant Shrestha",assignee:"Suresh Pantha",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-70478",s:"MongoDB credential migration incomplete on SaaS after 7.9.0.0 upgrade",created:"2026-02-03",resolved:"2026-02-06",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"AD_Q1_26Sprint3",zd:0,reporter:"Bipul Neupane",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70479",s:"Compatibility Check button for UEBA not enabled",created:"2026-02-03",resolved:"2026-02-19",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q1_26Sprint4",zd:1,reporter:"Urmila Maharjan",assignee:"Juned Alam",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70480",s:"AlertRules read_api fails for cloned vendor alerts with search_interval_minute set as None",created:"2026-02-03",resolved:"2026-02-12",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint4",zd:1,reporter:"Sandesh Subedi",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["API", "jira_escalated"]},
  {key:"LP-70583",s:"Issue seen in report engine log of Stormshield server",created:"2026-02-05",resolved:"2026-02-20",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"AD_Q1_26Sprint4",zd:1,reporter:"Ranjan Shrestha",assignee:"Bipul Neupane",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-70584",s:"Autotuner service creating too many normalizer services resulting in memory exhaustion",created:"2026-02-05",resolved:"2026-02-18",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q1_26Sprint4",zd:4,reporter:"Avinash Aryal",assignee:"Balaram Sharma",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70600",s:"Logpoint License Notification Not Updated Until Hard Refresh",created:"2026-02-06",resolved:"2026-02-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint4",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70601",s:"License Page Inaccessible During SOAR Enablement",created:"2026-02-06",resolved:"2026-02-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint4",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70602",s:"Unexpected Confirmation Modal During New Log Source Creation",created:"2026-02-06",resolved:"2026-02-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint4",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-70606",s:"Log loss due to absence of indexInfoDb",created:"2026-02-06",resolved:"",status:"Open",p:"None",sev:"Sev-3-Low",comp:"Collection",sprint:"",zd:0,reporter:"Siya Shrestha",assignee:"Unassigned",hasFix:false,labels:[]},
  {key:"LP-70608",s:"docker-image|logpoint_linux_debian_linux - Arbitrary Argument Injection in inetutils/inetu",created:"2026-02-06",resolved:"2026-02-17",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint4",zd:0,reporter:"Prabin Lama",assignee:"Prabin Lama",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-70615",s:"Search via Search Head fails with AttributeError unless Search Head is explicitly selected",created:"2026-02-06",resolved:"2026-04-06",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:1,reporter:"Urgen Norbu Sherpa",assignee:"Bipin Thapa",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-70664",s:"Duplicate alert_id & alertrule_id generated by Alertrules API causing missing Alerts",created:"2026-02-06",resolved:"2026-02-23",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint5",zd:2,reporter:"Adithya Pokharel",assignee:"Bijay Silwal",hasFix:true,labels:["doc_required", "hotfix", "jira_escalated"]},
  {key:"LP-70670",s:"License Notification State: Fails to update on Upload",created:"2026-02-09",resolved:"2026-03-04",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73287",s:"Credential Leakage via Insecure Logic & SSRF in Oracle Enrichment Source",created:"2026-02-10",resolved:"2026-03-04",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Nidesh Chitrakar",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_required"]},
  {key:"LP-73299",s:"Continuous Close alert rule popup is seen making the application unusable ",created:"2026-02-10",resolved:"2026-02-27",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Ritendra Raj Shakya",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73301",s:"Logpoint v7.8.4.0 upgrade failed during mongosh upgrade. ",created:"2026-02-10",resolved:"2026-02-20",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint4",zd:5,reporter:"Dinesh Lamichhane",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73302",s:"Authorization Bypass: Users with Read Access Can Create Alert rules via API",created:"2026-02-11",resolved:"2026-03-04",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Adithya Pokharel",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_not_required", "legacyIssue"]},
  {key:"LP-73303",s:"@lp/ui - Prototype Pollution in axios",created:"2026-02-11",resolved:"2026-02-24",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Nidesh Chitrakar",assignee:"Ritendra Raj Shakya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73311",s:"System Notifications not starting the collection layer services after sufficient storage s",created:"2026-02-11",resolved:"2026-03-03",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint5",zd:6,reporter:"Nabin Khanal",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73312",s:"Uncaught TypeError: s.weekday is not a function seen when custom date is selected",created:"2026-02-11",resolved:"2026-03-09",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"UX Analytics",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Siya Shrestha",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73313",s:"False Positive Incidents Generated for Aggregation Queries After Upgrade to 7.9.0.0",created:"2026-02-11",resolved:"2026-02-18",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Data Analytics",sprint:"AD_Q1_26Sprint4",zd:2,reporter:"Aashish Adhikari",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required", "hotfix", "jira_escalated"]},
  {key:"LP-73319",s:"snyk - Insufficient Verification of Data Authenticity in cryptography",created:"2026-02-13",resolved:"2026-03-06",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Saroj Bhattarai",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73322",s:"snyk - Out-of-bounds Write in pillow",created:"2026-02-13",resolved:"2026-02-27",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint5",zd:0,reporter:"Saroj Bhattarai",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73328",s:"Admin user \"Last Login Time\" updates on UI refresh in Distributed Mode without actual lo",created:"2026-02-13",resolved:"2026-03-20",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:1,reporter:"Kaushik Panta",assignee:"Sabita Guragain",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73329",s:"Patch uploads and installs are not consistent in LP 7.8",created:"2026-02-13",resolved:"2026-03-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:5,reporter:"Aayush Sah",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73330",s:"Concern regarding multiple CVE's as reported by customer.",created:"2026-02-13",resolved:"2026-03-10",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:0,reporter:"Adithya Pokharel",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["doc_required"]},
  {key:"LP-73333",s:"docker-image|logpoint_linux_debian_linux - Buffer Overflow in openssl/libssl1.1",created:"2026-02-16",resolved:"2026-04-09",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint1",zd:0,reporter:"Raju Tandukar",assignee:"Kalpesh Manandhar",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73338",s:"NullPointer Exception Observed in Premerger when computing timechart queries with large ti",created:"2026-02-16",resolved:"2026-02-16",status:"Closed",p:"None",sev:"Sev-1-High",comp:"Data Analytics",sprint:"",zd:1,reporter:"Aashish Adhikari",assignee:"Unassigned",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-73339",s:"CVE-2025-66516 Reported by customer",created:"2026-02-16",resolved:"2026-02-24",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint5",zd:1,reporter:"Urgen Norbu Sherpa",assignee:"Juned Alam",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73341",s:"LPC can't connect to a Data Node residing behind a public network.",created:"2026-02-16",resolved:"2026-04-17",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:3,reporter:"Nabin Khanal",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["director_dev_required", "doc_required", "jira_escalated"]},
  {key:"LP-73360",s:"ha_collector reboot breaks ha_forwarder communication causing storage buildup on ha_forwar",created:"2026-02-18",resolved:"2026-03-04",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint5",zd:2,reporter:"Sandeep Acharya",assignee:"Juned Alam",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73361",s:"Syslog collector config generation fails when a log source without Connector is created",created:"2026-02-18",resolved:"2026-02-19",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"",zd:0,reporter:"Kalpesh Manandhar",assignee:"Kalpesh Manandhar",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73396",s:"dynamic_entity_service creates two new threads every minute when mongodb is down",created:"2026-02-20",resolved:"2026-03-19",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q1_26Sprint6",zd:0,reporter:"Sandeep Acharya",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73397",s:"SIEM node license details not visible in co?managed Fabric mode",created:"2026-02-20",resolved:"2026-03-12",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:2,reporter:"Aavash Bhattarai",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73405",s:" Log Sources per?page selection doesn?t change rows displayed; list stays at 10",created:"2026-02-23",resolved:"2026-03-11",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:2,reporter:"Amrit Koirala",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73406",s:"Inconsistency in kernel installation on logpoint installed on dell server via 7.8.0 ISO.",created:"2026-02-23",resolved:"2026-04-01",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint7",zd:1,reporter:"Aayush Sah",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73422",s:"Website not rendering for users with operator permission when trying to login to Search He",created:"2026-02-24",resolved:"2026-04-01",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:1,reporter:"Aviyanshu Adhikari",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73428",s:"Alerts generating false/incorrect risk values for overlapping log source IPs",created:"2026-02-25",resolved:"2026-03-20",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Anuj Prasad Subedi",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73488",s:"During Fresh ISO installation mongodb password is missing in keypass",created:"2026-02-27",resolved:"2026-03-09",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Manu Narayan Shrestha",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-73489",s:"Cannot upload soar license in director connected logpoint.",created:"2026-02-27",resolved:"2026-03-13",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"SOAR Integration",sprint:"WebApplication_Q1_26Sprint6",zd:3,reporter:"Sandeep Acharya",assignee:"Ritendra Raj Shakya",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-73496",s:"Enrichment service in subscriber mode uses deleted files, filling up /opt/makalu/appstore ",created:"2026-02-27",resolved:"2026-03-13",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Data Analytics",sprint:"AD_Q1_26Sprint6",zd:3,reporter:"Sandeep Acharya",assignee:"Dipak Niroula",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority"]},
  {key:"LP-73497",s:"IPv4 Forwarding Disabled in 780 Flex Patch Causing SIEM-to-UEBA Log Forwarding Failure",created:"2026-02-27",resolved:"2026-03-27",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:7,reporter:"Ujjwal Karna",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority_solved"]},
  {key:"LP-73501",s:"Snyk - Improper Neutralization of Special Elements in Output Used by a Downstream Componen",created:"2026-02-27",resolved:"2026-03-09",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint6",zd:0,reporter:"Balaram Sharma",assignee:"Juned Alam",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73502",s:"Snyk - Deserialization of Untrusted Data in com.mchange:c3p0",created:"2026-02-27",resolved:"2026-03-09",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint6",zd:0,reporter:"Balaram Sharma",assignee:"Juned Alam",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-73764",s:"Potential malicious content detected in fields: email_template",created:"2026-03-02",resolved:"2026-04-02",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint7",zd:1,reporter:"Ranjan Shrestha",assignee:"Saroj Bhattarai",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-74791",s:"Snyk - Allocation of Resources Without Limits or Throttling in com.fasterxml.jackson.core:",created:"2026-03-03",resolved:"2026-03-12",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint6",zd:0,reporter:"Balaram Sharma",assignee:"Juned Alam",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-74879",s:"Sync feature not respecting the usability of HA configured repos",created:"2026-03-04",resolved:"2026-03-06",status:"Closed",p:"None",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"",zd:1,reporter:"Ranjan Shrestha",assignee:"Unassigned",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-74881",s:"Issue in ODBC Logsource creation if Query Mode->Advanced is selected",created:"2026-03-06",resolved:"2026-03-13",status:"Closed",p:"Top",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Sabita Guragain",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["Legacy", "doc_required"]},
  {key:"LP-74882",s:"Issue in Log Source Validation Error handling",created:"2026-03-06",resolved:"2026-03-16",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Sabita Guragain",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-74883",s:"Config Backup Failure on Fresh ISO Build",created:"2026-03-06",resolved:"2026-03-09",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Krishala Prajapati",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-74903",s:"SNYK: installed - Directory Traversal in python-multipart",created:"2026-03-06",resolved:"2026-04-01",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Ayush Lal Shrestha",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-74921",s:"Misleading \"Permission Denied\" Error When Querying Non-Existent Incident Object  Summary",created:"2026-03-06",resolved:"2026-03-12",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q1_26Sprint6",zd:1,reporter:"Aviyanshu Adhikari",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required", "jira_escalated"]},
  {key:"LP-74949",s:"Issues installing LogPoint ISO from USB drive",created:"2026-03-09",resolved:"2026-03-13",status:"Closed",p:"None",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:4,reporter:"Aayush Sah",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-74964",s:"Upgrade to 7.9.0.1 Fails Due to Race Condition Between runit Startup and MongoDB Force-Sto",created:"2026-03-09",resolved:"2026-03-16",status:"Closed",p:"None",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint6",zd:1,reporter:"Aashish Adhikari",assignee:"David Hugh Harris III",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-74967",s:"Sync: LogSources Not Visible in Web GUI After Sync Import due to Missing LogSourceTemplate",created:"2026-03-10",resolved:"2026-04-13",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:1,reporter:"Ishwor Khanal",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-74968",s:"Enrichment Propagation: Enrichment Inbox/Outbox Folders Not Cleaned Up After Mode Change",created:"2026-03-10",resolved:"2026-03-10",status:"Closed",p:"None",sev:"Sev-1-High",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint6",zd:1,reporter:"Ishwor Khanal",assignee:"Dipak Niroula",hasFix:true,labels:[]},
  {key:"LP-74977",s:"Contents from DB not cleaned by cleanup-opt command leaving Junk",created:"2026-03-10",resolved:"2026-04-21",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint2",zd:0,reporter:"Krishala Prajapati",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75008",s:"alert_dispatcher: Potential OOM when SMTP server is invalid or unreachable",created:"2026-03-12",resolved:"2026-03-16",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"",zd:0,reporter:"Anuj Prasad Subedi",assignee:"Ujjwal Karna",hasFix:true,labels:[]},
  {key:"LP-75010",s:"Quoted definer extracts value without quotes but retains quotes in field name",created:"2026-03-12",resolved:"2026-05-15",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint3",zd:1,reporter:"Sandesh Subedi",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75020",s:"Implement password update policy in credentials Management",created:"2026-03-13",resolved:"2026-03-17",status:"Closed",p:"Top",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"AD_Q1_26Sprint6",zd:0,reporter:"Manu Narayan Shrestha",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75034",s:"LPC containers failing to start up after system reboot",created:"2026-03-16",resolved:"2026-03-17",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Collection",sprint:"AD_Q1_26Sprint6",zd:2,reporter:"Sailesh Shrestha",assignee:"Juned Alam",hasFix:true,labels:["CRITICAL-ADVISORY", "jira_escalated"]},
  {key:"LP-75035",s:"logpoint/ueba/dpapi(main):projects/dataprovider/pyproject.toml - Improper Verification of ",created:"2026-03-16",resolved:"2026-03-17",status:"Closed",p:"None",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"",zd:0,reporter:"Henrik Nymann Jensen",assignee:"Henrik Nymann Jensen",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75039",s:"TUI distored when using commands change-ip, change-date and cleanup-opt",created:"2026-03-16",resolved:"2026-04-13",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint1",zd:0,reporter:"Aviyanshu Adhikari",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75050",s:"Threat Intelligence configuration cannot be deleted in Logpoint configured as an Enrichmen",created:"2026-03-16",resolved:"2026-04-23",status:"Closed",p:"Minor",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:1,reporter:"Dinesh Lamichhane",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75057",s:"Upgrade pyjwt from 2.4.0 to 2.12.0",created:"2026-03-17",resolved:"2026-04-02",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Ayush Lal Shrestha",assignee:"Saroj Bhattarai",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75071",s:"installed - Buffer Overflow in pyopenssl",created:"2026-03-17",resolved:"2026-03-18",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint6",zd:0,reporter:"Ujjwal Karna",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75081",s:"SNYK: installed - Uncontrolled Recursion in pyasn1",created:"2026-03-18",resolved:"2026-03-30",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Saroj Bhattarai",assignee:"Saroj Bhattarai",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75083",s:"Duo authentication doesn't work due to the outdated duo_universal_python library",created:"2026-03-19",resolved:"2026-03-23",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:1,reporter:"Sandeep Acharya",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority"]},
  {key:"LP-75085",s:"Logsource and Device with CIDR address not being listed for non-super admin user",created:"2026-03-19",resolved:"2026-04-13",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Krishala Prajapati",assignee:"Krishala Prajapati",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75087",s:"SNYK: installed - Missing Release of Memory after Effective Lifetime in ujson",created:"2026-03-19",resolved:"2026-04-02",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Saroj Bhattarai",assignee:"Saroj Bhattarai",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75088",s:"SNYK: installed - Integer Overflow or Wraparound in ujson",created:"2026-03-19",resolved:"2026-04-02",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Saroj Bhattarai",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75093",s:"docker-image|logpoint_linux_debian_azure - CVE-2026-3888 in snapd",created:"2026-03-20",resolved:"2026-03-24",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint7",zd:0,reporter:"Raju Tandukar",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75098",s:"Snyk - installed - Improperly Controlled Modification of Dynamically-Determined Object Att",created:"2026-03-23",resolved:"2026-03-24",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Pipeline",sprint:"AD_Q1_26Sprint7",zd:0,reporter:"Balaram Sharma",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75106",s:"Updating logsource template and applying 'Update log sources' fails",created:"2026-03-23",resolved:"2026-03-24",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Bipul Neupane",assignee:"Ayush Lal Shrestha",hasFix:true,labels:[]},
  {key:"LP-75107",s:"Unable to Unselect Distributed Collector in ODBC Fetcher Log Source",created:"2026-03-23",resolved:"2026-03-24",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Sabita Guragain",assignee:"Saroj Bhattarai",hasFix:true,labels:[]},
  {key:"LP-75110",s:"SMTP Error Message Mapping is not working for failed notifications in UI",created:"2026-03-24",resolved:"2026-03-24",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Krishala Prajapati",assignee:"Krishala Prajapati",hasFix:true,labels:[]},
  {key:"LP-75115",s:"Missing Firewall Rules on Consecutive Config Regeneration via Fabric Network Configuration",created:"2026-03-24",resolved:"2026-04-16",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Sunsun Kasajoo",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75120",s:"Enrich sync service failing to open port in distributed collector",created:"2026-03-24",resolved:"2026-04-28",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Data Pipeline",sprint:"AD_Q2_26Sprint2",zd:1,reporter:"Ranjan Shrestha",assignee:"Saroj Bhattarai",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-75125",s:"UEBA Logs Dropped by LogPoint Connector Due to Invalid Format",created:"2026-03-25",resolved:"2026-03-26",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Data Analytics",sprint:"AD_Q1_26Sprint7",zd:0,reporter:"Ujjwal Karna",assignee:"Bipul Neupane",hasFix:true,labels:[]},
  {key:"LP-75127",s:"CIFS collection halts during upgrades in customer environment",created:"2026-03-25",resolved:"",status:"Open",p:"Minor",sev:"Sev-1-High",comp:"Collection",sprint:"",zd:1,reporter:"Aavash Bhattarai",assignee:"Unassigned",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75141",s:"CIFS Fetcher fails to start due to missing ENC_KEY credential ? logs not fetched",created:"2026-03-26",resolved:"2026-03-27",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Collection",sprint:"",zd:0,reporter:"Anuj Prasad Subedi",assignee:"Bipul Neupane",hasFix:true,labels:[]},
  {key:"LP-75143",s:"docker-image|logpoint_patch_build_slave - Uncaught Exception in node",created:"2026-03-26",resolved:"2026-04-20",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Ritendra Raj Shakya",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75149",s:"Precondition Failure on /opt/makalu/storage Despite Sufficient Available Free Space",created:"2026-03-26",resolved:"2026-04-01",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q1_26Sprint7",zd:1,reporter:"Sagar Kumar Thapa",assignee:"Siddhant Shrestha",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-75166",s:"Custom Metadata values are not displayed when used as Jinja Placeholders in Incident Data",created:"2026-03-27",resolved:"2026-04-22",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint2",zd:1,reporter:"Aviyanshu Adhikari",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75170",s:"S3 Fetcher config generation fails due to invalid default date format and missing client_m",created:"2026-03-27",resolved:"2026-03-27",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Pratistha Dulal",assignee:"Nidesh Chitrakar",hasFix:true,labels:[]},
  {key:"LP-75175",s:"System Settings Page Fails to Render After form submission",created:"2026-03-30",resolved:"2026-04-01",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q1_26Sprint7",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75177",s:"@lp/ui - Infinite loop in brace-expansion",created:"2026-03-30",resolved:"2026-04-10",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Ujjwal Karna",assignee:"Ritendra Raj Shakya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75180",s:"SNYK: root - Infinite loop in brace-expansion",created:"2026-03-30",resolved:"2026-04-09",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Ujjwal Karna",assignee:"Bipin Thapa",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75181",s:"Snyk - @lp/ueba - Infinite loop in brace-expansion",created:"2026-03-30",resolved:"2026-04-17",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"UEBA Integration",sprint:"AD_Q2_26Sprint1",zd:0,reporter:"Ujjwal Karna",assignee:"Bipul Neupane",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75190",s:"Guardsix SIEM dashboard totals mismatch: Mongo alert_incidents vs Logpoint audit logs",created:"2026-03-30",resolved:"2026-04-13",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint1",zd:1,reporter:"Nikesh Kakshapati",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75196",s:"Not able to SSH via partner user",created:"2026-03-31",resolved:"2026-04-03",status:"Closed",p:"None",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Avinash Aryal",assignee:"Unassigned",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-75233",s:"docker-image|lpsm_patch_build_slave:/usr/local/lib/node_modules - Arbitrary Code Injection",created:"2026-04-02",resolved:"2026-04-08",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75234",s:"docker-image|lpsm_patch_build_slave:/usr/local/lib/node_modules - Regular Expression Denia",created:"2026-04-02",resolved:"2026-04-08",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Nidesh Chitrakar",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75235",s:"@lp/ui - Arbitrary Code Injection in lodash",created:"2026-04-02",resolved:"2026-04-24",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Bipin Thapa",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75236",s:"@lp/ueba - Arbitrary Code Injection in lodash",created:"2026-04-02",resolved:"2026-04-16",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint1",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75237",s:"@lp/log-sources - Arbitrary Code Injection in lodash",created:"2026-04-02",resolved:"2026-04-29",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75272",s:"installed - Arbitrary Code Execution in fonttools",created:"2026-04-02",resolved:"2026-04-30",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:0,reporter:"Saroj Bhattarai",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75479",s:"Predictable network naming fails on the system where udev rules are applied, and the conne",created:"2026-04-02",resolved:"2026-04-06",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint1",zd:1,reporter:"Dinesh Lamichhane",assignee:"Siddhant Shrestha",hasFix:true,labels:["jira_escalated", "support_priority_solved"]},
  {key:"LP-75480",s:"Logpoint UI published in port 8443 introducing a security risk",created:"2026-04-02",resolved:"2026-04-29",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:1,reporter:"Nabin Khanal",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority"]},
  {key:"LP-75585",s:"@lp/ueba - Arbitrary Code Injection in lodash-es",created:"2026-04-06",resolved:"2026-04-17",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint1",zd:0,reporter:"Subash Basnet",assignee:"Bipul Neupane",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75590",s:"logpoint/filekeeper - Allocation of Resources Without Limits or Throttling in com.fasterxm",created:"2026-04-06",resolved:"2026-04-06",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"",zd:0,reporter:"Subash Basnet",assignee:"Unassigned",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75591",s:"SNYK - Allocation of Resources Without Limits or Throttling in com.fasterxml.jackson.core:",created:"2026-04-06",resolved:"2026-05-26",status:"Closed",p:"Minor",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint4",zd:0,reporter:"Bhuwan Shahi",assignee:"Bhuwan Shahi",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75595",s:"Inconsistent Editing feature in Shared Alert Rules",created:"2026-04-06",resolved:"",status:"Open",p:"Minor",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint6",zd:1,reporter:"Aviyanshu Adhikari",assignee:"Saroj Bhattarai",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75611",s:"guardsix UI: Some of the local guardsix users are missing on Web-GUI under User Accounts",created:"2026-04-07",resolved:"2026-04-22",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:1,reporter:"Ishwor Khanal",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75643",s:"RCE through file upload in Logsource",created:"2026-04-09",resolved:"2026-04-22",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:0,reporter:"Adithya Pokharel",assignee:"Bijay Silwal",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75658",s:"Issues Encountered While Using Sync Functionality Across Data Nodes via Search Head",created:"2026-04-10",resolved:"",status:"In Review",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:1,reporter:"Sagar Kumar Thapa",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75660",s:"@lp/ui - Unintended Proxy or Intermediary ('Confused Deputy') in axios",created:"2026-04-13",resolved:"2026-04-15",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75665",s:"Migration of Mongo Credentials to Keystore fails silently in SaaS",created:"2026-04-13",resolved:"2026-04-27",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint2",zd:1,reporter:"Aashish Adhikari",assignee:"Kalpesh Manandhar",hasFix:true,labels:["doc_not_required", "jira_escalated"]},
  {key:"LP-75668",s:"installed - Allocation of Resources Without Limits or Throttling in pillow",created:"2026-04-15",resolved:"2026-04-16",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint1",zd:0,reporter:"Juned Alam",assignee:"Juned Alam",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75676",s:"Inconsistency in Extracting Vendor Alert Rules Between UI & Alertrules API",created:"2026-04-15",resolved:"2026-04-16",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint1",zd:1,reporter:"Ujjwal Karna",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75683",s:"False positive alerts and dashboard widget results triggered due to newline character in s",created:"2026-04-15",resolved:"2026-05-13",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint3",zd:3,reporter:"Kaushik Panta",assignee:"Saroj Bhattarai",hasFix:true,labels:["AlertRules", "Dashboard", "alert_engine"]},
  {key:"LP-75684",s:"docker-image|logpoint_linux_debian_ami - Stack-based Buffer Overflow in lua-bitop",created:"2026-04-16",resolved:"2026-05-18",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:0,reporter:"Manu Narayan Shrestha",assignee:"Suresh Pantha",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75693",s:"logpoint/javalib - Use of a Broken or Risky Cryptographic Algorithm in org.bouncycastle:bc",created:"2026-04-16",resolved:"2026-04-22",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint2",zd:0,reporter:"Juned Alam",assignee:"Bipul Neupane",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75696",s:"logpoint/javalib - Timing Attack in org.bouncycastle:bcprov-jdk18on",created:"2026-04-16",resolved:"2026-04-22",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"AD_Q2_26Sprint2",zd:0,reporter:"Juned Alam",assignee:"Bipul Neupane",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75712",s:"Raw Syslog Forwarder does not forward logs from URAF/Cloud Fetcher sources and Documentati",created:"2026-04-16",resolved:"",status:"Open",p:"None",sev:"Sev-2-Medium",comp:"Collection",sprint:"",zd:0,reporter:"Kaushik Panta",assignee:"Unassigned",hasFix:false,labels:[]},
  {key:"LP-75714",s:"Raw Syslog Forwarder fails to generate configuration for valid syslog devices when URAF or",created:"2026-04-16",resolved:"",status:"In Review",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:0,reporter:"Kaushik Panta",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required"]},
  {key:"LP-75717",s:"Alertrules created from the API show an empty box in alert throttling when editing them fr",created:"2026-04-16",resolved:"2026-05-26",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:1,reporter:"Sandeep Acharya",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75801",s:"Issue observed in alert_engine where alert queries have \"TABLE\" ",created:"2026-04-22",resolved:"2026-05-12",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint3",zd:5,reporter:"Urgen Norbu Sherpa",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75804",s:"installed - XML External Entity (XXE) Injection in lxml",created:"2026-04-22",resolved:"2026-05-11",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint3",zd:0,reporter:"Juned Alam",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75811",s:"Alertrules created from API with flush_on_trigger: true is triggered only once and then ne",created:"2026-04-23",resolved:"2026-05-12",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint3",zd:2,reporter:"Sandeep Acharya",assignee:"Bijay Silwal",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75826",s:"Cannot set path to \"/\" in Export management using FTP",created:"2026-04-23",resolved:"",status:"In Progress",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:1,reporter:"Sandeep Acharya",assignee:"Rubika Bashyal",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75827",s:"Removing unused devices in Syslog Forwarder UI removes valid devices if devices are added ",created:"2026-04-24",resolved:"2026-05-13",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Collection",sprint:"WebApplication_Q2_26Sprint3",zd:1,reporter:"Kaushik Panta",assignee:"Sabita Guragain",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75828",s:"Devices without distributed collector are synced to Syslog Forwarder, causing confusion an",created:"2026-04-24",resolved:"",status:"Open",p:"Minor",sev:"Sev-3-Low",comp:"Collection",sprint:"",zd:1,reporter:"Kaushik Panta",assignee:"Ujjwal Karna",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75829",s:"Deleted devices from Main Logpoint are not removed from Syslog Forwarder after sync and ca",created:"2026-04-24",resolved:"2026-05-11",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:1,reporter:"Kaushik Panta",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75830",s:"Duplicate devices created in Syslog Forwarder when device is re-added with same IP but dif",created:"2026-04-24",resolved:"2026-05-06",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:1,reporter:"Kaushik Panta",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75834",s:"RBAC bypass in Syslog Forwarder: users with no permissions can modify forwarding configura",created:"2026-04-24",resolved:"2026-05-15",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:1,reporter:"Kaushik Panta",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75839",s:"Patch install can leave webapiserver log path absent if symlink is present breaking servic",created:"2026-04-24",resolved:"2026-05-28",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:1,reporter:"Aashish Adhikari",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_not_required", "jira_escalated"]},
  {key:"LP-75840",s:"SNYK logpoint/uebadataprocessor - Improper Validation of Specified Index, Position, or Off",created:"2026-04-26",resolved:"2026-06-05",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"AD_Q2_26Sprint5",zd:0,reporter:"Juned Alam",assignee:"Bipul Neupane",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-75843",s:"SNYK - logpoint/Report - Improper Encoding or Escaping of Output in org.apache.logging.log",created:"2026-04-26",resolved:"2026-05-26",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Alert & Incidents",sprint:"AD_Q2_26Sprint4",zd:0,reporter:"Juned Alam",assignee:"Bhuwan Shahi",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75846",s:"@lp/ui - HTTP Response Splitting in axios",created:"2026-04-27",resolved:"2026-05-06",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75847",s:"root - Improper Removal of Sensitive Information Before Storage or Transfer in follow-redi",created:"2026-04-27",resolved:"2026-05-06",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required", "snyk_reported"]},
  {key:"LP-75848",s:"IndexSearcher retention job fails with generic error message, lacking detailed logs for tr",created:"2026-04-27",resolved:"",status:"Open",p:"Minor",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"",zd:2,reporter:"Kaushik Panta",assignee:"Subash Basnet",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75866",s:"Syslog Forwarder Architecture Revamp to Address Security, Data Reliability, and Scalabilit",created:"2026-04-27",resolved:"",status:"Open",p:"None",sev:"Sev-2-Medium",comp:"Collection",sprint:"",zd:1,reporter:"Kaushik Panta",assignee:"Pratik Budhathoki",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75880",s:"Issue observed in alerts created from searchmaster and director API without defining searc",created:"2026-04-28",resolved:"2026-06-02",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint3",zd:3,reporter:"Sandeep Acharya",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75881",s:"Logpoint UI not responsive because of uvicorn workers stuck on mongo topology discover",created:"2026-04-28",resolved:"2026-05-12",status:"Closed",p:"Top",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:6,reporter:"Nabin Khanal",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75903",s:"[UI] Loading Spinner Not Displayed During Module Navigation",created:"2026-04-29",resolved:"2026-04-29",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint2",zd:0,reporter:"Sabita Guragain",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:[]},
  {key:"LP-75917",s:"Embedded widget url not working after v7.9.0",created:"2026-04-29",resolved:"2026-05-21",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:2,reporter:"Ranjan Shrestha",assignee:"Ayush Lal Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-75952",s:"Local Privilege Escalation in Seconds via Copy Fail Vulnerability (CVE-2026-31431)",created:"2026-05-01",resolved:"2026-05-15",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint3",zd:14,reporter:"Sagar Kumar Thapa",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76000",s:"Stale tunnel 10001 interface IP in api_config_service configuration file on SIEM",created:"2026-05-01",resolved:"2026-05-14",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"LPSM",sprint:"Director_Q2_26Sprint3",zd:2,reporter:"Aayush Sah",assignee:"Diya Shrestha",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority_solved"]},
  {key:"LP-75965",s:"VLAN DNS not handled in runtime extraction in update_dnsmasq.py",created:"2026-05-04",resolved:"",status:"Open",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Ishwor Khanal",assignee:"Kalpesh Manandhar",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75966",s:"Incorrect resolvectl parsing in update_dnsmasq.py",created:"2026-05-04",resolved:"",status:"In Review",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint5",zd:1,reporter:"Ishwor Khanal",assignee:"Kalpesh Manandhar",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75967",s:"Race condition when multiple instances of update_dnsmasq.py run causing invalid entry on /",created:"2026-05-04",resolved:"",status:"Open",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Ishwor Khanal",assignee:"Kalpesh Manandhar",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75969",s:"Search domain trailing space causes parsing mismatch on update_dnsmasq_netplan.py",created:"2026-05-04",resolved:"2026-05-27",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:1,reporter:"Ishwor Khanal",assignee:"Kalpesh Manandhar",hasFix:true,labels:["doc_not_required", "jira_escalated"]},
  {key:"LP-75973",s:"Over-triggering of networkd-dispatcher due to routeable interface docker0 ",created:"2026-05-04",resolved:"",status:"Open",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Ishwor Khanal",assignee:"Unassigned",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-75977",s:"Runit service failing on patch upgrade phase",created:"2026-05-04",resolved:"2026-05-06",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint3",zd:0,reporter:"Ujjwal Karna",assignee:"Siddhant Shrestha",hasFix:true,labels:[]},
  {key:"LP-75994",s:"Machine Inaccessible Due to Missing Environment Variable",created:"2026-05-06",resolved:"2026-05-06",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:0,reporter:"Sabita Guragain",assignee:"Sabita Guragain",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-75996",s:"Sorting order broken in Parallel Coordinates and Sankey graphs; fields displayed alphabeti",created:"2026-05-06",resolved:"2026-05-19",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:1,reporter:"Kaushik Panta",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["Dashboard", "doc_required", "jira_escalated"]},
  {key:"LP-76014",s:"snyk - python-multipart@0.0.22 vulnerability -  Allocation of Resources Without Limits or ",created:"2026-05-08",resolved:"2026-05-22",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:0,reporter:"Saroj Bhattarai",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76015",s:"logpoint/Report - Improper Encoding or Escaping of Output in org.apache.logging.log4j:log4",created:"2026-05-08",resolved:"2026-05-26",status:"Closed",p:"Minor",sev:"Sev-0-Critical",comp:"Data Analytics",sprint:"AD_Q2_26Sprint4",zd:0,reporter:"Juned Alam",assignee:"Bhuwan Shahi",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76019",s:"Issue in 7.8.0 patch",created:"2026-05-08",resolved:"",status:"Open",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:0,reporter:"Urgen Norbu Sherpa",assignee:"Unassigned",hasFix:false,labels:[]},
  {key:"LP-76021",s:"SaaS: View Incident Data fails with 'No Response from Server'",created:"2026-05-08",resolved:"2026-05-18",status:"Closed",p:"Top",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint4",zd:1,reporter:"Ishwor Khanal",assignee:"Ujjwal Karna",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-76033",s:"Assess Exposure and Mitigation for Linux ?Dirty Frag? Local Privilege Escalation Vulnerabi",created:"2026-05-08",resolved:"2026-05-21",status:"Closed",p:"Major",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:4,reporter:"Roshan Pokhrel",assignee:"Raju Tandukar",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76040",s:"EventHubs Jenkins Build Failure",created:"2026-05-08",resolved:"2026-05-11",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint3",zd:0,reporter:"Pratistha Dulal",assignee:"Siddhant Shrestha",hasFix:true,labels:[]},
  {key:"LP-76041",s:"Some fields are missing in alert incidents for delayed logs",created:"2026-05-09",resolved:"",status:"Open",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"AD_Q2_26Sprint5",zd:1,reporter:"Urmila Maharjan",assignee:"Bipul Neupane",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76043",s:"Hyper-V based systems inaccessible after 7.9.0 upgrade",created:"2026-05-09",resolved:"",status:"In Progress",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint5",zd:5,reporter:"Sailesh Shrestha",assignee:"Siddhant Shrestha",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76057",s:"LP_ Prefix Validation Missing for Search Template Rename",created:"2026-05-11",resolved:"",status:"Open",p:"None",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"",zd:0,reporter:"Bhabesh Raj Rai",assignee:"Manish Gyawali",hasFix:false,labels:[]},
  {key:"LP-76058",s:"Raw Syslog Forwarder forwards all localhost logs to remote target even when only HTTP Coll",created:"2026-05-11",resolved:"2026-05-22",status:"Closed",p:"Major",sev:"Sev-3-Low",comp:"Data Pipeline",sprint:"AD_Q2_26Sprint4",zd:1,reporter:"Ranjan Shrestha",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76073",s:"TypeError: s.weekday is not a function thrown in datepicker when updating date fields",created:"2026-05-12",resolved:"2026-05-13",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint3",zd:0,reporter:"Siya Shrestha",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-76075",s:"Unable to Create Processing Policy from Search Head Due to Missing Enrichment Policies",created:"2026-05-12",resolved:"",status:"Open",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:0,reporter:"Krishala Prajapati",assignee:"Krishala Prajapati",hasFix:false,labels:[]},
  {key:"LP-76076",s:"Last Log Received Value Not Updating for Log Sources Receiving Logs Through Syslog Forward",created:"2026-05-12",resolved:"",status:"In Progress",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:0,reporter:"Ayush Lal Shrestha",assignee:"Apil Chaudhary",hasFix:false,labels:[]},
  {key:"LP-76077",s:"@lp/log-sources - Improper Validation of Specified Index, Position, or Offset in Input in ",created:"2026-05-13",resolved:"2026-06-01",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:0,reporter:"Shrijan Bahadur Bajracharya",assignee:"Shrijan Bahadur Bajracharya",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76079",s:"snyk - upgrade urllib3 from 2.6.3 to 2.7.0) - Decompression Bomb",created:"2026-05-13",resolved:"2026-05-27",status:"Closed",p:"Minor",sev:"Sev-0-Critical",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:0,reporter:"Saroj Bhattarai",assignee:"Saroj Bhattarai",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76084",s:"Unable to configure Pool Configuration after enabling Fabric Connect",created:"2026-05-13",resolved:"",status:"Open",p:"Minor",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"",zd:0,reporter:"Bijay Silwal",assignee:"Bijay Silwal",hasFix:false,labels:["doc_not_required"]},
  {key:"LP-76092",s:"Unused Log Source not removed during Syslog Forwarder cleanup",created:"2026-05-13",resolved:"",status:"Open",p:"Minor",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:0,reporter:"Sabita Guragain",assignee:"Sabita Guragain",hasFix:false,labels:[]},
  {key:"LP-76105",s:"snyk- ujson@5.12.0 - Missing Release of Memory after Effective Lifetime",created:"2026-05-14",resolved:"2026-05-22",status:"Closed",p:"Minor",sev:"Sev-3-Low",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint4",zd:0,reporter:"Saroj Bhattarai",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76108",s:"Premerger query counter leak leading to stall of the detection pipeline",created:"2026-05-14",resolved:"2026-05-27",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Data Analytics",sprint:"AD_Q2_26Sprint4",zd:1,reporter:"Aashish Adhikari",assignee:"Bipul Neupane",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76140",s:"HTTP notification fails for JSON array body due to dict-only update logic",created:"2026-05-15",resolved:"2026-05-28",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"WebApplication_Q2_26Sprint4",zd:1,reporter:"Sandesh Subedi",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76314",s:"Ingestion time normalization (signature normalizer) does not handle quoted dynamic definer",created:"2026-05-15",resolved:"",status:"Open",p:"None",sev:"Sev-2-Medium",comp:"Data Pipeline",sprint:"",zd:0,reporter:"Bipul Neupane",assignee:"Unassigned",hasFix:false,labels:[]},
  {key:"LP-76143",s:"Premerger halted at 0 UTC",created:"2026-05-15",resolved:"",status:"In Progress",p:"Top",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint5",zd:1,reporter:"Sailesh Shrestha",assignee:"Subash Basnet",hasFix:false,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76159",s:"Inactivity Threshold doesn't accept \"60\" as valid value",created:"2026-05-18",resolved:"",status:"Open",p:"Minor",sev:"Sev-1-High",comp:"Web Configuration",sprint:"",zd:1,reporter:"Aavash Bhattarai",assignee:"Sabita Guragain",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76189",s:"Alert Dialog Box: Incorrect Space Formatting in Query on Overview Tab",created:"2026-05-20",resolved:"",status:"Open",p:"Minor",sev:"Sev-3-Low",comp:"UX Analytics",sprint:"",zd:1,reporter:"Aashish Adhikari",assignee:"Shrijan Bahadur Bajracharya",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76194",s:"Reports failing with java.lang.ClassCastException",created:"2026-05-21",resolved:"2026-06-08",status:"Closed",p:"Top",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"AD_Q2_26Sprint5",zd:3,reporter:"Adithya Pokharel",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated", "support_priority_solved"]},
  {key:"LP-76202",s:"Failed patch installations are not visible in the updates section of the UI",created:"2026-05-21",resolved:"",status:"In Review",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:1,reporter:"Nabin Khanal",assignee:"Saroj Bhattarai",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76206",s:"docker-image|logpoint_linux_debian_ami - Time-of-check Time-of-use (TOCTOU) in rsync",created:"2026-05-22",resolved:"2026-05-25",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:0,reporter:"Raju Tandukar",assignee:"Siddhant Shrestha",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76212",s:"[UEBA] IP forwarding not enabled on distributed search head when selected repos belong onl",created:"2026-05-22",resolved:"2026-05-26",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint4",zd:1,reporter:"Amrit Koirala",assignee:"Siddhant Shrestha",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76221",s:"logpoint/Report - Deserialization of Untrusted Data in net.sf.jasperreports:jasperreports",created:"2026-05-25",resolved:"",status:"Open",p:"Minor",sev:"Sev-3-Low",comp:"Data Analytics",sprint:"",zd:0,reporter:"Juned Alam",assignee:"Bipul Neupane",hasFix:false,labels:["snyk_reported"]},
  {key:"LP-76224",s:"Port 5050 not opened in AgentX",created:"2026-05-25",resolved:"",status:"Open",p:"None",sev:"Sev-3-Low",comp:"Collection",sprint:"",zd:1,reporter:"Ranjan Shrestha",assignee:"Unassigned",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76241",s:"Unable to restore configuration and logs backup in other machine",created:"2026-05-26",resolved:"",status:"In Review",p:"Top",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:1,reporter:"Sailesh Shrestha",assignee:"Shreewatsa Timalsena",hasFix:true,labels:["doc_required", "jira_escalated"]},
  {key:"LP-76264",s:"logpoint/ndr/sensornet(develop):frontend/packages/components/package.json - Arbitrary Comm",created:"2026-05-27",resolved:"2026-05-27",status:"Closed",p:"None",sev:"Sev-0-Critical",comp:"Alert & Incidents",sprint:"",zd:0,reporter:"Gabor M?t? Guly?s",assignee:"Gabor M?t? Guly?s",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76277",s:"Report Generation Crashes When Field Contains Value with Newline and Whitespace Characters",created:"2026-05-27",resolved:"",status:"Open",p:"None",sev:"Sev-2-Medium",comp:"Data Analytics",sprint:"",zd:0,reporter:"Ishwor Khanal",assignee:"Unassigned",hasFix:false,labels:[]},
  {key:"LP-76287",s:"Error popup appears when default timeout (15 minutes) ",created:"2026-05-29",resolved:"2026-06-05",status:"Closed",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:0,reporter:"Sabita Guragain",assignee:"Ujjwal Karna",hasFix:true,labels:["doc_not_required"]},
  {key:"LP-76329",s:"Wheel packages not updated in 7.9.2 ",created:"2026-05-29",resolved:"2026-06-01",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"",zd:4,reporter:"Sailesh Shrestha",assignee:"Manu Narayan Shrestha",hasFix:true,labels:["jira_escalated"]},
  {key:"LP-76330",s:"Wheel packages were not installed in 7920 flexpatch",created:"2026-05-29",resolved:"2026-06-01",status:"Closed",p:"Top",sev:"Sev-0-Critical",comp:"Build & Deployment",sprint:"ABRD_Q2_26Sprint5",zd:0,reporter:"Manu Narayan Shrestha",assignee:"Manu Narayan Shrestha",hasFix:true,labels:[]},
  {key:"LP-76354",s:"Upgrade fails - GRUB script writes incorrect EFI partition to /etc/fstab on ZFS systems wi",created:"2026-06-01",resolved:"",status:"Open",p:"None",sev:"Sev-1-High",comp:"Build & Deployment",sprint:"",zd:1,reporter:"Amrit Koirala",assignee:"Unassigned",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76366",s:"Configuration restore doesn't restore/update the vpn certificate",created:"2026-06-02",resolved:"",status:"Open",p:"Major",sev:"Sev-2-Medium",comp:"Web Configuration",sprint:"",zd:1,reporter:"Sandeep Acharya",assignee:"Ayush Lal Shrestha",hasFix:false,labels:["jira_escalated"]},
  {key:"LP-76396",s:"settings - Deserialization of Untrusted Data in react-router",created:"2026-06-04",resolved:"2026-06-05",status:"Closed",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:0,reporter:"Sabita Guragain",assignee:"Sabita Guragain",hasFix:true,labels:["snyk_reported"]},
  {key:"LP-76400",s:"Upgrade pyjwt from 2.12.0 to 2.13.0",created:"2026-06-04",resolved:"",status:"In Review",p:"Major",sev:"Sev-1-High",comp:"Web Configuration",sprint:"WebApplication_Q2_26Sprint5",zd:0,reporter:"Shreewatsa Timalsena",assignee:"Saroj Bhattarai",hasFix:false,labels:["snyk_reported"]},
  {key:"LP-76425",s:"Failure to deserialize indexsearcher response when delayedMaps key contains surrogate pair",created:"2026-06-05",resolved:"",status:"Open",p:"None",sev:"Sev-1-High",comp:"Alert & Incidents",sprint:"",zd:1,reporter:"Aashish Adhikari",assignee:"Manish Gyawali",hasFix:false,labels:["jira_escalated"]},
];

const DRIFT     = [{"month": "2026-01", "created": 37, "resolved": 17, "net": 20, "cumulative": 20, "no_fix_ver": 2, "no_sprint": 11, "unassigned": 0, "top": 12, "major": 20}, {"month": "2026-02", "created": 48, "resolved": 30, "net": 18, "cumulative": 38, "no_fix_ver": 1, "no_sprint": 5, "unassigned": 3, "top": 9, "major": 33}, {"month": "2026-03", "created": 47, "resolved": 50, "net": -3, "cumulative": 35, "no_fix_ver": 1, "no_sprint": 7, "unassigned": 3, "top": 9, "major": 27}, {"month": "2026-04", "created": 46, "resolved": 48, "net": -2, "cumulative": 33, "no_fix_ver": 6, "no_sprint": 6, "unassigned": 2, "top": 4, "major": 30}, {"month": "2026-05", "created": 46, "resolved": 39, "net": 7, "cumulative": 40, "no_fix_ver": 19, "no_sprint": 17, "unassigned": 5, "top": 10, "major": 21}, {"month": "2026-06", "created": 5, "resolved": 8, "net": -3, "cumulative": 37, "no_fix_ver": 4, "no_sprint": 3, "unassigned": 1, "top": 0, "major": 3}];
const COMP_HEAT = [{"month": "2026-01", "Build_Deployment": 15, "Web_Configuration": 8, "Data_Analytics": 5, "Alert_Incidents": 4, "Data_Pipeline": 3, "Collection": 1}, {"month": "2026-02", "Build_Deployment": 9, "Web_Configuration": 19, "Data_Analytics": 10, "Alert_Incidents": 4, "Data_Pipeline": 3, "Collection": 1}, {"month": "2026-03", "Build_Deployment": 8, "Web_Configuration": 22, "Data_Analytics": 3, "Alert_Incidents": 7, "Data_Pipeline": 3, "Collection": 3}, {"month": "2026-04", "Build_Deployment": 4, "Web_Configuration": 21, "Data_Analytics": 8, "Alert_Incidents": 9, "Data_Pipeline": 0, "Collection": 4}, {"month": "2026-05", "Build_Deployment": 15, "Web_Configuration": 15, "Data_Analytics": 7, "Alert_Incidents": 4, "Data_Pipeline": 2, "Collection": 1}, {"month": "2026-06", "Build_Deployment": 1, "Web_Configuration": 3, "Data_Analytics": 0, "Alert_Incidents": 1, "Data_Pipeline": 0, "Collection": 0}];
const SPRINT    = [{"team": "WebApplication", "bugs": 99, "resolved": 93, "rate": 94}, {"team": "AD", "bugs": 41, "resolved": 39, "rate": 95}, {"team": "ABRD", "bugs": 38, "resolved": 36, "rate": 95}, {"team": "No Sprint", "bugs": 49, "resolved": 23, "rate": 47}, {"team": "Agents", "bugs": 1, "resolved": 0, "rate": 0}];
const LABELS    = [{"label": "jira_escalated", "count": 105, "meaning": "Came from customer via support"}, {"label": "doc_not_required", "count": 73, "meaning": "Internal/infra fix, no docs needed"}, {"label": "doc_required", "count": 65, "meaning": "Customer-facing change needing docs"}, {"label": "snyk_reported", "count": 61, "meaning": "Security vulnerability from Snyk scan"}, {"label": "support_priority_solved", "count": 13, "meaning": "Escalated, now resolved"}, {"label": "support_priority", "count": 3, "meaning": "Active customer escalation"}, {"label": "hotfix", "count": 2, "meaning": "Emergency out-of-band fix"}, {"label": "QA_required", "count": 2, "meaning": "Needs dedicated QA sign-off"}];
const COMP_AGE  = [{"comp": "Build & Deployment", "total": 52, "open": 7, "no_fix_ver": 7, "avg_age": 30, "max_age": 35}, {"comp": "Web Configuration", "total": 88, "open": 13, "no_fix_ver": 9, "avg_age": 37, "max_age": 150}, {"comp": "Data Analytics", "total": 33, "open": 5, "no_fix_ver": 5, "avg_age": 24, "max_age": 42}, {"comp": "Alert & Incidents", "total": 29, "open": 3, "no_fix_ver": 3, "avg_age": 32, "max_age": 63}, {"comp": "Data Pipeline", "total": 11, "open": 1, "no_fix_ver": 1, "avg_age": 24, "max_age": 24}, {"comp": "Collection", "total": 10, "open": 7, "no_fix_ver": 7, "avg_age": 70, "max_age": 139}];
const ROOTS     = [{"id": 1, "icon": "\ud83d\udcc8", "color": "#ef4444", "title": "Creation outpaced resolution in Jan, Feb, May", "months": "Jan +20, Feb +18, May +7", "detail": "Three of six months ended with more bugs created than resolved. January started the year already accumulating 20 new net bugs. May is the most alarming \u2014 46 created, only 39 resolved, and 46% of May bugs are still open as of June 8."}, {"id": 2, "icon": "\ud83d\udd12", "color": "#f97316", "title": "61 Snyk security bugs added Feb-Jun \u2014 none had fix versions at creation", "months": "snyk_reported label", "detail": "Snyk automated scanning is continuously injecting new security-vulnerability bugs into the backlog. These arrive with no fix version, no sprint assignment, and often no assignee. They inflate the \"no planned release\" debt by default. 14% of all bugs (33/229) currently have no fix version and are open \u2014 the majority are Snyk-generated."}, {"id": 3, "icon": "\ud83e\udded", "color": "#f59e0b", "title": "49 bugs (21%) have no sprint \u2014 resolving at only 47% vs 95% for sprint-assigned bugs", "months": "No Sprint = 47% resolve rate", "detail": "Sprint-assigned bugs (WebApplication, AD, ABRD teams) resolve at 94-95%. The 49 bugs with no sprint assignment resolve at 47% \u2014 nearly half never get picked up. These unplanned bugs accumulate silently. They are mostly escalated customer bugs (jira_escalated) and Snyk findings that were filed but never pulled into a sprint."}, {"id": 4, "icon": "\ud83c\udfd7\ufe0f", "color": "#a855f7", "title": "Collection component avg backlog age is 70 days \u2014 oldest open debt", "months": "Collection: 7 open, 70d avg age", "detail": "Collection bugs sit unresolved for an average of 70 days. All 7 open Collection bugs have no fix version assigned. Web Configuration is second worst at 37 days. These components lack regular sprint coverage \u2014 bugs filed against them tend to drift unless a customer escalation forces them."}, {"id": 5, "icon": "\ud83d\udd04", "color": "#38bdf8", "title": "Web Configuration surged to 88 bugs (38% of all 2026 bugs) \u2014 April spike was 26 bugs in one month", "months": "Jan:9 \u2192 Feb:16 \u2192 Mar:17 \u2192 Apr:26 \u2192 May:18 \u2192 Jun:2", "detail": "Web Configuration has by far the most bugs of any component \u2014 almost double Build & Deployment. The April spike (26 bugs) coincides with the 7.9.0.4 patch release on April 22. Patch releases consistently trigger Web Config regressions: config restore, backup/restore, SSL cert handling, FTP export, and settings page bugs cluster immediately after each release."}, {"id": 6, "icon": "\ud83d\udc64", "color": "#22c55e", "title": "105 bugs (46%) came from customer escalations (jira_escalated label)", "months": "jira_escalated: 105 bugs", "detail": "Nearly half of all 2026 bugs originated from customer escalations via support \u2014 not from internal QA or proactive monitoring. This means the QA process is missing half of what customers are hitting. The top reporters (Ishwor Khanal, Kaushik Panta, Ujjwal Karna) are all support engineers filing bugs from ZD tickets, not QA engineers finding issues pre-release."}];

const SEV_MONTHLY  = [{"month": "2026-01", "Critical": 9, "Critical_open": 0, "High": 13, "High_open": 0, "Medium": 11, "Medium_open": 1, "Low": 4, "Low_open": 1}, {"month": "2026-02", "Critical": 6, "Critical_open": 0, "High": 20, "High_open": 0, "Medium": 16, "Medium_open": 0, "Low": 6, "Low_open": 1}, {"month": "2026-03", "Critical": 5, "Critical_open": 0, "High": 15, "High_open": 1, "Medium": 24, "Medium_open": 0, "Low": 3, "Low_open": 0}, {"month": "2026-04", "Critical": 3, "Critical_open": 0, "High": 10, "High_open": 1, "Medium": 24, "Medium_open": 5, "Low": 9, "Low_open": 2}, {"month": "2026-05", "Critical": 12, "Critical_open": 0, "High": 16, "High_open": 10, "Medium": 10, "Medium_open": 6, "Low": 8, "Low_open": 5}, {"month": "2026-06", "Critical": 0, "Critical_open": 0, "High": 4, "High_open": 3, "Medium": 1, "Medium_open": 1, "Low": 0, "Low_open": 0}];
const SEV_COMP     = [{"comp": "Build & Deployment", "total": 52, "Critical": 13, "Critical_open": 0, "High": 22, "High_open": 7, "Medium": 13, "Medium_open": 0, "Low": 4, "Low_open": 0}, {"comp": "Web Configuration", "total": 88, "Critical": 6, "Critical_open": 0, "High": 27, "High_open": 5, "Medium": 45, "Medium_open": 7, "Low": 10, "Low_open": 1}, {"comp": "Data Analytics", "total": 33, "Critical": 5, "Critical_open": 0, "High": 8, "High_open": 0, "Medium": 13, "Medium_open": 2, "Low": 7, "Low_open": 3}, {"comp": "Alert & Incidents", "total": 29, "Critical": 7, "Critical_open": 0, "High": 13, "High_open": 2, "Medium": 7, "Medium_open": 1, "Low": 2, "Low_open": 0}, {"comp": "Data Pipeline", "total": 11, "Critical": 1, "Critical_open": 0, "High": 3, "High_open": 0, "Medium": 5, "Medium_open": 1, "Low": 2, "Low_open": 0}, {"comp": "Collection", "total": 10, "Critical": 1, "Critical_open": 0, "High": 3, "High_open": 1, "Medium": 2, "Medium_open": 2, "Low": 4, "Low_open": 4}];
const SEV_BACKLOG  = [{"month": "2026-01", "total": 20, "Critical": 4, "High": 5, "Medium": 9, "Low": 2}, {"month": "2026-02", "total": 38, "Critical": 4, "High": 13, "Medium": 15, "Low": 6}, {"month": "2026-03", "total": 35, "Critical": 0, "High": 8, "Medium": 23, "Low": 4}, {"month": "2026-04", "total": 33, "Critical": 1, "High": 8, "Medium": 16, "Low": 8}, {"month": "2026-05", "total": 40, "Critical": 3, "High": 12, "Medium": 15, "Low": 10}, {"month": "2026-06", "total": 37, "Critical": 0, "High": 15, "Medium": 13, "Low": 9}];
const SEV_STATS    = [{"sev": "Critical", "full": "Sev-0-Critical", "total": 35, "open": 0, "no_fix": 0, "zd": 61, "open_pct": 0, "avg_age": 0}, {"sev": "High", "full": "Sev-1-High", "total": 78, "open": 15, "no_fix": 12, "zd": 69, "open_pct": 19, "avg_age": 28}, {"sev": "Medium", "full": "Sev-2-Medium", "total": 86, "open": 13, "no_fix": 12, "zd": 52, "open_pct": 15, "avg_age": 43}, {"sev": "Low", "full": "Sev-3-Low", "total": 30, "open": 9, "no_fix": 9, "zd": 13, "open_pct": 30, "avg_age": 50}];
const SEV_MIX      = [{"month": "2026-01", "total": 37, "Critical_pct": 24, "High_pct": 35, "Medium_pct": 30, "Low_pct": 11}, {"month": "2026-02", "total": 48, "Critical_pct": 12, "High_pct": 42, "Medium_pct": 33, "Low_pct": 12}, {"month": "2026-03", "total": 47, "Critical_pct": 11, "High_pct": 32, "Medium_pct": 51, "Low_pct": 6}, {"month": "2026-04", "total": 46, "Critical_pct": 7, "High_pct": 22, "Medium_pct": 52, "Low_pct": 20}, {"month": "2026-05", "total": 46, "Critical_pct": 26, "High_pct": 35, "Medium_pct": 22, "Low_pct": 17}, {"month": "2026-06", "total": 5, "Critical_pct": 0, "High_pct": 80, "Medium_pct": 20, "Low_pct": 0}];

const COMP_KEYS   = ["Build_Deployment","Web_Configuration","Data_Analytics","Alert_Incidents","Data_Pipeline","Collection"];
const COMP_LABELS = {"Build_Deployment":"Build & Deployment","Web_Configuration":"Web Configuration",
  "Data_Analytics":"Data Analytics","Alert_Incidents":"Alert & Incidents","Data_Pipeline":"Data Pipeline","Collection":"Collection"};

function Card({title,sub,children,style={}}) {
  return (
    <div style={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:12,padding:20,...style}}>
      {title&&<div style={{fontSize:11,fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase",color:"#475569",marginBottom:sub?4:14}}>{title}</div>}
      {sub&&<div style={{fontSize:12,color:"#64748b",marginBottom:14}}>{sub}</div>}
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
function Kpi({label,value,sub,color,warn}) {
  return (
    <div style={{textAlign:"center",padding:"8px 14px",background:warn?"rgba(239,68,68,0.08)":"rgba(255,255,255,0.03)",borderRadius:8,border:"1px solid "+(warn?"#ef444430":color+"30")}}>
      <div style={{fontSize:22,fontWeight:700,color:warn?"#ef4444":color}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:(warn?"#ef4444":color)+"aa",fontWeight:600}}>{sub}</div>}
      <div style={{fontSize:10,color:"#64748b",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{label}</div>
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("Backlog Drift");
  const totalBugs=DATA.length;
  const openBugs=DATA.filter(r=>r.status!=="Closed").length;
  const noFix=DATA.filter(r=>!r.hasFix&&r.status!=="Closed").length;
  const escalated=DATA.filter(r=>r.labels.includes("jira_escalated")).length;
  const snyk=DATA.filter(r=>r.labels.includes("snyk_reported")).length;
  const cumBacklog=DRIFT[DRIFT.length-1].cumulative;
  return (
    <div style={{fontFamily:"'DM Mono','Fira Code',monospace",background:"#0a0f1e",minHeight:"100vh",color:"#e2e8f0"}}>
      <div style={{background:"linear-gradient(135deg,#0f172a,#1e1b4b)",borderBottom:"1px solid #1e3a5f",padding:"18px 24px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4,flexWrap:"wrap"}}>
          <div style={{width:34,height:34,borderRadius:8,background:"linear-gradient(135deg,#ef4444,#f97316)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{"\u26A0\uFE0F"}</div>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:"#f8fafc"}}>LogPoint Bug Backlog Deep-Dive</div>
            <div style={{fontSize:10,color:"#64748b",letterSpacing:"0.08em"}}>
              {"Jan 2026 \u2013 Jun 2026 \u00B7 All bugs (not just ZD>0) \u00B7 "}
              <span style={{color:"#f97316",fontWeight:600}}>Backlog growing since Jan 2026</span>
            </div>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:10,flexWrap:"wrap"}}>
            <Kpi label="Total Bugs"       value={totalBugs}    color="#3b82f6"/>
            <Kpi label="Still Open"       value={openBugs}     color="#f97316" warn={openBugs>40}/>
            <Kpi label="Cum. Backlog"     value={"+"+cumBacklog} sub="net since Jan" color="#ef4444" warn/>
            <Kpi label="No Fix Version"   value={noFix}        sub="unplanned open" color="#f59e0b" warn={noFix>25}/>
            <Kpi label="Escalated"        value={escalated}    sub="from customers" color="#a855f7"/>
            <Kpi label="Snyk Security"    value={snyk}         sub="auto-detected"  color="#38bdf8"/>
          </div>
        </div>
        <div style={{display:"flex",gap:0,marginTop:14,flexWrap:"wrap"}}>
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 16px",border:"none",background:"transparent",cursor:"pointer",color:tab===t?"#38bdf8":"#64748b",borderBottom:tab===t?"2px solid #38bdf8":"2px solid transparent",fontFamily:"inherit",fontSize:12,fontWeight:tab===t?600:400,letterSpacing:"0.04em",transition:"all 0.15s"}}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"22px 24px"}}>
        {tab==="Backlog Drift"    && <BacklogDrift/>}
        {tab==="Severity Analysis" && <SeverityAnalysis/>}
        {tab==="Root Causes"      && <RootCauses/>}
        {tab==="Component Health" && <ComponentHealth/>}
        {tab==="Sprint & Labels"  && <SprintLabels/>}
        {tab==="Bug Table"        && <BugTable/>}
      </div>
    </div>
  );
}

function BacklogDrift() {
  const [mode,setMode]=useState("drift");
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card title="Monthly created vs resolved — is the backlog shrinking or growing?"
        sub="A positive net means more bugs were created than resolved that month — backlog grows.">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
          {[["drift","Created vs Resolved"],["cumulative","Cumulative Backlog"],["process","Process Gaps"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMode(k)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid "+(mode===k?"#38bdf8":"#1e3a5f"),background:mode===k?"#38bdf818":"transparent",color:mode===k?"#38bdf8":"#64748b",fontFamily:"inherit",fontSize:12,fontWeight:mode===k?700:400,cursor:"pointer"}}>{l}</button>
          ))}
        </div>

        {mode==="drift" && (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={DRIFT} margin={{left:0,right:20,top:10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
              <Bar dataKey="created"  name="Created"  fill="#f9731622" stroke="#f97316" strokeWidth={1.5} radius={[4,4,0,0]}/>
              <Bar dataKey="resolved" name="Resolved" fill="#22c55e22" stroke="#22c55e" strokeWidth={1.5} radius={[4,4,0,0]}/>
              <Line type="monotone" dataKey="net" name="Net (Created-Resolved)" stroke="#ef4444" strokeWidth={2.5} dot={{r:5,fill:"#ef4444"}} strokeDasharray="none"/>
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 3"/>
            </ComposedChart>
          </ResponsiveContainer>
        )}
        {mode==="cumulative" && (
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={DRIFT} margin={{left:0,right:20,top:10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
              <Area type="monotone" dataKey="cumulative" name="Cumulative Backlog" fill="#ef444418" stroke="#ef4444" strokeWidth={2.5} dot={{r:5,fill:"#ef4444"}}/>
              <ReferenceLine y={0} stroke="#475569" strokeDasharray="4 3" label={{value:"Break even",fill:"#475569",fontSize:10}}/>
            </ComposedChart>
          </ResponsiveContainer>
        )}
        {mode==="process" && (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={DRIFT} margin={{left:0,right:20,top:10,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
              <Bar dataKey="no_fix_ver" name="No Fix Version"   fill="#f59e0b" radius={[4,4,0,0]}/>
              <Bar dataKey="no_sprint"  name="No Sprint"        fill="#a855f7" radius={[4,4,0,0]}/>
              <Bar dataKey="unassigned" name="Unassigned"       fill="#ef4444" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        )}

        <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap"}}>
          {[["Created","#f97316"],["Resolved","#22c55e"],["Net","#ef4444"]].map(([l,c])=>(
            <span key={l} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:6}}>
              <span style={{width:16,height:2,background:c,display:"inline-block"}}/>{l}
            </span>
          ))}
        </div>
      </Card>

      <Card title="Monthly snapshot table">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1e3a5f"}}>
                {["Month","Created","Resolved","Net","Cumulative Backlog","No Fix Version","No Sprint","Unassigned","Top Priority"].map(h=>(
                  <th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:10,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DRIFT.map((r,i)=>(
                <tr key={r.month} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                  <td style={{padding:"8px 10px",fontWeight:700,color:"#7dd3fc"}}>{r.month}</td>
                  <td style={{padding:"8px 10px",color:"#f97316",fontWeight:600}}>{r.created}</td>
                  <td style={{padding:"8px 10px",color:"#22c55e",fontWeight:600}}>{r.resolved}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,color:r.net>0?"#ef4444":r.net<0?"#22c55e":"#94a3b8"}}>{r.net>0?"+"+r.net:r.net}</td>
                  <td style={{padding:"8px 10px",fontWeight:700,color:r.cumulative>30?"#ef4444":"#f97316"}}>{r.cumulative}</td>
                  <td style={{padding:"8px 10px",color:r.no_fix_ver>5?"#f59e0b":"#94a3b8"}}>{r.no_fix_ver}</td>
                  <td style={{padding:"8px 10px",color:r.no_sprint>10?"#a855f7":"#94a3b8"}}>{r.no_sprint}</td>
                  <td style={{padding:"8px 10px",color:r.unassigned>3?"#ef4444":"#94a3b8"}}>{r.unassigned}</td>
                  <td style={{padding:"8px 10px",color:r.top>0?"#ef4444":"#94a3b8"}}>{r.top}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Bug creation by component — monthly stacked"
        sub="Which teams are generating new bugs each month">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={COMP_HEAT} margin={{left:0,right:20,top:0,bottom:0}}>
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
        <div style={{display:"flex",gap:12,marginTop:10,flexWrap:"wrap"}}>
          {COMP_KEYS.map((k,i)=>(
            <span key={k} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:CC[i],display:"inline-block"}}/>{COMP_LABELS[k]}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}


function SeverityAnalysis() {
  const [mode,setMode]=useState("backlog");
  const SEV_COLOR = {Critical:"#dc2626",High:"#f97316",Medium:"#eab308",Low:"#64748b"};
  const SEV_ORDER = ["Critical","High","Medium","Low"];

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>

      <div style={{padding:"10px 14px",background:"rgba(220,38,38,0.07)",borderRadius:8,border:"1px solid #dc262633",fontSize:12,color:"#fca5a5"}}>
        {"Severity field: customfield_10053 (Sev-0-Critical / Sev-1-High / Sev-2-Medium / Sev-3-Low) \u00B7 All 229 bugs have severity set \u00B7 Distinct from Priority field (Top/Major/Minor/None)"}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
        {SEV_STATS.map(s=>{
          const c=SEV_COLOR[s.sev]||"#64748b";
          const warn=s.open_pct>=20;
          return (
            <div key={s.sev} style={{padding:"14px 16px",background:"#0f1729",borderRadius:10,border:"1px solid "+c+"44",borderTop:"3px solid "+c}}>
              <div style={{fontSize:12,fontWeight:700,color:c,marginBottom:8}}>{s.sev}</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:10}}>
                <div><div style={{fontSize:22,fontWeight:700,color:"#f1f5f9"}}>{s.total}</div><div style={{fontSize:10,color:"#64748b"}}>total</div></div>
                <div><div style={{fontSize:22,fontWeight:700,color:warn?"#ef4444":s.open>0?c:"#22c55e"}}>{s.open}</div><div style={{fontSize:10,color:"#64748b"}}>open</div></div>
                <div><div style={{fontSize:22,fontWeight:700,color:"#8b5cf6"}}>{s.zd}</div><div style={{fontSize:10,color:"#64748b"}}>ZD tickets</div></div>
              </div>
              <div style={{height:5,background:"#1e3a5f",borderRadius:3,overflow:"hidden",marginBottom:6}}>
                <div style={{width:s.open_pct+"%",height:"100%",background:warn?"#ef4444":c,borderRadius:3}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:10,color:warn?"#ef4444":"#64748b",fontWeight:warn?700:400}}>{s.open_pct+"% unresolved"}</span>
                <span style={{fontSize:10,color:"#f59e0b"}}>{s.no_fix?" no fix: "+s.no_fix:""}</span>
              </div>
              {s.avg_age>0&&<div style={{fontSize:10,color:"#475569",marginTop:4}}>{"avg open age: "+s.avg_age+"d"}</div>}
            </div>
          );
        })}
      </div>

      <Card title="Severity deep-dive — toggle view">
        <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          {[["backlog","Open Backlog Over Time"],["monthly","Monthly Creation"],["mix","Severity Mix %"],["comp","By Component"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMode(k)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid "+(mode===k?"#38bdf8":"#1e3a5f"),background:mode===k?"#38bdf818":"transparent",color:mode===k?"#38bdf8":"#64748b",fontFamily:"inherit",fontSize:12,fontWeight:mode===k?700:400,cursor:"pointer"}}>{l}</button>
          ))}
        </div>

        {mode==="backlog" && (
          <>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Cumulative open bugs at end of each month, stacked by severity</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={SEV_BACKLOG} margin={{left:0,right:20,top:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
                <Bar dataKey="Critical" name="Critical" stackId="a" fill="#dc2626"/>
                <Bar dataKey="High"     name="High"     stackId="a" fill="#f97316"/>
                <Bar dataKey="Medium"   name="Medium"   stackId="a" fill="#eab308"/>
                <Bar dataKey="Low"      name="Low"      stackId="a" fill="#64748b" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{marginTop:10,padding:"10px 14px",background:"rgba(239,68,68,0.07)",borderRadius:6,border:"1px solid #ef444422",fontSize:12,color:"#fca5a5"}}>
              {"\u26A0 Critical bugs (0 open now) resolve fastest. High severity is the main active backlog risk with 15 open bugs. Medium+Low together account for 22 open bugs — these accumulate because they are deprioritised but never formally closed or deferred."}
            </div>
          </>
        )}

        {mode==="monthly" && (
          <>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>New bugs filed each month broken down by Jira severity field</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={SEV_MONTHLY} margin={{left:0,right:20,top:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
                <Bar dataKey="Critical" name="Critical" stackId="a" fill="#dc2626"/>
                <Bar dataKey="High"     name="High"     stackId="a" fill="#f97316"/>
                <Bar dataKey="Medium"   name="Medium"   stackId="a" fill="#eab308"/>
                <Bar dataKey="Low"      name="Low"      stackId="a" fill="#64748b" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {mode==="mix" && (
          <>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Severity proportion each month — is the mix shifting toward lower or higher severity?</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={SEV_MIX} margin={{left:0,right:20,top:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" vertical={false}/>
                <XAxis dataKey="month" tick={{fill:"#64748b",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#475569",fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}} formatter={(v)=>[v+"%",""]}/>
                <Bar dataKey="Critical_pct" name="Critical %" stackId="a" fill="#dc2626"/>
                <Bar dataKey="High_pct"     name="High %"     stackId="a" fill="#f97316"/>
                <Bar dataKey="Medium_pct"   name="Medium %"   stackId="a" fill="#eab308"/>
                <Bar dataKey="Low_pct"      name="Low %"      stackId="a" fill="#64748b" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {mode==="comp" && (
          <>
            <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Severity breakdown per component — which component carries the most Critical/High debt</div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1e3a5f"}}>
                    {["Component","Critical","Crit Open","High","High Open","Medium","Med Open","Low","Low Open"].map(h=>(
                      <th key={h} style={{padding:"8px 10px",textAlign:"left",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",fontSize:10,whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SEV_COMP.map((c,i)=>(
                    <tr key={c.comp} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                      <td style={{padding:"8px 10px",fontWeight:700,color:["#38bdf8","#818cf8","#34d399","#f59e0b","#f87171","#a78bfa"][i]||"#94a3b8"}}>{c.comp}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,color:"#dc2626"}}>{c.Critical||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:c.Critical_open>0?"#dc2626":"#334155",fontWeight:c.Critical_open>0?700:400}}>{c.Critical_open||"\u2014"}</td>
                      <td style={{padding:"8px 10px",fontWeight:700,color:"#f97316"}}>{c.High||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:c.High_open>0?"#f97316":"#334155",fontWeight:c.High_open>0?700:400}}>{c.High_open||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:"#eab308"}}>{c.Medium||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:c.Medium_open>0?"#eab308":"#334155",fontWeight:c.Medium_open>0?700:400}}>{c.Medium_open||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:"#64748b"}}>{c.Low||"\u2014"}</td>
                      <td style={{padding:"8px 10px",color:c.Low_open>0?"#94a3b8":"#334155"}}>{c.Low_open||"\u2014"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div style={{display:"flex",gap:14,marginTop:12,flexWrap:"wrap"}}>
          {[["Critical","#dc2626"],["High","#f97316"],["Medium","#eab308"],["Low","#64748b"]].map(([l,c])=>(
            <span key={l} style={{fontSize:11,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:10,height:10,borderRadius:2,background:c,display:"inline-block"}}/>{l}
            </span>
          ))}
        </div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Open rate by severity" style={{borderLeft:"3px solid #f97316"}}>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.8,marginBottom:12}}>
            {"Critical achieves 0% open rate — all resolved. High (19%), Medium (15%), and Low (30%) have significant unresolved backlogs with no fix version assigned."}
          </div>
          {SEV_STATS.map(s=>{
            const c=SEV_COLOR[s.sev];
            return (
              <div key={s.sev} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:c}}>{s.sev}</span>
                  <span style={{fontSize:12,color:"#475569"}}>{s.open+" / "+s.total+" open"}</span>
                  <span style={{fontSize:12,fontWeight:700,color:s.open_pct>=20?"#ef4444":c}}>{s.open_pct+"%"}</span>
                </div>
                <div style={{height:8,background:"#1e3a5f",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:s.open_pct+"%",height:"100%",background:s.open_pct>=20?"#ef4444":c,borderRadius:4}}/>
                </div>
                {s.open>0&&<div style={{fontSize:10,color:"#64748b",marginTop:2}}>{s.no_fix+" have no fix version \u00B7 avg open age "+s.avg_age+"d"}</div>}
              </div>
            );
          })}
        </Card>

        <Card title="Severity vs ZD impact" style={{borderLeft:"3px solid #8b5cf6"}}>
          <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.8,marginBottom:12}}>
            {"ZD tickets per bug — Critical bugs generate the most customer noise per issue."}
          </div>
          {SEV_STATS.map(s=>{
            const avgZD = s.total>0 ? Math.round(10*s.zd/s.total)/10 : 0;
            const pct   = Math.min(100, Math.round(100*avgZD/2));
            const c     = SEV_COLOR[s.sev];
            return (
              <div key={s.sev} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:c}}>{s.sev}</span>
                  <span style={{fontSize:12,color:"#8b5cf6",fontWeight:700}}>{avgZD+" ZD/bug avg"}</span>
                  <span style={{fontSize:11,color:"#475569"}}>{s.zd+" total ZD"}</span>
                </div>
                <div style={{height:8,background:"#1e3a5f",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:pct+"%",height:"100%",background:c,borderRadius:4}}/>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:14,padding:"10px 12px",background:"rgba(139,92,246,0.07)",borderRadius:6,border:"1px solid #8b5cf633",fontSize:11,color:"#c4b5fd"}}>
            {"Critical: 1.7 ZD/bug \u00B7 High: 0.9 \u00B7 Medium: 0.6 \u00B7 Low: 0.4 \u2014 severity classification correlates with real customer pain."}
          </div>
        </Card>
      </div>
    </div>
  );
}

function RootCauses() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{padding:"12px 16px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid #ef444433",fontSize:13,color:"#fca5a5",lineHeight:1.7}}>
        {"\u26A0\uFE0F  The backlog has grown by +37 bugs net since January 2026. It never returned to zero. March and April briefly reversed the trend but May re-accelerated it. Below are the six root causes explaining why."}
      </div>
      {ROOTS.map((r,i)=>(
        <div key={i} style={{padding:"16px 18px",background:"#0f1729",borderRadius:10,border:"1px solid "+r.color+"33",borderLeft:"4px solid "+r.color}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
            <div style={{fontSize:22,flexShrink:0,lineHeight:1,marginTop:2}}>{r.icon}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                <span style={{fontSize:14,fontWeight:700,color:r.color}}>{r.title}</span>
                <span style={{fontSize:11,background:r.color+"22",color:r.color,padding:"2px 8px",borderRadius:4,fontWeight:600,whiteSpace:"nowrap"}}>{r.months}</span>
              </div>
              <div style={{fontSize:12,color:"#94a3b8",lineHeight:1.8}}>{r.detail}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComponentHealth() {
  const [sel,setSel]=useState("Build & Deployment");
  const compBugs=DATA.filter(r=>r.comp===sel);
  const openBugs=compBugs.filter(r=>r.status!=="Closed");

  const pieData=[
    {name:"Closed",  value:compBugs.filter(r=>r.status==="Closed").length,       color:"#22c55e"},
    {name:"Open",    value:compBugs.filter(r=>r.status==="Open").length,          color:"#3b82f6"},
    {name:"In Progress",value:compBugs.filter(r=>r.status==="In Progress").length,color:"#a855f7"},
    {name:"In Review",value:compBugs.filter(r=>r.status==="In Review").length,   color:"#f59e0b"},
  ].filter(x=>x.value>0);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <Card title="Component backlog debt — open bugs, age, and planning gaps">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1e3a5f"}}>
                {["Component","Total Bugs","Open","No Fix Version","Avg Age (days)","Max Age (days)","Health"].map(h=>(
                  <th key={h} style={{padding:"8px 12px",textAlign:"left",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:10,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMP_AGE.map((c,i)=>{
                const health = c.no_fix_ver>=5||c.avg_age>=50?"critical":c.no_fix_ver>=3||c.avg_age>=30?"warning":"good";
                const hcolor = health==="critical"?"#ef4444":health==="warning"?"#f59e0b":"#22c55e";
                const hlabel = health==="critical"?"\u26A0 Critical":health==="warning"?"\u26A7 Warning":"\u2713 OK";
                return (
                  <tr key={c.comp} onClick={()=>setSel(c.comp)}
                    style={{borderBottom:"1px solid #0f1729",background:sel===c.comp?"rgba(59,130,246,0.1)":"i%2===0?'transparent':'rgba(30,58,95,0.1)'",cursor:"pointer",transition:"background 0.15s"}}>
                    <td style={{padding:"9px 12px",fontWeight:700,color:CC[i%CC.length]}}>{c.comp}</td>
                    <td style={{padding:"9px 12px"}}>{c.total}</td>
                    <td style={{padding:"9px 12px",color:c.open>5?"#f97316":"#94a3b8",fontWeight:c.open>5?700:400}}>{c.open}</td>
                    <td style={{padding:"9px 12px",color:c.no_fix_ver>=5?"#f59e0b":"#94a3b8",fontWeight:c.no_fix_ver>=5?700:400}}>{c.no_fix_ver}</td>
                    <td style={{padding:"9px 12px",color:c.avg_age>=50?"#ef4444":c.avg_age>=30?"#f97316":"#94a3b8",fontWeight:700}}>{c.avg_age+"d"}</td>
                    <td style={{padding:"9px 12px",color:c.max_age>=70?"#ef4444":"#94a3b8"}}>{c.max_age+"d"}</td>
                    <td style={{padding:"9px 12px"}}><span style={{color:hcolor,fontWeight:700}}>{hlabel}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{fontSize:11,color:"#475569",marginTop:8}}>Click a row to drill into that component</div>
      </Card>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title={"Drill-down: "+sel}>
          <div style={{fontSize:11,color:"#64748b",marginBottom:12}}>
            {compBugs.length+" total \u00B7 "+openBugs.length+" open \u00B7 click rows to open in Jira"}
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({name,value})=>name+": "+value} fontSize={11}>
                {pieData.map((e)=><Cell key={e.name} fill={e.color}/>)}
              </Pie>
              <Tooltip contentStyle={{background:"#0f1729",border:"1px solid #1e3a5f",borderRadius:8,fontSize:12}}/>
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title={"Open bugs: "+sel} style={{maxHeight:360,overflow:"hidden"}}>
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:300,overflowY:"auto"}}>
            {openBugs.sort((a,b)=>b.zd-a.zd).map(r=>(
              <div key={r.key} style={{padding:"7px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f",borderLeft:"3px solid "+(PC[r.p]||"#475569")}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                  <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer"
                    style={{color:"#38bdf8",fontWeight:700,fontSize:12,textDecoration:"none"}}>{r.key}</a>
                  <PBadge p={r.p}/><SBadge s={r.status}/>
                  {!r.hasFix&&<span style={{fontSize:10,color:"#f59e0b",background:"#f59e0b18",padding:"1px 6px",borderRadius:3}}>no fix ver</span>}
                  {r.zd>0&&<span style={{marginLeft:"auto",color:"#f97316",fontWeight:700,fontSize:12}}>{r.zd+" ZD"}</span>}
                </div>
                <div style={{fontSize:11,color:"#94a3b8"}}>{r.s.length>75?r.s.slice(0,75)+"\u2026":r.s}</div>
              </div>
            ))}
            {openBugs.length===0&&<div style={{fontSize:12,color:"#334155",fontStyle:"italic"}}>No open bugs</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}

function SprintLabels() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card title="Sprint team throughput — resolve rate tells the real story">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {SPRINT.map((s,i)=>{
              const pct=s.rate;
              const color=pct>=90?"#22c55e":pct>=70?"#f59e0b":"#ef4444";
              return (
                <div key={s.team} style={{padding:"10px 12px",background:"#0a0f1e",borderRadius:7,border:"1px solid #1e3a5f"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <span style={{fontSize:12,fontWeight:700,color:"#f1f5f9",flex:1}}>{s.team}</span>
                    <span style={{fontSize:12,color:"#94a3b8"}}>{s.bugs+" bugs"}</span>
                    <span style={{fontSize:13,fontWeight:700,color:color}}>{pct+"%"}</span>
                  </div>
                  <div style={{height:6,background:"#1e3a5f",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:pct+"%",height:"100%",background:color,borderRadius:3,transition:"width 0.4s"}}/>
                  </div>
                  {s.team==="No Sprint"&&<div style={{fontSize:10,color:"#f59e0b",marginTop:4}}>{"\u26A0 Unplanned bugs resolve at 47% — half never get picked up"}</div>}
                </div>
              );
            })}
          </div>
          <div style={{marginTop:12,padding:"10px 12px",background:"rgba(239,68,68,0.08)",borderRadius:6,border:"1px solid #ef444422",fontSize:12,color:"#fca5a5"}}>
            {"Sprint-assigned teams resolve 94-95% of bugs. The 49 bugs with no sprint resolve at 47% — these are the silent backlog accumulator."}
          </div>
        </Card>

        <Card title="Label signals — what types of bugs are being filed">
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {LABELS.map((l,i)=>{
              const pct=Math.round(100*l.count/229);
              const color=CC[i%CC.length];
              return (
                <div key={l.label} style={{padding:"8px 10px",background:"#0a0f1e",borderRadius:6,border:"1px solid #1e3a5f"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:600,color:color,fontFamily:"monospace"}}>{l.label}</span>
                    <span style={{marginLeft:"auto",fontSize:12,fontWeight:700,color:color}}>{l.count}</span>
                    <span style={{fontSize:11,color:"#475569",minWidth:28}}>{pct+"%"}</span>
                  </div>
                  <div style={{height:4,background:"#1e3a5f",borderRadius:2,overflow:"hidden",marginBottom:4}}>
                    <div style={{width:pct+"%",height:"100%",background:color,borderRadius:2}}/>
                  </div>
                  <div style={{fontSize:10,color:"#64748b"}}>{l.meaning}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card title="Key insight: 46% of all bugs came from customer escalations, not internal QA"
        style={{borderLeft:"3px solid #ef4444"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
          {[
            {label:"jira_escalated",n:105,pct:46,color:"#ef4444",msg:"Filed by support after customer reported via Zendesk — QA never caught these pre-release"},
            {label:"snyk_reported",n:61,pct:27,color:"#38bdf8",msg:"Auto-detected security vulnerabilities — arrive with no sprint, no fix version, pile up silently"},
            {label:"doc_required",n:65,pct:28,color:"#818cf8",msg:"Customer-facing bugs requiring documentation updates — adds delivery overhead per bug"},
          ].map(x=>(
            <div key={x.label} style={{padding:"12px",background:"#0a0f1e",borderRadius:8,border:"1px solid "+x.color+"33"}}>
              <div style={{fontSize:22,fontWeight:700,color:x.color,marginBottom:2}}>{x.n}</div>
              <div style={{fontSize:10,color:x.color,fontWeight:600,letterSpacing:"0.05em",marginBottom:6}}>{x.label.toUpperCase()}</div>
              <div style={{fontSize:11,color:"#64748b",lineHeight:1.6}}>{x.msg}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function BugTable() {
  const [sk,setSk]=useState("created");
  const [sd,setSd]=useState("desc");
  const [fc,setFc]=useState("All");
  const [fs,setFs]=useState("All");
  const [fl,setFl]=useState("All");
  const [q,setQ]=useState("");
  const [pg,setPg]=useState(0);
  const PAGE=40;

  const comps=["All",...new Set(DATA.map(r=>r.comp).filter(Boolean))];
  const label_opts=["All","jira_escalated","snyk_reported","doc_required","hotfix","support_priority"];

  const filtered=useMemo(()=>{
    let d=[...DATA];
    if(fc!=="All")d=d.filter(r=>r.comp===fc);
    if(fs!=="All")d=d.filter(r=>r.status===fs);
    if(fl!=="All")d=d.filter(r=>r.labels.includes(fl));
    if(q)d=d.filter(r=>r.s.toLowerCase().includes(q.toLowerCase())||r.key.toLowerCase().includes(q.toLowerCase())||r.reporter.toLowerCase().includes(q.toLowerCase()));
    d.sort((a,b)=>{
      let va=a[sk],vb=b[sk];
      if(sk==="p"){va=PO[va]??9;vb=PO[vb]??9;}
      if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase();}
      return sd==="asc"?(va<vb?-1:va>vb?1:0):(va>vb?-1:va<vb?1:0);
    });
    return d;
  },[sk,sd,fc,fs,fl,q]);

  const pages=Math.ceil(filtered.length/PAGE);
  const rows=filtered.slice(pg*PAGE,(pg+1)*PAGE);

  function Th({col,label}) {
    return (
      <th onClick={()=>{if(sk===col)setSd(d=>d==="asc"?"desc":"asc");else{setSk(col);setSd("desc");setPg(0);}}}
        style={{padding:"8px 10px",textAlign:"left",color:"#475569",fontWeight:600,letterSpacing:"0.07em",textTransform:"uppercase",cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",fontSize:10}}>
        {label}{sk===col?<span style={{color:"#38bdf8",marginLeft:3}}>{sd==="asc"?"\u2191":"\u2193"}</span>:<span style={{color:"#334155",marginLeft:3}}>\u21C5</span>}
      </th>
    );
  }

  return (
    <Card>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>{setQ(e.target.value);setPg(0);}} placeholder="Search key, summary, reporter..."
          style={{flex:1,minWidth:160,padding:"6px 11px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,outline:"none"}}/>
        <select value={fc} onChange={e=>{setFc(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {comps.map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={fs} onChange={e=>{setFs(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {["All","Closed","Open","In Progress","In Review"].map(s=><option key={s}>{s}</option>)}
        </select>
        <select value={fl} onChange={e=>{setFl(e.target.value);setPg(0);}}
          style={{padding:"6px 10px",background:"#0a0f1e",border:"1px solid #1e3a5f",borderRadius:6,color:"#e2e8f0",fontFamily:"inherit",fontSize:12,cursor:"pointer"}}>
          {label_opts.map(l=><option key={l}>{l}</option>)}
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
              <Th col="created" label="Created"/>
              <Th col="p" label="Priority"/>
              <Th col="status" label="Status"/>
              <Th col="comp" label="Component"/>
              <Th col="zd" label="ZD"/>
              <th style={{padding:"8px 10px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:10}}>Labels</th>
              <th style={{padding:"8px 10px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:10}}>Reporter</th>
              <th style={{padding:"8px 10px",color:"#475569",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",fontSize:10}}>Summary</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={r.key} style={{borderBottom:"1px solid #0f1729",background:i%2===0?"transparent":"rgba(30,58,95,0.1)"}}>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}>
                  <a href={"https://logpoint.atlassian.net/browse/"+r.key} target="_blank" rel="noreferrer"
                    style={{color:"#38bdf8",textDecoration:"none",fontWeight:600}}>{r.key}</a>
                </td>
                <td style={{padding:"7px 10px",color:"#64748b",fontSize:11,whiteSpace:"nowrap"}}>{r.created}</td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><PBadge p={r.p}/></td>
                <td style={{padding:"7px 10px",whiteSpace:"nowrap"}}><SBadge s={r.status}/></td>
                <td style={{padding:"7px 10px",fontSize:11,color:"#7dd3fc",whiteSpace:"nowrap"}}>{r.comp}</td>
                <td style={{padding:"7px 10px",textAlign:"center",fontWeight:700,color:r.zd>=5?"#ef4444":r.zd>0?"#f97316":"#334155"}}>{r.zd||"\u2014"}</td>
                <td style={{padding:"7px 10px",fontSize:10}}>
                  {r.labels.slice(0,2).map(l=>(
                    <span key={l} style={{marginRight:4,padding:"1px 5px",borderRadius:3,background:"#1e3a5f",color:"#94a3b8"}}>{l.replace("jira_escalated","escalated").replace("snyk_reported","snyk").replace("doc_not_required","no-doc").replace("doc_required","doc").replace("support_priority_solved","spt-solved")}</span>
                  ))}
                </td>
                <td style={{padding:"7px 10px",fontSize:11,color:"#94a3b8",whiteSpace:"nowrap"}}>{r.reporter.split(" ")[0]}</td>
                <td style={{padding:"7px 10px",color:"#cbd5e1",maxWidth:320}}><span title={r.s}>{r.s.length>75?r.s.slice(0,75)+"\u2026":r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}