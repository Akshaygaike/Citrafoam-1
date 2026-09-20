import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Citrafoam database...\n");

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create test user with hashed password
  const passwordHash = await bcrypt.hash("citra123", 10);
  const testUser = await prisma.user.create({
    data: {
      email: "test@citrafoam.com",
      name: "Priya Sharma",
      phone: "+91-9876543210",
      passwordHash,
      role: "CUSTOMER",
    },
  });
  console.log("✅ Created test user:", testUser.email);

  // ─── Product 1: Tap Cleaner & Limescale Remover ───
  const limescale = await prisma.product.create({
    data: {
      slug: "tap-cleaner-limescale-remover",
      title: "Tap Cleaner & Limescale Remover",
      subtitle: "Non-toxic citric acid micro-foam engineered for taps, tiles & limescale elimination",
      description:
        "Our flagship formula harnesses concentrated citric acid micro-foam technology to penetrate and dissolve stubborn limescale, hard water deposits, and calcium buildup. Specially optimized for bathroom taps, chrome fixtures, shower screens, tiles, and basins — working for up to 10 minutes without dripping. Laboratory-tested to remove 99.7% of limescale deposits in a single application. 100% plant-based, non-toxic, and safe on hands while restoring brilliant chrome and glass shine.",
      ingredients:
        "Aqua, Citric Acid (food-grade, ≥15%), Decyl Glucoside (plant-derived surfactant), Sodium Citrate, Cocamidopropyl Betaine (coconut-derived foam booster), Xanthan Gum (natural thickener), Limonene (cold-pressed lemon oil), Linalool (lavender essential oil extract). 100% biodegradable. No phosphates, no chlorine, no synthetic fragrances. Safe on hands.",
      usageInstructions:
        "1. Shake bottle gently before use.\n2. Spray Citrafoam directly onto taps, fixtures, or limescale-affected surfaces from 15cm distance.\n3. Allow foam to cling and work for 3–10 minutes (longer for heavy buildup).\n4. Wipe with a damp microfibre cloth in circular motions.\n5. Rinse with clean water for a streak-free shine.\n\nPro Tip: For heavy mineral crust around tap aerators and showerheads, wrap with a foam-soaked cloth for 10 minutes before wiping.",
      category: "Bathroom",
      isFeatured: true,
      images: JSON.stringify([
        "/images/products/tap-cleaner-limescale-remover.jpg",
      ]),
      variants: {
        create: [
          {
            name: "500ml Bottle",
            sku: "CF-TCLR-500",
            price: 250,
            compareAtPrice: 299,
            inventoryCount: 250,
          },
        ],
      },
    },
  });
  console.log("✅ Created product:", limescale.title);

  // ─── Product 2: Copper, Brass & Bronze Cleaner ───
  const copperPolish = await prisma.product.create({
    data: {
      slug: "copper-brass-bronze-cleaner",
      title: "Copper, Brass & Bronze Cleaner",
      subtitle: "Non-toxic citric acid polish formulated to instantly dissolve tarnish on copper, brass & bronze",
      description:
        "A precision-formulated citric acid cream polish designed specifically for copper, brass, bronze, and similar alloy surfaces. Our unique micro-abrasive suspension lifts tarnish and oxidation without scratching, while food-grade citric acid dissolves verdigris (green patina) at the molecular level. Leaves behind an invisible protective micro-film that slows re-tarnishing by up to 3x compared to conventional polishes. Perfect for pooja vessels, cookware, decorative items, temple bells, door handles, and antique hardware. 100% plant-based, non-toxic, and safe on hands.",
      ingredients:
        "Aqua, Citric Acid (food-grade, ≥20%), Kaolin Clay (ultra-fine natural micro-abrasive), Glycerin (plant-derived moisturizer), Isopropyl Alcohol, Sodium Lauryl Sulfoacetate (coconut-derived cleansing agent), Tocopherol (Vitamin E, anti-oxidant protective film), Citrus Aurantium Dulcis Oil (sweet orange). Vegan. Cruelty-free. Safe on hands.",
      usageInstructions:
        "1. Apply a small amount of polish to a soft, dry cloth or directly onto the surface.\n2. Rub onto tarnished copper, brass, or bronze surfaces using gentle circular motions.\n3. Allow product to work for 1–2 minutes on heavy tarnish.\n4. Buff with a clean, dry microfibre cloth until surface gleams.\n5. For intricate designs or idols, use a soft-bristled brush to reach crevices.\n\nPro Tip: For severely tarnished heirloom pieces, apply a coat and let sit for 5 minutes before buffing.",
      category: "Metal Care",
      isFeatured: true,
      images: JSON.stringify([
        "/images/products/copper-brass-bronze-cleaner.jpg",
      ]),
      variants: {
        create: [
          {
            name: "500ml Bottle",
            sku: "CF-CBBC-500",
            price: 200,
            compareAtPrice: 250,
            inventoryCount: 200,
          },
        ],
      },
    },
  });
  console.log("✅ Created product:", copperPolish.title);

  // ─── Product 3: Kitchen Cleaner ───
  const degreaser = await prisma.product.create({
    data: {
      slug: "kitchen-cleaner",
      title: "Kitchen Cleaner",
      subtitle: "Non-toxic plant-based formula engineered for stovetops, counters & grease elimination",
      description:
        "A powerful yet gentle all-purpose kitchen cleaner that combines food-grade citric acid with plant-derived degreasing enzymes. Cuts through cooking oil splatter, stovetop grease, range hood film, and stubborn food residue without harsh chemicals. The advanced clinging micro-foam encapsulates grease particles on contact, lifting them from surfaces for easy wipe-away cleaning. Safe on granite, marble, stainless steel, glass, ceramic tiles, and painted cabinets. 100% plant-based, non-toxic, and safe on hands.",
      ingredients:
        "Aqua, Citric Acid (food-grade, ≥10%), Caprylyl/Capryl Glucoside (plant-derived degreaser), Protease & Lipase Enzymes (bio-derived grease cutters), Sodium Bicarbonate, Coco-Glucoside, Cymbopogon Flexuosus Oil (lemongrass), Zingiber Officinale Oil (ginger root). pH-balanced. Safe on hands.",
      usageInstructions:
        "1. Spray directly onto kitchen surfaces, stovetops, or appliances.\n2. Allow 30–60 seconds for citrus enzymes to break down grease.\n3. Wipe with a damp microfiber cloth or sponge.\n4. For heavy grease (range hoods, oven doors), spray generously and wait 2–5 minutes.\n5. Rinse or wipe with a clean damp cloth for a sparkling finish.\n\nPro Tip: Works brilliantly on stainless steel appliance fingerprints — spray and buff for a showroom finish.",
      category: "Kitchen",
      isFeatured: true,
      images: JSON.stringify([
        "/images/products/kitchen-cleaner.jpg",
      ]),
      variants: {
        create: [
          {
            name: "500ml Bottle",
            sku: "CF-KC-500",
            price: 250,
            compareAtPrice: 299,
            inventoryCount: 300,
          },
        ],
      },
    },
  });
  console.log("✅ Created product:", degreaser.title);

  // ─── Reviews ───
  const products = [limescale, copperPolish, degreaser];

  const reviewsData = [
    // Limescale Eliminator reviews
    { productId: limescale.id, rating: 5, headline: "Absolutely magical on shower glass!", comment: "I've tried everything from vinegar to expensive brands. Citrafoam cut through 2 years of hard water buildup in one application. The foam really does cling — it doesn't drip like other sprays. My shower door looks brand new. Will never use anything else.", authorName: "Ananya R.", verifiedPurchase: true },
    { productId: limescale.id, rating: 5, headline: "The science actually works", comment: "As a chemistry teacher, I appreciate the ingredient transparency. Food-grade citric acid is genuinely effective at dissolving calcium carbonate (limescale). This product delivers on its claims without the marketing nonsense. Clean, efficient, and smells fantastic.", authorName: "Dr. Vikram P.", verifiedPurchase: true },
    { productId: limescale.id, rating: 4, headline: "Great but needs patience on heavy buildup", comment: "Works perfectly on regular limescale. For the really thick stuff around my bathroom taps, I needed to apply twice and wait the full 10 minutes each time. End result was perfect though. The citrus scent is lovely and subtle, not overpowering.", authorName: "Meera K.", verifiedPurchase: true },
    { productId: limescale.id, rating: 5, headline: "Saved my rental deposit!", comment: "Landlord was going to charge me for the state of the bathroom. Two bottles of this and everything looked pristine. Chrome taps, glass shower screen, ceramic tiles — all sparkling. Easily saved me ₹15,000 in deposit deductions.", authorName: "Rohan S.", verifiedPurchase: true },
    { productId: limescale.id, rating: 5, headline: "Finally, a cleaner I trust around my kids", comment: "No chlorine, no harsh fumes. I can clean the bathroom while my toddler plays in the next room without worrying. The foam formula means no splashing either. Performance-wise, it outperforms the toxic alternatives. 10/10.", authorName: "Deepa M.", verifiedPurchase: true },

    // Copper & Brass Polish reviews
    { productId: copperPolish.id, rating: 5, headline: "My grandmother's copper vessels look new!", comment: "Used this on a set of copper pots that have been in the family for 30+ years. The green patina came off effortlessly, and the copper underneath was like a mirror. My grandmother couldn't believe it. The protective film seems to work — they haven't tarnished nearly as fast as usual.", authorName: "Kavitha N.", verifiedPurchase: true },
    { productId: copperPolish.id, rating: 5, headline: "Temple brass has never looked better", comment: "We use this for our pooja room brass items. The level of shine is remarkable — better than any traditional cleaning method I've used. Being food-grade safe means I don't worry about residue on items we use daily. Highly recommend.", authorName: "Sundar R.", verifiedPurchase: true },
    { productId: copperPolish.id, rating: 4, headline: "Excellent polish, slightly pricey", comment: "The quality is undeniable — best copper polish I've ever used. The only reason I'm not giving 5 stars is the price. But honestly, a little goes a long way, so the bottle lasts much longer than I expected. The orange scent is a nice touch.", authorName: "Arjun D.", verifiedPurchase: true },
    { productId: copperPolish.id, rating: 5, headline: "Professional-grade results at home", comment: "I restore antique hardware as a hobby. This product gives results comparable to professional metal restoration compounds, but it's completely non-toxic. Used it on 19th century door handles and the results were museum-worthy.", authorName: "Farid A.", verifiedPurchase: true },

    // Kitchen Cleaner reviews
    { productId: degreaser.id, rating: 5, headline: "Range hood transformation!", comment: "The filter on my kitchen chimney was coated in a year's worth of cooking oil. Sprayed this on, waited 5 minutes, and the grease literally slid off. I couldn't believe what I was seeing. The lemongrass-ginger scent makes the kitchen smell amazing after cleaning.", authorName: "Priya L.", verifiedPurchase: true },
    { productId: degreaser.id, rating: 5, headline: "Safe on my marble countertops", comment: "I was terrified of using degreasers on marble — most are too acidic and etch the surface. Did a spot test first and Citrafoam was perfectly safe. Cuts through olive oil splatter without any damage to the stone. Relief and clean counters!", authorName: "Nisha G.", verifiedPurchase: true },
    { productId: degreaser.id, rating: 4, headline: "Everyday hero in our kitchen", comment: "We cook Indian food daily — lots of oil, lots of spices. This has become our daily wipe-down spray. Handles turmeric stains, oil splatter, and that mysterious sticky film on cabinet doors. The enzyme technology really does work differently from regular cleaners.", authorName: "Amit T.", verifiedPurchase: true },
    { productId: degreaser.id, rating: 5, headline: "Stainless steel appliance miracle", comment: "Our fridge and dishwasher fronts were covered in fingerprints and smudges. One spray and wipe — showroom finish. No streaks, no residue. I've been recommending this to everyone in my apartment building.", authorName: "Zara I.", verifiedPurchase: true },
  ];

  for (const review of reviewsData) {
    await prisma.review.create({
      data: {
        ...review,
        userId: testUser.id,
      },
    });
  }
  console.log(`✅ Created ${reviewsData.length} reviews`);

  console.log("\n🎉 Seed complete! Database is ready.");
  console.log(`   📦 ${products.length} products`);
  console.log(`   ⭐ ${reviewsData.length} reviews`);
  console.log(`   👤 1 test user (${testUser.email})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
