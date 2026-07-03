import Navbar from '@/components/ui/Navbar';

export const metadata = {
  title: 'Privacy Policy — LMN8',
  description: 'LMN8 Privacy Policy — How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 pt-24">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy</h1>

          <div className="mt-8 space-y-8 text-white/80 text-sm leading-relaxed [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h4]:text-white/90 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-4 [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-white/70 [&_strong]:text-white/90 [&_em]:text-white/60 [&_a]:text-cyan-400 [&_a]:hover:text-cyan-300 [&_hr]:border-white/10 [&_hr]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/60">

<p><strong>LMN8 LLC</strong></p>

<table className="w-full text-sm border-collapse">
  <tbody>
    <tr>
      <td className="py-1 pr-4 text-white/60 align-top whitespace-nowrap"><strong>Effective Date</strong></td>
      <td className="py-1 text-white/80">July 3, 2026</td>
    </tr>
    <tr>
      <td className="py-1 pr-4 text-white/60 align-top whitespace-nowrap"><strong>Legal Entity</strong></td>
      <td className="py-1 text-white/80">LMN8 LLC<br/>18601 FM 1431, STE 104-4<br/>Jonestown, TX 78645</td>
    </tr>
    <tr>
      <td className="py-1 pr-4 text-white/60 align-top whitespace-nowrap"><strong>Privacy Contact</strong></td>
      <td className="py-1 text-white/80">privacy@lmn8.ai</td>
    </tr>
  </tbody>
</table>

<h2>IMPORTANT NOTICE REGARDING PROTECTED HEALTH INFORMATION</h2>

<p>LMN8 LLC operates as a technology platform. Where LMN8 creates, receives, maintains, or transmits Protected Health Information ("PHI") on behalf of a Covered Entity (as defined under HIPAA, 45 C.F.R. § 160.103), LMN8 functions as a Business Associate and such processing is governed by a separate Business Associate Agreement ("BAA"). This Privacy Policy does not supersede, modify, or limit any BAA in effect between LMN8 and a Covered Entity partner. In the event of a conflict between this Privacy Policy and an executed BAA, the BAA controls with respect to PHI.</p>

<p>This Privacy Policy does not constitute legal advice and does not create an attorney-client relationship.</p>

<h2>1. Scope and Applicability</h2>

<p>This Privacy Policy (the "Policy") governs the collection, use, disclosure, retention, and protection of personal information and, where applicable, Protected Health Information by LMN8 LLC ("LMN8," "we," "us," or "our") in connection with the following products and services (collectively, the "Services"):</p>

<ul>
  <li>LMN8 mobile and web application ("App")</li>
  <li>LMN8 clinical and administrative dashboard ("Dashboard")</li>
  <li>LMN8 public-facing website ("Website")</li>
</ul>

<p>LMN8 provides Services across two operational tracks:</p>

<table className="w-full text-sm border-collapse border border-white/10">
  <thead>
    <tr className="bg-white/5">
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Clinical Track</th>
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Community Track</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="p-2 border border-white/10 text-white/70">Clinically supervised or clinician-associated integration workflows, which may include psychedelic-assisted therapy contexts. Participants in this track may have their data treated as PHI subject to HIPAA and any applicable BAA.</td>
      <td className="p-2 border border-white/10 text-white/70">Community-based peer support and integration models operated independently of clinical licensure. Psychedelic substances are not used or facilitated within this track. Data in this track is processed as general personal information under this Policy.</td>
    </tr>
  </tbody>
</table>

<p>Privacy protections described in this Policy apply equally across both tracks. Where additional or differentiated obligations apply to a specific track, they are identified explicitly.</p>

<h2>2. Foundational Privacy Principles</h2>

<p>LMN8 is designed around the following privacy commitments, which inform every product decision, data architecture choice, and third-party relationship:</p>

<ul>
  <li><strong>Data Minimization:</strong> We collect only the information necessary to provide the Services and fulfill our legal obligations. We do not collect data speculatively.</li>
  <li><strong>Least-Privilege Access:</strong> Access to personal information is restricted to personnel and systems that require it to perform specific, authorized functions. Role-based access controls are enforced at the application layer.</li>
  <li><strong>Contextual Integrity:</strong> Information shared in one context (e.g., a clinical integration session) is not repurposed for incompatible uses without your knowledge and, where required, your explicit consent.</li>
  <li><strong>Transparency:</strong> We explain clearly what data we collect, why we collect it, who we share it with, and how long we keep it. We do not use dark patterns to obscure material data practices.</li>
  <li><strong>User Control:</strong> We provide meaningful access, correction, export, and deletion mechanisms, subject to legal retention requirements and the constraints of organization-managed accounts.</li>
  <li><strong>Security by Design:</strong> We implement administrative, technical, and physical safeguards commensurate with the sensitivity of the information we process, including encryption in transit and at rest for sensitive data categories.</li>
</ul>

<h2>3. Information We Collect</h2>

<p>We collect information in the following categories depending on how you interact with the Services:</p>

<h3>3A. Account and Profile Information</h3>
<p>When you register for an account or are provisioned access by an organization, we collect:</p>
<ul>
  <li>Full name or alias (at user discretion where alias is supported)</li>
  <li>Email address and/or phone number used for authentication</li>
  <li>Organizational affiliation and assigned role (e.g., participant, facilitator, clinician, administrator)</li>
</ul>

<h3>3B. User-Generated Content</h3>
<p>Depending on the features you access, you may provide:</p>
<ul>
  <li>Reflections, journals, and integration notes entered directly into the App</li>
  <li>Responses to structured questionnaires or assessment instruments</li>
  <li>Files or attachments you choose to upload</li>
  <li>Clinical notes, session observations, or annotations entered by clinicians or facilitators via the Dashboard</li>
</ul>

<p><strong>Sensitivity Notice:</strong> User-generated content in the Clinical Track may constitute PHI under HIPAA (45 C.F.R. § 160.103) or Mental Health Records subject to Texas Health &amp; Safety Code § 611.001 et seq. Such content receives the highest level of access restriction and encryption within our platform.</p>

<h3>3C. Device and Usage Data</h3>
<p>We automatically collect limited technical data to maintain security, diagnose errors, and improve performance:</p>
<ul>
  <li>Device type, operating system, and browser or application version</li>
  <li>IP address (used to derive approximate geographic region; not used for precise location tracking)</li>
  <li>Log data including session timestamps, feature interactions, and crash reports</li>
</ul>
<p>We do not use device or usage data to build individual behavioral profiles for advertising purposes.</p>

<h3>3D. Organization-Provided Data</h3>
<p>If you access the Services through a clinic, treatment program, or community organization, that organization may transmit the following to LMN8 to facilitate your access:</p>
<ul>
  <li>Program enrollment or participant identifiers</li>
  <li>Scheduling references or session linkage data</li>
  <li>Role assignments and permission configurations</li>
</ul>
<p>LMN8's processing of such data is governed by the agreement between LMN8 and the organization, which may include a BAA and/or a Data Processing Agreement ("DPA").</p>

<h3>3E. Cookies and Similar Technologies</h3>
<p>On the Website, we may use:</p>
<ul>
  <li>Strictly necessary cookies required for authentication and security functions</li>
  <li>Analytics cookies or similar technologies, using privacy-preserving configurations where feasible, to understand aggregate usage patterns and improve reliability</li>
</ul>
<p>We do not use third-party advertising cookies or cross-site tracking technologies. [Note: Confirm and list specific analytics tools — e.g., PostHog, Plausible — prior to publication and update this section accordingly.]</p>

<h3>3F. AI-Assisted Feature Processing</h3>
<p>Where AI-assisted features are enabled (e.g., session summaries, suggested reflection prompts), User Content may be processed by underlying AI models to generate outputs. The following disclosures apply:</p>
<ul>
  <li>AI outputs are informational tools only. They do not constitute clinical diagnosis, treatment recommendations, or medical advice.</li>
  <li>Clinicians and facilitators retain full professional responsibility for all care decisions. No AI output overrides or substitutes clinical judgment.</li>
  <li>User Content submitted to AI features is processed under the same confidentiality and access controls as other data. We do not use PHI to train third-party AI models without explicit written authorization.</li>
  <li>Where AI processing involves a third-party model provider, such provider is engaged as a subprocessor under contractual obligations that include data confidentiality, use restrictions, and security standards.</li>
</ul>

<h2>4. Legal Bases and Purposes for Processing</h2>

<p>We process personal information for the following purposes, each of which corresponds to a lawful basis:</p>

<table className="w-full text-sm border-collapse border border-white/10">
  <thead>
    <tr className="bg-white/5">
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Purpose</th>
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Data Types Involved</th>
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Lawful Basis</th>
    </tr>
  </thead>
  <tbody>
    <tr><td className="p-2 border border-white/10 text-white/70">Provide and maintain the Services; authenticate users; enforce access controls</td><td className="p-2 border border-white/10 text-white/70">Account info; device data</td><td className="p-2 border border-white/10 text-white/70">Contract performance; Legitimate interest</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Store and display User Content as directed by the user or authorized clinician</td><td className="p-2 border border-white/10 text-white/70">User content; org-provided data</td><td className="p-2 border border-white/10 text-white/70">Contract performance; Consent (where applicable)</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Support HIPAA-compliant security controls and BAA obligations</td><td className="p-2 border border-white/10 text-white/70">PHI (Clinical Track)</td><td className="p-2 border border-white/10 text-white/70">Legal obligation; BAA</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Improve reliability, safety, and performance of the Services</td><td className="p-2 border border-white/10 text-white/70">Aggregated/de-identified usage data</td><td className="p-2 border border-white/10 text-white/70">Legitimate interest</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Respond to support requests and technical inquiries</td><td className="p-2 border border-white/10 text-white/70">Account info; communications</td><td className="p-2 border border-white/10 text-white/70">Contract performance; Legitimate interest</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Comply with applicable law, respond to legal process, or protect safety</td><td className="p-2 border border-white/10 text-white/70">As required by law</td><td className="p-2 border border-white/10 text-white/70">Legal obligation; Vital interest</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/70">Generate AI-assisted summaries or prompts (if feature is enabled)</td><td className="p-2 border border-white/10 text-white/70">User content (processed, not retained by AI subprocessor)</td><td className="p-2 border border-white/10 text-white/70">Consent; Contract performance</td></tr>
  </tbody>
</table>

<h2>5. Disclosure and Sharing of Information</h2>

<p>LMN8 does not sell, rent, or trade personal information or Protected Health Information to any third party. We do not disclose personal information for third-party advertising purposes.</p>

<p>We disclose information only in the following circumstances:</p>

<h3>5A. Service Providers and Subprocessors</h3>
<p>We engage vetted third-party service providers to assist in operating the Services, including cloud hosting, infrastructure monitoring, communications delivery, and technical support. All such providers are contractually required to:</p>
<ul>
  <li>Process data only on our documented instructions</li>
  <li>Maintain confidentiality and implement appropriate security safeguards</li>
  <li>Not further disclose data except as authorized in writing by LMN8</li>
  <li>Execute a BAA where required under HIPAA</li>
</ul>
<p>Current infrastructure hosting: DigitalOcean (United States — region: [confirm specific region prior to publication]). All data is hosted within the United States.</p>

<h3>5B. Your Organization</h3>
<p>If you access the Services through an organization (clinic, treatment program, or community partner), authorized personnel within that organization — such as your treating clinician, program administrator, or designated facilitator — may access your data consistent with:</p>
<ul>
  <li>Their role-based permissions as configured in the platform</li>
  <li>The organization's own privacy and confidentiality policies</li>
  <li>Applicable professional ethical obligations (e.g., therapist-patient confidentiality, Texas Health &amp; Safety Code § 611.001 et seq.)</li>
  <li>Any BAA or DPA executed between LMN8 and that organization</li>
</ul>
<p>LMN8 does not grant organizational access beyond what is necessary for legitimate program operations.</p>

<h3>5C. Legal Process and Safety Disclosures</h3>
<p>We may disclose information when we have a good-faith belief that disclosure is necessary to:</p>
<ul>
  <li>Comply with a valid subpoena, court order, government investigation, or other legal process</li>
  <li>Enforce our Terms of Service or protect the legal rights of LMN8, our users, or third parties</li>
  <li>Prevent or respond to fraud, security incidents, or imminent physical harm</li>
  <li>Fulfill mandatory reporting obligations under applicable law (e.g., mandatory abuse reporting under Texas Family Code § 261.101)</li>
</ul>
<p>Where legally permitted, we will attempt to notify affected users before disclosing their information in response to legal process.</p>

<h3>5D. Corporate Transactions</h3>
<p>In the event of a merger, acquisition, asset sale, financing transaction, or reorganization involving LMN8, personal information may be transferred as part of that transaction. Any successor entity will be required to honor the commitments made in this Policy or provide you with advance notice and an opportunity to object. PHI transfers in such events will comply with HIPAA requirements, including 45 C.F.R. § 164.502(b).</p>

<h2>6. Data Access, Roles, and Permissions</h2>

<p>Access to personal information within the LMN8 platform is governed by role-based access controls enforced at the application layer. Access levels reflect the minimum necessary standard required under HIPAA (45 C.F.R. § 164.514(d)) and are applied consistently across both tracks.</p>

<p><strong>Clinical Track.</strong> Authorized Dashboard users — including licensed clinicians, clinical supervisors, and program administrators — may access participant-level data to the extent required for care coordination, session documentation, safety monitoring, and regulatory compliance. Access is logged and auditable.</p>

<p><strong>Community Track.</strong> Facilitators and community administrators may access participant data necessary for program operations (e.g., enrollment status, participation records). They do not have access to Clinical Track health data.</p>

<p>LMN8 maintains audit logs of data access events. Access by LMN8 internal personnel to production data containing personal information requires documented authorization and is subject to internal review.</p>

<h2>7. Data Retention and Deletion</h2>

<p>We retain personal information for the minimum period necessary to fulfill the purposes described in this Policy, unless a longer retention period is required or permitted by law.</p>

<p>General retention principles:</p>
<ul>
  <li>Account and profile information is retained for the duration of the active account and for a reasonable period thereafter to support account recovery and audit obligations.</li>
  <li>User Content is retained as directed by the user and/or governing organization agreement. For Clinical Track data, retention periods may be governed by Texas Health &amp; Safety Code § 241.103 (hospital records) or applicable professional board rules (e.g., Texas State Board of Examiners of Professional Counselors).</li>
  <li>Device and usage data (logs) are retained for [specify period, e.g., 90 days] for security and diagnostic purposes, then purged or anonymized.</li>
  <li>Data subject to a BAA is retained and destroyed in accordance with the terms of that BAA and HIPAA requirements.</li>
</ul>

<p>Deletion requests are processed within [specify SLA, e.g., 30 days] of receipt, except where retention is required by legal obligation, an active BAA, or a pending dispute. We will confirm completion of deletion to the requesting user.</p>

<p>Note: Where data is held in backups, deletion from backups will occur in the ordinary course of the backup rotation cycle, which may extend the effective deletion timeline.</p>

<h2>8. Security</h2>

<p>LMN8 implements a layered security program designed to protect personal information against unauthorized access, disclosure, alteration, and destruction. Our safeguards include:</p>

<ul>
  <li>Encryption in transit (TLS 1.2 or higher) for all data transmitted between users and our systems</li>
  <li>Encryption at rest for databases and storage volumes containing personal information and PHI</li>
  <li>Role-based access controls with principle of least privilege enforced at the application and infrastructure layers</li>
  <li>Multi-factor authentication requirements for Dashboard and administrative access</li>
  <li>Audit logging of authentication events, data access, and administrative actions</li>
  <li>Periodic security assessments and vulnerability management processes</li>
  <li>Vendor security review for third-party subprocessors with access to personal data</li>
</ul>

<p>Important: No system or transmission of information over the internet is guaranteed to be completely secure. While we implement and maintain reasonable safeguards, LMN8 cannot warrant the absolute security of any information you transmit to us. You are responsible for maintaining the confidentiality of your account credentials and for ensuring secure device practices.</p>

<p>In the event of a security incident that triggers notification obligations under applicable law (including HIPAA Breach Notification Rule, 45 C.F.R. §§ 164.400–164.414, and the Texas Identity Theft Enforcement and Protection Act, Tex. Bus. &amp; Com. Code § 521.053), we will provide required notifications within applicable statutory deadlines.</p>

<h2>9. Your Rights and Choices</h2>

<p>Subject to applicable law and the constraints of your account type, you have the following rights with respect to your personal information:</p>

<table className="w-full text-sm border-collapse border border-white/10">
  <thead>
    <tr className="bg-white/5">
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Right</th>
      <th className="p-2 border border-white/10 text-left text-white font-semibold">Description and Limitations</th>
    </tr>
  </thead>
  <tbody>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Access</td><td className="p-2 border border-white/10 text-white/70">Request a copy of the personal information we hold about you. For PHI in the Clinical Track, access rights are also governed by HIPAA (45 C.F.R. § 164.524) and may be coordinated through your treating provider.</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Correction</td><td className="p-2 border border-white/10 text-white/70">Request correction of inaccurate or incomplete personal information, subject to verification.</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Portability / Export</td><td className="p-2 border border-white/10 text-white/70">Request an export of your User Content in a commonly used, machine-readable format where technically feasible.</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Deletion</td><td className="p-2 border border-white/10 text-white/70">Request deletion of your personal information. Deletion may be limited where retention is required by law, BAA, or pending legal matter. For PHI, deletion rights under HIPAA apply (45 C.F.R. § 164.526).</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Restriction</td><td className="p-2 border border-white/10 text-white/70">Request that we limit processing of your personal information in certain circumstances.</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Objection</td><td className="p-2 border border-white/10 text-white/70">Object to certain processing activities, including processing based on legitimate interests.</td></tr>
    <tr><td className="p-2 border border-white/10 font-semibold text-white">Withdraw Consent</td><td className="p-2 border border-white/10 text-white/70">Where processing is based on your consent, you may withdraw consent at any time without affecting the lawfulness of prior processing.</td></tr>
  </tbody>
</table>

<p>To exercise any of the above rights, contact us at privacy@lmn8.ai. We will respond within 30 days of receipt, or within any shorter period required by applicable law. We may request verification of your identity before processing your request.</p>

<p><strong>Organization-Managed Accounts:</strong> If your account is provisioned and managed by an organization (e.g., a clinic or community program), certain rights requests — including deletion and data portability — may need to be submitted through or coordinated with that organization, which acts as the data controller for your enrollment data.</p>

<h2>10. Mental Health and Sensitive Data Protections</h2>

<p>LMN8 processes information that may include mental health records, psychotherapy notes, and integration experiences relating to mental health treatment. We apply the following heightened protections to this category of data:</p>

<ul>
  <li>Mental health records processed in the Clinical Track are treated as confidential under Texas Health &amp; Safety Code § 611.001 et seq. and are not disclosed without a specific, written authorization except as required by law or as permitted under an applicable BAA.</li>
  <li>Psychotherapy notes (as defined under 45 C.F.R. § 164.501) are maintained separately from the general medical record and are subject to more restrictive use and disclosure limitations under HIPAA.</li>
  <li>Information relating to substance use disorder treatment, where applicable, may be subject to additional federal protections under 42 C.F.R. Part 2, which requires patient-specific authorization before disclosure in most circumstances. LMN8 will identify and apply Part 2 protections where its partner programs are Part 2 programs.</li>
  <li>AI-generated outputs are never treated as clinical diagnoses or notes. They are not incorporated into official clinical records without clinician review and attestation.</li>
</ul>

<h2>11. Children's Privacy</h2>

<p>The Services are designed and intended for users who are 18 years of age or older.</p>

<p>Individuals under the age of 18 may only access the Services where:</p>
<ul>
  <li>Access is provisioned by an authorized clinic, program, or community organization</li>
  <li>Verified parental or legal guardian consent has been obtained and documented in accordance with applicable law, including the Children's Online Privacy Protection Act (COPPA), 15 U.S.C. §§ 6501–6506, where applicable</li>
  <li>Required clinical supervision is in place</li>
</ul>

<p>LMN8 does not knowingly collect personal information from individuals under 13 without verifiable parental consent. If we become aware that we have inadvertently collected such information without proper consent, we will promptly delete it. If you believe a minor's information has been collected without proper consent, contact us at privacy@lmn8.ai.</p>

<h2>12. Data Residency and International Availability</h2>

<p>LMN8 currently hosts all data in the United States. Our primary infrastructure provider is DigitalOcean, operating within U.S.-based data centers (region: [confirm prior to publication]).</p>

<p>The Services are not currently offered outside the United States. If international availability is introduced in the future, LMN8 will:</p>
<ul>
  <li>Evaluate and implement applicable cross-border data transfer mechanisms (e.g., Standard Contractual Clauses for EEA-to-U.S. transfers)</li>
  <li>Update this Policy to reflect applicable regional requirements (e.g., GDPR, PIPEDA)</li>
  <li>Notify affected users in advance of any changes to hosting jurisdiction</li>
</ul>

<h2>13. HIPAA Notice — Business Associate Relationships</h2>

<p>Where LMN8 processes PHI on behalf of a Covered Entity (as defined under 45 C.F.R. § 160.103), LMN8 acts as a Business Associate. In this capacity:</p>

<ul>
  <li>A separate, executed Business Associate Agreement (BAA) governs all PHI processing. The BAA supersedes this Privacy Policy with respect to PHI.</li>
  <li>LMN8 will use and disclose PHI only as permitted or required by the BAA and applicable law.</li>
  <li>LMN8 will implement and maintain safeguards as required under the HIPAA Security Rule (45 C.F.R. Part 164, Subpart C).</li>
  <li>LMN8 will report breaches of unsecured PHI to the applicable Covered Entity within the timeframe required under the HIPAA Breach Notification Rule (45 C.F.R. §§ 164.400–414).</li>
  <li>Patients retain HIPAA rights as described in the Covered Entity's Notice of Privacy Practices (NPP), which is issued by the Covered Entity, not by LMN8.</li>
</ul>

<p>Organizations seeking to engage LMN8 as a Business Associate should contact privacy@lmn8.ai to initiate BAA execution prior to transmitting any PHI to our platform.</p>

<h2>14. Changes to This Policy</h2>

<p>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or the Services. When we make material changes, we will:</p>
<ul>
  <li>Post the updated Policy on our Website and App with a revised effective date</li>
  <li>Provide in-app or email notice to registered users at least 30 days before material changes take effect, where feasible</li>
  <li>For changes affecting the processing of PHI under an active BAA, notify the applicable Covered Entity as required under that BAA</li>
</ul>

<p>Your continued use of the Services after the effective date of an updated Policy constitutes your acceptance of the changes. If you do not agree with the updated Policy, you should discontinue use of the Services and may request deletion of your account and data.</p>

<h2>15. Governing Law and Dispute Resolution</h2>

<p>This Policy and any disputes relating to LMN8's privacy practices are governed by the laws of the State of Texas, without regard to conflict of law principles. For privacy disputes that cannot be resolved informally, you may contact us at privacy@lmn8.ai and we will attempt to resolve the matter within 30 days.</p>

<p>Nothing in this Section limits rights available to you under applicable federal law, including HIPAA or the FTC Act.</p>

<h2>16. Contact and Privacy Requests</h2>

<p>For any questions, concerns, or requests relating to this Privacy Policy or LMN8's privacy practices, contact our Privacy team:</p>

<table className="w-full text-sm border-collapse border border-white/10 max-w-md">
  <tbody>
    <tr><td className="p-2 border border-white/10 text-white/60 font-semibold">Privacy Email</td><td className="p-2 border border-white/10 text-cyan-400">privacy@lmn8.ai</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/60 font-semibold">Support Email</td><td className="p-2 border border-white/10 text-cyan-400">support@lmn8.ai</td></tr>
    <tr><td className="p-2 border border-white/10 text-white/60 font-semibold">Mailing Address</td><td className="p-2 border border-white/10 text-white/70">LMN8 LLC, Attn: Privacy<br/>18601 FM 1431, STE 104-4<br/>Jonestown, TX 78645</td></tr>
  </tbody>
</table>


<hr/>

<p>© 2026 LMN8 LLC | All Rights Reserved | LMN8 is a mental health integration platform.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
