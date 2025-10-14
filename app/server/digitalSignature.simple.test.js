import { describe, it, expect } from 'vitest';
import { generateJWTJose } from './digitalSignature.js';

describe('digitalSignature', () => {
  const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1+fWIcPm15A8+raZ4gZbxN+ky/3o3D5hM3T1VGXzd1y5Hb
VbkNgSxLKwdKlCXmJk1VaxDsblQZ5nGLPVoRLQKH5yQJNhkIpq5xI2C1P0y+mZVu
gqg0v1WLqHdQFlKKhCqbO72IvQ8jVvS8F3j2YJaXCXO7sPaFCJjYUJcVCHN15Pjk
Rv8eGIpkRRYTtX9CjEvN4i0uLQoqhq6mGOaLjaNZ3p9pPxVL8FJ8x1wWCQlJCjJR
YbC8VrJw7nYeW7x2gJqxZqvjYU3V6NkEF1UuXmMQGf0sPqR0NTBuXvZn7kKBdKqC
z4FkL5H5AgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV
laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8
sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H
mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY
dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw
ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8JtPxP0GRJ+IQkX2
62jM3mEeL3KYz7cLHbQqz8QdS5a2s8a4fFXi5cC3dWj9D3vJ3hAL3KWlnZKLvxNA
eWuKLJ0jXx9FJqUhCPNr2Rl8quBoQHUiMNR8xBPZmqmR8BhZSJFPKdRn7lDpvZXt
qiZJYJPmRpPxYqZYxXZMgkDSLxkCgYEAyNQPOD0AJb3WbRaJq8b+vk3YEqJNJpR0
F+pDCsQcZJ8UD3Nwf8xLUJoULw3XJ3eR8aEqD3y7wPJjpKBtCRaWjJCK7nM6aLIz
8WYmfmvVBJmMTFmM/zfb9CY+HbRxCvhJvUh3F9Q8mKA5/DU+jxOLbdBBNh5UdPhZ
cQC8OO5fqf0CgYEArlRU9UqYtE3KXHpqLi7x0sWbLQDW5W3TmVvvXKVGpDjWvCOH
J5Tt4oPX0TFLFl+xDvBYH4dQCJpWP7LAJl2qYHfBWBJEkL1EGk3kzIZJUfvvNMfX
PGPSKfCqkqF3kNYvJJvGHqwLG7+yqzKdQChQMNxZs4s8nBvKTYBLxPvHHsECgYBU
dWwQMBxgL/TFLbpE7UjJpHn8rvAIqPSqONJcWkQbBxVnO5JiJ3aBB0xZQRD2HSFG
xQPeWCvOa8d5Z2cIQqvKLLLJ2LPPJi3SQJWvXGZPEqJYCKE1BwAV3qFJPuJzJRdC
lNQh8HN5JvqJJp7u4o5YvDQQCH+8bxjnNTvMlWRqrQKBgQCCW3Y5/D3GCZjC8JoR
O7UDJevgqXWHPMDSkB1QYRvWF8t5aEJRuJLaQJt6EL6Qc7UaYOALqCJUdELe5dPG
LQJBdJQY5iRJPJYqHbJwQU7Pq5FIQP8qb9p1JRJH2PbTQEPYr1rUKrqLW2J2vQqv
a0QWfJbGxQHKL6vLdQ1TvCgmHw==
-----END PRIVATE KEY-----`;

  describe('generateJWTJose', () => {
    it('should generate a valid JWT with RS256 algorithm', async () => {
      const payload = { paymentId: '123', amount: 100 };
      
      const jwt = await generateJWTJose(payload, testPrivateKey);
      
      expect(jwt).toBeTruthy();
      expect(typeof jwt).toBe('string');
      expect(jwt.split('.')).toHaveLength(3); // header.payload.signature format
    });

    it('should create JWT with correct header algorithm', async () => {
      const payload = { paymentId: '123' };
      
      const jwt = await generateJWTJose(payload, testPrivateKey);
      
      const headerBase64 = jwt.split('.')[0];
      const headerJson = Buffer.from(headerBase64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
      const header = JSON.parse(headerJson);
      
      expect(header.alg).toBe('RS256');
    });

    it('should include the body payload in the JWT', async () => {
      const payload = { 
        paymentId: '123', 
        amount: 100,
        currency: 'USD' 
      };
      
      const jwt = await generateJWTJose(payload, testPrivateKey);
      
      const payloadBase64 = jwt.split('.')[1];
      const payloadJson = Buffer.from(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
      const decodedPayload = JSON.parse(payloadJson);
      
      expect(decodedPayload.paymentId).toBe('123');
      expect(decodedPayload.amount).toBe(100);
      expect(decodedPayload.currency).toBe('USD');
    });

    it('should throw error with invalid private key format', async () => {
      const payload = { paymentId: '123' };
      const invalidKey = 'not-a-valid-key';
      
      await expect(
        generateJWTJose(payload, invalidKey)
      ).rejects.toThrow();
    });

    it('should throw error with empty key', async () => {
      const payload = { paymentId: '123' };
      
      await expect(
        generateJWTJose(payload, '')
      ).rejects.toThrow();
    });

    it('should handle complex nested payment payload', async () => {
      const complexPayload = {
        endToEndId: 'UF1633024800000',
        requestedExecutionDate: '2024-10-14',
        transferType: 'CREDIT',
        debtor: {
          accountNumber: '987654321',
          routingNumber: '021000021',
        },
        creditor: {
          accountNumber: '123456789',
          routingNumber: '021000021',
        },
        instructedAmount: {
          amount: '100.00',
          currency: 'USD'
        }
      };
      
      const jwt = await generateJWTJose(complexPayload, testPrivateKey);
      
      expect(jwt).toBeTruthy();
      expect(jwt.split('.')).toHaveLength(3);
    });

    it('should generate different signatures for different payloads', async () => {
      const payload1 = { paymentId: '123' };
      const payload2 = { paymentId: '456' };
      
      const jwt1 = await generateJWTJose(payload1, testPrivateKey);
      const jwt2 = await generateJWTJose(payload2, testPrivateKey);
      
      expect(jwt1).not.toBe(jwt2);
    });

    it('should handle empty payload object', async () => {
      const emptyPayload = {};
      
      const jwt = await generateJWTJose(emptyPayload, testPrivateKey);
      
      expect(jwt).toBeTruthy();
      expect(jwt.split('.')).toHaveLength(3);
    });
  });
});
