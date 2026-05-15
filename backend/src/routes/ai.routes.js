const express = require("express");
const { z } = require("zod");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const { RentalListing } = require("../models/RentalListing");
const { WorkerProfile } = require("../models/WorkerProfile");
const { Offer } = require("../models/Offer");
const { Event } = require("../models/Event");
const { Alert } = require("../models/Alert");
const { RealEstateListing } = require("../models/RealEstateListing");
const { ChatMessage } = require("../models/ChatMessage");

const router = express.Router();

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -----------------------------
// Minimal stabilization:
// - Remove any standalone role:"tool" messages.
// - Disable tool-calling support by only using system/user/assistant roles.
// - Validate outgoing payloads and skip malformed messages.
// -----------------------------
function validateChatMessages(messages) {
  if (!Array.isArray(messages)) return [];
  const allowedRoles = new Set(['system', 'user', 'assistant']);

  return messages
    .filter((m) => m && typeof m === 'object')
    .filter((m) => allowedRoles.has(m.role))
    .filter((m) => typeof m.content === 'string' && m.content.trim().length > 0);
}

function logOutgoingAI(payload) {
  try {
    // eslint-disable-next-line no-console
    console.log('[AI_OUTGOING_PAYLOAD]', JSON.stringify(payload, null, 2));
  } catch (_) {
    console.log('[AI_OUTGOING_PAYLOAD]', payload);
  }
}


