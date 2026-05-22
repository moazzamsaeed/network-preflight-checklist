import { useEffect, useMemo, useRef, useState } from "react";

/* ───────── ICONS ───────── */

const ICON_PATHS = {
  cloud:     <path d="M17.5 19a4.5 4.5 0 100-9h-1.26A8 8 0 104 16.5"/>,
  network:   <><circle cx="12" cy="12" r="2"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l4.3 3.3M17.7 10.3L14 7M6 17l4.3-3.3M17.7 13.7L14 17"/></>,
  shield:    <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6z"/>,
  globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
  satellite: <><path d="M14.83 5.17a4 4 0 00-5.66 5.66l-3 3a4 4 0 005.66 5.66"/><path d="M2 22l5-5"/><circle cx="18" cy="6" r="3"/></>,
  link:      <><path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07L11.17 5"/><path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07L12.83 19"/></>,
  flow:      <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M8.5 18h7M6 8.5v7M18 8.5v7"/></>,
  check:     <polyline points="20 6 9 17 4 12"/>,
  download:  <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  restart:   <><polyline points="1 4 1 10 7 10"/><path d="M3.5 15a9 9 0 102.13-9.36L1 10"/></>,
  arrowRight:<><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
  plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  trash:     <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a2 2 0 012-2h2a2 2 0 012 2v2"/></>,
  stethoscope: <><path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 0012 0V4a2 2 0 00-2-2h-1a.2.2 0 100 .3"/><path d="M8 15a6 6 0 006 6 4 4 0 004-4v-4"/><circle cx="20" cy="10" r="2"/></>,
  alert:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
  fileText:  <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  cog:       <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8L4.2 6a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V2a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></>,
  github:    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>,
};

function Icon({ name, size = 16, strokeWidth = 1.75, className }) {
  const path = ICON_PATHS[name];
  if (!path) return null;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {path}
    </svg>
  );
}

/* ───────── CLOUDS ───────── */

const CLOUDS = {
  aws:   { id: "aws",   label: "AWS",   hint: "Customer-managed VPC, PrivateLink, Route 53 Resolver" },
  azure: { id: "azure", label: "Azure", hint: "VNet injection, Private Endpoints, Azure Private DNS" },
  gcp:   { id: "gcp",   label: "GCP",   hint: "Customer-managed VPC, Private Service Connect, Cloud DNS" },
};

/* ───────── INTAKE SECTIONS (schema) ───────── */
/* Field types:
     radio       - single choice; options: [{id,label}]
     checkbox    - multi choice; state is array of option ids; options: [{id,label}]
     select      - single choice dropdown
     text        - single-line input
     textarea    - multi-line
     list        - repeatable rows; columns: [{id,label,placeholder?}]
     tristate    - one of working/broken/unknown/na

   Each field optionally has:
     cloudOnly: ["azure"]              - only render for these clouds
     showIf: (sectionState, fullState) - dynamic visibility
     help: short helper text below input
     placeholder: for text/textarea
*/

const yesNoUnknown = [
  { id: "yes",     label: "Yes" },
  { id: "no",      label: "No" },
  { id: "unknown", label: "Unknown" },
];

