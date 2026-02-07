import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Crown, Check } from 'lucide-react';

export default function SettingsPage() {
  const { profile } = useAuth();

  const plans = [
    {
      tier: 'free',
      name: 'Free',
      price: '$0',
      features: [
        '10,000 characters/month',
        '2 minutes of audio',
        '5 projects',
        'Basic voices',
      ],
    },
    {
      tier: 'pro',
      name: 'Pro',
      price: '$29',
      features: [
        '500,000 characters/month',
        '60 minutes of audio',
        'Unlimited projects',
        'Premium voices',
        'Advanced features',
        'Priority support',
      ],
      highlighted: true,
    },
    {
      tier: 'team',
      name: 'Team',
      price: 'Custom',
      features: [
        'Unlimited characters',
        'Unlimited audio',
        'Unlimited projects',
        'All voices & features',
        'Team management',
        'Dedicated support',
      ],
    },
  ];

  const currentTier = profile?.subscription_tier || 'free';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your subscription and preferences</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.tier}
              className={`rounded-lg border-2 p-8 transition ${
                plan.tier === currentTier
                  ? 'border-blue-500 bg-slate-900/50'
                  : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
              } ${plan.highlighted ? 'md:scale-105' : ''}`}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold text-white">
                  {plan.price}
                  {plan.tier !== 'team' && <span className="text-lg text-slate-400">/month</span>}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.tier === currentTier ? (
                <button
                  disabled
                  className="w-full py-2 px-4 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                  Upgrade
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Crown className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-white mb-1">Need more?</h3>
            <p className="text-slate-300 text-sm">
              Contact our sales team for enterprise pricing and custom solutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
