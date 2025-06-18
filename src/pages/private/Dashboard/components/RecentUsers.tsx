import { useState } from "react";

const RecentUsers = () => {
  const [users] = useState([
    {
      id: 1,
      name: "yash yadav",
      email: "-",
      phone: "-",
      loginType: "Email",
      avatar:
        "https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20young%20man%20with%20short%20dark%20hair%20and%20friendly%20smile%2C%20high%20quality%2C%20professional%20lighting%2C%20neutral%20background%2C%20realistic&width=80&height=80&seq=1&orientation=squarish",
    },
    {
      id: 2,
      name: "Nuage Laboratoire",
      email: "5aihmcv2i5y6qszhxsebi2vhe4-00@cloudtestlabaccounts.com",
      phone: "NA",
      loginType: "Google",
      avatar: null,
    },
    {
      id: 3,
      name: "TODAY 10 NEWS",
      email: "adityabhatele7@gmail.com",
      phone: "-",
      loginType: "Google",
      avatar: null,
    },
    {
      id: 4,
      name: "admin",
      email: "admin@propinfina.com",
      phone: "-",
      loginType: "-",
      avatar: null,
    },
    {
      id: 5,
      name: "akmalumr",
      email: "akmalumr56@gmail.com",
      phone: "NA",
      loginType: "Email",
      avatar: null,
    },
    {
      id: 6,
      name: "akram",
      email: "akram@gmail.com",
      phone: "NA",
      loginType: "Email",
      avatar: null,
    },
  ]);

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  return (
    <div className="flex items-start justify-center py-12">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest users who joined the platform
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/5"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6"
                >
                  Login Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.avatar}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            {getInitials(user.name)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className="fas fa-envelope text-gray-400 mr-2"></i>
                      <div className="text-sm text-gray-900 truncate max-w-xs">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.loginType === "Email" && (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 !rounded-button whitespace-nowrap">
                        Email
                      </span>
                    )}
                    {user.loginType === "Google" && (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 !rounded-button whitespace-nowrap">
                        Google
                      </span>
                    )}
                    {user.loginType === "-" && (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 !rounded-button whitespace-nowrap">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentUsers;
