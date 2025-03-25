import * as React from "react";
import {
  Html,
  Body,
  Head,
  Container,
  Preview,
  Section,
  Text,
  Row,
  Column,
  Heading,
  Tailwind,
} from "@react-email/components";

type EmailProps = {
  email: string;
  name: string;
  company: string;
  phone: string;
  message: string;
};

export function Email({ email, name, company, phone, message }: EmailProps) {
  return (
    <Html lang='en'>
      <Head></Head>
      <Preview className='bg-red-400/10'>
        Got a New message from {name} at {company}
      </Preview>
      <Tailwind>
        <Body className='text-white bg-black'>
          <Container>
            <Section>
              <Heading className='text-2xl font-bold text-gray-800'>
                New message from {name} at {company}
              </Heading>
              <Text className='text-white/50 font-primary'>
                Sender&aposs Info -
                <Row>
                  <Column>Name: {name}</Column>
                </Row>
                <Row>
                  <Column>Email: {email}</Column>
                </Row>
                <Row>
                  <Column>Phone: {phone}</Column>
                </Row>
                <Row>
                  <Column>Company: {company}</Column>
                </Row>
              </Text>
              <Text className='text-red-700'>
                <strong>Message:</strong> {message}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email;
