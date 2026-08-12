# True Print Shop

## Задолжително правило за работа

- Никогаш да не се измислуваат, претпоставуваат или додаваат работи што не се побарани.
- Ако нешто не е сигурно, прво да се провери постојниот код/фајлови наместо да се халуцинира.
- Да не се тврди дека нешто е направено, push-нато, deploy-нато или присутно ако тоа не е реално проверено.
- Измените да бидат строго ограничени на тоа што корисникот експлицитно го побарал, освен ако дополнителна промена е неопходна за истото да функционира; во тој случај таа треба да биде минимална и јасно оправдана.

## Задолжително правило за дизајнот

`index.html` (homepage) е единствениот визуелен извор на вистина за целиот веб-сајт.

Секоја нова страница и компонента — вклучувајќи го product details page — мора директно да го наследува истиот стил од homepage:

- исти типови, големини, радиуси и padding на копчињата;
- исти hover, active, focus и micro-animation ефекти;
- исти tabs, tags, cards, form controls и icon buttons;
- исти Inter типографија, нормален letter-spacing и нормален текст без присилно uppercase;
- само brand боите `#111111`, `#2457FF`, `#F5F1E8` и `#000000`;
- исти Material Design Filled икони;
- исти responsive правила и премин во tablet/mobile navigation;
- без gradients и без воведување нов, паралелен UI стил.
- никогаш да нема divider/separator линии меѓу секциите низ страниците; секциите се одвојуваат само со простор и промена на brand background боја.

Пред да се креира нова компонента, прво треба да се провери дали истата или сродна компонента веќе постои на homepage и да се употреби постојната CSS класа. Ако е потребна нова варијанта, таа мора да биде изведена од постојната homepage компонента и да го задржи истиот визуелен и интерактивен behavior.

## Структура на design system

- `design-system.css` ги содржи глобалните tokens и shared components: buttons, tags, tabs, cards, icon controls, focus и motion states.
- `styles.css` содржи само layout и homepage-specific правила.
- `product.css` содржи само product-page layout; боите, controls и интеракциите ги наследува од `design-system.css`.
- Нови hard-coded бои, радиуси, висини, shadows и motion вредности не се додаваат во page CSS. Се додаваат како variable во `design-system.css` и потоа се користат насекаде.
- `catalog-data.js` е единствен извор за categories, brands и products.
- `collection.html` е reusable template за сите category и brand listing pages.
- `product.html` е reusable template за сите product detail pages.
- `info.html` е reusable template за customer-care, company и policy pages.

## Brutalist interaction language

- Default controls се чисти flat shapes со `2px` Near Black border.
- Primary actions се Electric Cobalt; dark actions се Near Black; secondary actions се Warm White.
- Hover користи промена во brand боја, `4px` тврд Near Black shadow и мало движење нагоре/налево.
- Pressed state го намалува shadow-от на `1px` и го поместува control-от надолу/надесно.
- Tabs никогаш не стануваат црни на hover. Hover и active состојбите се Electric Cobalt со Warm White текст.
- Не се користат gradients, blur shadows, случајни outlines или бои надвор од brand palette.

## Canonical button system

`Shop bundles` CTA на homepage е визуелниот и интерактивниот pattern за сите action buttons низ целиот сајт.

- Сите action buttons користат ист `2px` Near Black border, pill radius, висина, padding, typography, hard-shadow hover и pressed animation.
- Постојат две главни варијанти: **white** = Warm White background + Near Black border/text; **blue** = Electric Cobalt background + Near Black border + Warm White text.
- Боите на копчето не се менуваат на hover/active; интеракцијата се покажува преку hard shadow и позиционирање.
- Старите `dark`/black CTA варијанти се нормализираат во blue варијантата.
- Нов action button не смее да добива сопствен page-specific CSS ако може да ја користи canonical button варијантата од `design-system.css`.

## Blue section text rule

Секоја секција со Electric Cobalt (`#2457FF`) background користи Near Black (`#111111`) како основна боја за текст. Исклучок се dark title tags/eyebrows: тие остануваат Near Black background со Warm White текст.
