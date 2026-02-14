import { db } from "../config/firebase-admin.js";
import type { IRegistration } from "../models/Registration.js";

const COLLECTION_NAME = "re";

function toPlain(reg: IRegistration) {
  return {
    _id: reg._id.toString(),
    competition: reg.competition?.toString?.() ?? reg.competition,
    user: reg.user?.toString?.() ?? reg.user,
    teamName: reg.teamName ?? null,
    memberNames: reg.memberNames || [],
    registrationNumber: reg.registrationNumber ?? "",
    status: reg.status ?? "pending",
    approvedBy: reg.approvedBy?.toString?.() ?? reg.approvedBy ?? null,
    approvalDate: reg.approvalDate
      ? (reg.approvalDate as Date).toISOString()
      : null,
    rejectionReason: reg.rejectionReason ?? null,
    paymentStatus: reg.paymentStatus ?? "pending",
    transactionId: reg.transactionId ?? null,
    createdAt: (reg.createdAt as Date).toISOString(),
    updatedAt: (reg.updatedAt as Date).toISOString(),
  };
}

/**
 * Save or overwrite a registration document in Firestore collection "re".
 * Uses MongoDB _id as document id for easy updates.
 */
export async function syncRegistrationToFirebase(
  reg: IRegistration,
): Promise<void> {
  if (!db || typeof db.collection !== "function") return;
  try {
    const ref = db.collection(COLLECTION_NAME).doc(reg._id.toString());
    await ref.set(toPlain(reg));
  } catch (err) {
    console.warn("Firestore sync (registration) failed:", err);
  }
}

/**
 * Update specific fields of a registration in Firestore.
 */
export async function updateRegistrationInFirebase(
  registrationId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  if (!db || typeof db.collection !== "function") return;
  try {
    const ref = db.collection(COLLECTION_NAME).doc(registrationId);
    await ref.update({
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore update (registration) failed:", err);
  }
}