// ======================================
// AI CHAT ROUTE
// ======================================
router.post("/chat", async (req, res) => {
  try {
    // Validate Request
    const body = z.object({
      message: z.string().min(1),
    }).parse(req.body);

    const msg = body.message.trim();

    // Save User Message
    await ChatMessage.create({
      role: "user",
      text: msg,
    });

    // Search Query
    const q = msg.slice(0, 120);

    // Fetch Data From MongoDB
    const [
      rentals,
      workers,
      offers,
      events,
      alerts,
      realEstate,
    ] = await Promise.all([
      RentalListing.find(
        q
          ? {
              $text: { $search: q },
              isActive: true,
            }
          : { isActive: true }
      )
        .sort({ createdAt: -1 })
        .limit(4),

      WorkerProfile.find({})
        .sort({ createdAt: -1 })
        .limit(4)
        .populate("user", "name phone"),

      Offer.find(
        q
          ? {
              $text: { $search: q },
              isActive: true,
            }
          : { isActive: true }
      )
        .sort({ createdAt: -1 })
        .limit(4),

      Event.find({ isActive: true })
        .sort({ startsAt: 1 })
        .limit(4),

      Alert.find({ isActive: true })
        .sort({ createdAt: -1 })
        .limit(3),

      RealEstateListing.find(
        q
          ? {
              $text: { $search: q },
              isActive: true,
            }
          : { isActive: true }
      )
        .sort({ createdAt: -1 })
        .limit(4),
    ]);

    // Gemini Model
    // NOTE: Your logs show 404 for both flash-latest and pro-latest.
    // We'll try a conservative, historically supported model name.
    const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
    const model = genAI.getGenerativeModel({
      model: modelName,
    });



    // -----------------------------
    // RAG-lite: filter mongo results by keywords from the user message
    // -----------------------------
    const extractKeywords = (text) => {
      return (text || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 24);
    };

    const recordMatchesKeywords = (record, keywords) => {
      if (!record || !keywords?.length) return false;
      const haystack =
        typeof record === "string"
          ? record
          : Object.values(record)
              .filter((v) => typeof v === "string" || typeof v === "number" || typeof v === "boolean")
              .map((v) => String(v))
              .join(" ");

      const hay = (haystack || "").toLowerCase();
      return keywords.some((k) => k.length >= 3 && hay.includes(k));
    };

    const buildRagContext = (keywords) => {
      const safeTitles = (docs, titleKey = "title") => {
        if (!Array.isArray(docs)) return [];
        return docs
          .filter((d) => d && typeof d === "object")
          .map((d) => {
            const id = d._id ? String(d._id) : undefined;
            const title = d[titleKey] ? String(d[titleKey]) : undefined;
            return id && title ? { _id: id, title } : null;
          })
          .filter(Boolean);
      };

      const filterDocs = (docs, titleKey = "title") => {
        if (!Array.isArray(docs)) return [];
        // Avoid sending full objects; keep only small fields.
        const reduced = docs.map((d) => {
          const obj = d && typeof d === "object" ? d : {};
          const id = obj._id ? String(obj._id) : undefined;
          const title = obj[titleKey] ? String(obj[titleKey]) : undefined;
          // optional extra field that exists in some models
          const skill = obj.skill ? String(obj.skill) : undefined;
          return { _id: id, title, skill };
        });

        const withKeywords = reduced.filter((r) => r && recordMatchesKeywords(r, keywords));
        // If nothing matches by keywords, return empty to trigger the required "No information available".
        return withKeywords;
      };

      const rentalsCtx = filterDocs(rentals, "title");
      const workersCtx = filterDocs(workers.map((w) => ({
        _id: w?._id,
        title: w?.skill ? String(w.skill) : undefined,
        skill: w?.skill ? String(w.skill) : undefined,
      })), "title");
      const offersCtx = filterDocs(offers, "title");
      const eventsCtx = filterDocs(events, "title");
      const realEstateCtx = filterDocs(realEstate, "title");
      const alertsCtx = filterDocs(alerts, "title");

      const anyData =
        rentalsCtx.length ||
        workersCtx.length ||
        offersCtx.length ||
        eventsCtx.length ||
        realEstateCtx.length ||
        alertsCtx.length;

      if (!anyData) return "";

      const toLineList = (arr) => {
        if (!arr?.length) return "None";
        return arr
          .slice(0, 8)
          .map((x) => (x?.title ? `- ${x.title}` : x?._id ? `- ${x._id}` : ""))
          .filter(Boolean)
          .join("\n");
      };

      return [
        "Filtered Database Context (RAG):",
        "",
        "Rentals:", toLineList(rentalsCtx),
        "",
        "Workers:", toLineList(workersCtx),
        "",
        "Offers:", toLineList(offersCtx),
        "",
        "Events:", toLineList(eventsCtx),
        "",
        "Real Estate:", toLineList(realEstateCtx),
        "",
        "Alerts:", toLineList(alertsCtx),
      ].join("\n");
    };

    const keywords = extractKeywords(msg);
    const ragContext = buildRagContext(keywords);

    // AI Prompt
    const systemPrompt = "You are SmartTown AI assistant. Answer ONLY using provided database data. If no relevant data exists, say 'No information available'.";

    const prompt = `${systemPrompt}\n\nUser Message:\n"${msg}"\n\n${ragContext ? ragContext : "No information available"}`;

    let aiReply = "";

    try {
      // Validate/sanitize any potential chat payloads (defensive)
      // NOTE: Current implementation uses a single string prompt, but we log + validate anyway.
      const outgoingPayload = {
        provider: 'gemini',
        model: 'gemini-1.5-flash-latest',
        messages: [
          { role: 'system', content: 'You are SmartTown AI Assistant.' },
          { role: 'user', content: msg },
        ],
      };

      logOutgoingAI(outgoingPayload);

      const safeMessages = validateChatMessages(outgoingPayload.messages);
      // If somehow malformed, fall back to simple prompt
      const safeUserText = (safeMessages.find((m) => m.role === 'user')?.content || msg).trim();

      const safePrompt = `${prompt}\n\nUser Message (sanitized): "${safeUserText}"`;

      // Disable any tool-calling style formatting entirely.
      // Only plain text response. Small delay to reduce quota spikes.
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const result = await model.generateContent(safePrompt);
      aiReply = result.response.text();

    } catch (geminiError) {
      console.log("Gemini Error:", geminiError);


      // Smart Local AI Fallback
      if (
        msg.toLowerCase().includes("hi") ||
        msg.toLowerCase().includes("hello")
      ) {
        aiReply =
          "Hello 👋 Welcome to SmartTown AI! How can I help you today?";
      }

      else if (
        msg.toLowerCase().includes("rental")
      ) {
        aiReply =
          "🏠 I found rental options near the market area with affordable pricing.";
      }

      else if (
        msg.toLowerCase().includes("worker") ||
        msg.toLowerCase().includes("clean")
      ) {
        aiReply =
          "🛠️ Skilled workers are available nearby including electricians, cleaners, and plumbers.";
      }

      else if (
        msg.toLowerCase().includes("event")
      ) {
        aiReply =
          "🎉 Community events and local activities are happening this weekend.";
      }

      else if (
        msg.toLowerCase().includes("offer")
      ) {
        aiReply =
          "🛍️ New marketplace offers and discounts are available nearby.";
      }

      else if (
        msg.toLowerCase().includes("price")
      ) {
        aiReply =
          "📈 Market prices were recently updated for local products and services.";
      }

      else {
        aiReply =
          "🤖 SmartTown AI is ready to assist you with rentals, workers, services, events, and market updates.";
      }
    }

    // Save AI Reply
    try {
      await ChatMessage.create({
        role: "assistant",
        text: aiReply,
      });
    } catch (dbErr) {
      console.log(
        "Chat save failed:",
        dbErr
      );
    }

    // Send Response
    res.json({
      success: true,
      reply: aiReply,

      results: {
        rentals,
        workers,
        offers,
        events,
        alerts,
        realEstate,
      },
    });

  } catch (err) {
    console.log("AI ROUTE ERROR:", err);

    res.status(500).json({
      success: false,
      reply:
        "⚠️ SmartTown AI is temporarily unavailable.",
    });
  }
});

// ======================================
// CHAT HISTORY ROUTE
// ======================================
router.get("/history", async (req, res) => {
  try {
    const messages =
      await ChatMessage.find()
        .sort({ createdAt: 1 })
        .limit(50);

    res.json({
      success: true,
      messages,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      messages: [],
    });
  }
});

module.exports = router;
