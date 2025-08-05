import { classNames } from '~/utils/classNames';

interface Model {
  id: string;
  name: string;
  provider: string;
  status: string;
  inputCost: number;
  outputCost: number;
  contextLength: number;
  usage: number;
  revenue: number;
  lastUsed: string;
}

interface ModelTableProps {
  models: Model[];
}

export function ModelTable({ models }: ModelTableProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'maintenance':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'disabled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return 'i-ph:robot-duotone';
      case 'anthropic':
        return 'i-ph:brain-duotone';
      case 'google':
        return 'i-ph:google-logo-duotone';
      default:
        return 'i-ph:cpu-duotone';
    }
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-floraa-elements-borderColor">
        <h3 className="text-lg font-semibold text-floraa-elements-textPrimary">AI Models</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-floraa-elements-borderColor">
          <thead className="bg-floraa-elements-bg-depth-1">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Pricing
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-floraa-elements-textSecondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-floraa-elements-borderColor">
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-floraa-elements-bg-depth-1 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-floraa-elements-bg-depth-3 rounded-lg flex items-center justify-center">
                      <div className={`${getProviderIcon(model.provider)} text-lg text-floraa-elements-textSecondary`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-floraa-elements-textPrimary">
                        {model.name}
                      </div>
                      <div className="text-sm text-floraa-elements-textSecondary">
                        {model.provider} • {model.contextLength.toLocaleString()} tokens
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(model.status)}>
                    {model.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  <div>
                    <div>In: ${model.inputCost}/1K</div>
                    <div>Out: ${model.outputCost}/1K</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  {model.usage.toLocaleString()} calls
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-floraa-elements-textPrimary">
                  ${model.revenue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-accent-600 hover:text-accent-700 transition-colors">
                      Edit
                    </button>
                    <button className="text-floraa-elements-textSecondary hover:text-floraa-elements-textPrimary transition-colors">
                      <div className="i-ph:dots-three-vertical text-lg" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}