import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Clock, Database, CreditCard, Server, User, Mail, Calendar, DollarSign } from 'lucide-react';

export default function PaymentFlowDiagram() {
  const [expandedSteps, setExpandedSteps] = useState({});

  const toggleStep = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const steps = [
    {
      id: 1,
      actor: 'USER',
      actorColor: 'bg-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      title: 'User Selects Date',
      icon: Calendar,
      description: 'User picks an appointment date from the calendar',
      component: 'DatePicker Component',
      details: {
        trigger: 'User interaction with date picker',
        action: 'onChange event triggered',
        nextStep: 'Triggers API call to fetch available slots'
      }
    },
    {
      id: 2,
      actor: 'FRONTEND',
      actorColor: 'bg-indigo-600',
      borderColor: 'border-indigo-300',
      bgColor: 'bg-indigo-50',
      title: 'Fetch Available Time Slots',
      icon: Server,
      description: 'Frontend calls availability API with selected date',
      endpoint: {
        method: 'GET',
        url: '/api/availability',
        params: '?date=2026-02-18'
      },
      requestExample: {
        url: 'http://localhost:8000/api/availability?date=2026-02-18',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      responseExample: {
        status: 200,
        body: [
          "10:30 AM",
          "11:30 AM",
          "12:30 PM",
          "01:30 PM",
          "02:30 PM",
          "03:30 PM",
          "04:30 PM",
          "05:30 PM"
        ]
      }
    },
    {
      id: 3,
      actor: 'BACKEND',
      actorColor: 'bg-amber-600',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      title: 'Calculate & Filter Available Slots',
      icon: Server,
      description: 'Backend processes date and returns available time slots',
      logic: [
        'Get day of week from date',
        'Determine business hours based on day',
        'Generate 60-minute interval slots',
        'Query Availability collection',
        'Filter slots where bookingsCount >= 2',
        'Filter slots marked as leave',
        'Return available slots array'
      ],
      businessHours: {
        Monday: 'CLOSED',
        'Tuesday-Friday': '10:30 AM - 6:30 PM',
        'Saturday-Sunday': '11:00 AM - 6:00 PM'
      },
      codeSnippet: `const dayOfWeek = new Date(date).getDay();
if (dayOfWeek === 1) return res.json([]); // Monday closed

const generatedSlots = generateTimeSlots(startTime, endTime, 60);
const availability = await Availability.findOne({ date });

if (!availability) return res.json(generatedSlots);

const availableSlots = generatedSlots.filter((slotTime) => {
  const slot = availability.slots.find((s) => s.time === slotTime);
  if (!slot) return true;
  const isFull = slot.bookingsCount >= 2;
  return !isFull && !slot.isLeave;
});`
    },
    {
      id: 4,
      actor: 'USER',
      actorColor: 'bg-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      title: 'Select Time & Fill Customer Details',
      icon: User,
      description: 'User selects time slot and enters personal information',
      formFields: [
        { name: 'services', required: true, example: '[{ serviceId: "6983...", name: "Acne Clearing Treatment", price: 80, duration: 60 }]' },
        { name: 'name', required: true, example: 'John Doe' },
        { name: 'email', required: true, example: 'john@example.com' },
        { name: 'phone', required: true, example: '+44 7700 900123' },
        { name: 'address', required: false, example: '123 Main St' },
        { name: 'notes', required: false, example: 'First time customer' },
        { name: 'selectedDate', required: true, example: '2026-02-18' },
        { name: 'selectedSlot', required: true, example: '11:30 AM' }
      ]
    },
    {
      id: 5,
      actor: 'FRONTEND',
      actorColor: 'bg-indigo-600',
      borderColor: 'border-indigo-300',
      bgColor: 'bg-indigo-50',
      title: 'Create Stripe Payment Session',
      icon: CreditCard,
      description: 'Frontend sends booking data to create Stripe checkout session',
      endpoint: {
        method: 'POST',
        url: '/api/create-payment-intent'
      },
      requestExample: {
        url: 'http://localhost:8000/api/create-payment-intent',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          userId: '64d2024be1e3d9d5a45678ab',
          services: [
            {
              serviceId: '6983710cca490c074c51d638',
              name: 'Acne Clearing Treatment',
              price: 80,
              duration: 60
            }
          ],
          totalAmount: 80,
          appointmentDate: '2026-02-18',
          appointmentTime: '11:30 AM',
          staffMember: 'Alex Groomer',
          notes: 'First time customer, sensitive skin',
          customerInfo: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+44 7700 900123'
          },
          paymentIntentId: null
        }
      },
      codeSnippet: `const handleConfirmBooking = async () => {
  const bookingData = {
    userId: "64d2024be1e3d9d5a45678ab",
    services: services.map((s) => ({
      serviceId: s._id,
      name: s.name,
      price: s.unitPrice,
      duration: s.duration,
    })),
    totalAmount: total,
    appointmentDate: selectedDate?.toISOString().split("T")[0],
    appointmentTime: selectedSlot,
    staffMember: "Alex Groomer",
    notes: customerInfo.notes,
    customerInfo: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone,
    },
  };

  const res = await axios.post(
    \`\${process.env.REACT_APP_API_BASE_URL}/api/create-payment-intent\`,
    bookingData
  );

  window.location.href = res.data.session_url;
};`
    },
    {
      id: 6,
      actor: 'BACKEND',
      actorColor: 'bg-amber-600',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      title: 'Create Stripe Checkout Session',
      icon: DollarSign,
      description: 'Backend creates Stripe customer, calculates 30% deposit, generates checkout URL',
      depositCalculation: {
        fullPrice: 80,
        depositPercent: 30,
        depositAmount: 24,
        remainingBalance: 56
      },
      logic: [
        '1. Create Stripe customer with metadata',
        '2. Calculate deposit: price × 0.30 × 100 (cents)',
        '3. Build line_items for Stripe',
        '4. Create checkout session',
        '5. Return session_url to frontend'
      ],
      stripeMetadata: {
        email: 'john@example.com',
        userId: '64d2024be1e3d9d5a45678ab',
        services: '[{"serviceId":"6983...","name":"Acne Clearing Treatment","price":80,"duration":60}]',
        appointmentDate: '2026-02-18',
        appointmentTime: '11:30 AM',
        staffMember: 'Alex Groomer',
        notes: 'First time customer, sensitive skin',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+44 7700 900123'
      },
      codeSnippet: `const customer = await stripe.customers.create({
  metadata: {
    email: customerInfo.email,
    userId,
    services: JSON.stringify(services),
    appointmentDate,
    appointmentTime,
    staffMember: staffMember || '',
    notes: notes || '',
    customerName: customerInfo.name,
    customerEmail: customerInfo.email,
    customerPhone: customerInfo.phone,
  },
});

const line_items = services.map((service) => {
  const depositAmount = Math.round(service.price * 0.3 * 100); // 30% in cents

  return {
    price_data: {
      currency: 'gbp',
      product_data: {
        name: service.name,
        description: \`\${service.duration} mins (30% deposit)\`,
      },
      unit_amount: depositAmount,
    },
    quantity: 1,
  };
});

const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  customer: customer.id,
  line_items,
  mode: 'payment',
  success_url: \`\${origin}/booking-success?session_id={CHECKOUT_SESSION_ID}\`,
  cancel_url: \`\${origin}/booking-cancelled\`,
});`,
      responseExample: {
        status: 200,
        body: {
          success: true,
          session_url: 'https://checkout.stripe.com/pay/cs_test_a1b2c3d4e5f6g7h8i9j0...'
        }
      }
    },
    {
      id: 7,
      actor: 'STRIPE',
      actorColor: 'bg-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-50',
      title: 'User Completes Payment on Stripe',
      icon: CreditCard,
      description: 'User redirected to Stripe checkout page, enters card details, pays 30% deposit',
      paymentDetails: {
        amount: '£24.00',
        currency: 'GBP',
        description: 'Acne Clearing Treatment (60 mins - 30% deposit)',
        fullAmount: '£80.00',
        depositPercentage: '30%'
      },
      redirectUrl: 'window.location.href = session_url',
      userActions: [
        'User enters card number',
        'User enters expiry date',
        'User enters CVC',
        'User confirms payment',
        'Stripe processes payment'
      ]
    },
    {
      id: 8,
      actor: 'STRIPE',
      actorColor: 'bg-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-50',
      title: 'Stripe Sends Webhook Event',
      icon: Server,
      description: 'After successful payment, Stripe sends checkout.session.completed event',
      badge: 'ASYNC',
      endpoint: {
        method: 'POST',
        url: '/api/webhook'
      },
      webhookPayload: {
        id: 'evt_1234567890abcdef',
        object: 'event',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
            customer: 'cus_Tv9pQOmPwGPXMJ',
            payment_intent: 'pi_test_intent_001',
            payment_status: 'paid',
            amount_total: 2400,
            currency: 'gbp'
          }
        }
      },
      note: '⚡ This runs in the background independently while user is redirected to success page'
    },
    {
      id: 9,
      actor: 'BACKEND',
      actorColor: 'bg-amber-600',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      title: 'Process Webhook & Create Booking',
      icon: Database,
      description: 'Verify webhook signature, retrieve customer data, create booking, update availability',
      webhookProcessing: [
        '1. Verify webhook signature (security)',
        '2. Check event type = "checkout.session.completed"',
        '3. Retrieve customer from Stripe API',
        '4. Parse metadata (services, date, time, etc)',
        '5. Create booking document',
        '6. Update availability slots',
        '7. Send confirmation email (optional)',
        '8. Return 200 OK to Stripe'
      ],
      codeSnippet: `const signature = req.headers['stripe-signature'];
const event = stripe.webhooks.constructEvent(
  req.body,
  signature,
  webhookSecret
);

if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  const customer = await stripe.customers.retrieve(session.customer);
  
  const services = JSON.parse(customer.metadata.services);
  const bookingData = {
    userId: customer.metadata.userId,
    customerId: session.customer,
    checkoutSessionId: session.id,
    paymentIntentId: session.payment_intent,
    services: services.map((service) => ({
      serviceId: service.serviceId,
      name: service.name,
      price: service.price,
      duration: service.duration,
    })),
    appointmentDate: new Date(customer.metadata.appointmentDate),
    appointmentTime: customer.metadata.appointmentTime,
    staffMember: customer.metadata.staffMember,
    customerDetails: {
      name: customer.metadata.customerName,
      email: customer.metadata.customerEmail,
      phone: customer.metadata.customerPhone,
    },
    notes: customer.metadata.notes,
    subtotal: services.reduce((sum, s) => sum + s.price, 0),
    depositPaid: session.amount_total / 100,
    total: services.reduce((sum, s) => sum + s.price, 0),
    payment_status: session.payment_status,
    paymentMethod: 'Stripe',
    confirmed: true,
  };
  
  const newBooking = new bookingModel(bookingData);
  await newBooking.save();
  
  await updateAvailability(
    bookingData.appointmentDate,
    bookingData.appointmentTime
  );
}`,
      bookingDocument: {
        _id: '6983710cca490c074c51d6cd',
        userId: '64d2024be1e3d9d5a45678ab',
        customerId: 'cus_Tv9pQOmPwGPXMJ',
        checkoutSessionId: 'cs_test_a1b2c3d4e5f6g7h8i9j0',
        paymentIntentId: 'pi_test_intent_001',
        services: [
          {
            serviceId: '6983710cca490c074c51d638',
            name: 'Acne Clearing Treatment',
            price: 80,
            duration: 60
          }
        ],
        appointmentDate: '2026-02-18T00:00:00.000Z',
        appointmentTime: '11:30 AM',
        staffMember: 'Alex Groomer',
        customerDetails: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+44 7700 900123'
        },
        notes: 'First time customer, sensitive skin',
        subtotal: 80,
        depositPaid: 24,
        total: 80,
        remainingBalance: 56,
        payment_status: 'paid',
        paymentMethod: 'Stripe',
        confirmed: true
      }
    },
    {
      id: 10,
      actor: 'DATABASE',
      actorColor: 'bg-emerald-600',
      borderColor: 'border-emerald-300',
      bgColor: 'bg-emerald-50',
      title: 'Update Availability Collection',
      icon: Database,
      description: 'Increment bookingsCount for the selected time slot',
      availabilityUpdate: {
        date: '2026-02-18',
        slots: [
          {
            time: '11:30 AM',
            bookingsCount: 1,
            isLeave: false,
            isBooked: true
          }
        ]
      },
      codeSnippet: `const updateAvailability = async (appointmentDate, appointmentTime) => {
  const dateStr = appointmentDate.toISOString().split('T')[0];
  
  const availability = await Availability.findOne({ date: dateStr });
  
  if (availability) {
    const existingSlot = availability.slots.find(
      (slot) => slot.time === appointmentTime
    );
    
    if (!existingSlot) {
      availability.slots.push({ 
        time: appointmentTime, 
        isBooked: true,
        bookingsCount: 1 
      });
    } else {
      existingSlot.bookingsCount += 1;
    }
    
    await availability.save();
  } else {
    const newAvailability = new Availability({
      date: dateStr,
      slots: [{ 
        time: appointmentTime, 
        isBooked: true,
        bookingsCount: 1 
      }],
    });
    
    await newAvailability.save();
  }
};`
    },
    {
      id: 11,
      actor: 'STRIPE',
      actorColor: 'bg-purple-600',
      borderColor: 'border-purple-300',
      bgColor: 'bg-purple-50',
      title: 'Redirect to Success Page',
      icon: Check,
      description: 'Stripe redirects user to success URL with session ID',
      redirectUrl: '/booking-success?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0',
      urlParts: {
        base: '/booking-success',
        query: {
          session_id: 'cs_test_a1b2c3d4e5f6g7h8i9j0'
        }
      }
    },
    {
      id: 12,
      actor: 'FRONTEND',
      actorColor: 'bg-indigo-600',
      borderColor: 'border-indigo-300',
      bgColor: 'bg-indigo-50',
      title: 'Fetch Booking Details for Display',
      icon: Server,
      description: 'Success page extracts session_id and calls backend to get booking info',
      endpoint: {
        method: 'GET',
        url: '/api/booking-success',
        params: '?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0'
      },
      codeSnippet: `useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("session_id");
  
  const fetchBookingDetails = async () => {
    try {
      const res = await axios.get(
        \`\${process.env.REACT_APP_API_BASE_URL}/api/booking-success?session_id=\${sessionId}\`
      );
      setBookingDetails(res.data);
    } catch (err) {
      console.error("Error fetching booking details:", err);
    }
  };
  
  if (sessionId) {
    fetchBookingDetails();
  }
}, []);`,
      requestExample: {
        url: 'http://localhost:8000/api/booking-success?session_id=cs_test_a1b2c3d4e5f6g7h8i9j0',
        method: 'GET'
      },
      responseExample: {
        status: 200,
        body: {
          depositPaid: 24,
          total: 80,
          bookingId: '6983710cca490c074c51d6cd',
          customerName: 'John Doe',
          service: 'Acne Clearing Treatment',
          time: '2026-02-18 at 11:30 AM',
          date: '2026-02-11T10:30:00.000Z'
        }
      },
      backendCode: `router.get('/booking-success', async (req, res) => {
  const sessionId = req.query.session_id;
  
  const booking = await bookingModel.findOne({
    checkoutSessionId: sessionId,
  });
  
  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  res.json({
    depositPaid: booking.depositPaid,
    total: booking.total,
    bookingId: booking._id,
    customerName: booking.customerDetails.name,
    service: booking.services.map((s) => s.name).join(', '),
    time: \`\${booking.appointmentDate} at \${booking.appointmentTime}\`,
  });
});`
    },
    {
      id: 13,
      actor: 'USER',
      actorColor: 'bg-blue-600',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      title: 'Booking Confirmed Successfully! 🎉',
      icon: Check,
      description: 'User sees confirmation with all booking details and receipt',
      displayedInfo: {
        confirmationMessage: 'Booking confirmed successfully!',
        depositPaid: '£24.00',
        totalAmount: '£80.00',
        remainingBalance: '£56.00',
        bookingReference: '6983710cca490c074c51d6cd',
        customerName: 'John Doe',
        service: 'Acne Clearing Treatment',
        appointmentDate: '2026-02-18',
        appointmentTime: '11:30 AM',
        staffMember: 'Alex Groomer',
        paymentMethod: 'Stripe',
        paymentStatus: 'Success ✓'
      },
      actions: [
        'Download receipt button (window.print())',
        'Go back to home button',
        'View booking details'
      ]
    }
  ];

  const actorColors = {
    USER: 'text-blue-700',
    FRONTEND: 'text-indigo-700',
    BACKEND: 'text-amber-700',
    STRIPE: 'text-purple-700',
    DATABASE: 'text-emerald-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            💳 Complete Payment Flow
          </h1>
          <p className="text-gray-600 text-lg">
            Detailed breakdown with request/response bodies and code snippets
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h3 className="text-gray-800 font-semibold mb-4">Color Legend</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-gray-700">User Action</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-indigo-600 rounded"></div>
              <span className="text-gray-700">Frontend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-600 rounded"></div>
              <span className="text-gray-700">Backend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span className="text-gray-700">Stripe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-600 rounded"></div>
              <span className="text-gray-700">Database</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`${step.bgColor} rounded-lg border-2 ${step.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg`}
            >
              {/* Step Header */}
              <div
                className="p-6 cursor-pointer bg-white"
                onClick={() => toggleStep(step.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-12 h-12 ${step.actorColor} rounded-full flex items-center justify-center text-white font-bold text-xl shadow`}>
                    {step.id === 13 ? '✓' : step.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`${step.actorColor} font-bold text-sm px-3 py-1 bg-gray-100 rounded-full`}>
                        {step.actor}
                      </span>
                      {step.badge && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full border border-purple-300">
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-gray-800 text-xl font-bold mb-2 flex items-center gap-2">
                      <step.icon className="w-5 h-5" />
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>

                    {/* Endpoint Badge */}
                    {step.endpoint && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
                        <span className={`font-bold ${step.endpoint.method === 'GET' ? 'text-green-700' : 'text-blue-700'}`}>
                          {step.endpoint.method}
                        </span>
                        <code className="text-indigo-700 font-mono text-sm">
                          {step.endpoint.url}{step.endpoint.params || ''}
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <div className="text-gray-500">
                    {expandedSteps[step.id] ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSteps[step.id] && (
                <div className="border-t border-gray-200 p-6 space-y-6 bg-white">
                  {/* Component */}
                  {step.component && (
                    <div>
                      <h4 className="text-amber-700 font-semibold mb-2">📦 Component</h4>
                      <code className="text-gray-700 bg-gray-100 px-3 py-1 rounded">{step.component}</code>
                    </div>
                  )}

                  {/* Details */}
                  {step.details && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="text-amber-700 font-semibold mb-3">Details</h4>
                      {Object.entries(step.details).map(([key, value]) => (
                        <div key={key} className="mb-2">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="text-gray-800">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Form Fields */}
                  {step.formFields && (
                    <div>
                      <h4 className="text-amber-700 font-semibold mb-3">📝 Form Fields</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.formFields.map((field) => (
                          <div key={field.name} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-indigo-700 font-mono text-sm">{field.name}</code>
                              {field.required && (
                                <span className="text-red-600 text-xs">*required</span>
                              )}
                            </div>
                            <div className="text-gray-600 text-sm">Example: {field.example}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Request Example */}
                  {step.requestExample && (
                    <div>
                      <h4 className="text-green-700 font-semibold mb-3">📤 Request</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100">
                          {JSON.stringify(step.requestExample, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Response Example */}
                  {step.responseExample && (
                    <div>
                      <h4 className="text-blue-700 font-semibold mb-3">📥 Response</h4>
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`font-semibold ${step.responseExample.status === 200 ? 'text-green-400' : 'text-red-400'}`}>
                            Status: {step.responseExample.status}
                          </span>
                        </div>
                        <pre className="overflow-x-auto">
                          <code className="text-sm text-gray-100">
                            {JSON.stringify(step.responseExample.body, null, 2)}
                          </code>
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Logic Steps */}
                  {step.logic && (
                    <div>
                      <h4 className="text-purple-700 font-semibold mb-3">⚙️ Processing Logic</h4>
                      <ol className="space-y-2">
                        {step.logic.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-purple-700 font-mono">{i + 1}.</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Business Hours */}
                  {step.businessHours && (
                    <div>
                      <h4 className="text-amber-700 font-semibold mb-3">🕒 Business Hours</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                        {Object.entries(step.businessHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="text-gray-700 font-medium">{day}:</span>
                            <span className={hours === 'CLOSED' ? 'text-red-600' : 'text-green-700'}>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Deposit Calculation */}
                  {step.depositCalculation && (
                    <div className="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-600">
                      <h4 className="text-amber-700 font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Deposit Calculation (30%)
                      </h4>
                      <div className="space-y-2 text-gray-800">
                        <div className="flex justify-between">
                          <span>Full Price:</span>
                          <span className="font-mono">£{step.depositCalculation.fullPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Deposit ({step.depositCalculation.depositPercent}%):</span>
                          <span className="font-mono font-bold text-amber-700">£{step.depositCalculation.depositAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Remaining Balance:</span>
                          <span className="font-mono">£{step.depositCalculation.remainingBalance}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stripe Metadata */}
                  {step.stripeMetadata && (
                    <div>
                      <h4 className="text-purple-700 font-semibold mb-3">🏷️ Stripe Customer Metadata</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100">
                          {JSON.stringify(step.stripeMetadata, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Code Snippet */}
                  {step.codeSnippet && (
                    <div>
                      <h4 className="text-indigo-700 font-semibold mb-3">💻 Code Snippet</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100 font-mono whitespace-pre">
                          {step.codeSnippet}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Payment Details */}
                  {step.paymentDetails && (
                    <div className="bg-purple-50 p-5 rounded-lg border border-purple-200">
                      <h4 className="text-purple-700 font-semibold mb-3">💳 Payment Details</h4>
                      <div className="space-y-2">
                        {Object.entries(step.paymentDetails).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-gray-800">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-mono font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Actions */}
                  {step.userActions && (
                    <div>
                      <h4 className="text-blue-700 font-semibold mb-3">👤 User Actions</h4>
                      <ul className="space-y-2">
                        {step.userActions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <Check className="w-4 h-4 text-blue-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Webhook Payload */}
                  {step.webhookPayload && (
                    <div>
                      <h4 className="text-purple-700 font-semibold mb-3">📨 Webhook Payload</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100">
                          {JSON.stringify(step.webhookPayload, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Webhook Processing */}
                  {step.webhookProcessing && (
                    <div>
                      <h4 className="text-amber-700 font-semibold mb-3">⚡ Webhook Processing Steps</h4>
                      <ol className="space-y-2">
                        {step.webhookProcessing.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-amber-700 font-mono">{i + 1}.</span>
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Booking Document */}
                  {step.bookingDocument && (
                    <div>
                      <h4 className="text-green-700 font-semibold mb-3">📄 Created Booking Document</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100">
                          {JSON.stringify(step.bookingDocument, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Availability Update */}
                  {step.availabilityUpdate && (
                    <div>
                      <h4 className="text-green-700 font-semibold mb-3">🗓️ Availability Update</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100">
                          {JSON.stringify(step.availabilityUpdate, null, 2)}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Displayed Info */}
                  {step.displayedInfo && (
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                      <h4 className="text-blue-700 font-semibold mb-3">🎉 Success Page Display</h4>
                      <div className="space-y-2">
                        {Object.entries(step.displayedInfo).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-gray-800">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-mono font-semibold">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {step.actions && (
                    <div>
                      <h4 className="text-blue-700 font-semibold mb-3">🔘 Available Actions</h4>
                      <ul className="space-y-2">
                        {step.actions.map((action, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-700">
                            <Check className="w-4 h-4 text-blue-600" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Backend Code */}
                  {step.backendCode && (
                    <div>
                      <h4 className="text-amber-700 font-semibold mb-3">🔧 Backend Code</h4>
                      <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700">
                        <code className="text-sm text-gray-100 font-mono whitespace-pre">
                          {step.backendCode}
                        </code>
                      </pre>
                    </div>
                  )}

                  {/* Note */}
                  {step.note && (
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                      <p className="text-gray-700">{step.note}</p>
                    </div>
                  )}

                  {/* Redirect URL */}
                  {step.redirectUrl && !step.urlParts && (
                    <div>
                      <h4 className="text-blue-700 font-semibold mb-2">🔗 Redirect</h4>
                      <code className="text-indigo-700 bg-gray-100 px-3 py-2 rounded block overflow-x-auto">
                        {step.redirectUrl}
                      </code>
                    </div>
                  )}

                  {/* URL Parts */}
                  {step.urlParts && (
                    <div>
                      <h4 className="text-blue-700 font-semibold mb-3">🔗 Redirect URL Breakdown</h4>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
                        <div>
                          <span className="text-gray-600">Base URL: </span>
                          <code className="text-indigo-700">{step.urlParts.base}</code>
                        </div>
                        <div>
                          <span className="text-gray-600">Query Parameters: </span>
                          <pre className="mt-2 bg-gray-900 p-2 rounded">
                            <code className="text-sm text-gray-100">
                              {JSON.stringify(step.urlParts.query, null, 2)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Important Timing Notes
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>The webhook (Step 8-10) runs <strong className="text-amber-700">asynchronously</strong> in the background</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>User redirect (Step 11-12) happens <strong className="text-blue-700">simultaneously</strong> but independently</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>The success page may need to retry if booking isn't created yet</span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600">•</span>
              <span>Only <strong className="text-purple-700">30% deposit (£24)</strong> is charged, remaining <strong className="text-green-700">70% (£56)</strong> paid at appointment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}