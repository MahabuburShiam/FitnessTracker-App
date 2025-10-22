import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

const Messaging = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new_message', (message) => {
        if (selectedConversation && 
            (message.sender_id === selectedConversation.user.id || 
             message.receiver_id === selectedConversation.user.id)) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('new_message');
      };
    }
  }, [socket, selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/messages/conversations');
      setConversations(res.data);
    } catch (error) {
      console.error('Fetch conversations error:', error);
      setError('Failed to load conversations');
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await axios.get(`/api/messages/conversations/${userId}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Fetch messages error:', error);
      setError('Failed to load messages');
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.user.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setLoading(true);

    try {
      if (socket) {
        socket.emit('send_message', {
          receiverId: selectedConversation.user.id,
          content: newMessage.trim()
        });
      } else {
        // Fallback to HTTP if socket is not available
        await axios.post('/api/messages', {
          receiver_id: selectedConversation.user.id,
          content: newMessage.trim()
        });
        fetchMessages(selectedConversation.user.id);
      }

      setNewMessage('');
    } catch (error) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Container className="mt-4" style={{ height: '80vh' }}>
      <Row className="h-100">
        <Col md={4}>
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Conversations</h5>
            </Card.Header>
            <Card.Body className="p-0">
              {conversations.length === 0 ? (
                <div className="text-center p-3">
                  <p className="text-muted">No conversations yet.</p>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {conversations.map(conversation => (
                    <ListGroup.Item
                      key={conversation.user.id}
                      action
                      active={selectedConversation?.user.id === conversation.user.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div>
                        <strong>
                          {conversation.user.first_name} {conversation.user.last_name}
                        </strong>
                        <br />
                        <small className="text-muted">
                          {conversation.user.user_type}
                        </small>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="badge bg-primary rounded-pill">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="h-100">
            <Card.Header>
              {selectedConversation ? (
                <h5 className="mb-0">
                  {selectedConversation.user.first_name} {selectedConversation.user.last_name}
                </h5>
              ) : (
                <h5 className="mb-0">Select a conversation</h5>
              )}
            </Card.Header>

            <Card.Body className="d-flex flex-column p-0">
              {selectedConversation ? (
                <>
                  <div 
                    className="flex-grow-1 p-3"
                    style={{ 
                      overflowY: 'auto', 
                      maxHeight: '400px',
                      minHeight: '400px'
                    }}
                  >
                    {messages.length === 0 ? (
                      <div className="text-center text-muted">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div
                          key={message.id}
                          className={`d-flex mb-3 ${
                            message.sender_id === selectedConversation.user.id 
                              ? 'justify-content-start' 
                              : 'justify-content-end'
                          }`}
                        >
                          <div
                            className={`p-2 rounded ${
                              message.sender_id === selectedConversation.user.id
                                ? 'bg-light text-dark'
                                : 'bg-primary text-white'
                            }`}
                            style={{ maxWidth: '70%' }}
                          >
                            <div>{message.content}</div>
                            <small className={`d-block text-end ${
                              message.sender_id === selectedConversation.user.id
                                ? 'text-muted'
                                : 'text-light'
                            }`}>
                              {formatTime(message.created_at)}
                            </small>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="border-top p-3">
                    <Form onSubmit={handleSendMessage}>
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          disabled={loading}
                        />
                        <Button 
                          type="submit" 
                          variant="primary" 
                          className="ms-2"
                          disabled={loading || !newMessage.trim()}
                        >
                          Send
                        </Button>
                      </div>
                    </Form>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <p className="text-muted">Select a conversation to start messaging</p>
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