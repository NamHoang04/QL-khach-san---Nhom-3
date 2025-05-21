export interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  phoneNumber: string;
  avatar?: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'admin@hotel.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    phoneNumber: '0123456789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
  },
  {
    id: '2',
    email: 'staff@hotel.com',
    password: 'staff123',
    firstName: 'Staff',
    lastName: 'Member',
    role: 'STAFF',
    phoneNumber: '0987654321',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff'
  },
  {
    id: '3',
    email: 'user@hotel.com',
    password: 'user123',
    firstName: 'Regular',
    lastName: 'User',
    role: 'USER',
    phoneNumber: '0123987456',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'
  }
];

// Helper function to find user by email and password
export const findMockUser = (email: string, password: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email && user.password === password);
};

// Helper function to find user by email only
export const findMockUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
}; 