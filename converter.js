const express = require('express');
const app = express();
const PORT = 5000;

// --- Your Provided Conversion Functions ---

function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

// --- End of Your Functions ---

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @route POST /api/convert
 * @desc Converts a value from one temperature scale to another.
 * @body { "from": "celsius", "to": "fahrenheit", "value": 100 }
 */
app.post('/api/convert', (req, res) => {
  const { from, to, value } = req.body;

  // Q2 Failure Scenario: Input validation
  if (typeof from !== 'string' || typeof to !== 'string' || typeof value !== 'number') {
    return res.status(400).json({
      error: 'Validation failed: "from" (string), "to" (string), and "value" (number) are required.',
    });
  }

  let celsiusValue;
  
  // 1. Convert initial value to a common base (Celsius)
  switch (from.toLowerCase()) {
    case 'celsius':
      celsiusValue = value;
      break;
    case 'fahrenheit':
      celsiusValue = fahrenheitToCelsius(value);
      break;
    case 'kelvin':
      celsiusValue = kelvinToCelsius(value);
      break;
    default:
      return res.status(400).json({ error: 'Invalid "from" unit. Use celsius, fahrenheit, or kelvin.' });
  }

  // 2. Convert from Celsius to the target unit
  let result;
  switch (to.toLowerCase()) {
    case 'celsius':
      result = celsiusValue;
      break;
    case 'fahrenheit':
      result = celsiusToFahrenheit(celsiusValue);
      break;
    case 'kelvin':
      result = celsiusToKelvin(celsiusValue);
      break;
    default:
      return res.status(400).json({ error: 'Invalid "to" unit. Use celsius, fahrenheit, or kelvin.' });
  }

  // Q2 Success Scenario
  res.status(200).json({
    fromUnit: from.toLowerCase(),
    toUnit: to.toLowerCase(),
    originalValue: value,
    result: result,
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found. Use POST /api/convert' });
});

// This logic allows the app to be imported for testing without starting the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Conversion API server running on http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;

