const http = require('http');

function post(path, data, port = 8000) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: port,
      path: path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 90000,
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log('Testing patient chat...');
  try {
    const r = await post('/api/therapy-chat', {
      session_id: '00000000-0000-0000-0000-000000000001',
      message: 'Hello, I am a patient',
      user_type: 'patient',
      user_context: { name: 'TestPatient', email: 'testpatient@app.test' },
    });
    console.log('Status:', r.status);
    console.log('Body:', r.body.substring(0, 500));
  } catch(e) {
    console.log('Error:', e.message);
  }
})();
