'use client';

export default function EnvCheck() {
  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-900 text-white p-2 rounded text-xs">
      <div>Client ID: {clientId ? '✅ Loaded' : '❌ Missing'}</div>
      {clientId && <div>Length: {clientId.length}</div>}
    </div>
  );
}
