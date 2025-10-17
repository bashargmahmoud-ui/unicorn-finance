const { generateJWTJose } = require('./digitalSignature');

const testPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCj3b3A5lPOLV01
EFjapPiROXwu42ly0RFpFUy+36keT93ye0/FHjJFRca0b8z/EDL6EOpTMDdTV1Tk
CEQ3PrCvbqBrpRtdpQcLrJEFRyExtIsNhoYudUb6f9n1YXgZoqVufvicoRJ/rPc+
YqQADB+U0w/M4EmPW5oTCAyt1aERXmRI3gG18py0eagIxbfp1WO7UsMxaKi2KFre
5m2J/+bInvIQCnmNyLswKkfWPGrP4XkgIeorFIMpXfIQ2Ixx53gx/vDBhef8u0QK
lx2/LdJTdRGUPkN7LF9XKUirY22f0a3MrrC5znQijkeHPLS5qNUhww+QexoSYxVP
/L7JCT77AgMBAAECggEACPgDAcLZhWhgOJ5LbrQm0rQFwv85b0pYHJtI1w2g0QLo
D/SF2jEb6US3anrQConVcHBqkuEJtisKf2ygZzGsM/3nE902kTqOFyp7yYEqJPFP
xw6822AZ4W4L/O03yJdpXJHgg5ohTBGoeqaleUcwl1GyBLGl9Q27ch03rHAL38pn
YJYP3Cxu37M39orVNZZpsmTqawMiecS8oFpWLw/x+9EegD0AuQ1k9noG/4nIBoBb
ZrAjKSNfoV8DcMZc2tBg0HZl+Std3fFm+v6LqaUS9winTjE5gIjfxJ1liL5abjVh
lPi10KYjg+c420mJS8jwi3k0lGULso2shfw5fZi4sQKBgQDKGYUJWl2EMYEBp505
CH+gcPJc6nX2oYxaYYKBJkUWH139kGIs5q/ccEDVQxauJXpmw4AGF0QjOCzUTW1c
Y9OXVFlRzCDUlhX0myHKoobuEKMpHONY/atX2xmseGCBqIk5dzWMXM7n/uaaSopY
uZmrrGfBzvckGNmi3L3xI1EjIwKBgQDPkc4gPHHWDsa3PVh5JAU9Dz1MqS73rAnz
/m2FFyRLgP6PM2ZJORwCXzU1FftyR3VH9OUhk+IE9xHMfUb1ctV1CfOq1i6wrP8G
wOyI+1dqJCiY1GHcThaYwbSIa4snBO2LpXTyTt7ZSTa3jJoNZnTpDePB1Ia81kES
1xu6LSl+SQKBgFRJwm99LcWFc/2Br5Pq1HfQw3Q3IQ3EoKnNQ0Wj9WpdmLC5OAjs
CWqRsqh/O4VUAjG71bg0melqc1/0DulahRP3TO1Nil+/XNbQoI5HrKi7baEm+DbU
TVLuAU4qQm2xIdJCwqWQy4Z8jCbLcdnBRrMPy5JMREzcxGAlWl6o0R0rAoGAZlhk
JCzpjDw46vzKdOC33IV5GiWJTQF83tuisK7abIgr+/vCAXSxRNIg8A3or05gm5w6
pjW+iegw1H0o0blPWqgPhzqYRvDlxjS17EzRqzos8j42CmROa/+GvoUYVaLuZZ6t
bRRKeSTKX/JpuxW7q3X3yQi7brzN1TZPK5s9DFECgYEArEPHij8o3M7v6OxXDGif
wGZh+0AsWfLCYXlC7TBS7wTmXRIOm4u9BtBDfwKhDe4NY6q4ZF2s42ZBHgvvDkU+
9iW/Czuj8SVXcz2UWgYJYw+mDh8rjHhEt4T/ruxTY1f/cmiMalBSbgBg6BoGg4yX
XvRRBcJAqdRnTlFGS4T6RCg=
-----END PRIVATE KEY-----`;

describe('digitalSignature', () => {
  describe('generateJWTJose', () => {
    it('should generate a valid JWT signature with RS256 algorithm', async () => {
      const testBody = {
        requestedExecutionDate: '2024-01-15',
        paymentIdentifiers: {
          endToEndId: 'UF1234567890',
        },
        transferType: 'CREDIT',
        value: {
          currency: 'USD',
          amount: '100.00',
        },
      };

      const signature = await generateJWTJose(testBody, testPrivateKey);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.split('.').length).toBe(3);
    });

    it('should generate different signatures for different payloads', async () => {
      const body1 = { data: 'test1' };
      const body2 = { data: 'test2' };

      const signature1 = await generateJWTJose(body1, testPrivateKey);
      const signature2 = await generateJWTJose(body2, testPrivateKey);

      expect(signature1).not.toBe(signature2);
    });

    it('should include the correct header in the JWT', async () => {
      const testBody = { test: 'data' };

      const signature = await generateJWTJose(testBody, testPrivateKey);
      const parts = signature.split('.');
      const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());

      expect(header.alg).toBe('RS256');
    });

    it('should include the payload in the JWT', async () => {
      const testBody = { test: 'data', amount: '50.00' };

      const signature = await generateJWTJose(testBody, testPrivateKey);
      const parts = signature.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

      expect(payload.test).toBe('data');
      expect(payload.amount).toBe('50.00');
    });

    it('should throw error with invalid private key', async () => {
      const testBody = { test: 'data' };
      const invalidKey = 'invalid-key';

      await expect(generateJWTJose(testBody, invalidKey)).rejects.toThrow();
    });

    it('should handle empty body object', async () => {
      const emptyBody = {};

      const signature = await generateJWTJose(emptyBody, testPrivateKey);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
      expect(signature.split('.').length).toBe(3);
    });

    it('should handle complex nested objects in body', async () => {
      const complexBody = {
        level1: {
          level2: {
            level3: {
              data: 'nested',
              array: [1, 2, 3],
            },
          },
        },
      };

      const signature = await generateJWTJose(complexBody, testPrivateKey);

      expect(signature).toBeDefined();
      expect(typeof signature).toBe('string');
    });

    it('should handle body with special characters', async () => {
      const bodyWithSpecialChars = {
        name: 'Test & Company™',
        description: 'Special chars: é, ñ, 中文',
      };

      const signature = await generateJWTJose(bodyWithSpecialChars, testPrivateKey);

      expect(signature).toBeDefined();
      const parts = signature.split('.');
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      expect(payload.name).toBe('Test & Company™');
    });

    it('should generate consistent signatures for same input', async () => {
      const testBody = { test: 'consistency' };

      const signature1 = await generateJWTJose(testBody, testPrivateKey);
      const signature2 = await generateJWTJose(testBody, testPrivateKey);

      expect(signature1).toBe(signature2);
    });
  });
});
