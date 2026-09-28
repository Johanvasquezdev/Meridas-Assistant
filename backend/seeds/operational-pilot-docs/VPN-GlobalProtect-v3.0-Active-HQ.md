# Standard Operating Procedure: GlobalProtect Zero-Trust Gateway (v3.0 - Active)
**Document ID:** SOP-NET-2026-001  
**Status:** ACTIVE  
**Applicability:** Corporate HQ & Headquarters Remote Staff  
**Effective Date:** January 1, 2026  
**Supersedes:** SOP-NET-2024-002  
**Owner:** Johan Vasquez (Compliance Custodian)  

---

### 1. Gateway Connection Parameters
- **Gateway Address:** `vpn-hq.internal.bluehawk.com`
- **Mandatory Port:** Port 8443 (TLS 1.3 Strict)
- **Encryption:** AES-256-GCM
- **Authentication Method:** Corporate Active Directory credentials + Mandatory Duo Mobile Hardware Push MFA. SMS authentication is strictly prohibited.

### 2. Device Compliance & Health Checks
- Connecting laptops must have BitLocker/FileVault enabled and crowdstrike agent running.
- Split-tunneling is strictly disabled; all corporate traffic routes through the secure perimeter.
- Inactive sessions are disconnected automatically after 30 minutes of idle time.

### 3. Emergency Support
- For locked accounts or MFA resets, contact Johan Vasquez at the IT Operations Desk.
