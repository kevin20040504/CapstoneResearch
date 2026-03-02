import React from 'react';
import { FiInbox, FiUsers, FiBarChart2, FiCheck } from 'react-icons/fi';

const StaffReportsPage = () => {
  return (
    <>
      <section className="mb-6">
        <h2 className="m-0 text-2xl font-bold text-gray-800">Reports</h2>
      </section>
      <section className="bg-white rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)] border border-gray-100 p-6">
        <h3 className="mt-0 mb-4 text-lg font-semibold text-gray-800">Reports (Read-only)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FiInbox, title: 'Total Requests', value: '24', sub: 'This month' },
            { icon: FiBarChart2, title: 'Avg. Processing Time', value: '2.5 days', sub: 'From request to release' },
            { icon: FiUsers, title: 'Active Students', value: '982', sub: 'Current enrollment' },
            { icon: FiCheck, title: 'Approval Rate', value: '95%', sub: 'Successful approvals' },
          ].map(({ icon: Icon, title, value, sub }) => (
            <div key={title} className="p-5 rounded-xl bg-gray-50 border-l-4 border-tmcc text-center">
              <Icon className="w-7 h-7 mx-auto mb-2 text-tmcc" />
              <h4 className="m-0 mb-2 text-sm text-gray-500 font-medium">{title}</h4>
              <p className="m-0 text-2xl font-bold text-gray-800">{value}</p>
              <small className="block mt-1 text-gray-400 text-xs">{sub}</small>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default StaffReportsPage;
