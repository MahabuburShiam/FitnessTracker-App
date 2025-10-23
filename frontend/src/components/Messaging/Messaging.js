import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, ListGroup, Alert, Badge,
  InputGroup, Spinner
} from 'react-bootstrap';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

const axiosConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
};

const Messaging = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const socket = useSocket();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (currentUser) fetchConversations();
  }, [currentUser]);

  useEffect(() => {
    if (socket && currentUser) setupSocketListeners();
  }, [socket, currentUser, selectedUser]);

  useEffect(() => scrollToBottom(), [messages]);

  // ---------- SOCKET ----------
  const setupSocketListeners = () => {
    if (!socket || !currentUser?.id) return;
    socket.emit('join_user', currentUser.id);

    socket.on('new_message', (message) => {
      if (selectedUser &&
        (message.sender_id === selectedUser.id || message.receiver_id === selectedUser.id)) {
        setMessages(prev => [...prev, message]);
      }
      fetchConversations();
    });

    socket.on('user_typing', (data) => {
      if (data.senderId === selectedUser?.id) setIsTyping(data.isTyping);
    });

    socket.on('message_error', (err) => setError(err.error));

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('message_error');
    };
  };

  // ---------- FETCH CONVERSATIONS ----------
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user-search/conversations?userId=${currentUser.id}`, axiosConfig);
      setConversations(res.data);
    } catch (err) {
      console.error('Fetch conversations error:', err);
      setError('Failed to load conversations');
    }
  };

  // ---------- FETCH MESSAGES ----------
  const fetchMessages = async (userId) => {
    try {
      setLoading(true);

      // Fetch messages if exist, else initialize empty
      const res = await axios.get(`${BASE_URL}/messages/conversation/${userId}?userId=${currentUser.id}`, axiosConfig);

      setMessages(res.data?.messages || []);

      // Set selected user from backend or searchResults if new
      setSelectedUser(res.data?.otherUser || searchResults.find(u => u.id === userId) || { id: userId });

      // Mark messages as read if any
      if (res.data?.messages?.length) {
        await axios.patch(`${BASE_URL}/messages/read/${userId}?userId=${currentUser.id}`, {}, axiosConfig);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
      setError('Failed to load messages');
      setSelectedUser(searchResults.find(u => u.id === userId) || { id: userId });
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------- SEARCH USERS ----------
  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('query', searchQuery);
      if (userTypeFilter) params.append('user_type', userTypeFilter);
      params.append('userId', currentUser.id);

      const res = await axios.get(`${BASE_URL}/user-search/search?${params}`, axiosConfig);
      setSearchResults(res.data);
    } catch (err) {
      console.error('User search error:', err);
      setError('Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };

  // ---------- SEND MESSAGE ----------
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || !currentUser) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      await axios.post(
        `${BASE_URL}/messages/send`,
        { receiver_id: selectedUser.id, content },
        axiosConfig
      );

      // Append message locally for immediate feedback
      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender_id: currentUser.id, receiver_id: selectedUser.id, content, created_at: new Date() }
      ]);

      fetchConversations();
    } catch (err) {
      console.error('Send message error:', err);
      setError('Failed to send message');
    }

    // Stop typing
    if (socket) socket.emit('typing_stop', { senderId: currentUser.id, receiverId: selectedUser.id });
  };

  // ---------- TYPING ----------
  const handleTyping = () => {
    if (!selectedUser || !socket || !currentUser) return;

    socket.emit('typing_start', { senderId: currentUser.id, receiverId: selectedUser.id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', { senderId: currentUser.id, receiverId: selectedUser.id });
    }, 1000);
  };

  // ---------- SCROLL ----------
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ---------- FORMATTING ----------
  const formatTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getUserTypeBadge = (userType) => {
    const variants = { user: 'primary', gym_owner: 'success', trainer: 'warning' };
    return variants[userType] || 'secondary';
  };

  if (!currentUser) return (
    <Container className="mt-4 text-center">
      <Spinner animation="border" />
      <p>Loading user data...</p>
    </Container>
  );

  // ---------- RENDER ----------
  return (
    <Container className="mt-4" style={{ height: '80vh' }}>
      <Row className="h-100">
        {/* Left Sidebar */}
        <Col md={4} className="border-end">
          <Card className="h-100">
            <Card.Header><h5 className="mb-0">Messages</h5></Card.Header>
            
            {/* Search */}
            <div className="p-3 border-bottom">
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                />
                <Button variant="outline-primary" onClick={searchUsers}>
                  {searchLoading ? <Spinner animation="border" size="sm" /> : 'Search'}
                </Button>
              </InputGroup>

              <Form.Select
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
                size="sm"
              >
                <option value="">All Types</option>
                <option value="user">Regular Users</option>
                <option value="gym_owner">Gym Owners</option>
                <option value="trainer">Trainers</option>
              </Form.Select>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="border-bottom">
                <div className="p-2 bg-light"><small className="text-muted">SEARCH RESULTS</small></div>
                <ListGroup variant="flush">
                  {searchResults.map(user => (
                    <ListGroup.Item
                      key={user.id}
                      action
                      onClick={() => fetchMessages(user.id)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{user.first_name} {user.last_name}</strong>
                        <br />
                        <small className="text-muted">{user.email}</small>
                      </div>
                      <Badge bg={getUserTypeBadge(user.user_type)}>{user.user_type}</Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {/* Conversations */}
            <Card.Body className="p-0" style={{ overflowY: 'auto' }}>
              <ListGroup variant="flush">
                {conversations.length === 0 ? (
                  <div className="text-center p-4 text-muted">
                    No conversations yet. Search users to start a conversation!
                  </div>
                ) : (
                  conversations.map(convo => (
                    <ListGroup.Item
                      key={convo.user.id}
                      action
                      active={selectedUser?.id === convo.user.id}
                      onClick={() => fetchMessages(convo.user.id)}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{convo.user.first_name} {convo.user.last_name}</strong>
                          <Badge bg={getUserTypeBadge(convo.user.user_type)}>{convo.user.user_type}</Badge>
                        </div>
                        <small className="text-muted d-block text-truncate">{convo.lastMessage?.content || 'No messages yet'}</small>
                        <small className="text-muted">{convo.lastMessage ? formatTime(convo.lastMessage.created_at) : ''}</small>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Chat */}
        <Col md={8}>
          <Card className="h-100">
            <Card.Header>
              {selectedUser ? (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">{selectedUser.first_name || 'User'} {selectedUser.last_name || ''}</h5>
                    {selectedUser.user_type && <Badge bg={getUserTypeBadge(selectedUser.user_type)}>{selectedUser.user_type}</Badge>}
                  </div>
                  {isTyping && <small className="text-muted"><i>{selectedUser.first_name} is typing...</i></small>}
                </div>
              ) : <h5 className="mb-0">Select a conversation</h5>}
            </Card.Header>

            <Card.Body className="d-flex flex-column p-0">
              {selectedUser ? (
                <>
                  <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: '400px', minHeight: '400px' }}>
                    {loading ? <Spinner animation="border" /> : 
                      messages.length === 0 ? (
                        <div className="text-center text-muted h-100 d-flex align-items-center justify-content-center">
                          <div>
                            <p>No messages yet. Start the conversation!</p>
                            <small>Send a message to {selectedUser.first_name || 'User'}</small>
                          </div>
                        </div>
                      ) : (
                        messages.map(msg => (
                          <div key={msg.id} className={`d-flex mb-3 ${msg.sender_id === currentUser.id ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div className={`p-3 rounded ${msg.sender_id === currentUser.id ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
                              <div>{msg.content}</div>
                              <small className={`d-block text-end ${msg.sender_id === currentUser.id ? 'text-light' : 'text-muted'}`}>
                                {formatTime(msg.created_at)}
                              </small>
                            </div>
                          </div>
                        ))
                      )
                    }
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-top p-3">
                    {error && <Alert variant="danger" className="mb-2">{error}</Alert>}
                    <Form onSubmit={handleSendMessage}>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={newMessage}
                          onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                          placeholder="Type your message..."
                        />
                        <Button type="submit" variant="primary" className="ms-2" disabled={!newMessage.trim()}>Send</Button>
                      </div>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center text-muted">
                    <h5>Welcome to Messages</h5>
                    <p>Select a conversation or search for users to start chatting</p>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Messaging;
