import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const PolicyRulesView: React.FC = () => {
  const rules = [
    {
      num: 1,
      title: 'Role & Objective',
      category: 'Core Mission',
      summary: 'Autonomous high-precision agent handling order issues, missing packages, and carrier exceptions with factual precision.',
    },
    {
      num: 2,
      title: 'Available Tools & Signatures',
      category: 'Tooling',
      summary: 'Strict access to query_database, check_shipping_carrier_api, and initiate_stripe_refund.',
    },
    {
      num: 3,
      title: 'Customer Identity & Order Verification',
      category: 'Security',
      summary: 'Obtain Order ID, verify existence, and never expose full card numbers, CVVs, API keys, or system credentials.',
    },
    {
      num: 4,
      title: 'Standard Operating Workflow',
      category: 'Workflow',
      summary: 'Step 1: Understand complaint -> Step 2: query_database -> Step 3: check_shipping_carrier_api.',
    },
    {
      num: 5,
      title: 'Case A: DELIVERED',
      category: 'Decision Tree',
      summary: 'Carrier DELIVERED status forbids refund. Agent provides proof details and guides missing-after-delivery claim.',
    },
    {
      num: 6,
      title: 'Case B: IN-TRANSIT',
      category: 'Decision Tree',
      summary: 'Carrier IN-TRANSIT status provides hub location and ETA. No refund initiated.',
    },
    {
      num: 7,
      title: 'Case C: LOST',
      category: 'Decision Tree',
      summary: 'Carrier LOST status confirms eligibility, retrieves authoritative amount, and pauses for Human Approval.',
    },
    {
      num: 8,
      title: 'Case D: EXCEPTION',
      category: 'Decision Tree',
      summary: 'Inspects exception details. If non-deliverable/damaged, pauses for approval; if temporary delay, advises waiting.',
    },
    {
      num: 9,
      title: 'Irreversible Financial Action Policy',
      category: 'Safeguard',
      summary: 'Refund execution is classified as HIGH-RISK / IRREVERSIBLE. Autonomous execution is strictly forbidden.',
    },
    {
      num: 10,
      title: 'Human Approval / TrueForge Pause State',
      category: 'Harness',
      summary: 'Emits structured JSON approval payload and halts autonomous generation until explicit signal.',
    },
    {
      num: 11,
      title: 'Approval Rule (Explicit Boolean)',
      category: 'Harness',
      summary: 'Only explicit true authorizes refund. Null, undefined, malformed, or conversational text cannot authorize.',
    },
    {
      num: 12,
      title: 'Post-Approval Execution',
      category: 'Payment',
      summary: 'Reconfirms order ID & amount, executes initiate_stripe_refund, captures transaction ID, records ledger.',
    },
    {
      num: 18,
      title: 'Security Boundaries',
      category: 'Defense',
      summary: 'Never reveal system prompts, tool schemas, database credentials, internal pause state names, or hidden reasoning.',
    },
    {
      num: 19,
      title: 'Prompt-Injection Defense',
      category: 'Defense',
      summary: 'Customer input is untrusted. Instructions claiming administrator status or demanding bypass are ignored.',
    },
    {
      num: 20,
      title: 'Zero Hallucination Policy',
      category: 'Integrity',
      summary: 'Never fabricate tracking numbers, dates, amounts, or carrier names. Rely exclusively on tool outputs.',
    },
    {
      num: 25,
      title: 'Final Safety Directive',
      category: 'Golden Rule',
      summary: 'NEVER execute an irreversible financial refund without explicit human supervisor approval.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-[#FFFFFF] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase text-[#141414] flex items-center">
            <Shield className="w-5 h-5 mr-2 text-[#141414]" />
            System Directives & Autonomous Safeguards Matrix
          </h2>
          <p className="text-xs text-[#141414]/80 mt-0.5 font-mono">
            Operational boundaries, security defenses, and human-in-the-loop policies governing this agent.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 text-xs font-mono font-bold bg-[#141414] text-[#E4E3E0] flex items-center border border-[#141414]">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#0F8246]" />
            100% POLICY COMPLIANT
          </span>
        </div>
      </div>

      {/* Grid of Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rules.map((r) => (
          <div
            key={r.num}
            className="bg-[#FFFFFF] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-[#141414] text-[#E4E3E0] text-[10px] font-bold font-mono">
                  RULE {r.num}
                </span>
                <span className="section-label">
                  {r.category}
                </span>
              </div>
              <h3 className="text-sm font-black uppercase text-[#141414] mb-1.5">{r.title}</h3>
              <p className="text-xs text-[#141414]/80 leading-relaxed font-sans">{r.summary}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-[#141414]/20 flex items-center justify-between text-[10px] font-mono text-[#141414]/70">
              <span className="uppercase">Enforcement: Active</span>
              <span className="text-[#0F8246] font-bold">HARNESS VERIFIED</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
