const TEST_STUDENT_EMAIL = "teststudent@remoteworkhub.org";

type EnrollmentLike = {
  total_paid?: number | null;
  balance_due?: number | null;
  applications?: {
    email?: string | null;
  } | null;
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
