// utils/coupons.ts
export const coupons = [
    { code: "SAVE10", discount: 10 },
    { code: "SAVE20", discount: 20 },
    { code: "SAVE30", discount: 30 },
  ];
  
  /**
   * Validate the coupon code and return the discount percentage.
   * @param code - The coupon code entered by the user.
   * @returns Discount percentage or null if invalid.
   */
  export const getDiscountFromCoupon = (code: string): number | null => {
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    return coupon ? coupon.discount : null;
  };
  
  