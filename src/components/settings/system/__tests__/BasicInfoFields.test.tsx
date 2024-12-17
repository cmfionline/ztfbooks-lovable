import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BasicInfoFields } from '../components/BasicInfoFields';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { GlobalSettingsData } from '../types';

const formSchema = z.object({
  site_name: z.string(),
  contact_email: z.string(),
  support_phone: z.string(),
  logos: z.object({
    admin: z.string().nullable(),
    client: z.string().nullable(),
  }),
});

describe('BasicInfoFields', () => {
  it('renders all form fields', () => {
    const form = useForm<GlobalSettingsData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        site_name: '',
        contact_email: '',
        support_phone: '',
        logos: {
          admin: null,
          client: null,
        },
      },
    });

    render(
      <Form {...form}>
        <BasicInfoFields form={form} />
      </Form>
    );

    expect(screen.getByLabelText(/site name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/support email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/support phone/i)).toBeInTheDocument();
  });

  it('displays provided values', () => {
    const form = useForm<GlobalSettingsData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        site_name: 'Test Site',
        contact_email: 'test@example.com',
        support_phone: '1234567890',
        logos: {
          admin: null,
          client: null,
        },
      },
    });

    render(
      <Form {...form}>
        <BasicInfoFields form={form} />
      </Form>
    );

    expect(screen.getByDisplayValue('Test Site')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
  });
});