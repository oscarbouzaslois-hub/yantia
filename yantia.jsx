import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Heart, X, RotateCcw, Search, Flame, Clock, ChefHat, CalendarDays,
  ShoppingBasket, Star, Check, Plus, Timer, Play, Pause, Sparkles,
  Trash2, ChevronLeft, ChevronRight, Utensils, Dices, BookHeart, Compass, Award, Soup
} from "lucide-react";

/* ============================================================
   EATYBLINDERS — descubre recetas sin prejuicios
   Diseño: "mercado moderno" — tarjetas blancas sobre fondo
   marfil neutro, color por familia de alimento, tipografía Sora.
   ============================================================ */

const CAT = {
  verdura:    { label: "Verduras",            color: "#1F9D63", soft: "#E4F5EC" },
  fruta:      { label: "Frutas",              color: "#F07C22", soft: "#FDEEDF" },
  carne:      { label: "Carnes",              color: "#D8455B", soft: "#FBE6EA" },
  pescado:    { label: "Pescados y mariscos", color: "#3E7FD6", soft: "#E6EEFB" },
  lacteo:     { label: "Huevos y lácteos",    color: "#8A6FE8", soft: "#EEE9FC" },
  legumbre:   { label: "Legumbres",           color: "#A9652A", soft: "#F6EBDF" },
  cereal:     { label: "Cereales y pasta",    color: "#C99A2E", soft: "#F9F1DC" },
  frutoseco:  { label: "Frutos secos",        color: "#8F6B3F", soft: "#F3ECE2" },
  hierba:     { label: "Hierbas y especias",  color: "#5E8C3A", soft: "#ECF3E2" },
  condimento: { label: "Despensa salada",     color: "#5F7385", soft: "#E9EEF2" },
  dulce:      { label: "Despensa dulce",      color: "#C0619F", soft: "#F8E8F2" },
};

const DIF = { 1: { l: "Fácil", c: "#1F9D63" }, 2: { l: "Media", c: "#C9822E" }, 3: { l: "Elaborada", c: "#D8455B" } };

/* Catálogo de ingredientes.
   id, n(ombre), c(ategoría), img (slug foto), e(moji ilustración de respaldo),
   kcal/prot/carb/gras por 100 g aprox., f = formas de preparación (matices). */
