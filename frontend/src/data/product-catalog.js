const tones={
  Foundation:[['Fair','#f4d4c1'],['Light','#e6b898'],['Medium','#c98762'],['Tan','#9c5c40'],['Deep','#593223']],
  Concealer:[['Fair','#f7dcca'],['Light','#e9bf9e'],['Medium','#c98e6d'],['Tan','#95593d'],['Deep','#543023']],
  Lip:[['Nude','#c78676'],['Rose','#b95d70'],['Mauve','#95485d'],['Berry','#71283f'],['Deep Red','#651d2b']],
  Blush:[['Soft Pink','#efadac'],['Peach','#ef9a74'],['Rose','#cf6572'],['Mauve','#a55668'],['Berry','#7c314b']],
  Highlighter:[['Pearl','#f7dfca'],['Champagne','#e4bd86'],['Rose Gold','#d99d8b'],['Gold','#c59645'],['Bronze','#aa6d42']],
  Eyes:[['Silk','#ead7c5'],['Rosewood','#bd8278'],['Cocoa','#805347'],['Plum','#683d4a'],['Espresso','#3c2925']],
  Contour:[['Amber','#d29a77'],['Sienna','#ae7056'],['Caramel','#8f533d'],['Mocha','#653c2f'],['Cocoa','#3e2823']]
};

const reviews=[
  {name:'Aanya K.',text:'Beautiful finish and incredibly comfortable.',date:'12 May 2026'},
  {name:'Mira S.',text:'The colour is elegant and wears so beautifully.',date:'03 May 2026'},
  {name:'Ishita R.',text:'Instantly became a piece I reach for daily.',date:'26 April 2026'}
];

const makeProduct=(id,index,name,category,price,image)=>({
  id,name,category,price,image,
  rating:+(4.5+(index%5)*.1).toFixed(1),
  featured:index,
  new:[1,6,8,11,15,19].includes(index),
  best:[0,5,9,16,17].includes(index),
  description:`A refined ${category.toLowerCase()} with a thoughtfully balanced formula for a polished, second-skin finish.`,
  shades:(tones[category]||tones.Foundation).map(([shadeName,hex])=>({name:shadeName,hex})),
  reviews
});

const addBrand=(brand,items)=>items.map(product=>({...product,brand}));

