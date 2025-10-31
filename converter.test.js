const request = require('supertest');
const app = require('./converter.js'); // Import the Express app

// Test Suite for Q2: Temperature Conversion API
describe('POST /api/convert', () => {

  // Test Case 1: Celsius to Fahrenheit (Successful Scenario)
  it('should convert 0 Celsius to 32 Fahrenheit', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'celsius', to: 'fahrenheit', value: 0 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(32);
  });

  // Test Case 2: Fahrenheit to Celsius (Successful Scenario)
  it('should convert 32 Fahrenheit to 0 Celsius', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'fahrenheit', to: 'celsius', value: 32 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(0);
  });

  // Test Case 3: Kelvin to Celsius (Successful Scenario)
  it('should convert 273.15 Kelvin to 0 Celsius', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'kelvin', to: 'celsius', value: 273.15 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(0);
  });

  // Test Case 4: Kelvin to Fahrenheit (Chained conversion) (Successful Scenario)
  it('should convert 273.15 Kelvin to 32 Fahrenheit', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'kelvin', to: 'fahrenheit', value: 273.15 });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.result).toBe(32);
  });

  // Test Case 5: Missing 'value' (Failure Scenario)
  it('should return 400 if "value" is missing or not a number', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'celsius', to: 'fahrenheit' }); // 'value' is missing
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Validation failed');
  });

  // Test Case 6: Missing 'from' (Failure Scenario)
  it('should return 400 if "from" is missing', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ to: 'fahrenheit', value: 100 }); // 'from' is missing
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toContain('Validation failed');
  });

  // Test Case 7: Invalid 'to' unit (Failure Scenario)
  it('should return 400 if "to" unit is invalid', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'celsius', to: 'gallons', value: 100 });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid "to" unit. Use celsius, fahrenheit, or kelvin.');
  });

  // Test Case 8: Invalid 'from' unit (Failure Scenario)
  it('should return 400 if "from" unit is invalid', async () => {
    const res = await request(app)
      .post('/api/convert')
      .send({ from: 'liters', to: 'celsius', value: 100 });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid "from" unit. Use celsius, fahrenheit, or kelvin.');
  });
});

// Test Suite for 404
describe('GET /invalid-route', () => {
  it('should return 404 Not Found', async () => {
    const res = await request(app).get('/some-random-path');
    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Not Found. Use POST /api/convert');
  });
});

