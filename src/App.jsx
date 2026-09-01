import { useState, useEffect, useCallback, useRef } from "react";

const uid = () => Math.random().toString(36).slice(2, 10);
const money = (n) => `$${(Number(n) || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);

const MENU_NORO = [
  { nombre: "Ceviche de jurel", precio: 220, categoria: "Entradas" },
  { nombre: "Ceviche estilo Sinaloa", precio: 260, categoria: "Entradas" },
  { nombre: "Aguachile tatemado o verde", precio: 225, categoria: "Entradas" },
  { nombre: "Tostada de atún con jocoque", precio: 170, categoria: "Entradas" },
  { nombre: "Ensalada de atún y aderezo de miso", precio: 230, categoria: "Entradas" },
  { nombre: "Ensalada de tomate", precio: 180, categoria: "Entradas" },
  { nombre: "Jocoque con ostiones ahumados y mejillones", precio: 185, categoria: "Entradas" },
  { nombre: "Papas rotizadas", precio: 165, categoria: "Entradas" },
  { nombre: "Taco pulpo pork belly", precio: 170, categoria: "Entradas" },
  { nombre: "Requesón con vegetales", precio: 175, categoria: "Entradas" },
  { nombre: "Costillas chinas", precio: 270, categoria: "Entradas" },
  { nombre: "Tenders al chiltepin", precio: 235, categoria: "Entradas" },
  { nombre: "Hamburguesa", precio: 275, categoria: "Fuertes" },
  { nombre: "Pasta roja y requesón", precio: 250, categoria: "Fuertes" },
  { nombre: "Arroz de la abuela con cabeza", precio: 310, categoria: "Fuertes" },
  { nombre: "New York", precio: 600, categoria: "Fuertes" },
  { nombre: "Diezmillo con puré", precio: 400, categoria: "Fuertes" },
  { nombre: "Pescado en miso de tomate y chiltepin", precio: 230, categoria: "Fuertes" },
  { nombre: "Pollo con vegetales", precio: 300, categoria: "Fuertes" },
  { nombre: "Mejillones menonita", precio: 320, categoria: "Fuertes" },
  { nombre: "Flan de vainilla", precio: 110, categoria: "Postres" },
  { nombre: "Cheese cake", precio: 130, categoria: "Postres" },
  { nombre: "Sticky toffee cake", precio: 140, categoria: "Postres" },
].map((p) => ({ ...p, id: uid(), receta: [] }));

// Inventario ligado 1 a 1 con cada platillo del menú (por porción).
// Arranca con 20 porciones y mínimo 5 — ajustable desde la pestaña Inventario.
const INVENTARIO_MENU = MENU_NORO.map((p) => ({
  id: uid(),
  platilloId: p.id,
  nombre: p.nombre,
  unidad: "porciones",
  stock: 10,
  minimo: 5,
  costoUnit: 0,
}));

// Catálogo base de insumos (precio en $0 como referencia — se edita por producto).
// Diseñado para crecer: se puede agregar cualquier cantidad de productos desde la pestaña Ingredientes.
const INGREDIENTES_BASE = [
  // Verduras y hongos
  ["Cebolla morada", "kg", "Verduras y hongos"], ["Cebolla blanca", "kg", "Verduras y hongos"], ["Cebolla cambray", "kg", "Verduras y hongos"],
  ["Tomate saladet", "kg", "Verduras y hongos"], ["Tomate bola", "kg", "Verduras y hongos"], ["Tomate verde (tomatillo)", "kg", "Verduras y hongos"],
  ["Jitomate cherry", "kg", "Verduras y hongos"], ["Pepino", "kg", "Verduras y hongos"], ["Zanahoria", "kg", "Verduras y hongos"],
  ["Papa", "kg", "Verduras y hongos"], ["Papa cambray", "kg", "Verduras y hongos"], ["Camote", "kg", "Verduras y hongos"],
  ["Elote", "pza", "Verduras y hongos"], ["Elote baby", "kg", "Verduras y hongos"], ["Calabacita italiana", "kg", "Verduras y hongos"],
  ["Calabaza de Castilla", "kg", "Verduras y hongos"], ["Champiñón", "kg", "Verduras y hongos"], ["Champiñón portobello", "kg", "Verduras y hongos"],
  ["Seta", "kg", "Verduras y hongos"], ["Huitlacoche", "kg", "Verduras y hongos"], ["Espárrago", "kg", "Verduras y hongos"],
  ["Betabel", "kg", "Verduras y hongos"], ["Lechuga romana", "pza", "Verduras y hongos"], ["Lechuga italiana", "pza", "Verduras y hongos"],
  ["Lechuga orejona", "pza", "Verduras y hongos"], ["Col morada", "kg", "Verduras y hongos"], ["Col blanca", "kg", "Verduras y hongos"],
  ["Apio", "kg", "Verduras y hongos"], ["Rábano", "kg", "Verduras y hongos"], ["Rábano negro", "kg", "Verduras y hongos"],
  ["Pimiento morrón rojo", "kg", "Verduras y hongos"], ["Pimiento morrón verde", "kg", "Verduras y hongos"], ["Pimiento morrón amarillo", "kg", "Verduras y hongos"],
  ["Ajo", "kg", "Verduras y hongos"], ["Jengibre", "kg", "Verduras y hongos"], ["Nopal", "kg", "Verduras y hongos"],
  ["Chayote", "kg", "Verduras y hongos"], ["Jícama", "kg", "Verduras y hongos"], ["Flor de calabaza", "kg", "Verduras y hongos"],
  ["Quelites", "kg", "Verduras y hongos"], ["Verdolagas", "kg", "Verduras y hongos"], ["Romeritos", "kg", "Verduras y hongos"],
  ["Papaloquelite", "kg", "Verduras y hongos"], ["Ejote", "kg", "Verduras y hongos"], ["Chícharo", "kg", "Verduras y hongos"],
  ["Haba", "kg", "Verduras y hongos"], ["Berenjena", "kg", "Verduras y hongos"], ["Poro", "kg", "Verduras y hongos"],
  ["Nabo", "kg", "Verduras y hongos"], ["Coliflor", "kg", "Verduras y hongos"], ["Brócoli", "kg", "Verduras y hongos"],
  ["Espinaca", "kg", "Verduras y hongos"], ["Acelga", "kg", "Verduras y hongos"], ["Cebollín", "kg", "Verduras y hongos"],
  // Chiles frescos
  ["Chile serrano", "kg", "Chiles frescos"], ["Chile jalapeño", "kg", "Chiles frescos"], ["Chile habanero", "kg", "Chiles frescos"],
  ["Chile poblano", "kg", "Chiles frescos"], ["Chile güero", "kg", "Chiles frescos"], ["Chile manzano", "kg", "Chiles frescos"],
  ["Chile de agua", "kg", "Chiles frescos"], ["Chile chilaca", "kg", "Chiles frescos"],
  // Chiles secos
  ["Chile ancho", "kg", "Chiles secos"], ["Chile mulato", "kg", "Chiles secos"], ["Chile pasilla", "kg", "Chiles secos"],
  ["Chile guajillo", "kg", "Chiles secos"], ["Chile cascabel", "kg", "Chiles secos"], ["Chile morita", "kg", "Chiles secos"],
  ["Chile chipotle", "kg", "Chiles secos"], ["Chile de árbol", "kg", "Chiles secos"], ["Chile piquín", "kg", "Chiles secos"],
  ["Chiltepin seco", "kg", "Chiles secos"], ["Chile mora", "kg", "Chiles secos"], ["Chile meco", "kg", "Chiles secos"],
  ["Chile puya", "kg", "Chiles secos"], ["Chile costeño", "kg", "Chiles secos"], ["Chile cora", "kg", "Chiles secos"],
  // Frutas
  ["Limón", "kg", "Frutas"], ["Limón real", "kg", "Frutas"], ["Naranja", "kg", "Frutas"], ["Mandarina", "kg", "Frutas"],
  ["Mango Ataulfo", "kg", "Frutas"], ["Mango Manila", "kg", "Frutas"], ["Mango Kent", "kg", "Frutas"], ["Piña", "kg", "Frutas"],
  ["Aguacate Hass", "kg", "Frutas"], ["Aguacate criollo", "kg", "Frutas"], ["Fresa", "kg", "Frutas"], ["Plátano", "kg", "Frutas"],
  ["Plátano macho", "kg", "Frutas"], ["Manzana", "kg", "Frutas"], ["Coco", "pza", "Frutas"], ["Toronja", "kg", "Frutas"],
  ["Guayaba", "kg", "Frutas"], ["Papaya", "kg", "Frutas"], ["Sandía", "kg", "Frutas"], ["Melón", "kg", "Frutas"],
  ["Uva", "kg", "Frutas"], ["Durazno", "kg", "Frutas"], ["Ciruela", "kg", "Frutas"], ["Tuna", "kg", "Frutas"],
  ["Xoconostle", "kg", "Frutas"], ["Zapote negro", "kg", "Frutas"], ["Mamey", "kg", "Frutas"], ["Guanábana", "kg", "Frutas"],
  ["Tamarindo", "kg", "Frutas"], ["Capulín", "kg", "Frutas"], ["Pitahaya", "kg", "Frutas"], ["Maracuyá", "kg", "Frutas"],
  ["Carambola", "kg", "Frutas"], ["Chicozapote", "kg", "Frutas"], ["Lima", "kg", "Frutas"], ["Tejocote", "kg", "Frutas"],
  ["Membrillo", "kg", "Frutas"], ["Higo", "kg", "Frutas"], ["Granada roja", "kg", "Frutas"],
  // Hierbas y especias
  ["Cilantro", "kg", "Hierbas y especias"], ["Perejil", "kg", "Hierbas y especias"], ["Epazote", "kg", "Hierbas y especias"],
  ["Hoja santa", "kg", "Hierbas y especias"], ["Hoja de aguacate", "kg", "Hierbas y especias"], ["Hoja de plátano", "kg", "Hierbas y especias"],
  ["Orégano seco", "kg", "Hierbas y especias"], ["Comino", "kg", "Hierbas y especias"], ["Canela en raja", "kg", "Hierbas y especias"],
  ["Clavo de olor", "kg", "Hierbas y especias"], ["Pimienta negra", "kg", "Hierbas y especias"], ["Pimienta gorda", "kg", "Hierbas y especias"],
  ["Achiote (pasta)", "kg", "Hierbas y especias"], ["Laurel", "kg", "Hierbas y especias"], ["Tomillo", "kg", "Hierbas y especias"],
  ["Mejorana", "kg", "Hierbas y especias"], ["Anís estrella", "kg", "Hierbas y especias"], ["Vainilla de Papantla", "l", "Hierbas y especias"],
  ["Ajonjolí", "kg", "Hierbas y especias"], ["Pepita de calabaza (pipián)", "kg", "Hierbas y especias"], ["Cacahuate", "kg", "Hierbas y especias"],
  ["Chía", "kg", "Hierbas y especias"], ["Amaranto", "kg", "Hierbas y especias"],
  // Proteínas — res
  ["Arrachera", "kg", "Proteínas — res"], ["Diezmillo", "kg", "Proteínas — res"], ["New York steak", "kg", "Proteínas — res"],
  ["Rib eye", "kg", "Proteínas — res"], ["Filete de res", "kg", "Proteínas — res"], ["T-bone", "kg", "Proteínas — res"],
  ["Carne molida de res", "kg", "Proteínas — res"], ["Falda de res", "kg", "Proteínas — res"], ["Cecina de res", "kg", "Proteínas — res"],
  ["Machaca", "kg", "Proteínas — res"], ["Chambarete", "kg", "Proteínas — res"], ["Cola de res", "kg", "Proteínas — res"],
  // Proteínas — cerdo
  ["Costilla de cerdo", "kg", "Proteínas — cerdo"], ["Pierna de cerdo", "kg", "Proteínas — cerdo"], ["Lomo de cerdo", "kg", "Proteínas — cerdo"],
  ["Pork belly", "kg", "Proteínas — cerdo"], ["Tocino", "kg", "Proteínas — cerdo"], ["Chorizo", "kg", "Proteínas — cerdo"],
  ["Longaniza", "kg", "Proteínas — cerdo"], ["Jamón", "kg", "Proteínas — cerdo"], ["Chicharrón", "kg", "Proteínas — cerdo"],
  ["Cabeza de cerdo (carnitas)", "kg", "Proteínas — cerdo"], ["Manteca de cerdo", "kg", "Proteínas — cerdo"],
  // Proteínas — aves
  ["Pechuga de pollo", "kg", "Proteínas — aves"], ["Muslo de pollo", "kg", "Proteínas — aves"], ["Pollo entero", "kg", "Proteínas — aves"],
  ["Alitas de pollo", "kg", "Proteínas — aves"], ["Pavo", "kg", "Proteínas — aves"], ["Pato", "kg", "Proteínas — aves"],
  // Mariscos y pescados
  ["Camarón", "kg", "Mariscos y pescados"], ["Pulpo", "kg", "Mariscos y pescados"], ["Jurel", "kg", "Mariscos y pescados"],
  ["Atún", "kg", "Mariscos y pescados"], ["Mejillón", "kg", "Mariscos y pescados"], ["Ostión", "pza", "Mariscos y pescados"],
  ["Almeja", "kg", "Mariscos y pescados"], ["Callo de hacha", "kg", "Mariscos y pescados"], ["Pescado blanco (filete)", "kg", "Mariscos y pescados"],
  ["Langosta", "kg", "Mariscos y pescados"], ["Cangrejo", "kg", "Mariscos y pescados"], ["Calamar", "kg", "Mariscos y pescados"],
  ["Abulón", "kg", "Mariscos y pescados"], ["Erizo de mar", "kg", "Mariscos y pescados"], ["Caracol", "kg", "Mariscos y pescados"],
  ["Marlin ahumado", "kg", "Mariscos y pescados"], ["Dorado", "kg", "Mariscos y pescados"], ["Huachinango", "kg", "Mariscos y pescados"],
  ["Mero", "kg", "Mariscos y pescados"], ["Cabrilla", "kg", "Mariscos y pescados"], ["Cazón (tiburón)", "kg", "Mariscos y pescados"],
  // Lácteos y quesos
  ["Huevo", "pza", "Lácteos y quesos"], ["Leche entera", "l", "Lácteos y quesos"], ["Crema ácida", "kg", "Lácteos y quesos"],
  ["Queso panela", "kg", "Lácteos y quesos"], ["Queso Oaxaca", "kg", "Lácteos y quesos"], ["Queso crema", "kg", "Lácteos y quesos"],
  ["Requesón", "kg", "Lácteos y quesos"], ["Mantequilla", "kg", "Lácteos y quesos"], ["Yogurt natural", "l", "Lácteos y quesos"],
  ["Jocoque", "kg", "Lácteos y quesos"], ["Queso Cotija", "kg", "Lácteos y quesos"], ["Queso Chihuahua", "kg", "Lácteos y quesos"],
  ["Queso menonita", "kg", "Lácteos y quesos"], ["Queso asadero", "kg", "Lácteos y quesos"], ["Queso fresco", "kg", "Lácteos y quesos"],
  ["Queso añejo", "kg", "Lácteos y quesos"], ["Queso manchego mexicano", "kg", "Lácteos y quesos"],
  // Masas, granos y semillas
  ["Tortilla de maíz", "pza", "Masas, granos y semillas"], ["Tortilla de harina", "pza", "Masas, granos y semillas"],
  ["Pan para hamburguesa", "pza", "Masas, granos y semillas"], ["Arroz", "kg", "Masas, granos y semillas"],
  ["Frijol negro", "kg", "Masas, granos y semillas"], ["Frijol bayo", "kg", "Masas, granos y semillas"], ["Frijol peruano", "kg", "Masas, granos y semillas"],
  ["Masa nixtamalizada", "kg", "Masas, granos y semillas"], ["Harina de maíz", "kg", "Masas, granos y semillas"],
  ["Harina de trigo", "kg", "Masas, granos y semillas"], ["Avena", "kg", "Masas, granos y semillas"], ["Quinoa", "kg", "Masas, granos y semillas"],
  ["Lenteja", "kg", "Masas, granos y semillas"], ["Garbanzo", "kg", "Masas, granos y semillas"],
  // Endulzantes
  ["Azúcar", "kg", "Endulzantes"], ["Piloncillo", "kg", "Endulzantes"], ["Miel de abeja", "l", "Endulzantes"], ["Azúcar mascabado", "kg", "Endulzantes"],
  // Abarrotes y condimentos
  ["Aceite de oliva", "l", "Abarrotes y condimentos"], ["Aceite vegetal", "l", "Abarrotes y condimentos"], ["Vinagre", "l", "Abarrotes y condimentos"],
  ["Sal", "kg", "Abarrotes y condimentos"], ["Mayonesa", "kg", "Abarrotes y condimentos"], ["Mostaza", "kg", "Abarrotes y condimentos"],
  ["Salsa soya", "l", "Abarrotes y condimentos"], ["Miso", "kg", "Abarrotes y condimentos"], ["Chocolate de mesa", "kg", "Abarrotes y condimentos"],
  ["Café", "kg", "Abarrotes y condimentos"], ["Consomé de pollo en polvo", "kg", "Abarrotes y condimentos"], ["Salsa inglesa", "l", "Abarrotes y condimentos"],
  ["Vino tinto para cocinar", "l", "Abarrotes y condimentos"], ["Vino blanco para cocinar", "l", "Abarrotes y condimentos"],
].map(([nombre, unidad, categoria]) => ({ id: uid(), nombre, unidad, categoria, costoUnit: 0 }));

const DEFAULTS = {
  platillos: MENU_NORO,
  inventario: INVENTARIO_MENU,
  mesas: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ id: uid(), numero: n })),
  comandas: [],
  empleados: [
    { id: uid(), nombre: "Karla Ruiz", puesto: "Mesero", rfc: "RUIK900101AB1", contrasena: "1234", tarifaHora: 45 },
    { id: uid(), nombre: "Beto Sánchez", puesto: "Cocina", rfc: "SAHB880202CD2", contrasena: "5678", tarifaHora: 52 },
  ],
  turnos: [],
  proveedores: [
    { id: uid(), nombre: "Carnes del Pacífico", contacto: "646 123 4567" },
    { id: uid(), nombre: "Mariscos Ensenada", contacto: "646 987 6543" },
  ],
  cxp: [],
  cortes: [],
  ingredientes: INGREDIENTES_BASE,
};

const PUESTOS = ["Mesero", "Cocina", "Caja", "Gerencia"];

// Identidad de color por sección — cada área del negocio tiene su propio tono
const ACCENTS = {
  mesero: { bg: "#FAECE7", icon: "#712B13", solid: "#D85A30", border: "#F0997B" },
  cocina: { bg: "#FAEEDA", icon: "#633806", solid: "#BA7517", border: "#EF9F27" },
  caja: { bg: "#EAF3DE", icon: "#27500A", solid: "#639922", border: "#97C459" },
  inventario: { bg: "#E6F1FB", icon: "#0C447C", solid: "#378ADD", border: "#85B7EB" },
  costeo: { bg: "#EEEDFE", icon: "#3C3489", solid: "#7F77DD", border: "#AFA9EC" },
  nomina: { bg: "#E1F5EE", icon: "#085041", solid: "#1D9E75", border: "#5DCAA5" },
  proveedores: { bg: "#FBEAF0", icon: "#72243E", solid: "#D4537E", border: "#ED93B1" },
  config: { bg: "#F1EFE8", icon: "#444441", solid: "#5F5E5A", border: "#B4B2A9" },
  ingredientes: { bg: "#FCEBEB", icon: "#791F1F", solid: "#A32D2D", border: "#F09595" },
  reservaciones: { bg: "#ECEEFB", icon: "#26315C", solid: "#4A5FC1", border: "#A7B0E8" },
  facturacion: { bg: "#E8EEF2", icon: "#14324A", solid: "#1F5C82", border: "#7FB0CC" },
};

function useCloudState(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });

  const save = useCallback((next) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch (e) {
      console.error("storage error", e);
    }
  }, [key]);

  const fallbackRef = useRef(fallback);
  useEffect(() => {
    fallbackRef.current = fallback;
  });

  // Si nadie ha guardado nada todavía bajo esta clave (p. ej. platillos/inventario recién
  // generados con IDs aleatorios en esta pestaña), lo persistimos de inmediato. Así, cualquier
  // otra pestaña que cargue después recibe exactamente los mismos IDs y registros — evitando que
  // el inventario (platilloId) quede desincronizado del menú (platillos.id) entre pestañas.
  useEffect(() => {
    try {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error("storage error", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Mantiene sincronizados el inventario, las comandas, etc. entre pestañas del mismo navegador
  // (p. ej. Mesero, Cocina y el chef abiertos en pestañas separadas al mismo tiempo).
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? JSON.parse(e.newValue) : fallbackRef.current);
      } catch {
        // valor inválido, se ignora
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return [value, save];
}

const SECCIONES = [
  { id: "mesero", label: "Mesero", desc: "Tomar y enviar comandas", icon: "ti-clipboard-list" },
  { id: "reservaciones", label: "Reservaciones", desc: "Mapa de mesas y horarios", icon: "ti-calendar-event" },
  { id: "cocina", label: "Cocina", desc: "Ver y avanzar comandas", icon: "ti-tools-kitchen-2" },
  { id: "caja", label: "Caja", desc: "Corte diario de ventas", icon: "ti-cash" },
  { id: "inventario", label: "Inventario", desc: "Stock de productos", icon: "ti-box" },
  { id: "ingredientes", label: "Ingredientes", desc: "Catálogo de insumos", icon: "ti-carrot" },
  { id: "costeo", label: "Costeo", desc: "Margen por platillo", icon: "ti-chef-hat" },
  { id: "nomina", label: "Nómina", desc: "Horas y pago por hora", icon: "ti-users" },
  { id: "proveedores", label: "Proveedores", desc: "Cuentas por pagar", icon: "ti-truck" },
  { id: "facturacion", label: "Facturación", desc: "CFDI para clientes (SAT)", icon: "ti-file-invoice" },
];
const TABS = [{ id: "inicio", label: "Inicio", icon: "ti-home" }, ...SECCIONES, { id: "config", label: "Configuración", icon: "ti-settings" }];

function SeccionBloqueada({ tabInfo, accent, suscripcion, saveSuscripcion }) {
  const [cargando, setCargando] = useState(false);

  const suscribirse = () => {
    setCargando(true);
    // Simulación del checkout — en producción esto redirige a la Stripe Checkout Session real (ver guía de implementación).
    setTimeout(() => {
      saveSuscripcion({ status: "active", desde: today() });
      setCargando(false);
    }, 1400);
  };

  const beneficios = [
    "Comandas de mesero a cocina en tiempo real",
    "Corte de caja por denominaciones",
    "Inventario ligado al menú",
    "Catálogo de ingredientes y costeo por receta",
    "Nómina por hora",
    "Cuentas por pagar a proveedores",
  ];

  return (
    <div style={{ textAlign: "center", padding: "24px 4px" }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: accent.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <i className="ti ti-lock" style={{ fontSize: 22, color: accent.icon }} aria-hidden="true" />
      </div>
      <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>{tabInfo?.label} está bloqueada</p>
      {suscripcion.status === "canceled" ? (
        <p style={{ fontSize: 13, color: "var(--text-danger)", marginBottom: 16 }}>Tu suscripción fue cancelada. Actívala de nuevo para seguir usando esta sección.</p>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Activa tu plan para desbloquear esta sección y el resto del sistema.</p>
      )}

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "1.5rem", textAlign: "left" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 4px" }}>Plan mensual</p>
        <p style={{ fontSize: 32, fontWeight: 700, margin: "0 0 16px" }}>
          $250 <span style={{ fontSize: 14, fontWeight: 400, color: "var(--text-secondary)" }}>MXN / mes</span>
        </p>
        {beneficios.map((b) => (
          <div key={b} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0" }}>
            <i className="ti ti-check" style={{ fontSize: 15, color: "#E8A23D", marginTop: 2 }} aria-hidden="true" />
            <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{b}</span>
          </div>
        ))}

        <button
          onClick={suscribirse}
          disabled={cargando}
          style={{ width: "100%", marginTop: 20, background: "#E8A23D", color: "#231802", border: "0.5px solid #E8A23D", borderRadius: 10, fontWeight: 600, padding: "12px 0" }}
        >
          {cargando ? "Redirigiendo a pago seguro..." : "Suscribirme — $250 MXN/mes ↗"}
        </button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 10 }}>
          Pago simulado en este prototipo. En producción se procesa con Stripe.
        </p>
      </div>
    </div>
  );
}

function LogoFondafull({ size = 30, fontSize = 21 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="0" y="0" width="120" height="120" rx="26" fill="#232320" />
        <circle cx="60" cy="60" r="42" fill="none" stroke="#E8A23D" strokeWidth="3" />
        <line x1="37" y1="37" x2="83" y2="83" stroke="#F5EFE6" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="83" y1="37" x2="37" y2="83" stroke="#F5EFE6" strokeWidth="5.5" strokeLinecap="round" />
        <line x1="37" y1="37" x2="29.5" y2="32.7" stroke="#F5EFE6" strokeWidth="3" strokeLinecap="round" />
        <line x1="37" y1="37" x2="31.6" y2="31.6" stroke="#F5EFE6" strokeWidth="3" strokeLinecap="round" />
        <line x1="37" y1="37" x2="32.7" y2="29.5" stroke="#F5EFE6" strokeWidth="3" strokeLinecap="round" />
        <polygon points="91.8,28.2 87.1,40.5 80,40.5" fill="#F5EFE6" />
        <polygon points="91.8,28.2 87.1,40.5 79.5,32.9" fill="#F5EFE6" />
        <circle cx="60" cy="60" r="4.5" fill="#E8A23D" />
      </svg>
      <span style={{ fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize, letterSpacing: -0.5 }}>
        <span style={{ color: "var(--text-primary)" }}>fonda</span>
        <span style={{ color: "#E8A23D", fontStyle: "italic" }}>full</span>
      </span>
    </div>
  );
}

function AuthGate({ onIngresar }) {
  const [modo, setModo] = useState("crear");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [mostrarPass, setMostrarPass] = useState(false);
  const [error, setError] = useState("");
  const [pendienteVerificacion, setPendienteVerificacion] = useState(null);

  const [recuperarCorreo, setRecuperarCorreo] = useState("");
  const [recuperarEnviado, setRecuperarEnviado] = useState(false);
  const [errorRecuperar, setErrorRecuperar] = useState("");

  const beneficios = [
    { icon: "ti-clipboard-list", label: "Mesero", desc: "Comandas de mesa a cocina en tiempo real" },
    { icon: "ti-tools-kitchen-2", label: "Cocina", desc: "Pantalla con el estatus de cada comanda" },
    { icon: "ti-cash", label: "Caja", desc: "Inicio y corte diario por denominaciones" },
    { icon: "ti-box", label: "Inventario", desc: "Stock ligado al menú, se descuenta solo" },
    { icon: "ti-carrot", label: "Ingredientes", desc: "Catálogo de insumos con precio editable" },
    { icon: "ti-chef-hat", label: "Costeo", desc: "Receta y margen calculados por platillo" },
    { icon: "ti-users", label: "Nómina", desc: "Entradas, salidas y pago por hora" },
    { icon: "ti-truck", label: "Proveedores", desc: "Cuentas por pagar con vencimiento" },
  ];

  const enviar = (e) => {
    e.preventDefault();
    if (modo === "crear" && !nombre.trim()) {
      setError("Escribe tu nombre.");
      return;
    }
    if (!correo.includes("@")) {
      setError("Escribe un correo válido.");
      return;
    }
    if (pass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    const datos = { nombre: modo === "crear" ? nombre.trim() : correo.split("@")[0], correo };
    if (modo === "crear") {
      // Simulación de correo de confirmación de identidad antes de dejar entrar al usuario.
      setPendienteVerificacion(datos);
    } else {
      onIngresar(datos);
    }
  };

  const enviarRecuperacion = (e) => {
    e.preventDefault();
    if (!recuperarCorreo.includes("@")) {
      setErrorRecuperar("Escribe un correo válido.");
      return;
    }
    setErrorRecuperar("");
    setRecuperarEnviado(true);
  };

  if (pendienteVerificacion) {
    return (
      <div style={{ maxWidth: 420, margin: "64px auto", fontFamily: "var(--font-sans)", padding: "32px 4px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <i className="ti ti-mail-check" style={{ fontSize: 24, color: "#633806" }} aria-hidden="true" />
        </div>
        <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px" }}>Confirma tu correo</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 20px" }}>
          Enviamos un correo de confirmación a <strong style={{ color: "var(--text-primary)" }}>{pendienteVerificacion.correo}</strong> para verificar tu identidad. Abre el enlace que te enviamos para activar tu cuenta.
        </p>
        <button
          onClick={() => onIngresar(pendienteVerificacion)}
          style={{ width: "100%", background: "#E8A23D", color: "#231802", border: "0.5px solid #E8A23D", borderRadius: 10, fontWeight: 600, padding: "11px 0", marginBottom: 8 }}
        >
          Ya confirmé mi correo ↗
        </button>
        <button
          onClick={() => setPendienteVerificacion(null)}
          style={{ width: "100%", fontSize: 13 }}
        >
          Reenviar correo / regresar
        </button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 14 }}>
          Verificación simulada en este prototipo. En producción se envía un correo real con un enlace de confirmación (p. ej. con Supabase Auth).
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "var(--font-sans)", padding: "32px 4px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <LogoFondafull size={34} fontSize={24} />
      </div>

      <p style={{ fontSize: 15, fontWeight: 500, textAlign: "center", margin: "0 0 4px" }}>Todo tu restaurante, en un solo lugar</p>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", textAlign: "center", margin: "0 0 24px" }}>
        Crea tu cuenta o inicia sesión — después eliges qué secciones activar.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8, marginBottom: 28 }}>
        {beneficios.map((b) => (
          <div key={b.label} style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "0.75rem" }}>
            <i className={`ti ${b.icon}`} style={{ fontSize: 16, color: "#E8A23D" }} aria-hidden="true" />
            <div style={{ fontSize: 13, fontWeight: 500, margin: "6px 0 2px" }}>{b.label}</div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4 }}>{b.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 16, padding: "0.5rem" }}>
        <div style={{ display: "flex", gap: 4, background: "var(--surface-1)", borderRadius: 12, padding: 4, marginBottom: 16 }}>
          <button
            onClick={() => { setModo("crear"); setRecuperarEnviado(false); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, background: modo === "crear" ? "#E8A23D" : "transparent", color: modo === "crear" ? "#231802" : "var(--text-secondary)", border: "none" }}
          >
            Crear cuenta
          </button>
          <button
            onClick={() => { setModo("entrar"); setRecuperarEnviado(false); }}
            style={{ flex: 1, padding: "9px 0", borderRadius: 9, fontSize: 13, fontWeight: 600, background: modo === "entrar" ? "#E8A23D" : "transparent", color: modo === "entrar" ? "#231802" : "var(--text-secondary)", border: "none" }}
          >
            Iniciar sesión
          </button>
        </div>

        {modo === "recuperar" ? (
          <div style={{ padding: "0 12px 16px" }}>
            {recuperarEnviado ? (
              <>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
                  Si <strong style={{ color: "var(--text-primary)" }}>{recuperarCorreo}</strong> está registrado, te enviamos instrucciones para restablecer tu contraseña.
                </p>
                <button
                  onClick={() => { setModo("entrar"); setRecuperarEnviado(false); }}
                  style={{ width: "100%", background: "#E8A23D", color: "#231802", border: "0.5px solid #E8A23D", borderRadius: 10, fontWeight: 600, padding: "11px 0" }}
                >
                  Regresar a iniciar sesión
                </button>
              </>
            ) : (
              <form onSubmit={enviarRecuperacion}>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
                  Escribe tu correo y te enviaremos instrucciones para recuperar tu contraseña.
                </p>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Correo electrónico</label>
                  <input type="email" value={recuperarCorreo} onChange={(e) => setRecuperarCorreo(e.target.value)} placeholder="tucorreo@ejemplo.com" style={{ width: "100%" }} />
                </div>
                {errorRecuperar && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: "4px 0 8px" }}>{errorRecuperar}</p>}
                <button type="submit" style={{ width: "100%", marginTop: 8, background: "#E8A23D", color: "#231802", border: "0.5px solid #E8A23D", borderRadius: 10, fontWeight: 600, padding: "11px 0" }}>
                  Enviar instrucciones ↗
                </button>
                <button type="button" onClick={() => setModo("entrar")} style={{ width: "100%", marginTop: 8, fontSize: 13 }}>
                  Regresar
                </button>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={enviar} style={{ padding: "0 12px 16px" }}>
            {modo === "crear" && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Nombre del restaurante</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Mi restaurante" style={{ width: "100%" }} />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Correo electrónico</label>
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="tucorreo@ejemplo.com" style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: 4 }}>
              <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Contraseña</label>
              <div style={{ position: "relative" }}>
                <input
                  type={mostrarPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  style={{ width: "100%", paddingRight: 36 }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPass((v) => !v)}
                  aria-label={mostrarPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                  style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", padding: 6, display: "flex", alignItems: "center" }}
                >
                  <i className={`ti ${mostrarPass ? "ti-eye-off" : "ti-eye"}`} style={{ fontSize: 16, color: "var(--text-muted)" }} aria-hidden="true" />
                </button>
              </div>
            </div>
            {modo === "entrar" && (
              <div style={{ textAlign: "right", marginBottom: 8 }}>
                <button
                  type="button"
                  onClick={() => { setModo("recuperar"); setRecuperarCorreo(correo); setError(""); }}
                  style={{ fontSize: 12, color: "var(--text-secondary)", background: "transparent", border: "none", padding: 0 }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
            {error && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: "4px 0 8px" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", marginTop: 8, background: "#E8A23D", color: "#231802", border: "0.5px solid #E8A23D", borderRadius: 10, fontWeight: 600, padding: "11px 0" }}>
              {modo === "crear" ? "Crear cuenta ↗" : "Iniciar sesión ↗"}
            </button>
          </form>
        )}
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 14 }}>
        Inicio de sesión simulado en este prototipo. En producción se maneja con Supabase Auth (contraseñas cifradas, nunca en texto plano; correos de confirmación y recuperación reales).
      </p>
    </div>
  );
}

export default function App() {
  const [sesion, setSesion] = useState(null);
  const [tab, setTab] = useState("inicio");
  const [platillos, saveP] = useCloudState("rc_platillos", DEFAULTS.platillos);
  const [inventario, saveInv] = useCloudState("rc_inventario", DEFAULTS.inventario);
  const [mesas] = useCloudState("rc_mesas", DEFAULTS.mesas);
  const [comandas, saveCom] = useCloudState("rc_comandas", DEFAULTS.comandas);
  const [empleados, saveEmp] = useCloudState("rc_empleados", DEFAULTS.empleados);
  const [turnos, saveTur] = useCloudState("rc_turnos", DEFAULTS.turnos);
  const [proveedores, saveProv] = useCloudState("rc_proveedores", DEFAULTS.proveedores);
  const [cxp, saveCxp] = useCloudState("rc_cxp", DEFAULTS.cxp);
  const [cortes, saveCortes] = useCloudState("rc_cortes", DEFAULTS.cortes);
  const [aperturas, saveAperturas] = useCloudState("rc_aperturas_caja", []);
  const [reservas, saveReservas] = useCloudState("rc_reservas", []);
  const [estadoMesas, saveEstadoMesas] = useCloudState("rc_estado_mesas", {});
  const [datosFiscales, saveDatosFiscales] = useCloudState("rc_datos_fiscales", { rfc: "", razonSocial: "", regimenFiscal: "", codigoPostal: "" });
  const [facturas, saveFacturas] = useCloudState("rc_facturas", []);
  const [ingredientes, saveIng] = useCloudState("rc_ingredientes", DEFAULTS.ingredientes);
  const [gastosOp, saveGastosOp] = useCloudState("rc_gastos_operativos", []);
  const [costeoCfg, saveCosteoCfg] = useCloudState("rc_costeo_config", { platillosMes: 0 });
  const [config, saveConfig] = useCloudState("rc_config", { nombre: "", logo: null });
  const [suscripcion, saveSuscripcion] = useCloudState("rc_suscripcion", { status: "inactive", desde: null });
  const [cuentas, saveCuentas] = useCloudState("rc_cuentas", []);
  const [sesionMesero, setSesionMesero] = useState(null);
  const [sesionChef, setSesionChef] = useState(null);
  const [alertaStock, setAlertaStock] = useState([]);
  const activo = suscripcion.status === "active";

  const accent = ACCENTS[tab];
  const tabInfo = TABS.find((t) => t.id === tab);
  const seccionesId = SECCIONES.map((s) => s.id);
  const seccionBloqueada = !activo && seccionesId.includes(tab);

  if (!sesion) {
    return (
      <AuthGate
        onIngresar={(datos) => {
          setSesion(datos);
          saveSuscripcion({ status: "active", desde: today() });
        }}
      />
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginBottom: 16, paddingTop: 4 }}>
        <LogoFondafull size={44} fontSize={32} />

        <p style={{ fontSize: 12, color: "var(--text-secondary)", textAlign: "center", margin: "0 0 6px", letterSpacing: 0.2 }}>
          Sistema de gestión de restaurante en la nube
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {config.logo ? (
            <img src={config.logo} alt="" style={{ width: 20, height: 20, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 20, height: 20, borderRadius: 6, background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className="ti ti-tools-kitchen-2" style={{ fontSize: 11, color: "var(--text-muted)" }} aria-hidden="true" />
            </div>
          )}
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{config.nombre || "Mi restaurante"}</span>
        </div>
      </div>

      <div
        style={{
          borderRadius: 16,
          padding: "1.1rem 1.25rem",
          marginBottom: 14,
          background: accent ? accent.bg : "var(--surface-1)",
          transition: "background 0.2s",
        }}
      >
        <p style={{ fontSize: 12, color: accent ? accent.icon : "var(--text-muted)", margin: "0 0 4px", letterSpacing: 0.4, opacity: 0.75 }}>
          Panel del negocio
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {accent && (
            <div style={{ width: 34, height: 34, borderRadius: 10, background: accent.solid, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <i className={`ti ${tabInfo?.icon || "ti-home"}`} style={{ fontSize: 18, color: "#fff" }} aria-hidden="true" />
            </div>
          )}
          <p style={{ fontSize: 20, fontWeight: 500, margin: 0, color: accent ? accent.icon : "var(--text-primary)" }}>
            {tab === "inicio" ? "¿Qué vamos a hacer hoy?" : tabInfo?.label}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 14, WebkitOverflowScrolling: "touch" }}>
        {TABS.map((t) => {
          const a = ACCENTS[t.id];
          const active = tab === t.id;
          const bloqueada = !activo && seccionesId.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: "0 0 auto",
                fontSize: 13,
                padding: "8px 12px",
                background: active ? (a ? a.solid : "var(--fill-primary)") : "var(--surface-1)",
                color: active ? "#fff" : "var(--text-secondary)",
                border: active ? `0.5px solid ${a ? a.solid : "var(--fill-primary)"}` : "0.5px solid var(--border)",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <i className={`ti ${t.icon}`} style={{ fontSize: 16 }} aria-hidden="true" />
              {t.label}
              {bloqueada && <i className="ti ti-lock" style={{ fontSize: 12, opacity: 0.7 }} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {tab === "inicio" && <Inicio onNavigate={setTab} activo={activo} comandas={comandas} sesion={sesion} />}
      {seccionBloqueada ? (
        <SeccionBloqueada tabInfo={tabInfo} accent={accent} suscripcion={suscripcion} saveSuscripcion={saveSuscripcion} />
      ) : (
        <>
          {tab === "mesero" && (
            <Mesero
              mesas={mesas}
              platillos={platillos}
              comandas={comandas}
              saveCom={saveCom}
              inventario={inventario}
              empleados={empleados}
              estadoMesas={estadoMesas}
              saveEstadoMesas={saveEstadoMesas}
              cuentas={cuentas}
              saveCuentas={saveCuentas}
              sesionMesero={sesionMesero}
              setSesionMesero={setSesionMesero}
              alertaStock={alertaStock}
              setAlertaStock={setAlertaStock}
              accent={ACCENTS.mesero}
            />
          )}
          {tab === "reservaciones" && (
            <Reservaciones
              mesas={mesas}
              reservas={reservas}
              saveReservas={saveReservas}
              estadoMesas={estadoMesas}
              saveEstadoMesas={saveEstadoMesas}
              cuentas={cuentas}
              saveCuentas={saveCuentas}
              comandas={comandas}
              accent={ACCENTS.reservaciones}
            />
          )}
          {tab === "cocina" && (
            <Cocina
              comandas={comandas}
              saveCom={saveCom}
              inventario={inventario}
              saveInv={saveInv}
              setAlertaStock={setAlertaStock}
              accent={ACCENTS.cocina}
            />
          )}
          {tab === "caja" && (
            <Caja comandas={comandas} cortes={cortes} saveCortes={saveCortes} aperturas={aperturas} saveAperturas={saveAperturas} accent={ACCENTS.caja} />
          )}
          {tab === "inventario" && (
            <Inventario
              inventario={inventario}
              saveInv={saveInv}
              empleados={empleados}
              sesionChef={sesionChef}
              setSesionChef={setSesionChef}
              accent={ACCENTS.inventario}
            />
          )}
          {tab === "ingredientes" && <Ingredientes ingredientes={ingredientes} saveIng={saveIng} accent={ACCENTS.ingredientes} />}
          {tab === "costeo" && (
            <Costeo
              platillos={platillos}
              saveP={saveP}
              ingredientes={ingredientes}
              saveIng={saveIng}
              gastosOp={gastosOp}
              saveGastosOp={saveGastosOp}
              costeoCfg={costeoCfg}
              saveCosteoCfg={saveCosteoCfg}
              onNavigate={setTab}
              accent={ACCENTS.costeo}
            />
          )}
          {tab === "nomina" && (
            <Nomina empleados={empleados} turnos={turnos} saveTur={saveTur} accent={ACCENTS.nomina} />
          )}
          {tab === "proveedores" && (
            <Proveedores proveedores={proveedores} cxp={cxp} saveCxp={saveCxp} accent={ACCENTS.proveedores} />
          )}
          {tab === "facturacion" && (
            <Facturacion
              comandas={comandas}
              datosFiscales={datosFiscales}
              saveDatosFiscales={saveDatosFiscales}
              facturas={facturas}
              saveFacturas={saveFacturas}
              accent={ACCENTS.facturacion}
            />
          )}
        </>
      )}
      {tab === "config" && <Configuracion config={config} saveConfig={saveConfig} suscripcion={suscripcion} saveSuscripcion={saveSuscripcion} sesion={sesion} onCerrarSesion={() => setSesion(null)} empleados={empleados} saveEmp={saveEmp} accent={ACCENTS.config} />}
    </div>
  );
}

// ---------- INICIO ----------
function Inicio({ onNavigate, activo, comandas, sesion }) {
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";
  const iconoSaludo = hora < 12 ? "ti-sun" : hora < 19 ? "ti-sun-high" : "ti-moon-stars";
  const primerNombre = (sesion?.nombre || "").split(" ")[0];

  const deHoy = (comandas || []).filter((c) => c.fecha === today());
  const ventaHoy = deHoy.reduce((s, c) => s + c.total, 0);

  return (
    <div>
      <style>{`
        .ff-card {
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
          box-shadow: 0 2px 10px -6px var(--ff-rest-shadow, rgba(0,0,0,0.18));
        }
        .ff-card:hover {
          transform: translateY(-4px);
          border-color: var(--ff-hover-border, var(--border-strong));
          box-shadow: 0 12px 24px -10px var(--ff-hover-shadow, rgba(0,0,0,0.3));
        }
        .ff-card:active { transform: translateY(-1px); }
        .ff-icon-chip { transition: transform .18s ease; }
        .ff-card:hover .ff-icon-chip { transform: scale(1.1) rotate(-4deg); }
        .ff-arrow { opacity: 0; transform: translateX(-4px); transition: opacity .18s ease, transform .18s ease; }
        .ff-card:hover .ff-arrow { opacity: 1; transform: translateX(0); }
        .ff-topbar { height: 4px; border-radius: 4px 4px 0 0; margin: -1rem -1rem 10px; background: var(--ff-hover-border, transparent); opacity: 0.85; }
        @keyframes ff-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes ff-blob { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(6px,-8px) scale(1.05); } }
        .ff-greeting-icon { animation: ff-float 3.2s ease-in-out infinite; display: inline-flex; }
        .ff-blob-a { animation: ff-blob 9s ease-in-out infinite; }
        .ff-blob-b { animation: ff-blob 11s ease-in-out infinite reverse; }
      `}</style>

      <div style={{ position: "relative", overflow: "hidden", borderRadius: 20, padding: "1.4rem 1.25rem", marginBottom: 18, background: "var(--surface-2)", border: "0.5px solid var(--border)" }}>
        <div className="ff-blob-a" style={{ position: "absolute", top: -40, right: -30, width: 130, height: 130, borderRadius: "50%", background: "#E8A23D", opacity: 0.16, filter: "blur(6px)" }} />
        <div className="ff-blob-b" style={{ position: "absolute", bottom: -50, left: -30, width: 110, height: 110, borderRadius: "50%", background: "#3D8478", opacity: 0.14, filter: "blur(6px)" }} />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
          <span className="ff-greeting-icon" style={{ color: "#E8A23D", fontSize: 24 }}>
            <i className={`ti ${iconoSaludo}`} aria-hidden="true" />
          </span>
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
              {saludo}{primerNombre ? `, ${primerNombre}` : ""}
            </p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>Esto es lo que puedes hacer hoy</p>
          </div>
        </div>

        {activo && (
          <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10, marginTop: 18 }}>
            <div style={{ background: "#FAECE7", borderRadius: 14, padding: "0.8rem 0.9rem", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "#F0997B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-clipboard-list" style={{ fontSize: 15, color: "#4A1B0C" }} aria-hidden="true" />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#712B13", opacity: 0.8, margin: 0 }}>Comandas hoy</p>
                <p style={{ fontSize: 19, fontWeight: 700, color: "#712B13", margin: 0, lineHeight: 1.1 }}>{deHoy.length}</p>
              </div>
            </div>
            <div style={{ background: "#EAF3DE", borderRadius: 14, padding: "0.8rem 0.9rem", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "#97C459", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <i className="ti ti-cash" style={{ fontSize: 15, color: "#173404" }} aria-hidden="true" />
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#27500A", opacity: 0.8, margin: 0 }}>Venta esperada</p>
                <p style={{ fontSize: 19, fontWeight: 700, color: "#27500A", margin: 0, lineHeight: 1.1 }}>{money(ventaHoy)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {!activo && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FCEBEB", color: "#791F1F", padding: "10px 12px", borderRadius: 12, marginBottom: 14, fontSize: 13 }}>
          <i className="ti ti-lock" style={{ fontSize: 15 }} aria-hidden="true" />
          Tienes acceso a Fondafull, pero las secciones están bloqueadas hasta activar tu plan.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
        {SECCIONES.map((s) => {
          const a = ACCENTS[s.id];
          return (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="ff-card"
              style={{
                textAlign: "left",
                padding: "1rem",
                background: "var(--surface-2)",
                border: "0.5px solid var(--border)",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
                position: "relative",
                opacity: activo ? 1 : 0.85,
                overflow: "hidden",
                "--ff-hover-border": a.solid,
                "--ff-hover-shadow": `${a.solid}40`,
                "--ff-rest-shadow": `${a.solid}22`,
              }}
            >
              <div className="ff-topbar" style={{ "--ff-hover-border": a.solid }} />
              {!activo && (
                <div style={{ position: "absolute", top: 10, right: 10, width: 22, height: 22, borderRadius: "50%", background: "var(--surface-1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <i className="ti ti-lock" style={{ fontSize: 12, color: "var(--text-muted)" }} aria-hidden="true" />
                </div>
              )}
              <div className="ff-icon-chip" style={{ width: 38, height: 38, borderRadius: 11, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: 20, color: a.icon }} aria-hidden="true" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.desc}</div>
                </div>
                {activo && (
                  <i className="ti ti-arrow-right ff-arrow" style={{ fontSize: 15, color: a.icon, flexShrink: 0 }} aria-hidden="true" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- MESERO ----------
function Mesero({ mesas, platillos, comandas, saveCom, inventario, empleados, estadoMesas, saveEstadoMesas, cuentas, saveCuentas, sesionMesero, setSesionMesero, alertaStock, setAlertaStock, accent }) {
  const meseros = (empleados || []).filter((e) => e.puesto === "Mesero");

  const [rfcLogin, setRfcLogin] = useState("");
  const [pinLogin, setPinLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [mesaSel, setMesaSel] = useState(mesas[0]?.numero || 1);
  const [responsable, setResponsable] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [errorEnvio, setErrorEnvio] = useState("");

  const ingresar = () => {
    const encontrado = meseros.find(
      (m) => (m.rfc || "").toUpperCase() === rfcLogin.trim().toUpperCase() && m.contrasena === pinLogin
    );
    if (!encontrado) {
      setErrorLogin("RFC o contraseña incorrectos.");
      return;
    }
    setErrorLogin("");
    setRfcLogin("");
    setPinLogin("");
    setSesionMesero({ id: encontrado.id, nombre: encontrado.nombre });
  };

  if (!sesionMesero) {
    return (
      <div style={{ maxWidth: 320, margin: "32px auto", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: accent.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <i className="ti ti-user-check" style={{ fontSize: 22, color: accent.icon }} aria-hidden="true" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Inicio de sesión de mesero</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Ingresa tu RFC y contraseña para tomar comandas.</p>
        {meseros.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Aún no hay meseros dados de alta. Ve a Configuración.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <input placeholder="RFC" value={rfcLogin} onChange={(e) => setRfcLogin(e.target.value.toUpperCase())} />
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Contraseña (4 dígitos)"
              value={pinLogin}
              onChange={(e) => setPinLogin(e.target.value.replace(/\D/g, ""))}
            />
            {errorLogin && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{errorLogin}</p>}
            <button onClick={ingresar} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
              Ingresar ↗
            </button>
          </div>
        )}
      </div>
    );
  }

  const cuentaAbierta = cuentas.find((c) => c.mesa === mesaSel && c.abierta);

  const abrirCuenta = () => {
    if (!responsable.trim()) return;
    const nueva = {
      id: uid(),
      mesa: mesaSel,
      responsable: responsable.trim(),
      mesero: sesionMesero.nombre,
      abierta: true,
      fecha: today(),
      horaApertura: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    saveCuentas([...cuentas, nueva]);
    saveEstadoMesas({ ...estadoMesas, [mesaSel]: "ocupada" });
    setResponsable("");
  };

  const stockDe = (platilloId) => inventario.find((i) => i.platilloId === platilloId);
  const comprometidoEnCocina = (platilloId) =>
    comandas
      .filter((c) => c.fecha === today() && c.estado !== "entregado")
      .reduce((s, c) => s + (c.items.find((i) => i.platilloId === platilloId)?.cant || 0), 0);
  const disponibles = (platilloId) => {
    const inv = stockDe(platilloId);
    if (!inv) return null; // sin control de inventario para este platillo
    const enCarritoCant = carrito.find((i) => i.platilloId === platilloId)?.cant || 0;
    return inv.stock - comprometidoEnCocina(platilloId) - enCarritoCant;
  };

  const addItem = (p) => {
    const disp = disponibles(p.id);
    if (disp !== null && disp <= 0) return;
    setCarrito((c) => {
      const ex = c.find((i) => i.platilloId === p.id);
      if (ex) return c.map((i) => (i.platilloId === p.id ? { ...i, cant: i.cant + 1 } : i));
      return [...c, { platilloId: p.id, nombre: p.nombre, precio: p.precio, cant: 1 }];
    });
  };

  const restarItem = (id) => {
    setCarrito((c) =>
      c
        .map((i) => (i.platilloId === id ? { ...i, cant: i.cant - 1 } : i))
        .filter((i) => i.cant > 0)
    );
  };

  const quitarItem = (id) => setCarrito((c) => c.filter((i) => i.platilloId !== id));

  const setComentario = (id, texto) => {
    setCarrito((c) => c.map((i) => (i.platilloId === id ? { ...i, comentario: texto } : i)));
  };

  const enviarComanda = () => {
    if (carrito.length === 0 || !cuentaAbierta) return;

    // Verificación final por si el inventario cambió mientras se armaba la comanda
    // (p. ej. otro mesero pidió lo mismo, o cocina entregó algo mientras tanto).
    const excedidos = carrito.filter((item) => {
      const inv = stockDe(item.platilloId);
      if (!inv) return false;
      const disponibleSinCarrito = inv.stock - comprometidoEnCocina(item.platilloId);
      return item.cant > disponibleSinCarrito;
    });
    if (excedidos.length > 0) {
      setErrorEnvio(`Ya no hay suficiente inventario de: ${excedidos.map((i) => i.nombre).join(", ")}. Ajusta las cantidades.`);
      return;
    }
    setErrorEnvio("");

    const itemsLimpios = carrito.map((i) => ({ ...i, comentario: (i.comentario || "").trim() }));
    const nueva = {
      id: uid(),
      mesa: mesaSel,
      cuentaId: cuentaAbierta.id,
      mesero: sesionMesero.nombre,
      items: itemsLimpios,
      estado: "pendiente",
      hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
      fecha: today(),
      total: itemsLimpios.reduce((s, i) => s + i.precio * i.cant, 0),
    };
    saveCom([nueva, ...comandas]);
    // El inventario se descuenta hasta que Cocina marca la comanda como entregada.

    // Alerta previa: si tras esta comanda a un platillo le queda exactamente 1 disponible, avisar de una vez.
    const quedanEnUno = itemsLimpios
      .map((item) => {
        const inv = stockDe(item.platilloId);
        if (!inv) return null;
        const disponibleTrasEnvio = inv.stock - comprometidoEnCocina(item.platilloId) - item.cant;
        return disponibleTrasEnvio === 1 ? item.nombre : null;
      })
      .filter(Boolean);
    if (quedanEnUno.length > 0) {
      setAlertaStock((prev) => Array.from(new Set([...(prev || []), ...quedanEnUno])));
    }

    setCarrito([]);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Mesero: <strong style={{ color: "var(--text-primary)" }}>{sesionMesero.nombre}</strong>
        </div>
        <button onClick={() => setSesionMesero(null)} style={{ fontSize: 12, padding: "4px 10px" }}>Cerrar sesión</button>
      </div>

      {alertaStock.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, background: "#FCEBEB", color: "#791F1F", padding: "10px 12px", borderRadius: 12, marginBottom: 12, fontSize: 13 }}>
          <div>
            <i className="ti ti-alert-triangle" style={{ fontSize: 15, verticalAlign: -2, marginRight: 6 }} aria-hidden="true" />
            ¡Alerta! Solo existe 1 platillo más de: {alertaStock.join(", ")}
          </div>
          <i className="ti ti-x" style={{ fontSize: 15, cursor: "pointer", flexShrink: 0 }} onClick={() => setAlertaStock([])} aria-hidden="true" />
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Mesa</label>
        <select value={mesaSel} onChange={(e) => setMesaSel(Number(e.target.value))} style={{ width: 90 }}>
          {mesas.map((m) => (
            <option key={m.id} value={m.numero}>#{m.numero}</option>
          ))}
        </select>
      </div>

      {!cuentaAbierta ? (
        <div style={{ background: accent.bg, borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: accent.icon, margin: "0 0 8px" }}>
            Esta mesa no tiene cuenta abierta. Escribe el nombre del responsable para abrirla.
          </p>
          <input
            placeholder="Nombre del responsable de cuenta"
            value={responsable}
            onChange={(e) => setResponsable(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <button
            onClick={abrirCuenta}
            disabled={!responsable.trim()}
            style={{ width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}
          >
            Abrir cuenta ↗
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 12 }}>
            Cuenta abierta a nombre de <strong style={{ color: "var(--text-primary)" }}>{cuentaAbierta.responsable}</strong>
          </div>

          {["Entradas", "Fuertes", "Postres"].map((cat) => {
        const items = platillos.filter((p) => (p.categoria || "Otros") === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: accent.icon, letterSpacing: 0.4, textTransform: "uppercase", margin: "0 0 8px" }}>{cat}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
              {items.map((p) => {
                const enCarrito = carrito.find((i) => i.platilloId === p.id);
                const disp = disponibles(p.id);
                const agotado = disp !== null && disp <= 0;
                const soloUno = disp === 1;
                const bajo = disp !== null && disp > 1 && disp <= (stockDe(p.id)?.minimo || 0);
                return (
                  <button
                    key={p.id}
                    onClick={() => addItem(p)}
                    disabled={agotado}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 12,
                      position: "relative",
                      opacity: agotado ? 0.5 : 1,
                      background: enCarrito ? accent.bg : "var(--surface-2)",
                      border: enCarrito ? `0.5px solid ${accent.solid}` : "0.5px solid var(--border)",
                    }}
                  >
                    {enCarrito && (
                      <span
                        style={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: accent.solid,
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {enCarrito.cant}
                      </span>
                    )}
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{p.nombre}</div>
                    <div style={{ fontSize: 13, color: accent.icon, fontWeight: 500 }}>{money(p.precio)}</div>
                    {disp !== null && (
                      <div style={{ fontSize: 11, marginTop: 2, fontWeight: soloUno ? 600 : 400, color: agotado || soloUno ? "var(--text-danger)" : bajo ? "var(--text-warning)" : "var(--text-muted)" }}>
                        {agotado ? "Agotado" : soloUno ? "¡Solo queda 1!" : `${disp} disponibles`}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {carrito.length > 0 && (
        <div style={{ background: accent.bg, borderRadius: 14, padding: "1rem", marginBottom: 12 }}>
          {carrito.map((i) => (
            <div key={i.platilloId} style={{ padding: "6px 0", borderBottom: `0.5px solid ${accent.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14, color: accent.icon }}>
                <span>{i.nombre}</span>
                <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    onClick={() => restarItem(i.platilloId)}
                    aria-label={`Restar ${i.nombre}`}
                    style={{ width: 24, height: 24, padding: 0, borderRadius: "50%", background: "var(--surface-2)", border: `0.5px solid ${accent.solid}`, color: accent.icon, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <i className="ti ti-minus" style={{ fontSize: 14 }} aria-hidden="true" />
                  </button>
                  <span style={{ minWidth: 16, textAlign: "center", fontWeight: 500 }}>{i.cant}</span>
                  <button
                    onClick={() => addItem({ id: i.platilloId, nombre: i.nombre, precio: i.precio })}
                    disabled={disponibles(i.platilloId) !== null && disponibles(i.platilloId) <= 0}
                    aria-label={`Sumar ${i.nombre}`}
                    style={{ width: 24, height: 24, padding: 0, borderRadius: "50%", background: accent.solid, border: `0.5px solid ${accent.solid}`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", opacity: disponibles(i.platilloId) !== null && disponibles(i.platilloId) <= 0 ? 0.5 : 1 }}
                  >
                    <i className="ti ti-plus" style={{ fontSize: 14 }} aria-hidden="true" />
                  </button>
                  <span style={{ minWidth: 56, textAlign: "right" }}>{money(i.precio * i.cant)}</span>
                  <i className="ti ti-x" style={{ fontSize: 16, cursor: "pointer" }} onClick={() => quitarItem(i.platilloId)} aria-hidden="true" />
                </span>
              </div>
              <input
                placeholder="Comentario (ej. sin cebolla, término medio)"
                value={i.comentario || ""}
                onChange={(e) => setComentario(i.platilloId, e.target.value)}
                style={{ width: "100%", marginTop: 6, marginBottom: 4, fontSize: 13, background: "var(--surface-2)" }}
              />
            </div>
          ))}
          <div style={{ marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 500, color: accent.icon }}>
            <span>Total</span>
            <span>{money(carrito.reduce((s, i) => s + i.precio * i.cant, 0))}</span>
          </div>
        </div>
      )}

      {errorEnvio && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: "0 0 8px" }}>{errorEnvio}</p>}
          <button onClick={enviarComanda} disabled={carrito.length === 0} style={{ width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            Enviar comanda a cocina ↗
          </button>
        </>
      )}

      <HistorialPedidos comandas={comandas} accent={accent} />
    </div>
  );
}