const macProducts=[
  makeProduct('p1',0,'Studio Fix Fluid Foundation','Foundation',3999,'https://media.ulta.com/i/ulta/2622203?fmt=auto&h=600&w=600'),
  makeProduct('p2',1,'Powder Kiss Lipstick','Lip',2499,'https://sdcdn.io/mac/us/mac_sku_S4K065_1x1_0.png?height=1440&width=1440'),
  makeProduct('p3',2,'Matte Lipstick','Lip',2299,'https://static.lottedfs.com/prod/prd-img/14/78/27/01/00/02/20001277814_2.jpg/dims/resize/590x590'),
  makeProduct('p4',3,'Mineralize Blush','Blush',2899,'https://sdcdn.io/mc/mac_sku_MT1N50_1x1_0.png?height=1440&width=1440'),
  makeProduct('p5',4,'Pro Longwear Concealer','Concealer',3199,'https://sdcdn.io/mac/us/mac_sku_MGT907_1x1_0.png?height=1080&width=1080'),
  makeProduct('p21',20,'M.A.C Mineralize Skinfinish Highlighter - Global Glow','Highlighter',3799,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/1125221/c6FZBBacoyN-1125221_1.jpg'),
  makeProduct('p22',21,'M.A.C Kajal Excess Longwear Smoky Eye Liner - Storm Cloud','Eyes',4499,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/rOGekz6-eH-1203242_1.jpg'),
  makeProduct('p23',22,'M.A.C Skinfinish Sunstruck Matte Bronzer Matte - Rich Golden','Contour',3599,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/4R3JuSpUnV-1199273_1.jpg')
];

const fentyProducts=[
  makeProduct('p6',5,'Pro Filt’r Soft Matte Foundation','Foundation',4299,'https://media.ulta.com/i/ulta/2592540?fmt=auto&h=1080&w=1080'),
  makeProduct('p7',6,'Gloss Bomb Universal Lip Luminizer','Lip',2599,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:1080/1179430/rMQWTadjDD-1179430_1.jpg'),
  makeProduct('p9',8,'Cheeks Out Freestyle Cream Blush','Blush',2999,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/1179354/XAUWIRL4RL--1179354_1.jpg'),
  makeProduct('p24',23,'FENTY BEAUTY Fine Linez Lash Line-Enhancing Eyeliner','Eyes',3299,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/Y2DxSDQ5u--1196763_1.jpg'),
  makeProduct('p30',29,'FENTY BEAUTY Match Stix Matte Contour Skinstick','Contour',3499,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/1179593/NlbYidPdmgs-1179593_1.jpg'),
  makeProduct('p32',31,'FENTY BEAUTY Diamond Bomb All-Over Diamond Veil','Highlighter',3799,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:1080/IxN-JpToe-1179427_1.jpg'),
  makeProduct('p33',32,"FENTY BEAUTY We're Even Hydrating Concealer",'Concealer',3499,'https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:2200/msvS8PNucb-1179380_1.jpg')
];

const kayBeautyProducts=[
  makeProduct('p11',10,'Hydra Cloud Cushion Foundation','Foundation',2399,'https://images.t2online.in/cdn-cgi/image/width=1200,quality=70/https://cms.t2online.in/api/images/1754996394148.jpg'),
  makeProduct('p12',11,'Cashmere Lip & Cheek Blur','Lip',1599,'https://prettycosmo.com/cdn/shop/files/1_a21dc4fd-de50-41c2-aa82-e37dff78596a_900x900.jpg?v=1782647387'),
  makeProduct('p13',12,'Velvet Dream Multi-Use Blush','Blush',1899,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4ByjtMNxK7rkHqZextB9tcwgIJtmXyG1YORn_Fh8i6w&s=10'),
  makeProduct('p14',13,'Eye Kanvas Eyeshadow Palette','Eyes',2799,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_Ovic76KDluyk48v0yUngNM2JXmWdjXttqnwGS28Tlw&s=10'),
  makeProduct('p15',14,'Soft Matte Full Coverage Concealer','Concealer',1699,'https://www.kaybeauty.com/cdn/shop/files/12_100YLight.jpg?v=1774331733'),
  makeProduct('p26',25,'Kover Story Contour Stick','Contour',1899,'https://www.kaybeauty.com/cdn/shop/files/1_b1bf38e3-b7f2-4cce-9623-14c492e32866.jpg?v=1758697561'),
  makeProduct('p31',30,'Illuminating Highlighter','Highlighter',1999,'https://www.kaybeauty.com/cdn/shop/files/1_d42c700a-ce03-4d85-88df-7b937ed79dab_1.jpg?v=1760597390')
];

const rareBeautyProducts=[
  makeProduct('p16',15,'Liquid Touch Weightless Foundation','Foundation',4299,'https://media.kohlsimg.com/is/image/kohls/9bfd70b0b5e07f341664346b6becf5997e33df45'),
  makeProduct('p17',16,'Soft Pinch Liquid Blush','Blush',2999,'https://cdn.shopify.com/s/files/1/0314/1143/7703/files/ECOMM-SP-LIQUID-BLUSH-DEWY-ADORE.jpg?v=1757612752'),
  makeProduct('p18',17,'Liquid Touch Brightening Concealer','Concealer',2799,'https://www.rarebeauty.com/cdn/shop/products/Concealer-100W-SKU_5bea0f14-cf53-4fbd-b371-9c507d882817_900x.jpg?v=1762200488&format=pjpg'),
  makeProduct('p19',18,'Kind Words Matte Lipstick','Lip',2699,'https://cdn.fragrancenet.com/images/photos/1600x1600/348155.jpg'),
  makeProduct('p27',26,'Positive Light Liquid Luminizer','Highlighter',2999,'https://www.rarebeauty.com/cdn/shop/files/ECOMM-PL-LIQUID-LUMINIZER-ENLIGHTEN-1440x1952_900x.jpg?v=1762283296&format=pjpg'),
  makeProduct('p28',27,'Perfect Strokes Longwear Gel Eyeliner','Eyes',3299,'https://www.rarebeauty.com/cdn/shop/files/perfect-strokes-gel-liner-true-black-1440x1952_900x.jpg?v=1762287309&format=pjpg'),
  makeProduct('p29',28,'Soft Pinch Liquid Contour','Contour',2799,'https://www.rarebeauty.com/cdn/shop/files/ECOMM-SOFT-PINCH-LIQUID-CONTOUR-GENTLE_900x.jpg?v=1762300534&format=pjpg')
];

export const products=[
  ...addBrand('M·A·C',macProducts),
  ...addBrand('Fenty Beauty',fentyProducts),
  ...addBrand('Kay-Beauty',kayBeautyProducts),
  ...addBrand('Rare Beauty',rareBeautyProducts)
];

export const brands=[
  {name:'M·A·C',description:'Professional artistry meets iconic beauty.'},
  {name:'Fenty Beauty',description:'Beauty for everyone.'},
  {name:'Kay-Beauty',description:'Innovative Korean beauty essentials.'},
  {name:'Rare Beauty',description:'Makeup that celebrates individuality.'}
];

export const categories=['Foundation','Concealer','Blush','Lip','Highlighter','Eyes','Contour'];
