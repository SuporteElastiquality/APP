import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface NewMessageEmailProps {
  recipientName: string
  senderName: string
  messagePreview: string
  conversationUrl: string
}

export const NewMessageEmail = ({
  recipientName,
  senderName,
  messagePreview,
  conversationUrl,
}: NewMessageEmailProps) => (
  <Html>
    <Head />
    <Preview>Nova mensagem de {senderName} - Elastiquality</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://elastiquality.pt/logo.png"
            width="120"
            height="60"
            alt="Elastiquality"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Nova mensagem recebida!</Heading>
        
        <Text style={text}>
          Olá {recipientName},
        </Text>
        
        <Text style={text}>
          Você recebeu uma nova mensagem de <strong>{senderName}</strong> na plataforma Elastiquality.
        </Text>
        
        <Section style={messageContainer}>
          <Text style={messagePreviewText}>
            "{messagePreview.length > 100 ? messagePreview.substring(0, 100) + '...' : messagePreview}"
          </Text>
        </Section>
        
        <Section style={buttonContainer}>
          <Link style={button} href={conversationUrl}>
            Ver Mensagem
          </Link>
        </Section>
        
        <Text style={text}>
          Acesse sua conta para responder à mensagem e continuar a conversa.
        </Text>
        
        <Section style={footer}>
          <Text style={footerText}>
            Esta é uma notificação automática da Elastiquality.
          </Text>
          <Text style={footerText}>
            Se você não deseja receber estas notificações, entre em contato conosco.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  margin: '0 auto',
}

const h1 = {
  color: '#2563eb',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const messageContainer = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const messagePreviewText = {
  color: '#6b7280',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const footer = {
  borderTop: '1px solid #e5e7eb',
  paddingTop: '20px',
  marginTop: '32px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 8px',
}

export default NewMessageEmail
