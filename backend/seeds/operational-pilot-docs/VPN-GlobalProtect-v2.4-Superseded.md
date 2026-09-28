# Standard Operating Procedure: GlobalProtect VPN Gateway (v2.4 - Superseded)
**Document ID:** SOP-NET-2024-002  
**Status:** SUPERSEDED (Deprecated as of Dec 31, 2025)  
**Applicability:** General Staff (Historical Reference Only)  
**Effective Date:** January 15, 2024  
**Expiration Date:** December 31, 2025  

---

### 1. Gateway Connection Parameters
- **Gateway Address:** `vpn-legacy.internal.bluehawk.com`
- **Default Port:** Port 443 (TCP/SSL)
- **Encryption:** AES-128-CBC
- **Authentication Method:** Single username and password with optional SMS one-time password (OTP).

### 2. Client Setup
- Staff may download the legacy installer directly from the public web portal.
- Device posture checks are optional.
- Split-tunneling is permitted for local subnet traffic (192.168.1.0/24).

### 3. Decommissioning Notice
> [!WARNING]
> This gateway is scheduled for complete shutdown. All active users must migrate to v3.0 Zero-Trust Gateway before Q1 2026.
