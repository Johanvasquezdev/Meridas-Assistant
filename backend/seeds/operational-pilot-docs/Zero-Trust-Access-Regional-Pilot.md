# Standard Operating Procedure: Zero-Trust Network Access Pilot (Regional East)
**Document ID:** SOP-ZTNA-2026-004  
**Status:** ACTIVE (Pilot Deployment)  
**Applicability:** Regional East Logistics Facility & Warehouse Technicians  
**Effective Date:** February 1, 2026  
**Scope Site:** Regional East Warehouse  
**Scope System:** Logistics Network  
**Owner:** Johan Vasquez (Lead Systems Custodian)  

---

### 1. Architectural Scope
- This ZTNA gateway controls access strictly for handheld scanner terminals, barcode printing nodes, and logistics workstations within the Regional East warehouse perimeter.
- Corporate HQ VPN gateways (`vpn-hq.internal.bluehawk.com`) do NOT route warehouse telemetry.

### 2. Authentication & Access Enforcement
- Authentication is governed via device hardware token (FIDO2 NFC security key) tied to the technician's assigned employee ID.
- Access is restricted to `https://inventory.regional.bluehawk.com:8443`.
- No general internet routing is permitted through this gateway.
