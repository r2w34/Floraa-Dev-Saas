import { useState } from 'react';
import { classNames } from '~/utils/classNames';

interface PaymentGateway {
  id: string;
  name: string;
  status: string;
  configured: boolean;
  transactionFee: number;
  volume: number;
}

interface PaymentGatewaysProps {
  gateways: PaymentGateway[];
}

export function PaymentGateways({ gateways }: PaymentGatewaysProps) {
  const [expandedGateway, setExpandedGateway] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'disabled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getGatewayIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'stripe':
        return 'i-ph:credit-card-duotone';
      case 'paypal':
        return 'i-ph:paypal-logo-duotone';
      case 'razorpay':
        return 'i-ph:wallet-duotone';
      default:
        return 'i-ph:bank-duotone';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">Payment Gateways</h3>
      </div>

      <div className="divide-y divide-floraa-elements-borderColor">
        {gateways.map((gateway) => (
          <div key={gateway.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-floraa-elements-bg-depth-3 rounded-lg flex items-center justify-center">
                  <div className={`${getGatewayIcon(gateway.name)} text-lg text-floraa-elements-textSecondary`} />
                </div>
                <div>
                  <div className="font-medium text-floraa-elements-textPrimary">
                    {gateway.name}
                  </div>
                  <div className="text-sm text-floraa-elements-textSecondary">
                    {gateway.transactionFee}% fee • ${gateway.volume.toLocaleString()} volume
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(gateway.status)}`}>
                  {gateway.status}
                </span>
                <button
                  onClick={() => setExpandedGateway(
                    expandedGateway === gateway.id ? null : gateway.id
                  )}
                  className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors"
                >
                  <div className={classNames(
                    'i-ph:caret-down text-lg transition-transform',
                    expandedGateway === gateway.id ? 'rotate-180' : ''
                  )} />
                </button>
              </div>
            </div>

            {expandedGateway === gateway.id && (
              <div className="mt-4 pt-4 border-t border-floraa-elements-borderColor space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={gateway.configured ? '••••••••••••••••' : ''}
                      placeholder="Enter API key..."
                      className="w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
                      Webhook URL
                    </label>
                    <input
                      type="text"
                      value={`https://floraa.dev/webhooks/${gateway.id}`}
                      readOnly
                      className="w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-floraa-elements-textSecondary">
                    Gateway Status
                  </span>
                  <select
                    value={gateway.status}
                    className="px-3 py-1 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary text-sm focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button className="bg-accent-600 hover:bg-accent-700 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm">
                    Save Settings
                  </button>
                  <button className="text-accent-600 hover:text-accent-700 text-sm font-medium transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}