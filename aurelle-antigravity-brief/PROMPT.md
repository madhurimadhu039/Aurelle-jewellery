# AURELLE JEWELLERY — COMPLETE WEBSITE PROJECT GENERATION

(Visual reference: `reference/Aurelle_Jewellery_Luxury_UI_Moodboard.png`)

Act as a senior full-stack developer, luxury e-commerce UI/UX designer, Firebase architect, and software engineer.

Build a complete, professional, premium jewellery e-commerce website named **AURELLE JEWELLERY**. Generate the actual project source code, organize all files into a clean folder structure, connect Firebase, and deliver the entire project as a downloadable ZIP file.

**IMPORTANT:** I want the actual source code and a runnable project, not just instructions, code snippets, a design mockup, or a website preview.

## 1. Main Requirements

- Brand name: Aurelle Jewellery.
- Tagline: "Timeless Elegance. Crafted for You."
- Website type: Luxury jewellery e-commerce and customer account management platform.
- Database: Firebase Firestore.
- Authentication: Firebase Authentication.
- Image storage: Firebase Storage.
- Frontend: React, TypeScript, Vite, and Tailwind CSS.
- Icons: Lucide React.
- Routing: React Router.
- Deployment compatibility: Firebase Hosting.
- Output: Complete project folder and downloadable ZIP archive.

Use maintained, compatible package versions and a clean, reusable component architecture.

## 2. Premium Brand Identity

Use the attached reference image as visual inspiration.

Create an original luxury jewellery experience using:

- Obsidian black: #090806
- Champagne gold: #D8B47A
- Warm ivory: #F7F1E7
- Espresso brown: #24170F

Use elegant serif headlines, refined sans-serif body text, premium jewellery photography, thin gold borders, cinematic lighting, sophisticated product cards, subtle transitions, and generous spacing.

Create a distinctive Aurelle wordmark. Make every page visually polished and consistent.

Avoid generic templates, excessive rounded cards, bright random colors, and cluttered layouts.

## 3. Homepage

Build a premium homepage with:

1. Announcement bar.
2. Responsive navigation with logo, Home, Collections, New Arrivals, Bridal, Gold Rates, Jewellery Scheme, About, Contact, Search, Account, Wishlist, and Cart.
3. Luxury hero section with premium jewellery photography, headline, and working call-to-action buttons.
4. Automatically moving horizontal hero carousel with multiple slides, previous/next controls, pagination indicators, smooth transitions, and mobile swipe support.
5. Daily gold and silver rates panel.
6. Jewellery category carousel.
7. Featured products and new arrivals.
8. Bridal jewellery showcase.
9. Unique jewellery recommendation experience.
10. Brand story and craftsmanship section.
11. Customer services and trust information.
12. Jewellery scheme, Pay Due, Ledger, and Add Existing shortcuts.
13. Newsletter and premium footer.

Every button and navigation link must have a meaningful action.

## 4. Daily Gold and Silver Rates

Display the following prominently on the homepage:

- 22-carat gold price per gram.
- 24-carat gold price per gram.
- Silver price per gram.
- Currency in INR.
- Last updated date and time.

Use a reliable precious-metal pricing API or authorized provider through a secure server-side integration.

Requirements:
- Refresh rates automatically on a configurable schedule.
- Save rate snapshots in Firestore when appropriate.
- Display the last successful update.
- Handle API errors, loading states, stale data, and rate-provider outages.
- Clearly distinguish live rates, cached rates, and demo data.
- Never invent current rates or falsely label sample data as live.
- Secure all API credentials using environment variables.
- Include a configurable city or pricing location if supported by the provider.
- Explain that actual jewellery prices can differ due to purity, making charges, stones, taxes, and store pricing.

If API credentials are unavailable, provide a clearly labelled demo mode and document how to connect a real provider.

Do not assume Firebase alone supplies live gold rates.

## 5. Product Collections and Listing

Create categories for:

- Gold Jewellery
- Diamond Jewellery
- Rings
- Necklaces
- Earrings
- Bangles
- Bracelets
- Pendants
- Mangalsutras
- Bridal Jewellery
- New Arrivals

Each product must have a detailed data model containing its ID, name, SKU, category, description, images, price, material, purity, weight where applicable, style, stock availability, and other relevant specifications.

Create working product listing pages with:

- Search.
- Category filters.
- Minimum and maximum price.
- Material filters.
- Purity filters where applicable.
- Style and occasion filters.
- Sorting by price and newest arrivals.
- Clear-all filters.
- Active filter indicators.
- Product counts.
- Empty search results.
- Mobile-friendly filter drawer.

Every filter must update the actual displayed products.

## 6. Product Details

Each product detail page must include:

- High-quality image gallery and zoom.
- Product name and SKU.
- Price in INR.
- Product description.
- Material and purity.
- Weight and dimensions where applicable.
- Gemstone details where applicable.
- Stock status.
- Care instructions.
- Delivery information.
- Add to Cart.
- Add to Wishlist.
- Add to Compare.
- Related and matching products.