function HistorialPedidos({ comandas, accent }) {
  const [abierto, setAbierto] = useState(null);
  const deHoy = comandas.filter((c) => c.fecha === today());

  return (
    <div style={{ marginTop: 20 }}>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px" }}>Historial de pedidos de hoy ({deHoy.length})</p>
      {deHoy.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Aún no hay pedidos hoy.</p>}
      {deHoy.map((c) => {
        const expandido = abierto === c.id;
        return (
          <div key={c.id} style={{ borderBottom: "0.5px solid var(--border)" }}>
            <button
              onClick={() => setAbierto(expandido ? null : c.id)}
              style={{ width: "100%", textAlign: "left", padding: "8px 0", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ fontSize: 13 }}>
                <i className={`ti ti-chevron-${expandido ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6, color: "var(--text-muted)" }} aria-hidden="true" />
                Mesa {c.mesa}{c.mesero && ` · ${c.mesero}`} · {c.hora} · {money(c.total)}
              </span>
              <EstadoBadge estado={c.estado} />
            </button>
            {expandido && (
              <div style={{ padding: "0 0 10px 19px" }}>
                {c.items.map((i, idx) => (
                  <div key={idx} style={{ fontSize: 13, color: "var(--text-secondary)", padding: "2px 0" }}>
                    {i.cant}x {i.nombre}
                    {i.comentario && <span style={{ color: accent.icon }}> — {i.comentario}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    pendiente: { bg: "#FAEEDA", text: "#633806", label: "Pendiente" },
    entregado: { bg: "var(--surface-1)", text: "var(--text-secondary)", label: "Entregado" },
  };
  const s = map[estado] || map.pendiente;
  return <span style={{ fontSize: 12, background: s.bg, color: s.text, padding: "2px 9px", borderRadius: 999, fontWeight: 500 }}>{s.label}</span>;
}

// ---------- RESERVACIONES ----------
const ESTADOS_MESA = {
  libre: { label: "Libre", bg: "#EAF3DE", text: "#27500A", dot: "#639922" },
  reservada: { label: "Reservada", bg: "#FAEEDA", text: "#633806", dot: "#BA7517" },
  ocupada: { label: "Ocupada", bg: "#FAECE7", text: "#712B13", dot: "#D85A30" },
};
function ReservaBadge({ estatus }) {
  const map = {
    pendiente: { bg: "#FAEEDA", text: "#633806", label: "Pendiente" },
    confirmada: { bg: "#EAF3DE", text: "#27500A", label: "Confirmada" },
    cancelada: { bg: "var(--surface-1)", text: "var(--text-muted)", label: "Cancelada" },
  };
  const s = map[estatus] || map.pendiente;
  return <span style={{ fontSize: 11, background: s.bg, color: s.text, padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>{s.label}</span>;
}

function Reservaciones({ mesas, reservas, saveReservas, estadoMesas, saveEstadoMesas, cuentas, saveCuentas, comandas, accent }) {
  const [fechaVer, setFechaVer] = useState(today());
  const [form, setForm] = useState({ mesa: mesas[0]?.numero || 1, fecha: today(), hora: "", personas: "2", nombre: "", telefono: "", notas: "" });
  const [error, setError] = useState("");
  const [boucher, setBoucher] = useState(null);

  const ciclarEstadoMesa = (numero) => {
    const actual = estadoMesas[numero] || "libre";
    if (actual === "ocupada") return; // se controla automáticamente desde Mesero al abrir/cerrar cuenta
    const siguiente = actual === "libre" ? "reservada" : "libre";
    saveEstadoMesas({ ...estadoMesas, [numero]: siguiente });
  };

  const cuentasAbiertas = cuentas.filter((c) => c.abierta);
  const totalCuenta = (cuenta) => comandas.filter((c) => c.cuentaId === cuenta.id).reduce((s, c) => s + c.total, 0);

  const cerrarCuenta = (cuenta) => {
    const total = totalCuenta(cuenta);
    const itemsCuenta = comandas.filter((c) => c.cuentaId === cuenta.id).flatMap((c) => c.items);
    const horaCierre = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
    saveCuentas(cuentas.map((c) => (c.id === cuenta.id ? { ...c, abierta: false, total, horaCierre } : c)));
    saveEstadoMesas({ ...estadoMesas, [cuenta.mesa]: "libre" });
    setBoucher({ ...cuenta, total, items: itemsCuenta, horaCierre });
  };

  const reservasDelDia = reservas
    .filter((r) => r.fecha === fechaVer)
    .sort((a, b) => a.hora.localeCompare(b.hora));

  const crearReserva = () => {
    if (!form.hora) {
      setError("Elige un horario.");
      return;
    }
    if (!form.nombre.trim()) {
      setError("Escribe el nombre del cliente.");
      return;
    }
    if (!form.personas || Number(form.personas) <= 0) {
      setError("Indica cuántas personas.");
      return;
    }
    setError("");
    const nueva = {
      id: uid(),
      mesa: Number(form.mesa),
      fecha: form.fecha,
      hora: form.hora,
      personas: Number(form.personas),
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      notas: form.notas.trim(),
      estatus: "pendiente",
    };
    saveReservas([...reservas, nueva]);
    setForm({ ...form, hora: "", nombre: "", telefono: "", notas: "" });
  };

  const cambiarEstatus = (id, estatus) => {
    saveReservas(reservas.map((r) => (r.id === id ? { ...r, estatus } : r)));
  };
  const eliminarReserva = (id) => saveReservas(reservas.filter((r) => r.id !== id));

  return (
    <div>
      <p style={{ fontSize: 13, fontWeight: 500, color: accent.icon, letterSpacing: 0.3, margin: "0 0 8px" }}>Mapa de mesas</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 8, marginBottom: 20 }}>
        {mesas.map((m) => {
          const estado = estadoMesas[m.numero] || "libre";
          const e = ESTADOS_MESA[estado];
          return (
            <button
              key={m.id}
              onClick={() => ciclarEstadoMesa(m.numero)}
              style={{ background: e.bg, border: `0.5px solid ${e.dot}55`, borderRadius: 12, padding: "0.7rem 0.4rem", textAlign: "center" }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: e.text }}>Mesa {m.numero}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: e.dot }} />
                <span style={{ fontSize: 10, color: e.text }}>{e.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "-12px 0 20px" }}>Toca una mesa para cambiar su estatus (libre ↔ reservada). Las mesas ocupadas se liberan al cerrar la cuenta.</p>

      <p style={{ fontSize: 13, fontWeight: 500, color: accent.icon, letterSpacing: 0.3, margin: "0 0 8px" }}>Cuentas abiertas ({cuentasAbiertas.length})</p>
      {cuentasAbiertas.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>No hay cuentas abiertas.</p>}
      {cuentasAbiertas.map((c) => (
        <div key={c.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "0.9rem", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Mesa {c.mesa} · {c.responsable}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0" }}>Mesero: {c.mesero} · abierta {c.horaApertura}</p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{money(totalCuenta(c))}</span>
          </div>
          <button onClick={() => cerrarCuenta(c)} style={{ width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            Cerrar cuenta ↗
          </button>
        </div>
      ))}

      {boucher && (
        <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginBottom: 20 }}>
          <p style={{ fontWeight: 600, margin: "0 0 2px" }}>Boucher — Mesa {boucher.mesa}</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 2px" }}>{boucher.responsable} · Mesero: {boucher.mesero}</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0 }}>{boucher.fecha} · {boucher.horaApertura} - {boucher.horaCierre}</p>
          <div style={{ borderTop: "0.5px dashed var(--border)", margin: "10px 0" }} />
          {boucher.items.map((i, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "2px 0" }}>
              <span>{i.cant}x {i.nombre}</span><span>{money(i.precio * i.cant)}</span>
            </div>
          ))}
          <div style={{ borderTop: "0.5px dashed var(--border)", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}><span>Total</span><span>{money(boucher.total)}</span></div>
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
            La impresión en una impresora de red requiere un servidor de impresión conectado a esta app; por ahora el boucher se muestra en pantalla.
          </p>
          <button onClick={() => setBoucher(null)} style={{ width: "100%", marginTop: 8 }}>Cerrar</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Ver reservaciones del</label>
        <input type="date" value={fechaVer} onChange={(e) => setFechaVer(e.target.value)} style={{ fontSize: 13 }} />
      </div>

      {reservasDelDia.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>Sin reservaciones para este día.</p>}

      {reservasDelDia.map((r) => (
        <div key={r.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "0.9rem", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.hora}</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}> · Mesa {r.mesa} · {r.personas} {r.personas === 1 ? "persona" : "personas"}</span>
            </div>
            <ReservaBadge estatus={r.estatus} />
          </div>
          <p style={{ fontSize: 13, margin: "2px 0" }}>{r.nombre}{r.telefono && ` · ${r.telefono}`}</p>
          {r.notas && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0" }}>{r.notas}</p>}
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {r.estatus !== "confirmada" && (
              <button onClick={() => cambiarEstatus(r.id, "confirmada")} style={{ flex: 1, fontSize: 12, padding: "6px 0", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 8 }}>
                Confirmar
              </button>
            )}
            {r.estatus !== "cancelada" && (
              <button onClick={() => cambiarEstatus(r.id, "cancelada")} style={{ flex: 1, fontSize: 12, padding: "6px 0" }}>
                Cancelar
              </button>
            )}
            <button onClick={() => eliminarReserva(r.id)} style={{ padding: "6px 10px" }}>
              <i className="ti ti-trash" style={{ fontSize: 13, color: "var(--text-danger)" }} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "20px 0 8px" }}>Nueva reservación</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
          <select value={form.mesa} onChange={(e) => setForm({ ...form, mesa: e.target.value })} style={{ fontSize: 13 }}>
            {mesas.map((m) => <option key={m.id} value={m.numero}>Mesa {m.numero}</option>)}
          </select>
          <input type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} style={{ fontSize: 13 }} />
          <input type="time" value={form.hora} onChange={(e) => setForm({ ...form, hora: e.target.value })} style={{ fontSize: 13 }} />
        </div>
        <input type="number" min="1" placeholder="Número de personas" value={form.personas} onChange={(e) => setForm({ ...form, personas: e.target.value })} />
        <input placeholder="Nombre del cliente" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Teléfono (opcional)" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
        <input placeholder="Notas (ej. mesa junto a la ventana)" value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
        {error && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{error}</p>}
        <button onClick={crearReserva} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
          Agendar reservación ↗
        </button>
      </div>
    </div>
  );
}

// ---------- COCINA ----------
function Cocina({ comandas, saveCom, inventario, saveInv, setAlertaStock, accent }) {
  const [vista, setVista] = useState("activas");
  const activas = comandas.filter((c) => c.estado !== "entregado" && c.fecha === today());
  const historial = comandas.filter((c) => c.estado === "entregado" && c.fecha === today());
  const avanzar = (id) => {
    const orden = ["pendiente", "entregado"];
    const comanda = comandas.find((c) => c.id === id);
    if (!comanda) return;
    const nuevoEstado = orden[orden.indexOf(comanda.estado) + 1] || comanda.estado;
    saveCom(comandas.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)));

    if (nuevoEstado === "entregado") {
      // El inventario se descuenta hasta que el platillo se entrega, no al enviarse la comanda.
      const invActualizado = inventario.map((inv) => {
        const pedido = comanda.items.find((i) => i.platilloId === inv.platilloId);
        return pedido ? { ...inv, stock: Math.max(0, inv.stock - pedido.cant) } : inv;
      });
      saveInv(invActualizado);

      const quedanEnUno = invActualizado.filter(
        (inv) => inv.stock === 1 && comanda.items.some((i) => i.platilloId === inv.platilloId)
      );
      if (quedanEnUno.length > 0) {
        setAlertaStock((prev) => Array.from(new Set([...(prev || []), ...quedanEnUno.map((inv) => inv.nombre)])));
      }
    }
  };

  const lista = vista === "activas" ? activas : historial;

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[{ id: "activas", label: `Activas (${activas.length})` }, { id: "historial", label: `Historial (${historial.length})` }].map((v) => (
          <button
            key={v.id}
            onClick={() => setVista(v.id)}
            style={{
              flex: 1,
              fontSize: 13,
              padding: "8px 10px",
              borderRadius: "var(--radius)",
              background: vista === v.id ? accent.solid : "var(--surface-1)",
              color: vista === v.id ? "#fff" : "var(--text-secondary)",
              border: vista === v.id ? `0.5px solid ${accent.solid}` : "0.5px solid var(--border)",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {lista.length === 0 && (
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          {vista === "activas" ? "No hay comandas activas." : "Aún no hay pedidos entregados hoy."}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lista.map((c) => (
          <div key={c.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${vista === "activas" ? accent.border : "var(--border)"}`, borderRadius: 14, padding: "1rem", opacity: vista === "historial" ? 0.85 : 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>Mesa {c.mesa} · {c.hora}</span>
              <EstadoBadge estado={c.estado} />
            </div>
            {c.items.map((i, idx) => (
              <div key={idx} style={{ padding: "4px 0" }}>
                <div style={{ fontSize: 14 }}>{i.cant}x {i.nombre}</div>
                {i.comentario && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#712B13",
                      background: "#FAECE7",
                      padding: "3px 8px",
                      borderRadius: 6,
                      marginTop: 2,
                      marginBottom: 2,
                      display: "inline-block",
                    }}
                  >
                    <i className="ti ti-message-2" style={{ fontSize: 12, verticalAlign: -1, marginRight: 4 }} aria-hidden="true" />
                    {i.comentario}
                  </div>
                )}
              </div>
            ))}
            {vista === "activas" && (
              <button onClick={() => avanzar(c.id)} style={{ marginTop: 8, width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
                Marcar como entregado ↗
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- CAJA ----------
const BILLETES_MXN = [500, 200, 100, 50, 20];
const MONEDAS_MXN = [20, 10, 5, 2, 1];
const BILLETES_USD = [100, 50, 20, 10, 5, 1];

function conteoVacio() {
  const z = (arr) => Object.fromEntries(arr.map((d) => [d, ""]));
  return { billetes: z(BILLETES_MXN), monedas: z(MONEDAS_MXN), dolares: z(BILLETES_USD) };
}

function totalesConteo(conteo, tipoCambio) {
  const sum = (obj, denoms) => denoms.reduce((s, d) => s + d * (Number(obj[d]) || 0), 0);
  const totalBilletes = sum(conteo.billetes, BILLETES_MXN);
  const totalMonedas = sum(conteo.monedas, MONEDAS_MXN);
  const totalUSD = sum(conteo.dolares, BILLETES_USD);
  const totalUSDenPesos = totalUSD * (Number(tipoCambio) || 0);
  const totalMXN = totalBilletes + totalMonedas;
  return { totalBilletes, totalMonedas, totalUSD, totalUSDenPesos, totalMXN, totalGeneral: totalMXN + totalUSDenPesos };
}

function ConteoDenominaciones({ conteo, setConteo, accent }) {
  const setCant = (grupo, denom, valor) => {
    setConteo({ ...conteo, [grupo]: { ...conteo[grupo], [denom]: valor } });
  };
  const Fila = ({ grupo, denom, prefijo }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
      <span style={{ fontSize: 13 }}>{prefijo}{denom}</span>
      <input
        type="number"
        min="0"
        placeholder="0"
        value={conteo[grupo][denom]}
        onChange={(e) => setCant(grupo, denom, e.target.value)}
        style={{ width: 70, fontSize: 13, padding: "4px 6px" }}
      />
    </div>
  );
  return (
    <div>
      <p style={{ fontSize: 12, fontWeight: 500, color: accent.icon, textTransform: "uppercase", letterSpacing: 0.4, margin: "10px 0 4px" }}>Billetes MXN</p>
      {BILLETES_MXN.map((d) => <Fila key={d} grupo="billetes" denom={d} prefijo="$" />)}
      <p style={{ fontSize: 12, fontWeight: 500, color: accent.icon, textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 4px" }}>Monedas MXN</p>
      {MONEDAS_MXN.map((d) => <Fila key={d} grupo="monedas" denom={d} prefijo="$" />)}
      <p style={{ fontSize: 12, fontWeight: 500, color: accent.icon, textTransform: "uppercase", letterSpacing: 0.4, margin: "14px 0 4px" }}>Dólares</p>
      {BILLETES_USD.map((d) => <Fila key={d} grupo="dolares" denom={d} prefijo="US$" />)}
    </div>
  );
}

function Caja({ comandas, cortes, saveCortes, aperturas, saveAperturas, accent }) {
  const deHoy = comandas.filter((c) => c.fecha === today());
  const ventaEsperada = deHoy.reduce((s, c) => s + c.total, 0);
  const yaCerrado = cortes.find((c) => c.fecha === today());
  const aperturaHoy = aperturas.find((a) => a.fecha === today());

  const [verMesas, setVerMesas] = useState(false);
  const [mesaAbierta, setMesaAbierta] = useState(null);

  const [conteoApertura, setConteoApertura] = useState(conteoVacio());
  const [tcApertura, setTcApertura] = useState("");

  const [conteoCierre, setConteoCierre] = useState(conteoVacio());
  const [tcCierre, setTcCierre] = useState("");
  const [verCierre, setVerCierre] = useState(false);

  const porMesa = {};
  deHoy.forEach((c) => {
    (porMesa[c.mesa] = porMesa[c.mesa] || []).push(c);
  });
  const mesasOrdenadas = Object.keys(porMesa).sort((a, b) => Number(a) - Number(b));

  const guardarApertura = () => {
    const t = totalesConteo(conteoApertura, tcApertura);
    const apertura = {
      id: uid(),
      fecha: today(),
      conteo: conteoApertura,
      tipoCambio: Number(tcApertura) || 0,
      ...t,
      hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    saveAperturas([apertura, ...aperturas]);
  };

  const totalesCierre = totalesConteo(conteoCierre, tcCierre || aperturaHoy?.tipoCambio || 0);
  const esperadoEnCaja = (aperturaHoy?.totalGeneral || 0) + ventaEsperada;
  const diferencia = totalesCierre.totalGeneral - esperadoEnCaja;

  const hacerCorte = () => {
    const corte = {
      id: uid(),
      fecha: today(),
      ventaEsperada,
      comandasCount: deHoy.length,
      apertura: aperturaHoy?.totalGeneral || 0,
      conteoCierre,
      tipoCambioCierre: Number(tcCierre) || aperturaHoy?.tipoCambio || 0,
      ...totalesCierre,
      contado: totalesCierre.totalGeneral,
      esperado: esperadoEnCaja,
      diferencia,
      hora: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
    };
    saveCortes([corte, ...cortes]);
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12, marginBottom: 16 }}>
        <div style={{ background: accent.bg, borderRadius: 14, padding: "1rem" }}>
          <p style={{ fontSize: 13, color: accent.icon, margin: 0, opacity: 0.8 }}>Venta esperada</p>
          <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color: accent.icon }}>{money(ventaEsperada)}</p>
        </div>
        <div style={{ background: accent.bg, borderRadius: 14, padding: "1rem" }}>
          <p style={{ fontSize: 13, color: accent.icon, margin: 0, opacity: 0.8 }}>Comandas</p>
          <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color: accent.icon }}>{deHoy.length}</p>
        </div>
      </div>

      {/* Comandas por mesa */}
      <button onClick={() => setVerMesas(!verMesas)} style={{ width: "100%", textAlign: "left", padding: "10px 0", background: "transparent", border: "none", borderTop: "0.5px solid var(--border)", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          <i className={`ti ti-chevron-${verMesas ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true" />
          Comandas por mesa ({mesasOrdenadas.length} mesas hoy)
        </span>
      </button>
      {verMesas && (
        <div style={{ marginBottom: 16 }}>
          {mesasOrdenadas.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Sin comandas hoy.</p>}
          {mesasOrdenadas.map((mesa) => {
            const items = porMesa[mesa];
            const totalMesa = items.reduce((s, c) => s + c.total, 0);
            const abierta = mesaAbierta === mesa;
            return (
              <div key={mesa} style={{ borderBottom: "0.5px solid var(--border)" }}>
                <button onClick={() => setMesaAbierta(abierta ? null : mesa)} style={{ width: "100%", textAlign: "left", padding: "8px 0", background: "transparent", border: "none", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13 }}>
                    <i className={`ti ti-chevron-${abierta ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6, color: "var(--text-muted)" }} aria-hidden="true" />
                    Mesa {mesa} · {items.length} comanda{items.length > 1 ? "s" : ""}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{money(totalMesa)}</span>
                </button>
                {abierta && (
                  <div style={{ padding: "0 0 8px 19px" }}>
                    {items.map((c) => (
                      <div key={c.id} style={{ fontSize: 12, color: "var(--text-secondary)", padding: "3px 0" }}>
                        {c.hora} — {c.items.map((i) => `${i.cant}x ${i.nombre}`).join(", ")} · {money(c.total)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Apertura de caja */}
      {!aperturaHoy ? (
        <div style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>Inicio de caja</p>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 8px" }}>Cuenta el fondo con el que arrancas el día, por denominación.</p>
          <ConteoDenominaciones conteo={conteoApertura} setConteo={setConteoApertura} accent={accent} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Tipo de cambio (MXN por USD)</label>
            <input type="number" value={tcApertura} onChange={(e) => setTcApertura(e.target.value)} placeholder="0.00" style={{ width: 80, fontSize: 13 }} />
          </div>
          <div style={{ borderTop: "0.5px solid var(--border)", marginTop: 10, paddingTop: 8, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total MXN</span><span>{money(totalesConteo(conteoApertura, tcApertura).totalMXN)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total USD</span><span>US${totalesConteo(conteoApertura, tcApertura).totalUSD.toFixed(2)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, marginTop: 4 }}><span>Total fondo inicial</span><span>{money(totalesConteo(conteoApertura, tcApertura).totalGeneral)}</span></div>
          </div>
          <button onClick={guardarApertura} style={{ width: "100%", marginTop: 12, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            Guardar inicio de caja ↗
          </button>
        </div>
      ) : (
        <div style={{ background: accent.bg, color: accent.icon, padding: "0.75rem 1rem", borderRadius: 12, fontSize: 13, marginBottom: 16 }}>
          Caja iniciada hoy a las {aperturaHoy.hora} con {money(aperturaHoy.totalGeneral)} de fondo
        </div>
      )}

      {/* Cierre de caja */}
      {yaCerrado ? (
        <div style={{ background: accent.bg, color: accent.icon, padding: "0.75rem 1rem", borderRadius: 12, fontSize: 14 }}>
          Caja cerrada hoy a las {yaCerrado.hora} · contado {money(yaCerrado.contado)} · diferencia {money(yaCerrado.diferencia)}
        </div>
      ) : aperturaHoy ? (
        <div>
          <button onClick={() => setVerCierre(!verCierre)} style={{ width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            {verCierre ? "Ocultar cierre" : "Hacer corte de caja"} ↗
          </button>
          {verCierre && (
            <div style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "1rem", marginTop: 10 }}>
              <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 4px" }}>Cierre de caja</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 8px" }}>Cuenta lo que hay en caja al cierre, por denominación.</p>
              <ConteoDenominaciones conteo={conteoCierre} setConteo={setConteoCierre} accent={accent} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <label style={{ fontSize: 12, color: "var(--text-secondary)" }}>Tipo de cambio (MXN por USD)</label>
                <input type="number" value={tcCierre} onChange={(e) => setTcCierre(e.target.value)} placeholder={String(aperturaHoy.tipoCambio || "0.00")} style={{ width: 80, fontSize: 13 }} />
              </div>
              <div style={{ borderTop: "0.5px solid var(--border)", marginTop: 10, paddingTop: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Fondo inicial</span><span>{money(aperturaHoy.totalGeneral)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Venta esperada</span><span>{money(ventaEsperada)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}><span>Esperado en caja</span><span>{money(esperadoEnCaja)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}><span>Contado (MXN + USD)</span><span>{money(totalesCierre.totalGeneral)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 500, marginTop: 4, color: diferencia === 0 ? "var(--text-success)" : diferencia > 0 ? "var(--text-warning)" : "var(--text-danger)" }}>
                  <span>Diferencia</span><span>{money(diferencia)}</span>
                </div>
              </div>
              <button onClick={hacerCorte} style={{ width: "100%", marginTop: 12, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
                Confirmar corte del día ↗
              </button>
            </div>
          )}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Registra el inicio de caja antes de poder hacer el corte.</p>
      )}

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "20px 0 8px" }}>Historial</p>
      {cortes.slice(0, 5).map((c) => (
        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
          <span>{c.fecha}</span>
          <span>{money(c.ventaEsperada)} · dif {money(c.diferencia)}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- INVENTARIO ----------
function Inventario({ inventario, saveInv, empleados, sesionChef, setSesionChef, accent }) {
  const chefs = (empleados || []).filter((e) => e.puesto === "Cocina");

  const [rfcLogin, setRfcLogin] = useState("");
  const [pinLogin, setPinLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [form, setForm] = useState({ nombre: "", unidad: "kg", stock: "", minimo: "", costoUnit: "" });

  const ingresar = () => {
    const encontrado = chefs.find(
      (c) => (c.rfc || "").toUpperCase() === rfcLogin.trim().toUpperCase() && c.contrasena === pinLogin
    );
    if (!encontrado) {
      setErrorLogin("RFC o contraseña incorrectos.");
      return;
    }
    setErrorLogin("");
    setRfcLogin("");
    setPinLogin("");
    setSesionChef({ id: encontrado.id, nombre: encontrado.nombre });
  };

  if (!sesionChef) {
    return (
      <div style={{ maxWidth: 320, margin: "32px auto", textAlign: "center" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: accent.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <i className="ti ti-chef-hat" style={{ fontSize: 22, color: accent.icon }} aria-hidden="true" />
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>Inicio de sesión de chef</p>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>Solo el chef puede modificar el inventario. Ingresa tu RFC y contraseña.</p>
        {chefs.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Aún no hay ningún empleado con puesto Cocina. Ve a Configuración.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <input placeholder="RFC" value={rfcLogin} onChange={(e) => setRfcLogin(e.target.value.toUpperCase())} />
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Contraseña (4 dígitos)"
              value={pinLogin}
              onChange={(e) => setPinLogin(e.target.value.replace(/\D/g, ""))}
            />
            {errorLogin && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{errorLogin}</p>}
            <button onClick={ingresar} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
              Ingresar ↗
            </button>
          </div>
        )}
      </div>
    );
  }

  const agregar = () => {
    if (!form.nombre || !form.stock) return;
    saveInv([...inventario, { id: uid(), nombre: form.nombre, unidad: form.unidad, stock: Number(form.stock), minimo: Number(form.minimo) || 0, costoUnit: Number(form.costoUnit) || 0 }]);
    setForm({ nombre: "", unidad: "kg", stock: "", minimo: "", costoUnit: "" });
  };

  const ajustar = (id, delta) => {
    saveInv(inventario.map((i) => (i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i)));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Chef: <strong style={{ color: "var(--text-primary)" }}>{sesionChef.nombre}</strong>
        </div>
        <button onClick={() => setSesionChef(null)} style={{ fontSize: 12, padding: "4px 10px" }}>Cerrar sesión</button>
      </div>

      {inventario.map((i) => {
        const agotado = i.stock === 0;
        const soloUno = i.stock === 1;
        const bajo = i.stock > 1 && i.stock <= i.minimo;
        return (
          <div key={i.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${soloUno || agotado ? "var(--border-danger)" : bajo ? "var(--border-danger)" : "var(--border)"}`, borderRadius: 14, padding: "0.75rem 1rem", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{i.nombre}</div>
                <div style={{ fontSize: 13, color: soloUno || agotado || bajo ? "var(--text-danger)" : "var(--text-secondary)" }}>
                  {i.stock} {i.unidad} en stock {bajo && "· bajo mínimo"}
                </div>
                {soloUno && (
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-danger)", marginTop: 2 }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: 13, verticalAlign: -2, marginRight: 4 }} aria-hidden="true" />
                    ¡Alerta! Solo existe 1 platillo más
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => ajustar(i.id, -1)} style={{ padding: "4px 10px", borderRadius: 8 }}>-1</button>
                <button onClick={() => ajustar(i.id, 1)} style={{ padding: "4px 10px", borderRadius: 8, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}` }}>+1</button>
              </div>
            </div>
          </div>
        );
      })}

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "16px 0 8px" }}>Agregar producto</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
          <select value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
            <option value="kg">kg</option><option value="l">l</option><option value="pza">pza</option>
          </select>
          <input type="number" placeholder="Stock inicial" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input type="number" placeholder="Mínimo" value={form.minimo} onChange={(e) => setForm({ ...form, minimo: e.target.value })} />
          <input type="number" placeholder="Costo unitario" value={form.costoUnit} onChange={(e) => setForm({ ...form, costoUnit: e.target.value })} />
        </div>
        <button onClick={agregar} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>Agregar al inventario ↗</button>
      </div>
    </div>
  );
}

// ---------- COSTEO ----------
function Costeo({ platillos, saveP, ingredientes, saveIng, gastosOp, saveGastosOp, costeoCfg, saveCosteoCfg, onNavigate, accent }) {
  const [abierto, setAbierto] = useState(null);

  const totalGastosOp = gastosOp.reduce((s, g) => s + g.monto, 0);
  const platillosMes = Number(costeoCfg.platillosMes) || 0;
  const operativoPorPlatillo = platillosMes > 0 ? totalGastosOp / platillosMes : 0;

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
        Toca un platillo para armar o editar su receta.
      </p>
      {operativoPorPlatillo === 0 && (
        <div style={{ background: accent.bg, color: accent.icon, fontSize: 12, padding: "8px 10px", borderRadius: 10, marginBottom: 12 }}>
          Agrega tus gastos operativos y cuántos platillos vendes al mes (al final de esta pestaña) para prorratearlos en cada costeo.
        </div>
      )}
      {platillos.map((p) => {
        const costoIng = p.receta.reduce((s, r) => {
          const ing = ingredientes.find((x) => x.id === r.ingredienteId);
          return s + (ing ? r.cant * ing.costoUnit : 0);
        }, 0);
        const costo = costoIng + operativoPorPlatillo;
        const margen = p.precio - costo;
        const margenPct = p.precio ? (margen / p.precio) * 100 : 0;
        const expandido = abierto === p.id;
        return (
          <div key={p.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "1rem", marginBottom: 10 }}>
            <button
              onClick={() => setAbierto(expandido ? null : p.id)}
              style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: expandido ? 10 : 4 }}>
                <span style={{ fontWeight: 500 }}>
                  <i className={`ti ti-chevron-${expandido ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6, color: "var(--text-muted)" }} aria-hidden="true" />
                  {p.nombre}
                </span>
                <span style={{ color: accent.icon, fontWeight: 500 }}>{money(p.precio)}</span>
              </div>
              {!expandido && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-secondary)", paddingLeft: 19 }}>
                  <span>{p.receta.length === 0 ? "Sin receta" : `${p.receta.length} ingrediente${p.receta.length > 1 ? "s" : ""} · costo ${money(costo)}`}</span>
                  <span style={{ color: margenPct >= 60 ? "var(--text-success)" : margenPct >= 40 ? "var(--text-warning)" : "var(--text-danger)" }}>
                    {margenPct.toFixed(0)}% margen
                  </span>
                </div>
              )}
            </button>

            {expandido && (
              <RecetaEditor
                platillo={p}
                platillos={platillos}
                saveP={saveP}
                ingredientes={ingredientes}
                saveIng={saveIng}
                accent={accent}
                costoIng={costoIng}
                operativoPorPlatillo={operativoPorPlatillo}
                costo={costo}
                margen={margen}
                margenPct={margenPct}
              />
            )}
          </div>
        );
      })}

      <button
        onClick={() => onNavigate("ingredientes")}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", marginBottom: 4, borderRadius: 10, background: "var(--surface-1)" }}
      >
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          <i className="ti ti-carrot" style={{ fontSize: 14, marginRight: 6, verticalAlign: -2 }} aria-hidden="true" />
          Catálogo completo de ingredientes ({ingredientes.length})
        </span>
        <i className="ti ti-arrow-right" style={{ fontSize: 14, color: "var(--text-muted)" }} aria-hidden="true" />
      </button>
      <GastosOperativos
        gastosOp={gastosOp}
        saveGastosOp={saveGastosOp}
        costeoCfg={costeoCfg}
        saveCosteoCfg={saveCosteoCfg}
        totalGastosOp={totalGastosOp}
        operativoPorPlatillo={operativoPorPlatillo}
        accent={accent}
      />
    </div>
  );
}

function GastosOperativos({ gastosOp, saveGastosOp, costeoCfg, saveCosteoCfg, totalGastosOp, operativoPorPlatillo, accent }) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [platillosMesTxt, setPlatillosMesTxt] = useState(String(costeoCfg.platillosMes || ""));

  const agregar = () => {
    if (!nombre.trim() || !monto || Number(monto) <= 0) return;
    saveGastosOp([...gastosOp, { id: uid(), nombre: nombre.trim(), monto: Number(monto) }]);
    setNombre("");
    setMonto("");
  };

  const quitar = (id) => saveGastosOp(gastosOp.filter((g) => g.id !== id));

  const guardarPlatillosMes = () => {
    saveCosteoCfg({ ...costeoCfg, platillosMes: Number(platillosMesTxt) || 0 });
  };

  return (
    <div style={{ marginTop: 4 }}>
      <button onClick={() => setAbierto(!abierto)} style={{ width: "100%", textAlign: "left", padding: "10px 0", background: "transparent", border: "none", borderTop: "0.5px solid var(--border)" }}>
        <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          <i className={`ti ti-chevron-${abierto ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true" />
          Gastos operativos ({gastosOp.length}) — {money(totalGastosOp)}/mes · {money(operativoPorPlatillo)} por platillo
        </span>
      </button>
      {abierto && (
        <div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, background: accent.bg, borderRadius: 10, padding: "0.75rem" }}>
            <label style={{ fontSize: 12, color: accent.icon, flex: 1 }}>Platillos vendidos al mes (estimado)</label>
            <input type="number" value={platillosMesTxt} onChange={(e) => setPlatillosMesTxt(e.target.value)} style={{ width: 70, fontSize: 13 }} />
            <button onClick={guardarPlatillosMes} style={{ padding: "4px 10px", fontSize: 12 }}>Guardar</button>
          </div>

          {gastosOp.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Sin gastos operativos registrados.</p>}
          {gastosOp.map((g) => (
            <div key={g.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
              <span style={{ fontSize: 13 }}>{g.nombre}</span>
              <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 13 }}>{money(g.monto)}/mes</span>
                <i className="ti ti-x" style={{ fontSize: 16, cursor: "pointer", color: "var(--text-danger)" }} onClick={() => quitar(g.id)} aria-hidden="true" />
              </span>
            </div>
          ))}

          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "12px 0 6px" }}>Agregar gasto fijo (renta, luz, agua, gas, sueldos administrativos...)</p>
          <div style={{ display: "flex", gap: 6 }}>
            <input placeholder="Nombre del gasto" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ flex: 1, fontSize: 13 }} />
            <input type="number" placeholder="Monto/mes" value={monto} onChange={(e) => setMonto(e.target.value)} style={{ width: 90, fontSize: 13 }} />
          </div>
          <button onClick={agregar} style={{ width: "100%", marginTop: 6, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10, fontSize: 13 }}>
            Agregar gasto ↗
          </button>
        </div>
      )}
    </div>
  );
}

function RecetaEditor({ platillo, platillos, saveP, ingredientes, saveIng, accent, costoIng, operativoPorPlatillo, costo, margen, margenPct }) {
  const [ingSel, setIngSel] = useState(ingredientes[0]?.id || "");
  const [cant, setCant] = useState("");
  const [precioTxt, setPrecioTxt] = useState(String(platillo.precio));
  const [nuevoIng, setNuevoIng] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [unidadNuevo, setUnidadNuevo] = useState("kg");
  const [costoNuevo, setCostoNuevo] = useState("");
  const [buscarIng, setBuscarIng] = useState("");
  const [error, setError] = useState("");

  const guardarReceta = (nuevaReceta) => {
    saveP(platillos.map((x) => (x.id === platillo.id ? { ...x, receta: nuevaReceta } : x)));
  };

  const agregarLinea = () => {
    if (!ingSel || !cant || Number(cant) <= 0) {
      setError("Elige un ingrediente y una cantidad válida.");
      return;
    }
    setError("");
    const existe = platillo.receta.find((r) => r.ingredienteId === ingSel);
    const nuevaReceta = existe
      ? platillo.receta.map((r) => (r.ingredienteId === ingSel ? { ...r, cant: r.cant + Number(cant) } : r))
      : [...platillo.receta, { ingredienteId: ingSel, cant: Number(cant) }];
    guardarReceta(nuevaReceta);
    setCant("");
  };

  const actualizarCant = (ingredienteId, valor) => {
    guardarReceta(platillo.receta.map((r) => (r.ingredienteId === ingredienteId ? { ...r, cant: Math.max(0, Number(valor) || 0) } : r)));
  };

  const quitarLinea = (ingredienteId) => {
    guardarReceta(platillo.receta.filter((r) => r.ingredienteId !== ingredienteId));
  };

  const guardarPrecio = () => {
    const val = Number(precioTxt);
    if (!precioTxt || val <= 0) {
      setError("El precio de venta debe ser mayor a 0.");
      return;
    }
    setError("");
    saveP(platillos.map((x) => (x.id === platillo.id ? { ...x, precio: val } : x)));
  };

  const crearIngredienteYAgregar = () => {
    if (!nombreNuevo.trim() || !costoNuevo || Number(costoNuevo) <= 0) {
      setError("Completa nombre y costo del nuevo ingrediente.");
      return;
    }
    setError("");
    const nuevo = { id: uid(), nombre: nombreNuevo.trim(), unidad: unidadNuevo, costoUnit: Number(costoNuevo) };
    saveIng([...ingredientes, nuevo]);
    guardarReceta([...platillo.receta, { ingredienteId: nuevo.id, cant: Number(cant) || 1 }]);
    setNombreNuevo("");
    setCostoNuevo("");
    setCant("");
    setIngSel(nuevo.id);
    setNuevoIng(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <label style={{ fontSize: 13, color: "var(--text-secondary)" }}>Precio de venta</label>
        <input type="number" value={precioTxt} onChange={(e) => setPrecioTxt(e.target.value)} style={{ width: 90, fontSize: 13 }} />
        <button onClick={guardarPrecio} style={{ padding: "4px 10px", fontSize: 12 }}>Guardar</button>
      </div>

      {platillo.receta.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 8 }}>Aún no tiene ingredientes en la receta.</p>
      )}

      {platillo.receta.map((r) => {
        const ing = ingredientes.find((x) => x.id === r.ingredienteId);
        if (!ing) return null;
        return (
          <div key={r.ingredienteId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
            <span style={{ fontSize: 13 }}>{ing.nombre}</span>
            <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="number"
                value={r.cant}
                onChange={(e) => actualizarCant(r.ingredienteId, e.target.value)}
                style={{ width: 60, fontSize: 13, padding: "4px 6px" }}
              />
              <span style={{ fontSize: 12, color: "var(--text-secondary)", minWidth: 24 }}>{ing.unidad}</span>
              <span style={{ fontSize: 13, minWidth: 56, textAlign: "right" }}>{money(r.cant * ing.costoUnit)}</span>
              <i className="ti ti-x" style={{ fontSize: 16, cursor: "pointer", color: "var(--text-danger)" }} onClick={() => quitarLinea(r.ingredienteId)} aria-hidden="true" />
            </span>
          </div>
        );
      })}

      <div style={{ borderTop: `0.5px solid ${accent.border}`, marginTop: 8, paddingTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)" }}>
          <span>Costo de ingredientes</span>
          <span>{money(costoIng)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
          <span>Costo operativo prorrateado</span>
          <span>{money(operativoPorPlatillo)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4 }}>
          <span>Costo total</span>
          <span style={{ fontWeight: 500 }}>{money(costo)}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 4, marginBottom: 14 }}>
        <span>Margen</span>
        <span style={{ fontWeight: 500, color: margenPct >= 60 ? "var(--text-success)" : margenPct >= 40 ? "var(--text-warning)" : "var(--text-danger)" }}>
          {money(margen)} ({margenPct.toFixed(0)}%)
        </span>
      </div>

      {!nuevoIng ? (
        <div>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 6px" }}>Agregar ingrediente a la receta</p>
          <input
            placeholder="Buscar en el catálogo..."
            value={buscarIng}
            onChange={(e) => setBuscarIng(e.target.value)}
            style={{ width: "100%", marginBottom: 6, fontSize: 13 }}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <select value={ingSel} onChange={(e) => setIngSel(e.target.value)} style={{ flex: 1, fontSize: 13 }}>
              {ingredientes.length === 0 && <option value="">Sin ingredientes en catálogo</option>}
              {ingredientes
                .filter((ing) => ing.nombre.toLowerCase().includes(buscarIng.toLowerCase()))
                .map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.nombre} ({money(ing.costoUnit)}/{ing.unidad})</option>
                ))}
            </select>
            <input type="number" placeholder="Cant." value={cant} onChange={(e) => setCant(e.target.value)} style={{ width: 64, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
            <button onClick={agregarLinea} disabled={ingredientes.length === 0} style={{ flex: 1, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10, fontSize: 13 }}>
              Agregar ↗
            </button>
            <button onClick={() => setNuevoIng(true)} style={{ flex: 1, fontSize: 13 }}>+ Nuevo ingrediente</button>
          </div>
        </div>
      ) : (
        <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "0.75rem" }}>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 6px" }}>Nuevo ingrediente en el catálogo</p>
          <input placeholder="Nombre (ej. Jurel fresco)" value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} style={{ width: "100%", marginBottom: 6, fontSize: 13 }} />
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <select value={unidadNuevo} onChange={(e) => setUnidadNuevo(e.target.value)} style={{ fontSize: 13 }}>
              <option value="kg">kg</option><option value="l">l</option><option value="pza">pza</option>
            </select>
            <input type="number" placeholder="Costo por unidad" value={costoNuevo} onChange={(e) => setCostoNuevo(e.target.value)} style={{ flex: 1, fontSize: 13 }} />
            <input type="number" placeholder="Cant. en receta" value={cant} onChange={(e) => setCant(e.target.value)} style={{ width: 70, fontSize: 13 }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={crearIngredienteYAgregar} style={{ flex: 1, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10, fontSize: 13 }}>Crear y agregar ↗</button>
            <button onClick={() => setNuevoIng(false)} style={{ flex: 1, fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      {error && <p style={{ fontSize: 12, color: "var(--text-danger)", marginTop: 8 }}>{error}</p>}
    </div>
  );
}

function Ingredientes({ ingredientes, saveIng, accent }) {
  const [busqueda, setBusqueda] = useState("");
  const [catFiltro, setCatFiltro] = useState("Todas");
  const [catAbierta, setCatAbierta] = useState(null);
  const [form, setForm] = useState({ nombre: "", unidad: "kg", categoria: "Verduras", costoUnit: "" });
  const [error, setError] = useState("");

  const categorias = ["Todas", ...Array.from(new Set(ingredientes.map((i) => i.categoria || "Otros"))).sort()];

  const filtrados = ingredientes.filter((i) => {
    const coincideBusqueda = i.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCat = catFiltro === "Todas" || (i.categoria || "Otros") === catFiltro;
    return coincideBusqueda && coincideCat;
  });

  const porCategoria = {};
  filtrados.forEach((i) => {
    const cat = i.categoria || "Otros";
    (porCategoria[cat] = porCategoria[cat] || []).push(i);
  });
  const categoriasOrdenadas = Object.keys(porCategoria).sort();

  const actualizarCosto = (id, valor) => {
    saveIng(ingredientes.map((i) => (i.id === id ? { ...i, costoUnit: Math.max(0, Number(valor) || 0) } : i)));
  };
  const actualizarUnidad = (id, unidad) => {
    saveIng(ingredientes.map((i) => (i.id === id ? { ...i, unidad } : i)));
  };
  const eliminar = (id) => saveIng(ingredientes.filter((i) => i.id !== id));

  const agregar = () => {
    if (!form.nombre.trim()) {
      setError("Escribe el nombre del producto.");
      return;
    }
    if (ingredientes.some((i) => i.nombre.toLowerCase() === form.nombre.trim().toLowerCase())) {
      setError("Ese producto ya existe en el catálogo.");
      return;
    }
    setError("");
    saveIng([...ingredientes, { id: uid(), nombre: form.nombre.trim(), unidad: form.unidad, categoria: form.categoria, costoUnit: Number(form.costoUnit) || 0 }]);
    setForm({ ...form, nombre: "", costoUnit: "" });
  };

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 12px" }}>
        {ingredientes.length} productos en el catálogo. Edita precio y unidad aquí — se reflejan solos en el costeo de cada platillo.
      </p>

      <input
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 12, WebkitOverflowScrolling: "touch" }}>
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCatFiltro(c)}
            style={{
              flex: "0 0 auto",
              fontSize: 12,
              padding: "6px 10px",
              borderRadius: 999,
              background: catFiltro === c ? accent.solid : "var(--surface-1)",
              color: catFiltro === c ? "#fff" : "var(--text-secondary)",
              border: catFiltro === c ? `0.5px solid ${accent.solid}` : "0.5px solid var(--border)",
              whiteSpace: "nowrap",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {categoriasOrdenadas.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No se encontraron productos.</p>
      )}

      {categoriasOrdenadas.map((cat) => {
        const items = porCategoria[cat];
        const abierta = catAbierta === cat || busqueda.trim() !== "";
        return (
          <div key={cat} style={{ marginBottom: 8 }}>
            <button
              onClick={() => setCatAbierta(catAbierta === cat ? null : cat)}
              style={{ width: "100%", textAlign: "left", padding: "8px 0", background: "transparent", border: "none", borderTop: "0.5px solid var(--border)" }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: accent.icon }}>
                <i className={`ti ti-chevron-${abierta ? "down" : "right"}`} style={{ fontSize: 13, marginRight: 6 }} aria-hidden="true" />
                {cat} ({items.length})
              </span>
            </button>
            {abierta && (
              <div>
                {items.map((i) => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--border)" }}>
                    <span style={{ fontSize: 13, flex: 1 }}>{i.nombre}</span>
                    <select value={i.unidad} onChange={(e) => actualizarUnidad(i.id, e.target.value)} style={{ fontSize: 12, width: 62, marginRight: 6 }}>
                      <option value="kg">kg</option><option value="l">l</option><option value="pza">pza</option>
                    </select>
                    <input
                      type="number"
                      value={i.costoUnit}
                      onChange={(e) => actualizarCosto(i.id, e.target.value)}
                      style={{ width: 70, fontSize: 13, padding: "4px 6px" }}
                    />
                    <i className="ti ti-x" style={{ fontSize: 16, marginLeft: 6, cursor: "pointer", color: "var(--text-danger)" }} onClick={() => eliminar(i.id)} aria-hidden="true" />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "20px 0 8px" }}>Agregar producto al catálogo</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Nombre del producto" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
          <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
            {categorias.filter((c) => c !== "Todas").map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="Otros">Otros</option>
          </select>
          <select value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })}>
            <option value="kg">kg</option><option value="l">l</option><option value="pza">pza</option>
          </select>
          <input type="number" placeholder="Costo por unidad" value={form.costoUnit} onChange={(e) => setForm({ ...form, costoUnit: e.target.value })} />
        </div>
        {error && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{error}</p>}
        <button onClick={agregar} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>Agregar al catálogo ↗</button>
      </div>
    </div>
  );
}

// ---------- NOMINA ----------
function Nomina({ empleados, turnos, saveTur, accent }) {
  const activo = (empId) => turnos.find((t) => t.empleadoId === empId && !t.salida);

  const checarEntrada = (empId) => {
    saveTur([...turnos, { id: uid(), empleadoId: empId, entrada: Date.now(), salida: null, fecha: today() }]);
  };
  const checarSalida = (empId) => {
    saveTur(turnos.map((t) => (t.empleadoId === empId && !t.salida ? { ...t, salida: Date.now() } : t)));
  };

  const horasSemana = (empId) => {
    const ahora = Date.now();
    const semanaMs = 7 * 24 * 60 * 60 * 1000;
    return turnos
      .filter((t) => t.empleadoId === empId && ahora - t.entrada < semanaMs)
      .reduce((s, t) => s + ((t.salida || ahora) - t.entrada) / 3600000, 0);
  };

  return (
    <div>
      {empleados.map((e) => {
        const enTurno = activo(e.id);
        const horas = horasSemana(e.id);
        return (
          <div key={e.id} style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "1rem", marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 500 }}>{e.nombre}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{e.puesto} · {money(e.tarifaHora)}/hr</div>
                {e.rfc && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>RFC: {e.rfc}</div>}
              </div>
              {enTurno ? (
                <span style={{ fontSize: 12, color: accent.icon, background: accent.bg, padding: "2px 9px", borderRadius: 999, fontWeight: 500, height: "fit-content" }}>
                  <i className="ti ti-clock" style={{ fontSize: 13, verticalAlign: -2 }} aria-hidden="true" /> En turno
                </span>
              ) : (
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Fuera</span>
              )}
            </div>
            <div style={{ fontSize: 13, marginTop: 8, color: "var(--text-secondary)" }}>
              Horas semana: {horas.toFixed(1)} · a pagar: {money(horas * e.tarifaHora)}
            </div>
            <button onClick={() => (enTurno ? checarSalida(e.id) : checarEntrada(e.id))} style={{ marginTop: 8, width: "100%", background: enTurno ? "var(--surface-1)" : accent.solid, color: enTurno ? "var(--text-primary)" : "#fff", border: enTurno ? "0.5px solid var(--border)" : `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
              {enTurno ? "Registrar salida" : "Registrar entrada"} ↗
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ---------- PROVEEDORES ----------
function Proveedores({ proveedores, cxp, saveCxp, accent }) {
  const [form, setForm] = useState({ proveedorId: proveedores[0]?.id || "", monto: "", vence: "", concepto: "" });

  const agregar = () => {
    if (!form.proveedorId || !form.monto || !form.vence) return;
    saveCxp([...cxp, { id: uid(), ...form, monto: Number(form.monto), pagado: false }]);
    setForm({ ...form, monto: "", vence: "", concepto: "" });
  };

  const pagar = (id) => saveCxp(cxp.map((c) => (c.id === id ? { ...c, pagado: true } : c)));

  const pendientes = cxp.filter((c) => !c.pagado);
  const totalPendiente = pendientes.reduce((s, c) => s + c.monto, 0);

  return (
    <div>
      <div style={{ background: accent.bg, borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: accent.icon, margin: 0, opacity: 0.8 }}>Total por pagar</p>
        <p style={{ fontSize: 24, fontWeight: 500, margin: 0, color: accent.icon }}>{money(totalPendiente)}</p>
      </div>

      {pendientes.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Sin cuentas pendientes.</p>
      ) : (
        pendientes.map((c) => {
          const prov = proveedores.find((p) => p.id === c.proveedorId);
          const vencida = new Date(c.vence) < new Date();
          return (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 14 }}>{prov?.nombre || "—"} {c.concepto && `· ${c.concepto}`}</div>
                <div style={{ fontSize: 12, color: vencida ? "var(--text-danger)" : "var(--text-secondary)" }}>Vence {c.vence}{vencida && " · vencida"}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 14 }}>{money(c.monto)}</span>
                <button onClick={() => pagar(c.id)} style={{ padding: "4px 10px", fontSize: 12, borderRadius: 8, background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}` }}>Pagar</button>
              </div>
            </div>
          );
        })
      )}

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "20px 0 8px" }}>Nueva cuenta por pagar</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <select value={form.proveedorId} onChange={(e) => setForm({ ...form, proveedorId: e.target.value })}>
          {proveedores.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <input placeholder="Concepto (opcional)" value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
          <input type="number" placeholder="Monto" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} />
          <input type="date" value={form.vence} onChange={(e) => setForm({ ...form, vence: e.target.value })} />
        </div>
        <button onClick={agregar} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>Registrar cuenta ↗</button>
      </div>
    </div>
  );
}

// ---------- FACTURACION (CFDI / SAT) ----------
const USO_CFDI = [
  { clave: "G01", label: "G01 — Adquisición de mercancías" },
  { clave: "G03", label: "G03 — Gastos en general" },
  { clave: "P01", label: "P01 — Por definir" },
];
const REGIMEN_FISCAL = [
  { clave: "601", label: "601 — General de Ley Personas Morales" },
  { clave: "612", label: "612 — Personas Físicas con Act. Empresariales" },
  { clave: "621", label: "621 — Incorporación Fiscal" },
  { clave: "626", label: "626 — Régimen Simplificado de Confianza (RESICO)" },
];
const FORMA_PAGO = [
  { clave: "01", label: "01 — Efectivo" },
  { clave: "03", label: "03 — Transferencia electrónica" },
  { clave: "04", label: "04 — Tarjeta de crédito" },
  { clave: "28", label: "28 — Tarjeta de débito" },
];
const METODO_PAGO = [
  { clave: "PUE", label: "PUE — Pago en una sola exhibición" },
  { clave: "PPD", label: "PPD — Pago en parcialidades o diferido" },
];

function FacturaBadge({ estatus }) {
  const map = {
    timbrada: { bg: "#EAF3DE", text: "#27500A", label: "Timbrada (simulada)" },
    cancelada: { bg: "var(--surface-1)", text: "var(--text-muted)", label: "Cancelada" },
  };
  const s = map[estatus] || map.timbrada;
  return <span style={{ fontSize: 11, background: s.bg, color: s.text, padding: "2px 8px", borderRadius: 999, fontWeight: 500 }}>{s.label}</span>;
}

function Facturacion({ comandas, datosFiscales, saveDatosFiscales, facturas, saveFacturas, accent }) {
  const [fiscal, setFiscal] = useState(datosFiscales);
  const [errorFiscal, setErrorFiscal] = useState("");

  const [comandaSel, setComandaSel] = useState("");
  const [form, setForm] = useState({
    rfc: "", razonSocial: "", correo: "",
    usoCFDI: USO_CFDI[0].clave, formaPago: FORMA_PAGO[0].clave, metodoPago: METODO_PAGO[0].clave,
    total: "",
  });
  const [error, setError] = useState("");

  const emisorListo = datosFiscales.rfc && datosFiscales.razonSocial && datosFiscales.regimenFiscal && datosFiscales.codigoPostal;

  const comandasFacturables = comandas.slice(0, 30);

  const guardarFiscal = () => {
    if (!fiscal.rfc.trim() || fiscal.rfc.trim().length < 12) {
      setErrorFiscal("El RFC del negocio no parece válido (12-13 caracteres).");
      return;
    }
    if (!fiscal.razonSocial.trim() || !fiscal.regimenFiscal || !fiscal.codigoPostal.trim()) {
      setErrorFiscal("Completa razón social, régimen fiscal y código postal.");
      return;
    }
    setErrorFiscal("");
    saveDatosFiscales({ ...fiscal, rfc: fiscal.rfc.trim().toUpperCase() });
  };

  const elegirComanda = (id) => {
    setComandaSel(id);
    const c = comandas.find((x) => x.id === id);
    if (c) setForm({ ...form, total: String(c.total) });
  };

  const total = Number(form.total) || 0;
  const subtotal = total / 1.16;
  const iva = total - subtotal;

  const generarFactura = () => {
    if (!emisorListo) {
      setError("Primero completa los datos fiscales de tu negocio.");
      return;
    }
    if (!form.rfc.trim() || form.rfc.trim().length < 12) {
      setError("El RFC del cliente no parece válido.");
      return;
    }
    if (!form.razonSocial.trim()) {
      setError("Escribe la razón social del cliente.");
      return;
    }
    if (!total || total <= 0) {
      setError("Indica el total del consumo.");
      return;
    }
    setError("");
    const folio = `DEMO-${String(facturas.length + 1).padStart(4, "0")}`;
    const uuidSimulado = "SIMULADO-" + uid() + "-" + uid();
    const nueva = {
      id: uid(),
      folio,
      uuidSimulado,
      fecha: today(),
      rfc: form.rfc.trim().toUpperCase(),
      razonSocial: form.razonSocial.trim(),
      correo: form.correo.trim(),
      usoCFDI: form.usoCFDI,
      formaPago: form.formaPago,
      metodoPago: form.metodoPago,
      subtotal,
      iva,
      total,
      estatus: "timbrada",
    };
    saveFacturas([nueva, ...facturas]);
    setForm({ ...form, rfc: "", razonSocial: "", correo: "", total: "" });
    setComandaSel("");
  };

  const cancelarFactura = (id) => saveFacturas(facturas.map((f) => (f.id === id ? { ...f, estatus: "cancelada" } : f)));

  return (
    <div>
      <div style={{ display: "flex", gap: 8, background: accent.bg, color: accent.icon, padding: "10px 12px", borderRadius: 12, marginBottom: 16, fontSize: 12, lineHeight: 1.5 }}>
        <i className="ti ti-info-circle" style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
        <span>
          Esta sección genera facturas <strong>simuladas</strong> para probar el flujo. Un CFDI con validez fiscal real ante el SAT requiere timbrarse a través de un PAC (Proveedor Autorizado de Certificación) — se conecta cuando pasemos a producción.
        </span>
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Datos fiscales de tu negocio (emisor)</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input placeholder="RFC del negocio" value={fiscal.rfc} onChange={(e) => setFiscal({ ...fiscal, rfc: e.target.value.toUpperCase() })} />
          <input placeholder="Razón social" value={fiscal.razonSocial} onChange={(e) => setFiscal({ ...fiscal, razonSocial: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
            <select value={fiscal.regimenFiscal} onChange={(e) => setFiscal({ ...fiscal, regimenFiscal: e.target.value })} style={{ fontSize: 13 }}>
              <option value="">Régimen fiscal</option>
              {REGIMEN_FISCAL.map((r) => <option key={r.clave} value={r.clave}>{r.label}</option>)}
            </select>
            <input placeholder="Código postal" value={fiscal.codigoPostal} onChange={(e) => setFiscal({ ...fiscal, codigoPostal: e.target.value })} />
          </div>
          {errorFiscal && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{errorFiscal}</p>}
          <button onClick={guardarFiscal} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>Guardar datos fiscales ↗</button>
        </div>
        {!emisorListo && (
          <p style={{ fontSize: 11, color: "var(--text-danger)", marginTop: 8 }}>Faltan datos fiscales del negocio para poder generar facturas.</p>
        )}
      </div>

      <div style={{ background: "var(--surface-2)", border: `0.5px solid ${accent.border}`, borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Nueva factura para cliente</p>

        {comandasFacturables.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 4 }}>Ligar a una comanda (opcional)</label>
            <select value={comandaSel} onChange={(e) => elegirComanda(e.target.value)} style={{ width: "100%", fontSize: 13 }}>
              <option value="">Sin ligar — capturar monto manual</option>
              {comandasFacturables.map((c) => (
                <option key={c.id} value={c.id}>{c.fecha} · Mesa {c.mesa} · {c.hora} · {money(c.total)}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input placeholder="RFC del cliente" value={form.rfc} onChange={(e) => setForm({ ...form, rfc: e.target.value.toUpperCase() })} />
          <input placeholder="Razón social / nombre del cliente" value={form.razonSocial} onChange={(e) => setForm({ ...form, razonSocial: e.target.value })} />
          <input type="email" placeholder="Correo (opcional)" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
            <select value={form.usoCFDI} onChange={(e) => setForm({ ...form, usoCFDI: e.target.value })} style={{ fontSize: 13 }}>
              {USO_CFDI.map((u) => <option key={u.clave} value={u.clave}>{u.label}</option>)}
            </select>
            <select value={form.formaPago} onChange={(e) => setForm({ ...form, formaPago: e.target.value })} style={{ fontSize: 13 }}>
              {FORMA_PAGO.map((f) => <option key={f.clave} value={f.clave}>{f.label}</option>)}
            </select>
          </div>
          <select value={form.metodoPago} onChange={(e) => setForm({ ...form, metodoPago: e.target.value })} style={{ fontSize: 13 }}>
            {METODO_PAGO.map((m) => <option key={m.clave} value={m.clave}>{m.label}</option>)}
          </select>
          <input type="number" placeholder="Total del consumo (con IVA incluido)" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />

          {total > 0 && (
            <div style={{ background: "var(--surface-1)", borderRadius: 10, padding: "0.6rem 0.75rem", fontSize: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><span>{money(subtotal)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>IVA (16%)</span><span>{money(iva)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginTop: 2 }}><span>Total</span><span>{money(total)}</span></div>
            </div>
          )}

          {error && <p style={{ fontSize: 12, color: "var(--text-danger)", margin: 0 }}>{error}</p>}
          <button onClick={generarFactura} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            Generar factura (timbrado simulado) ↗
          </button>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "0 0 8px" }}>Facturas emitidas ({facturas.length})</p>
      {facturas.length === 0 && <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Aún no has generado facturas.</p>}
      {facturas.map((f) => (
        <div key={f.id} style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 12, padding: "0.75rem 1rem", marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{f.folio}</p>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0" }}>{f.razonSocial} · {f.rfc}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{f.fecha}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{money(f.total)}</p>
              <div style={{ marginTop: 4 }}><FacturaBadge estatus={f.estatus} /></div>
            </div>
          </div>
          {f.estatus !== "cancelada" && (
            <button onClick={() => cancelarFactura(f.id)} style={{ width: "100%", marginTop: 8, fontSize: 12, padding: "6px 0" }}>Cancelar factura</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- CONFIGURACION ----------
function Configuracion({ config, saveConfig, suscripcion, saveSuscripcion, sesion, onCerrarSesion, empleados, saveEmp, accent }) {
  const [nombre, setNombre] = useState(config.nombre || "");
  const [error, setError] = useState("");

  const [formEmp, setFormEmp] = useState({ nombre: "", puesto: PUESTOS[0], rfc: "", contrasena: "", tarifaHora: "" });
  const [errorEmp, setErrorEmp] = useState("");

  const altaEmpleado = () => {
    if (!formEmp.nombre.trim()) {
      setErrorEmp("Escribe el nombre del empleado.");
      return;
    }
    const rfc = formEmp.rfc.trim().toUpperCase();
    if (rfc.length < 12 || rfc.length > 13) {
      setErrorEmp("El RFC debe tener 12 o 13 caracteres.");
      return;
    }
    if (!/^\d{4}$/.test(formEmp.contrasena)) {
      setErrorEmp("La contraseña debe ser de exactamente 4 dígitos numéricos.");
      return;
    }
    if (!formEmp.tarifaHora || Number(formEmp.tarifaHora) <= 0) {
      setErrorEmp("Escribe una tarifa por hora válida.");
      return;
    }
    setErrorEmp("");
    saveEmp([
      ...empleados,
      {
        id: uid(),
        nombre: formEmp.nombre.trim(),
        puesto: formEmp.puesto,
        rfc,
        contrasena: formEmp.contrasena,
        tarifaHora: Number(formEmp.tarifaHora),
      },
    ]);
    setFormEmp({ nombre: "", puesto: PUESTOS[0], rfc: "", contrasena: "", tarifaHora: "" });
  };

  const eliminarEmpleado = (id) => saveEmp(empleados.filter((e) => e.id !== id));

  const guardarNombre = () => {
    if (!nombre.trim()) {
      setError("Escribe un nombre para el restaurante.");
      return;
    }
    setError("");
    saveConfig({ ...config, nombre: nombre.trim() });
  };

  const subirLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen.");
      return;
    }
    setError("");
    const reader = new FileReader();
    reader.onload = () => saveConfig({ ...config, logo: reader.result });
    reader.readAsDataURL(file);
  };

  const quitarLogo = () => saveConfig({ ...config, logo: null });

  const cancelarSuscripcion = () => saveSuscripcion({ status: "canceled", desde: suscripcion.desde });

  return (
    <div>
      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Cuenta</p>
        <p style={{ fontSize: 14, margin: "0 0 2px" }}>{sesion?.nombre || "—"}</p>
        <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 12px" }}>{sesion?.correo || "—"}</p>
        <button onClick={onCerrarSesion} style={{ width: "100%", fontSize: 13 }}>Cerrar sesión</button>
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Suscripción</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 14, margin: 0 }}>Plan mensual — $250 MXN</p>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "2px 0 0" }}>Activa desde {suscripcion.desde || "—"}</p>
          </div>
          <span style={{ fontSize: 12, background: "#EAF3DE", color: "#27500A", padding: "3px 10px", borderRadius: 999, fontWeight: 500 }}>Activa</span>
        </div>
        <button onClick={cancelarSuscripcion} style={{ width: "100%", fontSize: 13 }}>Cancelar suscripción</button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
          En producción, esto abre el portal de cliente de Stripe (cancelar, cambiar tarjeta, ver recibos).
        </p>
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Logo del restaurante</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {config.logo ? (
            <img src={config.logo} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", border: "0.5px solid var(--border)" }} />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: 12, background: accent.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="ti ti-photo" style={{ fontSize: 22, color: accent.icon }} aria-hidden="true" />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, padding: "6px 12px", borderRadius: "var(--radius)", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, cursor: "pointer", textAlign: "center" }}>
              {config.logo ? "Cambiar logo" : "Subir logo"}
              <input type="file" accept="image/*" onChange={subirLogo} style={{ display: "none" }} />
            </label>
            {config.logo && (
              <button onClick={quitarLogo} style={{ fontSize: 13, padding: "6px 12px" }}>Quitar logo</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem" }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Nombre del restaurante</p>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej. Mi restaurante"
          style={{ width: "100%", marginBottom: 8 }}
        />
        {error && <p style={{ fontSize: 13, color: "var(--text-danger)", margin: "0 0 8px" }}>{error}</p>}
        <button onClick={guardarNombre} style={{ width: "100%", background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
          Guardar nombre ↗
        </button>
      </div>

      <div style={{ background: "var(--surface-2)", border: "0.5px solid var(--border)", borderRadius: 14, padding: "1rem", marginTop: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px" }}>Empleados ({empleados.length})</p>
        {empleados.length === 0 ? (
          <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 10px" }}>Aún no has dado de alta empleados.</p>
        ) : (
          empleados.map((e) => (
            <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--border)" }}>
              <div>
                <div style={{ fontSize: 14 }}>{e.nombre}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{e.puesto} · RFC {e.rfc || "—"} · {money(e.tarifaHora)}/hr</div>
              </div>
              <i className="ti ti-trash" style={{ fontSize: 16, cursor: "pointer", color: "var(--text-danger)" }} onClick={() => eliminarEmpleado(e.id)} aria-hidden="true" />
            </div>
          ))
        )}

        <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: "16px 0 8px" }}>Dar de alta empleado</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            placeholder="Nombre del empleado"
            value={formEmp.nombre}
            onChange={(e) => setFormEmp({ ...formEmp, nombre: e.target.value })}
          />
          <select value={formEmp.puesto} onChange={(e) => setFormEmp({ ...formEmp, puesto: e.target.value })}>
            {PUESTOS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input
            placeholder="RFC"
            value={formEmp.rfc}
            maxLength={13}
            onChange={(e) => setFormEmp({ ...formEmp, rfc: e.target.value.toUpperCase() })}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 8 }}>
            <input
              type="password"
              inputMode="numeric"
              placeholder="Contraseña (4 dígitos)"
              value={formEmp.contrasena}
              maxLength={4}
              onChange={(e) => setFormEmp({ ...formEmp, contrasena: e.target.value.replace(/\D/g, "") })}
            />
            <input
              type="number"
              placeholder="Tarifa por hora"
              value={formEmp.tarifaHora}
              onChange={(e) => setFormEmp({ ...formEmp, tarifaHora: e.target.value })}
            />
          </div>
          {errorEmp && <p style={{ fontSize: 13, color: "var(--text-danger)", margin: 0 }}>{errorEmp}</p>}
          <button onClick={altaEmpleado} style={{ background: accent.solid, color: "#fff", border: `0.5px solid ${accent.solid}`, borderRadius: 10 }}>
            Dar de alta ↗
          </button>
        </div>
      </div>
    </div>
  );
}
