import { Voucher } from '../types';

export const trackVoucherPerformance = (operation: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log performance metrics
  console.log(`Voucher ${operation} took ${duration}ms`);
  
  // In a production environment, you would send this to your monitoring service
  if (window.performance && window.performance.mark) {
    window.performance.mark(`voucher-${operation}-end`);
    window.performance.measure(
      `voucher-${operation}`,
      `voucher-${operation}-start`,
      `voucher-${operation}-end`
    );
  }
};

export const trackVoucherError = (error: Error, context: any) => {
  // Log error with context
  console.error('Voucher System Error:', {
    error: error.message,
    stack: error.stack,
    context
  });
  
  // In a production environment, you would send this to your error tracking service
};

export const measureVoucherMetrics = (vouchers: Voucher[]) => {
  return {
    totalVouchers: vouchers.length,
    activeVouchers: vouchers.filter(v => v.status === 'active').length,
    redeemedVouchers: vouchers.filter(v => v.redeemed).length,
    averageAmount: vouchers.reduce((acc, v) => acc + v.total_amount, 0) / vouchers.length
  };
};