const INGS = [
  // ---- VERDURAS Y HORTALIZAS ----
  { id:"cebolla", n:"Cebolla", c:"verdura", img:"brown-onion.png", e:"🧅", kcal:40,p:1.1,cb:9,g:0.1, f:["cruda en ensalada","pochada","en salsa (triturada)","caramelizada","en aros rebozada"] },
  { id:"cebolleta", n:"Cebolleta", c:"verdura", img:"spring-onions.jpg", e:"🥬", kcal:32,p:1.8,cb:7,g:0.2, f:["cruda","cocinada"] },
  { id:"ajo", n:"Ajo", c:"verdura", img:"garlic.png", e:"🧄", kcal:149,p:6.4,cb:33,g:0.5, f:["crudo (alioli, gazpacho)","dorado en aceite","asado","en polvo"] },
  { id:"tomate", n:"Tomate", c:"verdura", img:"tomato.png", e:"🍅", kcal:18,p:0.9,cb:3.9,g:0.2, f:["crudo en ensalada","triturado en salsa","frito","asado","seco"] },
  { id:"tomate_cherry", n:"Tomate cherry", c:"verdura", img:"cherry-tomatoes.png", e:"🍅", kcal:18,p:0.9,cb:3.9,g:0.2 },
  { id:"pimiento_rojo", n:"Pimiento rojo", c:"verdura", img:"red-bell-pepper.jpg", e:"🫑", kcal:31,p:1,cb:6,g:0.3, f:["crudo","asado","frito","en salsa"] },
  { id:"pimiento_verde", n:"Pimiento verde", c:"verdura", img:"green-bell-pepper.jpg", e:"🫑", kcal:20,p:0.9,cb:4.6,g:0.2, f:["crudo","frito","en sofrito"] },
  { id:"calabacin", n:"Calabacín", c:"verdura", img:"zucchini.jpg", e:"🥒", kcal:17,p:1.2,cb:3.1,g:0.3, f:["en crema","a la plancha","salteado","relleno"] },
  { id:"berenjena", n:"Berenjena", c:"verdura", img:"eggplant.png", e:"🍆", kcal:25,p:1,cb:6,g:0.2, f:["a la plancha","frita","rellena","en pisto"] },
  { id:"zanahoria", n:"Zanahoria", c:"verdura", img:"sliced-carrot.png", e:"🥕", kcal:41,p:0.9,cb:10,g:0.2, f:["cruda","rallada en ensalada","cocida en guiso","en crema"] },
  { id:"patata", n:"Patata", c:"verdura", img:"potatoes-yukon-gold.png", e:"🥔", kcal:77,p:2,cb:17,g:0.1, f:["frita","cocida","asada","en puré","en tortilla"] },
  { id:"boniato", n:"Boniato", c:"verdura", img:"sweet-potato.png", e:"🍠", kcal:86,p:1.6,cb:20,g:0.1 },
  { id:"calabaza", n:"Calabaza", c:"verdura", img:"butternut-squash.jpg", e:"🎃", kcal:26,p:1,cb:6.5,g:0.1, f:["en crema","asada","en guiso"] },
  { id:"brocoli", n:"Brócoli", c:"verdura", img:"broccoli.jpg", e:"🥦", kcal:34,p:2.8,cb:7,g:0.4, f:["al vapor","salteado","asado al horno","en crema"] },
  { id:"coliflor", n:"Coliflor", c:"verdura", img:"cauliflower.jpg", e:"🥦", kcal:25,p:1.9,cb:5,g:0.3, f:["cocida","asada","rebozada","en crema"] },
  { id:"espinacas", n:"Espinacas", c:"verdura", img:"spinach.jpg", e:"🥬", kcal:23,p:2.9,cb:3.6,g:0.4, f:["crudas en ensalada","salteadas","en crema","en batido verde"] },
  { id:"acelgas", n:"Acelgas", c:"verdura", img:"swiss-chard.jpg", e:"🥬", kcal:19,p:1.8,cb:3.7,g:0.2 },
  { id:"lechuga", n:"Lechuga", c:"verdura", img:"iceberg-lettuce.jpg", e:"🥬", kcal:15,p:1.4,cb:2.9,g:0.2 },
  { id:"rucula", n:"Rúcula", c:"verdura", img:"arugula-or-rocket-salad.jpg", e:"🌿", kcal:25,p:2.6,cb:3.7,g:0.7 },
  { id:"canonigos", n:"Canónigos", c:"verdura", img:"lambs-lettuce.jpg", e:"🌿", kcal:21,p:2,cb:3.6,g:0.4 },
  { id:"pepino", n:"Pepino", c:"verdura", img:"cucumber.jpg", e:"🥒", kcal:15,p:0.7,cb:3.6,g:0.1, f:["crudo en ensalada","en gazpacho","encurtido"] },
  { id:"apio", n:"Apio", c:"verdura", img:"celery.jpg", e:"🥬", kcal:16,p:0.7,cb:3,g:0.2, f:["crudo","en caldo o guiso"] },
  { id:"puerro", n:"Puerro", c:"verdura", img:"leeks.jpg", e:"🥬", kcal:61,p:1.5,cb:14,g:0.3 },
  { id:"champinon", n:"Champiñón", c:"verdura", img:"mushrooms.png", e:"🍄", kcal:22,p:3.1,cb:3.3,g:0.3, f:["crudo laminado","salteado","a la plancha","relleno"] },
  { id:"seta", n:"Setas variadas", c:"verdura", img:"mixed-mushrooms.jpg", e:"🍄", kcal:25,p:3,cb:4,g:0.4 },
  { id:"esparrago_verde", n:"Espárrago verde", c:"verdura", img:"asparagus.png", e:"🌿", kcal:20,p:2.2,cb:3.9,g:0.1 },
  { id:"esparrago_blanco", n:"Espárrago blanco", c:"verdura", img:"white-asparagus.jpg", e:"🌿", kcal:18,p:1.9,cb:3.4,g:0.1 },
  { id:"alcachofa", n:"Alcachofa", c:"verdura", img:"artichokes.png", e:"🌿", kcal:47,p:3.3,cb:11,g:0.2 },
  { id:"judia_verde", n:"Judía verde", c:"verdura", img:"green-beans.jpg", e:"🫛", kcal:31,p:1.8,cb:7,g:0.2 },
  { id:"guisantes", n:"Guisantes", c:"verdura", img:"peas.jpg", e:"🫛", kcal:81,p:5.4,cb:14,g:0.4 },
  { id:"maiz", n:"Maíz dulce", c:"verdura", img:"corn.png", e:"🌽", kcal:86,p:3.3,cb:19,g:1.4 },
  { id:"remolacha", n:"Remolacha", c:"verdura", img:"beets.jpg", e:"🍠", kcal:43,p:1.6,cb:10,g:0.2, f:["cocida en ensalada","en crema fría","cruda rallada"] },
  { id:"kale", n:"Col kale", c:"verdura", img:"kale.jpg", e:"🥬", kcal:49,p:4.3,cb:9,g:0.9 },
  { id:"repollo", n:"Repollo", c:"verdura", img:"cabbage.jpg", e:"🥬", kcal:25,p:1.3,cb:6,g:0.1 },
  { id:"lombarda", n:"Col lombarda", c:"verdura", img:"red-cabbage.jpg", e:"🥬", kcal:31,p:1.4,cb:7,g:0.2 },
  { id:"endibia", n:"Endibia", c:"verdura", img:"endive.jpg", e:"🥬", kcal:17,p:1.3,cb:3.4,g:0.1 },
  { id:"rabano", n:"Rábano", c:"verdura", img:"radishes.jpg", e:"🥕", kcal:16,p:0.7,cb:3.4,g:0.1 },
  { id:"hinojo", n:"Hinojo", c:"verdura", img:"fennel.png", e:"🌿", kcal:31,p:1.2,cb:7.3,g:0.2 },
  // ---- FRUTAS ----
  { id:"manzana", n:"Manzana", c:"fruta", img:"apple.jpg", e:"🍎", kcal:52,p:0.3,cb:14,g:0.2, f:["cruda","asada","en compota","en bizcocho"] },
  { id:"platano", n:"Plátano", c:"fruta", img:"bananas.jpg", e:"🍌", kcal:89,p:1.1,cb:23,g:0.3 },
  { id:"naranja", n:"Naranja", c:"fruta", img:"orange.png", e:"🍊", kcal:47,p:0.9,cb:12,g:0.1 },
  { id:"mandarina", n:"Mandarina", c:"fruta", img:"tangerine.jpg", e:"🍊", kcal:53,p:0.8,cb:13,g:0.3 },
  { id:"limon", n:"Limón", c:"fruta", img:"lemon.png", e:"🍋", kcal:29,p:1.1,cb:9,g:0.3 },
  { id:"lima", n:"Lima", c:"fruta", img:"lime.jpg", e:"🍋", kcal:30,p:0.7,cb:11,g:0.2 },
  { id:"fresa", n:"Fresa", c:"fruta", img:"strawberries.png", e:"🍓", kcal:32,p:0.7,cb:8,g:0.3 },
  { id:"arandanos", n:"Arándanos", c:"fruta", img:"blueberries.jpg", e:"🫐", kcal:57,p:0.7,cb:14,g:0.3 },
  { id:"frambuesa", n:"Frambuesa", c:"fruta", img:"raspberries.jpg", e:"🍓", kcal:52,p:1.2,cb:12,g:0.7 },
  { id:"mora", n:"Mora", c:"fruta", img:"blackberries.jpg", e:"🫐", kcal:43,p:1.4,cb:10,g:0.5 },
  { id:"uva", n:"Uva", c:"fruta", img:"red-grapes.jpg", e:"🍇", kcal:69,p:0.7,cb:18,g:0.2 },
  { id:"sandia", n:"Sandía", c:"fruta", img:"watermelon.png", e:"🍉", kcal:30,p:0.6,cb:8,g:0.2 },
  { id:"melon", n:"Melón", c:"fruta", img:"cantaloupe.png", e:"🍈", kcal:34,p:0.8,cb:8,g:0.2 },
  { id:"pina", n:"Piña", c:"fruta", img:"pineapple.jpg", e:"🍍", kcal:50,p:0.5,cb:13,g:0.1 },
  { id:"mango", n:"Mango", c:"fruta", img:"mango.jpg", e:"🥭", kcal:60,p:0.8,cb:15,g:0.4 },
  { id:"kiwi", n:"Kiwi", c:"fruta", img:"kiwi.jpg", e:"🥝", kcal:61,p:1.1,cb:15,g:0.5 },
  { id:"pera", n:"Pera", c:"fruta", img:"pears-bosc.jpg", e:"🍐", kcal:57,p:0.4,cb:15,g:0.1 },
  { id:"melocoton", n:"Melocotón", c:"fruta", img:"peaches.jpg", e:"🍑", kcal:39,p:0.9,cb:10,g:0.3 },
  { id:"albaricoque", n:"Albaricoque", c:"fruta", img:"apricot.jpg", e:"🍑", kcal:48,p:1.4,cb:11,g:0.4 },
  { id:"ciruela", n:"Ciruela", c:"fruta", img:"plums.jpg", e:"🍑", kcal:46,p:0.7,cb:11,g:0.3 },
  { id:"cereza", n:"Cereza", c:"fruta", img:"cherries.jpg", e:"🍒", kcal:63,p:1.1,cb:16,g:0.2 },
  { id:"granada", n:"Granada", c:"fruta", img:"pomegranate.jpg", e:"🍎", kcal:83,p:1.7,cb:19,g:1.2 },
  { id:"higo", n:"Higo", c:"fruta", img:"figs.jpg", e:"🍑", kcal:74,p:0.8,cb:19,g:0.3 },
  { id:"papaya", n:"Papaya", c:"fruta", img:"papaya.jpg", e:"🥭", kcal:43,p:0.5,cb:11,g:0.3 },
  { id:"coco", n:"Coco", c:"fruta", img:"coconut.jpg", e:"🥥", kcal:354,p:3.3,cb:15,g:33 },
  { id:"aguacate", n:"Aguacate", c:"fruta", img:"avocado.jpg", e:"🥑", kcal:160,p:2,cb:9,g:15, f:["en tosta","en guacamole","en ensalada"] },
  { id:"datil", n:"Dátil", c:"fruta", img:"dates.jpg", e:"🍇", kcal:282,p:2.5,cb:75,g:0.4 },
  { id:"pomelo", n:"Pomelo", c:"fruta", img:"grapefruit.jpg", e:"🍊", kcal:42,p:0.8,cb:11,g:0.1 },
  // ---- CARNES ----
  { id:"pollo_pechuga", n:"Pechuga de pollo", c:"carne", img:"chicken-breasts.png", e:"🍗", kcal:165,p:31,cb:0,g:3.6, f:["a la plancha","empanada","al horno","en guiso","en curry"] },
  { id:"pollo_muslo", n:"Muslo de pollo", c:"carne", img:"chicken-thighs.png", e:"🍗", kcal:209,p:26,cb:0,g:11 },
  { id:"pavo", n:"Pavo", c:"carne", img:"turkey-breast.jpg", e:"🦃", kcal:135,p:29,cb:0,g:1.7 },
  { id:"ternera_filete", n:"Filete de ternera", c:"carne", img:"beef-cutlet.jpg", e:"🥩", kcal:187,p:26,cb:0,g:9, f:["poco hecho","al punto","muy hecho","en tiras salteado"] },
  { id:"carne_picada", n:"Carne picada de ternera", c:"carne", img:"fresh-ground-beef.jpg", e:"🥩", kcal:250,p:26,cb:0,g:15 },
  { id:"carne_picada_mixta", n:"Carne picada mixta", c:"carne", img:"meatloaf-mix.jpg", e:"🥩", kcal:263,p:25,cb:0,g:18 },
  { id:"lomo_cerdo", n:"Lomo de cerdo", c:"carne", img:"pork-tenderloin-raw.png", e:"🥩", kcal:143,p:26,cb:0,g:3.5 },
  { id:"secreto", n:"Secreto ibérico", c:"carne", img:"pork-shoulder.jpg", e:"🥩", kcal:290,p:17,cb:0,g:25 },
  { id:"cordero", n:"Cordero", c:"carne", img:"lamb-chops.jpg", e:"🍖", kcal:294,p:25,cb:0,g:21 },
  { id:"conejo", n:"Conejo", c:"carne", img:"rabbit.jpg", e:"🍖", kcal:173,p:33,cb:0,g:3.5 },
  { id:"jamon_serrano", n:"Jamón serrano", c:"carne", img:"serrano-ham.png", e:"🥓", kcal:241,p:31,cb:0,g:13 },
  { id:"jamon_cocido", n:"Jamón cocido", c:"carne", img:"ham.png", e:"🍖", kcal:126,p:19,cb:1,g:5 },
  { id:"bacon", n:"Bacon", c:"carne", img:"raw-bacon.png", e:"🥓", kcal:417,p:13,cb:1.4,g:42 },
  { id:"chorizo", n:"Chorizo", c:"carne", img:"chorizo.jpg", e:"🌭", kcal:455,p:24,cb:2,g:38 },
  { id:"salchichas", n:"Salchichas frescas", c:"carne", img:"raw-sausages.jpg", e:"🌭", kcal:301,p:12,cb:2,g:27 },
  { id:"morcilla", n:"Morcilla", c:"carne", img:"blood-sausage.jpg", e:"🌭", kcal:379,p:15,cb:1,g:35, f:["a la plancha","en guiso de legumbres","de arroz"] },
  // ---- PESCADOS Y MARISCOS ----
  { id:"salmon", n:"Salmón", c:"pescado", img:"salmon.png", e:"🐟", kcal:208,p:20,cb:0,g:13, f:["a la plancha","al horno","crudo (poke, sushi)","ahumado"] },
  { id:"merluza", n:"Merluza", c:"pescado", img:"hake.jpg", e:"🐟", kcal:86,p:17,cb:0,g:1.3 },
  { id:"bacalao", n:"Bacalao", c:"pescado", img:"cod-fillet.jpg", e:"🐟", kcal:82,p:18,cb:0,g:0.7 },
  { id:"atun_fresco", n:"Atún fresco", c:"pescado", img:"tuna-steak.png", e:"🐟", kcal:144,p:23,cb:0,g:5, f:["a la plancha (poco hecho)","en tartar","muy hecho"] },
  { id:"atun_lata", n:"Atún en conserva", c:"pescado", img:"canned-tuna.png", e:"🥫", kcal:116,p:26,cb:0,g:1 },
  { id:"dorada", n:"Dorada", c:"pescado", img:"sea-bream.jpg", e:"🐟", kcal:100,p:20,cb:0,g:2.3 },
  { id:"lubina", n:"Lubina", c:"pescado", img:"sea-bass.jpg", e:"🐟", kcal:97,p:18,cb:0,g:2.5 },
  { id:"sardina", n:"Sardina", c:"pescado", img:"sardines.jpg", e:"🐟", kcal:208,p:25,cb:0,g:11, f:["a la plancha o espeto","en lata","en escabeche"] },
  { id:"boqueron", n:"Boquerón", c:"pescado", img:"anchovies-fresh.jpg", e:"🐟", kcal:131,p:20,cb:0,g:5, f:["frito","en vinagre"] },
  { id:"rape", n:"Rape", c:"pescado", img:"monkfish.jpg", e:"🐟", kcal:76,p:15,cb:0,g:1.5 },
  { id:"trucha", n:"Trucha", c:"pescado", img:"trout.jpg", e:"🐟", kcal:119,p:20,cb:0,g:3.5 },
  { id:"gamba", n:"Gamba", c:"pescado", img:"shrimp.png", e:"🦐", kcal:99,p:24,cb:0.2,g:0.3, f:["a la plancha","al ajillo","cocida","en arroz o pasta"] },
  { id:"langostino", n:"Langostino", c:"pescado", img:"prawns.jpg", e:"🦐", kcal:106,p:20,cb:1,g:1.7 },
  { id:"mejillon", n:"Mejillón", c:"pescado", img:"mussels.jpg", e:"🦪", kcal:86,p:12,cb:4,g:2.2 },
  { id:"almeja", n:"Almeja", c:"pescado", img:"clams.jpg", e:"🦪", kcal:86,p:15,cb:3,g:1 },
  { id:"calamar", n:"Calamar", c:"pescado", img:"squid.jpg", e:"🦑", kcal:92,p:16,cb:3,g:1.4, f:["a la romana (frito)","a la plancha","en su tinta","en arroz"] },
  { id:"pulpo", n:"Pulpo", c:"pescado", img:"octopus.jpg", e:"🐙", kcal:82,p:15,cb:2,g:1 },
  { id:"sepia", n:"Sepia", c:"pescado", img:"cuttlefish.jpg", e:"🦑", kcal:79,p:16,cb:0.8,g:0.7 },
  { id:"surimi", n:"Palitos de cangrejo", c:"pescado", img:"surimi.jpg", e:"🦀", kcal:95,p:8,cb:15,g:0.4 },
  { id:"anchoa", n:"Anchoa en salazón", c:"pescado", img:"anchovies.jpg", e:"🐟", kcal:210,p:29,cb:0,g:10 },
  // ---- HUEVOS Y LÁCTEOS ----
  { id:"huevo", n:"Huevo", c:"lacteo", img:"egg.png", e:"🥚", kcal:155,p:13,cb:1.1,g:11, f:["frito","cocido","revuelto","en tortilla","escalfado (poché)"] },
  { id:"leche", n:"Leche", c:"lacteo", img:"milk.png", e:"🥛", kcal:61,p:3.2,cb:4.8,g:3.3 },
  { id:"nata", n:"Nata para cocinar", c:"lacteo", img:"fluid-cream.jpg", e:"🥛", kcal:195,p:2.5,cb:4,g:19 },
  { id:"mantequilla", n:"Mantequilla", c:"lacteo", img:"butter-sliced.jpg", e:"🧈", kcal:717,p:0.9,cb:0.1,g:81 },
  { id:"yogur", n:"Yogur natural", c:"lacteo", img:"plain-yogurt.jpg", e:"🥛", kcal:59,p:3.5,cb:4.7,g:3.3 },
  { id:"yogur_griego", n:"Yogur griego", c:"lacteo", img:"greek-yogurt.png", e:"🥛", kcal:97,p:9,cb:4,g:5 },
  { id:"queso_curado", n:"Queso curado", c:"lacteo", img:"manchego.jpg", e:"🧀", kcal:410,p:29,cb:1,g:33 },
  { id:"queso_fresco", n:"Queso fresco", c:"lacteo", img:"queso-fresco.jpg", e:"🧀", kcal:145,p:12,cb:3,g:9 },
  { id:"mozzarella", n:"Mozzarella", c:"lacteo", img:"mozzarella.png", e:"🧀", kcal:280,p:22,cb:2.2,g:20 },
  { id:"parmesano", n:"Parmesano", c:"lacteo", img:"parmesan.jpg", e:"🧀", kcal:431,p:38,cb:4,g:29 },
  { id:"queso_azul", n:"Queso azul", c:"lacteo", img:"blue-cheese.png", e:"🧀", kcal:353,p:21,cb:2.3,g:29, f:["en salsa","en ensalada","tal cual"] },
  { id:"queso_cabra", n:"Queso de cabra", c:"lacteo", img:"goat-cheese.jpg", e:"🧀", kcal:364,p:22,cb:0.1,g:30, f:["en ensalada templada","a la plancha","tal cual"] },
  { id:"requeson", n:"Requesón", c:"lacteo", img:"ricotta.png", e:"🧀", kcal:174,p:11,cb:3,g:13 },
  { id:"kefir", n:"Kéfir", c:"lacteo", img:"kefir.jpg", e:"🥛", kcal:55,p:3.3,cb:4.5,g:3 },
  { id:"queso_crema", n:"Queso crema", c:"lacteo", img:"cream-cheese.jpg", e:"🧀", kcal:342,p:6,cb:4,g:34 },
  { id:"huevo_codorniz", n:"Huevo de codorniz", c:"lacteo", img:"quail-eggs.jpg", e:"🥚", kcal:158,p:13,cb:0.4,g:11 },
  // ---- LEGUMBRES ----
  { id:"garbanzos", n:"Garbanzos", c:"legumbre", img:"chickpeas.png", e:"🫘", kcal:164,p:9,cb:27,g:2.6, f:["en guiso o cocido","en hummus","en ensalada","tostados crujientes"] },
  { id:"lentejas", n:"Lentejas", c:"legumbre", img:"lentils.png", e:"🫘", kcal:116,p:9,cb:20,g:0.4 },
  { id:"alubias_blancas", n:"Alubias blancas", c:"legumbre", img:"white-beans.jpg", e:"🫘", kcal:139,p:9.7,cb:25,g:0.5 },
  { id:"alubias_rojas", n:"Alubias rojas", c:"legumbre", img:"kidney-beans.jpg", e:"🫘", kcal:127,p:8.7,cb:23,g:0.5 },
  { id:"edamame", n:"Edamame", c:"legumbre", img:"edamame.png", e:"🫛", kcal:121,p:12,cb:9,g:5 },
  { id:"soja_texturizada", n:"Soja texturizada", c:"legumbre", img:"tvp.jpg", e:"🫘", kcal:330,p:50,cb:30,g:1 },
  { id:"tofu", n:"Tofu", c:"legumbre", img:"tofu.png", e:"⬜", kcal:76,p:8,cb:1.9,g:4.8, f:["a la plancha marinado","en curry o salteado","en crema/postres"] },
  { id:"guisante_seco", n:"Guisante seco", c:"legumbre", img:"split-peas.jpg", e:"🫛", kcal:118,p:8,cb:21,g:0.4 },
  // ---- CEREALES, PASTA Y PAN ----
  { id:"arroz_redondo", n:"Arroz redondo", c:"cereal", img:"uncooked-white-rice.png", e:"🍚", kcal:130,p:2.7,cb:28,g:0.3 },
  { id:"arroz_basmati", n:"Arroz basmati", c:"cereal", img:"basmati-rice.jpg", e:"🍚", kcal:121,p:3.5,cb:25,g:0.4 },
  { id:"arroz_integral", n:"Arroz integral", c:"cereal", img:"brown-rice.jpg", e:"🍚", kcal:111,p:2.6,cb:23,g:0.9 },
  { id:"espagueti", n:"Espaguetis", c:"cereal", img:"spaghetti.jpg", e:"🍝", kcal:158,p:5.8,cb:31,g:0.9 },
  { id:"macarrones", n:"Macarrones", c:"cereal", img:"macaroni.jpg", e:"🍝", kcal:158,p:5.8,cb:31,g:0.9 },
  { id:"pasta_fresca", n:"Pasta fresca", c:"cereal", img:"fresh-pasta.jpg", e:"🍝", kcal:131,p:5,cb:25,g:1.1 },
  { id:"fideos", n:"Fideos", c:"cereal", img:"vermicelli.jpg", e:"🍜", kcal:158,p:5.8,cb:31,g:0.9 },
  { id:"cuscus", n:"Cuscús", c:"cereal", img:"couscous-cooked.jpg", e:"🍚", kcal:112,p:3.8,cb:23,g:0.2 },
  { id:"quinoa", n:"Quinoa", c:"cereal", img:"uncooked-quinoa.png", e:"🍚", kcal:120,p:4.4,cb:21,g:1.9 },
  { id:"avena", n:"Copos de avena", c:"cereal", img:"rolled-oats.jpg", e:"🌾", kcal:389,p:17,cb:66,g:7 },
  { id:"pan", n:"Pan", c:"cereal", img:"crusty-bread.jpg", e:"🍞", kcal:265,p:9,cb:49,g:3.2 },
  { id:"pan_integral", n:"Pan integral", c:"cereal", img:"whole-wheat-bread.jpg", e:"🍞", kcal:247,p:13,cb:41,g:3.4 },
  { id:"pan_molde", n:"Pan de molde", c:"cereal", img:"white-bread.jpg", e:"🍞", kcal:266,p:8,cb:49,g:3.6 },
  { id:"harina", n:"Harina de trigo", c:"cereal", img:"flour.png", e:"🌾", kcal:364,p:10,cb:76,g:1 },
  { id:"tortillas_trigo", n:"Tortillas de trigo", c:"cereal", img:"flour-tortilla.jpg", e:"🫓", kcal:310,p:8,cb:52,g:7 },
  { id:"noodles", n:"Noodles orientales", c:"cereal", img:"asian-noodles.jpg", e:"🍜", kcal:138,p:4.5,cb:25,g:2 },
  // ---- FRUTOS SECOS Y SEMILLAS ----
  { id:"almendra", n:"Almendras", c:"frutoseco", img:"almonds.jpg", e:"🌰", kcal:579,p:21,cb:22,g:50 },
  { id:"nuez", n:"Nueces", c:"frutoseco", img:"walnuts.jpg", e:"🌰", kcal:654,p:15,cb:14,g:65 },
  { id:"avellana", n:"Avellanas", c:"frutoseco", img:"hazelnuts.jpg", e:"🌰", kcal:628,p:15,cb:17,g:61 },
  { id:"anacardo", n:"Anacardos", c:"frutoseco", img:"cashews.jpg", e:"🌰", kcal:553,p:18,cb:30,g:44 },
  { id:"pistacho", n:"Pistachos", c:"frutoseco", img:"pistachios.jpg", e:"🌰", kcal:560,p:20,cb:28,g:45 },
  { id:"cacahuete", n:"Cacahuetes", c:"frutoseco", img:"peanuts.png", e:"🥜", kcal:567,p:26,cb:16,g:49 },
  { id:"pinones", n:"Piñones", c:"frutoseco", img:"pine-nuts.png", e:"🌰", kcal:673,p:14,cb:13,g:68 },
  { id:"chia", n:"Semillas de chía", c:"frutoseco", img:"chia-seeds.jpg", e:"🌱", kcal:486,p:17,cb:42,g:31 },
  { id:"lino", n:"Semillas de lino", c:"frutoseco", img:"flax-seeds.png", e:"🌱", kcal:534,p:18,cb:29,g:42 },
  { id:"pipas_girasol", n:"Pipas de girasol", c:"frutoseco", img:"sunflower-seeds.jpg", e:"🌻", kcal:584,p:21,cb:20,g:51 },
  { id:"pipas_calabaza", n:"Pipas de calabaza", c:"frutoseco", img:"pumpkin-seeds.jpg", e:"🎃", kcal:559,p:30,cb:11,g:49 },
  { id:"sesamo", n:"Sésamo", c:"frutoseco", img:"sesame-seeds.png", e:"🌱", kcal:573,p:18,cb:23,g:50 },
  // ---- HIERBAS Y ESPECIAS ----
  { id:"perejil", n:"Perejil", c:"hierba", img:"parsley.jpg", e:"🌿", kcal:36,p:3,cb:6,g:0.8 },
  { id:"cilantro", n:"Cilantro", c:"hierba", img:"cilantro.png", e:"🌿", kcal:23,p:2.1,cb:3.7,g:0.5, f:["fresco por encima","cocinado en el plato"] },
  { id:"albahaca", n:"Albahaca", c:"hierba", img:"basil.jpg", e:"🌿", kcal:23,p:3.2,cb:2.7,g:0.6 },
  { id:"oregano", n:"Orégano", c:"hierba", img:"oregano.jpg", e:"🌿", kcal:265,p:9,cb:69,g:4.3 },
  { id:"tomillo", n:"Tomillo", c:"hierba", img:"thyme.jpg", e:"🌿", kcal:101,p:5.6,cb:24,g:1.7 },
  { id:"romero", n:"Romero", c:"hierba", img:"rosemary.jpg", e:"🌿", kcal:131,p:3.3,cb:21,g:5.9 },
  { id:"laurel", n:"Laurel", c:"hierba", img:"bay-leaves.jpg", e:"🍃", kcal:313,p:7.6,cb:75,g:8.4 },
  { id:"menta", n:"Menta / hierbabuena", c:"hierba", img:"mint.jpg", e:"🌿", kcal:70,p:3.8,cb:15,g:0.9 },
  { id:"eneldo", n:"Eneldo", c:"hierba", img:"dill.jpg", e:"🌿", kcal:43,p:3.5,cb:7,g:1.1 },
  { id:"cebollino", n:"Cebollino", c:"hierba", img:"chives.jpg", e:"🌿", kcal:30,p:3.3,cb:4.4,g:0.7 },
  { id:"pimenton", n:"Pimentón dulce", c:"hierba", img:"paprika.jpg", e:"🌶️", kcal:282,p:14,cb:54,g:13 },
  { id:"pimenton_picante", n:"Pimentón picante", c:"hierba", img:"smoked-paprika.jpg", e:"🌶️", kcal:282,p:14,cb:54,g:13 },
  { id:"comino", n:"Comino", c:"hierba", img:"cumin.jpg", e:"🟤", kcal:375,p:18,cb:44,g:22 },
  { id:"curcuma", n:"Cúrcuma", c:"hierba", img:"turmeric.jpg", e:"🟡", kcal:354,p:8,cb:65,g:10 },
  { id:"jengibre", n:"Jengibre", c:"hierba", img:"ginger.png", e:"🫚", kcal:80,p:1.8,cb:18,g:0.8, f:["fresco rallado","en infusión","encurtido","en polvo"] },
  { id:"canela", n:"Canela", c:"hierba", img:"cinnamon.jpg", e:"🟤", kcal:247,p:4,cb:81,g:1.2 },
  { id:"nuez_moscada", n:"Nuez moscada", c:"hierba", img:"nutmeg.jpg", e:"🟤", kcal:525,p:6,cb:49,g:36 },
  { id:"curry_polvo", n:"Curry en polvo", c:"hierba", img:"curry-powder.jpg", e:"🟡", kcal:325,p:14,cb:56,g:14 },
  { id:"azafran", n:"Azafrán", c:"hierba", img:"saffron.jpg", e:"🟠", kcal:310,p:11,cb:65,g:6 },
  { id:"pimienta", n:"Pimienta negra", c:"hierba", img:"black-pepper.png", e:"⚫", kcal:251,p:10,cb:64,g:3.3 },
  { id:"cayena", n:"Guindilla / cayena", c:"hierba", img:"red-chili.jpg", e:"🌶️", kcal:318,p:12,cb:57,g:17, f:["un toque suave","bien picante"] },
  { id:"vainilla", n:"Vainilla", c:"hierba", img:"vanilla.jpg", e:"🟤", kcal:288,p:0.1,cb:13,g:0.1 },
  // ---- DESPENSA SALADA ----
  { id:"aove", n:"Aceite de oliva virgen extra", c:"condimento", img:"olive-oil.jpg", e:"🫒", kcal:884,p:0,cb:0,g:100 },
  { id:"aceite_girasol", n:"Aceite de girasol", c:"condimento", img:"vegetable-oil.jpg", e:"🌻", kcal:884,p:0,cb:0,g:100 },
  { id:"vinagre", n:"Vinagre de vino", c:"condimento", img:"red-wine-vinegar.jpg", e:"🍶", kcal:19,p:0,cb:0.3,g:0 },
  { id:"vinagre_modena", n:"Vinagre de Módena", c:"condimento", img:"balsamic-vinegar.jpg", e:"🍶", kcal:88,p:0.5,cb:17,g:0 },
  { id:"sal", n:"Sal", c:"condimento", img:"salt.jpg", e:"🧂", kcal:0,p:0,cb:0,g:0 },
  { id:"mostaza", n:"Mostaza", c:"condimento", img:"dijon-mustard.jpg", e:"🟡", kcal:66,p:4,cb:6,g:3.3, f:["suave (en salsas)","fuerte tipo Dijon","en grano"] },
  { id:"mayonesa", n:"Mayonesa", c:"condimento", img:"mayonnaise.png", e:"🥚", kcal:680,p:1,cb:2.7,g:75 },
  { id:"ketchup", n:"Kétchup", c:"condimento", img:"ketchup.png", e:"🍅", kcal:112,p:1.2,cb:26,g:0.3 },
  { id:"salsa_soja", n:"Salsa de soja", c:"condimento", img:"soy-sauce.jpg", e:"🍶", kcal:53,p:8,cb:5,g:0.6 },
  { id:"tomate_frito", n:"Tomate frito / salsa de tomate", c:"condimento", img:"tomato-sauce.jpg", e:"🥫", kcal:77,p:1.5,cb:9,g:4 },
  { id:"tomate_triturado", n:"Tomate triturado", c:"condimento", img:"crushed-tomatoes.jpg", e:"🥫", kcal:32,p:1.6,cb:7,g:0.3 },
  { id:"caldo_pollo", n:"Caldo de pollo", c:"condimento", img:"chicken-broth.png", e:"🍲", kcal:12,p:1.2,cb:1,g:0.3 },
  { id:"caldo_verduras", n:"Caldo de verduras", c:"condimento", img:"vegetable-stock.jpg", e:"🍲", kcal:10,p:0.5,cb:2,g:0.1 },
  { id:"caldo_pescado", n:"Caldo de pescado (fumet)", c:"condimento", img:"fish-stock.jpg", e:"🍲", kcal:14,p:2,cb:0.5,g:0.4 },
  { id:"alcaparras", n:"Alcaparras", c:"condimento", img:"capers.jpg", e:"🫒", kcal:23,p:2.4,cb:5,g:0.9, f:["en salsas","por encima en ensaladas"] },
  { id:"aceitunas", n:"Aceitunas", c:"condimento", img:"olives-mixed.jpg", e:"🫒", kcal:115,p:0.8,cb:6,g:11, f:["verdes","negras","rellenas de anchoa"] },
  { id:"pepinillos", n:"Pepinillos", c:"condimento", img:"pickles.png", e:"🥒", kcal:14,p:0.6,cb:2.3,g:0.2, f:["en vinagre tal cual","picados en salsas"] },
  { id:"tahini", n:"Tahini", c:"condimento", img:"tahini-paste.png", e:"🥜", kcal:595,p:17,cb:21,g:54 },
  { id:"sriracha", n:"Salsa picante", c:"condimento", img:"hot-sauce-or-tabasco.png", e:"🌶️", kcal:93,p:2,cb:19,g:0.9 },
  { id:"vino_blanco", n:"Vino blanco (para cocinar)", c:"condimento", img:"white-wine.jpg", e:"🍷", kcal:82,p:0.1,cb:2.6,g:0 },
  // ---- DESPENSA DULCE ----
  { id:"azucar", n:"Azúcar", c:"dulce", img:"sugar-in-bowl.png", e:"🍚", kcal:387,p:0,cb:100,g:0 },
  { id:"azucar_moreno", n:"Azúcar moreno", c:"dulce", img:"dark-brown-sugar.png", e:"🟤", kcal:380,p:0,cb:98,g:0 },
  { id:"miel", n:"Miel", c:"dulce", img:"honey.png", e:"🍯", kcal:304,p:0.3,cb:82,g:0 },
  { id:"chocolate_negro", n:"Chocolate negro", c:"dulce", img:"dark-chocolate-pieces.jpg", e:"🍫", kcal:546,p:5,cb:61,g:31 },
  { id:"chocolate_leche", n:"Chocolate con leche", c:"dulce", img:"milk-chocolate.jpg", e:"🍫", kcal:535,p:8,cb:59,g:30 },
  { id:"cacao", n:"Cacao puro en polvo", c:"dulce", img:"cocoa-powder.png", e:"🍫", kcal:228,p:20,cb:58,g:14 },
  { id:"mermelada", n:"Mermelada", c:"dulce", img:"strawberry-jam.png", e:"🍓", kcal:250,p:0.4,cb:65,g:0.1 },
  { id:"leche_condensada", n:"Leche condensada", c:"dulce", img:"sweetened-condensed-milk.jpg", e:"🥛", kcal:321,p:8,cb:54,g:9 },
  { id:"levadura", n:"Levadura química", c:"dulce", img:"baking-powder.jpg", e:"🌾", kcal:53,p:0,cb:28,g:0 },
  { id:"sirope_arce", n:"Sirope de arce", c:"dulce", img:"maple-syrup.png", e:"🍁", kcal:260,p:0,cb:67,g:0.1 },
];

