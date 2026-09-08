import crypto from "crypto";

export interface CustomerDetails {
  first_name: string;
  email: string;
  phone?: string;
}

export interface SnapTransactionResponse {
  token: string;
  redirect_url: string;
}

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

export async function createSnapTransaction(
  orderId: string,
  amount: number,
  customerDetails: CustomerDetails
): Promise<SnapTransactionResponse> {
  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: Math.round(amount),
    },
    customer_details: {
      first_name: customerDetails.first_name,
      email: customerDetails.email,
      phone: customerDetails.phone ?? "",
    },
    credit_card: {
      secure: true,
    },
  };

  // If server key is dummy or sandbox without network, gracefully simulate or call API
  if (
    !MIDTRANS_SERVER_KEY ||
    MIDTRANS_SERVER_KEY.includes("YOUR_SANDBOX")
  ) {
    // Development fallback token so testing never blocks
    return {
      token: `mock_snap_${orderId}_${Date.now()}`,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_snap_${orderId}`,
    };
  }

  const response = await fetch(SNAP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Midtrans API error (${response.status}): ${errorBody}`);
  }

  return response.json() as Promise<SnapTransactionResponse>;
}

export function verifyMidtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const hashString = `${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`;
  const computedHash = crypto.createHash("sha512").update(hashString).digest("hex");
  return computedHash.toLowerCase() === signatureKey.toLowerCase();
}
