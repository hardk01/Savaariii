import { useState } from 'react';

export default function Home() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [response, setResponse] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);

  const sendOTP = async () => {
    if (!mobile) {
      alert('Please enter a valid mobile number');
      return;
    }

    try {
      const res = await fetch('/api/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse('OTP sent successfully');
        setIsOTPSent(true);
      } else {
        setResponse(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setResponse('Error sending OTP');
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      alert('Please enter the OTP');
      return;
    }

    try {
      const res = await fetch(`/api/verify-otp?mobile=${mobile}&otp=${otp}`, {
        method: 'GET',
      });

      const data = await res.json();
      setResponse(JSON.stringify(data));
    } catch (error) {
      setResponse('Error verifying OTP');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Mobile OTP Verification</h2>

      <div>
        <label>Mobile Number:</label>
        <input
          type="text"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Enter mobile number"
          style={{ marginBottom: '10px' }}
        />
        <button onClick={sendOTP}>Send OTP</button>
      </div>

      {isOTPSent && (
        <div style={{ marginTop: '20px' }}>
          <label>OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{ marginBottom: '10px' }}
          />
          <button onClick={verifyOTP}>Verify OTP</button>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Response:</h3>
        <pre>{response}</pre>
      </div>
    </div>
  );
}
