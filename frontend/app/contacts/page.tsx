"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CreateContactModal from "@/components/CreateContactModal";
import { Phone, Download, Upload, Plus, Search, Tag, Trash2, FileDown, ChevronRight, X, Mail, Calendar, MapPin } from "lucide-react";
import Link from "next/link";

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  tags: string[];
  status: string;
  avatar: string;
  createdAt: string;
}

export default function Contacts() {
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContactForDetails, setSelectedContactForDetails] = useState<Contact | null>(null);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContactForDetails(contact);
    setShowContactDetails(true);
  };

  useEffect(() => {
    fetchContacts();
    fetchTags();
  }, []);
  
  // Refetch when filters change
  useEffect(() => {
    if (!loading) {
      fetchContacts();
    }
  }, [searchQuery, statusFilter, tagFilter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      console.log("Fetching contacts with token:", token ? "Token exists" : "No token (DEBUG mode)");
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(
        "http://localhost:8000/users?login_user=default_user",
        { headers }
      );

      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched contacts:", data.length, "contacts");
        
        // Transform data to match interface
        const transformedContacts = data.map((contact: any) => ({
          id: contact.id || contact._id || String(Math.random()),
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          tags: contact.tags || [],
          status: contact.status || "Active",
          avatar: contact.avatar || contact.name?.substring(0, 2).toUpperCase() || "??",
          createdAt: contact.createdAt || contact.created_at || new Date().toISOString(),
        }));
        
        // Apply filters
        let filtered = transformedContacts;
        
        if (searchQuery) {
          filtered = filtered.filter((c: Contact) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery) ||
            c.email?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        if (statusFilter !== "all") {
          filtered = filtered.filter((c: Contact) => c.status === statusFilter);
        }
        
        if (tagFilter !== "all") {
          filtered = filtered.filter((c: Contact) => c.tags.includes(tagFilter));
        }
        
        console.log("Setting contacts:", filtered.length, "after filters");
        setContacts(filtered);
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch contacts:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:8000/tags", {
        headers: { Authorization: "Bearer " + token },
      });
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedContacts(checked ? contacts.map(c => c.id) : []);
  };

  const handleSelectContact = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    }
  };

  const getTagColor = (index: number) => {
    const colors = [
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    ];
    return colors[index % colors.length];
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "blocked":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Contacts" subtitle="Manage and organize your contacts" />
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold dark:text-white">Contacts</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>
            <CreateContactModal 
              isOpen={isModalOpen} 
              onClose={() => { setIsModalOpen(false); fetchContacts(); }} 
            />
          </div>

          <div className="flex gap-6">
            {/* Main Contacts Table */}
            <div className={`${showContactDetails ? 'flex-1' : 'w-full'} transition-all duration-300`}>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    >
                      <option value="all">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                    <select 
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg"
                    >
                      <option value="all">All Tags</option>
                      {availableTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input 
                            type="checkbox" 
                            className="rounded"
                            checked={selectedContacts.length === contacts.length && contacts.length > 0}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tags</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
                      ) : contacts.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No contacts found</td></tr>
                      ) : (
                        contacts.map((contact) => (
                          <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4">
                              <input 
                                type="checkbox" 
                                className="rounded"
                                checked={selectedContacts.includes(contact.id)}
                                onChange={(e) => handleSelectContact(contact.id, e.target.checked)}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                                  {contact.avatar}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                                  {contact.email && <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="w-4 h-4" />
                                {contact.phone}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-1 flex-wrap">
                                {contact.tags.slice(0, 2).map((tag, i) => (
                                  <span key={tag} className={"text-xs px-2 py-1 rounded-full " + getTagColor(i)}>{tag}</span>
                                ))}
                                {contact.tags.length > 2 && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                    +{contact.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={"text-xs px-2 py-1 rounded-full " + getStatusColor(contact.status)}>{contact.status}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleContactClick(contact)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                title="View details"
                              >
                                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Showing {contacts.length} contacts
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Details Panel */}
            {showContactDetails && selectedContactForDetails && (
              <div className="w-96 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold dark:text-white">Contact Details</h3>
                  <button
                    onClick={() => setShowContactDetails(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-3">
                    {selectedContactForDetails.avatar}
                  </div>
                  <h4 className="font-semibold text-lg dark:text-white">{selectedContactForDetails.name}</h4>
                  <span className={"text-xs px-2 py-1 rounded-full " + getStatusColor(selectedContactForDetails.status)}>
                    {selectedContactForDetails.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="font-medium dark:text-white">{selectedContactForDetails.phone}</p>
                    </div>
                  </div>

                  {selectedContactForDetails.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium dark:text-white">{selectedContactForDetails.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Created</p>
                      <p className="font-medium dark:text-white">
                        {new Date(selectedContactForDetails.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedContactForDetails.tags.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedContactForDetails.tags.map((tag, i) => (
                          <span key={tag} className={"text-xs px-2 py-1 rounded-full " + getTagColor(i)}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <Link
                      href={`/chat?contact=${selectedContactForDetails.phone}`}
                      className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-center text-sm font-medium"
                    >
                      Send Message
                    </Link>
                    <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium dark:text-white">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
