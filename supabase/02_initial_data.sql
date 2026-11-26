-- Execute SECOND once. Safe to rerun; existing edited rows are not overwritten.
insert into public.menu_categories(id,name_ar,name_en,sort_order) values
('meat','منسف لحم','Meat Mansaf',10),('chicken','منسف دجاج','Chicken Mansaf',20),('family','وجبات عائلية','Family Meals',30),('extras','إضافات','Extras',40)
on conflict (id) do nothing;
insert into public.menu_products(id,category_id,name_ar,name_en,description_ar,description_en,featured,price,sort_order) values
('meat-single','meat','منسف لحم فردي','Single Meat Mansaf','أرز مع لحم وصوص الجميد، يُقدَّم بالصنوبر.','Rice with meat and jameed sauce, topped with pine nuts.',true,null,10),
('meat-duo','meat','منسف لحم لشخصين','Meat Mansaf for Two','وجبة مناسبة للمشاركة بنكهة المنسف الأصيلة.','A shareable meal with authentic Mansaf flavor.',false,null,20),
('meat-family','family','منسف لحم عائلي','Family Meat Mansaf','لمّة العيلة على صينية منسف واحدة.','The whole family around one Mansaf platter.',true,null,30),
('chicken-single','chicken','منسف دجاج فردي','Single Chicken Mansaf','منسف الدجاج بصوص الجميد والأرز.','Chicken Mansaf with jameed sauce and rice.',false,null,40),
('chicken-family','family','منسف دجاج عائلي','Family Chicken Mansaf','صينية دجاج مناسبة للمائدة العائلية.','A chicken platter for the family table.',false,null,50),
('extra-rice','extras','أرز إضافي','Extra Rice','طبق أرز إضافي بجانب طلبك.','An extra portion of rice with your order.',false,10,60),
('extra-jameed','extras','صوص جميد إضافي','Extra Jameed Sauce','صوص جميد إضافي للتغميس والسكب.','Extra jameed sauce for pouring.',false,8,70)
on conflict (id) do nothing;
insert into public.product_sizes(product_id,id,label_ar,label_en,price,sort_order) values
('meat-single','s','صغير','Small',35,10),('meat-single','m','وسط','Medium',45,20),('meat-single','l','كبير','Large',55,30),
('meat-duo','s','صغير','Small',70,10),('meat-duo','m','وسط','Medium',85,20),('meat-duo','l','كبير','Large',100,30),
('meat-family','s','صغير','Small',150,10),('meat-family','m','وسط','Medium',190,20),('meat-family','l','كبير','Large',230,30),
('chicken-single','s','صغير','Small',25,10),('chicken-single','m','وسط','Medium',35,20),('chicken-single','l','كبير','Large',45,30),
('chicken-family','s','صغير','Small',100,10),('chicken-family','m','وسط','Medium',130,20),('chicken-family','l','كبير','Large',160,30)
on conflict (product_id,id) do nothing;
insert into public.restaurant_settings (id,hero_product_id) values (1,'meat-single') on conflict (id) do nothing;
insert into public.social_links(platform,url) values ('youtube','https://www.youtube.com/@mshawerfou') on conflict (platform) do nothing;
