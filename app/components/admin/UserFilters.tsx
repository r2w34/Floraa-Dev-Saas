import { Form, useSubmit } from '@remix-run/react';

interface UserFiltersProps {
  filters: {
    search: string;
    status: string;
    plan: string;
  };
}

export function UserFilters({ filters }: UserFiltersProps) {
  const submit = useSubmit();

  const handleFilterChange = (event: React.FormEvent<HTMLFormElement>) => {
    submit(event.currentTarget, { replace: true });
  };

  return (
    <div className="bg-floraa-elements-bg-depth-2 border border-floraa-elements-borderColor rounded-xl p-6">
      <Form method="get" onChange={handleFilterChange} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Search Users
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="i-ph:magnifying-glass text-floraa-elements-textSecondary" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                defaultValue={filters.search}
                placeholder="Search by name or email..."
                className="block w-full pl-10 pr-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary placeholder-floraa-elements-textTertiary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Status
            </label>
            <select
              name="status"
              id="status"
              defaultValue={filters.status}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Plan Filter */}
          <div>
            <label htmlFor="plan" className="block text-sm font-medium text-floraa-elements-textPrimary mb-2">
              Plan
            </label>
            <select
              name="plan"
              id="plan"
              defaultValue={filters.plan}
              className="block w-full px-3 py-2 border border-floraa-elements-borderColor rounded-lg bg-floraa-elements-bg-depth-1 text-floraa-elements-textPrimary focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={() => {
                const form = document.querySelector('form') as HTMLFormElement;
                form.reset();
                submit(form, { replace: true });
              }}
              className="border border-floraa-elements-borderColor hover:bg-floraa-elements-bg-depth-3 text-floraa-elements-textSecondary px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
}