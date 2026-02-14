import { Request, Response } from "express";
import { db } from "../../config/firebase-admin.js";

const COLLECTION = "registrations";
const MAX_DOC_SIZE = 1040000; // ~1MB Firestore limit (leave some margin)

export async function submitTaakra2026(req: Request, res: Response) {
  try {
    const {
      institutionName,
      headDelegate,
      participants,
      selectedCategories,
      paymentMethod,
      paymentProofBase64,
      paymentProofFileName,
      paymentProofMimeType,
      agreements,
      totalFee,
    } = req.body;

    if (!institutionName || !headDelegate || !participants?.length || !selectedCategories?.length) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: institutionName, headDelegate, participants, selectedCategories",
      });
    }

    if (!paymentProofBase64 || typeof paymentProofBase64 !== "string") {
      return res.status(400).json({
        status: "error",
        message: "Payment proof (base64 image) is required",
      });
    }

    const coll = db?.collection?.(COLLECTION);
    if (!coll || typeof coll.add !== "function") {
      return res.status(503).json({
        status: "error",
        message: "Firebase is not configured. Please set FIREBASE credentials in backend.",
      });
    }

    const payload: Record<string, unknown> = {
      source: "taakra_2026",
      institutionName,
      headDelegate,
      participants,
      selectedCategories,
      paymentMethod: paymentMethod || "bank_transfer",
      paymentProofBase64,
      paymentProofFileName: paymentProofFileName || "proof",
      paymentProofMimeType: paymentProofMimeType || "image/jpeg",
      agreements: agreements || {},
      totalFee: totalFee ?? 0,
      createdAt: new Date().toISOString(),
    };
    // Firestore does not allow undefined; remove any
    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    // Firestore document size limit is 1 MiB; base64 can be large
    const payloadSize = JSON.stringify(payload).length;
    if (payloadSize > MAX_DOC_SIZE) {
      return res.status(400).json({
        status: "error",
        message: "Payment proof image is too large. Please use a smaller image (under 500KB) or compress it.",
      });
    }

    const ref = await coll.add(payload);
    console.log(`[Taakra 2026] Saved registration to Firestore collection "${COLLECTION}", id: ${ref.id}`);

    res.status(201).json({
      status: "success",
      message: "Registration submitted successfully",
      data: { id: ref.id },
    });
  } catch (err: any) {
    console.error("Taakra 2026 registration error:", err);
    res.status(500).json({
      status: "error",
      message: err.message || "Failed to save registration",
    });
  }
}