/* Recetario. dif: 1 fácil · 2 media · 3 elaborada. min: tiempo total.
   nut: valores aproximados POR RACIÓN. ing[].forma enlaza con los matices. */
const RECETAS = [
  { id:"tortilla_patatas", n:"Tortilla de patatas", cat:"comida", dif:2, min:40, rac:4,
    desc:"El clásico entre los clásicos, jugosa por dentro y dorada por fuera.",
    e:"🍳", nut:{kcal:320,p:11,cb:24,g:20}, tags:["vegetariana","sin gluten","clásico español","airfryer"],
    ing:[{id:"patata",q:"600 g",forma:"en tortilla"},{id:"huevo",q:"6 uds",forma:"en tortilla"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"aove",q:"300 ml"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Pela y corta las patatas en láminas finas y la cebolla en juliana. Sálalas."},
      {t:"Confítalas en abundante aceite a fuego medio-bajo hasta que estén tiernas, sin que se doren demasiado.",s:1200},
      {t:"Escurre bien el aceite. Bate los huevos en un bol grande con una pizca de sal."},
      {t:"Mezcla patata y cebolla con el huevo y deja reposar para que se empapen.",s:300},
      {t:"Cuaja en sartén antiadherente a fuego medio, 3 min por el primer lado.",s:180},
      {t:"Dale la vuelta con un plato y cuaja 2-3 min más según la quieras de jugosa.",s:150}],
    airfryer:[
      {t:"Corta patatas finas, sálalas. Calienta aceite en sartén a fuego fuerte."},
      {t:"Saltea patatas y cebolla hasta que estén tiernas pero sin dorar, 8 min.",s:480},
      {t:"Bate 6 huevos con sal. Vierte sobre patatas aún en la sartén, baja fuego."},
      {t:"Cuando cuaje la base (2 min), pasa a bandeja de airfryer. Asa a 180°, 8 min.",s:480},
      {t:"Sirve tal cual o dale la vuelta si quieres más tostada."}]},
  { id:"gazpacho", n:"Gazpacho andaluz", cat:"cena", dif:1, min:15, rac:4,
    desc:"Fresquísimo, de vaso o de cuchara. El verano en un bol.",
    e:"🍅", nut:{kcal:140,p:2,cb:12,g:9}, tags:["vegana","sin lactosa","frío","verano"],
    ing:[{id:"tomate",q:"1 kg",forma:"crudo en ensalada"},{id:"pepino",q:"1/2 ud",forma:"en gazpacho"},{id:"pimiento_verde",q:"1 ud",forma:"crudo"},{id:"ajo",q:"1 diente",forma:"crudo (alioli, gazpacho)"},{id:"pan",q:"50 g"},{id:"aove",q:"50 ml"},{id:"vinagre",q:"2 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Trocea tomates, pepino, pimiento y ajo. Remoja el pan en agua."},
      {t:"Tritura todo junto con el vinagre y la sal hasta que quede muy fino.",s:120},
      {t:"Emulsiona añadiendo el aceite en hilo con la batidora en marcha."},
      {t:"Pásalo por un colador si lo quieres extra fino y rectifica de sal."},
      {t:"Enfría en la nevera al menos 1 hora antes de servir.",s:3600}]},
  { id:"salmorejo", n:"Salmorejo cordobés", cat:"cena", dif:1, min:15, rac:4,
    desc:"Más denso que el gazpacho, con su huevo picado y su jamón por encima.",
    e:"🥣", nut:{kcal:260,p:7,cb:22,g:16}, tags:["frío","verano","clásico español"],
    ing:[{id:"tomate",q:"1 kg",forma:"crudo en ensalada"},{id:"pan",q:"200 g"},{id:"ajo",q:"1 diente",forma:"crudo (alioli, gazpacho)"},{id:"aove",q:"100 ml"},{id:"huevo",q:"2 uds",forma:"cocido"},{id:"jamon_serrano",q:"50 g"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Tritura los tomates y cuélalos para quitar pieles y pepitas."},
      {t:"Añade el pan troceado y deja que se empape 10 minutos.",s:600},
      {t:"Tritura con ajo y sal; añade el aceite en hilo hasta que quede cremoso.",s:120},
      {t:"Cuece los huevos 10 min, enfría y pícalos.",s:600},
      {t:"Sirve bien frío con huevo picado y virutas de jamón por encima."}]},
  { id:"lentejas", n:"Lentejas con verduras", cat:"comida", dif:2, min:50, rac:4,
    desc:"Guiso de cuchara de toda la vida, en versión ligera con verduras.",
    e:"🍲", nut:{kcal:380,p:20,cb:55,g:8}, tags:["alta en fibra","de cuchara","batch cooking","congelable"],
    ing:[{id:"lentejas",q:"320 g"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"zanahoria",q:"2 uds",forma:"cocida en guiso"},{id:"pimiento_verde",q:"1 ud",forma:"en sofrito"},{id:"ajo",q:"2 dientes",forma:"dorado en aceite"},{id:"patata",q:"1 ud",forma:"cocida"},{id:"tomate_triturado",q:"100 g"},{id:"pimenton",q:"1 cdta"},{id:"laurel",q:"1 hoja"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Sofríe cebolla, ajo, pimiento y zanahoria picados en el aceite.",s:480},
      {t:"Añade el pimentón, remueve 30 segundos y agrega el tomate triturado.",s:120},
      {t:"Incorpora lentejas, patata en trozos, laurel y agua que cubra dos dedos."},
      {t:"Cuece a fuego suave hasta que la lenteja esté tierna. Remueve de vez en cuando.",s:1800},
      {t:"Rectifica de sal y deja reposar 5 minutos antes de servir.",s:300}],
    thermomix:[
      {t:"Tritúralo 5 seg, velocidad 5. Raspa los laterales."},
      {t:"Añade lentejas, patata, laurel, tomate y caldo. Cuece 40 min, 100°C, velocidad cuchara.",s:2400},
      {t:"Rectifica de sal y sirve."}]},
  { id:"crema_calabacin", n:"Crema de calabacín", cat:"cena", dif:1, min:30, rac:4,
    desc:"Sedosa, ligera y lista en media hora. Cena comodín donde las haya.",
    e:"🥣", nut:{kcal:150,p:5,cb:12,g:9}, tags:["vegetariana","ligera","apta para niños","congelable"],
    ing:[{id:"calabacin",q:"2 uds",forma:"en crema"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"patata",q:"1 ud",forma:"cocida"},{id:"queso_crema",q:"2 cdas"},{id:"caldo_verduras",q:"500 ml"},{id:"aove",q:"2 cdas"},{id:"sal",q:"al gusto"},{id:"pimienta",q:"al gusto"}],
    pasos:[
      {t:"Pocha la cebolla en el aceite hasta que esté transparente.",s:300},
      {t:"Añade calabacín y patata troceados y rehoga 5 minutos.",s:300},
      {t:"Cubre con el caldo y cuece hasta que la patata esté tierna.",s:900},
      {t:"Tritura con el queso crema hasta que quede fina. Salpimienta."},
      {t:"Sirve con un hilo de aceite y, si quieres, picatostes."}],
    thermomix:[
      {t:"Pon calabacín, patata, cebolla y caldo. Cuece 20 min, 100°C, velocidad cuchara.",s:1200},
      {t:"Añade queso crema y tritura 20 seg, velocidad 7. Salpimienta."},
      {t:"Sirve con un hilo de aceite."}]},
  { id:"pollo_ajillo", n:"Pollo al ajillo", cat:"comida", dif:2, min:35, rac:4,
    desc:"Dorado, con su ajito frito y un golpe de vino blanco. Pan obligatorio.",
    e:"🍗", nut:{kcal:420,p:38,cb:3,g:26}, tags:["sin gluten","clásico español","airfryer"],
    ing:[{id:"pollo_muslo",q:"1 kg"},{id:"ajo",q:"8 dientes",forma:"dorado en aceite"},{id:"vino_blanco",q:"150 ml"},{id:"laurel",q:"2 hojas"},{id:"romero",q:"1 rama"},{id:"aove",q:"4 cdas"},{id:"sal",q:"al gusto"},{id:"pimienta",q:"al gusto"}],
    pasos:[
      {t:"Salpimienta el pollo troceado. Lamina los ajos."},
      {t:"Dora los ajos en el aceite y resérvalos antes de que se quemen.",s:120},
      {t:"En ese aceite, dora el pollo bien por todos los lados.",s:600},
      {t:"Devuelve los ajos, añade vino, laurel y romero, y deja evaporar el alcohol.",s:120},
      {t:"Tapa y cocina a fuego medio hasta que el pollo esté hecho y la salsa ligada.",s:900}],
    airfryer:[
      {t:"Trocea el pollo, salpimienta y rocía con spray de aceite."},
      {t:"Asa a 200 °C, 20 min, removiendo a media cocción.",s:1200},
      {t:"Aparte, dora ajos laminados en una sartén con aceite, con vino, laurel y romero."},
      {t:"Vierte la salsa sobre el pollo asado y sirve."}]},
  { id:"arroz_cubana", n:"Arroz a la cubana", cat:"comida", dif:1, min:25, rac:2,
    desc:"Arroz blanco, tomate, huevo frito y, si te va, plátano. Placer sencillo.",
    e:"🍚", nut:{kcal:560,p:16,cb:75,g:21}, tags:["rápida","apta para niños"],
    ing:[{id:"arroz_redondo",q:"180 g"},{id:"huevo",q:"2 uds",forma:"frito"},{id:"tomate_frito",q:"150 g"},{id:"platano",q:"1 ud"},{id:"ajo",q:"1 diente",forma:"dorado en aceite"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Dora el ajo en una cazuela con un poco de aceite, añade el arroz y nácaralo."},
      {t:"Añade el doble de agua que de arroz y sal; cuece tapado a fuego bajo.",s:1080},
      {t:"Calienta el tomate frito. Si usas plátano, dóralo en sartén."},
      {t:"Fríe los huevos en aceite bien caliente con puntilla."},
      {t:"Monta el plato: arroz, tomate, huevo encima y plátano al lado."}]},
  { id:"carbonara", n:"Espaguetis a la carbonara", cat:"comida", dif:2, min:25, rac:2,
    desc:"La de verdad: huevo, queso, pimienta y nada de nata.",
    e:"🍝", nut:{kcal:620,p:26,cb:68,g:26}, tags:["italiana","rápida"],
    ing:[{id:"espagueti",q:"200 g"},{id:"bacon",q:"120 g"},{id:"huevo",q:"2 uds"},{id:"parmesano",q:"60 g"},{id:"pimienta",q:"generosa"},{id:"sal",q:"para el agua"}],
    pasos:[
      {t:"Cuece la pasta en agua con sal siguiendo el tiempo del paquete.",s:540},
      {t:"Mientras, dora el bacon en tiras a fuego medio sin aceite.",s:300},
      {t:"Bate los huevos con el parmesano rallado y mucha pimienta."},
      {t:"Escurre la pasta reservando un vaso del agua de cocción."},
      {t:"Fuera del fuego, mezcla pasta, bacon y la crema de huevo; liga con un poco de agua de cocción hasta que quede sedosa."}]},
  { id:"bolonesa", n:"Macarrones a la boloñesa", cat:"comida", dif:2, min:45, rac:4,
    desc:"Salsa de carne melosa cocinada sin prisa. Un valor seguro en casa.",
    e:"🍝", nut:{kcal:580,p:28,cb:70,g:20}, tags:["apta para niños","batch cooking","congelable"],
    ing:[{id:"macarrones",q:"360 g"},{id:"carne_picada_mixta",q:"400 g"},{id:"cebolla",q:"1 ud",forma:"en salsa (triturada)"},{id:"zanahoria",q:"1 ud",forma:"cocida en guiso"},{id:"apio",q:"1 rama",forma:"en caldo o guiso"},{id:"tomate_triturado",q:"400 g"},{id:"ajo",q:"2 dientes",forma:"dorado en aceite"},{id:"oregano",q:"1 cdta"},{id:"parmesano",q:"40 g"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Sofríe cebolla, ajo, zanahoria y apio picados muy finos.",s:480},
      {t:"Sube el fuego, añade la carne y dórala deshaciéndola bien.",s:360},
      {t:"Agrega tomate y orégano; cocina a fuego suave al menos 20 min.",s:1200},
      {t:"Cuece los macarrones en agua con sal y escúrrelos al dente.",s:600},
      {t:"Mezcla pasta y salsa, y sirve con parmesano rallado por encima."}]},
  { id:"cesar", n:"Ensalada césar con pollo", cat:"cena", dif:1, min:20, rac:2,
    desc:"Crujiente, cremosa y con pollo a la plancha. Cena completa.",
    e:"🥗", nut:{kcal:480,p:35,cb:18,g:30}, tags:["rápida","alta en proteína"],
    ing:[{id:"lechuga",q:"1 ud"},{id:"pollo_pechuga",q:"250 g",forma:"a la plancha"},{id:"pan_molde",q:"2 rebanadas"},{id:"parmesano",q:"30 g"},{id:"mayonesa",q:"3 cdas"},{id:"anchoa",q:"3 filetes"},{id:"mostaza",q:"1 cdta",forma:"suave (en salsas)"},{id:"limon",q:"1/2 ud"},{id:"aove",q:"2 cdas"},{id:"ajo",q:"1/2 diente",forma:"crudo (alioli, gazpacho)"}],
    pasos:[
      {t:"Haz la salsa: tritura mayonesa, anchoas, mostaza, ajo, limón y parmesano."},
      {t:"Corta el pan en dados y tuéstalos con un hilo de aceite hasta dorarse.",s:300},
      {t:"Marca la pechuga salpimentada a la plancha, 3-4 min por lado, y córtala en tiras.",s:420},
      {t:"Trocea la lechuga, aliña con la salsa y mezcla bien."},
      {t:"Corona con pollo, picatostes y lascas de parmesano."}]},
  { id:"salmon_horno", n:"Salmón al horno con verduras", cat:"cena", dif:1, min:30, rac:2,
    desc:"Bandeja única al horno: salmón jugoso sobre cama de verduras.",
    e:"🐟", nut:{kcal:460,p:34,cb:18,g:28}, tags:["sin gluten","omega 3","ligera","airfryer"],
    ing:[{id:"salmon",q:"2 lomos",forma:"al horno"},{id:"calabacin",q:"1 ud",forma:"a la plancha"},{id:"pimiento_rojo",q:"1 ud",forma:"asado"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"limon",q:"1 ud"},{id:"eneldo",q:"1 cdta"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"},{id:"pimienta",q:"al gusto"}],
    pasos:[
      {t:"Precalienta el horno a 200 °C. Corta las verduras en tiras finas."},
      {t:"Extiéndelas en una bandeja, aliña con aceite, sal y pimienta, y hornea 12 min.",s:720},
      {t:"Coloca encima los lomos salpimentados, con rodajas de limón y eneldo."},
      {t:"Hornea 10-12 min más, hasta que el salmón esté jugoso pero hecho.",s:660},
      {t:"Sirve con un último chorrito de limón por encima."}],
    airfryer:[
      {t:"Corta verduras en tiras finas. Pásalas por spray de aceite y sazónalas."},
      {t:"Asa en airfryer a 200 °C, 10 min.",s:600},
      {t:"Añade los lomos de salmón con limón y eneldo. Asa 8-10 min más.",s:540},
      {t:"Sirve con un chorrito de limón fresco."}]},
  { id:"merluza_verde", n:"Merluza en salsa verde", cat:"comida", dif:2, min:30, rac:4,
    desc:"Cazuela vasca de toda la vida: merluza, perejil y unas almejas.",
    e:"🐟", nut:{kcal:310,p:35,cb:6,g:15}, tags:["sin lactosa","clásico español"],
    ing:[{id:"merluza",q:"4 lomos"},{id:"almeja",q:"250 g"},{id:"ajo",q:"3 dientes",forma:"dorado en aceite"},{id:"perejil",q:"1 manojo"},{id:"vino_blanco",q:"100 ml"},{id:"harina",q:"1 cda"},{id:"caldo_pescado",q:"200 ml"},{id:"aove",q:"4 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Dora el ajo picado en el aceite sin que tome color.",s:90},
      {t:"Añade la harina, remueve, y agrega vino y caldo poco a poco sin dejar de mover.",s:180},
      {t:"Incorpora la merluza salada y las almejas; menea la cazuela para ligar.",s:300},
      {t:"Cocina a fuego suave hasta que las almejas se abran y la merluza esté hecha.",s:360},
      {t:"Lluvia generosa de perejil picado y a la mesa en la propia cazuela."}]},
  { id:"albondigas", n:"Albóndigas en salsa de tomate", cat:"comida", dif:2, min:50, rac:4,
    desc:"Tiernas por dentro, con salsa para mojar pan sin remordimientos.",
    e:"🧆", nut:{kcal:490,p:30,cb:20,g:32}, tags:["apta para niños","batch cooking","congelable","airfryer"],
    ing:[{id:"carne_picada_mixta",q:"500 g"},{id:"huevo",q:"1 ud"},{id:"pan_molde",q:"1 rebanada"},{id:"leche",q:"50 ml"},{id:"ajo",q:"2 dientes",forma:"crudo (alioli, gazpacho)"},{id:"perejil",q:"2 cdas"},{id:"harina",q:"para rebozar"},{id:"tomate_triturado",q:"400 g"},{id:"cebolla",q:"1 ud",forma:"en salsa (triturada)"},{id:"aove",q:"4 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Remoja el pan en leche. Mezcla la carne con huevo, ajo, perejil, sal y el pan escurrido."},
      {t:"Forma bolas, pásalas por harina y dóralas en aceite. Resérvalas.",s:480},
      {t:"En ese aceite, pocha la cebolla y añade el tomate; cocina 10 min.",s:600},
      {t:"Tritura la salsa, devuelve las albóndigas y cuece a fuego suave.",s:900},
      {t:"Reposa 5 minutos y sirve con pan o arroz blanco.",s:300}],
    airfryer:[
      {t:"Forma las albóndigas. Sin rebozar, pásalas por spray de aceite ligero."},
      {t:"Hornea en airfryer a 200 °C, 12-14 min, removiendo a media cocción.",s:800},
      {t:"Mientras, prepara la salsa de tomate en una cazuela con cebolla pochada."},
      {t:"Sirve las albóndigas sobre la salsa de tomate con pan o arroz."}]},
  { id:"pisto", n:"Pisto manchego con huevo", cat:"cena", dif:2, min:45, rac:4,
    desc:"Verduras confitadas a fuego lento coronadas con huevo.",
    e:"🍳", nut:{kcal:280,p:10,cb:16,g:19}, tags:["vegetariana","sin gluten","de aprovechamiento"],
    ing:[{id:"tomate",q:"600 g",forma:"triturado en salsa"},{id:"calabacin",q:"1 ud",forma:"salteado"},{id:"berenjena",q:"1 ud",forma:"en pisto"},{id:"pimiento_rojo",q:"1 ud",forma:"frito"},{id:"pimiento_verde",q:"1 ud",forma:"frito"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"huevo",q:"4 uds",forma:"frito"},{id:"aove",q:"5 cdas"},{id:"azucar",q:"1 pizca"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Corta toda la verdura en dados pequeños y regulares."},
      {t:"Pocha la cebolla y los pimientos a fuego medio-bajo.",s:600},
      {t:"Añade berenjena y calabacín y cocina hasta que estén tiernos.",s:600},
      {t:"Agrega el tomate con una pizca de azúcar y sal; reduce a fuego lento.",s:900},
      {t:"Sirve con un huevo frito (o escalfado) por persona encima."}]},
  { id:"fajitas", n:"Fajitas de pollo", cat:"cena", dif:1, min:30, rac:4,
    desc:"Sartenada colorida para montar en la mesa. Éxito familiar asegurado.",
    e:"🌮", nut:{kcal:520,p:32,cb:50,g:20}, tags:["tex-mex","apta para niños","para compartir","airfryer"],
    ing:[{id:"tortillas_trigo",q:"8 uds"},{id:"pollo_pechuga",q:"500 g",forma:"en curry"},{id:"pimiento_rojo",q:"1 ud",forma:"frito"},{id:"pimiento_verde",q:"1 ud",forma:"frito"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"comino",q:"1 cdta"},{id:"pimenton",q:"1 cdta"},{id:"lima",q:"1 ud"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Corta pollo, pimientos y cebolla en tiras. Adoba el pollo con comino, pimentón y sal."},
      {t:"Saltea el pollo a fuego fuerte hasta dorarlo y resérvalo.",s:360},
      {t:"Saltea las verduras en la misma sartén hasta que estén al dente.",s:300},
      {t:"Junta todo, exprime la lima por encima y da un último golpe de calor.",s:120},
      {t:"Calienta las tortillas 30 s por lado y sirve para que cada uno monte la suya."}],
    airfryer:[
      {t:"Tira pollo y verduras en tiras. Salpimienta, adoba con comino y pimentón."},
      {t:"Pasa por spray de aceite y asa a 200 °C, 15 min, removiendo a media cocción.",s:900},
      {t:"Vierte en una bandeja, exprime lima y mezcla bien."},
      {t:"Calienta las tortillas en sartén 30 s por lado. Sirve para montar."}]},
  { id:"curry_garbanzos", n:"Curry de garbanzos", cat:"comida", dif:1, min:35, rac:4,
    desc:"Cremoso, especiado y 100 % vegetal. Con arroz basmati es un abrazo.",
    e:"🍛", nut:{kcal:430,p:14,cb:60,g:14}, tags:["vegana","sin gluten","especiada"],
    ing:[{id:"garbanzos",q:"400 g (cocidos)",forma:"en guiso o cocido"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"ajo",q:"2 dientes",forma:"dorado en aceite"},{id:"jengibre",q:"1 trozo",forma:"fresco rallado"},{id:"curry_polvo",q:"1 cda"},{id:"tomate_triturado",q:"200 g"},{id:"coco",q:"200 ml (leche de coco)"},{id:"arroz_basmati",q:"300 g"},{id:"cilantro",q:"al gusto",forma:"fresco por encima"},{id:"aove",q:"2 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Pocha la cebolla; añade ajo y jengibre rallados y el curry, y tuesta 1 min.",s:420},
      {t:"Agrega el tomate y cocina hasta que pierda el agua.",s:300},
      {t:"Incorpora garbanzos y leche de coco; cuece a fuego suave.",s:600},
      {t:"Mientras, cuece el arroz basmati (2 partes de agua por 1 de arroz).",s:720},
      {t:"Rectifica de sal y sirve el curry sobre el arroz con cilantro fresco."}]},
  { id:"risotto_setas", n:"Risotto de setas", cat:"comida", dif:3, min:45, rac:4,
    desc:"Cremosidad a base de caldo, paciencia y un buen mantecado final.",
    e:"🍄", nut:{kcal:520,p:14,cb:70,g:20}, tags:["vegetariana","italiana","para impresionar"],
    ing:[{id:"arroz_redondo",q:"320 g"},{id:"seta",q:"300 g"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"vino_blanco",q:"100 ml"},{id:"caldo_verduras",q:"1,2 l"},{id:"parmesano",q:"80 g"},{id:"mantequilla",q:"40 g"},{id:"aove",q:"2 cdas"},{id:"sal",q:"al gusto"},{id:"pimienta",q:"al gusto"}],
    pasos:[
      {t:"Saltea las setas a fuego fuerte y resérvalas. Mantén el caldo caliente.",s:300},
      {t:"Pocha la cebolla picada fina; añade el arroz y nácaralo 2 min.",s:420},
      {t:"Moja con el vino y deja evaporar sin dejar de remover.",s:120},
      {t:"Añade caldo caliente cazo a cazo, removiendo, durante unos 18 min.",s:1080},
      {t:"Incorpora las setas al final de la cocción."},
      {t:"Fuera del fuego, manteca con mantequilla y parmesano. Reposa 2 min y sirve.",s:120}]},
  { id:"ensaladilla", n:"Ensaladilla rusa", cat:"comida", dif:2, min:40, rac:6,
    desc:"De tapeo o de tupper: patata, mahonesa y ese punto de encurtido.",
    e:"🥔", nut:{kcal:340,p:10,cb:22,g:24}, tags:["fría","clásico español","para compartir"],
    ing:[{id:"patata",q:"800 g",forma:"cocida"},{id:"zanahoria",q:"2 uds",forma:"cocida en guiso"},{id:"guisantes",q:"100 g"},{id:"huevo",q:"3 uds",forma:"cocido"},{id:"atun_lata",q:"2 latas"},{id:"mayonesa",q:"200 g"},{id:"pepinillos",q:"4 uds",forma:"picados en salsas"},{id:"aceitunas",q:"un puñado",forma:"rellenas de anchoa"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Cuece las patatas y zanahorias con piel en agua con sal hasta que estén tiernas.",s:1500},
      {t:"Cuece los huevos 10 min y los guisantes 5. Enfría todo.",s:600},
      {t:"Pela y corta en daditos patata, zanahoria y huevo; pica los pepinillos."},
      {t:"Mezcla con atún escurrido, guisantes y mayonesa sin machacar demasiado."},
      {t:"Enfría 30 min y decora con aceitunas antes de servir.",s:1800}]},
  { id:"hummus", n:"Hummus casero", cat:"aperitivo", dif:1, min:10, rac:4,
    desc:"Crema de garbanzos con tahini y limón. Adictivo con crudités o pan.",
    e:"🥣", nut:{kcal:210,p:8,cb:20,g:12}, tags:["vegana","sin gluten","para picar"],
    ing:[{id:"garbanzos",q:"400 g (cocidos)",forma:"en hummus"},{id:"tahini",q:"2 cdas"},{id:"limon",q:"1 ud"},{id:"ajo",q:"1/2 diente",forma:"crudo (alioli, gazpacho)"},{id:"comino",q:"1/2 cdta"},{id:"pimenton",q:"para decorar"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Escurre los garbanzos reservando un poco de su líquido."},
      {t:"Tritura garbanzos, tahini, zumo de limón, ajo, comino y sal.",s:120},
      {t:"Ajusta la textura con el líquido reservado hasta que quede cremoso."},
      {t:"Sirve con un hilo de aceite y pimentón espolvoreado."}]},
  { id:"guacamole", n:"Guacamole", cat:"aperitivo", dif:1, min:10, rac:4,
    desc:"Machacado al momento, con lima y cilantro. Nada de batidora.",
    e:"🥑", nut:{kcal:180,p:2,cb:9,g:16}, tags:["vegana","sin gluten","tex-mex"],
    ing:[{id:"aguacate",q:"3 uds",forma:"en guacamole"},{id:"lima",q:"1 ud"},{id:"cebolleta",q:"1 ud",forma:"cruda"},{id:"tomate",q:"1 ud",forma:"crudo en ensalada"},{id:"cilantro",q:"2 cdas",forma:"fresco por encima"},{id:"cayena",q:"opcional",forma:"un toque suave"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Machaca los aguacates con tenedor dejando algo de textura."},
      {t:"Pica fino cebolleta, tomate (sin pepitas) y cilantro, y mézclalos."},
      {t:"Aliña con zumo de lima, sal y cayena si te gusta el picante."},
      {t:"Sirve al momento con totopos o crudités."}]},
  { id:"tosta_aguacate", n:"Tosta de aguacate y huevo", cat:"desayuno", dif:1, min:10, rac:1,
    desc:"El desayuno-brunch por excelencia: pan bueno, aguacate y huevo.",
    e:"🥑", nut:{kcal:390,p:15,cb:30,g:23}, tags:["vegetariana","brunch","rápida"],
    ing:[{id:"pan_integral",q:"2 rebanadas"},{id:"aguacate",q:"1 ud",forma:"en tosta"},{id:"huevo",q:"1 ud",forma:"escalfado (poché)"},{id:"limon",q:"unas gotas"},{id:"cayena",q:"opcional",forma:"un toque suave"},{id:"aove",q:"1 cdta"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Tuesta el pan hasta que esté crujiente.",s:180},
      {t:"Machaca el aguacate con limón y sal, y úntalo generosamente."},
      {t:"Escalfa el huevo 3 min en agua con un chorrito de vinagre.",s:180},
      {t:"Corónalo sobre la tosta con aceite, sal en escamas y cayena."}]},
  { id:"porridge", n:"Porridge de avena y frutas", cat:"desayuno", dif:1, min:10, rac:1,
    desc:"Gachas cremosas de avena con fruta fresca y frutos secos.",
    e:"🥣", nut:{kcal:350,p:12,cb:55,g:9}, tags:["vegetariana","saciante","energía lenta"],
    ing:[{id:"avena",q:"50 g"},{id:"leche",q:"250 ml"},{id:"platano",q:"1/2 ud"},{id:"arandanos",q:"un puñado"},{id:"nuez",q:"4 uds"},{id:"canela",q:"1 pizca"},{id:"miel",q:"1 cdta"}],
    pasos:[
      {t:"Cuece la avena con la leche a fuego suave removiendo.",s:300},
      {t:"Cuando espese, aparta y añade canela y miel."},
      {t:"Corona con plátano en rodajas, arándanos y nueces troceadas."}]},
  { id:"poke", n:"Poke bowl de salmón", cat:"cena", dif:2, min:30, rac:2,
    desc:"Bol hawaiano de arroz, salmón marinado y toppings frescos.",
    e:"🍣", nut:{kcal:560,p:30,cb:65,g:20}, tags:["sin lactosa","fresca","de moda"],
    ing:[{id:"arroz_redondo",q:"180 g"},{id:"salmon",q:"250 g",forma:"crudo (poke, sushi)"},{id:"salsa_soja",q:"3 cdas"},{id:"aguacate",q:"1 ud",forma:"en ensalada"},{id:"pepino",q:"1/2 ud",forma:"crudo en ensalada"},{id:"edamame",q:"100 g"},{id:"sesamo",q:"1 cda"},{id:"cebolleta",q:"1 ud",forma:"cruda"},{id:"jengibre",q:"opcional",forma:"encurtido"}],
    pasos:[
      {t:"IMPORTANTE: usa salmón previamente congelado 5 días (anisakis). Córtalo en dados."},
      {t:"Marina el salmón con soja y la cebolleta picada en la nevera.",s:900},
      {t:"Cuece el arroz, aliña con un toque de vinagre y deja templar.",s:1080},
      {t:"Prepara los toppings: aguacate y pepino en dados, edamame cocido."},
      {t:"Monta el bol: arroz, salmón y toppings por zonas; remata con sésamo."}]},
  { id:"wok", n:"Wok de verduras y pollo", cat:"cena", dif:1, min:25, rac:2,
    desc:"Salteado rápido a fuego fuerte con soja y jengibre.",
    e:"🥡", nut:{kcal:440,p:32,cb:45,g:14}, tags:["rápida","asiática","de aprovechamiento"],
    ing:[{id:"pollo_pechuga",q:"300 g",forma:"a la plancha"},{id:"noodles",q:"150 g"},{id:"brocoli",q:"1/2 ud",forma:"salteado"},{id:"zanahoria",q:"1 ud",forma:"cruda"},{id:"pimiento_rojo",q:"1/2 ud",forma:"crudo"},{id:"salsa_soja",q:"4 cdas"},{id:"jengibre",q:"1 trozo",forma:"fresco rallado"},{id:"ajo",q:"1 diente",forma:"dorado en aceite"},{id:"sesamo",q:"1 cda"},{id:"aceite_girasol",q:"2 cdas"}],
    pasos:[
      {t:"Cuece los noodles según el paquete, escurre y reserva.",s:240},
      {t:"Saltea el pollo en tiras a fuego muy fuerte y resérvalo.",s:240},
      {t:"Saltea las verduras en bastones con ajo y jengibre, que queden crujientes.",s:240},
      {t:"Devuelve el pollo, añade noodles y soja, y saltea todo junto 1 min.",s:60},
      {t:"Sirve con sésamo por encima."}]},
  { id:"revuelto", n:"Revuelto de setas y gambas", cat:"cena", dif:1, min:15, rac:2,
    desc:"Cremoso, rápido y de restaurante. El truco: fuego suave al final.",
    e:"🍳", nut:{kcal:320,p:26,cb:4,g:22}, tags:["sin gluten","baja en carbohidratos","rápida"],
    ing:[{id:"huevo",q:"4 uds",forma:"revuelto"},{id:"seta",q:"200 g"},{id:"gamba",q:"150 g",forma:"al ajillo"},{id:"ajo",q:"1 diente",forma:"dorado en aceite"},{id:"perejil",q:"1 cda"},{id:"aove",q:"2 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Saltea las setas a fuego fuerte hasta que doren.",s:240},
      {t:"Añade ajo picado y las gambas; cocina 2 min.",s:120},
      {t:"Baja el fuego, vierte los huevos batidos con sal y remueve sin parar."},
      {t:"Retira cuando aún esté cremoso (seguirá cuajando). Perejil y a comer."}]},
  { id:"pizza", n:"Pizza margarita casera", cat:"cena", dif:3, min:90, rac:2,
    desc:"Masa casera con fermentación corta, tomate, mozzarella y albahaca.",
    e:"🍕", nut:{kcal:650,p:26,cb:85,g:22}, tags:["vegetariana","italiana","plan con niños"],
    ing:[{id:"harina",q:"300 g"},{id:"levadura",q:"5 g (de panadería)"},{id:"tomate_triturado",q:"200 g"},{id:"mozzarella",q:"200 g"},{id:"albahaca",q:"unas hojas"},{id:"aove",q:"3 cdas"},{id:"sal",q:"6 g"},{id:"azucar",q:"1 pizca"}],
    pasos:[
      {t:"Amasa harina, 190 ml de agua tibia, levadura, sal y 1 cda de aceite hasta que quede lisa.",s:600},
      {t:"Deja fermentar tapada en sitio cálido hasta que doble.",s:3600},
      {t:"Precalienta el horno a máximo con la bandeja dentro."},
      {t:"Estira la masa fina, cúbrela con tomate salado y un hilo de aceite."},
      {t:"Hornea 8 min, añade la mozzarella y hornea 4-5 min más.",s:780},
      {t:"Termina con albahaca fresca y aceite en crudo."}]},
  { id:"bizcocho", n:"Bizcocho de yogur", cat:"postre", dif:1, min:55, rac:8,
    desc:"El 1-2-3 de toda la vida, midiendo con el vasito del yogur. Infalible.",
    e:"🍰", nut:{kcal:330,p:6,cb:45,g:14}, tags:["vegetariana","apta para niños","merienda"],
    ing:[{id:"yogur",q:"1 ud (y su vaso de medida)"},{id:"huevo",q:"3 uds"},{id:"azucar",q:"2 vasos"},{id:"harina",q:"3 vasos"},{id:"aceite_girasol",q:"1 vaso"},{id:"levadura",q:"1 sobre"},{id:"limon",q:"ralladura de 1"}],
    pasos:[
      {t:"Precalienta el horno a 180 °C. Bate huevos y azúcar hasta que espumen.",s:180},
      {t:"Añade yogur, aceite y ralladura; mezcla bien."},
      {t:"Incorpora harina y levadura tamizadas con movimientos envolventes."},
      {t:"Vierte en molde engrasado y hornea 35-40 min sin abrir el horno.",s:2220},
      {t:"Pincha con un palillo: si sale limpio, está. Enfría sobre rejilla."}]},
  { id:"arroz_leche", n:"Arroz con leche", cat:"postre", dif:2, min:45, rac:4,
    desc:"Cremoso, con canela y limón, removido con cariño.",
    e:"🍮", nut:{kcal:290,p:7,cb:52,g:6}, tags:["vegetariana","sin gluten","de la abuela"],
    ing:[{id:"arroz_redondo",q:"100 g"},{id:"leche",q:"1 l"},{id:"azucar",q:"90 g"},{id:"canela",q:"1 rama + para espolvorear"},{id:"limon",q:"piel de 1"}],
    pasos:[
      {t:"Infusiona la leche con la canela y la piel de limón hasta que hierva.",s:300},
      {t:"Añade el arroz y cuece a fuego muy suave removiendo a menudo.",s:2100},
      {t:"Cuando esté cremoso, agrega el azúcar y cocina 5 min más.",s:300},
      {t:"Retira canela y piel; reparte en cuencos."},
      {t:"Enfría y espolvorea canela molida antes de servir."}]},
  { id:"crepes", n:"Crepes dulces", cat:"postre", dif:2, min:30, rac:4,
    desc:"Finísimas y doradas: rellénalas de chocolate, mermelada o fruta.",
    e:"🥞", nut:{kcal:310,p:10,cb:40,g:12}, tags:["vegetariana","merienda","plan con niños"],
    ing:[{id:"harina",q:"125 g"},{id:"huevo",q:"2 uds"},{id:"leche",q:"300 ml"},{id:"mantequilla",q:"30 g"},{id:"azucar",q:"1 cda"},{id:"sal",q:"1 pizca"},{id:"chocolate_negro",q:"para rellenar"}],
    pasos:[
      {t:"Bate todos los ingredientes (mantequilla derretida) hasta masa fina sin grumos."},
      {t:"Deja reposar la masa en la nevera.",s:900},
      {t:"Calienta una sartén antiadherente engrasada; vierte un cacito y extiende girando."},
      {t:"Cocina 1 min, voltea y 30 s más. Repite con toda la masa.",s:90},
      {t:"Rellena al gusto: chocolate fundido, mermelada, fruta..."}]},
  { id:"sopa_fideos", n:"Sopa de fideos con pollo", cat:"cena", dif:1, min:30, rac:4,
    desc:"La sopa que cura: caldo, fideos y tropezones de pollo.",
    e:"🍜", nut:{kcal:220,p:16,cb:28,g:5}, tags:["ligera","reconfortante","apta para niños"],
    ing:[{id:"caldo_pollo",q:"1,2 l"},{id:"fideos",q:"120 g"},{id:"pollo_pechuga",q:"150 g",forma:"en guiso"},{id:"zanahoria",q:"1 ud",forma:"cocida en guiso"},{id:"apio",q:"1 rama",forma:"en caldo o guiso"},{id:"perejil",q:"1 cda"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Lleva el caldo a ebullición con la zanahoria y el apio en daditos.",s:600},
      {t:"Añade el pollo en tiras finas y cuece 5 min.",s:300},
      {t:"Incorpora los fideos y cuece el tiempo del paquete.",s:300},
      {t:"Rectifica de sal y sirve con perejil picado."}]},
  { id:"espinacas_garbanzos", n:"Espinacas con garbanzos", cat:"cena", dif:1, min:25, rac:2,
    desc:"Tapa sevillana convertida en cena: comino, pimentón y pan frito.",
    e:"🥘", nut:{kcal:340,p:14,cb:40,g:14}, tags:["vegana","de cuchara","clásico español"],
    ing:[{id:"espinacas",q:"400 g",forma:"salteadas"},{id:"garbanzos",q:"400 g (cocidos)",forma:"en guiso o cocido"},{id:"ajo",q:"2 dientes",forma:"dorado en aceite"},{id:"pan",q:"1 rebanada"},{id:"pimenton",q:"1 cdta"},{id:"comino",q:"1/2 cdta"},{id:"vinagre",q:"1 cda"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Fríe el pan y los ajos en el aceite y májalos con comino y vinagre.",s:240},
      {t:"Saltea las espinacas en la misma sartén hasta que reduzcan.",s:180},
      {t:"Añade garbanzos, el majado y el pimentón; mezcla bien."},
      {t:"Cocina 5 min con un chorrito de agua para que se integre todo.",s:300}]},
  { id:"berenjenas_rellenas", n:"Berenjenas rellenas de carne", cat:"comida", dif:2, min:55, rac:4,
    desc:"Barcas de berenjena con sofrito de carne y gratinado de queso.",
    e:"🍆", nut:{kcal:410,p:25,cb:18,g:27}, tags:["sin gluten","horno","apta para niños"],
    ing:[{id:"berenjena",q:"2 uds",forma:"rellena"},{id:"carne_picada",q:"300 g"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"tomate_frito",q:"150 g"},{id:"mozzarella",q:"100 g"},{id:"oregano",q:"1 cdta"},{id:"aove",q:"3 cdas"},{id:"sal",q:"al gusto"}],
    pasos:[
      {t:"Corta las berenjenas a lo largo, haz cortes en la carne y hornéalas a 200 °C.",s:1500},
      {t:"Vacíalas con cuidado y pica la pulpa. Reserva las barcas."},
      {t:"Sofríe la cebolla, añade la carne y dórala; agrega pulpa, tomate y orégano.",s:600},
      {t:"Rellena las barcas, cubre con mozzarella y gratina hasta dorar.",s:420}]},
  { id:"salteado_ternera", n:"Salteado de ternera con verduras", cat:"comida", dif:1, min:20, rac:2,
    desc:"Tiras de ternera al wok con soja: rápido, jugoso y con mucho fondo.",
    e:"🥩", nut:{kcal:420,p:34,cb:16,g:24}, tags:["rápida","alta en proteína","asiática"],
    ing:[{id:"ternera_filete",q:"300 g",forma:"en tiras salteado"},{id:"pimiento_rojo",q:"1 ud",forma:"crudo"},{id:"cebolla",q:"1 ud",forma:"pochada"},{id:"salsa_soja",q:"3 cdas"},{id:"ajo",q:"1 diente",forma:"dorado en aceite"},{id:"sesamo",q:"1 cdta"},{id:"aceite_girasol",q:"2 cdas"},{id:"pimienta",q:"al gusto"}],
    pasos:[
      {t:"Corta la ternera en tiras finas y séllala a fuego muy fuerte. Reserva.",s:180},
      {t:"Saltea cebolla y pimiento en tiras hasta que estén al dente.",s:240},
      {t:"Devuelve la carne, añade ajo y soja, y saltea 1 min más.",s:60},
      {t:"Sirve con sésamo y pimienta recién molida."}]},
];

/* ---------- Lógica pura (preferencias, matching, lista de la compra) ---------- */

const ING_MAP = Object.fromEntries(INGS.map(i => [i.id, i]));

// Estado de un ingrediente para el usuario: {like:boolean|undefined, formas:{[forma]:boolean}}
function ingStatus(pref) {
  if (!pref || pref.like === undefined) return "sin_valorar";
  const formas = pref.formas || {};
  const vals = Object.values(formas);
  if (pref.like) {
    if (vals.some(v => v === false)) return "con_matices";
    return "me_gusta";
  }
  if (vals.some(v => v === true)) return "con_matices";
  return "no_me_gusta";
}

// ¿Le encaja este ingrediente EN ESTA FORMA concreta?
function likesInForm(pref, forma) {
  if (!pref || pref.like === undefined) return null; // sin valorar
  const formas = pref.formas || {};
  if (forma && formas[forma] !== undefined) return formas[forma];
  return pref.like;
}

const BASICOS = new Set(["sal","aove","aceite_girasol","pimienta","azucar","harina","vinagre","levadura","agua"]);

function matchReceta(receta, prefs) {
  let gusta = 0, noGusta = 0, valorables = 0;
  const conflictos = [], aciertos = [];
  for (const it of receta.ing) {
    if (BASICOS.has(it.id)) continue;
    valorables++;
    const v = likesInForm(prefs[it.id], it.forma);
    if (v === true) { gusta++; aciertos.push(it.id); }
    else if (v === false) { noGusta++; conflictos.push(it.id); }
  }
  if (valorables === 0) return { score: null, conflictos, aciertos, valorables };
  const raw = (gusta - noGusta * 1.4) / valorables;
  let score = Math.max(0, Math.round(raw * 100));
  // Desbloqueo exponencial: a más ingredientes con "like", más se multiplica el score
  const totalLikeados = Object.values(prefs).filter(p => p && p.like === true).length;
  const exponentialBoost = Math.pow(1 + totalLikeados / 50, 0.8);
  score = Math.round(score * exponentialBoost);
  return { score: Math.max(0, score), conflictos, aciertos, valorables };
}

// Suma de cantidades: intenta agrupar "300 g" + "1 kg" etc.; si no puede, las lista.
function parseQty(q) {
  const m = /^([\d.,\/]+)\s*(g|kg|ml|l|ud|uds|cda|cdas|cdta|cdtas|vaso|vasos|lata|latas|rebanada|rebanadas|diente|dientes|lomo|lomos|hoja|hojas|rama|ramas|trozo|sobre|manojo|pizca|filete|filetes)?\b/i.exec((q||"").trim());
  if (!m) return null;
  let num = m[1].replace(",", ".");
  if (num.includes("/")) { const [a,b] = num.split("/"); num = parseFloat(a)/parseFloat(b); } else num = parseFloat(num);
  if (isNaN(num)) return null;
  let unit = (m[2]||"ud").toLowerCase();
  if (unit === "kg") { num *= 1000; unit = "g"; }
  if (unit === "l")  { num *= 1000; unit = "ml"; }
  if (unit === "uds") unit = "ud";
  if (unit === "cdas") unit = "cda"; if (unit === "cdtas") unit = "cdta";
  if (unit === "latas") unit = "lata"; if (unit === "rebanadas") unit = "rebanada";
  if (unit === "dientes") unit = "diente"; if (unit === "lomos") unit = "lomo";
  if (unit === "hojas") unit = "hoja"; if (unit === "vasos") unit = "vaso"; if (unit === "filetes") unit = "filete";
  return { num, unit };
}
function formatQty(num, unit) {
  if (unit === "g" && num >= 1000) return `${+(num/1000).toFixed(2)} kg`;
  if (unit === "ml" && num >= 1000) return `${+(num/1000).toFixed(2)} l`;
  const n = Number.isInteger(num) ? num : +num.toFixed(2);
  return `${n} ${unit}`;
}
// items: [{ingId, q, recetaId}] -> agrupado por categoría con cantidades sumadas
function agregarCompra(items) {
  const porIng = {};
  for (const it of items) {
    if (!porIng[it.ingId]) porIng[it.ingId] = { sums: {}, libres: [], recetas: new Set() };
    const e = porIng[it.ingId];
    e.recetas.add(it.recetaId);
    const p = parseQty(it.q);
    if (p) e.sums[p.unit] = (e.sums[p.unit] || 0) + p.num;
    else if (it.q) e.libres.push(it.q);
  }
  const out = [];
  for (const [ingId, e] of Object.entries(porIng)) {
    const partes = Object.entries(e.sums).map(([u, n]) => formatQty(n, u)).concat([...new Set(e.libres)]);
    out.push({ ingId, texto: partes.join(" + ") || "", recetas: [...e.recetas] });
  }
  out.sort((a, b) => {
    const ca = ING_MAP[a.ingId]?.c || "z", cb2 = ING_MAP[b.ingId]?.c || "z";
    return ca === cb2 ? (ING_MAP[a.ingId]?.n || "").localeCompare(ING_MAP[b.ingId]?.n || "") : ca.localeCompare(cb2);
  });
  return out;
}

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const COMIDAS_PLAN = [{ id: "comida", l: "Comida" }, { id: "cena", l: "Cena" }];

function calcLogros(st) {
  const nVal = Object.values(st.prefs).filter(p => p.like !== undefined).length;
  const nLike = Object.values(st.prefs).filter(p => p.like === true).length;
  const nMatiz = Object.values(st.prefs).filter(p => p.formas && Object.keys(p.formas).length > 0).length;
  const probadas = Object.keys(st.probadas).length;
  const dif3 = Object.keys(st.probadas).some(id => RECETAS.find(r => r.id === id)?.dif === 3);
  const slots = Object.keys(st.plan).length;
  return [
    { id:"cata10", n:"Primeras catas", d:"Valora 10 ingredientes", ok:nVal>=10, icon:"🍽️" },
    { id:"cata50", n:"Explorador de mercado", d:"Valora 50 ingredientes", ok:nVal>=50, icon:"🧭" },
    { id:"cata120", n:"Paladar enciclopédico", d:"Valora 120 ingredientes", ok:nVal>=120, icon:"📚" },
    { id:"abierto", n:"Paladar abierto", d:"Al menos 40 ingredientes que te gustan", ok:nLike>=40, icon:"🌈" },
    { id:"matiz", n:"Maestro del matiz", d:"Personaliza formas en 5 ingredientes", ok:nMatiz>=5, icon:"🎛️" },
    { id:"prueba1", n:"¡Estreno!", d:"Marca tu primera receta como probada", ok:probadas>=1, icon:"⭐" },
    { id:"prueba5", n:"Cocinillas", d:"Prueba 5 recetas", ok:probadas>=5, icon:"👩‍🍳" },
    { id:"prueba15", n:"Chef de cabecera", d:"Prueba 15 recetas", ok:probadas>=15, icon:"🏅" },
    { id:"valiente", n:"Sin miedo al fuego", d:"Prueba una receta elaborada", ok:dif3, icon:"🔥" },
    { id:"planif", n:"Semana resuelta", d:"Llena 8 huecos del planificador", ok:slots>=8, icon:"🗓️" },
  ];
}

/* ===================== UI ===================== */

const T = {
  bg: "#F5F3EE", card: "#FFFFFF", ink: "#241F2E", sub: "#716C7C", line: "#E9E5DD",
  brand: "#E8532C", brandSoft: "#FCEAE3", ok: "#1F9D63", bad: "#D8455B",
  radius: 20, shadow: "0 8px 24px rgba(36,31,46,0.08)",
};

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html, body, #root { height: 100%; margin: 0; }
body { background: ${T.bg}; }
.yt-app { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: ${T.ink}; }
.yt-display { font-family: 'Sora', 'Inter', system-ui, sans-serif; letter-spacing: -0.02em; }
.yt-scroll::-webkit-scrollbar { display: none; }
.yt-scroll { scrollbar-width: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; color: inherit; }
button:focus-visible, input:focus-visible { outline: 2px solid ${T.brand}; outline-offset: 2px; border-radius: 8px; }
input { font-family: inherit; }
@keyframes yt-pop { 0% { transform: scale(0.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
@keyframes yt-up { 0% { transform: translateY(24px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
@keyframes yt-fade { 0% { opacity: 0; } 100% { opacity: 1; } }
.yt-pop { animation: yt-pop .22s ease-out both; }
.yt-up { animation: yt-up .28s cubic-bezier(.2,.9,.3,1.2) both; }
.yt-fade { animation: yt-fade .2s ease-out both; }
@media (prefers-reduced-motion: reduce) { .yt-pop, .yt-up, .yt-fade { animation: none; } }
`;

/* Imagen de ingrediente: intenta foto real y, si no carga,
   muestra una ficha ilustrada con el color de su familia. */
function IngImg({ ing, size = 96, round = 24 }) {
  const [ext, setExt] = useState(0); // 0: slug tal cual, 1: extensión alternativa, 2: ficha
  const slug = ing.img || "";
  const alt = slug.endsWith(".png") ? slug.replace(/\.png$/, ".jpg") : slug.replace(/\.jpg$/, ".png");
  const src = ext === 0 ? slug : alt;
  const cat = CAT[ing.c];
  if (ext >= 2 || !slug) {
    return (
      <div aria-hidden style={{ width: size, height: size, borderRadius: round, flexShrink: 0,
        background: `linear-gradient(145deg, ${cat.soft}, #ffffff 90%)`,
        border: `1.5px solid ${cat.color}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: size * 0.72, height: size * 0.72, borderRadius: "50%", background: "#fff",
          boxShadow: `0 3px 10px ${cat.color}33, inset 0 0 0 2px ${cat.color}22`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.4 }}>
          {ing.e}
        </div>
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, borderRadius: round, flexShrink: 0, overflow: "hidden",
      background: `linear-gradient(145deg, ${cat.soft}, #fff)`, border: `1.5px solid ${cat.color}22`,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img src={`https://img.spoonacular.com/ingredients_250x250/${src}`} alt={ing.n}
        onError={() => setExt(e => e + 1)} loading="lazy"
        style={{ width: "82%", height: "82%", objectFit: "contain", mixBlendMode: "multiply" }} />
    </div>
  );
}

function Chip({ children, color = T.sub, bg = "#F1EEE8", style }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
    color, background: bg, borderRadius: 999, padding: "4px 10px", whiteSpace: "nowrap", ...style }}>{children}</span>;
}

function BtnPrimario({ children, onClick, style, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{
    background: disabled ? "#D8D4CC" : T.brand, color: "#fff", fontWeight: 700, fontSize: 15,
    borderRadius: 16, padding: "14px 20px", width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, boxShadow: disabled ? "none" : "0 6px 16px rgba(232,83,44,0.35)", ...style }}>{children}</button>;
}

/* ---------------- DESCUBRIR: la cata de mercado ---------------- */
function orderDeck(prefs) {
  const pendientes = INGS.filter(i => !prefs[i.id] || prefs[i.id].like === undefined);
  // Shuffle determinístico pero con verdadera aleatoriedad basado en Object.keys (orden de objetos)
  const seed = Object.keys(prefs).length % 1000;
  return pendientes.map((i, idx) => ({ i, k: ((idx + seed) * 2654435761) % 233280 }))
    .sort((a, b) => a.k - b.k).map(x => x.i);
}

function Descubrir({ st, setSt, onOpenFormas, onUnlock }) {
  const deck = useMemo(() => orderDeck(st.prefs), [st.prefs]);
  const total = INGS.length;
  const valorados = total - deck.length;
  const [drag, setDrag] = useState(null); // {x, y}
  const start = useRef(null);
  const ing = deck[0];

  const decidir = useCallback((like) => {
    if (!ing) return;
    const recetasAntes = RECETAS.filter(r => matchReceta(r, st.prefs).score !== null && matchReceta(r, st.prefs).score >= 40).length;
    const newPrefs = { ...st.prefs, [ing.id]: { like, formas: st.prefs[ing.id]?.formas || {} } };
    const recetasDespues = RECETAS.filter(r => matchReceta(r, newPrefs).score !== null && matchReceta(r, newPrefs).score >= 40).length;

    setSt(s => ({ ...s, prefs: newPrefs, historial: [...(s.historial || []), ing.id].slice(-30) }));
    setDrag(null);

    if (recetasDespues > recetasAntes && onUnlock) {
      onUnlock(`✨ Desbloqueadas ${recetasDespues - recetasAntes} nueva${recetasDespues - recetasAntes > 1 ? 's receta' : ' receta'}`);
    }
    if (ing.f && ing.f.length) onOpenFormas(ing, like);
  }, [ing, setSt, st.prefs, onOpenFormas, onUnlock]);

  const deshacer = () => setSt(s => {
    const h = [...(s.historial || [])];
    const last = h.pop();
    if (!last) return s;
    const prefs = { ...s.prefs };
    delete prefs[last];
    return { ...s, prefs, historial: h };
  });

  const onDown = (e) => { if (!ing) return; start.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const onMove = (e) => { if (!start.current) return; setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y }); };
  const onUp = () => {
    if (drag && Math.abs(drag.x) > 90) decidir(drag.x > 0);
    else setDrag(null);
    start.current = null;
  };

  const dx = drag?.x || 0;
  const cat = ing ? CAT[ing.c] : null;

  return (
    <div style={{ padding: "8px 20px 20px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <h1 className="yt-display" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Descubre sin prejuicios</h1>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.sub }}>{valorados}/{total} catados</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "#E9E5DD", marginBottom: 14 }}>
        <div style={{ height: 6, borderRadius: 3, width: `${(valorados / total) * 100}%`, background: T.brand, transition: "width .3s" }} />
      </div>

      {!ing ? (
        <div className="yt-pop" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 10 }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <h2 className="yt-display" style={{ margin: 0, fontSize: 22 }}>¡Mercado completo!</h2>
          <p style={{ color: T.sub, margin: 0, maxWidth: 260 }}>Has valorado los {total} ingredientes. Ajusta lo que quieras desde tu perfil.</p>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, position: "relative", minHeight: 340 }}>
            {deck[1] && (
              <div style={{ position: "absolute", inset: 0, transform: "scale(0.95) translateY(12px)", opacity: 0.5 }}>
                <CartaIngrediente ing={deck[1]} />
              </div>
            )}
            <div role="group" aria-label={`Ingrediente: ${ing.n}`}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              style={{ position: "absolute", inset: 0, touchAction: "none", cursor: "grab",
                transform: `translate(${dx}px, ${(drag?.y || 0) * 0.15}px) rotate(${dx / 22}deg)`,
                transition: drag ? "none" : "transform .25s ease" }}>
              <CartaIngrediente ing={ing} veredicto={dx > 40 ? "si" : dx < -40 ? "no" : null} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 22, paddingTop: 16 }}>
            <button aria-label="No me gusta" onClick={() => decidir(false)} style={{ width: 62, height: 62, borderRadius: "50%", background: "#fff", boxShadow: T.shadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={28} color={T.bad} strokeWidth={2.6} />
            </button>
            <button aria-label="Deshacer" onClick={deshacer} disabled={!(st.historial || []).length}
              style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", boxShadow: T.shadow, display: "flex", alignItems: "center", justifyContent: "center", opacity: (st.historial || []).length ? 1 : 0.35 }}>
              <RotateCcw size={20} color={T.sub} />
            </button>
            <button aria-label="Me gusta" onClick={() => decidir(true)} style={{ width: 62, height: 62, borderRadius: "50%", background: T.ok, boxShadow: "0 8px 20px rgba(31,157,99,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={28} color="#fff" strokeWidth={2.4} fill="#fff" />
            </button>
          </div>
          {cat && <p style={{ textAlign: "center", fontSize: 12.5, color: T.sub, margin: "12px 0 0" }}>
            Desliza a la derecha si te gusta · a la izquierda si no
          </p>}
        </>
      )}
    </div>
  );
}

function CartaIngrediente({ ing, veredicto }) {
  const cat = CAT[ing.c];
  return (
    <div style={{ height: "100%", background: T.card, borderRadius: 28, boxShadow: T.shadow, overflow: "hidden",
      display: "flex", flexDirection: "column", border: `1px solid ${T.line}`, position: "relative", userSelect: "none" }}>
      <div style={{ background: `linear-gradient(160deg, ${cat.soft} 0%, #ffffff 85%)`, flex: 1,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0 }}>
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <Chip color={cat.color} bg="#ffffffE6">{cat.label}</Chip>
        </div>
        {veredicto === "si" && <div className="yt-fade" style={{ position: "absolute", top: 18, right: 18, border: `3px solid ${T.ok}`, color: T.ok, fontWeight: 800, borderRadius: 12, padding: "4px 12px", transform: "rotate(8deg)", fontSize: 18, background: "#fff" }}>ME GUSTA</div>}
        {veredicto === "no" && <div className="yt-fade" style={{ position: "absolute", top: 18, right: 18, border: `3px solid ${T.bad}`, color: T.bad, fontWeight: 800, borderRadius: 12, padding: "4px 12px", transform: "rotate(-8deg)", fontSize: 18, background: "#fff" }}>PASO</div>}
        <IngImg ing={ing} size={190} round={36} />
      </div>
      <div style={{ padding: "16px 20px 18px" }}>
        <h2 className="yt-display" style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 800 }}>{ing.n}</h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <Chip><Flame size={13} /> {ing.kcal} kcal/100g</Chip>
          {ing.p >= 8 && <Chip color={T.ok} bg="#E4F5EC">Proteína {ing.p}g</Chip>}
          {ing.f && <Chip color={T.brand} bg={T.brandSoft}>✦ {ing.f.length} formas de tomarlo</Chip>}
        </div>
      </div>
    </div>
  );
}

/* Hoja de matices: en qué formas sí y en cuáles no */
function FormasSheet({ data, onClose, onSave }) {
  const { ing, like } = data;
  const [sel, setSel] = useState(() => Object.fromEntries(ing.f.map(f => [f, like])));
  const toggle = (f) => setSel(s => ({ ...s, [f]: !s[f] }));
  return (
    <Sheet onClose={onClose} title={like ? `¿De qué formas te gusta ${ing.n.toLowerCase()}?` : `¿Lo salvamos de alguna forma?`}>
      <p style={{ margin: "0 0 14px", color: T.sub, fontSize: 14 }}>
        {like ? "Desmarca las que no vayan contigo." : `Has dicho que ${ing.n.toLowerCase()} no te va… pero quizá sí de alguna manera concreta:`}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {ing.f.map(f => (
          <button key={f} onClick={() => toggle(f)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px",
            borderRadius: 14, background: sel[f] ? "#E4F5EC" : "#F6F3EE", border: `1.5px solid ${sel[f] ? T.ok : T.line}`,
            fontSize: 14.5, fontWeight: 600, color: sel[f] ? "#14603D" : T.sub, textAlign: "left" }}>
            <span>{f}</span>
            {sel[f] ? <Check size={18} color={T.ok} /> : <X size={18} color="#B7B2A9" />}
          </button>
        ))}
      </div>
      <BtnPrimario onClick={() => onSave(ing.id, sel)}>Guardar matices</BtnPrimario>
      <button onClick={onClose} style={{ width: "100%", padding: 14, color: T.sub, fontWeight: 600, fontSize: 14 }}>Omitir</button>
    </Sheet>
  );
}

function Sheet({ children, onClose, title }) {
  return (
    <div className="yt-fade" onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(20,16,28,0.45)", zIndex: 50, display: "flex", alignItems: "flex-end" }}>
      <div className="yt-up yt-scroll" onClick={e => e.stopPropagation()} role="dialog" aria-label={title}
        style={{ background: T.card, width: "100%", borderRadius: "26px 26px 0 0", padding: "10px 20px 24px", maxHeight: "85%", overflowY: "auto" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#DDD8CF", margin: "6px auto 14px" }} />
        {title && <h3 className="yt-display" style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 800 }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/* ---------------- RECETAS ---------------- */
function TileReceta({ r, size = 74 }) {
  return (
    <div aria-hidden style={{ width: size, height: size, borderRadius: 18, flexShrink: 0,
      background: "linear-gradient(150deg, #FCEAE3, #FFF6EE 70%)", border: "1.5px solid #F2D9CD",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: "50%", background: "#fff",
        boxShadow: "0 3px 10px rgba(232,83,44,0.22)", display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: size * 0.38 }}>{r.e}</div>
    </div>
  );
}

function badgeMatch(score) {
  if (score === null) return { txt: "Cata ingredientes para ver tu match", bg: "#F1EEE8", col: T.sub };
  if (score >= 80) return { txt: `${score}% contigo`, bg: "#E4F5EC", col: "#14603D" };
  if (score >= 50) return { txt: `${score}% contigo`, bg: "#FBF3DC", col: "#8A6A14" };
  return { txt: `${score}% contigo`, bg: "#FBE6EA", col: "#9C2B3D" };
}

function Recetas({ st, setSt, abrir, sorprender }) {
  const [q, setQ] = useState("");
  const [fDif, setFDif] = useState(0);       // 0 todas
  const [fTiempo, setFTiempo] = useState(0); // 0 todas, 20, 35
  const [fCat, setFCat] = useState("todas");
  const [soloFavs, setSoloFavs] = useState(false);

  const lista = useMemo(() => {
    let l = RECETAS.map(r => ({ r, m: matchReceta(r, st.prefs) }));
    if (q.trim()) { const t = q.trim().toLowerCase(); l = l.filter(({ r }) => r.n.toLowerCase().includes(t) || r.tags.some(x => x.includes(t))); }
    if (fDif) l = l.filter(({ r }) => r.dif === fDif);
    if (fTiempo) l = l.filter(({ r }) => r.min <= fTiempo);
    if (fCat !== "todas") l = l.filter(({ r }) => r.cat === fCat);
    if (soloFavs) l = l.filter(({ r }) => st.favs.includes(r.id));
    l.sort((a, b) => (b.m.score ?? -1) - (a.m.score ?? -1));
    return l;
  }, [q, fDif, fTiempo, fCat, soloFavs, st.prefs, st.favs]);

  const selChip = (act) => ({ background: act ? T.ink : "#fff", color: act ? "#fff" : T.sub, border: `1.5px solid ${act ? T.ink : T.line}`, borderRadius: 999, padding: "7px 13px", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" });

  return (
    <div style={{ padding: "8px 0 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 className="yt-display" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Recetas</h1>
        <button onClick={sorprender} style={{ display: "flex", alignItems: "center", gap: 6, background: T.brandSoft, color: T.brand, fontWeight: 700, fontSize: 13.5, borderRadius: 999, padding: "9px 14px" }}>
          <Dices size={16} /> Sorpréndeme
        </button>
      </div>

      <div style={{ padding: "12px 20px 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "10px 14px" }}>
          <Search size={17} color={T.sub} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Busca por nombre o etiqueta…"
            style={{ border: "none", outline: "none", flex: 1, fontSize: 14.5, background: "transparent", color: T.ink }} />
          {q && <button onClick={() => setQ("")} aria-label="Borrar búsqueda"><X size={16} color={T.sub} /></button>}
        </div>
      </div>

      <div className="yt-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 20px 10px" }}>
        <button style={selChip(soloFavs)} onClick={() => setSoloFavs(v => !v)}>♥ Favoritas</button>
        {[["todas","Todo"],["desayuno","Desayuno"],["comida","Comida"],["cena","Cena"],["postre","Postre"],["aperitivo","Aperitivo"]].map(([v,l]) =>
          <button key={v} style={selChip(fCat === v)} onClick={() => setFCat(v)}>{l}</button>)}
        {[1,2,3].map(d => <button key={d} style={selChip(fDif === d)} onClick={() => setFDif(x => x === d ? 0 : d)}>{DIF[d].l}</button>)}
        {[[20,"≤ 20 min"],[35,"≤ 35 min"]].map(([v,l]) =>
          <button key={v} style={selChip(fTiempo === v)} onClick={() => setFTiempo(x => x === v ? 0 : v)}>{l}</button>)}
      </div>

      <div className="yt-scroll" style={{ flex: 1, overflowY: "auto", padding: "2px 20px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        {lista.length === 0 && (
          <div style={{ textAlign: "center", color: T.sub, padding: "40px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🍽️</div>
            Ninguna receta encaja con esos filtros. Prueba a quitar alguno.
          </div>
        )}
        {lista.map(({ r, m }) => {
          const b = badgeMatch(m.score);
          const probada = st.probadas[r.id];
          return (
            <button key={r.id} onClick={() => abrir(r.id)} className="yt-fade" style={{ display: "flex", gap: 12, alignItems: "center", background: "#fff", borderRadius: T.radius, border: `1px solid ${T.line}`, padding: 12, textAlign: "left", boxShadow: "0 2px 8px rgba(36,31,46,0.04)" }}>
              <TileReceta r={r} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="yt-display" style={{ fontWeight: 700, fontSize: 15.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.n}</span>
                  {st.favs.includes(r.id) && <Heart size={14} color={T.bad} fill={T.bad} style={{ flexShrink: 0 }} />}
                  {probada && <Chip color="#14603D" bg="#E4F5EC" style={{ flexShrink: 0, padding: "2px 8px" }}><Check size={11} /> Probada</Chip>}
                </div>
                <div style={{ display: "flex", gap: 10, color: T.sub, fontSize: 12.5, margin: "4px 0 6px", fontWeight: 500 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {r.min} min</span>
                  <span style={{ color: DIF[r.dif].c, fontWeight: 700 }}>{DIF[r.dif].l}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Flame size={12} /> {r.nut.kcal} kcal/ración</span>
                </div>
                <Chip color={b.col} bg={b.bg} style={{ padding: "3px 9px", fontSize: 11.5 }}>{b.txt}</Chip>
                {m.conflictos.length > 0 && m.score !== null &&
                  <Chip color="#9C2B3D" bg="#FBE6EA" style={{ padding: "3px 9px", fontSize: 11.5, marginLeft: 4 }}>lleva {ING_MAP[m.conflictos[0]].n.toLowerCase()}{m.conflictos.length > 1 ? ` +${m.conflictos.length - 1}` : ""}</Chip>}
              </div>
              <ChevronRight size={18} color="#C9C4BB" style={{ flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- DETALLE DE RECETA ---------------- */
function RecetaDetalle({ recId, st, setSt, cerrar, cocinar, addCompra, addPlan }) {
  const r = RECETAS.find(x => x.id === recId);
  const m = matchReceta(r, st.prefs);
  const fav = st.favs.includes(r.id);
  const probada = st.probadas[r.id];
  const b = badgeMatch(m.score);
  const [porciones, setPorciones] = useState(r.rac || 4);
  const [usaThermomix, setUsaThermomix] = useState(false);
  const [usaAirfryer, setUsaAirfryer] = useState(false);

  const toggleFav = () => setSt(s => ({ ...s, favs: fav ? s.favs.filter(x => x !== r.id) : [...s.favs, r.id] }));
  const setRating = (n) => setSt(s => ({ ...s, probadas: { ...s.probadas, [r.id]: { fecha: Date.now(), rating: n } } }));
  const quitarProbada = () => setSt(s => { const p = { ...s.probadas }; delete p[r.id]; return { ...s, probadas: p }; });

  return (
    <div className="yt-fade" style={{ position: "absolute", inset: 0, background: T.bg, zIndex: 40, display: "flex", flexDirection: "column" }}>
      <div className="yt-scroll" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "linear-gradient(160deg, #FCEAE3, #FFF8F2 80%)", padding: "14px 20px 22px", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <button onClick={cerrar} aria-label="Volver" style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", boxShadow: T.shadow, display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={20} /></button>
            <button onClick={toggleFav} aria-label={fav ? "Quitar de favoritas" : "Guardar en favoritas"} style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", boxShadow: T.shadow, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Heart size={20} color={T.bad} fill={fav ? T.bad : "none"} />
            </button>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <TileReceta r={r} size={92} />
            <div>
              <h1 className="yt-display" style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, lineHeight: 1.15 }}>{r.n}</h1>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Chip color={b.col} bg={b.bg}>{b.txt}</Chip>
                {probada && <Chip color="#14603D" bg="#E4F5EC"><Check size={12} /> Probada</Chip>}
              </div>
            </div>
          </div>
          <p style={{ color: "#7A5C4E", margin: "12px 0 0", fontSize: 14 }}>{r.desc}</p>
        </div>

        <div style={{ padding: "16px 20px 130px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <Chip><Clock size={13} /> {r.min} min</Chip>
            <Chip color={DIF[r.dif].c} bg="#fff" style={{ border: `1.5px solid ${DIF[r.dif].c}44` }}>{DIF[r.dif].l}</Chip>
            {r.tags.includes("batch cooking") && <Chip color="#E8B93B" bg="#FFF9E6">❄️ Congelable</Chip>}
            {r.tags.map(t => <Chip key={t}>{t}</Chip>)}
          </div>

          <section>
            <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Porciones</h2>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 4].map(n => (
                <button key={n} onClick={() => setPorciones(n)}
                  style={{ flex: 1, padding: "12px 14px", borderRadius: 14, fontWeight: 700, fontSize: 14,
                    background: porciones === n ? T.brandSoft : "#fff", color: porciones === n ? T.brand : "#A29D93",
                    border: `1.5px solid ${porciones === n ? T.brand : T.line}` }}>
                  {n === 1 ? "1️⃣ Una" : n === 2 ? "2️⃣ Dos" : "4️⃣ Cuatro"}
                </button>
              ))}
            </div>
          </section>

          {(r.thermomix || r.airfryer) && (
            <section>
              <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Instrucciones</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={() => { setUsaThermomix(false); setUsaAirfryer(false); }}
                  style={{ flex: r.thermomix && r.airfryer ? "1" : "1", padding: "12px 14px", borderRadius: 14, fontWeight: 700, fontSize: 14,
                    background: (!usaThermomix && !usaAirfryer) ? T.brandSoft : "#fff",
                    color: (!usaThermomix && !usaAirfryer) ? T.brand : "#A29D93",
                    border: `1.5px solid ${(!usaThermomix && !usaAirfryer) ? T.brand : T.line}` }}>
                  🍳 Clásica
                </button>
                {r.thermomix && (
                  <button onClick={() => { setUsaThermomix(true); setUsaAirfryer(false); }}
                    style={{ flex: 1, padding: "12px 14px", borderRadius: 14, fontWeight: 700, fontSize: 14,
                      background: usaThermomix ? T.brandSoft : "#fff", color: usaThermomix ? T.brand : "#A29D93",
                      border: `1.5px solid ${usaThermomix ? T.brand : T.line}` }}>
                    ⚙️ Thermomix
                  </button>
                )}
                {r.airfryer && (
                  <button onClick={() => { setUsaAirfryer(true); setUsaThermomix(false); }}
                    style={{ flex: 1, padding: "12px 14px", borderRadius: 14, fontWeight: 700, fontSize: 14,
                      background: usaAirfryer ? T.brandSoft : "#fff", color: usaAirfryer ? T.brand : "#A29D93",
                      border: `1.5px solid ${usaAirfryer ? T.brand : T.line}` }}>
                    💨 Airfryer
                  </button>
                )}
              </div>
            </section>
          )}

          <section>
            <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Por ración</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {[["kcal", r.nut.kcal, "🔥"], ["proteína", r.nut.p + " g", "💪"], ["carbohid.", r.nut.cb + " g", "🌾"], ["grasas", r.nut.g + " g", "🥑"]].map(([l, v, ic]) => (
                <div key={l} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${T.line}`, padding: "10px 6px", textAlign: "center" }}>
                  <div style={{ fontSize: 15 }}>{ic}</div>
                  <div className="yt-display" style={{ fontWeight: 800, fontSize: 15 }}>{v}</div>
                  <div style={{ fontSize: 10.5, color: T.sub, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Ingredientes</h2>
            <div style={{ background: "#fff", borderRadius: T.radius, border: `1px solid ${T.line}`, overflow: "hidden" }}>
              {r.ing.map((it, i) => {
                const ing = ING_MAP[it.id];
                const v = BASICOS.has(it.id) ? undefined : likesInForm(st.prefs[it.id], it.forma);
                const st2 = ingStatus(st.prefs[it.id]);
                // Multiplicar cantidad según porciones (porciones / raciones originales)
                const factor = porciones / (r.rac || 4);
                const cantidadAjustada = (it.q || "").replace(/\d+(?:\.\d+)?/g, n => (parseFloat(n) * factor).toFixed(n.includes('.') ? 1 : 0));
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                    <IngImg ing={ing} size={40} round={12} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ing.n}</div>
                      <div style={{ fontSize: 12.5, color: T.sub }}>{cantidadAjustada}{it.forma ? ` · ${it.forma}` : ""}</div>
                    </div>
                    {v === true && st2 === "con_matices" && it.forma && <Chip color="#14603D" bg="#E4F5EC" style={{ fontSize: 11 }}>en esta forma, sí ✓</Chip>}
                    {v === true && !(st2 === "con_matices" && it.forma) && <span title="Te gusta" style={{ width: 10, height: 10, borderRadius: 5, background: T.ok, flexShrink: 0 }} />}
                    {v === false && <Chip color="#9C2B3D" bg="#FBE6EA" style={{ fontSize: 11 }}>no te va</Chip>}
                    {v === null && <span title="Sin valorar" style={{ width: 10, height: 10, borderRadius: 5, background: "#D8D4CC", flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Pasos</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(usaThermomix && r.thermomix ? r.thermomix : usaAirfryer && r.airfryer ? r.airfryer : r.pasos).map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10, background: "#fff", borderRadius: 16, border: `1px solid ${T.line}`, padding: "12px 14px" }}>
                  <div className="yt-display" style={{ fontWeight: 800, color: T.brand, minWidth: 22 }}>{i + 1}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                    {p.t}
                    {p.s && <Chip color={T.brand} bg={T.brandSoft} style={{ marginLeft: 6, fontSize: 11 }}><Timer size={11} /> {Math.round(p.s / 60) || 1} min</Chip>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>¿La has probado?</h2>
            <div style={{ background: "#fff", borderRadius: T.radius, border: `1px solid ${T.line}`, padding: 14, display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} aria-label={`${n} estrellas`} onClick={() => setRating(n)}>
                    <Star size={26} color="#E8B93B" fill={probada && probada.rating >= n ? "#E8B93B" : "none"} />
                  </button>
                ))}
              </div>
              {probada
                ? <button onClick={quitarProbada} style={{ fontSize: 12.5, color: T.sub, fontWeight: 600 }}>Quitar</button>
                : <span style={{ fontSize: 12.5, color: T.sub }}>Puntúa para marcarla</span>}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => addCompra(r)} style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 16, padding: "13px 10px", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <ShoppingBasket size={17} color={T.brand} /> A la compra
            </button>
            <button onClick={() => addPlan(r.id)} style={{ background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 16, padding: "13px 10px", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <CalendarDays size={17} color={T.brand} /> Al plan
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 18px", background: "linear-gradient(transparent, #F5F3EE 40%)" }}>
        <BtnPrimario onClick={() => cocinar(r.id)}><ChefHat size={19} /> Modo cocina</BtnPrimario>
      </div>
    </div>
  );
}

/* ---------------- MODO COCINA con temporizadores ---------------- */
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.35, 0.7].forEach(t0 => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = "sine";
      g.gain.setValueAtTime(0.001, ctx.currentTime + t0);
      g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t0 + 0.3);
      o.start(ctx.currentTime + t0); o.stop(ctx.currentTime + t0 + 0.32);
    });
  } catch (e) { /* sin audio */ }
}

function ModoCocina({ recId, cerrar, marcarProbada }) {
  const r = RECETAS.find(x => x.id === recId);
  const [paso, setPaso] = useState(0);
  const [resta, setResta] = useState(null);   // segundos restantes
  const [activo, setActivo] = useState(false);
  const fin = paso >= r.pasos.length;
  const p = r.pasos[Math.min(paso, r.pasos.length - 1)];

  useEffect(() => { setResta(r.pasos[paso]?.s ?? null); setActivo(false); }, [paso, r]);
  useEffect(() => {
    if (!activo || resta === null) return;
    if (resta <= 0) { setActivo(false); beep(); return; }
    const t = setTimeout(() => setResta(x => x - 1), 1000);
    return () => clearTimeout(t);
  }, [activo, resta]);

  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ position: "absolute", inset: 0, background: T.ink, color: "#fff", zIndex: 60, display: "flex", flexDirection: "column" }} className="yt-fade">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <button onClick={cerrar} aria-label="Salir del modo cocina" style={{ color: "#fff", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 14, opacity: 0.85 }}><X size={18} /> Salir</button>
        <span className="yt-display" style={{ fontWeight: 700, fontSize: 14, opacity: 0.85 }}>{r.n}</span>
      </div>
      <div style={{ display: "flex", gap: 4, padding: "0 20px 8px" }}>
        {r.pasos.map((_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < paso || fin ? T.brand : i === paso ? "#fff" : "#ffffff33" }} />)}
      </div>

      {fin ? (
        <div className="yt-pop" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center", gap: 12 }}>
          <div style={{ fontSize: 64 }}>🎉</div>
          <h2 className="yt-display" style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>¡Al plato!</h2>
          <p style={{ opacity: 0.75, margin: 0 }}>Has terminado {r.n.toLowerCase()}. ¿La marcamos como probada?</p>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} aria-label={`${n} estrellas`} onClick={() => { marcarProbada(r.id, n); cerrar(); }}>
                <Star size={34} color="#E8B93B" fill="none" />
              </button>
            ))}
          </div>
          <button onClick={cerrar} style={{ color: "#fff", opacity: 0.7, fontWeight: 600, marginTop: 8, fontSize: 14 }}>Ahora no</button>
        </div>
      ) : (
        <>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px", gap: 22 }}>
            <span className="yt-display" style={{ color: T.brand, fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>PASO {paso + 1} DE {r.pasos.length}</span>
            <p className="yt-display" style={{ fontSize: 23, lineHeight: 1.4, fontWeight: 600, margin: 0 }}>{p.t}</p>
            {p.s != null && (
              <div style={{ background: "#ffffff12", borderRadius: 22, padding: 18, display: "flex", alignItems: "center", gap: 16 }}>
                <div className="yt-display" style={{ fontSize: 42, fontWeight: 800, fontVariantNumeric: "tabular-nums", color: resta === 0 ? T.brand : "#fff" }}>
                  {mmss(Math.max(0, resta ?? p.s))}
                </div>
                <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                  <button aria-label={activo ? "Pausar" : "Iniciar temporizador"} onClick={() => setActivo(a => !a)}
                    style={{ width: 54, height: 54, borderRadius: "50%", background: T.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {activo ? <Pause size={22} color="#fff" /> : <Play size={22} color="#fff" style={{ marginLeft: 3 }} />}
                  </button>
                  <button aria-label="Reiniciar" onClick={() => { setResta(p.s); setActivo(false); }}
                    style={{ width: 54, height: 54, borderRadius: "50%", background: "#ffffff22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <RotateCcw size={20} color="#fff" />
                  </button>
                </div>
              </div>
            )}
            {resta === 0 && <p style={{ color: T.brand, fontWeight: 700, margin: 0 }}>⏰ ¡Tiempo! Pasa al siguiente paso.</p>}
          </div>
          <div style={{ display: "flex", gap: 10, padding: "16px 20px 24px" }}>
            <button onClick={() => setPaso(x => Math.max(0, x - 1))} disabled={paso === 0}
              style={{ flex: 1, padding: 15, borderRadius: 16, background: "#ffffff18", color: "#fff", fontWeight: 700, opacity: paso === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <ChevronLeft size={18} /> Anterior
            </button>
            <button onClick={() => setPaso(x => x + 1)}
              style={{ flex: 1.4, padding: 15, borderRadius: 16, background: T.brand, color: "#fff", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 6px 16px rgba(232,83,44,0.45)" }}>
              {paso === r.pasos.length - 1 ? "Terminar" : "Siguiente"} <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- PLAN SEMANAL ---------------- */
function Plan({ st, setSt, abrirReceta, addSemanaCompra }) {
  const [picker, setPicker] = useState(null); // {dia, comida}
  const [q, setQ] = useState("");

  const setSlot = (key, recId) => setSt(s => ({ ...s, plan: { ...s.plan, [key]: recId } }));
  const quitarSlot = (key) => setSt(s => { const p = { ...s.plan }; delete p[key]; return { ...s, plan: p }; });

  const candidatas = useMemo(() => {
    let l = RECETAS.map(r => ({ r, m: matchReceta(r, st.prefs) }));
    if (picker) {
      const pref = picker.comida === "cena" ? ["cena", "comida"] : ["comida", "cena"];
      l.sort((a, b) => (pref.indexOf(a.r.cat) === -1 ? 1 : 0) - (pref.indexOf(b.r.cat) === -1 ? 1 : 0) || (b.m.score ?? -1) - (a.m.score ?? -1));
    }
    if (q.trim()) { const t = q.trim().toLowerCase(); l = l.filter(({ r }) => r.n.toLowerCase().includes(t)); }
    return l;
  }, [picker, q, st.prefs]);

  const nSlots = Object.keys(st.plan).length;

  return (
    <div style={{ padding: "8px 20px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <h1 className="yt-display" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>Tu semana</h1>
        {nSlots > 0 && <button onClick={addSemanaCompra} style={{ display: "flex", alignItems: "center", gap: 6, background: T.brandSoft, color: T.brand, fontWeight: 700, fontSize: 13, borderRadius: 999, padding: "9px 13px" }}>
          <ShoppingBasket size={15} /> Semana a la compra
        </button>}
      </div>
      <p style={{ color: T.sub, fontSize: 13.5, margin: "0 0 12px" }}>Toca un hueco para elegir plato. {nSlots ? `${nSlots} de 14 planificados.` : ""}</p>

      <div className="yt-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, paddingBottom: 10 }}>
        {DIAS.map((d, di) => {
          const kcal = COMIDAS_PLAN.reduce((acc, c) => {
            const rec = RECETAS.find(r => r.id === st.plan[`${di}-${c.id}`]);
            return acc + (rec ? rec.nut.kcal : 0);
          }, 0);
          return (
            <div key={d} style={{ background: "#fff", borderRadius: T.radius, border: `1px solid ${T.line}`, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span className="yt-display" style={{ fontWeight: 800, fontSize: 15 }}>{d}</span>
                {kcal > 0 && <span style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{kcal} kcal planificadas</span>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {COMIDAS_PLAN.map(c => {
                  const key = `${di}-${c.id}`;
                  const rec = RECETAS.find(r => r.id === st.plan[key]);
                  return rec ? (
                    <div key={c.id} style={{ background: T.brandSoft, borderRadius: 14, padding: "9px 10px", position: "relative" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: T.brand, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.l}</div>
                      <button onClick={() => abrirReceta(rec.id)} style={{ fontWeight: 700, fontSize: 12.5, textAlign: "left", lineHeight: 1.25, marginTop: 2, color: T.ink }}>
                        {rec.e} {rec.n}
                      </button>
                      <button aria-label={`Quitar ${rec.n}`} onClick={() => quitarSlot(key)} style={{ position: "absolute", top: 6, right: 6 }}>
                        <X size={13} color="#B08575" />
                      </button>
                    </div>
                  ) : (
                    <button key={c.id} onClick={() => { setPicker({ dia: di, comida: c.id }); setQ(""); }}
                      style={{ border: `1.5px dashed ${T.line}`, borderRadius: 14, padding: "12px 10px", color: T.sub, fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#FBFAF7" }}>
                      <Plus size={14} /> {c.l}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {picker && (
        <Sheet onClose={() => setPicker(null)} title={`${COMIDAS_PLAN.find(c => c.id === picker.comida).l} del ${DIAS[picker.dia].toLowerCase()}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F6F3EE", borderRadius: 12, padding: "9px 12px", marginBottom: 10 }}>
            <Search size={16} color={T.sub} />
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar receta…" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {candidatas.slice(0, 30).map(({ r, m }) => {
              const b = badgeMatch(m.score);
              return (
                <button key={r.id} onClick={() => { setSlot(`${picker.dia}-${picker.comida}`, r.id); setPicker(null); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 6px", borderRadius: 12, textAlign: "left" }}>
                  <span style={{ fontSize: 22 }}>{r.e}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.n}</div>
                    <div style={{ fontSize: 12, color: T.sub }}>{r.min} min · {DIF[r.dif].l} · {r.nut.kcal} kcal</div>
                  </div>
                  {m.score !== null && <Chip color={b.col} bg={b.bg} style={{ fontSize: 11 }}>{m.score}%</Chip>}
                </button>
              );
            })}
          </div>
        </Sheet>
      )}
    </div>
  );
}

/* ---------------- LISTA DE LA COMPRA ---------------- */
function Compra({ st, setSt }) {
  const [nuevo, setNuevo] = useState("");
  const grupos = useMemo(() => agregarCompra(st.compra.items), [st.compra.items]);
  const porCat = useMemo(() => {
    const m = {};
    for (const g of grupos) { const c = ING_MAP[g.ingId]?.c || "condimento"; (m[c] = m[c] || []).push(g); }
    return m;
  }, [grupos]);

  const toggle = (k) => setSt(s => ({ ...s, compra: { ...s.compra, checked: { ...s.compra.checked, [k]: !s.compra.checked[k] } } }));
  const addExtra = () => {
    const t = nuevo.trim(); if (!t) return;
    setSt(s => ({ ...s, compra: { ...s.compra, extras: [...s.compra.extras, t] } }));
    setNuevo("");
  };
  const quitarExtra = (i) => setSt(s => ({ ...s, compra: { ...s.compra, extras: s.compra.extras.filter((_, x) => x !== i) } }));
  const vaciarComprados = () => setSt(s => {
    const checked = s.compra.checked;
    return { ...s, compra: {
      items: s.compra.items.filter(it => !checked["i:" + it.ingId]),
      extras: s.compra.extras.filter((e, i) => !checked["e:" + i + ":" + e]),
      checked: {},
    } };
  });
  const vaciarTodo = () => setSt(s => ({ ...s, compra: { items: [], extras: [], checked: {} } }));

  const total = grupos.length + st.compra.extras.length;
  const hechos = Object.values(st.compra.checked).filter(Boolean).length;

  return (
    <div style={{ padding: "8px 20px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="yt-display" style={{ fontSize: 26, fontWeight: 800, margin: 0 }}>La compra</h1>
        {total > 0 && <span style={{ fontSize: 13, fontWeight: 700, color: T.sub }}>{hechos}/{total} en el carro</span>}
      </div>
      <p style={{ color: T.sub, fontSize: 13.5, margin: "2px 0 12px" }}>Se genera sola desde tus recetas y tu plan semanal.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "10px 12px" }}>
          <Plus size={16} color={T.sub} />
          <input value={nuevo} onChange={e => setNuevo(e.target.value)} onKeyDown={e => e.key === "Enter" && addExtra()}
            placeholder="Añadir algo suelto (papel de cocina…)" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }} />
        </div>
        <button onClick={addExtra} style={{ background: T.ink, color: "#fff", borderRadius: 14, padding: "0 16px", fontWeight: 700, fontSize: 14 }}>Añadir</button>
      </div>

      <div className="yt-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 8 }}>
        {total === 0 && (
          <div style={{ textAlign: "center", color: T.sub, padding: "50px 24px" }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>🧺</div>
            La cesta está vacía. Abre una receta y toca «A la compra», o envía tu semana planificada desde el plan.
          </div>
        )}
        {Object.entries(porCat).map(([c, items]) => (
          <section key={c}>
            <h2 className="yt-display" style={{ fontSize: 13, fontWeight: 800, color: CAT[c].color, textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 6px" }}>{CAT[c].label}</h2>
            <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.line}`, overflow: "hidden" }}>
              {items.map((g, i) => {
                const k = "i:" + g.ingId, done = !!st.compra.checked[k], ing = ING_MAP[g.ingId];
                return (
                  <button key={g.ingId} onClick={() => toggle(k)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 13px", borderTop: i ? `1px solid ${T.line}` : "none", textAlign: "left" }}>
                    <span style={{ width: 22, height: 22, borderRadius: 8, border: `2px solid ${done ? T.ok : "#CFCABF"}`, background: done ? T.ok : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done && <Check size={14} color="#fff" strokeWidth={3} />}
                    </span>
                    <span style={{ fontSize: 20 }}>{ing.e}</span>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "#B7B2A9" : T.ink }}>{ing.n}</span>
                    <span style={{ fontSize: 12.5, color: T.sub, fontWeight: 600 }}>{g.texto}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        {st.compra.extras.length > 0 && (
          <section>
            <h2 className="yt-display" style={{ fontSize: 13, fontWeight: 800, color: T.sub, textTransform: "uppercase", letterSpacing: 0.6, margin: "0 0 6px" }}>Otros</h2>
            <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.line}`, overflow: "hidden" }}>
              {st.compra.extras.map((e, i) => {
                const k = "e:" + i + ":" + e, done = !!st.compra.checked[k];
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderTop: i ? `1px solid ${T.line}` : "none" }}>
                    <button onClick={() => toggle(k)} style={{ width: 22, height: 22, borderRadius: 8, border: `2px solid ${done ? T.ok : "#CFCABF"}`, background: done ? T.ok : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {done && <Check size={14} color="#fff" strokeWidth={3} />}
                    </button>
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 14, textDecoration: done ? "line-through" : "none", color: done ? "#B7B2A9" : T.ink }}>{e}</span>
                    <button aria-label={`Eliminar ${e}`} onClick={() => quitarExtra(i)}><Trash2 size={15} color="#C9C4BB" /></button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {total > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={vaciarComprados} style={{ flex: 1, background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 12, fontWeight: 700, fontSize: 13, color: T.sub }}>Quitar lo comprado</button>
            <button onClick={vaciarTodo} style={{ flex: 1, background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 12, fontWeight: 700, fontSize: 13, color: T.bad }}>Vaciar lista</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- PERFIL: estadísticas, gustos y logros ---------------- */
function Perfil({ st, setSt, editarIng }) {
  const [q, setQ] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const prefs = st.prefs;
  const nVal = Object.values(prefs).filter(p => p.like !== undefined).length;
  const nLike = Object.values(prefs).filter(p => p.like === true).length;
  const logros = calcLogros(st);
  const probadasArr = Object.entries(st.probadas);
  const mediaRating = probadasArr.length ? (probadasArr.reduce((a, [, v]) => a + (v.rating || 0), 0) / probadasArr.length).toFixed(1) : null;

  const valorados = INGS.filter(i => prefs[i.id] && prefs[i.id].like !== undefined)
    .filter(i => !q.trim() || i.n.toLowerCase().includes(q.trim().toLowerCase()));

  const kcalSemana = Object.values(st.plan).reduce((a, id) => a + (RECETAS.find(r => r.id === id)?.nut.kcal || 0), 0);

  return (
    <div className="yt-scroll" style={{ padding: "8px 20px 20px", height: "100%", overflowY: "auto" }}>
      <h1 className="yt-display" style={{ fontSize: 26, fontWeight: 800, margin: "0 0 12px" }}>Tu cocina</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
        {[
          [nVal, "ingredientes catados", "🧭"],
          [nLike, "te gustan", "💚"],
          [probadasArr.length, "recetas probadas" + (mediaRating ? ` · ${mediaRating}★` : ""), "🍽️"],
          [st.favs.length, "favoritas guardadas", "❤️"],
        ].map(([v, l, ic], i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.line}`, padding: "14px 14px" }}>
            <div style={{ fontSize: 18 }}>{ic}</div>
            <div className="yt-display" style={{ fontSize: 24, fontWeight: 800, margin: "2px 0" }}>{v}</div>
            <div style={{ fontSize: 12, color: T.sub, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>

      {kcalSemana > 0 && (
        <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.line}`, padding: 14, marginBottom: 18, display: "flex", alignItems: "center", gap: 10 }}>
          <Soup size={20} color={T.brand} />
          <div style={{ fontSize: 13.5 }}><b>{kcalSemana} kcal</b> planificadas esta semana <span style={{ color: T.sub }}>(por ración, según tu plan)</span></div>
        </div>
      )}

      <section style={{ marginBottom: 18 }}>
        <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Logros</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {logros.map(l => (
            <div key={l.id} style={{ background: l.ok ? "#fff" : "#F1EEE8", borderRadius: 16, border: `1.5px solid ${l.ok ? "#EED9B8" : T.line}`, padding: "11px 12px", opacity: l.ok ? 1 : 0.65 }}>
              <div style={{ fontSize: 20, filter: l.ok ? "none" : "grayscale(1)" }}>{l.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 13, margin: "3px 0 1px" }}>{l.n}</div>
              <div style={{ fontSize: 11.5, color: T.sub }}>{l.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 className="yt-display" style={{ fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>Tus gustos</h2>
        {nVal === 0 ? (
          <p style={{ color: T.sub, fontSize: 13.5, background: "#fff", borderRadius: 16, border: `1px solid ${T.line}`, padding: 14 }}>
            Aún no has catado nada. Pásate por la pestaña Descubrir y desliza unas cuantas cartas.
          </p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: "9px 12px", marginBottom: 8 }}>
              <Search size={16} color={T.sub} />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar en lo catado…" style={{ border: "none", outline: "none", flex: 1, fontSize: 14, background: "transparent" }} />
            </div>
            <div style={{ background: "#fff", borderRadius: 18, border: `1px solid ${T.line}`, overflow: "hidden", maxHeight: 320, overflowY: "auto" }} className="yt-scroll">
              {valorados.map((i, idx) => {
                const s = ingStatus(prefs[i.id]);
                const lbl = { me_gusta: ["Te gusta", "#14603D", "#E4F5EC"], no_me_gusta: ["No te va", "#9C2B3D", "#FBE6EA"], con_matices: ["Con matices", "#8A6A14", "#FBF3DC"] }[s];
                return (
                  <button key={i.id} onClick={() => editarIng(i)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px", borderTop: idx ? `1px solid ${T.line}` : "none", textAlign: "left" }}>
                    <IngImg ing={i} size={36} round={11} />
                    <span style={{ flex: 1, fontWeight: 600, fontSize: 13.5 }}>{i.n}</span>
                    <Chip color={lbl[1]} bg={lbl[2]} style={{ fontSize: 11 }}>{lbl[0]}</Chip>
                  </button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: T.sub, margin: "6px 2px 0" }}>Toca cualquiera para cambiar de opinión o afinar matices.</p>
          </>
        )}
      </section>

      <section style={{ paddingBottom: 20 }}>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{ width: "100%", background: "#fff", border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 13, fontWeight: 700, fontSize: 13.5, color: T.bad }}>
            Empezar de cero
          </button>
        ) : (
          <div style={{ background: "#FBE6EA", borderRadius: 16, padding: 14 }}>
            <p style={{ margin: "0 0 10px", fontSize: 13.5, fontWeight: 600, color: "#9C2B3D" }}>Se borrarán gustos, plan, compra, favoritas y probadas. ¿Seguro?</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setSt(estadoInicial()); setConfirmReset(false); }} style={{ flex: 1, background: T.bad, color: "#fff", borderRadius: 12, padding: 11, fontWeight: 700, fontSize: 13.5 }}>Sí, borrar todo</button>
              <button onClick={() => setConfirmReset(false)} style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 11, fontWeight: 700, fontSize: 13.5 }}>Cancelar</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------- APP ---------------- */
function estadoInicial() {
  return { prefs: {}, favs: [], probadas: {}, plan: {}, compra: { items: [], checked: {}, extras: [] }, historial: [] };
}

const TABS = [
  { id: "descubrir", l: "Descubrir", I: Compass },
  { id: "recetas", l: "Recetas", I: ChefHat },
  { id: "plan", l: "Plan", I: CalendarDays },
  { id: "compra", l: "Compra", I: ShoppingBasket },
  { id: "perfil", l: "Perfil", I: Award },
];

export default function App() {
  const [st, setSt] = useState(estadoInicial);
  const [cargado, setCargado] = useState(false);
  const [tab, setTab] = useState("descubrir");
  const [detalle, setDetalle] = useState(null);     // id de receta abierta
  const [cocina, setCocina] = useState(null);       // id de receta en modo cocina
  const [formas, setFormas] = useState(null);       // {ing, like}
  const [planPicker, setPlanPicker] = useState(null); // id receta a colocar en plan
  const [toast, setToast] = useState(null);

  // Cargar estado guardado
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("eatyblinders:v1");
        if (r?.value) {
          const s = JSON.parse(r.value);
          setSt({ ...estadoInicial(), ...s, compra: { ...estadoInicial().compra, ...(s.compra || {}) } });
        }
      } catch (e) { /* primera visita */ }
      setCargado(true);
    })();
  }, []);

  // Guardar con debounce
  useEffect(() => {
    if (!cargado) return;
    const t = setTimeout(() => { window.storage.set("eatyblinders:v1", JSON.stringify(st)).catch(() => {}); }, 600);
    return () => clearTimeout(t);
  }, [st, cargado]);

  const avisar = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const guardarFormas = (ingId, sel) => {
    setSt(s => ({ ...s, prefs: { ...s.prefs, [ingId]: { ...s.prefs[ingId], formas: sel } } }));
    setFormas(null);
  };

  const addCompra = (r) => {
    setSt(s => ({ ...s, compra: { ...s.compra, items: [...s.compra.items, ...r.ing.filter(it => !BASICOS.has(it.id)).map(it => ({ ingId: it.id, q: it.q, recetaId: r.id }))] } }));
    avisar(`«${r.n}» añadida a la compra 🧺`);
  };

  const addSemanaCompra = () => {
    const ids = Object.values(st.plan);
    if (!ids.length) return;
    setSt(s => {
      const items = [...s.compra.items];
      for (const id of Object.values(s.plan)) {
        const r = RECETAS.find(x => x.id === id);
        if (r) items.push(...r.ing.filter(it => !BASICOS.has(it.id)).map(it => ({ ingId: it.id, q: it.q, recetaId: r.id })));
      }
      return { ...s, compra: { ...s.compra, items } };
    });
    avisar(`${ids.length} platos de tu semana enviados a la compra 🧺`);
  };

  const marcarProbada = (recId, rating) => {
    setSt(s => ({ ...s, probadas: { ...s.probadas, [recId]: { fecha: Date.now(), rating } } }));
    avisar("¡Apuntada como probada! ⭐");
  };

  const sorprender = () => {
    const cands = RECETAS.map(r => ({ r, m: matchReceta(r, st.prefs) }))
      .filter(({ r, m }) => !st.probadas[r.id] && (m.score === null || m.score >= 40));
    const pool = cands.length ? cands : RECETAS.map(r => ({ r, m: matchReceta(r, st.prefs) }));
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setDetalle(pick.r.id);
  };

  const colocarEnPlan = (dia, comida) => {
    setSt(s => ({ ...s, plan: { ...s.plan, [`${dia}-${comida}`]: planPicker } }));
    const r = RECETAS.find(x => x.id === planPicker);
    setPlanPicker(null);
    avisar(`«${r.n}» al ${COMIDAS_PLAN.find(c => c.id === comida).l.toLowerCase()} del ${DIAS[dia].toLowerCase()} 🗓️`);
  };

  if (!cargado) {
    return (
      <div className="yt-app" style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.bg }}>
        <style>{GLOBAL_CSS}</style>
        <div className="yt-pop" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 44 }}>🍳</div>
          <div className="yt-display" style={{ fontWeight: 800, fontSize: 20, marginTop: 6 }}>EatyBlinders</div>
        </div>
      </div>
    );
  }

  return (
    <div className="yt-app" style={{ height: "100vh", background: T.bg, display: "flex", justifyContent: "center" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: "100%", maxWidth: 430, height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        <header style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px 6px" }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: T.brand, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(232,83,44,0.35)" }}>
            <Utensils size={17} color="#fff" />
          </div>
          <span className="yt-display" style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.3 }}>EatyBlinders</span>
        </header>

        <main style={{ flex: 1, minHeight: 0, position: "relative" }}>
          {tab === "descubrir" && <Descubrir st={st} setSt={setSt} onOpenFormas={(ing, like) => setFormas({ ing, like })} onUnlock={avisar} />}
          {tab === "recetas" && <Recetas st={st} setSt={setSt} abrir={setDetalle} sorprender={sorprender} />}
          {tab === "plan" && <Plan st={st} setSt={setSt} abrirReceta={setDetalle} addSemanaCompra={addSemanaCompra} />}
          {tab === "compra" && <Compra st={st} setSt={setSt} />}
          {tab === "perfil" && <Perfil st={st} setSt={setSt} editarIng={(ing) => setFormas({ ing: ing.f ? ing : { ...ing, f: ["tal cual"] }, like: st.prefs[ing.id]?.like ?? true, editar: true })} />}
        </main>

        <nav style={{ display: "flex", background: "#fff", borderTop: `1px solid ${T.line}`, padding: "8px 8px calc(10px + env(safe-area-inset-bottom))" }}>
          {TABS.map(({ id, l, I }) => {
            const act = tab === id;
            return (
              <button key={id} onClick={() => { setTab(id); setDetalle(null); }} aria-label={l}
                style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "5px 0", color: act ? T.brand : "#A29D93" }}>
                <I size={21} strokeWidth={act ? 2.4 : 2} />
                <span style={{ fontSize: 10.5, fontWeight: act ? 800 : 600 }}>{l}</span>
              </button>
            );
          })}
        </nav>

        {detalle && !cocina && (
          <RecetaDetalle recId={detalle} st={st} setSt={setSt} cerrar={() => setDetalle(null)}
            cocinar={setCocina} addCompra={addCompra} addPlan={setPlanPicker} />
        )}
        {cocina && <ModoCocina recId={cocina} cerrar={() => setCocina(null)} marcarProbada={marcarProbada} />}
        {formas && !formas.editar && <FormasSheet data={formas} onClose={() => setFormas(null)} onSave={guardarFormas} />}
        {formas && formas.editar && (
          <EditarGusto data={formas} st={st} onClose={() => setFormas(null)}
            onSave={(ingId, like, sel) => { setSt(s => ({ ...s, prefs: { ...s.prefs, [ingId]: { like, formas: sel } } })); setFormas(null); }} />
        )}
        {planPicker && (
          <Sheet onClose={() => setPlanPicker(null)} title="¿Para cuándo lo planificamos?">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {DIAS.map((d, di) => (
                <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="yt-display" style={{ width: 44, fontWeight: 800, fontSize: 14 }}>{d}</span>
                  {COMIDAS_PLAN.map(c => {
                    const ocupado = st.plan[`${di}-${c.id}`];
                    return (
                      <button key={c.id} onClick={() => colocarEnPlan(di, c.id)}
                        style={{ flex: 1, padding: "10px 8px", borderRadius: 12, fontSize: 13, fontWeight: 700,
                          background: ocupado ? "#F1EEE8" : T.brandSoft, color: ocupado ? T.sub : T.brand,
                          border: `1.5px solid ${ocupado ? T.line : "#F5C9B8"}` }}>
                        {c.l}{ocupado ? " ·↺" : ""}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 12, color: T.sub, margin: "10px 2px 0" }}>Los huecos con ↺ ya tienen plato: si los eliges, se sustituye.</p>
          </Sheet>
        )}

        {toast && (
          <div className="yt-up" role="status" style={{ position: "absolute", bottom: 86, left: 20, right: 20, background: T.ink, color: "#fff", borderRadius: 14, padding: "12px 16px", fontSize: 13.5, fontWeight: 600, textAlign: "center", boxShadow: "0 10px 26px rgba(0,0,0,0.3)", zIndex: 80 }}>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

/* Editor de un gusto ya catado (desde Perfil) */
function EditarGusto({ data, st, onClose, onSave }) {
  const { ing } = data;
  const pref = st.prefs[ing.id] || {};
  const [like, setLike] = useState(pref.like ?? true);
  const tieneFormas = ing.f && ing.f[0] !== "tal cual";
  const [sel, setSel] = useState(() => {
    const base = {};
    if (tieneFormas) for (const f of ing.f) base[f] = pref.formas?.[f] ?? (pref.like ?? true);
    return base;
  });
  useEffect(() => { if (tieneFormas) setSel(s => Object.fromEntries(Object.keys(s).map(f => [f, pref.formas?.[f] ?? like]))); }, [like]); // eslint-disable-line
  return (
    <Sheet onClose={onClose} title={ing.n}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => setLike(true)} style={{ flex: 1, padding: 13, borderRadius: 14, fontWeight: 800, fontSize: 14, background: like ? "#E4F5EC" : "#F6F3EE", color: like ? "#14603D" : T.sub, border: `1.5px solid ${like ? T.ok : T.line}` }}>💚 Me gusta</button>
        <button onClick={() => setLike(false)} style={{ flex: 1, padding: 13, borderRadius: 14, fontWeight: 800, fontSize: 14, background: !like ? "#FBE6EA" : "#F6F3EE", color: !like ? "#9C2B3D" : T.sub, border: `1.5px solid ${!like ? T.bad : T.line}` }}>✋ No me va</button>
      </div>
      {tieneFormas && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {ing.f.map(f => (
            <button key={f} onClick={() => setSel(s => ({ ...s, [f]: !s[f] }))} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderRadius: 14, background: sel[f] ? "#E4F5EC" : "#F6F3EE", border: `1.5px solid ${sel[f] ? T.ok : T.line}`, fontSize: 14, fontWeight: 600, color: sel[f] ? "#14603D" : T.sub, textAlign: "left" }}>
              <span>{f}</span>{sel[f] ? <Check size={17} color={T.ok} /> : <X size={17} color="#B7B2A9" />}
            </button>
          ))}
        </div>
      )}
      <BtnPrimario onClick={() => onSave(ing.id, like, tieneFormas ? sel : {})}>Guardar</BtnPrimario>
    </Sheet>
  );
}
