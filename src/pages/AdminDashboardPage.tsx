import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, CheckCircle, XCircle, Eye, Shield } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import type { Profile } from '../types';

type Message = {
  id: string;
  created_at: string;
  sender_name: string;
  sender_email: string;
  message: string;
  is_read: boolean;
  event_type: string[];
  phone_number: string;
  city: string;
  state: string;
  zip: string;
  profile_id: string;
};

type FreeListingRequest = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string;
  state: string;
  instagram: string | null;
  facebook: string | null;
  youtube: string | null;
  tiktok: string | null;
  website: string | null;
  experience: string;
  paid_events: string;
  event_types: string | null;
  characters: string | null;
  bio: string;
  travel: string;
  why_join: string | null;
  questions: string | null;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  reviewed_by: string | null;
  notes: string | null;
};

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [freeListingRequests, setFreeListingRequests] = useState<FreeListingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<FreeListingRequest | null>(null);
  const [showMessageDetails, setShowMessageDetails] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [deletingRequestId, setDeletingRequestId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        navigate('/signin');
        return;
      }

      try {
        const { data: { role }, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (role !== 'admin') {
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            display_name,
            bio,
            state,
            city,
            price_min,
            price_max,
            facebook,
            instagram,
            tiktok,
            twitter,
            contact_email,
            is_active,
            payment_status,
            payment_expiry,
            profile_categories (category),
            profile_images (id, image_url, position)
          `)
          .order('created_at', { ascending: false });

        if (profileError) throw profileError;

        // Fetch messages
        const { data: messageData, error: messageError } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });

        if (messageError) throw messageError;

        // Fetch free listing requests
        const { data: requestData, error: requestError } = await supabase
          .from('free_listing_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (requestError) throw requestError;

        if (profileData) {
          const mappedProfiles: Profile[] = profileData.map(item => ({
            id: item.id,
            displayName: item.display_name,
            bio: item.bio,
            state: item.state,
            city: item.city,
            priceMin: item.price_min,
            priceMax: item.price_max,
            facebook: item.facebook,
            instagram: item.instagram,
            tiktok: item.tiktok,
            twitter: item.twitter,
            contactEmail: item.contact_email,
            isActive: item.is_active,
            paymentStatus: item.payment_status,
            paymentExpiry: item.payment_expiry,
            categories: item.profile_categories.map((c: any) => c.category),
            images: item.profile_images.map((img: any) => ({
              id: img.id,
              url: img.image_url,
              position: img.position,
            })),
          }));
          setProfiles(mappedProfiles);
        }

        if (messageData) {
          setMessages(messageData);
        }

        if (requestData) {
          setFreeListingRequests(requestData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prevMessages =>
        prevMessages.map(message =>
          message.id === messageId ? { ...message, is_read: true } : message
        )
      );

      toast.success('Marked as read');
    } catch (error: any) {
      console.error('Error marking message as read:', error);
      toast.error(error.message || 'Failed to mark as read');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      setDeletingMessageId(messageId);

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
        setShowMessageDetails(false);
      }

      toast.success('Message deleted successfully');
    } catch (error: any) {
      console.error('Error deleting message:', error);
      toast.error(error.message || 'Failed to delete message');
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      setDeletingRequestId(requestId);

      const { error } = await supabase
        .from('free_listing_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      setFreeListingRequests(prev => prev.filter(request => request.id !== requestId));
      
      if (selectedRequest?.id === requestId) {
        setSelectedRequest(null);
        setShowRequestDetails(false);
      }

      toast.success('Request deleted successfully');
    } catch (error: any) {
      console.error('Error deleting request:', error);
      toast.error(error.message || 'Failed to delete request');
    } finally {
      setDeletingRequestId(null);
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('free_listing_requests')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
          notes: notes || null,
        })
        .eq('id', requestId);

      if (error) throw error;

      setFreeListingRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? {
                ...request,
                status,
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id,
                notes: notes || null,
              }
            : request
        )
      );

      toast.success(`Request ${status}`);
    } catch (error: any) {
      console.error('Error updating request status:', error);
      toast.error(error.message || 'Failed to update request status');
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    if (!window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.filter(profile => profile.id !== profileId));
      toast.success('Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete profile');
    }
  };

  const handleToggleActive = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(profile =>
        profile.id === profileId
          ? { ...profile, isActive: !currentStatus }
          : profile
      ));

      toast.success(`Profile ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling profile status:', error);
      toast.error('Failed to update profile status');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage profiles, messages, and listing requests
            </p>
          </div>

          {/* Free Listing Requests Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Free Listing Requests</h2>
              <p className="mt-1 text-sm text-gray-500">
                Review and manage free listing applications
              </p>
            </div>

            {showRequestDetails && selectedRequest ? (
              <div className="p-6 space-y-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRequestDetails(false);
                    setSelectedRequest(null);
                  }}
                  className="mb-4"
                >
                  Back to List
                </Button>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact Info</h4>
                      <p className="text-gray-900">{selectedRequest.full_name}</p>
                      <p className="text-gray-600">{selectedRequest.email}</p>
                      {selectedRequest.phone && (
                        <p className="text-gray-600">{selectedRequest.phone}</p>
                      )}
                      <p className="text-gray-600">
                        {selectedRequest.city}, {selectedRequest.state}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Social Media</h4>
                      {selectedRequest.instagram && (
                        <p className="text-gray-600">Instagram: {selectedRequest.instagram}</p>
                      )}
                      {selectedRequest.facebook && (
                        <p className="text-gray-600">Facebook: {selectedRequest.facebook}</p>
                      )}
                      {selectedRequest.youtube && (
                        <p className="text-gray-600">YouTube: {selectedRequest.youtube}</p>
                      )}
                      {selectedRequest.tiktok && (
                        <p className="text-gray-600">TikTok: {selectedRequest.tiktok}</p>
                      )}
                      {selectedRequest.website && (
                        <p className="text-gray-600">Website: {selectedRequest.website}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                      <p className="text-gray-900">{selectedRequest.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Paid Events</h4>
                      <p className="text-gray-900">{selectedRequest.paid_events}</p>
                    </div>

                    {selectedRequest.event_types && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Event Types</h4>
                        <p className="text-gray-900">{selectedRequest.event_types}</p>
                      </div>
                    )}

                    {selectedRequest.characters && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Characters</h4>
                        <p className="text-gray-900">{selectedRequest.characters}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                      <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.bio}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Travel</h4>
                      <p className="text-gray-900">{selectedRequest.travel}</p>
                    </div>

                    {selectedRequest.why_join && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Why Join</h4>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.why_join}</p>
                      </div>
                    )}

                    {selectedRequest.questions && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Questions</h4>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRequest.questions}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'approved')}
                      className="flex items-center text-green-600 hover:text-green-700"
                      disabled={selectedRequest.status !== 'pending'}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'rejected')}
                      className="flex items-center text-red-600 hover:text-red-700"
                      disabled={selectedRequest.status !== 'pending'}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteRequest(selectedRequest.id)}
                    disabled={deletingRequestId === selectedRequest.id}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingRequestId === selectedRequest.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {freeListingRequests.map((request) => (
                      <tr
                        key={request.id}
                        className={`hover:bg-gray-50 ${
                          request.status === 'pending' ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {request.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {request.city}, {request.state}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : request.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowRequestDetails(true);
                              }}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateRequestStatus(request.id, 'approved')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateRequestStatus(request.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRequest(request.id)}
                              disabled={deletingRequestId === request.id}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Messages Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <p className="mt-1 text-sm text-gray-500">
                View and manage contact messages from users
              </p>
            </div>

            {showMessageDetails && selectedMessage ? (
              <div className="p-6 space-y-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowMessageDetails(false);
                    setSelectedMessage(null);
                  }}
                  className="mb-4"
                >
                  Back to List
                </Button>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">From</h4>
                      <p className="text-gray-900">{selectedMessage.sender_name}</p>
                      <p className="text-gray-600">{selectedMessage.sender_email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Contact Info</h4>
                      <p className="text-gray-900">{selectedMessage.phone_number}</p>
                      <p className="text-gray-600">
                        {selectedMessage.city}, {selectedMessage.state} {selectedMessage.zip}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Event Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMessage.event_type.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Message</h4>
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  {!selectedMessage.is_read && (
                    <Button
                      onClick={() => handleMarkAsRead(selectedMessage.id)}
                      className="flex items-center"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    disabled={deletingMessageId === selectedMessage.id}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deletingMessageId === selectedMessage.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        To Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {messages.map((message) => {
                      const profile = profiles.find(p => p.id === message.profile_id);
                      return (
                        <tr
                          key={message.id}
                          className={`hover:bg-gray-50 ${!message.is_read ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {message.sender_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {message.sender_email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {profile?.displayName || 'Unknown Profile'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                message.is_read
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {message.is_read ? 'Read' : 'Unread'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedMessage(message);
                                  setShowMessageDetails(true);
                                }}
                                className="text-purple-600 hover:text-purple-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!message.is_read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(message.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMessage(message.id)}
                                disabled={deletingMessageId === message.id}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Profiles Section */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Profiles</h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage performer profiles
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={profile.images[0]?.url || 'https://via.placeholder.com/40'}
                              alt=""
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {profile.displayName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {profile.contactEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {profile.city}, {profile.state}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {profile.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          profile.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : profile.paymentStatus === 'expired'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {profile.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {profile.categories.map((category) => (
                            <span
                              key={category}
                              className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/profile/${profile.id}`)}
                            title="View public profile"
                          >
                            <Eye className="h-4 w-4 text-purple-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(profile.id, profile.isActive)}
                            title={profile.isActive ? 'Deactivate profile' : 'Activate profile'}
                          >
                            {profile.isActive ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/dashboard/edit-profile/${profile.id}`)}
                            title="Edit profile"
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProfile(profile.id)}
                            title="Delete profile"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;