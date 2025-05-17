import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

interface Inquiry {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  event_type: string[];
  is_read: boolean;
}

interface Profile {
  inquiries?: Inquiry[];
}

interface DashboardPageProps {
  profile?: Profile;
}

const DashboardPage = ({ profile }: DashboardPageProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recent Inquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profile?.inquiries?.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/dashboard/inquiries/${inquiry.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(inquiry.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {inquiry.sender_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {inquiry.sender_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {inquiry.event_type.map((type) => (
                        <span key={type} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      inquiry.is_read
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {inquiry.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardPage;