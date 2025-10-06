import { EllipsisVertical } from 'lucide-react';
import dynamic from 'next/dynamic';

type Parcel = {
  id: string;
  name: string;
  etdDate: string;
  description: string;
  status: 'Completed' | 'Pending' | 'In Transit';
};

type ParcelTableProps = {
  title: string;
  parcels: Parcel[];
};

const ParcelTable = ({ title, parcels }: ParcelTableProps) => {
  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 className="text-lg font-medium" style={{ marginBottom: '1rem' }}>{title}</h2>
      <div className="w-full overflow-x-auto" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        <table className="w-full table-auto min-w-[600px]" style={{ borderCollapse: 'separate', borderSpacing: '0' }}>
          <thead>
            <tr className="text-left text-gray-500 text-xs border-b border-gray-200">
              <th className="pb-3 font-medium" style={{ padding: '0.5rem 0.75rem' }}>ID</th>
              <th className="pb-3 font-medium" style={{ padding: '0.5rem 0.75rem' }}>Name</th>
              <th className="pb-3 font-medium" style={{ padding: '0.5rem 0.75rem' }}>ETD Date</th>
              <th className="pb-3 font-medium" style={{ padding: '0.5rem 0.75rem' }}>Description</th>
              <th className="pb-3 font-medium" style={{ padding: '0.5rem 0.75rem' }}>Status</th>
              <th className="pb-3" style={{ padding: '0.5rem 0.75rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={`${parcel.id}-${index}`} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 text-sm" style={{ padding: '0.75rem' }}>{parcel.id}</td>
                <td className="py-3 text-sm" style={{ padding: '0.75rem' }}>{parcel.name}</td>
                <td className="py-3 text-sm" style={{ padding: '0.75rem' }}>{parcel.etdDate}</td>
                <td className="py-3 text-sm text-gray-500 max-w-[200px] truncate" style={{ padding: '0.75rem' }}>{parcel.description}</td>
                <td className="py-3 text-sm" style={{ padding: '0.75rem' }}>
                  <span
                    className={`px-2 py-1 rounded-sm text-xs text-white
                      ${parcel.status === 'Completed' ? 'bg-[#1dac68]' :
                        parcel.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="py-3 text-right" style={{ padding: '0.75rem' }}>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EllipsisVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(ParcelTable), { ssr: false });