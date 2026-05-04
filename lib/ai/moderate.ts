import Groq from "groq-sdk";

export type ModerationResult = {
  decision: "approved" | "rejected" | "review";
  reason: string;
};

const SYSTEM_PROMPT = `Ou se yon moderatè otomatik pou platfòm anons PouPiyay (Ayiti).
Ou analize anons pwopriyete epi ou retounen yon desizyon JSON.

Règ:
- APPROVED: anons klè, pri rezonab, kontni apwopriye
- REJECTED: spam, kontni obsèn, pri absid (ex: $1 oswa $999999999), tit san sans
- REVIEW: enkonplè men ka bon (deskripsyon twò kout, manke enfòmasyon enpòtan)

Retounen SÈLMAN JSON sa a (pa ajoute lòt tèks):
{"decision":"approved"|"rejected"|"review","reason":"eksplikasyon kout"}`;

export async function moderateListing(data: {
  title: string;
  description: string;
  property_type: string;
  listing_type: string;
  price_monthly?: number | null;
  price_sale?: number | null;
  commune: string;
}): Promise<ModerationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return { decision: "review", reason: "Groq pa konfigure" };

  try {
    const groq = new Groq({ apiKey });

    const content = `
Tit: ${data.title}
Deskripsyon: ${data.description || "(vid)"}
Tip: ${data.property_type} | ${data.listing_type}
Komin: ${data.commune}
Pri lwaye: ${data.price_monthly ?? "N/A"} | Pri vant: ${data.price_sale ?? "N/A"}
`.trim();

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content },
      ],
      temperature: 0,
      max_tokens: 100,
    });

    const text = response.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(text) as ModerationResult;

    if (!["approved", "rejected", "review"].includes(parsed.decision)) {
      return { decision: "review", reason: "Repons AI envalid" };
    }

    return parsed;
  } catch {
    // Si AI echwe, voye bay admin pou revizyon manyèl
    return { decision: "review", reason: "Erè AI — revizyon manyèl nesesè" };
  }
}
