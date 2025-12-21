'use client';

import { useState, useEffect } from 'react';

export default function TestSimulator() {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await fetch('http://localhost:8000/users?login_user=default_user', {
        headers: {
          'Authorization': 'Bearer debug_token'
        }
      });
      const data = await response.json();
      setContacts(Array.isArray(data) ? data : data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const fetchMessages = async (phone: string) => {
    if (!phone) return;
    try {
      const response = await fetch(`http://localhost:8000/chats/${encodeURIComponent(phone)}`, {
        headers: {
          'Authorization': 'Bearer debug_token'
        }
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendTestMessage = async () => {
    setLoading(true);
    try {
      const testPhone = '+1555' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const response = await fetch('http://localhost:9001/simulate/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: testPhone,
          message: `Test message from simulator at ${new Date().toLocaleTimeString()}`
        })
      });
      
      if (response.ok) {
        await fetchContacts();
        alert(`Message sent to ${testPhone}! Check the contacts list.`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedPhone) {
      fetchMessages(selectedPhone);
    }
  }, [selectedPhone]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simulator Test Page</h1>
      
      <div className="mb-6">
        <button
          onClick={sendTestMessage}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Test Message'}
        </button>
        <button
          onClick={fetchContacts}
          className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Refresh Contacts
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Contacts ({contacts.length})</h2>
          <div className="border rounded-lg max-h-96 overflow-y-auto">
            {contacts.map((contact: any) => (
              <div
                key={contact.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedPhone === contact.phone ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedPhone(contact.phone)}
              >
                <div className="font-medium">{contact.name}</div>
                <div className="text-sm text-gray-600">{contact.phone}</div>
                <div className="text-xs text-gray-500">{contact.status}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Messages {selectedPhone && `for ${selectedPhone}`}
          </h2>
          <div className="border rounded-lg max-h-96 overflow-y-auto p-4">
            {selectedPhone ? (
              messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`mb-3 p-2 rounded max-w-xs ${
                    message.sent
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500">Select a contact to view messages</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}