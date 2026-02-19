import { Layout } from "@/components/Dashboard/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, X, Check, Pencil, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { userAPI } from "@/services/api";
import toast from "react-hot-toast";

interface PendingUser {
  _id: string;
  fullName: string;
  email: string;
  verified: boolean;
  role: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  verified: boolean;
  role: string;
  address: string;
  isGuest: boolean;
}

const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const getAvatarColor = (index: number) => {
  const colors = [
    "bg-emerald-100 text-emerald-700",
    "bg-stone-200 text-stone-700",
    "bg-green-100 text-green-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
  ];
  return colors[index % colors.length];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function CustomersPage() {
  const [unverifiedUsers, setUnverifiedUsers] = useState<PendingUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLTableCellElement | null>(null);
  const [roleFilter, setRoleFilter] = useState<
    "all" | "customer" | "staff" | "admin"
  >("all");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    password: "",
    address: "",
    contactNumber: "",
  });
  const [updating, setUpdating] = useState(false);

  const filteredUsers =
    roleFilter === "all"
      ? users.filter((user) => user.verified === true)
      : users.filter(
          (user) => user.role === roleFilter && user.verified === true
        );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roleMenuRef.current &&
        !roleMenuRef.current.contains(event.target as Node)
      ) {
        setRoleMenuOpen(false);
      }
    };

    if (roleMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [roleMenuOpen]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUnverifiedUsers();
  }, []);

  const fetchUnverifiedUsers = async () => {
    try {
      const data = await userAPI.getPendingUsers();
      setUnverifiedUsers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleAccept = async (_id: string) => {
    try {
      await userAPI.adminUserUpdate(_id, { verified: true });
      toast.success("User accepted successfully");
      fetchUnverifiedUsers();
      fetchUsers();
    } catch (error) {
      console.error("Error accepting user request:", error);
      toast.error("Failed to accept user request");
    }
  };

  const handleReject = async (_id: string) => {
    try {
      await userAPI.deleteCustomer(_id);
      toast.success("User rejected successfully");
      fetchUnverifiedUsers();
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting user request:", error);
      toast.error("Failed to reject user request");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this User?")) {
      return;
    }

    try {
      await userAPI.deleteCustomer(id);
      // Refresh the User list
      fetchUsers();
    } catch (error) {
      console.error("Error deleting User:", error);
      alert("Failed to delete User");
    }
  };

  return (
    <Layout title="Users">
      <div className="space-y-10">
        <section>
          {/* User Approvals */}
          <h2 className="text-lg font-serif font-semibold text-stone-800 mb-4">
            Pending Approvals
          </h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              {loadingPending ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : unverifiedUsers.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  No Pending Requests
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-stone-50">
                    <TableRow>
                      <TableHead className="font-medium text-stone-600 pl-6">
                        User
                      </TableHead>
                      <TableHead className="font-medium text-stone-600">
                        Email
                      </TableHead>
                      <TableHead className="font-medium text-stone-600">
                        Role
                      </TableHead>
                      <TableHead className="font-medium text-stone-600 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unverifiedUsers.map((unverifiedUser, index) => (
                      <TableRow
                        key={unverifiedUser._id}
                        className="hover:bg-stone-50/50"
                      >
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            {/* Avatar Circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(
                                index
                              )}`}
                            >
                              {getInitial(unverifiedUser.fullName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-stone-800">
                                {unverifiedUser.fullName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-600">
                          {unverifiedUser.email}
                        </TableCell>
                        <TableCell className="text-stone-500 text-sm">
                          {unverifiedUser.role}
                        </TableCell>
                        <TableCell className="text-right pr-6 space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-400 hover:text-green-600"
                            onClick={() => handleAccept(unverifiedUser._id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-400 hover:text-red-600"
                            onClick={() => handleReject(unverifiedUser._id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
        <div className="border-t border-stone-200" />
        <section>
          {/* User List */}
          <h2 className="text-lg font-serif font-semibold text-stone-800 mb-4">
            Users List
          </h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              {loadingUsers ? (
                <div className="p-8 text-center">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  No users found
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-stone-50">
                    <TableRow>
                      <TableHead className="font-medium text-stone-600 pl-6">
                        User
                      </TableHead>
                      <TableHead className="font-medium text-stone-600">
                        Email
                      </TableHead>
                      <TableHead
                        ref={roleMenuRef}
                        className="font-medium text-stone-600"
                      >
                        <button
                          onClick={() => setRoleMenuOpen((prev) => !prev)}
                          className="flex items-center gap-1 hover:text-stone-900"
                        >
                          Role
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {roleMenuOpen && (
                          <div className="absolute z-50 mt-2 w-44 rounded-lg border bg-white shadow-md p-2 space-y-2">
                            {["all", "admin", "staff", "customer"].map(
                              (role) => (
                                <button
                                  key={role}
                                  onClick={() => {
                                    setRoleFilter(role as any);
                                    setRoleMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 rounded-md border text-sm capitalize
                                  ${
                                    roleFilter === role
                                      ? "bg-stone-900 text-white border-stone-900"
                                      : "bg-white text-stone-700 hover:bg-stone-100 border-stone-200"
                                  }`}
                                >
                                  {role}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </TableHead>
                      <TableHead className="font-medium text-stone-600">
                        Joined
                      </TableHead>
                      <TableHead className="font-medium text-stone-600 text-right pr-6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user, index) => (
                      <TableRow key={user._id} className="hover:bg-stone-50/50">
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            {/* Avatar Circle */}
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${getAvatarColor(
                                index
                              )}`}
                            >
                              {getInitial(user.fullName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-stone-800">
                                {user.fullName}
                              </span>
                              {user.isGuest && (
                                <span className="text-xs text-stone-400">
                                  Guest
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-stone-600">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-stone-500 text-sm">
                          {user.role}
                        </TableCell>
                        <TableCell className="text-stone-600">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="text-right pr-6 space-x-1">
                          {user.role === "staff" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-stone-400 hover:text-stone-600"
                              onClick={() => {
                                setEditUser(user);
                                setEditForm({
                                  fullName: user.fullName,
                                  password: "",
                                  address: user.address || "",
                                  contactNumber:
                                    (user as any).contactNumber || "",
                                });
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-stone-400 hover:text-red-600"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  placeholder="Leave blank to keep current password"
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm({ ...editForm, address: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={editForm.contactNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, contactNumber: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md p-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditUser(null)}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  try {
                    setUpdating(true);

                    const payload: any = {
                      fullName: editForm.fullName,
                      address: editForm.address,
                      contactNumber: editForm.contactNumber,
                    };

                    // Only include password if the user typed something
                    if (editForm.password.trim() !== "") {
                      payload.password = editForm.password;
                    }

                    await userAPI.adminUserUpdate(editUser._id, payload);
                    toast.success("User updated successfully");
                    setEditUser(null);
                    fetchUsers();
                  } catch (err: any) {
                    console.error(err);
                    toast.error("Failed to update user");
                  } finally {
                    setUpdating(false);
                  }
                }}
                disabled={updating}
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
