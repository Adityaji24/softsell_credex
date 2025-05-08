import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Button, Form, Row, Col, Card, Toast, ToastContainer } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Image imports for branding and testimonials
// Ensure these assets exist in src/images/
import logo from '../src/images/logo.jpeg';
import testimonial1 from '../src/images/feedback1.jpg';
import testimonial2 from '../src/images/feedback2.jpg';

// Register GSAP ScrollTrigger plugin to enable scroll-based animations
gsap.registerPlugin(ScrollTrigger);

// Constants for form configuration to centralize text content
// Reduces duplication and eases maintenance
const FORM_FIELDS = {
  NAME_PLACEHOLDER: 'Enter your full name',
  EMAIL_PLACEHOLDER: 'your.email@example.com',
  COMPANY_PLACEHOLDER: 'Your company (optional)',
  MESSAGE_PLACEHOLDER: 'Tell us about your licenses or any questions...',
  RESPONSE_TIME_TEXT: 'We\'ll respond within 24 hours.',
};

/* Chatbot Component
 * Provides an interactive assistant for user queries about selling software licenses
 * Features a toggleable chat window with context-aware bot responses
 */
function Chatbot() {
  // State to manage chatbot visibility, conversation history, and user input
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'Hi! I\'m here to help you sell your software licenses. What\'s your question?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  // Handles user message submission and triggers bot response
  // Uses a delay to mimic natural conversation flow
  const handleSend = () => {
    if (!input.trim()) return; // Prevent empty messages

    // Append user message to conversation history
    setMessages((prev) => [...prev, { text: input, sender: 'user' }]);

    // Generate bot response based on user input keywords
    setTimeout(() => {
      let response = 'Can you clarify your question? I\'m here to help!';
      if (input.toLowerCase().includes('how')) {
        response = 'Selling is easy! Upload your license details, get a fair valuation, and receive payment within 48 hours.';
      } else if (input.toLowerCase().includes('price') || input.toLowerCase().includes('cost')) {
        response = 'Valuations depend on the license type and market demand. Slug your license for a free quote!';
      } else if (input.toLowerCase().includes('safe') || input.toLowerCase().includes('secure')) {
        response = 'All transactions are encrypted and follow strict privacy protocols.';
      }
      setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
    }, 600); // 600ms delay for realistic response timing

    setInput(''); // Clear input field after submission
  };

  return (
    <div className="chatbot-container">
      {/* Floating button to toggle chatbot visibility */}
      <Button
        variant="primary"
        className="rounded-circle"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '60px', height: '60px' }}
      >
        <i className="bi bi-chat-dots"></i>
      </Button>
      {/* Animated chat window with entrance/exit transitions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="chatbot-window"
          >
            <div className="chatbot-header">
              <h6 className="mb-0">SoftSell Assistant</h6>
            </div>
            <div className="chatbot-messages">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${msg.sender === 'user' ? 'text-end' : 'text-start'}`}
                >
                  {/* Style messages based on sender for visual distinction */}
                  <span
                    className={`d-inline-block p-2 rounded ${
                      msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light'
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            {/* Input form for user messages */}
            <Form
              className="p-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <Form.Control
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about selling licenses..."
              />
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Main Application Component
 * Renders the SoftSell landing page with navigation, hero, feature sections, testimonials, contact form, and chatbot
 * Manages theme switching, form submissions, and scroll animations
 */
function App() {
  // State management for UI interactions
  // theme: Controls light/dark mode
  // showToast: Toggles success message visibility after form submission
  // formData: Stores user input for contact form
  const [theme, setTheme] = useState('light');
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    licenseType: '',
    message: '',
  });

  // Initialize theme and GSAP animations on component mount or theme change
  useEffect(() => {
    // Apply theme to document body for Bootstrap compatibility
    document.body.setAttribute('data-bs-theme', theme);

    // Set up scroll-triggered animations for elements with fade-up class
    // Animations enhance user experience by revealing content smoothly
    gsap.utils.toArray('.fade-up').forEach((el) => {
      gsap.from(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        y: 50,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
      });
    });
  }, [theme]);

  // Toggle between light and dark themes for accessibility and user preference
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Process form submission, reset form, and display success toast
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted, showing success toast');
    setShowToast(true);
    // Reset form fields to initial state
    setFormData({ name: '', email: '', company: '', licenseType: '', message: '' });
    // Hide toast after 3 seconds for clean UI
    setTimeout(() => {
      console.log('Hiding success toast');
      setShowToast(false);
    }, 3000);
  };

  // Update form data dynamically as users type
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Navigation Bar
       * Provides site navigation and theme toggle
       * Sticky positioning ensures constant accessibility
       */}
      <Navbar bg={theme} variant={theme} expand="lg" className="shadow-sm px-4 py-2 sticky-top">
        <Navbar.Brand href="#">
          <img src={logo} alt="SoftSell Logo" className="navbar-logo me-3" />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            <Nav.Link href="#howitworks">How It Works</Nav.Link>
            <Nav.Link href="#whyus">Why Choose Us</Nav.Link>
            <Nav.Link href="#testimonials">Testimonials</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
            {/* Theme toggle button for user customization */}
            <Button variant="outline-secondary" className="ms-3" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section
       * Introduces SoftSell with animated title and call-to-action
       * Parallax background enhances visual appeal
       */}
      <header className="parallax-section d-flex flex-column justify-content-center text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="display-3 fw-bold header-title"
        >
          SoftSell
          <br />
          Sell Unused Software Licenses Easily
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="fs-5"
        >
          Maximize the value of your dormant assets. Quick, secure, and profitable.
        </motion.p>
        <Button variant="light" size="lg" className="mt-3">
          Get a Free Quote
        </Button>
      </header>

      {/* How It Works Section
       * Outlines the license selling process with animated cards
       * Uses motion effects for interactive hover/tap feedback
       */}
      <Container className="py-5" id="howitworks">
        <h2 className="text-center mb-5 fade-up">How It Works</h2>
        <Row className="text-center g-4">
          {[
            {
              icon: 'cloud-upload',
              title: 'Upload License',
              desc: 'Submit your license details securely via our encrypted portal.',
            },
            {
              icon: 'graph-up',
              title: 'Get Valuation',
              desc: 'Our experts assess your license for a competitive market value.',
            },
            {
              icon: 'currency-dollar',
              title: 'Get Paid',
              desc: 'Receive fast payment within 24-48 hours via your preferred method.',
            },
          ].map((step, idx) => (
            <Col md={4} key={idx} className="fade-up">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded shadow-sm bg-light"
              >
                <i className={`bi bi-${step.icon} display-4 mb-3`}></i>
                <h5>{step.title}</h5>
                <p>
                  {step.desc} {idx === 0 ? 'No technical expertise needed!' : ''}
                </p>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Why Choose Us Section
       * Highlights key benefits with icons and concise descriptions
       * Fade-up animations improve visual flow
       */}
      <Container className="py-5" id="whyus">
        <h2 className="text-center mb-5 fade-up">Why Choose Us</h2>
        <Row className="text-center g-4">
          {[
            {
              icon: 'shield-lock',
              title: 'Secure Deals',
              desc: 'Every transaction is encrypted and private.',
            },
            {
              icon: 'clock-history',
              title: 'Quick Turnaround',
              desc: 'Get your money in 24–48 hours.',
            },
            {
              icon: 'cash-stack',
              title: 'Best Market Prices',
              desc: 'We evaluate your license fairly.',
            },
            {
              icon: 'award',
              title: 'Trusted by Clients',
              desc: 'Over 1000 successful transactions.',
            },
          ].map((item, idx) => (
            <Col md={3} key={idx} className="fade-up">
              <i className={`bi bi-${item.icon} display-5 mb-3`}></i>
              <h6>{item.title}</h6>
              <p>{item.desc}</p>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Testimonials Section
       * Displays client feedback with images and quotes
       * Card layout ensures consistent presentation
       */}
      <Container className="py-5" id="testimonials">
        <h2 className="text-center mb-5 fade-up">What Our Clients Say</h2>
        <Row className="g-4">
          {[
            {
              name: 'Jane Smith',
              role: 'IT Manager',
              company: 'AlphaTech',
              img: testimonial1,
              review:
                'SoftSell simplified the process of selling our extra licenses. The valuation was fair, and we got paid quickly!',
            },
            {
              name: 'Mark Allen',
              role: 'CFO',
              company: 'BizCore Ltd.',
              img: testimonial2,
              review: 'Highly recommend SoftSell for their speed and professionalism. Great service!',
            },
          ].map((testi, idx) => (
            <Col md={6} key={idx} className="fade-up">
              <Card className="p-3 h-100">
                <Row className="align-items-center">
                  <Col xs={3}>
                    <img
                      src={testi.img}
                      alt={testi.name}
                      className="img-fluid rounded-circle"
                    />
                  </Col>
                  <Col>
                    <h6>{testi.name}</h6>
                    <small>
                      {testi.role} @ {testi.company}
                    </small>
                  </Col>
                </Row>
                <p className="mt-3">"{testi.review}"</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Contact Section
       * Allows users to submit inquiries via a form
       * Displays a success toast below the form upon submission
       */}
      <Container className="py-5" id="contact">
        <h2 className="text-center mb-4 fade-up">Get in Touch</h2>
        <Form className="fade-up" onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={FORM_FIELDS.NAME_PLACEHOLDER}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={FORM_FIELDS.EMAIL_PLACEHOLDER}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Company</Form.Label>
                <Form.Control
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder={FORM_FIELDS.COMPANY_PLACEHOLDER}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>License Type</Form.Label>
                <Form.Select
                  name="licenseType"
                  value={formData.licenseType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a license type</option>
                  <option>Windows</option>
                  <option>Office 365</option>
                  <option>Adobe</option>
                  <option>Other</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={FORM_FIELDS.MESSAGE_PLACEHOLDER}
              required
            />
            <Form.Text className="text-muted">
              {FORM_FIELDS.RESPONSE_TIME_TEXT}
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit">
            Send Message
          </Button>
        </Form>
        {/* Success toast positioned below form for user feedback */}
        <ToastContainer className="mt-3 text-center" style={{ zIndex: 1050 }}>
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={3000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>
              Your message has been sent! We'll get back to you soon.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>

      <Chatbot />

      {/* Footer Section
       * Provides copyright information and links to privacy policy
       * Ensures consistent branding and user experience
       */}    
      <footer
        className={`text-center py-3 mt-5 ${
          theme === 'light' ? 'bg-light text-muted' : 'bg-dark text-light'
        }`}
      >
        © 2025 SoftSell. All rights reserved. |{' '}
        <a href="/privacy" className="text-muted">
          Privacy Policy
        </a>
      </footer>
    </>
  );
}

export default App;