const INTAKE_SECTIONS = [
  {
    id: "context",
    label: "Customer & Workspace",
    icon: "fileText",
    description: "Identify the workspace and engagement context.",
    fields: [
      { id: "customer", label: "Customer name", type: "text", placeholder: "Acme Corp" },
      { id: "workspaceName", label: "Workspace name / ID", type: "text", placeholder: "prod-east-1 / 1234567890123456" },
      { id: "workspaceUrl", label: "Workspace URL", type: "text", placeholder: "adb-xxx.azuredatabricks.net / xxx.cloud.databricks.com" },
      { id: "region", label: "Workspace region", type: "text", placeholder: "eastus / us-east-1 / us-central1", help: "Control-plane CIDRs and DNS zones differ by region." },
      { id: "engineer", label: "Field engineer", type: "text", placeholder: "your name" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace Networking",
    icon: "network",
    description: "Deployment model, public access, SCC/NPIP, private connectivity, workspace storage and CMK.",
    fields: [
      { id: "deploymentModel", label: "Deployment model", type: "radio",
        options: [
          { id: "managed", label: "Databricks-managed VPC/VNet" },
          { id: "byov",    label: "Customer-managed (BYOVNet / BYOVPC)" },
          { id: "unknown", label: "Unknown" },
        ] },
      { id: "vnetName", label: "VNet/VPC name", type: "text",
        showIf: (s) => s.deploymentModel === "byov" },
      { id: "publicSubnet", label: "Public subnet name", type: "text",
        showIf: (s) => s.deploymentModel === "byov" },
      { id: "privateSubnet", label: "Private subnet name", type: "text",
        showIf: (s) => s.deploymentModel === "byov" },
      { id: "nsgSgName", label: "NSG / SG / firewall rules name", type: "text",
        showIf: (s) => s.deploymentModel === "byov" },

      { id: "publicAccess", label: "Public network access (workspace setting)", type: "radio",
        options: [
          { id: "enabled",  label: "Enabled (public + private)" },
          { id: "disabled", label: "Disabled (private only)" },
          { id: "unknown",  label: "Unknown" },
        ] },

      { id: "sccNpip", label: "Secure Cluster Connectivity / NPIP", type: "radio",
        options: [
          { id: "on",      label: "Enabled — clusters have no public IPs" },
          { id: "off",     label: "Disabled — clusters have public IPs (legacy)" },
          { id: "unknown", label: "Unknown" },
        ],
        help: "On AWS this is called SCC. On Azure: NPIP. On GCP: GCE SCC." },

      { id: "privateConnectivity", label: "Private connectivity", type: "radio",
        options: [
          { id: "none",         label: "None — workspace is public-only" },
          { id: "backendOnly",  label: "Backend only (control plane via PE/PL/PSC)" },
          { id: "frontendOnly", label: "Frontend only (UI via PE/PL/PSC)" },
          { id: "both",         label: "Both frontend and backend" },
          { id: "unknown",      label: "Unknown" },
        ] },

      { id: "azurePeDetail", label: "Azure PE sub-resource(s)", type: "checkbox",
        cloudOnly: ["azure"],
        options: [
          { id: "databricks_ui_api",    label: "databricks_ui_api (backend)" },
          { id: "browser_authentication", label: "browser_authentication (frontend)" },
        ],
        showIf: (s) => s.privateConnectivity && s.privateConnectivity !== "none" && s.privateConnectivity !== "unknown" },

      { id: "peLocation", label: "Where do the private endpoints live?", type: "radio",
        options: [
          { id: "workspaceVnet", label: "Workspace VNet/VPC" },
          { id: "hubVnet",       label: "Hub VNet/VPC" },
          { id: "both",          label: "Both" },
          { id: "unknown",       label: "Unknown" },
        ],
        showIf: (s) => s.privateConnectivity && s.privateConnectivity !== "none" && s.privateConnectivity !== "unknown" },

      { id: "rootStorageFw", label: "Workspace root storage has firewall enabled?", type: "radio",
        options: yesNoUnknown,
        help: "DBFS root: ADLS Gen2 (Azure), S3 (AWS), GCS (GCP). Cluster startup fails if blocked." },
      { id: "rootStoragePe", label: "Workspace root storage uses Private Endpoint / VPC Endpoint?", type: "radio", options: yesNoUnknown,
        showIf: (s) => s.rootStorageFw === "yes" },

      { id: "ucMetastoreSeparate", label: "UC metastore storage separate from root storage?", type: "radio", options: yesNoUnknown },
      { id: "ucMetastorePe", label: "UC metastore storage uses PE/VPC endpoint?", type: "radio", options: yesNoUnknown,
        showIf: (s) => s.ucMetastoreSeparate === "yes" },

      { id: "cmkInUse", label: "Customer-managed keys (CMK) in use?", type: "radio", options: yesNoUnknown,
        help: "Key Vault / KMS / Cloud KMS. Cluster startup hangs if key store unreachable." },
      { id: "cmkKeyVaultPe", label: "Key Vault / KMS reachable from cluster subnets (PE or firewall allow-list)?", type: "radio",
        options: [
          { id: "pe",        label: "Yes — via Private Endpoint" },
          { id: "allowlist", label: "Yes — firewall allow-list / service endpoint" },
          { id: "no",        label: "No / unsure" },
          { id: "unknown",   label: "Unknown" },
        ],
        showIf: (s) => s.cmkInUse === "yes" },
    ],
  },

  {
    id: "firewall",
    label: "Firewall & Routing",
    icon: "shield",
    description: "Firewalls in the path (cloud-native, on-prem, third-party), UDRs/route tables, NSG/SG rules, proxies, TLS inspection.",
    fields: [
      { id: "firewallPresence", label: "Firewall in the path?", type: "radio",
        options: [
          { id: "none",      label: "None" },
          { id: "cloud",     label: "Cloud-native (Azure FW / AWS NFW / GCP Cloud FW)" },
          { id: "onprem",    label: "On-prem firewall (forced tunneling via ER/VPN/DX)" },
          { id: "both",      label: "Both cloud and on-prem" },
          { id: "thirdParty",label: "Third-party NVA in cloud (Palo Alto, Fortinet, Check Point, …)" },
          { id: "unknown",   label: "Unknown" },
        ] },
      { id: "firewallProduct", label: "Firewall product / version", type: "text",
        showIf: (s) => s.firewallPresence && !["none", "unknown"].includes(s.firewallPresence) },

      { id: "hubSpoke", label: "Hub-and-spoke topology?", type: "radio", options: yesNoUnknown },

      { id: "forcedTunneling", label: "Forced tunneling — UDR 0.0.0.0/0 → firewall or VPN gateway?", type: "radio", options: yesNoUnknown },

      { id: "udrRules", label: "User-Defined Routes (UDRs) / route table rules", type: "list",
        columns: [
          { id: "prefix",  label: "Address prefix", placeholder: "0.0.0.0/0" },
          { id: "nextHop", label: "Next hop",       placeholder: "Azure FW 10.0.0.4 / VPN GW / IGW / NVA" },
          { id: "notes",   label: "Notes",          placeholder: "default route to FW" },
        ],
        help: "Capture every UDR that affects traffic to/from Databricks. Especially default routes." },

      { id: "nsgRules", label: "NSG / SG / NACL rules and service tags used", type: "textarea",
        placeholder: "e.g., AzureDatabricks service tag allowed outbound, Storage.eastus on cluster subnets, custom allow rules to control-plane CIDR x.y.z.0/24…",
        help: "Free-text capture. Note any service tags, prefix lists, or explicit CIDR rules." },

      { id: "egressMode", label: "Cluster egress mode", type: "radio",
        options: [
          { id: "natGw",        label: "NAT Gateway" },
          { id: "instancePip",  label: "Instance public IP (NPIP/SCC off)" },
          { id: "viaFirewall",  label: "Via firewall (forced tunnel)" },
          { id: "vpcEndpoint",  label: "Via VPC endpoint / Private Endpoint" },
          { id: "defaultOutbound", label: "Azure default outbound (deprecated Sept 2025!)", cloudOnly: ["azure"] },
          { id: "unknown",      label: "Unknown" },
        ] },

      { id: "awsVpcEndpoints", label: "AWS VPC endpoints in place (multi-select)", type: "checkbox",
        cloudOnly: ["aws"],
        options: [
          { id: "s3Gateway",     label: "S3 (gateway endpoint)" },
          { id: "s3Interface",   label: "S3 (interface endpoint)" },
          { id: "sts",           label: "STS" },
          { id: "kinesis",       label: "Kinesis" },
          { id: "ec2Metadata",   label: "EC2 / SSM / metadata" },
          { id: "dbxRest",       label: "Databricks REST (PrivateLink)" },
          { id: "dbxRelay",      label: "Databricks SCC relay (PrivateLink)" },
        ] },

      { id: "azureSe", label: "Azure Service Endpoints on cluster subnets (multi-select)", type: "checkbox",
        cloudOnly: ["azure"],
        options: [
          { id: "ms.storage",    label: "Microsoft.Storage" },
          { id: "ms.keyvault",   label: "Microsoft.KeyVault" },
          { id: "ms.sql",        label: "Microsoft.Sql" },
          { id: "ms.eventhub",   label: "Microsoft.EventHub" },
        ] },

      { id: "transit", label: "Transit topology (cloud → on-prem / cross-cloud)", type: "checkbox",
        options: [
          { id: "vpcPeering",   label: "VPC peering" },
          { id: "tgw",          label: "Transit Gateway (AWS)" },
          { id: "expressRoute", label: "ExpressRoute (Azure)" },
          { id: "s2sVpn",       label: "Site-to-site VPN" },
          { id: "directConnect",label: "Direct Connect (AWS)" },
          { id: "interconnect", label: "Cloud Interconnect (GCP)" },
          { id: "cloudVpn",     label: "Cloud VPN (GCP)" },
          { id: "privateLinkToOnprem", label: "PrivateLink / PSC to on-prem service" },
        ] },

      { id: "tlsInspection", label: "TLS / SSL break-and-inspect by corporate proxy or firewall?", type: "radio",
        options: yesNoUnknown,
        help: "Cert-pinning failures are a frequent cause of Databricks CLI / cluster traffic breaking." },

      { id: "httpProxy", label: "Explicit HTTP/HTTPS proxy in middle?", type: "radio",
        options: [
          { id: "none",     label: "None" },
          { id: "explicit", label: "Explicit proxy (HTTPS_PROXY env / cluster config)" },
          { id: "ntlm",     label: "Authenticated proxy (NTLM / Kerberos)" },
          { id: "pac",      label: "PAC file" },
          { id: "unknown",  label: "Unknown" },
        ] },
      { id: "proxyBypass", label: "Domains bypassed by proxy", type: "text",
        placeholder: "*.cloud.databricks.com, *.azuredatabricks.net, *.gcp.databricks.com, pypi.org…",
        showIf: (s) => s.httpProxy && !["none","unknown"].includes(s.httpProxy) },
    ],
  },

  {
    id: "dns",
    label: "DNS",
    icon: "globe",
    description: "DNS provider, private DNS zones, conditional forwarders, resolver endpoints, split-horizon scenarios.",
    fields: [
      { id: "provider", label: "DNS provider in clusters / VPC", type: "radio",
        options: [
          { id: "cloudDefault", label: "Cloud default (Azure DNS / Amazon-provided / Google DNS)" },
          { id: "custom",       label: "Custom DNS (on-prem AD DNS, hub-and-spoke DNS, Infoblox, BIND)" },
          { id: "both",         label: "Both (custom forwards to cloud)" },
          { id: "unknown",      label: "Unknown" },
        ] },
      { id: "customDnsServers", label: "Custom DNS server IPs", type: "text",
        placeholder: "10.0.0.4, 10.0.0.5",
        showIf: (s) => s.provider === "custom" || s.provider === "both" },

      { id: "dhcpOptionSet", label: "DHCP option set — DNS servers list", type: "text",
        cloudOnly: ["aws"],
        placeholder: "AmazonProvidedDNS / custom list",
        help: "If custom, the list must include Route 53 Resolver inbound IPs for VPC-internal resolution." },

      { id: "vpcDnsFlags", label: "VPC `enableDnsHostnames` / `enableDnsSupport` (required for PrivateLink)", type: "radio",
        cloudOnly: ["aws"],
        options: [
          { id: "bothOn",  label: "Both enabled" },
          { id: "partial", label: "Only one enabled" },
          { id: "off",     label: "Both disabled" },
          { id: "unknown", label: "Unknown" },
        ] },

      { id: "azurePrivateZones", label: "Azure Private DNS zones linked to VNet (multi-select)", type: "checkbox",
        cloudOnly: ["azure"],
        options: [
          { id: "azuredatabricks",   label: "privatelink.azuredatabricks.net (workspace)" },
          { id: "dfs",               label: "privatelink.dfs.core.windows.net (ADLS Gen2)" },
          { id: "blob",              label: "privatelink.blob.core.windows.net" },
          { id: "vaultcore",         label: "privatelink.vaultcore.azure.net (Key Vault)" },
          { id: "database",          label: "privatelink.database.windows.net (SQL / Lakebase)" },
          { id: "eventhub",          label: "privatelink.servicebus.windows.net (Event Hubs / SB)" },
        ] },

      { id: "awsR53Zones", label: "Route 53 private hosted zones associated with VPC", type: "textarea",
        cloudOnly: ["aws"],
        placeholder: "e.g., cloud.databricks.com PHZ; ws-xxx.cloud.databricks.com; s3.{region}.vpce.amazonaws.com…" },

      { id: "gcpDnsZones", label: "GCP Cloud DNS private zones", type: "textarea",
        cloudOnly: ["gcp"],
        placeholder: "e.g., gcp.databricks.com private zone; storage.googleapis.com private zone…" },

      { id: "resolverEndpoints", label: "Resolver endpoints in place (multi-select)", type: "checkbox",
        options: [
          { id: "azurePrInbound",  label: "Azure DNS Private Resolver — inbound endpoint", cloudOnly: ["azure"] },
          { id: "azurePrOutbound", label: "Azure DNS Private Resolver — outbound endpoint + forwarding rules", cloudOnly: ["azure"] },
          { id: "r53Inbound",      label: "Route 53 Resolver — inbound endpoint", cloudOnly: ["aws"] },
          { id: "r53Outbound",     label: "Route 53 Resolver — outbound endpoint + rule association", cloudOnly: ["aws"] },
          { id: "gcpInbound",      label: "Cloud DNS — inbound forwarding policy", cloudOnly: ["gcp"] },
          { id: "gcpOutbound",     label: "Cloud DNS — outbound forwarding policy", cloudOnly: ["gcp"] },
        ] },

      { id: "forwarders", label: "Conditional forwarders / forwarding rules", type: "list",
        columns: [
          { id: "domain", label: "Domain", placeholder: "*.privatelink.azuredatabricks.net" },
          { id: "target", label: "Forward to", placeholder: "168.63.129.16 / Private Resolver inbound IP / on-prem DNS" },
        ],
        help: "Add a row per domain → forwarder target. Be specific — generic forwarders often miss the right zones." },

      { id: "forwarderScope", label: "Forwarders workspace-specific or generic?", type: "radio",
        options: [
          { id: "workspaceSpecific", label: "Workspace-specific (each PE zone forwarded)" },
          { id: "generic",           label: "Generic (only top-level domains forwarded)" },
          { id: "unknown",           label: "Unknown" },
        ],
        showIf: (s) => s.provider === "custom" || s.provider === "both" },

      { id: "splitHorizon", label: "Split-horizon DNS — workspace FQDN resolves differently from internet vs internal?", type: "radio", options: yesNoUnknown },
      { id: "dnsProxy", label: "DNS proxy / caching layer in middle (Infoblox, BIND, etc.)?", type: "radio", options: yesNoUnknown },
    ],
  },

  {
    id: "serverless",
    label: "Serverless Networking",
    icon: "satellite",
    description: "Serverless workloads in use, NCC (Network Connectivity Config), egress mode, customer private destinations.",
    fields: [
      { id: "serverlessInUse", label: "Serverless in use?", type: "radio", options: yesNoUnknown },

      { id: "workloads", label: "Serverless workloads in use (multi-select)", type: "checkbox",
        options: [
          { id: "sql",             label: "Serverless SQL warehouses" },
          { id: "dlt",             label: "DLT / Lakeflow Pipelines (serverless)" },
          { id: "jobs",            label: "Jobs (serverless)" },
          { id: "modelServingFmapi", label: "Model Serving — Foundation Model API" },
          { id: "modelServingPt",  label: "Model Serving — Provisioned Throughput" },
          { id: "modelServingCustom", label: "Model Serving — Custom model" },
          { id: "modelServingExternal", label: "Model Serving — External model via AI Gateway" },
          { id: "vectorSearch",    label: "Vector Search" },
          { id: "agentBricks",     label: "Agent Bricks / Knowledge Assistant" },
          { id: "genie",           label: "Genie" },
          { id: "aiFunctions",     label: "AI Functions" },
          { id: "lakeflowConnect", label: "Lakeflow Connect (serverless ingestion)" },
          { id: "lakehouseFederation", label: "Lakehouse Federation" },
          { id: "onlineTables",    label: "Online Tables" },
          { id: "lakebase",        label: "Lakebase (managed Postgres)" },
        ],
        showIf: (s) => s.serverlessInUse === "yes" },

      { id: "lfFederationSource", label: "Lakehouse Federation source", type: "select",
        options: [
          { id: "snowflake", label: "Snowflake" },
          { id: "redshift",  label: "Redshift" },
          { id: "bigquery",  label: "BigQuery" },
          { id: "sqlserver", label: "SQL Server / Azure SQL" },
          { id: "postgres",  label: "PostgreSQL" },
          { id: "mysql",     label: "MySQL" },
          { id: "oracle",    label: "Oracle" },
          { id: "teradata",  label: "Teradata" },
          { id: "other",     label: "Other" },
        ],
        showIf: (s) => Array.isArray(s.workloads) && s.workloads.includes("lakehouseFederation") },

      { id: "lfFederationSourceConn", label: "Federation source connectivity", type: "radio",
        options: [
          { id: "public",  label: "Public (over internet, egress IP allow-list)" },
          { id: "pe",      label: "PrivateLink / PE / PSC" },
          { id: "vpn",     label: "Over VPN / ExpressRoute / Direct Connect" },
          { id: "unknown", label: "Unknown" },
        ],
        showIf: (s) => Array.isArray(s.workloads) && s.workloads.includes("lakehouseFederation") },

      { id: "externalModelTargets", label: "External model targets (for AI Gateway)", type: "text",
        placeholder: "OpenAI, Anthropic, Azure OpenAI, customer-hosted endpoint…",
        showIf: (s) => Array.isArray(s.workloads) && s.workloads.includes("modelServingExternal") },

      { id: "nccPresent", label: "NCC (Network Connectivity Config) attached to this workspace?", type: "radio",
        options: [
          { id: "default",    label: "Default (Databricks-managed)" },
          { id: "customer",   label: "Customer-created NCC" },
          { id: "none",       label: "Not attached" },
          { id: "unknown",    label: "Unknown" },
        ],
        showIf: (s) => s.serverlessInUse === "yes" },

      { id: "nccFeatures", label: "NCC features in use", type: "checkbox",
        options: [
          { id: "stableEgress", label: "Stable egress IPs" },
          { id: "peRules",      label: "Private endpoint rules (NCC → customer resource)" },
          { id: "fwRules",      label: "Firewall / allow-list rules" },
        ],
        showIf: (s) => s.nccPresent === "customer" },

      { id: "nccPeRules", label: "NCC private endpoint rules (destinations)", type: "list",
        columns: [
          { id: "destinationType", label: "Destination type", placeholder: "storage / sql / kafka / external" },
          { id: "fqdn",            label: "Target FQDN",      placeholder: "acmestorage.dfs.core.windows.net" },
          { id: "region",          label: "Region",           placeholder: "eastus" },
        ],
        showIf: (s) => Array.isArray(s.nccFeatures) && s.nccFeatures.includes("peRules") },

      { id: "networkPolicy", label: "Per-workspace network policy / destination allow-list configured?", type: "radio", options: yesNoUnknown,
        showIf: (s) => s.serverlessInUse === "yes" },
    ],
  },

  {
    id: "connectivity",
    label: "Connectivity-Target Status",
    icon: "link",
    description: "For each path, mark whether it's currently working, broken, unknown, or not applicable.",
    fields: [
      { id: "clusterToControlPlane", label: "Cluster → control plane (SCC relay)", type: "tristate" },
      { id: "clusterToRestApi",      label: "Cluster → workspace REST API",          type: "tristate" },
      { id: "clusterToRootStorage",  label: "Cluster → DBFS root storage",            type: "tristate" },
      { id: "clusterToUcMetastore",  label: "Cluster → UC metastore storage",        type: "tristate" },
      { id: "clusterToExternalSrc",  label: "Cluster → external data source",         type: "tristate" },
      { id: "clusterToLibs",         label: "Cluster → Maven / PyPI / npm / Docker", type: "tristate", help: "Library + container installs" },
      { id: "clusterToNtp",          label: "Cluster → NTP servers",                  type: "tristate" },
      { id: "clusterToIdp",          label: "Cluster → identity provider (SAML / OIDC / AAD)", type: "tristate" },
      { id: "clusterToExternalModel",label: "Cluster → external model API (OpenAI / Anthropic / …)", type: "tristate" },
      { id: "clusterToKeyStore",     label: "Cluster → Key Vault / KMS",              type: "tristate" },
      { id: "clusterToFederationSrc",label: "Cluster → Lakehouse Federation source", type: "tristate" },
      { id: "browserToUiCorp",       label: "Browser → workspace UI (corporate network)", type: "tristate" },
      { id: "browserToUiOnprem",     label: "Browser → workspace UI (on-prem via PE/VPN/DX)", type: "tristate" },
      { id: "interNode",             label: "Inter-node within a cluster",            type: "tristate" },
      { id: "serverlessToPrivate",   label: "Serverless → customer private resource (via NCC PE)", type: "tristate" },
    ],
  },

  {
    id: "symptoms",
    label: "Symptoms & Context",
    icon: "stethoscope",
    description: "What's broken, what changed, what does the error look like.",
    fields: [
      { id: "whatBroken", label: "What is not working?", type: "textarea",
        placeholder: "Describe the issue in the customer's words." },
      { id: "whenStarted", label: "When did it start?", type: "text",
        placeholder: "2026-05-12, after firewall rule change" },
      { id: "reproducibility", label: "Reproducibility", type: "radio",
        options: [
          { id: "always",      label: "Always — every time" },
          { id: "intermittent",label: "Intermittent" },
          { id: "once",        label: "Once / hard to reproduce" },
        ] },
      { id: "recentChanges", label: "Recent environment changes", type: "textarea",
        placeholder: "Firewall rule, DNS update, cert rotation, workspace migration, peering change…" },
      { id: "errorMessage", label: "Exact error message", type: "textarea",
        placeholder: "Paste verbatim. Cluster event log line, UI banner, REST response, etc." },
      { id: "errorPatterns", label: "Common cluster event-log patterns observed (multi-select)", type: "checkbox",
        options: [
          { id: "netUnreachable", label: "Network unreachable" },
          { id: "dnsFailed",      label: "DNS resolution failed / NXDOMAIN" },
          { id: "tlsFailed",      label: "TLS handshake failed / cert error" },
          { id: "tokenExpired",   label: "Token expired / 401 / 403" },
          { id: "libFailed",      label: "Library install failed" },
          { id: "clusterTimeout", label: "Cluster timed out / didn't reach ready" },
          { id: "driverGone",     label: "Driver unreachable" },
          { id: "imagePullFail",  label: "Container image pull failed" },
        ] },
      { id: "affectedServices", label: "Affected services (multi-select)", type: "checkbox",
        options: [
          { id: "uiAccess",     label: "UI access" },
          { id: "clusterStart", label: "Cluster start" },
          { id: "clusterEgress",label: "Cluster egress to source / storage" },
          { id: "serverlessSql",label: "Serverless SQL / DLT" },
          { id: "modelServing", label: "Model Serving inference" },
          { id: "ai",           label: "Genie / Agent Bricks / AI Functions" },
          { id: "lfConnect",    label: "Lakeflow Connect ingestion" },
          { id: "lfFederation", label: "Lakehouse Federation queries" },
        ] },
    ],
  },
];

/* ───────── ANALYZE RULES ───────── */

const get = (s, sec, f) => s.sections?.[sec]?.[f];
const arr = (v) => (Array.isArray(v) ? v : []);
const includes = (s, sec, f, val) => arr(get(s, sec, f)).includes(val);

const ANALYZE_RULES = [
  // 1. Azure NPIP on + no backend PE
  (s) => {
    if (s.cloud !== "azure") return null;
    if (get(s, "workspace", "sccNpip") !== "on") return null;
    const pc = get(s, "workspace", "privateConnectivity");
    if (pc === "backendOnly" || pc === "both") return null;
    return {
      severity: "blocker",
      title: "NPIP enabled but no backend Private Endpoint",
      detail: "Clusters have no public IP and no private path to the control plane. SCC relay traffic has nowhere to go. Either add a backend PE (databricks_ui_api) or disable NPIP.",
      docsUrl: "https://learn.microsoft.com/azure/databricks/security/network/secure-cluster-connectivity",
    };
  },

  // 2. Custom DNS + PE + no forwarder for privatelink zone
  (s) => {
    const pc = get(s, "workspace", "privateConnectivity");
    const provider = get(s, "dns", "provider");
    if (!["backendOnly", "frontendOnly", "both"].includes(pc)) return null;
    if (provider !== "custom" && provider !== "both") return null;
    const forwarders = arr(get(s, "dns", "forwarders"));
    const hasPlForwarder = forwarders.some(
      (f) => typeof f?.domain === "string" && /privatelink/i.test(f.domain)
    );
    if (hasPlForwarder) return null;
    return {
      severity: "blocker",
      title: "Custom DNS without a forwarder for the privatelink zone",
      detail: "With PE in use and custom DNS, every privatelink zone (workspace, ADLS, Key Vault…) must be forwarded so that FQDNs resolve to private IPs. Otherwise queries land on public IPs and bypass the PE entirely.",
      docsUrl: "https://learn.microsoft.com/azure/private-link/private-endpoint-dns",
    };
  },

  // 3. Public access disabled + no frontend PE + no on-prem connectivity → UI unreachable
  (s) => {
    if (get(s, "workspace", "publicAccess") !== "disabled") return null;
    const pc = get(s, "workspace", "privateConnectivity");
    if (pc === "frontendOnly" || pc === "both") return null;
    const transit = arr(get(s, "firewall", "transit"));
    const onPrem = transit.some((t) => ["expressRoute", "s2sVpn", "directConnect", "interconnect", "cloudVpn"].includes(t));
    if (onPrem) return null;
    return {
      severity: "high",
      title: "Workspace UI may be unreachable",
      detail: "Public access is disabled, no frontend PE, and no on-prem connectivity captured. Users will not be able to reach the workspace UI.",
    };
  },

  // 4. Serverless used + LF Federation + on-prem source + no NCC
  (s) => {
    if (get(s, "serverless", "serverlessInUse") !== "yes") return null;
    if (!includes(s, "serverless", "workloads", "lakehouseFederation")) return null;
    const ncc = get(s, "serverless", "nccPresent");
    if (ncc === "customer") return null;
    if (get(s, "serverless", "lfFederationSourceConn") === "public") return null;
    return {
      severity: "high",
      title: "Federation to private source without customer NCC",
      detail: "Serverless egresses from a shared pool by default. For PE/VPN-bound federation sources, attach a customer NCC with PE rules.",
      docsUrl: "https://docs.databricks.com/en/admin/cloud-configurations/serverless-egress.html",
    };
  },

  // 5. Serverless used + private source + no NCC PE rule
  (s) => {
    if (get(s, "serverless", "serverlessInUse") !== "yes") return null;
    if (!includes(s, "serverless", "nccFeatures", "peRules")) {
      const wl = arr(get(s, "serverless", "workloads"));
      const needsPrivate = wl.some((w) => ["modelServingCustom", "lakehouseFederation", "lakeflowConnect"].includes(w));
      if (!needsPrivate) return null;
      return {
        severity: "high",
        title: "Serverless workload may need NCC private endpoint rules",
        detail: "Workloads pointing at private customer resources require NCC PE rules to route egress through a private path.",
      };
    }
    return null;
  },

  // 6. Forced tunneling without allow-list for Databricks control plane
  (s) => {
    if (get(s, "firewall", "forcedTunneling") !== "yes") return null;
    const nsg = (get(s, "firewall", "nsgRules") || "").toLowerCase();
    if (nsg.includes("databricks") || nsg.includes("control plane") || nsg.includes("cp")) return null;
    return {
      severity: "high",
      title: "Forced tunneling without documented Databricks allow-list",
      detail: "0.0.0.0/0 → firewall breaks egress to the Databricks control plane unless the per-region CIDRs / service tag are explicitly allowed. Confirm the allow-list.",
      docsUrl: "https://docs.databricks.com/en/security/network/classic/customer-managed-vpc.html",
    };
  },

  // 7. Generic forwarders
  (s) => {
    if (get(s, "dns", "forwarderScope") !== "generic") return null;
    return {
      severity: "info",
      title: "DNS forwarders are generic, not workspace-specific",
      detail: "Generic forwarders often miss the specific privatelink zones required by the workspace. Confirm every required zone (workspace, root storage, Key Vault, UC metastore) is covered.",
    };
  },

  // 8. Workspace storage firewall on + cluster subnet not allowed
  (s) => {
    if (get(s, "workspace", "rootStorageFw") !== "yes") return null;
    if (get(s, "workspace", "rootStoragePe") === "yes") return null;
    return {
      severity: "blocker",
      title: "Workspace root storage firewall on without PE",
      detail: "Cluster cannot reach DBFS root; cluster start will fail. Add a PE or include cluster subnets in the storage firewall allow-list / service endpoint.",
    };
  },

  // 9. CMK in use + Key Vault not reachable
  (s) => {
    if (get(s, "workspace", "cmkInUse") !== "yes") return null;
    const kv = get(s, "workspace", "cmkKeyVaultPe");
    if (kv === "pe" || kv === "allowlist") return null;
    return {
      severity: "blocker",
      title: "CMK in use but key store reachability unclear",
      detail: "Cluster startup hangs on key fetch if the Key Vault / KMS is not reachable. Confirm PE or firewall allow-list.",
    };
  },

  // 10. AWS PrivateLink + VPC DNS flags off
  (s) => {
    if (s.cloud !== "aws") return null;
    const pc = get(s, "workspace", "privateConnectivity");
    if (!["backendOnly", "frontendOnly", "both"].includes(pc)) return null;
    const flags = get(s, "dns", "vpcDnsFlags");
    if (flags === "bothOn") return null;
    return {
      severity: "blocker",
      title: "PrivateLink in use but VPC DNS flags not both enabled",
      detail: "VPC must have both `enableDnsHostnames` and `enableDnsSupport` set to true for the VPC endpoint's private DNS to resolve.",
      docsUrl: "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-dns.html",
    };
  },

  // 11. AWS custom DHCP option set without Resolver inbound IPs
  (s) => {
    if (s.cloud !== "aws") return null;
    const dhcp = (get(s, "dns", "dhcpOptionSet") || "").toLowerCase();
    if (!dhcp) return null;
    if (dhcp.includes("amazonprovideddns")) return null;
    const endpoints = arr(get(s, "dns", "resolverEndpoints"));
    if (endpoints.includes("r53Inbound")) return null;
    return {
      severity: "high",
      title: "Custom DHCP option set without Route 53 Resolver inbound IPs",
      detail: "Custom DNS servers must include Resolver inbound IPs to resolve VPC-internal names (PrivateLink endpoints, S3 interface endpoint, etc.) from clusters and from on-prem.",
    };
  },

  // 12. TLS inspection
  (s) => {
    if (get(s, "firewall", "tlsInspection") !== "yes") return null;
    return {
      severity: "high",
      title: "TLS / SSL break-and-inspect in path",
      detail: "Databricks CLI and cluster connections will fail cert validation. Bypass inspection for *.cloud.databricks.com / *.azuredatabricks.net / *.gcp.databricks.com and all required storage / IdP / library hosts.",
    };
  },

  // 13. HTTPS proxy without bypass list
  (s) => {
    const proxy = get(s, "firewall", "httpProxy");
    if (!proxy || proxy === "none" || proxy === "unknown") return null;
    const bypass = (get(s, "firewall", "proxyBypass") || "").toLowerCase();
    if (bypass.includes("databricks")) return null;
    return {
      severity: "high",
      title: "Proxy in path without Databricks bypass",
      detail: "Token endpoints and control-plane traffic may be intercepted. Add *.databricks.com / *.azuredatabricks.net / *.gcp.databricks.com to the proxy bypass list.",
    };
  },

  // 14. Library install path broken
  (s) => {
    if (get(s, "connectivity", "clusterToLibs") !== "broken") return null;
    return {
      severity: "high",
      title: "Cluster cannot reach library / container repositories",
      detail: "Maven / PyPI / npm / Docker registry are unreachable. Library installs will fail. Add explicit egress allow-list entries or VPC endpoints / forwarders.",
    };
  },

  // 15. NTP egress broken or forced-tunnel with unclear NTP
  (s) => {
    if (get(s, "connectivity", "clusterToNtp") !== "broken" &&
        !(get(s, "firewall", "forcedTunneling") === "yes" && get(s, "connectivity", "clusterToNtp") === "unknown")) return null;
    return {
      severity: "info",
      title: "NTP reachability suspect",
      detail: "Clock skew causes intermittent auth failures (token signing, TLS). Confirm NTP egress is allowed from cluster subnets.",
    };
  },

  // 16. Intermittent + custom DNS + multiple servers
  (s) => {
    if (get(s, "symptoms", "reproducibility") !== "intermittent") return null;
    const provider = get(s, "dns", "provider");
    if (provider !== "custom" && provider !== "both") return null;
    const servers = (get(s, "dns", "customDnsServers") || "").split(/[,\s]+/).filter(Boolean);
    if (servers.length < 2) return null;
    return {
      severity: "info",
      title: "Intermittent failure with multiple custom DNS servers",
      detail: "Round-robin between DNS servers with inconsistent forwarder configs is a common cause of intermittent resolution failures. Verify each server has the same conditional-forwarder set.",
    };
  },

  // 17. Region mismatch in NSG service tag
  (s) => {
    if (s.cloud !== "azure") return null;
    const region = (get(s, "context", "region") || "").toLowerCase().replace(/\s+/g, "");
    const nsg = (get(s, "firewall", "nsgRules") || "").toLowerCase();
    const m = nsg.match(/azuredatabricks\.([a-z0-9]+)/);
    if (!region || !m) return null;
    const tagRegion = m[1];
    if (tagRegion === region) return null;
    return {
      severity: "high",
      title: `Service tag region (${tagRegion}) doesn't match workspace region (${region})`,
      detail: "AzureDatabricks.{region} service tag scopes to a single region. A mismatch silently blocks egress to the control plane.",
    };
  },

  // 18. Cluster won't start + storage firewall + SCC
  (s) => {
    if (!includes(s, "symptoms", "affectedServices", "clusterStart")) return null;
    if (get(s, "workspace", "rootStorageFw") !== "yes") return null;
    if (get(s, "workspace", "sccNpip") !== "on") return null;
    return {
      severity: "blocker",
      title: "Cluster start blocked by root-storage firewall under SCC",
      detail: "With SCC on, clusters have no public IP. Root storage firewall must allow the cluster subnets (PE, SE/VPC endpoint, or service tag).",
    };
  },

  // 19. LF Fed + Snowflake + not PL
  (s) => {
    if (!includes(s, "serverless", "workloads", "lakehouseFederation")) return null;
    if (get(s, "serverless", "lfFederationSource") !== "snowflake") return null;
    if (get(s, "serverless", "lfFederationSourceConn") === "pe") return null;
    return {
      severity: "high",
      title: "Federation to Snowflake without Snowflake PrivateLink",
      detail: "If the Snowflake account is on PrivateLink, federation must use the privatelink account URL and route through an NCC PE rule pointing at the Snowflake VPCE service.",
    };
  },

  // 20. Azure Private Resolver outbound without forwarding ruleset for workspace zone
  (s) => {
    if (s.cloud !== "azure") return null;
    const endpoints = arr(get(s, "dns", "resolverEndpoints"));
    if (!endpoints.includes("azurePrOutbound")) return null;
    const forwarders = arr(get(s, "dns", "forwarders"));
    const hasWorkspaceZone = forwarders.some((f) => /azuredatabricks/i.test(f?.domain || ""));
    if (hasWorkspaceZone) return null;
    return {
      severity: "high",
      title: "Azure Private Resolver outbound without workspace forwarding rule",
      detail: "Outbound endpoint exists, but no forwarding rule for *.azuredatabricks.net (or .privatelink.azuredatabricks.net) was captured. On-prem → Azure resolution chain will be incomplete.",
    };
  },
];

const SEVERITY_ORDER = { blocker: 0, high: 1, medium: 2, info: 3 };

function analyze(state) {
  const findings = [];
  for (const rule of ANALYZE_RULES) {
    try {
      const r = rule(state);
      if (r) findings.push(r);
    } catch (e) {
      // Defensive: a buggy rule shouldn't break the results page.
      console.error("analyze rule failed", e);
    }
  }
  findings.sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  return findings;
}

/* ───────── HELPERS ───────── */

const isVisible = (field, sectionState, fullState) => {
  if (field.cloudOnly && !field.cloudOnly.includes(fullState.cloud)) return false;
  if (typeof field.showIf === "function") {
    try { if (!field.showIf(sectionState || {}, fullState)) return false; } catch { return false; }
  }
  return true;
};

const filterCloudOptions = (options, cloud) =>
  (options || []).filter((o) => !o.cloudOnly || o.cloudOnly.includes(cloud));

const isFieldFilled = (field, value) => {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) {
    if (field.type === "list") {
      return value.some((row) =>
        Object.values(row || {}).some((v) => v !== undefined && v !== null && v !== "")
      );
    }
    return value.length > 0;
  }
  return true;
};

const sectionVisibleFields = (section, state) => {
  const sectionState = state.sections?.[section.id] || {};
  return section.fields.filter((f) => isVisible(f, sectionState, state));
};

const isSectionTouched = (section, state) => {
  const ss = state.sections?.[section.id] || {};
  return sectionVisibleFields(section, state).some((f) => isFieldFilled(f, ss[f.id]));
};

const isSectionComplete = (section, state) => {
  const fields = sectionVisibleFields(section, state);
  return fields.length > 0 && fields.every((f) => isFieldFilled(f, state.sections?.[section.id]?.[f.id]));
};

/* ───────── EXPORTS ───────── */

const labelForOption = (options, id) => {
  const o = (options || []).find((x) => x.id === id);
  return o ? o.label : id;
};

const renderValueForExport = (field, value) => {
  if (!isFieldFilled(field, value)) return null;
  switch (field.type) {
    case "radio":
    case "select":
      return labelForOption(field.options, value);
    case "checkbox":
      return arr(value).map((id) => labelForOption(field.options, id));
    case "list":
      return arr(value).map((row) =>
        (field.columns || []).map((c) => `${c.label}: ${row?.[c.id] || "—"}`).join(" · ")
      );
    case "tristate":
      return { working: "Working", broken: "Broken", unknown: "Unknown", na: "N/A" }[value] || value;
    case "text":
    case "textarea":
      return String(value);
    default:
      return String(value);
  }
};

function buildMarkdown(state, findings) {
  const cloud = CLOUDS[state.cloud];
  const lines = [];
  const ctx = state.sections?.context || {};
  lines.push("# Databricks Network Pre-flight Checklist");
  lines.push("");
  if (ctx.customer) lines.push(`**Customer:** ${ctx.customer}`);
  if (ctx.workspaceName) lines.push(`**Workspace:** ${ctx.workspaceName}`);
  if (ctx.workspaceUrl) lines.push(`**Workspace URL:** ${ctx.workspaceUrl}`);
  if (ctx.region) lines.push(`**Region:** ${ctx.region}`);
  lines.push(`**Cloud:** ${cloud?.label || "—"}`);
  if (ctx.engineer) lines.push(`**Engineer:** ${ctx.engineer}`);
  lines.push(`**Generated:** ${new Date().toLocaleString()}`);
  lines.push("");

  // Findings first — engineers want to see red flags
  if (findings.length) {
    lines.push("## Detected issues");
    lines.push("");
    findings.forEach((f) => {
      lines.push(`- **[${f.severity.toUpperCase()}]** ${f.title}`);
      lines.push(`    > ${f.detail}`);
      if (f.docsUrl) lines.push(`    > Docs: ${f.docsUrl}`);
    });
    lines.push("");
  } else {
    lines.push("## Detected issues");
    lines.push("");
    lines.push("_No rules fired against the captured state. This does not mean the environment is healthy — only that no known-bad combination was detected._");
    lines.push("");
  }

  // Each section
  INTAKE_SECTIONS.forEach((section) => {
    if (section.id === "context") return; // already in header
    const fields = sectionVisibleFields(section, state);
    if (!fields.length) return;
    lines.push(`## ${section.label}`);
    lines.push("");
    fields.forEach((f) => {
      const value = state.sections?.[section.id]?.[f.id];
      if (!isFieldFilled(f, value)) {
        lines.push(`- **${f.label}:** _(not provided)_`);
        return;
      }
      const rendered = renderValueForExport(f, value);
      if (Array.isArray(rendered)) {
        lines.push(`- **${f.label}:**`);
        rendered.forEach((r) => lines.push(`    - ${r}`));
      } else {
        const v = String(rendered).split("\n");
        if (v.length === 1) lines.push(`- **${f.label}:** ${v[0]}`);
        else {
          lines.push(`- **${f.label}:**`);
          v.forEach((ln) => lines.push(`    ${ln}`));
        }
      }
    });
    lines.push("");
  });

  // Open questions
  const open = [];
  INTAKE_SECTIONS.forEach((section) => {
    if (section.id === "context") return;
    sectionVisibleFields(section, state).forEach((f) => {
      const v = state.sections?.[section.id]?.[f.id];
      if (!isFieldFilled(f, v)) open.push(`${section.label} → ${f.label}`);
    });
  });
  if (open.length) {
    lines.push("## Open questions");
    lines.push("");
    open.forEach((q) => lines.push(`- ${q}`));
    lines.push("");
  }

  return lines.join("\n");
}

function buildPdf({ jsPDF, state, findings }) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - margin * 2;
  let y = margin;

  const PRIO_FILL = {
    blocker: [254, 226, 226], high: [254, 243, 199], medium: [219, 234, 254], info: [229, 231, 235],
  };
  const PRIO_TEXT = {
    blocker: [153, 27, 27], high: [146, 64, 14], medium: [30, 64, 175], info: [55, 65, 81],
  };

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin) { doc.addPage(); y = margin; }
  };
  const drawText = (text, opts = {}) => {
    const {
      size = 10, style = "normal", color = [17, 24, 39], indent = 0,
      lineGap = 4, maxW = contentW - indent,
    } = opts;
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text ?? ""), maxW);
    const lineH = size * 1.25;
    lines.forEach((line) => {
      ensureSpace(lineH);
      doc.text(line, margin + indent, y + lineH * 0.8);
      y += lineH;
    });
    y += lineGap;
  };
  const drawHr = () => {
    ensureSpace(8);
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentW, y);
    y += 8;
  };
  const drawPill = (text, x, cy, fill, color) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    const w = doc.getTextWidth(text) + 8;
    doc.setFillColor(...fill);
    doc.roundedRect(x, cy, w, 11, 2, 2, "F");
    doc.setTextColor(...color);
    doc.text(text, x + 4, cy + 7.8);
    return w;
  };

  const cloud = CLOUDS[state.cloud];
  const ctx = state.sections?.context || {};

  drawText("Databricks Network Pre-flight Checklist", { size: 18, style: "bold", lineGap: 2 });
  drawText(
    `${ctx.customer || "—"} · ${ctx.workspaceName || "—"} · ${cloud?.label || "—"}`,
    { size: 10, color: [107, 114, 128], lineGap: 12 }
  );

  const metaRows = [
    ["Customer", ctx.customer || "—"],
    ["Workspace", ctx.workspaceName || "—"],
    ["Workspace URL", ctx.workspaceUrl || "—"],
    ["Region", ctx.region || "—"],
    ["Cloud", cloud?.label || "—"],
    ["Engineer", ctx.engineer || "—"],
    ["Generated", new Date().toLocaleString()],
  ];
  metaRows.forEach(([k, v]) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(107, 114, 128);
    doc.text(k, margin, y + 9);
    doc.setFont("helvetica", "normal"); doc.setTextColor(17, 24, 39);
    const lines = doc.splitTextToSize(String(v), contentW - 120);
    lines.forEach((ln, i) => { if (i > 0) y += 12; doc.text(ln, margin + 110, y + 9); });
    y += 14;
  });
  y += 8;
  drawHr();

  // Findings
  drawText("Detected issues", { size: 13, style: "bold", lineGap: 6 });
  if (!findings.length) {
    drawText(
      "No rules fired against the captured state. This does not mean the environment is healthy — only that no known-bad combination was detected.",
      { size: 9.5, color: [107, 114, 128], lineGap: 10 }
    );
  } else {
    findings.forEach((f) => {
      ensureSpace(36);
      const rowTop = y;
      const fill = PRIO_FILL[f.severity] || PRIO_FILL.info;
      const txt = PRIO_TEXT[f.severity] || PRIO_TEXT.info;
      const pillW = drawPill(f.severity.toUpperCase(), margin, rowTop + 1, fill, txt);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10.5); doc.setTextColor(17, 24, 39);
      const titleX = margin + pillW + 6;
      const titleMaxW = contentW - (titleX - margin);
      doc.splitTextToSize(f.title, titleMaxW).forEach((ln, idx) => {
        doc.text(ln, titleX, rowTop + 9 + idx * 12);
      });
      y = rowTop + 14;
      drawText(f.detail, { size: 9, color: [75, 85, 99], indent: 16, lineGap: 4 });
      if (f.docsUrl) drawText(`Docs: ${f.docsUrl}`, { size: 8.5, color: [37, 99, 235], indent: 16, lineGap: 8 });
    });
  }
  drawHr();

  // Sections
  INTAKE_SECTIONS.forEach((section) => {
    if (section.id === "context") return;
    const fields = sectionVisibleFields(section, state);
    if (!fields.length) return;
    ensureSpace(28);
    drawText(section.label, { size: 13, style: "bold", lineGap: 6 });
    fields.forEach((f) => {
      const value = state.sections?.[section.id]?.[f.id];
      const filled = isFieldFilled(f, value);
      ensureSpace(20);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(55, 65, 81);
      doc.text(f.label, margin, y + 9);
      y += 12;
      if (!filled) {
        drawText("(not provided)", { size: 9, color: [156, 163, 175], indent: 8, lineGap: 6 });
        return;
      }
      const rendered = renderValueForExport(f, value);
      if (Array.isArray(rendered)) {
        rendered.forEach((line) => drawText("• " + line, { size: 9.5, indent: 8, lineGap: 2 }));
        y += 4;
      } else {
        drawText(String(rendered), { size: 9.5, indent: 8, lineGap: 6 });
      }
    });
    drawHr();
  });

  // Open questions
  const open = [];
  INTAKE_SECTIONS.forEach((section) => {
    if (section.id === "context") return;
    sectionVisibleFields(section, state).forEach((f) => {
      const v = state.sections?.[section.id]?.[f.id];
      if (!isFieldFilled(f, v)) open.push(`${section.label} → ${f.label}`);
    });
  });
  if (open.length) {
    drawText("Open questions", { size: 13, style: "bold", lineGap: 6 });
    open.forEach((q) => drawText("• " + q, { size: 9.5, indent: 8, lineGap: 2 }));
  }

  return doc;
}