Implement configurable pricing rules for products whose prices depend on metal rates. Show the price breakdown transparently and distinguish estimated prices from confirmed selling prices.

## 7. Wishlist and Product Comparison

### Wishlist
- Add and remove favourites.
- Display saved products.
- Persist signed-in users' data in Firestore.
- Preserve guest wishlist data locally and merge it after login.
- Allow wishlist products to be moved to the cart.

### Product comparison
Allow customers to compare selected products side by side based on price, material, purity, weight, gemstones, style, size, and availability.

Provide add/remove controls and a responsive comparison layout.

## 8. Unique Aurelle Features

Implement the following features using real application logic where feasible:

**A. Aurelle Heirloom Passport**

Give eligible jewellery purchases a digital record containing product details, purchase information, available certification references, care instructions, and service history.

**B. Find Your Forever Piece**

Create an interactive recommendation wizard based on occasion, budget, jewellery type, preferred material, and personal style.

**C. Jewellery Memory Box**

Allow users to create named collections of favourite jewellery, such as Wedding Wishlist and Anniversary Gifts.

**D. Transparent Gold Calculator**

Calculate estimated jewellery prices using configured metal rates, purity, weight, making charges, gemstone value, and applicable taxes.

**E. Jewellery Care Calendar**

Allow customers to save jewellery care and inspection reminders.

**F. Gift Concierge**

Recommend suitable products using the recipient's preferences, occasion, and budget.

Use actual catalogue data. Clearly identify simulated integrations, and do not claim that virtual try-on or AI features work unless they are implemented.

## 9. Pay Due

Create a dedicated Pay Due page for checking outstanding jewellery payments.

Display:
- Customer or account reference.
- Order or bill reference.
- Total bill amount.
- Amount already paid.
- Outstanding balance.
- Due date.
- Payment status: Paid, Partially Paid, Pending, or Overdue.
- Payment history.
- Receipts.
- Pay Now action when a real payment gateway is configured.

Use Firebase Authentication and server-side authorization to protect customer information.

Create an admin interface for authorized staff to record dues, update payment records, and issue receipts.

A payment must only be marked as paid after verified confirmation or an authorized, auditable offline payment entry.

Never expose another customer's records through URL changes or predictable document IDs.

## 10. Join Jewellery Scheme

Build a configurable jewellery savings scheme module.

Customers should be able to:
- Browse available schemes.
- View eligibility, benefits, and terms.
- Select an eligible contribution amount.
- View instalment schedules.
- Enrol in a scheme.
- Track instalments and payment history.
- View maturity information and account status.

Admins should be able to configure schemes, contribution amounts, tenure, eligibility, benefits, and terms.

Store scheme enrolments and instalments in Firestore.

Calculate scheme totals according to configured terms. Never invent guaranteed returns or benefits.

Clearly explain how missed instalments, cancellation, maturity, and redemption are handled under the configured scheme rules.

## 11. My Ledger

Create a customer ledger showing:

- Opening balance when applicable.
- Purchases.
- Payments.
- Scheme instalments.
- Refunds.
- Adjustments.
- Transaction dates and reference numbers.
- Running balance.
- Outstanding dues.

Include date filters, transaction filters, and printable or downloadable statements.

Maintain a reliable transaction history. Customers must not be allowed to edit their own ledger entries.

Use secure backend operations, server-side validation, and audit logs.

## 12. Add Existing Jewellery

Implement an Add Existing feature for linking existing jewellery or purchase records to a customer account.

Allow customers to submit:
- Existing bill number.
- Purchase date.
- Product or jewellery description.
- Metal purity and weight when known.
- Supporting documents or bill images.
- Additional information.

Support customer verification, staff review, and statuses such as Pending, Verified, Rejected, and Needs Information.

Authorized admins should be able to review and approve requests.

If the store intends this feature for old-gold exchange or valuation, support a separate quotation workflow rather than automatically treating an uploaded record as authenticated jewellery.

## 13. Authentication and Account

Use Firebase Authentication for:
- Registration.
- Login.
- Logout.
- Password reset.
- Account management.

Include account pages for:
- Profile.
- Addresses.
- Order history.
- Wishlist.
- Product comparisons.
- Cart.
- Pay Due.
- Jewellery schemes.
- Ledger.
- Heirloom Passport.
- Existing jewellery requests.

Protect private routes and validate authorization on the server or through secure Firebase rules.

Do not store passwords in Firestore.

## 14. Shopping Cart and Checkout

Implement:
- Add to cart.
- Update quantities.
- Remove items.
- Cart totals.
- Price breakdown.
- Stock validation.
- Shipping details.
- Order summary.
- Order history.

Connect a real payment gateway only when valid credentials and configuration are provided.

Never simulate a successful real payment. Provide a clearly labelled demo checkout if gateway credentials are unavailable.

Use trusted server-side logic for order creation, price verification, and payment confirmation.

## 15. Admin Dashboard

Create a protected admin dashboard with:

