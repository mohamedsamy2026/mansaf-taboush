
const PLATE = '/images/products/mansaf-plate.jpg';

const SIZES = [
  { id: 's', label: { ar: 'صغير', en: 'Small' } },
  { id: 'm', label: { ar: 'وسط', en: 'Medium' } },
  { id: 'l', label: { ar: 'كبير', en: 'Large' } },
];

const sized = (p) =>
  SIZES.map((s, i) => ({
    ...s,
    price: p[i],
  }));

export const categories = [
  { id: 'all', label: { ar: 'الكل', en: 'All' } },
  { id: 'meat', label: { ar: 'منسف لحم', en: 'Meat Mansaf' } },
  { id: 'chicken', label: { ar: 'منسف دجاج', en: 'Chicken Mansaf' } },
  { id: 'family', label: { ar: 'وجبات عائلية', en: 'Family Meals' } },
  { id: 'extras', label: { ar: 'إضافات', en: 'Extras' } },
];

export const products = [
  {
    id: 'meat-single',
    category: 'meat',
    image: PLATE,
    featured: true,
    name: {
      ar: 'منسف لحم فردي',
      en: 'Single Meat Mansaf',
    },
    desc: {
      ar: 'أرز مع لحم وصوص الجميد، يُقدَّم بالصنوبر.',
      en: 'Rice with meat and jameed sauce, topped with pine nuts.',
    },
    sizes: sized([35, 45, 55]),
  },
  {
    id: 'meat-duo',
    category: 'meat',
    image: PLATE,
    name: {
      ar: 'منسف لحم لشخصين',
      en: 'Meat Mansaf for Two',
    },
    desc: {
      ar: 'وجبة مناسبة للمشاركة بنكهة المنسف الأصيلة.',
      en: 'A shareable meal with authentic Mansaf flavor.',
    },
    sizes: sized([70, 85, 100]),
  },
  {
    id: 'meat-family',
    category: 'family',
    image: PLATE,
    featured: true,
    name: {
      ar: 'منسف لحم عائلي',
      en: 'Family Meat Mansaf',
    },
    desc: {
      ar: 'لمّة العيلة على صينية منسف واحدة.',
      en: 'The whole family around one Mansaf platter.',
    },
    sizes: sized([150, 190, 230]),
  },
  {
    id: 'chicken-single',
    category: 'chicken',
    image: PLATE,
    name: {
      ar: 'منسف دجاج فردي',
      en: 'Single Chicken Mansaf',
    },
    desc: {
      ar: 'منسف الدجاج بصوص الجميد والأرز.',
      en: 'Chicken Mansaf with jameed sauce and rice.',
    },
    sizes: sized([25, 35, 45]),
  },
  {
    id: 'chicken-family',
    category: 'family',
    image: PLATE,
    name: {
      ar: 'منسف دجاج عائلي',
      en: 'Family Chicken Mansaf',
    },
    desc: {
      ar: 'صينية دجاج مناسبة للمائدة العائلية.',
      en: 'A chicken platter for the family table.',
    },
    sizes: sized([100, 130, 160]),
  },
  {
    id: 'extra-rice',
    category: 'extras',
    image: PLATE,
    name: {
      ar: 'أرز إضافي',
      en: 'Extra Rice',
    },
    desc: {
      ar: 'طبق أرز إضافي بجانب طلبك.',
      en: 'An extra portion of rice with your order.',
    },
    price: 10,
  },
  {
    id: 'extra-jameed',
    category: 'extras',
    image: PLATE,
    name: {
      ar: 'صوص جميد إضافي',
      en: 'Extra Jameed Sauce',
    },
    desc: {
      ar: 'صوص جميد إضافي للتغميس والسكب.',
      en: 'Extra jameed sauce for pouring.',
    },
    price: 8,
  },
];

export const getProduct = (id) =>
  products.find((p) => p.id === id);

export const unitPrice = (product, sizeId) =>
  product.sizes
    ? (
      product.sizes.find((s) => s.id === sizeId) ||
      product.sizes[0]
    ).price
    : product.price;
