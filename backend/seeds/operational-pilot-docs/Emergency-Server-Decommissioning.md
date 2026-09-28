# Standard Operating Procedure: Emergency Server Decommissioning & Sanitization
**Document ID:** SOP-SEC-2025-009  
**Status:** ACTIVE  
**Applicability:** Data Center Infrastructure & Production Server Racks  
**Effective Date:** November 10, 2025  
**Compliance Standard:** POLITICS.md Section 2 (Step 6: Retiro Definitivo) & SECURITY_GENERAL.md  
**Governance Chain:** Johan Vasquez (Lead Systems Custodian) & Infrastructure Security Directorate  

---

### 1. Authorization Gate (Mandatory Dual-Custody)
- No physical Dell PowerEdge server or VMware ESXi hypervisor storage array may be wiped, powered down permanently, or decommissioned without explicit written dual-authorization from:
  1. **Johan Vasquez** (Lead Systems Custodian)
  2. **Director of Infrastructure Operations** or **Chief Information Security Officer (CISO)**
- Any autonomous or single-operator decommission attempt is an immediate security violation.

### 2. Cryptographic Sanitization Procedure
- All internal NVMe and SAS disk volumes must undergo cryptographic erase followed by a minimum of 3-pass DoD 5220.22-M overwrite before chassis removal.
- MAC addresses and hardware serial numbers (`BH-YYYY-XXXX`) must be archived in `audit_logs` before retirement.
- An asset retirement manifest must be signed and filed in the compliance repository.