/* ───────── PRIMITIVES (UI) ───────── */

function StatusBadge({ severity }) {
  const map = {
    blocker: "priority-blocker",
    high:    "priority-high",
    medium:  "priority-medium",
    low:     "priority-low",
    info:    "priority-info",
  };
  return <span className={`priority-badge ${map[severity] || "priority-info"}`}>{severity.toUpperCase()}</span>;
}

function AppHeader({ onHome }) {
  return (
    <header className="app-header">
      <button className="brand brand-button" onClick={onHome} aria-label="Restart">
        <span className="brand-mark"><Icon name="network" size={26} strokeWidth={1.75} /></span>
        <span className="brand-title">
          Databricks Network <span className="brand-accent">Pre-flight Checklist</span>
        </span>
      </button>
      <div className="header-right">
        <a href="https://docs.databricks.com/en/security/network/index.html" target="_blank" rel="noreferrer">Docs</a>
        <a href="https://github.com/moazzamsaeed/network-preflight-checklist" target="_blank" rel="noreferrer">
          <Icon name="github" size={16} /> GitHub
        </a>
      </div>
    </header>
  );
}

/* ───────── CLOUD PICKER ───────── */

function CloudPicker({ onPick }) {
  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-eyebrow"><Icon name="network" size={12} /> Network Intake</div>
        <h1 className="landing-title">
          Capture a customer's <span className="accent">network setup</span> in one pass.
        </h1>
        <p className="landing-subtitle">
          A structured diagnostic intake form for Databricks workspace network issues. Walk through
          the form on a call, capture the customer's environment, and generate a shareable report
          that flags likely red flags for engineering triage.
        </p>
      </section>
      <section className="landing-section">
        <div className="landing-section-eyebrow">Step 1</div>
        <h2 className="landing-section-title">Pick the cloud</h2>
        <p className="landing-section-subtitle">
          The form gates cloud-specific fields based on this. You can restart at any time by
          clicking the title.
        </p>
        <div className="tile-grid tile-grid-center" style={{ marginTop: 24 }}>
          {Object.values(CLOUDS).map((c) => (
            <button key={c.id} className="tile" onClick={() => onPick(c.id)}>
              <div className="tile-icon"><Icon name="cloud" size={28} /></div>
              <div className="tile-label">{c.label}</div>
              <div className="tile-desc">{c.hint}</div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ───────── FIELDS ───────── */

function FieldRow({ field, value, onChange, cloud }) {
  switch (field.type) {
    case "radio": {
      const opts = filterCloudOptions(field.options, cloud);
      return (
        <div className="option-list">
          {opts.map((o) => (
            <label key={o.id} className={`option ${value === o.id ? "selected" : ""}`}>
              <input
                type="radio"
                name={field.id}
                checked={value === o.id}
                onChange={() => onChange(o.id)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      );
    }
    case "checkbox": {
      const opts = filterCloudOptions(field.options, cloud);
      const selected = arr(value);
      return (
        <div className="option-list">
          {opts.map((o) => {
            const isOn = selected.includes(o.id);
            return (
              <label key={o.id} className={`option ${isOn ? "selected" : ""}`}>
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => {
                    const next = isOn ? selected.filter((x) => x !== o.id) : [...selected, o.id];
                    onChange(next);
                  }}
                />
                <span>{o.label}</span>
              </label>
            );
          })}
        </div>
      );
    }
    case "select":
      return (
        <select
          className="field-input"
          value={value || ""}
          onChange={(e) => onChange(e.target.value || null)}
        >
          <option value="">— select —</option>
          {(field.options || []).map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      );
    case "text":
      return (
        <input
          type="text"
          className="field-input"
          placeholder={field.placeholder || ""}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "textarea":
      return (
        <textarea
          className="field-input field-textarea"
          rows={3}
          placeholder={field.placeholder || ""}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );
    case "list": {
      const rows = arr(value);
      const update = (idx, col, v) => {
        const next = rows.slice();
        next[idx] = { ...(next[idx] || {}), [col]: v };
        onChange(next);
      };
      const add = () => onChange([...rows, {}]);
      const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
      return (
        <div className="field-list">
          {rows.map((row, idx) => (
            <div key={idx} className="field-list-row">
              {(field.columns || []).map((c) => (
                <input
                  key={c.id}
                  type="text"
                  className="field-input field-list-cell"
                  placeholder={c.placeholder || c.label}
                  value={row?.[c.id] || ""}
                  onChange={(e) => update(idx, c.id, e.target.value)}
                />
              ))}
              <button className="btn-icon" onClick={() => remove(idx)} title="Remove row">
                <Icon name="trash" size={14} />
              </button>
            </div>
          ))}
          <button className="btn btn-ghost btn-sm" onClick={add}>
            <Icon name="plus" size={14} /> Add row
          </button>
        </div>
      );
    }
    case "tristate": {
      const states = [
        { id: "working", label: "Working" },
        { id: "broken",  label: "Broken" },
        { id: "unknown", label: "Unknown" },
        { id: "na",      label: "N/A" },
      ];
      return (
        <div className="tristate">
          {states.map((s) => (
            <button
              key={s.id}
              className={`tristate-btn tristate-${s.id} ${value === s.id ? "selected" : ""}`}
              onClick={() => onChange(value === s.id ? null : s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}

/* ───────── SECTION CARD ───────── */

function SectionCard({ section, state, onChange, sectionRef }) {
  const cloud = state.cloud;
  const fields = sectionVisibleFields(section, state);
  if (!fields.length) return null;
  const sectionState = state.sections?.[section.id] || {};
  return (
    <div className="section" ref={sectionRef} id={`section-${section.id}`}>
      <div className="section-head" style={{ cursor: "default" }}>
        <div className="section-head-left">
          <span className="section-icon"><Icon name={section.icon} size={16} /></span>
          <div>
            <div className="section-title">{section.label}</div>
            {section.description && <div className="section-desc">{section.description}</div>}
          </div>
        </div>
      </div>
      <div className="section-body">
        {fields.map((f) => (
          <div className="field-row" key={f.id}>
            <div className="field-label">
              {f.label}
              {f.cloudOnly && <span className="field-cloud-tag">{f.cloudOnly.join(", ").toUpperCase()}</span>}
            </div>
            <FieldRow
              field={f}
              value={sectionState[f.id]}
              onChange={(v) => onChange(section.id, f.id, v)}
              cloud={cloud}
            />
            {f.help && <div className="field-help">{f.help}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── INTAKE FORM ───────── */

function IntakeForm({ state, setState, onGenerate, onBack }) {
  const [activeSectionId, setActiveSectionId] = useState(INTAKE_SECTIONS[0].id);
  const onChange = (sectionId, fieldId, value) => {
    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: { ...(prev.sections?.[sectionId] || {}), [fieldId]: value },
      },
    }));
  };

  const selectSection = (id) => {
    setActiveSectionId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeIdx = Math.max(0, INTAKE_SECTIONS.findIndex((s) => s.id === activeSectionId));
  const activeSection = INTAKE_SECTIONS[activeIdx];
  const prevSection = INTAKE_SECTIONS[activeIdx - 1];
  const nextSection = INTAKE_SECTIONS[activeIdx + 1];

  return (
    <div className="app-body">
      <aside className="sidebar">
        <nav className="sidebar-nav">
          <div className="sidebar-cloud">
            <Icon name="cloud" size={14} /> {CLOUDS[state.cloud]?.label}
          </div>
          {INTAKE_SECTIONS.map((s) => {
            const touched = isSectionTouched(s, state);
            const complete = isSectionComplete(s, state);
            const current = s.id === activeSectionId;
            const cls = [
              "nav-step",
              complete && "done",
              current && "active",
              touched && !complete && !current && "touched",
            ].filter(Boolean).join(" ");
            return (
              <button key={s.id} className={cls} onClick={() => selectSection(s.id)}>
                <span className="nav-step-num">
                  {complete ? <Icon name="check" size={12} strokeWidth={2.5} /> : <Icon name={s.icon} size={12} />}
                </span>
                <span>{s.label}</span>
              </button>
            );
          })}
          <button className="nav-step nav-step-ghost" onClick={onBack}>
            <span className="nav-step-num"><Icon name="restart" size={12} /></span>
            <span>Change cloud</span>
          </button>
        </nav>
      </aside>
      <main className="app-main">
        <div className="step-eyebrow">
          Step 2 · Section {activeIdx + 1} of {INTAKE_SECTIONS.length}
        </div>
        <h1 className="step-title">Customer environment intake</h1>
        <p className="step-desc">
          Fill what the customer knows; mark the rest unknown. Use the sidebar to jump between
          sections, or step through with Previous / Next. Hit Generate when ready.
        </p>
        <div className="sections-stack">
          <SectionCard
            key={activeSection.id}
            section={activeSection}
            state={state}
            onChange={onChange}
          />
        </div>
        <div className="form-footer">
          <div className="form-footer-left">
            {prevSection && (
              <button className="btn btn-ghost" onClick={() => selectSection(prevSection.id)}>
                ← {prevSection.label}
              </button>
            )}
          </div>
          <div className="form-footer-right">
            {nextSection ? (
              <button className="btn btn-primary" onClick={() => selectSection(nextSection.id)}>
                Next: {nextSection.label} <Icon name="arrowRight" />
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={onGenerate}>
                Generate report <Icon name="arrowRight" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ───────── RESULTS PAGE ───────── */

function ResultsPage({ state, onRestart }) {
  const findings = useMemo(() => analyze(state), [state]);
  const ctx = state.sections?.context || {};

  const counts = useMemo(() => {
    const c = { blocker: 0, high: 0, info: 0 };
    findings.forEach((f) => { c[f.severity] = (c[f.severity] || 0) + 1; });
    return c;
  }, [findings]);

  const filename = (ext) => {
    const slug = (ctx.workspaceName || ctx.customer || "intake")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "intake";
    return `network-preflight-${slug}.${ext}`;
  };

  const downloadMd = () => {
    const md = buildMarkdown(state, findings);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename("md");
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    buildPdf({ jsPDF, state, findings }).save(filename("pdf"));
  };

  return (
    <main className="app-main results-main">
      <div className="step-eyebrow">Step 3</div>
      <h1 className="step-title">Results</h1>
      <p className="step-desc">
        Findings sorted by severity, full intake snapshot, and unanswered questions for follow-up.
      </p>

      <div className="results-summary">
        <div className="summary-card">
          <div className="label">Customer</div>
          <div className="value">{ctx.customer || "—"}</div>
        </div>
        <div className="summary-card">
          <div className="label">Workspace</div>
          <div className="value">{ctx.workspaceName || "—"}</div>
        </div>
        <div className="summary-card">
          <div className="label">Cloud</div>
          <div className="value">{CLOUDS[state.cloud]?.label || "—"}</div>
        </div>
        <div className="summary-card">
          <div className="label">Findings</div>
          <div className="value" style={{ gap: 10 }}>
            <span style={{ color: "var(--prio-blocker)" }}>{counts.blocker || 0}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span style={{ color: "var(--prio-high)" }}>{counts.high || 0}</span>
            <span style={{ color: "var(--text-muted)" }}>·</span>
            <span style={{ color: "var(--text-secondary)" }}>{counts.info || 0}</span>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <button className="btn btn-primary" onClick={downloadMd}><Icon name="download" /> Markdown</button>
          <button className="btn btn-primary" onClick={downloadPdf}><Icon name="download" /> PDF</button>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-ghost" onClick={onRestart}><Icon name="restart" /> Restart</button>
        </div>
      </div>

      <h2 className="results-h2">Detected issues</h2>
      {findings.length === 0 ? (
        <div className="empty">
          No rules fired against the captured state. This does not mean the environment is healthy —
          only that no known-bad combination was detected by the rule engine.
        </div>
      ) : (
        <div className="findings">
          {findings.map((f, i) => (
            <div key={i} className={`finding finding-${f.severity}`}>
              <div className="finding-head">
                <StatusBadge severity={f.severity} />
                <div className="finding-title">{f.title}</div>
              </div>
              <div className="finding-detail">{f.detail}</div>
              {f.docsUrl && (
                <a className="finding-docs" href={f.docsUrl} target="_blank" rel="noreferrer">
                  Docs ↗
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="results-h2">Captured intake</h2>
      <div className="sections-stack">
        {INTAKE_SECTIONS.map((section) => {
          if (section.id === "context") return null;
          const fields = sectionVisibleFields(section, state);
          if (!fields.length) return null;
          return (
            <div className="section" key={section.id}>
              <div className="section-head">
                <div className="section-head-left">
                  <span className="section-icon"><Icon name={section.icon} size={16} /></span>
                  <div className="section-title">{section.label}</div>
                </div>
              </div>
              <div className="section-body section-body-compact">
                {fields.map((f) => {
                  const v = state.sections?.[section.id]?.[f.id];
                  const filled = isFieldFilled(f, v);
                  const rendered = filled ? renderValueForExport(f, v) : null;
                  return (
                    <div key={f.id} className="result-field">
                      <div className="result-field-label">{f.label}</div>
                      <div className="result-field-value">
                        {!filled ? <em className="muted">not provided</em>
                          : Array.isArray(rendered) ? (
                              <ul>{rendered.map((r, i) => <li key={i}>{r}</li>)}</ul>
                            ) : <span>{String(rendered)}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/* ───────── APP ───────── */

const INITIAL_STATE = { cloud: null, step: 0, sections: {} };

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);

  const reset = () => setState(INITIAL_STATE);

  const onPickCloud = (cloud) => setState({ ...INITIAL_STATE, cloud, step: 1 });
  const onGenerate = () => setState((s) => ({ ...s, step: 2 }));
  const onBack = () => setState((s) => ({ ...s, step: 0, cloud: null }));

  // Browser title reflects step
  useEffect(() => {
    document.title = "Databricks Network Pre-flight Checklist";
  }, []);

  return (
    <div className="app-shell">
      <AppHeader onHome={reset} />
      {state.step === 0 && <CloudPicker onPick={onPickCloud} />}
      {state.step === 1 && (
        <IntakeForm
          state={state}
          setState={setState}
          onGenerate={onGenerate}
          onBack={onBack}
        />
      )}
      {state.step === 2 && <ResultsPage state={state} onRestart={reset} />}
    </div>
  );
}
