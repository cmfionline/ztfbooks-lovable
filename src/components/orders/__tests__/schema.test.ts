import { describe, it, expect } from 'vitest';
import { orderSchema } from '../schema';

describe('Order Schema', () => {
  it('validates correct order data', () => {
    const validOrder = {
      id: '123',
      user_id: 'user123',
      status: 'pending',
      total_amount: 100,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = orderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('requires all mandatory fields', () => {
    const invalidOrder = {
      id: '123'
    };

    const result = orderSchema.safeParse(invalidOrder);
    expect(result.success).toBe(false);
  });

  it('validates status enum values', () => {
    const orderWithInvalidStatus = {
      id: '123',
      user_id: 'user123',
      status: 'invalid-status',
      total_amount: 100,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = orderSchema.safeParse(orderWithInvalidStatus);
    expect(result.success).toBe(false);
  });

  it('validates total_amount is positive', () => {
    const orderWithNegativeAmount = {
      id: '123',
      user_id: 'user123',
      status: 'pending',
      total_amount: -100,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const result = orderSchema.safeParse(orderWithNegativeAmount);
    expect(result.success).toBe(false);
  });
});