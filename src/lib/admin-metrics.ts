import { COURSE_TOTAL_GHS } from "@/lib/pricing";

const TEST_STUDENT_EMAIL = "teststudent@remoteworkhub.org";

type EnrollmentLike = {
  total_paid?: number | null;
  balance_due?: number | null;
  application_id?: string | null;
  applications?: {
    id?: string | null;
    email?: string | null;
    payment_reference?: string | null;
  } | null;
};

type PaymentLike = {
  id: string;
  amount_ghs?: number | null;
  status?: string | null;
  application_id?: string | null;
  reference?: string | null;
};

export type EnrollmentMoneyStats = {
  enrolledCount: number;
  totalCollected: number;
  outstandingBalance: number;
  fullyPaidCount: number;
  partialCount: number;
};

export function filterRealEnrollments<T extends EnrollmentLike>(enrollments: T[]): T[] {
  return enrollments.filter(
    (enrollment) => enrollment.applications?.email?.toLowerCase() !== TEST_STUDENT_EMAIL
  );
}

/**
 * Computes financial stats by deriving totals from the actual payments table
 * (single source of truth) rather than from enrollment cached values.
 * This prevents double-counting caused by duplicate webhook/verify calls.
 */
export function computePaymentBasedMoneyStats(
  enrollments: EnrollmentLike[],
  payments: PaymentLike[]
): EnrollmentMoneyStats {
  const paidPayments = payments.filter(
    (p) => p.status === "PAID" || p.status === "SUCCESS"
  );

  const totalCollected = paidPayments.reduce(
    (sum, p) => sum + Number(p.amount_ghs || 0),
    0
  );

  const expectedTotal = enrollments.length * COURSE_TOTAL_GHS;
  const outstandingBalance = Math.max(0, expectedTotal - totalCollected);

  const paidPerApplication = new Map<string, number>();
  for (const p of paidPayments) {
    const appId = p.application_id || "";
    if (appId) {
      paidPerApplication.set(appId, (paidPerApplication.get(appId) || 0) + Number(p.amount_ghs || 0));
    }
  }

  // Also match by payment_reference → payments.reference
  for (const enrollment of enrollments) {
    const paymentRef = enrollment.applications?.payment_reference;
    const appId = enrollment.applications?.id || enrollment.application_id || "";
    if (paymentRef && appId && !paidPerApplication.has(appId)) {
      const refPayment = paidPayments.find((p) => p.reference === paymentRef);
      if (refPayment) {
        paidPerApplication.set(
          appId,
          (paidPerApplication.get(appId) || 0) + Number(refPayment.amount_ghs || 0)
        );
      }
    }
  }

  let fullyPaidCount = 0;
  let partialCount = 0;

  for (const enrollment of enrollments) {
    const appId = enrollment.applications?.id || enrollment.application_id || "";
    const paid = paidPerApplication.get(appId) || 0;
    if (paid >= COURSE_TOTAL_GHS) {
      fullyPaidCount++;
    } else {
      partialCount++;
    }
  }

  return {
    enrolledCount: enrollments.length,
    totalCollected,
    outstandingBalance,
    fullyPaidCount,
    partialCount,
  };
}

/**
 * Per-student paid amount derived from actual payments (not enrollment cache).
 * Returns a map of application_id → total paid.
 */
export function computePerStudentPaid(
  enrollments: EnrollmentLike[],
  payments: PaymentLike[]
): Map<string, { paid: number; balance: number }> {
  const paidPayments = payments.filter(
    (p) => p.status === "PAID" || p.status === "SUCCESS"
  );

  const result = new Map<string, { paid: number; balance: number }>();

  for (const enrollment of enrollments) {
    const appId = enrollment.applications?.id || enrollment.application_id || "";
    const paymentRef = enrollment.applications?.payment_reference;

    if (!appId) continue;

    const seen = new Set<string>();
    let paid = 0;

    for (const p of paidPayments) {
      if (seen.has(p.id)) continue;
      if (p.application_id === appId) {
        seen.add(p.id);
        paid += Number(p.amount_ghs || 0);
      } else if (paymentRef && p.reference === paymentRef) {
        seen.add(p.id);
        paid += Number(p.amount_ghs || 0);
      }
    }

    result.set(appId, {
      paid,
      balance: Math.max(0, COURSE_TOTAL_GHS - paid),
    });
  }

  return result;
}

/**
 * @deprecated Use computePaymentBasedMoneyStats instead.
 * Kept for backward compatibility — reads from enrollment cached values.
 */
export function computeEnrollmentMoneyStats(enrollments: EnrollmentLike[]): EnrollmentMoneyStats {
  const totalCollected = enrollments.reduce(
    (sum, enrollment) => sum + Number(enrollment.total_paid || 0),
    0
  );
  const outstandingBalance = enrollments.reduce(
    (sum, enrollment) => sum + Number(enrollment.balance_due || 0),
    0
  );
  const fullyPaidCount = enrollments.filter(
    (enrollment) => Number(enrollment.balance_due || 0) === 0
  ).length;
  const partialCount = enrollments.filter(
    (enrollment) => Number(enrollment.balance_due || 0) > 0
  ).length;

  return {
    enrolledCount: enrollments.length,
    totalCollected,
    outstandingBalance,
    fullyPaidCount,
    partialCount,
  };
}
