import clientPromise from './mongodb';
import { scoreDocument, tokenize } from './similarity';
import { UNKNOWN_RESPONSE } from './chatbot';

// In-memory cache
let cachedData = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

async function fetchDatabaseData() {
  const client = await clientPromise;
  const db = client.db();

  // Find actual collection names in a case-insensitive way
  const allCollections = await db.listCollections().toArray();
  const collNames = allCollections.map(c => c.name.toLowerCase());

  const getCollName = (searchStr) => {
    const coll = allCollections.find(c => c.name.toLowerCase().includes(searchStr));
    return coll ? coll.name : null;
  };

  const productColl = getCollName('product');
  const faqColl = getCollName('faq');
  const shippingColl = getCollName('shipping');
  const policyColl = getCollName('polic');
  const contactColl = getCollName('contact');

  const [products, faqs, shipping, policies, contact] = await Promise.all([
    productColl ? db.collection(productColl).find({}).toArray().catch(() => []) : [],
    faqColl ? db.collection(faqColl).find({}).toArray().catch(() => []) : [],
    shippingColl ? db.collection(shippingColl).find({}).toArray().catch(() => []) : [],
    policyColl ? db.collection(policyColl).find({}).toArray().catch(() => []) : [],
    contactColl ? db.collection(contactColl).find({}).toArray().catch(() => []) : [],
  ]);

  return {
    products,
    faqs,
    shipping,
    policies,
    contact
  };
}

async function getCachedData() {
  const now = Date.now();
  if (!cachedData || (now - lastCacheTime > CACHE_TTL)) {
    try {
      cachedData = await fetchDatabaseData();
      lastCacheTime = now;
    } catch (error) {
      console.error("Error fetching data for chatbot:", error);
      // Fallback to empty if fails
      if (!cachedData) {
        cachedData = { products: [], faqs: [], shipping: [], policies: [], contact: [] };
      }
    }
  }
  return cachedData;
}

export async function searchChatbot(query) {
  const data = await getCachedData();
  const queryTokens = tokenize(query);

  // Basic intents
  const lowerQuery = query.toLowerCase().trim();
  if (['hi', 'hii', 'hello', 'hey', 'greetings'].includes(lowerQuery)) {
    return { type: 'text', text: "Hello! 👋 How can I help you today? You can ask me about our products, shipping, or return policies." };
  }
  if (['thanks', 'thank you', 'ty'].includes(lowerQuery)) {
    return { type: 'text', text: "You're very welcome! Let me know if you need anything else." };
  }
  if (['help', 'support'].includes(lowerQuery)) {
    return { type: 'text', text: "I'm here to help! I can answer questions about our products, ingredients, shipping, and return policies." };
  }

  // Fallback intents for standard e-commerce queries (in case collections are empty)
  if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
    // If the database has shipping info, let the main search engine handle it first by checking if it exists
    if (!data.shipping || data.shipping.length === 0) {
      return { type: 'text', text: "We typically process and ship orders within 1-2 business days. Delivery times vary based on your location. Please check the checkout page for exact shipping times." };
    }
  }

  if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
    if (!data.policies || data.policies.length === 0) {
      return { type: 'text', text: "We accept returns within 7 days of delivery for unused products in their original packaging. Please contact our support team on WhatsApp to initiate a return." };
    }
  }

  if (lowerQuery.includes('contact') || lowerQuery.includes('reach us')) {
    if (!data.contact || data.contact.length === 0) {
      return { type: 'contact', text: "You can reach us at any time using the 'Chat on WhatsApp' button below, or by visiting the contact section on our website." };
    }
  }

  if (queryTokens.length === 0) {
    return { type: 'unknown', text: UNKNOWN_RESPONSE };
  }

  const results = [];

  // Search Priority 1 & 2: Exact Product & Product Keywords
  if (data.products && data.products.length > 0) {
    const productWeights = {
      name: 2.0,
      description: 1.0,
      category: 1.2,
      benefits: 1.0,
      ingredients: 1.5,
      howToUse: 0.8
    };

    for (const product of data.products) {
      const score = scoreDocument(query, product, productWeights);
      if (score > 0.3) {
        results.push({ type: 'product', item: product, score });
      }
    }
  }

  // Search Priority 3: FAQs
  if (data.faqs && data.faqs.length > 0) {
    const faqWeights = { question: 2.0, keywords: 1.5, answer: 0.5 };
    for (const faq of data.faqs) {
      const score = scoreDocument(query, faq, faqWeights);
      if (score > 0.4) {
        results.push({ type: 'faq', item: faq, score });
      }
    }
  }

  // Search Priority 4: Shipping
  if (data.shipping && data.shipping.length > 0) {
    const shippingWeights = { title: 2.0, content: 1.0, keywords: 1.5 };
    for (const ship of data.shipping) {
      const score = scoreDocument(query, ship, shippingWeights);
      if (score > 0.4) {
        results.push({ type: 'shipping', item: ship, score });
      }
    }
  }

  // Search Priority 5: Policies
  if (data.policies && data.policies.length > 0) {
    const policyWeights = { title: 2.0, content: 1.0, keywords: 1.5 };
    for (const policy of data.policies) {
      const score = scoreDocument(query, policy, policyWeights);
      if (score > 0.4) {
        results.push({ type: 'policy', item: policy, score });
      }
    }
  }

  // Search Priority 6: Contact
  if (data.contact && data.contact.length > 0) {
    const contactWeights = { title: 2.0, description: 1.0, keywords: 1.5 };
    for (const c of data.contact) {
      const score = scoreDocument(query, c, contactWeights);
      if (score > 0.4) {
        results.push({ type: 'contact', item: c, score });
      }
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  if (results.length > 0) {
    const topResult = results[0];

    // Format the response based on type
    if (topResult.type === 'product') {
      return {
        type: 'product',
        text: `I found a product that might help: **${topResult.item.name}**`,
        product: {
          _id: topResult.item._id ? topResult.item._id.toString() : 'unknown',
          name: topResult.item.name || topResult.item.title || 'Product',
          price: topResult.item.price,
          description: topResult.item.description || topResult.item.shortDescription,
          benefits: topResult.item.benefits,
          image: topResult.item.image || (topResult.item.images ? topResult.item.images[0] : null),
          slug: topResult.item.slug
        }
      };
    } else if (topResult.type === 'faq') {
      return { type: 'text', text: topResult.item.answer };
    } else if (topResult.type === 'shipping') {
      return { type: 'text', text: topResult.item.content || topResult.item.details };
    } else if (topResult.type === 'policy') {
      return { type: 'text', text: topResult.item.content || topResult.item.details };
    } else if (topResult.type === 'contact') {
      return { type: 'contact', text: topResult.item.description || topResult.item.details || "You can contact us via our contact page." };
    }
  }

  // Search Priority 7: Unknown response
  return { type: 'unknown', text: UNKNOWN_RESPONSE };
}
