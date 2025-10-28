import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  subject?: string;
  message: string;
  service: string;
}

export function ContactEmailTemplate({ name, email, subject, message, service }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', color: '#111827' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>New Contact Message</h1>
      <p style={{ margin: '4px 0' }}><strong>Name:</strong> {name}</p>
      <p style={{ margin: '4px 0' }}><strong>Email:</strong> {email}</p>
      <p style={{ margin: '4px 0' }}><strong>Service:</strong> {service}</p>
      {subject && <p style={{ margin: '4px 0' }}><strong>Subject:</strong> {subject}</p>}
      <div style={{ marginTop: '12px', padding: '12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 8 }}>
        <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}