- Product and category management.
- Product image uploads.
- Inventory management.
- Price configuration.
- Gold and silver rate monitoring.
- Customer management.
- Order management.
- Payment and Pay Due management.
- Scheme configuration.
- Ledger management.
- Add Existing request verification.
- Homepage banner and carousel management.
- Reports and audit logs.

Use role-based access control. Only authorized administrators may access administrative operations.

Do not rely on hiding admin links in the frontend as a security measure.

## 16. Firebase Integration

Configure Firebase using modular Firebase SDK APIs.

Provide a dedicated Firebase setup module, typed service functions, and separate services for authentication, products, categories, wishlist, cart, orders, rate snapshots, schemes, ledgers, and existing jewellery requests.

Create the following configuration files:

- `src/lib/firebase.ts`
- `src/services/`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `firebase.json`
- `.env.example`

Requirements:
- Use environment variables for Firebase configuration.
- Never include real private credentials in source code.
- Provide Firestore security rules that enforce ownership and role-based access.
- Restrict storage uploads and validate file types and sizes.
- Prevent unauthorized clients from changing prices, payment statuses, roles, or ledger balances.
- Use trusted backend operations for sensitive updates.
- Include Firestore indexes where needed.
- Use Firebase emulators or a test project for development where practical.

A Firebase configuration template is not the same as a connected, deployed Firebase project. Document the exact steps needed to supply the user's project configuration and enable Authentication, Firestore, Storage, and Hosting.

## 17. Folder Structure

Organize the project professionally, with separate folders for:

- Application entry points.
- Reusable components.
- Layout components.
- Pages and route definitions.
- Hooks.
- Context or state management.
- Firebase configuration.
- Data models and types.
- Services and API clients.
- Utility functions.
- Styles and design tokens.
- Assets and images.
- Forms and validation.
- Admin pages.
- Customer account pages.
- Tests.
- Firebase rules and deployment configuration.

Use a structure similar to the following, adapting it as needed:

`aurelle-jewellery/`
- `public/`
- `src/`
  - `assets/`
  - `components/`
  - `layouts/`
  - `pages/`
  - `routes/`
  - `hooks/`
  - `contexts/`
  - `lib/`
  - `services/`
  - `types/`
  - `utils/`
  - `styles/`
  - `features/`
    - `products/`
    - `wishlist/`
    - `comparison/`
    - `cart/`
    - `rates/`
    - `pay-due/`
    - `schemes/`
    - `ledger/`
    - `existing-jewellery/`
    - `admin/`
  - `tests/`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`
- `firebase.json`
- `.env.example`
- `.gitignore`
- `package.json`
- `README.md`
- `vite.config.ts`
- `tsconfig.json`

Keep business logic out of large UI components. Use reusable, typed services and components.

## 18. Responsive Design and Performance

Test and optimize the complete website for mobile, tablet, laptop, and desktop.

Ensure:
- No horizontal overflow.
- Responsive navigation.
- Touch-friendly controls.
- Mobile-friendly carousels and filters.
- Responsive product images.
- Accessible labels and keyboard navigation.
- Visible focus states.
- Appropriate color contrast.
- Reduced-motion support.
- Optimized images and lazy loading.
- Loading, error, and empty states.
- SEO metadata.
- Proper form validation.

## 19. Testing and Completion

Add tests for important features and document how to run them.

Verify:
- Application builds without errors.
- Routes load correctly.
- Filters and sorting work.
- Wishlist and comparison work.
- Cart calculations are correct.
- Firebase integration is configured correctly.
- Unauthorized access is rejected.
- Pay Due and ledger data are protected.
- Scheme enrolment and instalment calculations work.
- Existing jewellery submissions and verification work.
- Mobile layouts are usable.
- Rate API failures are handled correctly.

Do not claim a feature is complete if it is only a static design.

## 20. Mandatory Deliverable: Downloadable ZIP

Create the entire project directly in the working environment, with every source file in its correct location.

Then:

1. Install or document the required dependencies.
2. Run the production build and fix errors where the environment permits.
3. Run available tests.
4. Create a clean `aurelle-jewellery/` project directory.
5. Exclude `node_modules`, `.git`, real secrets, local caches, and unnecessary generated files.
6. Include `.env.example`, Firebase rules, deployment files, and a comprehensive README.
7. Compress the complete project into `aurelle-jewellery.zip`.
8. Verify that the ZIP exists and contains the expected files.
9. Provide the actual downloadable ZIP attachment or link.
10. Provide concise setup instructions, including Firebase configuration, environment variables, API credentials, installation, local development, and deployment.

If the environment cannot create or attach a ZIP, state that limitation honestly and provide the generated files through an available downloadable artifact mechanism. Do not pretend a ZIP was created.

**Final objective:** Deliver a professional, maintainable Aurelle Jewellery source-code project with a premium design, organized folders, Firebase integration, functional features, security rules, setup documentation, and a verified downloadable ZIP. Prioritize working code and clear setup instructions over long explanations.
