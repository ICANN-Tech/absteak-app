// MongoDB Initialization Script for ABSteak Application
// This script runs when the MongoDB container starts for the first time

print('Starting MongoDB initialization for ABSteak...');

// Switch to the absteak_db database
db = db.getSiblingDB('absteak_db');

// Create application user with read/write permissions
db.createUser({
  user: 'absteak_app',
  pwd: 'absteak_app_password_2024',
  roles: [
    {
      role: 'readWrite',
      db: 'absteak_db'
    }
  ]
});

print('Created application user: absteak_app');

// Create collections with validation schemas

// Users collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'created_at'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'User name is required and must be a string'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Valid email address is required'
        },
        phone: {
          bsonType: 'string',
          description: 'Phone number as string'
        },
        preferences: {
          bsonType: 'object',
          description: 'User preferences object'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp is required'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Last update timestamp'
        }
      }
    }
  }
});

// Reservations collection
db.createCollection('reservations', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user_id', 'date', 'time', 'party_size', 'status', 'created_at'],
      properties: {
        user_id: {
          bsonType: 'objectId',
          description: 'User ID reference is required'
        },
        date: {
          bsonType: 'date',
          description: 'Reservation date is required'
        },
        time: {
          bsonType: 'string',
          description: 'Reservation time is required'
        },
        party_size: {
          bsonType: 'int',
          minimum: 1,
          maximum: 20,
          description: 'Party size must be between 1 and 20'
        },
        status: {
          bsonType: 'string',
          enum: ['pending', 'confirmed', 'cancelled', 'completed'],
          description: 'Status must be one of: pending, confirmed, cancelled, completed'
        },
        special_requests: {
          bsonType: 'string',
          description: 'Special requests or notes'
        },
        contact_info: {
          bsonType: 'object',
          properties: {
            name: { bsonType: 'string' },
            phone: { bsonType: 'string' },
            email: { bsonType: 'string' }
          }
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp is required'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Last update timestamp'
        }
      }
    }
  }
});

// Chat sessions collection
db.createCollection('chat_sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['session_id', 'created_at'],
      properties: {
        session_id: {
          bsonType: 'string',
          description: 'Unique session identifier is required'
        },
        user_id: {
          bsonType: 'objectId',
          description: 'User ID reference (optional for anonymous sessions)'
        },
        messages: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['role', 'content', 'timestamp'],
            properties: {
              role: {
                bsonType: 'string',
                enum: ['user', 'assistant', 'system'],
                description: 'Message role'
              },
              content: {
                bsonType: 'string',
                description: 'Message content'
              },
              timestamp: {
                bsonType: 'date',
                description: 'Message timestamp'
              },
              metadata: {
                bsonType: 'object',
                description: 'Additional message metadata'
              }
            }
          }
        },
        language: {
          bsonType: 'string',
          description: 'Session language preference'
        },
        status: {
          bsonType: 'string',
          enum: ['active', 'completed', 'abandoned'],
          description: 'Session status'
        },
        created_at: {
          bsonType: 'date',
          description: 'Creation timestamp is required'
        },
        updated_at: {
          bsonType: 'date',
          description: 'Last update timestamp'
        }
      }
    }
  }
});

// Analytics collection
db.createCollection('analytics', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['event_type', 'timestamp'],
      properties: {
        event_type: {
          bsonType: 'string',
          description: 'Type of analytics event'
        },
        session_id: {
          bsonType: 'string',
          description: 'Associated session ID'
        },
        user_id: {
          bsonType: 'objectId',
          description: 'Associated user ID'
        },
        data: {
          bsonType: 'object',
          description: 'Event data payload'
        },
        timestamp: {
          bsonType: 'date',
          description: 'Event timestamp is required'
        }
      }
    }
  }
});

print('Created collections with validation schemas');

// Create indexes for better performance

// Users collection indexes
db.users.createIndex({ 'email': 1 }, { unique: true });
db.users.createIndex({ 'created_at': 1 });
db.users.createIndex({ 'name': 'text', 'email': 'text' });

// Reservations collection indexes
db.reservations.createIndex({ 'user_id': 1 });
db.reservations.createIndex({ 'date': 1, 'time': 1 });
db.reservations.createIndex({ 'status': 1 });
db.reservations.createIndex({ 'created_at': 1 });
db.reservations.createIndex({ 'date': 1, 'status': 1 });

// Chat sessions collection indexes
db.chat_sessions.createIndex({ 'session_id': 1 }, { unique: true });
db.chat_sessions.createIndex({ 'user_id': 1 });
db.chat_sessions.createIndex({ 'created_at': 1 });
db.chat_sessions.createIndex({ 'status': 1 });
db.chat_sessions.createIndex({ 'messages.timestamp': 1 });

// Analytics collection indexes
db.analytics.createIndex({ 'event_type': 1 });
db.analytics.createIndex({ 'session_id': 1 });
db.analytics.createIndex({ 'user_id': 1 });
db.analytics.createIndex({ 'timestamp': 1 });
db.analytics.createIndex({ 'event_type': 1, 'timestamp': 1 });

print('Created performance indexes');

// Insert sample data for development
if (db.users.countDocuments() === 0) {
  // Sample users
  const sampleUsers = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      preferences: {
        language: 'en',
        notifications: true,
        dietary_restrictions: ['vegetarian']
      },
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1987654321',
      preferences: {
        language: 'en',
        notifications: false,
        dietary_restrictions: []
      },
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  db.users.insertMany(sampleUsers);
  print('Inserted sample users');
  
  // Sample reservations
  const users = db.users.find().toArray();
  const sampleReservations = [
    {
      user_id: users[0]._id,
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      time: '19:00',
      party_size: 4,
      status: 'confirmed',
      special_requests: 'Window table preferred',
      contact_info: {
        name: 'John Doe',
        phone: '+1234567890',
        email: 'john.doe@example.com'
      },
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      user_id: users[1]._id,
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      time: '20:30',
      party_size: 2,
      status: 'pending',
      special_requests: 'Anniversary dinner',
      contact_info: {
        name: 'Jane Smith',
        phone: '+1987654321',
        email: 'jane.smith@example.com'
      },
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  db.reservations.insertMany(sampleReservations);
  print('Inserted sample reservations');
}

print('MongoDB initialization completed successfully!');
print('Databases: absteak_db, rocketchat');
print('Collections created: users, reservations, chat_sessions, analytics');
print('Indexes created for optimal performance');
print('Sample data inserted for development');