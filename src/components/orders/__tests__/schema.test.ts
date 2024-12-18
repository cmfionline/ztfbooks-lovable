import { describe, it, expect } from 'vitest';
import { orderSchema } from '../schema';

describe('Order Schema', () => {
  it('validates correct order data', () => {
    const validData = {
      status: 'pending',
      payment_status: 'pending',
      notes: 'Test notes',
    };

    const result = orderSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('validates required fields', () => {
    const invalidData = {
      notes: 'Test notes',
    };

    const result = orderSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates status enum values', () => {
    const invalidData = {
      status: 'invalid_status',
      payment_status: 'pending',
    };

    const result = orderSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates payment_status enum values', () => {
    const invalidData = {
      status: 'pending',
      payment_status: 'invalid_payment_status',
    };

    const result = orderSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('allows optional notes field', () => {
    const validData = {
      status: 'pending',
      payment_status: 'pending',
    };

    const result = orderSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});