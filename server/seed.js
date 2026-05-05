/**
 * Seed Script — Populates the database with initial data
 * Run: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Case = require('./models/Case');

const seedData = async () => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany();
  await Blog.deleteMany();
  await Testimonial.deleteMany();
  await Case.deleteMany();

  // Create admin user
  await User.create({
    name: 'Admin',
    email: process.env.ADMIN_EMAIL || 'admin@bhatilawassociates.com',
    password: process.env.ADMIN_PASSWORD || '1234',
    role: 'admin'
  });
  console.log('✅ Admin user created');

  // Seed testimonials
  await Testimonial.insertMany([
    {
      name: 'Rajesh Patel',
      role: 'Business Owner',
      content: 'BHATI LAW ASSOCIATES handled my corporate dispute with outstanding professionalism. The case was resolved in our favour within 3 months. Highly recommended for any business legal matters in Indore.',
      rating: 5,
      caseType: 'corporate',
      order: 1
    },
    {
      name: 'Sunita Verma',
      role: 'Client - Debt Recovery',
      content: 'I had been struggling with recovering a large outstanding amount for over a year. The team at BHATI LAW ASSOCIATES filed a recovery suit and got the matter resolved efficiently. Excellent SARFAESI work.',
      rating: 5,
      caseType: 'debt',
      order: 2
    },
    {
      name: 'Amit Kumar',
      role: 'Client - Criminal Defense',
      content: 'I was wrongly accused in a fraud case. BHATI LAW ASSOCIATES secured my bail within 48 hours and eventually got me acquitted. Their criminal defense expertise is unmatched in Indore.',
      rating: 5,
      caseType: 'criminal',
      order: 3
    },
    {
      name: 'Priya Sharma',
      role: 'Property Dispute Client',
      content: 'Had a complex property dispute that lasted years before I approached BHATI LAW ASSOCIATES. They resolved it in just 6 months with a favourable verdict. Excellent work by Adv. Ajit Singh Bhati.',
      rating: 5,
      caseType: 'property',
      order: 4
    },
    {
      name: 'Vikram Singh',
      role: 'Startup Founder',
      content: 'The team provided exceptional corporate advisory for our startup — from incorporation to investor agreements. Their understanding of business law is remarkable.',
      rating: 4,
      caseType: 'corporate',
      order: 5
    },
    {
      name: 'Deepa Nair',
      role: 'Client - Civil Litigation',
      content: 'Professional, punctual and dedicated. The team personally argued my civil case in the High Court and won. Could not have asked for better legal representation.',
      rating: 5,
      caseType: 'civil',
      order: 6
    }
  ]);
  console.log('✅ Testimonials seeded');

  // Seed case results
  await Case.insertMany([
    {
      title: 'Bail Granted in 48 Hours — Wrongful Fraud Accusation',
      description: 'Client was falsely implicated in a commercial fraud case with multiple co-accused. We prepared a comprehensive bail application highlighting the lack of direct evidence and client\'s clean background.',
      caseType: 'criminal',
      result: 'Bail granted by Sessions Court within 48 hours. Client later acquitted of all charges.',
      resultBadge: 'acquitted',
      timeline: '48 hours (bail) / 8 months (acquittal)',
      court: 'Sessions Court, Indore',
      year: 2024,
      order: 1
    },
    {
      title: 'Debt Recovery — ₹1.5 Cr Outstanding Loan Recovered',
      description: 'Financial institution sought recovery of ₹1.5 Cr in outstanding secured loans. Borrower had defaulted for over 18 months and was evading legal notices.',
      caseType: 'debt',
      result: 'Full recovery achieved through SARFAESI proceedings including symbolic and physical possession.',
      resultBadge: 'won',
      timeline: '4 months',
      court: 'DRT, Indore',
      year: 2024,
      order: 2
    },
    {
      title: 'Property Dispute Resolved — Ancestral Land Partition',
      description: 'Multi-party property inheritance dispute involving ancestral land. Case involved competing claims from siblings and forged documentation allegations.',
      caseType: 'property',
      result: 'Favourable partition decree securing client\'s rightful share of the property.',
      resultBadge: 'won',
      timeline: '6 months',
      court: 'District Court, Indore',
      year: 2024,
      order: 3
    },
    {
      title: 'Corporate Fraud Dismissed — Director Exonerated',
      description: 'Company director accused of financial mismanagement and embezzlement by minority shareholders. Faced potential criminal prosecution under Companies Act.',
      caseType: 'corporate',
      result: 'All charges dismissed. NCLT ruled in favour of the director with costs awarded.',
      resultBadge: 'dismissed',
      timeline: '10 months',
      court: 'NCLT, Indore Bench',
      year: 2024,
      order: 4
    },
    {
      title: 'Cheque Bounce Recovery — ₹45 Lakh Recovered Under NI Act',
      description: 'Client issued multiple cheques that bounced. Filed complaint under Section 138 of Negotiable Instruments Act for recovery of ₹45 lakh.',
      caseType: 'debt',
      result: 'Full amount of ₹45 lakh recovered through successful prosecution and settlement.',
      resultBadge: 'won',
      timeline: '3 months',
      court: 'Magistrate Court, Indore',
      year: 2023,
      order: 5
    },
    {
      title: 'Civil Injunction Granted — Commercial Property Protected',
      description: 'Client\'s commercial property was being illegally encroached upon. Urgent injunction application filed to prevent further damage and encroachment.',
      caseType: 'civil',
      result: 'Injunction granted preventing encroachment. Subsequently won the title suit with possession restored.',
      resultBadge: 'won',
      timeline: '5 months',
      court: 'Civil Court, Indore',
      year: 2024,
      order: 6
    }
  ]);
  console.log('✅ Case results seeded');

  // Seed blog posts (using create() to trigger pre-save hook for slug)
  const blogPosts = [
    {
      title: 'What to Do After an FIR is Filed Against You in India',
      excerpt: 'Getting named in an FIR can be alarming. Here is a step-by-step guide on your legal rights and the immediate actions you should take.',
      content: `<h2>Understanding FIR in Indian Law</h2>
<p>A First Information Report (FIR) is the first step in the criminal justice process. It is a document prepared by the police when they receive information about a cognizable offence. Being named in an FIR does not mean you are guilty — it is merely the beginning of an investigation.</p>

<h2>Your Immediate Rights</h2>
<ul>
<li><strong>Right to legal representation:</strong> You have the right to consult a lawyer immediately.</li>
<li><strong>Right against self-incrimination:</strong> Under Article 20(3) of the Constitution, you cannot be compelled to be a witness against yourself.</li>
<li><strong>Right to bail:</strong> In most cases, you have the right to apply for bail.</li>
</ul>

<h2>Steps to Take Immediately</h2>
<ol>
<li>Do not panic — an FIR is not a conviction</li>
<li>Contact a criminal lawyer immediately</li>
<li>Do not give any statement to the police without your lawyer</li>
<li>Obtain a copy of the FIR from the police station</li>
<li>Discuss anticipatory bail options with your lawyer</li>
<li>Preserve all evidence that supports your innocence</li>
</ol>

<h2>When to Apply for Anticipatory Bail</h2>
<p>If you have knowledge that an FIR may be filed or has been filed against you, your lawyer can file for anticipatory bail under Section 438 of CrPC (now Section 482 of BNSS). This protects you from arrest while the investigation is ongoing.</p>

<h2>Conclusion</h2>
<p>An FIR, while serious, is not the end of the road. With proper legal counsel and timely action, you can protect your rights effectively. Contact BHATI LAW ASSOCIATES immediately if you need urgent legal assistance.</p>`,
      category: 'legal-advice',
      tags: ['FIR', 'criminal law', 'bail', 'legal rights', 'India'],
      isPublished: true,
      publishedAt: new Date('2024-12-15'),
      metaTitle: 'What to Do After FIR Filed Against You in India | Legal Guide 2024',
      metaDescription: 'Complete legal guide on your rights, immediate steps, and bail options when an FIR is filed against you in India. Expert advice from criminal lawyers.'
    },
    {
      title: 'How Bail Works in India: A Complete Legal Guide',
      excerpt: 'Understand the types of bail, the application process, conditions, and your rights when seeking bail in Indian courts.',
      content: `<h2>Types of Bail in India</h2>
<p>Indian law recognises several types of bail:</p>
<ul>
<li><strong>Regular Bail:</strong> Granted by a court after arrest under Sections 437 and 439 of CrPC.</li>
<li><strong>Anticipatory Bail:</strong> Granted before arrest under Section 438 of CrPC to prevent arrest.</li>
<li><strong>Interim Bail:</strong> Temporary bail granted for a short period pending the hearing of regular or anticipatory bail.</li>
<li><strong>Default Bail:</strong> Available when the police fail to file a chargesheet within the stipulated time.</li>
</ul>

<h2>The Bail Application Process</h2>
<ol>
<li>Filing of bail application with supporting documents</li>
<li>Hearing before the appropriate court</li>
<li>Arguments by both prosecution and defence</li>
<li>Court considers factors: severity, evidence, flight risk</li>
<li>Grant or rejection with reasons</li>
</ol>

<h2>Factors Courts Consider</h2>
<p>Courts evaluate multiple factors including the nature and gravity of the offence, the character of the evidence, circumstances peculiar to the accused, likelihood of the accused fleeing justice, and the potential of the accused to tamper with evidence or influence witnesses.</p>

<h2>Your Rights During Bail</h2>
<p>Even after bail is granted, certain conditions typically apply. Understanding these conditions is crucial to avoid cancellation of your bail.</p>`,
      category: 'legal-advice',
      tags: ['bail', 'criminal law', 'anticipatory bail', 'legal process'],
      isPublished: true,
      publishedAt: new Date('2024-11-20'),
      metaTitle: 'How Bail Works in India: Types, Process & Legal Guide 2024',
      metaDescription: 'Complete guide on how bail works in India — regular bail, anticipatory bail, interim bail. Learn the process, your rights, and what courts consider.'
    },
    {
      title: 'Understanding Debt Recovery Under SARFAESI Act',
      excerpt: 'A comprehensive guide to the SARFAESI Act and how financial institutions can recover secured debts through legal mechanisms.',
      content: `<h2>What is the SARFAESI Act?</h2>
<p>The Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act, 2002 (SARFAESI) empowers banks and financial institutions to recover non-performing assets (NPAs) without court intervention.</p>

<h2>Key Provisions</h2>
<ul>
<li>Section 13(2) — Demand Notice to defaulting borrower</li>
<li>Section 13(4) — Measures for asset recovery</li>
<li>Symbolic possession followed by physical possession</li>
<li>Sale of secured assets through auction</li>
</ul>

<h2>The Recovery Process</h2>
<ol>
<li>Classification of account as NPA</li>
<li>Issuance of demand notice under Section 13(2)</li>
<li>60-day waiting period for borrower response</li>
<li>Symbolic possession of secured assets</li>
<li>Physical possession with magistrate assistance</li>
<li>Publication of sale notice and auction</li>
</ol>

<h2>Borrower's Rights</h2>
<p>Borrowers can challenge SARFAESI proceedings before the DRT within 45 days. They also have the right to settle dues and redeem their property before the sale is confirmed.</p>

<h2>How BHATI LAW ASSOCIATES Can Help</h2>
<p>We handle all SARFAESI-related work including possession proceedings, DRT representation, and auction facilitation for banks and financial institutions.</p>`,
      category: 'guides',
      tags: ['SARFAESI', 'debt recovery', 'NPA', 'banking law', 'DRT'],
      isPublished: true,
      publishedAt: new Date('2024-10-10'),
      metaTitle: 'Understanding Debt Recovery Under SARFAESI Act | Complete Guide',
      metaDescription: 'Comprehensive guide to the SARFAESI Act — debt recovery process, borrower rights, possession proceedings, and DRT representation for banks and NBFCs.'
    },
    {
      title: 'Cheque Bounce Cases Under Section 138 NI Act',
      excerpt: 'Everything you need to know about cheque bounce cases — legal process, penalties, and how to file or defend a complaint under the NI Act.',
      content: `<h2>What Constitutes a Cheque Bounce Offence?</h2>
<p>Under Section 138 of the Negotiable Instruments Act, 1881, dishonour of a cheque due to insufficient funds or exceeding the arranged amount is a criminal offence punishable with imprisonment up to 2 years and/or fine up to twice the cheque amount.</p>

<h2>Steps to File a Cheque Bounce Case</h2>
<ol>
<li>Present the cheque for encashment within its validity</li>
<li>Receive the cheque return memo from the bank</li>
<li>Send a legal demand notice within 30 days of dishonour</li>
<li>Wait 15 days for the drawee to make payment</li>
<li>File criminal complaint within 30 days of expiry of notice period</li>
</ol>

<h2>Important Time Limits</h2>
<p>Strict compliance with the timelines under Section 138 is essential. Missing any deadline can render the complaint non-maintainable.</p>

<h2>Defence Strategies</h2>
<p>If you are accused in a cheque bounce case, possible defences include proving the cheque was not issued for a legally enforceable debt, challenging the demand notice, or proving the complaint was filed beyond limitation.</p>`,
      category: 'legal-advice',
      tags: ['cheque bounce', 'NI Act', 'Section 138', 'debt recovery'],
      isPublished: true,
      publishedAt: new Date('2024-09-05'),
      metaTitle: 'Cheque Bounce Cases Under Section 138 NI Act | Legal Guide',
      metaDescription: 'Complete legal guide on cheque bounce cases under Section 138 NI Act — filing process, penalties, defences, and time limits explained by expert lawyers.'
    },
    {
      title: 'Insolvency & Bankruptcy Code (IBC): What Businesses Need to Know',
      excerpt: 'An overview of the IBC framework, CIRP process, and what creditors and debtors need to understand about insolvency proceedings in India.',
      content: `<h2>Overview of IBC</h2>
<p>The Insolvency and Bankruptcy Code, 2016 provides a time-bound process for resolving insolvency of companies, partnership firms, and individuals. It consolidates multiple laws dealing with insolvency and bankruptcy.</p>

<h2>Corporate Insolvency Resolution Process (CIRP)</h2>
<ul>
<li>Application filed by financial creditor, operational creditor, or corporate debtor</li>
<li>NCLT admits application and appoints Interim Resolution Professional (IRP)</li>
<li>Moratorium declared — no suits or proceedings against the debtor</li>
<li>Committee of Creditors (CoC) formed</li>
<li>Resolution plan submitted and approved within 180 days (extendable to 330 days)</li>
</ul>

<h2>Rights of Different Stakeholders</h2>
<p>Financial creditors have voting rights in the CoC, operational creditors can file claims but don't have voting rights, and the corporate debtor's management is replaced during CIRP.</p>

<h2>Liquidation Process</h2>
<p>If no resolution plan is approved within the timeline, the company goes into liquidation. The waterfall mechanism under Section 53 determines the order of priority for distribution of assets.</p>`,
      category: 'news',
      tags: ['IBC', 'insolvency', 'bankruptcy', 'NCLT', 'CIRP'],
      isPublished: true,
      publishedAt: new Date('2024-08-20'),
      metaTitle: 'Insolvency & Bankruptcy Code (IBC) Explained | Business Guide 2024',
      metaDescription: 'Complete overview of the IBC framework in India — CIRP process, stakeholder rights, liquidation, and what businesses need to know about insolvency proceedings.'
    },
    {
      title: 'Starting a Business in India: Legal Checklist for Entrepreneurs',
      excerpt: 'A comprehensive legal checklist for entrepreneurs looking to start a business in India — from registration to compliance.',
      content: `<h2>Business Structure Options</h2>
<ul>
<li>Sole Proprietorship</li>
<li>Partnership Firm</li>
<li>Limited Liability Partnership (LLP)</li>
<li>Private Limited Company</li>
<li>One Person Company (OPC)</li>
</ul>

<h2>Registration & Compliance</h2>
<ol>
<li>Register your business entity (MCA/ROC)</li>
<li>Obtain PAN and TAN</li>
<li>Register for GST (if applicable)</li>
<li>Open a business bank account</li>
<li>Obtain necessary licences and permits</li>
<li>Register for employee benefits (EPF, ESI)</li>
</ol>

<h2>Contracts & Agreements</h2>
<p>Essential legal documents include: Founders Agreement, Employment Contracts, Non-Disclosure Agreements, Terms of Service, and Privacy Policy.</p>

<h2>Intellectual Property Protection</h2>
<p>Protect your business assets through trademark registration, copyright, and patent filing where applicable.</p>`,
      category: 'guides',
      tags: ['business law', 'startup', 'company registration', 'compliance', 'India'],
      isPublished: true,
      publishedAt: new Date('2024-07-15'),
      metaTitle: 'Starting a Business in India: Complete Legal Checklist 2024',
      metaDescription: 'Legal checklist for starting a business in India — registration, compliance, licences, contracts, and IP protection. Expert guide for entrepreneurs.'
    }
  ];
  for (const post of blogPosts) {
    await Blog.create(post);
  }
  console.log('✅ Blog posts seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log(`📧 Admin Login: ${process.env.ADMIN_EMAIL || 'admin@bhatilawassociates.com'}`);
  console.log(`🔑 Admin Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);

  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
